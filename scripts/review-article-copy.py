#!/usr/bin/env python3
"""
Model-Agnostic Article Copy Reviewer — Adversarial Emotional Punch & Direct Response Evaluation.

Evaluates article copy against a rigorous 5-point Direct Response rubric:
  1. Sensory & Physical Grounding (20 pts)
  2. One-Person Ear & Conversational Intimacy (20 pts)
  3. Identity & Status Stakes (20 pts)
  4. Villain Legitimacy & Mechanism (20 pts)
  5. Fluff & Throat-Clearing Density (20 pts)

Supports any backend:
  - OpenAI-compatible endpoints (OpenRouter, Nous Portal, Groq, Ollama, vLLM, LiteLLM)
  - Google Gemini API (native)
"""

import os
import sys
import json
import argparse
import glob
import re
import urllib.request
import urllib.error


def load_env_keys():
    keys = {}
    env_path = os.path.expanduser("~/.hermes/.env")
    if os.path.exists(env_path):
        with open(env_path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    keys[k.strip()] = v.strip().strip("\"'")
    return keys


SYSTEM_RUBRIC = """You are a ruthless direct-response copy chief in the tradition of Eugene Schwartz, Robert Collier, and Joe Sugarman.
Your job is to ADVERSARIALLY grade the provided article draft for true emotional punch, conversational intimacy, and persuasion rigor.

DO NOT be polite. DO NOT reward corporate melodrama or adjective stacking.

Grade the draft strictly across these 5 dimensions (0 to 20 points each, 100 total):

1. SENSORY & PHYSICAL GROUNDING (0-20):
   - PASS (16-20): Grounded in physical reality. Specific sounds (the squeak of cheap tape, the counter chime), temperatures, clocks/times, physical items on a desk/counter, real driving routes.
   - FAIL (0-15): Relies on abstract emotional adjectives ("deeply stressful", "incredibly overwhelming", "profoundly frustrating") without physical evidence.

2. ONE-PERSON EAR & CONVERSATIONAL INTIMACY (0-20):
   - PASS (16-20): Reads like an intimate 1-on-1 letter or a quiet conversation across a counter. Natural cadence, direct second-person singular ("you").
   - FAIL (0-15): Sounds like a brochure, a lecture, or a corporate press release ("Residents of Kirtland Hills often experience...", "In today's fast-paced world...").

3. IDENTITY & STATUS STAKES (0-20):
   - PASS (16-20): Exposes the deeper psychological tension (looking amateur running an Etsy shop from a kitchen table; dreading customer confrontation at the front door; family privacy exposed).
   - FAIL (0-15): Treats the problem as a minor errand inconvenience or a 5-minute schedule delay.

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
}
"""


def get_nous_token():
    # 1. Check live OAuth pool in auth.json first
    for auth_path in [
        os.path.expanduser("~/.hermes/auth.json"),
        os.path.expanduser("~/.hermes/profiles/article-writer/auth.json"),
        os.path.expanduser("~/.hermes/profiles/default/auth.json")
    ]:
        if os.path.exists(auth_path):
            try:
                with open(auth_path) as f:
                    d = json.load(f)
                pool = d.get("credential_pool", {}).get("nous", [])
                if pool and pool[0].get("access_token"):
                    return pool[0]["access_token"]
            except Exception:
                pass

    # 2. Fall back to environment variable or .env
    key = os.environ.get("MODEL_API_KEY")
    if key:
        return key
    env_keys = load_env_keys()
    if env_keys.get("MODEL_API_KEY"):
        return env_keys["MODEL_API_KEY"]

    return None


def call_openai_compatible(base_url, api_key, model, prompt_text, extra_headers=None):
    url = f"{base_url.rstrip('/')}/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) Chrome/126.0"
    }
    if extra_headers:
        headers.update(extra_headers)

    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": SYSTEM_RUBRIC},
            {"role": "user", "content": f"Here is the article draft to evaluate:\n\n{prompt_text}"}
        ],
        "temperature": 0.1
    }

    req = urllib.request.Request(url, data=json.dumps(payload).encode(), headers=headers)
    with urllib.request.urlopen(req, timeout=120) as resp:
        res = json.loads(resp.read().decode())
        return res["choices"][0]["message"]["content"]


def call_gemini(api_key, model, prompt_text):
    clean_model = model.replace("google/", "").replace("gemini/", "")
    if not clean_model.startswith("gemini"):
        clean_model = "gemini-2.5-flash"
        
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{clean_model}:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}
    
    full_prompt = f"{SYSTEM_RUBRIC}\n\nHere is the article draft to evaluate:\n\n{prompt_text}"
    payload = {
        "contents": [{"parts": [{"text": full_prompt}]}],
        "generationConfig": {
            "temperature": 0.1,
            "responseMimeType": "application/json"
        }
    }
    
    req = urllib.request.Request(url, data=json.dumps(payload).encode(), headers=headers)
    with urllib.request.urlopen(req, timeout=120) as resp:
        res = json.loads(resp.read().decode())
        return res["candidates"][0]["content"]["parts"][0]["text"]


