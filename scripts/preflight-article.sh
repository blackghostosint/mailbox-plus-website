#!/usr/bin/env bash
# preflight-article — run BEFORE opening/submitting an article PR.
# Wraps every gate that has actually failed on our article PRs, so the same
# error never costs a CI round-trip again. Usage: npm run preflight:article -- [branch]
set -uo pipefail
FAIL=0

echo "== article preflight =="

# 1. LLM feeds in sync (failed: #620, #638)
npm run prebuild >/dev/null 2>&1
if ! git diff --quiet -- public/llms.txt public/llms-full.txt; then
  echo "❌ feeds: llms.txt/llms-full.txt out of sync — committing regenerated feeds"
  git add public/llms.txt public/llms-full.txt
  git commit -m "chore(feeds): regenerate LLM feeds (preflight)" --quiet || FAIL=1
else
  echo "✅ feeds: in sync"
fi

# 2. copy review >= 80 on each changed article (failed: #636/#638 chain)
MAP=$(git diff --name-only origin/main...HEAD -- 'content/articles/**/*.md' 2>/dev/null)
[ -z "${MAP}" ] && MAP=$(git diff --name-only HEAD~1 -- 'content/articles/**/*.md' 2>/dev/null)
for f in ${MAP}; do
  echo "-- audit:copy $f"
  npm run audit:copy -- "$f" 2>&1 | grep -E "Score|FAIL" || { echo "❌ copy review failed for $f"; FAIL=1; }
done

# 3. fact-check receipt present per changed article (receipts in .factchecks/)
for f in ${MAP}; do
  base=$(basename "$f" .md)
  if ! ls .factchecks/"${base}".factcheck.* >/dev/null 2>&1; then
    echo "❌ factcheck: no receipt for $base (.factchecks/${base}.factcheck.*)"
    FAIL=1
  else
    echo "✅ factcheck: $base"
  fi
  # 3b. dedupe: drafts/ copy is a leftover that breaks claims-gate resolution (#663)
  if [ -f "content/drafts/${base}.factcheck.md" ] && [ -f ".factchecks/${base}.factcheck.md" ]; then
    echo "⚠️ factcheck: duplicate receipt in content/drafts/${base}.factcheck.md — removing (canonical: .factchecks/)"
    git rm -q "content/drafts/${base}.factcheck.md"
  fi
  # 3c. verdict column sanity (#664 — claims gate needs ✅/⚠️/owner-verified in the
  # VERDICT column (3rd) of each receipt table row; a marker in any other column fails CI)
  node scripts/preflight-verify-verdicts.mjs ".factchecks/${base}.factcheck.md" || FAIL=1
  # 3d. body-photo manifest membership (failed: #683/#684 — hand-rolled rclone uploads
  # shipped CDN URLs missing from content/store-photos.json; CI image:body hard-failed
  # AFTER the bot's own gate run). Reuses verify.mjs's exact gate logic offline so the
  # check can't drift from CI; asserts on the gate output line, not the exit code.
  IMG_OUT=$(node --import tsx scripts/verify/verify.mjs article "$f" --strict --offline 2>&1 | grep 'image:body' || true)
  if echo "$IMG_OUT" | grep -q '✅'; then
    echo "✅ image:body manifest: $f"
  else
    echo "❌ image:body: ${IMG_OUT:-no image:body output from verify.mjs} — body photos MUST go through process_store_photos.py publish (manifest append), never hand-rolled rclone"
    FAIL=1
  fi
done

# 4. trailing slashes on internal links (rule 1, CI enforces — check early)
if ! npm run seo:check-href-slash >/dev/null 2>&1; then
  echo "❌ seo: internal link missing trailing slash"
  FAIL=1
else
  echo "✅ seo: href slashes OK"
fi

exit $FAIL
