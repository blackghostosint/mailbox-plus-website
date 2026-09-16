import { Handler, HandlerEvent } from '@netlify/functions';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import {
  EMBEDDING_MODEL,
  MINIMUM_SIMILARITY,
  MAX_QUESTION_LENGTH,
  retrieveAnswerCore,
  type KnowledgeBase,
  type EmbeddingCache,
} from '../../knowledge/retrieval-core.js';

dotenv.config();

// ========================================
// Global State (Loaded on Cold Start)
// ========================================

let kb: KnowledgeBase | null = null;
let embeddingCache: EmbeddingCache = {};
let genAI: GoogleGenerativeAI | null = null;
let embeddingModel: any = null;

/**
 * Initialize resources on cold start
 */
function initializeResources(): void {
  if (kb && genAI && Object.keys(embeddingCache || {}).length > 0) {
    return;
  }

  console.log('--- Initializing Retrieval Resources ---');

  // Load KB
  const kbPaths = [
    join(process.cwd(), 'knowledge', 'kb.entries.json'),
    join(process.cwd(), '..', 'knowledge', 'kb.entries.json'),
    join(__dirname, '..', '..', 'knowledge', 'kb.entries.json'),
    join(__dirname, 'knowledge', 'kb.entries.json'),
    '/var/task/knowledge/kb.entries.json',
  ];

  let foundKb = false;
  for (const path of kbPaths) {
    if (existsSync(path)) {
      try {
        const raw = readFileSync(path, 'utf-8');
        kb = JSON.parse(raw);
        foundKb = true;
        console.log(`Successfully loaded ${kb?.entries?.length || 0} KB entries from ${path}`);
        break;
      } catch (err) {
        console.error(`Failed to parse KB JSON at ${path}`, err);
      }
    }
  }

  if (!foundKb) {
    throw new Error(`Knowledge base not found. Paths checked: ${kbPaths.join(', ')}`);
  }

  // Load precomputed embeddings
  const embeddingPaths = [
    join(process.cwd(), 'knowledge', 'embeddings.json'),
    join(process.cwd(), '..', 'knowledge', 'embeddings.json'),
    join(__dirname, '..', '..', 'knowledge', 'embeddings.json'),
    join(__dirname, 'knowledge', 'embeddings.json'),
    '/var/task/knowledge/embeddings.json',
  ];

  let foundEmbeddings = false;
  for (const path of embeddingPaths) {
    if (existsSync(path)) {
      try {
        const fileContent = readFileSync(path, 'utf-8');
        const embeddingData = JSON.parse(fileContent);
        embeddingCache = embeddingData.embeddings || embeddingData;
        foundEmbeddings = true;
        console.log(
          `Successfully loaded ${Object.keys(embeddingCache).length} embeddings from ${path}`
        );
        break;
      } catch (error) {
        console.error(`Failed to parse embeddings JSON at ${path}`, error);
      }
    }
  }

  if (!foundEmbeddings) {
    // Fallback to local test cache if available
    const fallbackPaths = [
      join(process.cwd(), 'knowledge', '.embedding-cache.json'),
      join(process.cwd(), '..', 'knowledge', '.embedding-cache.json'),
      join(__dirname, '..', '..', 'knowledge', '.embedding-cache.json'),
      join(__dirname, 'knowledge', '.embedding-cache.json'),
    ];
    for (const path of fallbackPaths) {
      if (existsSync(path)) {
        try {
          const fileContent = readFileSync(path, 'utf-8');
          embeddingCache = JSON.parse(fileContent);
          foundEmbeddings = true;
          console.log(`Successfully loaded fallback embeddings from ${path}`);
          break;
        } catch (error) {
          console.error(`Failed to parse fallback embedding cache at ${path}`, error);
        }
      }
    }
  }

  if (!foundEmbeddings) {
    throw new Error('Precomputed embeddings not found. Ensure knowledge/embeddings.json exists.');
  }

  // Initialize Gemini API
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  genAI = new GoogleGenerativeAI(apiKey);
  embeddingModel = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
  console.log(`--- Retrieval Initialization Complete (${EMBEDDING_MODEL}) ---`);
}

/**
 * Generate embedding for user query
 */
async function generateQueryEmbedding(text: string): Promise<number[]> {
  if (!embeddingModel) {
    throw new Error('Embedding model not initialized');
  }

  const result = await embeddingModel.embedContent({
    content: { parts: [{ text }] },
    taskType: 'RETRIEVAL_QUERY',
  });

  if (!result.embedding || !result.embedding.values) {
    throw new Error('Invalid embedding response from Gemini API');
  }

  return result.embedding.values;
}

// ========================================
// Netlify Handler
// ========================================

export const handler: Handler = async (event: HandlerEvent) => {
  console.log('chat-retrieve invoked', {
    method: event.httpMethod,
    path: event.path,
    hasBody: !!event.body,
    contentType: event.headers['content-type'] || event.headers['Content-Type'],
  });

  try {
    // Health check endpoint (GET only, unauthenticated)
    if (event.httpMethod === 'GET') {
      initializeResources();
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'ok',
          timestamp: new Date().toISOString(),
        }),
      };
    }

    // HTTP POST enforcement
    if (event.httpMethod !== 'POST') {
      console.warn(`chat-retrieve refused: method ${event.httpMethod} not allowed`);
      return {
        statusCode: 405,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'refuse',
          reason: 'method_not_allowed',
        }),
      };
    }

    // Body validation
    if (!event.body) {
      console.warn('chat-retrieve refused: missing body');
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'refuse',
          reason: 'missing_body',
        }),
      };
    }

    let body: any = null;
    try {
      body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    } catch (err) {
      console.error('Invalid JSON body', err);
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'refuse',
          reason: 'invalid_json_body',
        }),
      };
    }

    const question = body.question;

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      console.warn('chat-retrieve refused: invalid or empty question');
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'refuse',
          reason: 'invalid_question',
        }),
      };
    }

    if (question.length > MAX_QUESTION_LENGTH) {
      console.warn(
        `chat-retrieve refused: question too long (${question.length} > ${MAX_QUESTION_LENGTH})`
      );
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'refuse',
          reason: 'question_too_long',
        }),
      };
    }

    initializeResources();

    if (!kb) {
      throw new Error('Knowledge base not loaded');
    }

    const queryEmbedding = await generateQueryEmbedding(question.trim());
    const result = retrieveAnswerCore(
      queryEmbedding,
      kb.entries,
      embeddingCache,
      MINIMUM_SIMILARITY
    );

    const response = result.matched
      ? {
          type: 'accept',
          answer: result.answer!,
          sourceUrl: result.sourceUrl!,
          faqId: result.faqId!,
          confidence: result.confidence!,
        }
      : {
          type: 'refuse',
        };

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('Retrieval Error:', error);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'refuse',
      }),
    };
  }
};