def evaluate_article(content, model="gemini-2.5-flash", provider=None, base_url=None, api_key=None):
    env_keys = load_env_keys()
    
    # Auto-detect provider if not specified
    if not provider:
        if base_url:
            provider = "custom"
        elif "gemini" in model.lower() and not model.startswith("openrouter/"):
            provider = "gemini"
        elif "tencent" in model.lower() or "claude" in model.lower():
            provider = "openrouter"
        elif "glm" in model.lower():
            provider = "nous"
        else:
            provider = "gemini"

    # Resolve endpoint and key
    raw_response = None
    if provider == "gemini":
        key = api_key or os.environ.get("GEMINI_API_KEY") or env_keys.get("GEMINI_API_KEY")
        if not key:
            raise ValueError("GEMINI_API_KEY not found in environment or ~/.hermes/.env")
        raw_response = call_gemini(key, model, content)
        
    elif provider == "openrouter":
        key = api_key or os.environ.get("OPENROUTER_API_KEY") or env_keys.get("OPENROUTER_API_KEY")
        if not key:
            raise ValueError("OPENROUTER_API_KEY not found in environment or ~/.hermes/.env")
        headers = {
            "HTTP-Referer": "https://mailboxplusohio.com",
            "X-Title": "Mailbox Plus Copy Reviewer"
        }
        raw_response = call_openai_compatible("https://openrouter.ai/api/v1", key, model, content, headers)
        
    elif provider == "nous":
        key = api_key or get_nous_token()
        if not key:
            raise ValueError("Nous Portal token not found in auth.json, environment, or ~/.hermes/.env")
        raw_response = call_openai_compatible("https://inference-api.nousresearch.com/v1", key, model, content)
        
    elif provider == "custom":
        if not base_url:
            raise ValueError("--base-url is required when using provider='custom'")
        key = api_key or "sk-local"
        raw_response = call_openai_compatible(base_url, key, model, content)
    else:
        raise ValueError(f"Unknown provider: {provider}")

    # Strip code fences if present
    cleaned = raw_response.strip()
    if cleaned.startswith("```"):
        lines = cleaned.split("\n")
        if lines[0].startswith("```"):
            lines = lines[1:]
        if lines[-1].strip() == "```":
            lines = lines[:-1]
        cleaned = "\n".join(lines).strip()

    return json.loads(cleaned)


def print_report(file_path, result, min_score=80):
    score = result.get("total_score", 0)
    verdict = "PASS" if score >= min_score else "FAIL"
    symbol = "✅" if verdict == "PASS" else "❌"
    
    print("\n" + "=" * 80)
    print(f"{symbol} EVALUATION: {os.path.basename(file_path)} — Score: {score}/100 ({verdict})")
    print("=" * 80)
    
    dims = result.get("dimensions", {})
    for dim_name, dinfo in dims.items():
        dim_score = dinfo.get("score", 0)
        dim_critique = dinfo.get("critique", "")
        bar = "█" * (dim_score // 2) + "░" * (10 - (dim_score // 2))
        print(f"\n  • {dim_name.upper():<25} [{bar}] {dim_score}/20")
        print(f"    {dim_critique}")

    print("\n--- EXECUTIVE SUMMARY ---")
    print(f"  {result.get('executive_summary', 'No summary provided.')}")

    flagged = result.get("flagged_passages", [])
    if flagged:
        print(f"\n--- FLAGGED WEAK PASSAGES ({len(flagged)}) ---")
        for i, item in enumerate(flagged, 1):
            print(f"\n  [{i}] Dimension: {item.get('dimension')}")
            print(f"      Quote: \"{item.get('quote')}\"")
            print(f"      Issue: {item.get('problem')}")
            print(f"      Fix:   {item.get('fix')}")
    print("\n" + "=" * 80 + "\n")


def main():
    parser = argparse.ArgumentParser(description="Model-Agnostic Direct Response Copy Reviewer")
    parser.add_argument("target", help="Path to markdown article file or glob pattern (e.g. 'content/articles/**/*.md')")
    parser.add_argument("--model", default="gemini-2.5-flash", help="Model name (e.g. gemini-2.5-flash, tencent/hy3, z-ai/glm-5.3-flash, anthropic/claude-3.5-sonnet)")
    parser.add_argument("--provider", choices=["gemini", "openrouter", "nous", "custom"], help="API provider")
    parser.add_argument("--base-url", help="Custom OpenAI-compatible API base URL (e.g. http://localhost:11434/v1)")
    parser.add_argument("--api-key", help="API Key override")
    parser.add_argument("--min-score", type=int, default=80, help="Minimum score to pass (default: 80)")
    parser.add_argument("--json", action="store_true", help="Output raw JSON instead of human report")

    args = parser.parse_args()

    # Resolve target files
    if os.path.isfile(args.target):
        files = [args.target]
    else:
        files = glob.glob(args.target, recursive=True)
        files = [f for f in files if f.endswith(".md") and not f.lower().endswith("readme.md")]

    if not files:
        print(f"No markdown files found matching: {args.target}")
        sys.exit(1)

    overall_failed = False
    all_results = []

    for file_path in files:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        try:
            result = evaluate_article(
                content=content,
                model=args.model,
                provider=args.provider,
                base_url=args.base_url,
                api_key=args.api_key
            )
            result["file_path"] = file_path
            all_results.append(result)

            if result.get("total_score", 0) < args.min_score:
                overall_failed = True

            if args.json:
                print(json.dumps(result, indent=2))
            else:
                print_report(file_path, result, min_score=args.min_score)

        except Exception as e:
            print(f"❌ Error reviewing {file_path}: {e}")
            overall_failed = True

    if overall_failed:
        sys.exit(1)
    else:
        sys.exit(0)


if __name__ == "__main__":
    main()
