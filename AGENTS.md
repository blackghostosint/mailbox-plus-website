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

Local secret scanning with `gitleaks` is enforced via a fail-closed pre-commit hook (`.husky/pre-commit`). Developers and AI agents must have `gitleaks` installed on `PATH` for Git commits to pass locally. If `gitleaks` is missing in non-interactive/automated environments, set `SKIP_GITLEAKS=1` (e.g. `SKIP_GITLEAKS=1 git commit`) to bypass the local pre-commit check while preserving CI secret scanning enforcement.

## 5. CI green before requesting review

All required checks (`build-and-test`, `lighthouse`, plus any workflow added to the repo) must pass on your PR before you request review. If a check fails, fix the root cause — do not skip, weaken, or delete the check.

## 6. Scope discipline

Fix what the task asks for. If you find an unrelated problem, open a separate issue or PR body note instead of expanding the diff. Large unrequested refactors will be rejected.

## Design system

The visual system is token-driven — see `docs/DESIGN_SYSTEM.md`. Do not change color tokens or typography without owner approval; brand colors are a business decision.

## Articles

**Content/articles are owner-side. External agents (Jules, third-party bots) must not create, edit, or fix article PRs** — PRs authored by external agents that touch `content/articles/` are rejected on sight and the underlying task considered misrouted. Article writing, fixing, and verification are handled in-house by the owner-side agent (Hermes) + owner, who are the ONLY agents authorized for `content/articles/` and `.factchecks/`.

Writing or editing anything in `content/articles/`? Follow `docs/ARTICLE-WORKFLOW.md` — style standard, structure, and the hard gates (fact-check, copy review ≥ 90 (DeepSeek V4.1 Flash), strict verification). All apply before you open the PR. Repeated article-PR failures are tracked in `docs/ARTICLE-ERROR-LOG.md` and become mechanical preflight checks — run `npm run preflight:article` before opening any article PR.

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

## 10. Label mutations use the REST API

`gh pr edit --add-label` / `--remove-label` is broken repo-wide (GitHub's GraphQL `projectCards` deprecation errors before the label operation runs). Never use it. Set or clear labels with the REST issues API:

```
gh api -X POST   repos/$REPO/issues/<n>/labels  -f 'labels[]=status: green'
gh api -X DELETE repos/$REPO/issues/<n>/labels/status%3A%20red
```

Status labels (`status: green` / `status: wait-ci` / `status: red` / `status: hold`) are maintained automatically by the owner-side watcher every 15 minutes — if a label looks stale, it will correct itself within one cycle. Do not fight the automation.

## 11. Local accessibility verification for UI pull requests

Any pull request that modifies UI components (`astro/src/components/`), layouts (`astro/src/layouts/`), pages (`astro/src/pages/`), or styling must undergo local accessibility verification before requesting code review. Agents must:

1. Build the static site to populate `dist/`: `npm run build`
2. Execute the local axe-core accessibility audit: `npm run audit:a11y` (or `npm run audit:a11y -- --mode=full` for site-wide layout changes)
3. Resolve all WCAG 2.1 AA violations before opening or updating a pull request.
