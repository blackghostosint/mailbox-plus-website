import { Handler, HandlerEvent } from '@netlify/functions';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ========================================
// Types
// ========================================

interface KBEntry {
    id: string;
    intent: string;
    title: string;
    questionVariants: string[];
    answer: string;
    searchText: string;
    confidence: {
        minimumSimilarity: number;
        requiresExactMatch: boolean;
    };
    sources: Array<{
        type: string;
        url: string;
        lastVerified: string;
    }>;
}

interface KnowledgeBase {
    entries: KBEntry[];
}

interface EmbeddingCache {
    [key: string]: number[];
}

interface RetrievalResult {
    matched: boolean;
    faqId?: string;
    answer?: string;
    sourceUrl?: string;
    confidence?: number;
}

interface ChatbotResponse {
    type: 'accept' | 'refuse';
    answer?: string;
    sourceUrl?: string;
    faqId?: string;
    confidence?: number;
}

// ========================================
// Constants
// ========================================

const MINIMUM_SIMILARITY = 0.78;
const MAX_QUESTION_LENGTH = 500;

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
    if (kb && genAI) {
        return; // Already initialized
    }

    // Load KB
    const kbPath = join(process.cwd(), 'knowledge', 'kb.entries.json');
    kb = JSON.parse(readFileSync(kbPath, 'utf-8'));

    // Load embedding cache
    const cachePath = join(process.cwd(), 'knowledge', '.embedding-cache.json');
    if (existsSync(cachePath)) {
        embeddingCache = JSON.parse(readFileSync(cachePath, 'utf-8'));
    }

    // Initialize Gemini
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY not configured');
    }
    genAI = new GoogleGenerativeAI(apiKey);
    embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });
}

// ========================================
// Core Functions
// ========================================

/**
 * Generate embedding for a single text using Gemini
 */
async function generateEmbedding(text: string, taskType: string = 'RETRIEVAL_DOCUMENT'): Promise<number[]> {
    if (!embeddingModel) {
        throw new Error('Embedding model not initialized');
    }

    const result = await embeddingModel.embedContent({
        content: { parts: [{ text }] },
        taskType
    });

    if (!result.embedding || !result.embedding.values) {
        throw new Error('Invalid embedding response from Gemini API');
    }

    return result.embedding.values;
}

/**
 * Calculate cosine similarity between two embedding vectors
 */
function cosineSimilarity(vec1: number[], vec2: number[]): number {
    if (vec1.length !== vec2.length) {
        throw new Error('Vectors must have the same length');
    }

    let dotProduct = 0;
    let mag1 = 0;
    let mag2 = 0;

    for (let i = 0; i < vec1.length; i++) {
        dotProduct += vec1[i] * vec2[i];
        mag1 += vec1[i] * vec1[i];
        mag2 += vec2[i] * vec2[i];
    }

    const magnitude = Math.sqrt(mag1) * Math.sqrt(mag2);
    if (magnitude === 0) return 0;

    return dotProduct / magnitude;
}

/**
 * Calculate semantic similarity using Gemini embeddings and cosine similarity
 */
async function calculateSimilarity(query: string, entryId: string, entryTexts: string[]): Promise<number> {
    const queryEmbedding = await generateEmbedding(query, 'RETRIEVAL_QUERY');

    let maxSimilarity = 0;

    for (const text of entryTexts) {
        const cacheKey = `${entryId}::${text}`;
        let entryEmbedding = embeddingCache[cacheKey];

        // Generate embedding on-the-fly if not cached
        if (!entryEmbedding) {
            entryEmbedding = await generateEmbedding(text, 'RETRIEVAL_DOCUMENT');
            embeddingCache[cacheKey] = entryEmbedding; // Cache for next request
        }

        const similarity = cosineSimilarity(queryEmbedding, entryEmbedding);
        maxSimilarity = Math.max(maxSimilarity, similarity);
    }

    return maxSimilarity;
}

/**
 * Retrieve answer for a given query
 */
async function retrieveAnswer(query: string): Promise<RetrievalResult> {
    if (!kb) {
        throw new Error('Knowledge base not initialized');
    }

    let bestMatch: { entry: KBEntry; score: number } | null = null;
    let secondBestScore = 0;

    for (const entry of kb.entries) {
        const textsToCheck = [
            ...entry.questionVariants,
            entry.searchText,
            entry.title
        ];

        const score = await calculateSimilarity(query, entry.id, textsToCheck);

        if (score > (bestMatch?.score || 0)) {
            secondBestScore = bestMatch?.score || 0;
            bestMatch = { entry, score };
        } else if (score > secondBestScore) {
            secondBestScore = score;
        }
    }

    if (!bestMatch || bestMatch.score < MINIMUM_SIMILARITY) {
        return { matched: false };
    }

    const scoreGap = bestMatch.score - secondBestScore;
    if (scoreGap < 0.1 && secondBestScore >= MINIMUM_SIMILARITY) {
        return { matched: false };
    }

    return {
        matched: true,
        faqId: bestMatch.entry.id,
        answer: bestMatch.entry.answer,
        sourceUrl: bestMatch.entry.sources[0]?.url,
        confidence: bestMatch.score
    };
}

// ========================================
// Handler
// ========================================

export const handler: Handler = async (event: HandlerEvent) => {
    try {
        // Only accept POST
        if (event.httpMethod !== 'POST') {
            return {
                statusCode: 405,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'refuse' })
            };
        }

        // Parse body
        const body = event.body ? JSON.parse(event.body) : {};
        const question = body.question;

        // Validate question
        if (!question || typeof question !== 'string' || question.trim().length === 0) {
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'refuse' })
            };
        }

        // Enforce length limit
        if (question.length > MAX_QUESTION_LENGTH) {
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'refuse' })
            };
        }

        // Initialize resources
        initializeResources();

        // Execute retrieval
        const result = await retrieveAnswer(question.trim());

        // Build response
        const response: ChatbotResponse = result.matched
            ? {
                type: 'accept',
                answer: result.answer!,
                sourceUrl: result.sourceUrl!,
                faqId: result.faqId!,
                confidence: result.confidence!
            }
            : {
                type: 'refuse'
            };

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response)
        };

    } catch (error) {
        // Never expose error details - always refuse
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'refuse' })
        };
    }
};
