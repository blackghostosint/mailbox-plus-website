import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync } from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env files
dotenv.config({ path: join(__dirname, '..', '.env.local') });
dotenv.config({ path: join(__dirname, '..', '.env') });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY not found');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });

const kbPath = join(__dirname, 'kb.entries.json');
const kb = JSON.parse(readFileSync(kbPath, 'utf-8'));

const CACHE_FILE = join(__dirname, '.embedding-cache.json');
let embeddingCache = {};
if (existsSync(CACHE_FILE)) {
  embeddingCache = JSON.parse(readFileSync(CACHE_FILE, 'utf-8'));
}

const MINIMUM_SIMILARITY = 0.78;

async function generateEmbedding(
  text: string,
  taskType: string = 'RETRIEVAL_QUERY'
): Promise<number[]> {
  const result = await embeddingModel.embedContent({
    content: { parts: [{ text }] },
    taskType,
  });
  return result.embedding.values;
}

function cosineSimilarity(vec1: number[], vec2: number[]): number {
  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;
  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    mag1 += vec1[i] * vec1[i];
    mag2 += vec2[i] * vec2[i];
  }
  const magnitude = Math.sqrt(mag1) * Math.sqrt(mag2);
  return magnitude === 0 ? 0 : dotProduct / magnitude;
}

async function retrieveAnswer(query: string) {
  const queryEmbedding = await generateEmbedding(query, 'RETRIEVAL_QUERY');
  let bestMatch = null;
  let secondBestScore = 0;

  for (const entry of kb.entries) {
    const textsToCheck = [...entry.questionVariants, entry.searchText, entry.title];

    let maxEntryScore = 0;
    for (const text of textsToCheck) {
      const cacheKey = `${entry.id}::${text}`;
      const entryEmbedding = embeddingCache[cacheKey];
      if (!entryEmbedding) continue;
      const similarity = cosineSimilarity(queryEmbedding, entryEmbedding);
      maxEntryScore = Math.max(maxEntryScore, similarity);
    }

    if (maxEntryScore > (bestMatch?.score || 0)) {
      secondBestScore = bestMatch?.score || 0;
      bestMatch = { entry, score: maxEntryScore };
    } else if (maxEntryScore > secondBestScore) {
      secondBestScore = maxEntryScore;
    }
  }

  if (!bestMatch || bestMatch.score < MINIMUM_SIMILARITY) {
    return { matched: false, score: bestMatch?.score || 0 };
  }

  const scoreGap = bestMatch.score - secondBestScore;
  if (scoreGap < 0.1 && secondBestScore >= MINIMUM_SIMILARITY) {
    return { matched: false, score: bestMatch.score, ambiguous: true };
  }

  return { matched: true, faqId: bestMatch.entry.id, score: bestMatch.score };
}

const questions = [
  'Which shipping companies can I use there?',
  'Can you ship packages internationally?',
  'Do you provide tracking numbers after I ship?',
  'Do you offer shipping insurance?',
  'Can I return an Amazon package at your store?',
  'Do you pack fragile or breakable items?',
  'Can you print business cards for me?',
  'Do you print flyers or brochures?',
  'Can you design something before printing it?',
  'Do you print postcards for mailing?',
  'Can you help me print a document quickly?',
  'Can I use a mailbox for my business address?',
  'Do you scan documents for customers?',
  'Do you offer fax services?',
  'Can you shred documents securely?',
  'Do you offer digital fingerprinting?',
  'Can I get documents notarized there?',
  'Where is my package right now?',
  'How much does shipping usually cost?',
  'Which carrier should I use for fastest delivery?',
];

async function main() {
  console.log('Question | Actual | FAQ ID | Score');
  console.log('---|---|---|---');
  for (const q of questions) {
    const result = await retrieveAnswer(q);
    const actual = result.matched ? 'ACCEPT' : 'REFUSE';
    const faqId = result.faqId || '-';
    const score = result.score.toFixed(4);
    console.log(`${q} | ${actual} | ${faqId} | ${score}`);
  }
}

main().catch(console.error);
