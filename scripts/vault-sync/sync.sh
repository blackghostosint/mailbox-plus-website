#!/usr/bin/env bash
# vault-sync: pull facts from the mailbox-plus-website repo configs into the
# Mailbox Plus Obsidian vault on the media server.
#
# Usage: bash scripts/vault-sync/sync.sh
#
# Steps:
#   1. Extract all site configs to JSON via vitest (under astro/ so Vite
#      resolves ~icons and import.meta.env)
#   2. Generate rich vault notes from the JSON + article frontmatter
#   3. Upload the synced notes to the server vault
#
# The vault's "Website Sync" section is generated; do not hand-edit those
# notes. Re-run this whenever site configs change.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEFAULT_REPO="$(cd "$SCRIPT_DIR/../.." && pwd)"
REPO="${REPO_ROOT:-${REPO:-$DEFAULT_REPO}}"
if [ ! -d "$REPO" ]; then
  REPO="$DEFAULT_REPO"
fi
SSH_HOST="${SSH_HOST:-${VAULT_SYNC_SERVER:-${SERVER:-server}}}"
VAULT_REMOTE_PATH="${VAULT_REMOTE_PATH:-${VAULT_PATH:-${VAULT:-/mnt/storage1/Obsidian/MainVault/Mailbox Plus/Knowledge}}}"
GEN="${GEN:-$SCRIPT_DIR/vault-generate.py}"
TMP_DATA="${TMP_DATA:-/tmp/vault-data.json}"
STAGE="${STAGE:-/tmp/vault-stage/Knowledge}"
UPLOAD="${UPLOAD:-/tmp/vault-upload}"
DRY_RUN="${DRY_RUN:-0}"
DEST_DIR="${DEST_DIR:-}"

echo "==> [1/4] Extracting site configs (vitest)"
cd "$REPO/astro"
npx vitest run src/scripts/vault-extract.test.ts || {
  echo "extract failed"; exit 1; }
test -f "$TMP_DATA" || { echo "no data dump"; exit 1; }

echo "==> [2/4] Generating vault notes"
rm -rf "$STAGE" "$UPLOAD"
mkdir -p "$STAGE" "$UPLOAD"
python3 "$GEN" "$TMP_DATA" "$STAGE"

echo "==> [3/4] Staging upload set"
cp "$STAGE/Business Identity.md" "$STAGE/Positioning.md" "$STAGE/Services.md" \
   "$STAGE"/Services\ *.md "$STAGE/FAQ Hub.md" "$STAGE/Service Areas.md" \
   "$STAGE/Locations.md" "$STAGE/Articles Index.md" "$UPLOAD/" 2>/dev/null || true
# Knowledge Hub is written separately (it also points at curated notes)
if [ -f "$STAGE/Knowledge Hub.md" ]; then
  cp "$STAGE/Knowledge Hub.md" "$UPLOAD/" 2>/dev/null || true
fi

echo "==> [4/4] Sync destination handling"
if [ "$DRY_RUN" = "1" ] || [ "$DRY_RUN" = "true" ]; then
  echo "DRY_RUN mode enabled. Dry run completed successfully without upload."
elif [ -n "$DEST_DIR" ]; then
  echo "Copying synced notes to local destination: $DEST_DIR"
  mkdir -p "$DEST_DIR"
  cp "$UPLOAD"/*.md "$DEST_DIR/"
else
  echo "Uploading to server vault via scp"
  scp "$UPLOAD"/*.md "$SSH_HOST:$VAULT_REMOTE_PATH/"
fi

echo "Done. Vault synced."
