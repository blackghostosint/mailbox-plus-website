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
import {
  loadArticles,
  matchWildcardSegment,
  matchPathSegments,
  globMatch,
  resolveFiles,
} from './lib/article-utils.ts';

export { matchWildcardSegment, matchPathSegments, globMatch, resolveFiles };
import { httpClient } from '../astro/src/lib/http-client.ts';
import { isMainModule, parseScriptArgs } from './lib/cli-utils.ts';

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
    } catch {
      // Ignore missing or unparseable .env file
    }
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
  "verdict": "<PASS if total_score >= 82 else FAIL>",
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
      } catch {
        // Ignore missing or invalid auth credentials file
      }
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
  extraHeaders?: Record<string, string>,
  timeoutMs = 60000
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

  const res: any = await httpClient(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
    timeout: timeoutMs,
    maxRetries: 3,
    retryPost: true,
  });

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
  timeoutMs?: number;
}

export async function evaluateArticle(content: string, options: ReviewOptions = {}): Promise<any> {
  const envKeys = loadEnvKeys();
  const model = options.model || 'deepseek/deepseek-v4.1-flash';
  let provider = options.provider;

  if (!provider) {
    if (options.baseUrl) {
      provider = 'custom';
    } else if (model.toLowerCase().includes('gemini') && !model.startsWith('openrouter/')) {
      provider = 'gemini';
    } else if (model.toLowerCase().includes('tencent') || model.toLowerCase().includes('claude')) {
      provider = 'openrouter';
    } else if (
      model.toLowerCase().includes('glm') ||
      model.toLowerCase().includes('deepseek') ||
      model.toLowerCase().includes('kimi') ||
      model.toLowerCase().includes('moonshot')
    ) {
      provider = 'nous';
    } else {
      provider = 'gemini';
    }
  }

  // Print the resolved reviewer endpoint so a wrong-model gate can never run silently again.
  console.log(`🤖 reviewer: provider=${provider} model=${model}`);

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
      content,
      undefined,
      options.timeoutMs ?? 60000
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

function printReport(filePath: string, result: any, minScore = 82) {
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

async function main() {
  const { values, positionals } = parseScriptArgs({
    options: {
      model: { type: 'string', default: 'deepseek/deepseek-v4.1-flash' },
      provider: { type: 'string' },
      'base-url': { type: 'string' },
      'api-key': { type: 'string' },
      'min-score': { type: 'string', default: '82' },
      runs: { type: 'string', default: '3' },
      json: { type: 'boolean', default: false },
    },
    allowPositionals: true,
  });

  const target = positionals[0] || '';
  const model = values.model as string;
  const provider = values.provider as ReviewOptions['provider'];
  const baseUrl = values['base-url'] as string | undefined;
  const apiKey = values['api-key'] as string | undefined;
  const minScore = parseInt(values['min-score'] as string, 10) || 82;
  const asJson = Boolean(values.json);

  if (!target) {
    console.error(
      'Usage: npx tsx scripts/review-article-copy.ts <target> [--model <model>] [--provider <provider>] [--base-url <url>] [--api-key <key>] [--min-score <score>] [--json]'
    );
    process.exit(1);
  }

  const articles = loadArticles(target);
  if (articles.length === 0) {
    console.error(`No markdown files found matching: ${target}`);
    process.exit(1);
  }

  let overallFailed = false;
  // Median-of-3 (2026-10-29): a single LLM score is one noisy sample — the same
  // text has measured 56-96 across runs. The gate verdict is the MEDIAN of N
  // independent runs (default 3; --runs 1 restores single-shot for local dev).
  // Per-run scores ride in result.run_scores so drift stays measurable.
  const RUNS = Math.max(1, parseInt(values.runs as string, 10) || 3);
  for (const article of articles) {
    const filePath = article.filePath;
    const content = article.raw;

    try {
      let result = await evaluateArticle(content, {
        model,
        provider,
        baseUrl,
        apiKey,
      });
      result.file_path = filePath;

      if (RUNS > 1) {
        const runScores: number[] = [result.total_score || 0];
        const runResults: any[] = [result];
        for (let i = 1; i < RUNS; i++) {
          try {
            const r = await evaluateArticle(content, { model, provider, baseUrl, apiKey });
            runScores.push(r.total_score || 0);
            runResults.push(r);
          } catch (e: any) {
            console.error(
              `   ⚠️ Run ${i + 1}/${RUNS} failed (${e.message}); continuing with ${runScores.length} runs.`
            );
          }
        }
        const sorted = [...runScores].sort((a, b) => a - b);
        const median = sorted[Math.floor(sorted.length / 2)];
        const spread = sorted[sorted.length - 1] - sorted[0];
        console.log(
          `📊 ${RUNS}-run median: ${median}/100 (runs: ${runScores.join(', ')}, spread ${spread})`
        );
        // Keep the median-scored run's qualitative output; record all runs.
        const medianRun = runResults.find((r) => (r.total_score || 0) === median) || runResults[0];
        result = { ...medianRun, total_score: median, run_scores: runScores, run_spread: spread };
        result.file_path = filePath;
      }

      // Borderline escalation: flash-tier judges are score-inflating in the
      // 85-95 band (DeepSeek runs 10-12 pts above Grok's scale). One Kimi
      // K2.6 rescore is the final word — no loops, bounded cost (~$0.005).
      const ESCALATE_LO = 85;
      const ESCALATE_HI = 95;
      const ESCALATE_MODEL = 'moonshotai/kimi-k2.6';
      const baseModel = model;
      if (
        !model.includes('kimi') &&
        (result.total_score || 0) >= ESCALATE_LO &&
        (result.total_score || 0) <= ESCALATE_HI
      ) {
        console.log(
          `⚠️  Borderline score ${result.total_score || 0}/100 in [${ESCALATE_LO}-${ESCALATE_HI}] — escalating one rescore to ${ESCALATE_MODEL} (final word)...`
        );
        try {
          const rescore = await evaluateArticle(content, {
            model: ESCALATE_MODEL,
            provider: 'nous',
            apiKey,
            timeoutMs: 300000, // K2.6 is a reasoning model; 60s default times out
          });
          result.escalation = {
            base_model: baseModel,
            base_score: result.total_score,
            rescore_model: ESCALATE_MODEL,
            rescore_score: rescore.total_score,
          };
          result = { ...rescore, file_path: filePath, escalation: result.escalation };
          console.log(
            `   Rescore: ${rescore.total_score}/100 (K2.6 scale — advisory critiques; verdict rule below).`
          );
        } catch (e: any) {
          console.error(`   ⚠️ Rescore failed (${e.message}); keeping base score.`);
        }
      }

      // Verdict rule (2026-10-29, ruler-calibrated): the flash median is the
      // gate score — fresh runs are stable to ±2 pts. The K2.6 rescore runs a
      // ~15-20-pt-harsher scale and must NOT be compared to the flash threshold
      // (that mismatch failed good articles at "66" all day on 10/29). K2.6's
      // role: qualitative critiques + a hard-floor veto — a K2.6 score below
      // 60 on ITS scale indicates a defect class flash inflates past 85.
      const flashScore = result.escalation
        ? (result.escalation.base_score ?? result.total_score)
        : result.total_score || 0;
      const k26Score = result.escalation ? result.escalation.rescore_score : null;
      if (result.escalation && k26Score !== null && k26Score < 60) {
        result.total_score = Math.min(flashScore, k26Score + 20); // scale-adjusted
        result.verdict_note =
          'K2.6 hard-floor veto: rescore below 60 on the harsher K2.6 scale — treated as FAIL.';
        overallFailed = true;
        console.log(
          `   🚨 K2.6 hard-floor veto (${k26Score}/100 on K2.6 scale) — FAIL despite flash ${flashScore}.`
        );
      } else if (flashScore < minScore) {
        overallFailed = true;
      }
      if (result.escalation) result.gate_score = flashScore;

      // Review-score telemetry (2026-10-28): every evaluation appends one CSV
      // row so raw→final drift per slug is measurable. Location: the article
      // pipeline repo (versioned there), env-overridable for tests. Fail-open:
      // telemetry must never break the review gate.
      try {
        const logPath =
          process.env.REVIEW_SCORE_LOG || '/home/blackghost/work/batch_articles/review_scores.csv';
        const slug = path.basename(filePath).replace(/\.md$/, '');
        const words = content.split(/\s+/).filter(Boolean).length;
        const esc = result.escalation
          ? `base ${result.escalation.base_score}->${result.escalation.rescore_model} ${result.escalation.rescore_score}`
          : '';
        const row = [
          new Date().toISOString(),
          slug,
          result.total_score || 0,
          result.escalation ? result.escalation.rescore_model : model,
          words,
          esc,
          filePath,
        ]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(',');
        if (!fs.existsSync(logPath)) {
          fs.writeFileSync(
            logPath,
            'timestamp,slug,score,review_model,word_count,escalation,file_path\n'
          );
        }
        fs.appendFileSync(logPath, row + '\n');
      } catch (logErr: any) {
        console.error(`⚠️ review-score log write failed (non-fatal): ${logErr.message}`);
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

if (isMainModule(import.meta.url)) {
  main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}
