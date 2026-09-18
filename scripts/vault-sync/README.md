# vault-sync — Website → Obsidian Vault Fact Sync

Pulls the Mailbox Plus **facts, services, FAQs, service areas, locations, and
article index** from the website repo configs into the Obsidian vault, instead
of hand-maintaining thin summary notes.

## Files

- `astro/src/scripts/vault-extract.test.ts` — vitest test that imports every site config
  (services, FAQs, serviceAreas, locations, siteConfig) and dumps them to
  `/tmp/vault-data.json`. Lives under `astro/src/scripts/` so Vite resolves `~icons`
  and `import.meta.env`.
- `vault-generate.py` — reads the JSON dump + `content/articles/**` frontmatter,
  writes rich markdown notes (with provenance frontmatter) to a staging dir.
- `sync.sh` — the full pipeline: extract → generate → upload via scp or local copy.
- `verify-links.py` — checks every wikilink in the vault resolves (handles
  spaces in `[[link names]]`, which shell loops cannot).

## Run

```bash
# Extract configs to JSON dump
npm run vault:extract

# Generate Markdown vault notes from JSON dump
npm run vault:generate

# Full pipeline sync (extract, generate, and upload/copy)
npm run vault:sync

# Dry-run mode (validates extraction and generation without uploading)
DRY_RUN=1 npm run vault:sync

# Sync to a local target directory
DEST_DIR=/path/to/local/vault npm run vault:sync

# Sync to custom SSH server target
SSH_HOST=user@host VAULT_REMOTE_PATH=/remote/path npm run vault:sync
```

## What it generates (Knowledge/ section "Website Sync")

- Business Identity, Positioning (regenerated)
- Services index + 6 per-category full notes
- FAQ Hub (all site FAQs), Service Areas (18), Locations (10)
- Articles Index (116 articles from frontmatter)
- Knowledge Hub (rewritten to link the new section)

## Rules

- Synced notes are **generated** — edit the site configs, not the vault notes.
- Curated notes (Shipping, Private Mailboxes, Copy and Print, Document
  Services, Returns, Pricing, PostalMate, Carrier Equipment Returns) stay
  human-authored SoT summaries and are cross-linked to the synced notes.
- Verify links after each sync: `python3 scripts/vault-sync/verify-links.py`
  (run on the server against the vault path).
