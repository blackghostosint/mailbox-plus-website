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
REMOTE_PATH_TRIMMED="${VAULT_REMOTE_PATH%"${VAULT_REMOTE_PATH##*[!/]}"}"
GEN="${GEN:-$SCRIPT_DIR/vault-generate.py}"
TARGET_TMP_DATA="${TMP_DATA:-/tmp/vault-data.json}"
STAGE="${STAGE:-/tmp/vault-stage/Knowledge}"
UPLOAD="${UPLOAD:-/tmp/vault-upload}"
DRY_RUN="${DRY_RUN:-0}"
DEST_DIR="${DEST_DIR:-}"

# Atomic staging setup using mktemp
STAGING_DIR="$(mktemp -d "${TMPDIR:-/tmp}/vault-sync-stage.XXXXXX")"
TMP_DATA_STAGING="$(mktemp "${TMPDIR:-/tmp}/vault-data.XXXXXX.json")"
STAGE_TEMP="${STAGING_DIR}/Knowledge"
UPLOAD_TEMP="${STAGING_DIR}/upload"

cleanup() {
  rm -f "$TMP_DATA_STAGING" 2>/dev/null || true
  rm -rf "$STAGING_DIR" 2>/dev/null || true

  # Restore target directories if interrupted during atomic swap, or clean up leftovers
  for target_path in "$STAGE" "$UPLOAD"; do
    local p_dir b_name
    p_dir="$(dirname "$target_path")"
    b_name="$(basename "$target_path")"
    if [ -d "$p_dir" ]; then
      for old_dir in "$p_dir"/."$b_name".old.*; do
        if [ -e "$old_dir" ]; then
          if [ ! -e "$target_path" ]; then
            mv "$old_dir" "$target_path" 2>/dev/null || true
          else
            rm -rf "$old_dir" 2>/dev/null || true
          fi
        fi
      done
      for swap_dir in "$p_dir"/."$b_name".swap.*; do
        if [ -e "$swap_dir" ]; then
          rm -rf "$swap_dir" 2>/dev/null || true
        fi
      done
    fi
  done
}
trap cleanup EXIT INT TERM

atomic_swap_dir() {
  local src_dir="$1"
  local target_dir="$2"

  local parent_dir
  parent_dir="$(dirname "$target_dir")"
  mkdir -p "$parent_dir"

  local base_name
  base_name="$(basename "$target_dir")"

  # Stage in target directory's parent folder to guarantee same-filesystem atomic move
  local swap_stage
  swap_stage="$(mktemp -d "${parent_dir}/.${base_name}.swap.XXXXXX")"
  rmdir "$swap_stage"
  mv "$src_dir" "$swap_stage"

  local old_backup="${parent_dir}/.${base_name}.old.$$.$RANDOM"

  if [ -e "$target_dir" ] || [ -L "$target_dir" ]; then
    mv "$target_dir" "$old_backup"
  fi

  if mv "$swap_stage" "$target_dir"; then
    if [ -e "$old_backup" ] || [ -L "$old_backup" ]; then
      rm -rf "$old_backup" 2>/dev/null || true
    fi
  else
    # Rollback on failure
    if [ -e "$old_backup" ] || [ -L "$old_backup" ]; then
      mv "$old_backup" "$target_dir" 2>/dev/null || true
    fi
    return 1
  fi
}

echo "==> [1/4] Extracting site configs (vitest)"
TMP_DATA="$TMP_DATA_STAGING" npm --prefix "$REPO/astro" run test -- src/scripts/vault-extract.test.ts || {
  echo "extract failed"; exit 1; }
test -f "$TMP_DATA_STAGING" || { echo "no data dump"; exit 1; }

# Atomically swap staging data file to target TMP_DATA path
mkdir -p "$(dirname "$TARGET_TMP_DATA")"
mv -f "$TMP_DATA_STAGING" "$TARGET_TMP_DATA"

echo "==> [2/4] Generating vault notes"
mkdir -p "$STAGE_TEMP" "$UPLOAD_TEMP"
python3 "$GEN" "$TARGET_TMP_DATA" "$STAGE_TEMP"

echo "==> [3/4] Staging upload set"
cp "$STAGE_TEMP/Business Identity.md" "$STAGE_TEMP/Positioning.md" "$STAGE_TEMP/Services.md" \
   "$STAGE_TEMP"/Services\ *.md "$STAGE_TEMP/FAQ Hub.md" "$STAGE_TEMP/Service Areas.md" \
   "$STAGE_TEMP/Locations.md" "$STAGE_TEMP/Articles Index.md" "$UPLOAD_TEMP/" 2>/dev/null || true
# Knowledge Hub is written separately (it also points at curated notes)
if [ -f "$STAGE_TEMP/Knowledge Hub.md" ]; then
  cp "$STAGE_TEMP/Knowledge Hub.md" "$UPLOAD_TEMP/" 2>/dev/null || true
fi

# Atomically replace final STAGE and UPLOAD directories
atomic_swap_dir "$STAGE_TEMP" "$STAGE"
atomic_swap_dir "$UPLOAD_TEMP" "$UPLOAD"

echo "==> [4/4] Sync destination handling"
if [ "$DRY_RUN" = "1" ] || [ "$DRY_RUN" = "true" ]; then
  echo "DRY_RUN mode enabled. Dry run completed successfully without upload."
elif [ -n "$DEST_DIR" ]; then
  echo "Copying synced notes to local destination: $DEST_DIR"
  mkdir -p "$DEST_DIR"
  cp "$UPLOAD"/*.md "$DEST_DIR/"
else
  echo "Uploading to server vault via scp"
  scp "$UPLOAD"/*.md "$SSH_HOST:${REMOTE_PATH_TRIMMED:-}/"
fi

echo "Done. Vault synced."
