#!/usr/bin/env bash
# Prevent legacy-data drift: fail if any file under public/data/ is not
# referenced by a source file (astro/src, netlify/functions, scripts).
#
# Why: the React->Astro migration left orphaned JSON in public/data/faqs/.
# public/ files are copied verbatim to the deployed site, so orphans ship
# stale content with zero code references and zero build errors. This check
# makes that failure mode visible in CI instead of silently persisting.
#
# Usage: scripts/check-public-data-refs.sh   (exit 1 on orphans)
set -euo pipefail

DATA_DIR="public/data"
SRC_DIRS=("astro/src" "netlify/functions" "scripts" "content" "public/llms.txt" "public/llms-full.txt")

if [ ! -d "$DATA_DIR" ]; then
  echo "OK: no public/data directory."
  exit 0
fi

orphans=0
while IFS= read -r -d '' file; do
  # Only check JSON/JS/TS files (ignore images etc. if any)
  case "$file" in
    *.json|*.js|*.ts|*.mjs) ;;
    *) continue ;;
  esac

  rel="${file#public/data/}"
  name="$(basename "$file")"
  found=""

  # Look for any reference: full path, bare filename, or data/... path.
  # Exclude this script itself so its own text can't create a false hit.
  for src in "${SRC_DIRS[@]}"; do
    if [ "$src" = "scripts" ]; then
      grep -rqF -- "$rel" "$src" --exclude="check-public-data-refs.sh" 2>/dev/null && { found=1; break; }
      grep -rqF -- "$name" "$src" --exclude="check-public-data-refs.sh" 2>/dev/null && { found=1; break; }
    else
      grep -rqF -- "$rel" "$src" 2>/dev/null && { found=1; break; }
      grep -rqF -- "$name" "$src" 2>/dev/null && { found=1; break; }
    fi
  done

  if [ -z "$found" ]; then
    echo "ORPHAN: public/data/$rel is not referenced by any source file."
    orphans=$((orphans + 1))
  fi
done < <(find "$DATA_DIR" -type f -print0)

if [ "$orphans" -gt 0 ]; then
  echo "FAIL: $orphans unreferenced file(s) under public/data/. Remove them or wire them up."
  exit 1
fi

echo "OK: all public/data files are referenced."
