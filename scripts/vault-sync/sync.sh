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

REPO="/home/blackghost/Projects/mailbox-plus-website"
SERVER="server"
VAULT="/mnt/storage1/Obsidian/MainVault/Mailbox Plus/Knowledge"
GEN="/home/blackghost/Projects/mailbox-plus-website/scripts/vault-sync/vault-generate.py"
TMP_DATA="/tmp/vault-data.json"
STAGE="/tmp/vault-stage/Knowledge"
UPLOAD="/tmp/vault-upload"

echo "==> [1/4] Extracting site configs (vitest)"
cd "$REPO/astro"
npx vitest run src/scripts/vault-extract.test.ts >/dev/null 2>&1 || {
  echo "extract failed"; exit 1; }
test -f "$TMP_DATA" || { echo "no data dump"; exit 1; }

echo "==> [2/4] Generating vault notes"
rm -rf "$STAGE" "$UPLOAD"
mkdir -p "$STAGE" "$UPLOAD"
python3 "$GEN" "$TMP_DATA" "$STAGE" >/dev/null

echo "==> [3/4] Staging upload set"
cp "$STAGE/Business Identity.md" "$STAGE/Positioning.md" "$STAGE/Services.md" \
   "$STAGE"/Services\ *.md "$STAGE/FAQ Hub.md" "$STAGE/Service Areas.md" \
   "$STAGE/Locations.md" "$STAGE/Articles Index.md" "$UPLOAD/" 2>/dev/null || true
# Knowledge Hub is written separately (it also points at curated notes)
cp "$STAGE/Knowledge Hub.md" "$UPLOAD/" 2>/dev/null || true

echo "==> [4/4] Uploading to server vault"
scp "$UPLOAD"/*.md "$SERVER:$VAULT/" >/dev/null

echo "Done. Vault synced. Run the link verifier to confirm:"
echo "  scp scripts/vault-sync/verify-links.py $SERVER:/tmp/ && ssh $SERVER 'python3 /tmp/verify-links.py'"
