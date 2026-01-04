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

    // Load KB - Try multiple possible paths for serverless environment
    const kbPaths = [
        join(process.cwd(), 'knowledge', 'kb.entries.json'),
        join(process.cwd(), '..', 'knowledge', 'kb.entries.json'),
        join(__dirname, '..', '..', 'knowledge', 'kb.entries.json'),
        join(__dirname, 'knowledge', 'kb.entries.json'), // Often for bundled functions
        '/var/task/knowledge/kb.entries.json' // Absolute path in some serverless environments
    ];

    let foundKb = false;
    for (const path of kbPaths) {
        if (existsSync(path)) {
            try {
                const raw = readFileSync(path, 'utf-8');
                console.log('Parsing JSON source', {
                    source: 'kb',
                    path: path,
                    length: raw.length,
                    preview: raw.slice(0, 100)
                });
                kb = JSON.parse(raw);
                foundKb = true;
                console.log(`Successfully loaded ${kb.entries?.length || 0} KB entries`);
                break;
            } catch (err) {
                console.error('Failed to parse KB JSON file', {
                    path,
                    error: err
                });
                throw new Error(`Invalid JSON in ${path}: ${(err as Error).message}`);
            }
        }
    }

    if (!foundKb) {
        // Fallback or detailed error
        throw new Error(`Knowledge base not found. Checked: ${kbPaths.join(', ')}`);
    }

    // Load precomputed embeddings from build-time artifact
    const embeddingPaths = [
        join(process.cwd(), 'knowledge', 'embeddings.json'),
        join(process.cwd(), '..', 'knowledge', 'embeddings.json'),
        join(__dirname, '..', '..', 'knowledge', 'embeddings.json'),
        join(__dirname, 'knowledge', 'embeddings.json'),
        '/var/task/knowledge/embeddings.json'
    ];

    let foundEmbeddings = false;
    for (const path of embeddingPaths) {
        if (existsSync(path)) {
            try {
                const fileContent = readFileSync(path, 'utf-8');
                console.log('Parsing JSON source', {
                    source: 'embeddings',
                    path: path,
                    length: fileContent.length,
                    preview: fileContent.slice(0, 100)
                });
                const embeddingData = JSON.parse(fileContent);
                embeddingCache = embeddingData.embeddings || {};
                foundEmbeddings = true;
                console.log(`Successfully loaded ${Object.keys(embeddingCache).length} embeddings`);
                break;
            } catch (error) {
                console.error('Failed to parse embeddings JSON file', {
                    path,
                    error: error
                });
                throw new Error(`Invalid JSON in ${path}: ${(error as Error).message}`);
            }
        }
    }

    if (!foundEmbeddings) {
        throw new Error('Precomputed embeddings not found. Run `npm run build:embeddings` first.');
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
function calculateSimilarity(queryEmbedding: number[], entryTexts: Array<{ text: string; taskType: string }>): number {
    let maxSimilarity = 0;

    for (const { text, taskType } of entryTexts) {
        const cacheKey = `${taskType}::${text}`;
        const entryEmbedding = embeddingCache[cacheKey];

        // Skip if embedding not found
        if (!entryEmbedding) {
            continue;
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

    // Generate query embedding ONCE
    const queryEmbedding = await generateEmbedding(query, 'RETRIEVAL_QUERY');

    let bestMatch: { entry: KBEntry; score: number } | null = null;
    let secondBestScore = 0;

    for (const entry of kb.entries) {
        // Build text array with task types
        const textsToCheck = [
            ...entry.questionVariants.map(text => ({ text, taskType: 'RETRIEVAL_QUERY' })),
            { text: entry.searchText, taskType: 'RETRIEVAL_DOCUMENT' },
            { text: entry.title, taskType: 'RETRIEVAL_DOCUMENT' }
        ];

        const score = calculateSimilarity(queryEmbedding, textsToCheck);


        if (score > (bestMatch?.score || 0)) {
            secondBestScore = bestMatch?.score || 0;
            bestMatch = { entry, score };
        } else if (score > secondBestScore) {
            secondBestScore = score;
        }
    }

    if (!bestMatch) {
        console.log("Similarity decision: No match found");
        return { matched: false };
    }

    const effectiveMin = bestMatch.entry.confidence?.minimumSimilarity ?? MINIMUM_SIMILARITY;

    console.log("Similarity decision", {
        id: bestMatch.entry.id,
        score: bestMatch.score,
        effectiveMin,
        globalMin: MINIMUM_SIMILARITY
    });

    if (bestMatch.score < effectiveMin) {
        return { matched: false };
    }

    const scoreGap = bestMatch.score - secondBestScore;
    if (scoreGap < 0.1 && secondBestScore >= effectiveMin) {
        console.log("Ambiguity check failed", {
            bestId: bestMatch.entry.id,
            bestScore: bestMatch.score,
            secondBestScore,
            gap: scoreGap
        });
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
    // MUST BE FIRST: Log every invocation for observability
    console.log("chat-retrieve invoked", {
        method: event.httpMethod,
        path: event.path,
        hasBody: !!event.body,
        contentType: event.headers["content-type"] || event.headers["Content-Type"],
    });

    try {
        // Health check endpoint (GET only, no auth required)
        if (event.httpMethod === 'GET') {
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ok: true,
                    service: 'chat-retrieve',
                    mode: 'healthcheck'
                })
            };
        }

        // Explicit POST gate with structured error
        if (event.httpMethod !== 'POST') {
            console.warn(`chat-retrieve refused: method ${event.httpMethod} not allowed`);
            return {
                statusCode: 405,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'refuse',
                    reason: 'method_not_allowed'
                })
            };
        }

        // Body validation with logging
        if (!event.body) {
            console.warn('chat-retrieve refused: missing body');
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'refuse',
                    reason: 'missing_body'
                })
            };
        }

        // Parse body with defensive parsing
        let body: any = null;
        try {
            console.log('Parsing JSON source', {
                source: 'event.body',
                length: event.body?.length,
                preview: event.body?.slice(0, 100)
            });
            body = typeof event.body === 'string'
                ? JSON.parse(event.body)
                : event.body;
        } catch (err) {
            console.error('Invalid JSON body', {
                body: event.body,
                error: err
            });
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'refuse',
                    reason: 'invalid_json_body'
                })
            };
        }

        const question = body.question;

        // Validate question
        if (!question || typeof question !== 'string' || question.trim().length === 0) {
            console.warn('chat-retrieve refused: invalid or empty question');
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'refuse',
                    reason: 'invalid_question'
                })
            };
        }

        // Enforce length limit
        if (question.length > MAX_QUESTION_LENGTH) {
            console.warn(`chat-retrieve refused: question too long (${question.length} > ${MAX_QUESTION_LENGTH})`);
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'refuse',
                    reason: 'question_too_long'
                })
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
        // Log error for Netlify function logs
        console.error('Retrieval Error:', error);

        // Temporarily expose error for debugging production paths
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'refuse',
                debugError: (error as Error).message,
                debugStack: (error as Error).stack
            })
        };
    }
};
