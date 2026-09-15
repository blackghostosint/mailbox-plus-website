# Agent Rules

Hard rules for AI coding agents (Jules, Codex, etc.) working in this repository. These are non-negotiable; violations block merge.

## 1. Trailing slashes are mandatory

Every internal link, canonical URL, and route reference uses a trailing slash:

- ✅ `/services/`, `/contact-us/`
- ❌ `/services`, `/contact-us`

Netlify redirect/canonical rules depend on this, and dropping slashes creates duplicate URLs that hurt SEO. CI enforces it via `npm run seo:check-href-slash` — do not weaken that script to make a PR pass.

## 2. No dependency changes without owner sign-off

Do not add, remove, or upgrade packages in `package.json` (including `package-lock.json` churn) unless the task explicitly authorizes it. If a dependency change seems unavoidable, disclose it in the PR body and request sign-off — do not hide it.

## 3. Never invent business facts

Prices, service claims, guarantees, SLAs, response times, contact emails, phone numbers, and legal statements must come from the owner or existing site copy. If the task requires a fact that isn't in the repo, ask — do not guess. Public promises (e.g., "we respond within X days") require explicit owner approval.

## 4. Secret hygiene

Server-side secrets (Netlify functions) must never use `VITE_`-prefixed env var names — Vite inlines those into client bundles. Client-exposed values use `VITE_`; everything else does not. See `docs/ENVIRONMENT.md`.

## 5. CI green before requesting review

All required checks (`build-and-test`, `lighthouse`, plus any workflow added to the repo) must pass on your PR before you request review. If a check fails, fix the root cause — do not skip, weaken, or delete the check.

## 6. Scope discipline

Fix what the task asks for. If you find an unrelated problem, open a separate issue or PR body note instead of expanding the diff. Large unrequested refactors will be rejected.

## Design system

The visual system is token-driven — see `docs/DESIGN_SYSTEM.md`. Do not change color tokens or typography without owner approval; brand colors are a business decision.

## Articles

Writing or editing anything in `content/articles/`? Follow `docs/ARTICLE-WORKFLOW.md` — style standard, structure, and the hard gates (fact-check, copy review ≥ 80, strict verification). All apply before you open the PR.
