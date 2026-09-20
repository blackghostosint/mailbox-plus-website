#!/bin/bash
# Guard: VITE_-prefixed variables that hold SECRETS must never be referenced in
# client-side code. Vite inlines VITE_* into client bundles, so a secret under a
# VITE_ name is a bundle leak. CI-only secrets may keep a legacy VITE_ name in
# env config, but any reference from astro/src/, public/, or src/ fails this check.
# Context: #529 added VITE_GEMINI_API_KEY (CI-only). See docs/ENVIRONMENT.md.

set -e

echo "Checking for VITE_-prefixed secret references in client code..."

CLIENT_DIRS="astro/src public"
PATTERN='VITE_(GEMINI_API_KEY|RECAPTCHA_SECRET_KEY|API_KEY|SECRET|TOKEN|PASSWORD)'

HITS=$(grep -rEn "$PATTERN" $CLIENT_DIRS --include='*.ts' --include='*.tsx' --include='*.js' --include='*.mjs' --include='*.astro' 2>/dev/null || true)

if [ -n "$HITS" ]; then
  echo "ERROR: VITE_-prefixed secret referenced in client-side code:"
  echo "$HITS"
  echo ""
  echo "Client bundles inline VITE_* values at build time. Server-side secrets"
  echo "must use non-VITE_ names (see AGENTS.md rule 4 / docs/ENVIRONMENT.md)."
  exit 1
fi

echo "OK: no VITE_ secret references in client code."
