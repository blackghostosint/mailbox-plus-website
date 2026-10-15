#!/usr/bin/env tsx
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';
import { EMBEDDING_MODEL, FALLBACK_RESPONSE } from '../knowledge/retrieval-core.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const KB_PATH = path.resolve(ROOT, 'knowledge/kb.entries.json');
const META_PATH = path.resolve(ROOT, 'knowledge/kb.meta.json');

export const SourceSchema = z.strictObject({
  type: z.string().min(1, 'Source type is required'),
  url: z.string().url('Source URL must be a valid URL'),
  lastVerified: z.string().min(1, 'Source lastVerified date is required'),
});

export const ConfidenceSchema = z.strictObject({
  minimumSimilarity: z
    .number()
    .min(0, 'minimumSimilarity must be >= 0')
    .max(1, 'minimumSimilarity must be <= 1'),
  requiresExactMatch: z.boolean(),
});

export const ConstraintsSchema = z.strictObject({
  requiresHuman: z.boolean(),
  disallowedFollowups: z.array(z.string()),
});

export const EscalationSchema = z.strictObject({
  enabled: z.boolean(),
  message: z.string(),
});

export const KBEntrySchema = z.strictObject({
  id: z.string().min(1, 'Entry ID is required'),
  intent: z.string().min(1, 'Intent is required'),
  title: z.string().min(1, 'Title is required'),
  questionVariants: z
    .array(z.string().min(1, 'Question variant cannot be empty'))
    .min(1, 'At least one question variant is required'),
  answer: z.string().min(1, 'Answer is required'),
  confidence: ConfidenceSchema,
  sources: z.array(SourceSchema),
  constraints: ConstraintsSchema,
  escalation: EscalationSchema,
  tags: z.array(z.string()),
  searchText: z.string().min(1, 'SearchText is required'),
});

export const KBSchema = z.strictObject({
  entries: z.array(KBEntrySchema).min(1, 'Knowledge base must contain at least one entry'),
});

export const KBMetaSchema = z.strictObject({
  site: z
    .string()
    .min(1, 'Site is required')
    .refine((val) => !val.includes('PLACEHOLDER'), 'Site cannot be a placeholder'),
  lastBuiltAt: z
    .string()
    .min(1, 'lastBuiltAt is required')
    .refine(
      (val) => !val.includes('PLACEHOLDER') && !isNaN(Date.parse(val)),
      'lastBuiltAt must be a valid ISO 8601 date string'
    ),
  contentVersion: z
    .string()
    .min(1, 'contentVersion is required')
    .refine((val) => !val.includes('PLACEHOLDER'), 'contentVersion cannot be a placeholder'),
  embeddingModel: z
    .string()
    .min(1, 'embeddingModel is required')
    .refine((val) => !val.includes('PLACEHOLDER'), 'embeddingModel cannot be a placeholder'),
  allowedIntents: z
    .array(z.string().min(1, 'Intent cannot be empty'))
    .min(1, 'At least one allowed intent is required'),
  fallbackResponse: z
    .string()
    .min(1, 'fallbackResponse is required')
    .refine((val) => !val.includes('PLACEHOLDER'), 'fallbackResponse cannot be a placeholder'),
});

export type KBEntryInput = z.infer<typeof KBEntrySchema>;
export type KBInput = z.infer<typeof KBSchema>;
export type KBMetaInput = z.infer<typeof KBMetaSchema>;

export interface KBValidationResult {
  success: boolean;
  errors: string[];
  entryCount: number;
}

export function validateKb(filePath: string = KB_PATH, metaPath?: string): KBValidationResult {
  const errors: string[] = [];
  let entryCount = 0;

  if (!fs.existsSync(filePath)) {
    errors.push(`❌ KB file not found at: ${filePath}`);
  } else {
    let rawData: unknown;
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      rawData = JSON.parse(fileContent);
    } catch (err: any) {
      errors.push(`❌ Invalid JSON syntax in KB file: ${err.message}`);
    }

    if (rawData !== undefined) {
      const parseResult = KBSchema.safeParse(rawData);

      if (!parseResult.success) {
        for (const issue of parseResult.error.issues) {
          const issuePath = issue.path.join('.');
          errors.push(`❌ Schema Error at [${issuePath || 'root'}]: ${issue.message}`);
        }
        entryCount = Array.isArray((rawData as any)?.entries) ? (rawData as any).entries.length : 0;
      } else {
        const kbData = parseResult.data;
        entryCount = kbData.entries.length;

        // Additional integrity checks
        const seenIds = new Set<string>();
        kbData.entries.forEach((entry, index) => {
          if (seenIds.has(entry.id)) {
            errors.push(`❌ Duplicate entry ID '${entry.id}' found at index ${index}`);
          } else {
            seenIds.add(entry.id);
          }
        });
      }
    }
  }

  // Resolve metadata manifest file path
  let targetMetaPath = metaPath;
  if (!targetMetaPath) {
    if (filePath === KB_PATH) {
      targetMetaPath = META_PATH;
    } else {
      const dir = path.dirname(filePath);
      const candidate = path.join(dir, 'kb.meta.json');
      if (fs.existsSync(candidate)) {
        targetMetaPath = candidate;
      } else {
        targetMetaPath = META_PATH;
      }
    }
  }

  if (!fs.existsSync(targetMetaPath)) {
    errors.push(`❌ KB meta file not found at: ${targetMetaPath}`);
  } else {
    let rawMeta: unknown;
    try {
      const metaContent = fs.readFileSync(targetMetaPath, 'utf-8');
      rawMeta = JSON.parse(metaContent);
    } catch (err: any) {
      errors.push(`❌ Invalid JSON syntax in KB meta file: ${err.message}`);
    }

    if (rawMeta !== undefined) {
      const metaParseResult = KBMetaSchema.safeParse(rawMeta);

      if (!metaParseResult.success) {
        for (const issue of metaParseResult.error.issues) {
          const issuePath = issue.path.join('.');
          errors.push(`❌ Schema Error in meta [${issuePath || 'root'}]: ${issue.message}`);
        }
      } else {
        const metaData = metaParseResult.data;

        if (metaData.embeddingModel !== EMBEDDING_MODEL) {
          errors.push(
            `❌ Metadata embeddingModel '${metaData.embeddingModel}' does not match runtime EMBEDDING_MODEL '${EMBEDDING_MODEL}'`
          );
        }

        if (metaData.fallbackResponse !== FALLBACK_RESPONSE) {
          errors.push(
            `❌ Metadata fallbackResponse '${metaData.fallbackResponse}' does not match runtime FALLBACK_RESPONSE '${FALLBACK_RESPONSE}'`
          );
        }
      }
    }
  }

  return {
    success: errors.length === 0,
    errors,
    entryCount,
  };
}

export function runValidateKbCLI(): void {
  console.log(`🔍 Validating knowledge base dataset: ${KB_PATH}`);
  console.log(`🔍 Validating knowledge base metadata: ${META_PATH}`);

  const result = validateKb(KB_PATH, META_PATH);

  if (!result.success) {
    console.error('\n❌ Knowledge Base validation failed with errors:');
    result.errors.forEach((err) => console.error(`  ${err}`));
    console.error(`\nFailed after checking ${result.entryCount} entries.`);
    process.exit(1);
  } else {
    console.log(`\n✅ Knowledge Base dataset validated successfully!`);
    console.log(`✓ All ${result.entryCount} KB entries conform to KNOWLEDGE_SPEC.md rules.`);
    console.log(`✓ Knowledge base metadata manifest verified.`);
    process.exit(0);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runValidateKbCLI();
}
