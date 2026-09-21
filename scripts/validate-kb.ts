#!/usr/bin/env tsx
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const KB_PATH = path.resolve(ROOT, 'knowledge/kb.entries.json');

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

export type KBEntryInput = z.infer<typeof KBEntrySchema>;
export type KBInput = z.infer<typeof KBSchema>;

export interface KBValidationResult {
  success: boolean;
  errors: string[];
  entryCount: number;
}

export function validateKb(filePath: string = KB_PATH): KBValidationResult {
  const errors: string[] = [];

  if (!fs.existsSync(filePath)) {
    return {
      success: false,
      errors: [`❌ KB file not found at: ${filePath}`],
      entryCount: 0,
    };
  }

  let rawData: unknown;
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    rawData = JSON.parse(fileContent);
  } catch (err: any) {
    return {
      success: false,
      errors: [`❌ Invalid JSON syntax in KB file: ${err.message}`],
      entryCount: 0,
    };
  }

  const parseResult = KBSchema.safeParse(rawData);

  if (!parseResult.success) {
    for (const issue of parseResult.error.issues) {
      const issuePath = issue.path.join('.');
      errors.push(`❌ Schema Error at [${issuePath || 'root'}]: ${issue.message}`);
    }
    return {
      success: false,
      errors,
      entryCount: Array.isArray((rawData as any)?.entries) ? (rawData as any).entries.length : 0,
    };
  }

  const kbData = parseResult.data;
  const entryCount = kbData.entries.length;

  // Additional integrity checks
  const seenIds = new Set<string>();
  kbData.entries.forEach((entry, index) => {
    if (seenIds.has(entry.id)) {
      errors.push(`❌ Duplicate entry ID '${entry.id}' found at index ${index}`);
    } else {
      seenIds.add(entry.id);
    }
  });

  return {
    success: errors.length === 0,
    errors,
    entryCount,
  };
}

export function runValidateKbCLI(): void {
  console.log(`🔍 Validating knowledge base dataset: ${KB_PATH}`);

  const result = validateKb(KB_PATH);

  if (!result.success) {
    console.error('\n❌ Knowledge Base validation failed with errors:');
    result.errors.forEach((err) => console.error(`  ${err}`));
    console.error(`\nFailed after checking ${result.entryCount} entries.`);
    process.exit(1);
  } else {
    console.log(`\n✅ Knowledge Base dataset validated successfully!`);
    console.log(`✓ All ${result.entryCount} KB entries conform to KNOWLEDGE_SPEC.md rules.`);
    process.exit(0);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runValidateKbCLI();
}
