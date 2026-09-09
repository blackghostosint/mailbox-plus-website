# mailboxplus-verify

One-command deterministic pre-flight for site content. Agent-friendly: JSON
output, exit codes, rules compiled in. Based on the pstack verification-CLI
pattern (lauren/@poteto).

## Usage

    node scripts/verify/verify.mjs doctor
      Environment sanity: repo root, deps, gray-matter, branch hygiene.

    node scripts/verify/verify.mjs article <path.md> [--json] [--strict]
      Full article pre-flight:
        - required frontmatter (title, description, slug, category, intentKey,
          pubDate, image, imageAlt, keywords, relatedServices, author)
        - description length (target 150-160)
        - slug kebab-case, pubDate valid
        - internal links >= 2 (gate in --strict; advisory otherwise — 49 legacy
          articles are below this bar)
        - trailing slashes on all internal links (CI-enforced rule)
        - featured image + descriptive imageAlt (R2 path shape)
        - word count 400-5300 (workflow target 1200-4000)
        - relatedServices canonical form (advisory — renderer normalizes)

    Exit codes: 0 pass, 1 failures, 2 usage error.

## Policy: corpus reality vs checklist aspiration

Rules enforced here are calibrated against the live corpus (171 articles) and
the CI gates. Where the checklist skill aspires to a standard the existing
corpus doesn't meet (min 2 links, status field), the CLI flags advisory by
default and gates only with --strict. New articles should be run with
--strict in the PR flow.

## Wiring

- Pre-PR (manual or agent): `node scripts/verify/verify.mjs article <path> --strict`
- CI (future): add `node scripts/verify/verify.mjs article <changed.md> --strict`
  to ci.yml after lint, or as a pre-push hook.

## Tier 1 commands (added same PR)

- `node scripts/verify/verify.mjs build` — runs npm run build, reports page-count delta
- `node scripts/verify/verify.mjs sitemap <path-or-slug>` — confirms URL is in dist/sitemap-0.xml
  (article slugs auto-resolve to their /articles/<slug>/ route form)
- `node scripts/verify/verify.mjs seo-gates` — shells to the CI's own gates
  (seo:check-href-slash, seo:check-canonical, seo:check-jsonld, seo:check-routes) as one pass/fail command
- `article` now also checks robots status (index,follow default; flags draft-noindex)

## Coverage contract

The CLI's checks must map 1:1 to the mechanical items in the mailbox-plus-page-checklist skill.
When the skill changes, the CLI changes in the same PR. Judgment items (SB7, fact-check,
visual design) intentionally stay out of the CLI — they live in the skill and review flow.
