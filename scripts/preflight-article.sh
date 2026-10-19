#!/usr/bin/env bash
# preflight-article — run BEFORE opening/submitting an article PR.
# Wraps every gate that has actually failed on our article PRs, so the same
# error never costs a CI round-trip again. Usage: npm run preflight:article -- [branch]
set -uo pipefail
FAIL=0

LOG_FILE=$(mktemp)
trap 'rm -f "$LOG_FILE"' EXIT INT TERM

echo "== article preflight =="

# 1. LLM feeds in sync (failed: #620, #638)
if ! npm run prebuild >"$LOG_FILE" 2>&1; then
  echo "❌ feeds: prebuild failed"
  cat "$LOG_FILE"
  FAIL=1
else
  if ! git diff --quiet -- public/llms.txt public/llms-full.txt; then
    echo "❌ feeds: llms.txt/llms-full.txt out of sync — run npm run prebuild, commit, and push again."
    FAIL=1
  else
    echo "✅ feeds: in sync"
  fi
fi

# 2. copy review: DECOUPLED FROM PRE-PUSH.
# audit:copy evaluates copy via an external LLM with variable latency and stochastic scoring.
# Pre-push hooks must be fast and deterministic. Run copy evaluation during drafting via:
#   npm run audit:copy -- <file>
# or
#   node scripts/verify/verify.mjs review <file>

# 3. fact-check receipt present per changed article (receipts in .factchecks/)
# NOTE: --diff-filter=d excludes DELETED articles — a removed .md has no body to
# review and no receipt to check; running the gates on it fails spuriously
# (deletion branches like the GSC sitemap-cleanup PR).
mapfile -t ARTICLES < <(
  {
    git diff --name-only --diff-filter=d origin/main...HEAD -- 'content/articles/**/*.md' 2>/dev/null
    git diff --name-only --diff-filter=d HEAD~1 -- 'content/articles/**/*.md' 2>/dev/null
    git diff --name-only --diff-filter=d HEAD -- 'content/articles/**/*.md' 2>/dev/null
    git ls-files --others --exclude-standard -- 'content/articles/**/*.md' 2>/dev/null
  } | sort -u
)

for f in "${ARTICLES[@]}"; do
  [ -z "$f" ] && continue
  [ ! -f "$f" ] && continue
  base=$(basename "$f" .md)
  if ! ls .factchecks/"${base}".factcheck.* >/dev/null 2>&1; then
    echo "❌ factcheck: no receipt for $base (.factchecks/${base}.factcheck.*)"
    FAIL=1
  else
    echo "✅ factcheck: $base"
  fi
  # 3b. dedupe: drafts/ copy is a leftover that breaks claims-gate resolution (#663)
  if [ -f "content/drafts/${base}.factcheck.md" ] && [ -f ".factchecks/${base}.factcheck.md" ]; then
    echo "❌ factcheck: duplicate receipt in content/drafts/${base}.factcheck.md — delete it before pushing (canonical: .factchecks/)"
    FAIL=1
  fi
  # 3c. verdict column sanity (#664 — claims gate needs ✅/⚠️/owner-verified in the
  # VERDICT column (3rd) of each receipt table row; a marker in any other column fails CI)
  node scripts/preflight-verify-verdicts.mjs ".factchecks/${base}.factcheck.md" || FAIL=1
  # 3d. strict offline verification parity gate (includes store photo manifest validation).
  # Reuses verify.mjs in strict offline mode so local preflight maintains 1:1 parity with CI.
  VERIFY_LOG=$(mktemp)
  if ! node --import tsx scripts/verify/verify.mjs article "$f" --strict --offline >"$VERIFY_LOG" 2>&1; then
    echo "❌ verification: strict offline check failed for $f"
    cat "$VERIFY_LOG"
    FAIL=1
  else
    IMG_STATUS=$(grep 'image:body' "$VERIFY_LOG" || echo "image:body OK")
    echo "✅ verification & store photo manifest: $f (${IMG_STATUS})"
  fi
  rm -f "$VERIFY_LOG"
done

# 4. trailing slashes on internal links (rule 1, CI enforces — check early)
if ! npm run seo:check-href-slash >"$LOG_FILE" 2>&1; then
  echo "❌ seo: internal link missing trailing slash"
  cat "$LOG_FILE"
  FAIL=1
else
  echo "✅ seo: href slashes OK"
fi

exit $FAIL
