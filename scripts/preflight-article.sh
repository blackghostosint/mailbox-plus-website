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

# 3. Target resolution & merge-base calculation per changed article (receipts in .factchecks/)
# Accepts optional $1 target branch (default: main).
# Uses multi-tier merge-base check with auto-fetch against target before falling back.
TARGET="${1:-main}"

CANDIDATES=()
if [[ "$TARGET" == origin/* ]]; then
  BRANCH_NAME="${TARGET#origin/}"
  CANDIDATES=("$TARGET" "$BRANCH_NAME" "@{u}")
else
  CANDIDATES=("origin/$TARGET" "$TARGET" "@{u}")
fi

BASE_SHA=""
for ref in "${CANDIDATES[@]}"; do
  if BASE_SHA=$(git merge-base HEAD "$ref" 2>/dev/null) && [ -n "$BASE_SHA" ]; then
    break
  fi
done

if [ -z "$BASE_SHA" ]; then
  FETCH_TARGET="$TARGET"
  if [[ "$TARGET" == origin/* ]]; then
    FETCH_TARGET="${TARGET#origin/}"
  fi
  git fetch origin "$FETCH_TARGET" --depth=100 >/dev/null 2>&1 || true

  for ref in "${CANDIDATES[@]}"; do
    if BASE_SHA=$(git merge-base HEAD "$ref" 2>/dev/null) && [ -n "$BASE_SHA" ]; then
      break
    fi
  done
fi

if [ -z "$BASE_SHA" ]; then
  if git rev-parse HEAD~1 >/dev/null 2>&1; then
    BASE_SHA=$(git rev-parse HEAD~1)
  else
    BASE_SHA=$(git rev-parse HEAD 2>/dev/null || echo "")
  fi
fi

get_changed_articles() {
  if [ -n "$BASE_SHA" ]; then
    git diff --name-only --diff-filter=d "$BASE_SHA" -- 'content/articles/*.md' 'content/articles/**/*.md' 2>/dev/null
  fi
  while IFS= read -r line; do
    [ -z "$line" ] && continue
    status="${line:0:2}"
    if [[ "$status" =~ D ]]; then
      continue
    fi
    file="${line:3}"
    if [[ "$file" == *" -> "* ]]; then
      file="${file#* -> }"
    fi
    file="${file#\"}"
    file="${file%\"}"
    echo "$file"
  done < <(git status --porcelain -- 'content/articles/*.md' 'content/articles/**/*.md' 2>/dev/null)
  git ls-files --others --exclude-standard -- 'content/articles/*.md' 'content/articles/**/*.md' 2>/dev/null
}

mapfile -t ARTICLES < <(get_changed_articles | sort -u)

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

# 5. article ownership gate & authorship stamp (internal-only rule, CI enforces)
if [ ${#ARTICLES[@]} -gt 0 ] && [ -n "${ARTICLES[0]}" ]; then
  if ! npm run verify:ownership >"$LOG_FILE" 2>&1; then
    echo "❌ ownership: article ownership check failed"
    cat "$LOG_FILE"
    FAIL=1
  else
    echo "✅ ownership: article ownership verified"
  fi
fi

exit $FAIL
