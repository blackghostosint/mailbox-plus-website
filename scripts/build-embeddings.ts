import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { retrievalTests } from '../knowledge/retrieval-test-suite.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables for local script execution
dotenv.config();
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const KB_PATH = join(__dirname, '..', 'knowledge', 'kb.entries.json');
const OUTPUT_PATH = join(__dirname, '..', 'knowledge', '.embedding-cache.json');
const MODEL_NAME = 'text-embedding-004';

interface KBEntry {
  id: string;
  title: string;
  questionVariants: string[];
  searchText: string;
}

interface KnowledgeBase {
  entries: KBEntry[];
}

interface EmbeddingResult {
  metadata: {
    model: string;
    generatedAt: string;
  };
  embeddings: {
    [cacheKey: string]: number[];
  };
}

async function buildEmbeddings() {
  console.log('--- Starting Build-Time Embedding Generation ---');

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('Error: GEMINI_API_KEY environment variable is not set.');
    process.exit(1);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  // Load KB
  console.log(`Loading Knowledge Base from: ${KB_PATH}`);
  const kb: KnowledgeBase = JSON.parse(readFileSync(KB_PATH, 'utf-8'));

  const taskMap = new Map<string, { taskType: string; entryId?: string }>();

  // Extract strings and assign task types
  for (const entry of kb.entries) {
    taskMap.set(entry.title, { taskType: 'RETRIEVAL_DOCUMENT', entryId: entry.id });
    taskMap.set(entry.searchText, { taskType: 'RETRIEVAL_DOCUMENT', entryId: entry.id });

    for (const variant of entry.questionVariants) {
      taskMap.set(variant, { taskType: 'RETRIEVAL_QUERY', entryId: entry.id });
    }
  }

  // Also add benchmark test suite queries
  for (const testCase of retrievalTests) {
    if (!taskMap.has(testCase.query)) {
      taskMap.set(testCase.query, { taskType: 'RETRIEVAL_QUERY' });
    }
  }

  const uniqueTexts = Array.from(taskMap.keys());
  console.log(`Found ${uniqueTexts.length} unique strings to embed (KB entries + test cases).`);

  const result: EmbeddingResult = {
    metadata: {
      model: MODEL_NAME,
      generatedAt: new Date().toISOString(),
    },
    embeddings: {},
  };

  let count = 0;
  for (const text of uniqueTexts) {
    count++;
    const { taskType, entryId } = taskMap.get(text)!;
    const taskKey = `${taskType}::${text}`;

    try {
      process.stdout.write(
        `[${count}/${uniqueTexts.length}] Embedding: ${text.substring(0, 30)}... `
      );
      const embeddingResponse = await model.embedContent({
        content: { parts: [{ text }] },
        taskType,
      });

      if (embeddingResponse.embedding && embeddingResponse.embedding.values) {
        const values = embeddingResponse.embedding.values;
        result.embeddings[taskKey] = values;
        result.embeddings[text] = values;
        if (entryId) {
          result.embeddings[`${entryId}::${text}`] = values;
        }
        console.log('✅');
      } else {
        console.log('❌ (No values)');
      }
    } catch (error) {
      console.log(`❌ (${(error as Error).message})`);
    }

    // Delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log(`Saving results to: ${OUTPUT_PATH}`);
  writeFileSync(OUTPUT_PATH, JSON.stringify(result, null, 2));
  console.log('--- Done! ---');
}

buildEmbeddings().catch((err) => {
  console.error('Fatal Error:', err);
  process.exit(1);
});
