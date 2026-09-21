#!/usr/bin/env tsx
/**
 * Model-Agnostic Article Copy Reviewer — Adversarial Emotional Punch & Direct Response Evaluation.
 *
 * Evaluates article copy against a rigorous 5-point Direct Response rubric:
 *   1. Sensory & Physical Grounding (20 pts)
 *   2. One-Person Ear & Conversational Intimacy (20 pts)
 *   3. Identity & Status Stakes (20 pts)
 *   4. Villain Legitimacy & Mechanism (20 pts)
 *   5. Fluff & Throat-Clearing Density (20 pts)
 *
 * Supports any backend:
 *   - Google Gemini API (native via @google/generative-ai)
 *   - OpenAI-compatible endpoints (OpenRouter, Nous Portal, Custom/Ollama/vLLM)
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { walkMdFiles } from './lib/article-utils.ts';

function loadEnvKeys(): Record<string, string> {
  const keys: Record<string, string> = {};
  const envPath = path.join(os.homedir(), '.hermes', '.env');
  if (fs.existsSync(envPath)) {
    try {
      const lines = fs.readFileSync(envPath, 'utf8').split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const idx = trimmed.indexOf('=');
          const k = trimmed.slice(0, idx).trim();
          const v = trimmed
            .slice(idx + 1)
            .trim()
            .replace(/^['"]|['"]$/g, '');
          keys[k] = v;
        }
      }
    } catch {}
  }
  return keys;
}

const SYSTEM_RUBRIC = `You are a ruthless direct-response copy chief in the tradition of Eugene Schwartz, Robert Collier, and Joe Sugarman.
Your job is to ADVERSARIALLY grade the provided article draft for true emotional punch, conversational intimacy, and persuasion rigor.

DO NOT be polite. DO NOT reward corporate melodrama or adjective stacking.

QUICK ANSWER BLOCK (frontmatter "quickAnswer", rendered above the body): if present, audit it as part of the draft. It must directly answer the article's core query, be self-contained (readable with zero article context), and state ONLY facts the body supports. If it asserts something the body never says, drifts from the body's numbers, or is vague filler, flag it in flagged_passages and score honestly — it is the article's most-read 80 words, not decoration.

Grade the draft strictly across these 5 dimensions (0 to 20 points each, 100 total):

1. SENSORY & PHYSICAL GROUNDING (0-20):
   - PASS (16-20): Grounded in physical reality. Specific sounds (the squeak of cheap tape, the counter chime), temperatures, clocks/times, physical items on a desk/counter, real driving routes.
   - FAIL (0-15): Relies on abstract emotional adjectives ("deeply stressful", "incredibly overwhelming", "profoundly frustrating") without physical evidence.

2. ONE-PERSON EAR & CONVERSATIONAL INTIMACY (0-20):
   - PASS (16-20): Reads like an intimate 1-on-1 letter or a quiet conversation across a counter from start to finish. Natural cadence, direct second-person singular ("you"). The close feels like a supportive human handoff across the counter.
   - FAIL (0-15): Sounds like a brochure, a lecture, or a corporate press release ("Residents of Kirtland Hills often experience...", "In today's fast-paced world...") or lapses into transactional sales catalog copy at the end.

3. IDENTITY STAKES & ANXIETY DISSOLUTION (0-20):
   - PASS (16-20): Exposes the deeper psychological tension (looking amateur, fear of carrier confrontation or judgment, dread of making a mistake) AND explicitly dissolves it in the final stages (success scene & CTA). The close must execute the 'Burden Transfer'—proving that the Mailbox Plus counter absorbs the friction, confusing rules, and anxiety so the customer doesn't have to carry them. The CTA must function as a 'permission slip' (reassuring the customer they don't need to apologize, pre-tape, or have everything figured out), leaving them feeling relieved and shielded.
   - FAIL (0-15): Treats the problem as a minor errand inconvenience or a 5-minute schedule delay OR exposes the dread early only to abandon the hero at the end with a flat brochure pitch ("We offer document printing at 7554 Fredle Drive, visit us today") without resolving their internal anxiety or transferring the burden.

4. VILLAIN LEGITIMACY & MECHANISM (0-20):
   - PASS (16-20): Names a concrete systemic mechanism (e.g. "The Return-Label Printout", "The Franchise Markup") and explains how it operates legally at the customer's expense, absolving the customer of personal incompetence.
   - FAIL (0-15): Blames the customer, frames it as vague bad luck, or writes generic complaints without naming the mechanism.

5. FLUFF & THROAT-CLEARING DENSITY (0-20):
   - PASS (16-20): Every sentence advances the argument. Direct lead opens fast without time-of-day cliches ("It's 9:00 AM on a rainy Tuesday..."). No corporate filler ("Whether you are...", "In conclusion...", "It goes without saying...").
   - FAIL (0-15): Contains preamble, repetitive filler paragraphs, or essay-style summaries.

OUTPUT REQUIREMENTS:
You MUST return ONLY a valid JSON object matching this schema (no surrounding markdown code fences, no extra text):
{
  "total_score": <int between 0 and 100>,
  "verdict": "<PASS if total_score >= 80 else FAIL>",
  "dimensions": {
    "sensory_grounding": {"score": <int 0-20>, "critique": "<specific evaluation>"},
    "one_person_ear": {"score": <int 0-20>, "critique": "<specific evaluation>"},
    "identity_stakes": {"score": <int 0-20>, "critique": "<specific evaluation>"},
    "villain_legitimacy": {"score": <int 0-20>, "critique": "<specific evaluation>"},
    "fluff_density": {"score": <int 0-20>, "critique": "<specific evaluation>"}
  },
  "flagged_passages": [
    {
      "quote": "<exact quote from text>",
      "dimension": "<dimension name>",
      "problem": "<why this is weak or fluffy>",
      "fix": "<how to rewrite with punch>"
    }
  ],
  "executive_summary": "<2-3 blunt sentences summarizing the draft's strengths and fatal weaknesses>"
}`;

function getNousToken(): string | null {
  const authPaths = [
    path.join(os.homedir(), '.hermes', 'auth.json'),
    path.join(os.homedir(), '.hermes', 'profiles', 'article-writer', 'auth.json'),
    path.join(os.homedir(), '.hermes', 'profiles', 'default', 'auth.json'),
  ];
  for (const authPath of authPaths) {
    if (fs.existsSync(authPath)) {
      try {
        const d = JSON.parse(fs.readFileSync(authPath, 'utf8'));
        const pool = d?.credential_pool?.nous;
        if (Array.isArray(pool) && pool[0]?.access_token) {
          return pool[0].access_token;
        }
      } catch {}
    }
  }

  if (process.env.MODEL_API_KEY) return process.env.MODEL_API_KEY;
  const envKeys = loadEnvKeys();
  if (envKeys.MODEL_API_KEY) return envKeys.MODEL_API_KEY;

  return null;
}

async function callOpenAICompatible(
  baseUrl: string,
  apiKey: string,
  model: string,
  promptText: string,
  extraHeaders?: Record<string, string>
): Promise<string> {
  const url = `${baseUrl.replace(/\/+$/, '')}/chat/completions`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
    'User-Agent': 'MailboxPlusArticleReviewer/1.0',
    ...extraHeaders,
  };

  const payload = {
    model,
    messages: [
      { role: 'system', content: SYSTEM_RUBRIC },
      { role: 'user', content: `Here is the article draft to evaluate:\n\n${promptText}` },
    ],
    temperature: 0.1,
  };

  const resp = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`HTTP ${resp.status} ${resp.statusText}: ${errText}`);
  }

  const res: any = await resp.json();
  return res.choices[0].message.content;
}

async function callGemini(apiKey: string, model: string, promptText: string): Promise<string> {
  let cleanModel = model.replace(/^google\//, '').replace(/^gemini\//, '');
  if (!cleanModel.startsWith('gemini')) {
    cleanModel = 'gemini-2.5-flash';
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const modelInstance = genAI.getGenerativeModel({
    model: cleanModel,
    generationConfig: {
      temperature: 0.1,
      responseMimeType: 'application/json',
    },
  });

  const fullPrompt = `${SYSTEM_RUBRIC}\n\nHere is the article draft to evaluate:\n\n${promptText}`;
  const result = await modelInstance.generateContent(fullPrompt);
  return result.response.text();
}

export interface ReviewOptions {
  model?: string;
  provider?: 'gemini' | 'openrouter' | 'nous' | 'custom';
  baseUrl?: string;
  apiKey?: string;
}

export async function evaluateArticle(content: string, options: ReviewOptions = {}): Promise<any> {
  const envKeys = loadEnvKeys();
  const model = options.model || 'gemini-2.5-flash';
  let provider = options.provider;

  if (!provider) {
    if (options.baseUrl) {
      provider = 'custom';
    } else if (model.toLowerCase().includes('gemini') && !model.startsWith('openrouter/')) {
      provider = 'gemini';
    } else if (model.toLowerCase().includes('tencent') || model.toLowerCase().includes('claude')) {
      provider = 'openrouter';
    } else if (model.toLowerCase().includes('glm')) {
      provider = 'nous';
    } else {
      provider = 'gemini';
    }
  }

  let rawResponse = '';
  if (provider === 'gemini') {
    const key = options.apiKey || process.env.GEMINI_API_KEY || envKeys.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY not found in environment or ~/.hermes/.env');
    }
    rawResponse = await callGemini(key, model, content);
  } else if (provider === 'openrouter') {
    const key = options.apiKey || process.env.OPENROUTER_API_KEY || envKeys.OPENROUTER_API_KEY;
    if (!key) {
      throw new Error('OPENROUTER_API_KEY not found in environment or ~/.hermes/.env');
    }
    const headers = {
      'HTTP-Referer': 'https://mailboxplusohio.com',
      'X-Title': 'Mailbox Plus Copy Reviewer',
    };
    rawResponse = await callOpenAICompatible(
      'https://openrouter.ai/api/v1',
      key,
      model,
      content,
      headers
    );
  } else if (provider === 'nous') {
    const key = options.apiKey || getNousToken();
    if (!key) {
      throw new Error('Nous Portal token not found in auth.json, environment, or ~/.hermes/.env');
    }
    rawResponse = await callOpenAICompatible(
      'https://inference-api.nousresearch.com/v1',
      key,
      model,
      content
    );
  } else if (provider === 'custom') {
    if (!options.baseUrl) {
      throw new Error('--base-url is required when using provider="custom"');
    }
    const key = options.apiKey || 'sk-local';
    rawResponse = await callOpenAICompatible(options.baseUrl, key, model, content);
  } else {
    throw new Error(`Unknown provider: ${provider}`);
  }

  let cleaned = rawResponse.trim();
  if (cleaned.startsWith('```')) {
    const lines = cleaned.split('\n');
    if (lines[0].startsWith('```')) {
      lines.shift();
    }
    if (lines[lines.length - 1].trim() === '```') {
      lines.pop();
    }
    cleaned = lines.join('\n').trim();
  }

  return JSON.parse(cleaned);
}

function printReport(filePath: string, result: any, minScore = 80) {
  const score = result.total_score || 0;
  const verdict = score >= minScore ? 'PASS' : 'FAIL';
  const symbol = verdict === 'PASS' ? '✅' : '❌';

  console.log('\n' + '='.repeat(80));
  console.log(
    `${symbol} EVALUATION: ${path.basename(filePath)} — Score: ${score}/100 (${verdict})`
  );
  console.log('='.repeat(80));

  const dims = result.dimensions || {};
  for (const [dimName, dinfo] of Object.entries<any>(dims)) {
    const dimScore = dinfo?.score || 0;
    const dimCritique = dinfo?.critique || '';
    const bar = '█'.repeat(Math.floor(dimScore / 2)) + '░'.repeat(10 - Math.floor(dimScore / 2));
    console.log(`\n  • ${dimName.toUpperCase().padEnd(25)} [${bar}] ${dimScore}/20`);
    console.log(`    ${dimCritique}`);
  }

  console.log('\n--- EXECUTIVE SUMMARY ---');
  console.log(`  ${result.executive_summary || 'No summary provided.'}`);

  const flagged = result.flagged_passages || [];
  if (flagged.length > 0) {
    console.log(`\n--- FLAGGED WEAK PASSAGES (${flagged.length}) ---`);
    flagged.forEach((item: any, i: number) => {
      console.log(`\n  [${i + 1}] Dimension: ${item.dimension}`);
      console.log(`      Quote: "${item.quote}"`);
      console.log(`      Issue: ${item.problem}`);
      console.log(`      Fix:   ${item.fix}`);
    });
  }
  console.log('\n' + '='.repeat(80) + '\n');
}

function matchWildcardSegment(text: string, pattern: string): boolean {
  if (pattern === '*') return true;
  const parts = pattern.split('*');
  if (parts.length === 1) return text === pattern;

  if (!text.startsWith(parts[0])) return false;
  if (!text.endsWith(parts[parts.length - 1])) return false;

  let pos = parts[0].length;
  for (let i = 1; i < parts.length - 1; i++) {
    const part = parts[i];
    if (part === '') continue;
    const found = text.indexOf(part, pos);
    if (found === -1) return false;
    pos = found + part.length;
  }
  return pos <= text.length - parts[parts.length - 1].length;
}

function matchPathSegments(fileSegs: string[], patSegs: string[]): boolean {
  let fIndex = 0;
  let pIndex = 0;

  while (pIndex < patSegs.length && fIndex < fileSegs.length) {
    const p = patSegs[pIndex];
    if (p === '**') {
      if (pIndex === patSegs.length - 1) return true;
      for (let i = fIndex; i <= fileSegs.length; i++) {
        if (matchPathSegments(fileSegs.slice(i), patSegs.slice(pIndex + 1))) {
          return true;
        }
      }
      return false;
    }

    if (!matchWildcardSegment(fileSegs[fIndex], p)) {
      return false;
    }

    fIndex++;
    pIndex++;
  }

  while (pIndex < patSegs.length && patSegs[pIndex] === '**') {
    pIndex++;
  }

  return fIndex === fileSegs.length && pIndex === patSegs.length;
}

function globMatch(filePath: string, pattern: string): boolean {
  const fileSegs = filePath
    .replace(/\\/g, '/')
    .split('/')
    .filter((s) => s && s !== '.');
  const patSegs = pattern
    .replace(/\\/g, '/')
    .split('/')
    .filter((s) => s && s !== '.');
  return matchPathSegments(fileSegs, patSegs);
}

function resolveFiles(target: string): string[] {
  if (fs.existsSync(target) && fs.statSync(target).isFile()) {
    return [target];
  }

  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
    return walkMdFiles(target);
  }

  // Handle glob pattern matching or dir searching
  if (target.includes('*')) {
    const baseDir = target.split('*')[0] || '.';
    const searchDir = fs.existsSync(baseDir)
      ? fs.statSync(baseDir).isDirectory()
        ? baseDir
        : path.dirname(baseDir)
      : '.';
    const allMd = walkMdFiles(searchDir);

    return allMd.filter((f) => globMatch(f, target));
  }

  return [];
}

async function main() {
  const args = process.argv.slice(2);
  let target = '';
  let model = 'gemini-2.5-flash';
  let provider: ReviewOptions['provider'];
  let baseUrl: string | undefined;
  let apiKey: string | undefined;
  let minScore = 80;
  let asJson = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--model' && args[i + 1]) {
      model = args[++i];
    } else if (arg === '--provider' && args[i + 1]) {
      provider = args[++i] as any;
    } else if (arg === '--base-url' && args[i + 1]) {
      baseUrl = args[++i];
    } else if (arg === '--api-key' && args[i + 1]) {
      apiKey = args[++i];
    } else if (arg === '--min-score' && args[i + 1]) {
      minScore = parseInt(args[++i], 10);
    } else if (arg === '--json') {
      asJson = true;
    } else if (!arg.startsWith('--') && !target) {
      target = arg;
    }
  }

  if (!target) {
    console.log(
      'Usage: npx tsx scripts/review-article-copy.ts <target> [--model <model>] [--provider <provider>] [--base-url <url>] [--api-key <key>] [--min-score <score>] [--json]'
    );
    process.exit(1);
  }

  const files = resolveFiles(target);
  if (files.length === 0) {
    console.log(`No markdown files found matching: ${target}`);
    process.exit(1);
  }

  let overallFailed = false;
  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf8');

    try {
      const result = await evaluateArticle(content, {
        model,
        provider,
        baseUrl,
        apiKey,
      });
      result.file_path = filePath;

      if ((result.total_score || 0) < minScore) {
        overallFailed = true;
      }

      if (asJson) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        printReport(filePath, result, minScore);
      }
    } catch (e: any) {
      console.error(`❌ Error reviewing ${filePath}: ${e.message}`);
      overallFailed = true;
    }
  }

  process.exit(overallFailed ? 1 : 0);
}

// Note: import.meta.url comparison can be fragile under tsx on some platforms/environments,
// so process.argv[1]?.endsWith('review-article-copy.ts') serves as a robust fallback check.
if (
  import.meta.url === `file://${process.argv[1]}` ||
  process.argv[1]?.endsWith('review-article-copy.ts')
) {
  main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}
