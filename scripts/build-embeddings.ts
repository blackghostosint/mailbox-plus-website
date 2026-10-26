import { readFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { getWorkspaceRoot, atomicWriteJsonSync } from './lib/workspace-paths.ts';
import { isMainModule, parseScriptArgs } from './lib/cli-utils.ts';
import {
  buildCacheKey,
  EMBEDDING_MODEL,
  FALLBACK_RESPONSE,
  type KnowledgeBase,
} from '../knowledge/retrieval-core.js';
import { retrievalTests } from '../knowledge/retrieval-test-suite.js';

const ROOT = getWorkspaceRoot();

// Load environment variables for local script execution
dotenv.config();
dotenv.config({ path: join(ROOT, '.env.local') });

const KB_PATH = join(ROOT, 'knowledge', 'kb.entries.json');
const OUTPUT_PATH = join(ROOT, 'knowledge', 'embeddings.json');
const CACHE_PATH = join(ROOT, 'knowledge', '.embedding-cache.json');
const META_PATH = join(ROOT, 'knowledge', 'kb.meta.json');

export interface EmbeddingResult {
  metadata: {
    model: string;
    generatedAt: string;
  };
  embeddings: {
    [cacheKey: string]: number[];
  };
}

export interface TaskItem {
  taskType: 'RETRIEVAL_DOCUMENT' | 'RETRIEVAL_QUERY';
  entryId?: string;
}

export function extractUniqueTexts(
  kbData: KnowledgeBase,
  testCases: Array<{ query: string }> = retrievalTests
): Map<string, TaskItem> {
  const taskMap = new Map<string, TaskItem>();

  if (kbData?.entries) {
    for (const entry of kbData.entries) {
      if (entry.title) {
        taskMap.set(entry.title, { taskType: 'RETRIEVAL_DOCUMENT', entryId: entry.id });
      }
      if (entry.searchText) {
        taskMap.set(entry.searchText, { taskType: 'RETRIEVAL_DOCUMENT', entryId: entry.id });
      }
      if (entry.questionVariants) {
        for (const variant of entry.questionVariants) {
          taskMap.set(variant, { taskType: 'RETRIEVAL_QUERY', entryId: entry.id });
        }
      }
    }
  }

  if (testCases) {
    for (const testCase of testCases) {
      if (testCase?.query && !taskMap.has(testCase.query)) {
        taskMap.set(testCase.query, { taskType: 'RETRIEVAL_QUERY' });
      }
    }
  }

  return taskMap;
}

export interface GenerateEmbeddingsOptions {
  kb?: KnowledgeBase;
  testCases?: Array<{ query: string }>;
  genAIClient?: any;
  apiKey?: string;
  outputPath?: string;
  cachePath?: string;
  metaPath?: string;
  writeToDisk?: boolean;
  delayMs?: number;
}

export async function generateEmbeddings(
  options: GenerateEmbeddingsOptions = {}
): Promise<EmbeddingResult> {
  const {
    kb,
    testCases = retrievalTests,
    genAIClient,
    apiKey = process.env.GEMINI_API_KEY,
    outputPath,
    cachePath,
    metaPath,
    writeToDisk = false,
    delayMs = 0,
  } = options;

  if (!genAIClient && !apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set.');
  }

  let model: any;
  if (genAIClient) {
    model =
      typeof genAIClient.getGenerativeModel === 'function'
        ? genAIClient.getGenerativeModel({ model: EMBEDDING_MODEL })
        : genAIClient;
  } else {
    const genAI = new GoogleGenerativeAI(apiKey!);
    model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
  }

  const kbData: KnowledgeBase = kb || JSON.parse(readFileSync(KB_PATH, 'utf-8'));
  const taskMap = extractUniqueTexts(kbData, testCases);
  const uniqueTexts = Array.from(taskMap.keys());

  const result: EmbeddingResult = {
    metadata: {
      model: EMBEDDING_MODEL,
      generatedAt: new Date().toISOString(),
    },
    embeddings: {},
  };

  let _count = 0;
  for (const text of uniqueTexts) {
    _count++;
    const { taskType, entryId } = taskMap.get(text)!;
    const taskKey = buildCacheKey(taskType, text);

    try {
      const embeddingResponse = await model.embedContent({
        content: { role: 'user', parts: [{ text }] },
        taskType: taskType as any,
      });

      if (embeddingResponse && embeddingResponse.embedding && embeddingResponse.embedding.values) {
        const values = embeddingResponse.embedding.values;
        result.embeddings[taskKey] = values;
        result.embeddings[text] = values;
        if (entryId) {
          result.embeddings[buildCacheKey(entryId, text)] = values;
        }
      }
    } catch (error) {
      console.error(`Error embedding text: ${(error as Error).message}`);
    }

    if (delayMs > 0) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }

  if (writeToDisk) {
    const out = outputPath || OUTPUT_PATH;
    const cache = cachePath || CACHE_PATH;
    const meta = metaPath || META_PATH;
    atomicWriteJsonSync(out, result, 2);
    atomicWriteJsonSync(cache, result, 2);

    let existingMeta: Record<string, any> = {};
    if (existsSync(meta)) {
      try {
        existingMeta = JSON.parse(readFileSync(meta, 'utf-8'));
      } catch {
        // Fall back to empty object on JSON parse error
      }
    }

    let pkgVersion = '0.0.0';
    const pkgPath = join(ROOT, 'package.json');
    if (existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
        if (pkg.version) {
          pkgVersion = pkg.version;
        }
      } catch {
        // Fall back to 0.0.0 on error
      }
    }

    const updatedMeta = {
      site: existingMeta.site || 'mailboxplusohio.com',
      lastBuiltAt: new Date().toISOString(),
      contentVersion: pkgVersion,
      embeddingModel: EMBEDDING_MODEL,
      allowedIntents: existingMeta.allowedIntents || [
        'faq',
        'service_info',
        'micro_problem',
        'hours_location',
        'policies',
      ],
      fallbackResponse: FALLBACK_RESPONSE,
    };

    atomicWriteJsonSync(meta, updatedMeta, 2);
  }

  return result;
}

if (isMainModule(import.meta.url)) {
  parseScriptArgs({ allowPositionals: true, strict: false });
  generateEmbeddings({ writeToDisk: true, delayMs: 100 })
    .then(() => {
      console.log('--- Done! ---');
    })
    .catch((err) => {
      console.error('Fatal Error:', err);
      process.exit(1);
    });
}
