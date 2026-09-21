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

## 7. State the auth model for every API change

Every PR that adds or modifies a Netlify function (or any API endpoint) must state the endpoint's auth model in the PR body: who is allowed to call it and how identity is proven (token, session, signed request, etc.). "The endpoint exists and validates its input" is not an auth model. A PR that adds or modifies an endpoint without this section is rejected on sight. Existence checks, field whitelists, and ID-format constraints do not count as authorization.

## 8. Netlify functions are TypeScript only

Every file in `netlify/functions/` must use the `.ts` extension. Plain `.js` functions are not bundled by Netlify's build — their relative imports (e.g. `netlify/functions/lib/recaptcha.ts`) fail at runtime with `Runtime.ImportModuleError`, returning 502 to users while CI stays green (CI does not exercise deployed function bundles). This broke the contact form in production on 2026-09-16; do not reintroduce it. When creating a function, write it as `.ts` from the start — never `.js`.

## 9. Bots: rebase and check merge state before opening a PR

Before opening any PR, agents must:

1. Fetch and rebase onto the current `main` — never open a PR from a stale branch. If your task touches files another merged PR deleted (e.g. a function removed while you worked), re-run against current main and adjust before opening.
2. Confirm the branch is not editing files that no longer exist on `main`.
3. Dependencies and scope: state any dependency changes in the PR body (rule 2) and keep the diff scoped to the task (rule 6) — no broad refactors bundled in.
4. One concern per PR: split validation / codegen / type-sharing / docs work into separate PRs.

PRs opened from stale branches or bundling unrequested refactors will be rejected on sight.
