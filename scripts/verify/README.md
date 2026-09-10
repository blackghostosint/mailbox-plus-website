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
        - title rules (no pipes '|', no 'Mailbox Plus' brand suffix)
        - slug kebab-case, pubDate valid
        - intentKey uniqueness across all articles in content/articles/
        - internal links >= 2 (gate in --strict; advisory otherwise — legacy tolerance)
        - trailing slashes on all internal links (CI-enforced rule)
        - internal link targets exist in valid routes (catches 404 targets)
        - relatedServices canonical form & target route existence
        - featured image + descriptive imageAlt (R2 path shape)
        - Astro layout hygiene (no body H1 '# Title', no duplicate featured image embed)
        - banned software terms (PostalMate, Stamps.com, Endicia)
        - word count 400-5300 (workflow target 1200-4000)
        - robots status check

    node scripts/verify/verify.mjs articles [--json] [--strict]
      Batch verification across all articles in content/articles/.

    node scripts/verify/verify.mjs build
      Runs npm run build, reports page-count delta (catches "build passes but page didn't generate").

    node scripts/verify/verify.mjs sitemap <path-or-slug>
      Confirms URL is in dist/sitemap-0.xml (article slugs auto-resolve to their /articles/<slug>/ route form).

    node scripts/verify/verify.mjs seo-gates
      Shells to the CI's own gates (seo:check-href-slash, seo:check-canonical, seo:check-jsonld, seo:check-routes)
      as one pass/fail command.

    Exit codes: 0 pass, 1 failures, 2 usage error.

## Policy: corpus reality vs checklist aspiration

Rules enforced here are calibrated against the live corpus (172 articles) and
the CI gates. Where the checklist skill aspires to a standard the existing
corpus doesn't meet (min 2 links, legacy H1s, non-canonical relatedServices slashes),
the CLI flags advisory by default in standard mode and gates hard with --strict.
New articles MUST be run with --strict in the PR flow.

## Wiring

- Pre-PR (manual or agent): `node scripts/verify/verify.mjs article <path> --strict`
- Batch sweep: `node scripts/verify/verify.mjs articles`
- Full CI pre-flight:
  1. `node scripts/verify/verify.mjs doctor`
  2. `node scripts/verify/verify.mjs article <path> --strict`
  3. `node scripts/verify/verify.mjs build`
  4. `node scripts/verify/verify.mjs sitemap <slug>`
  5. `node scripts/verify/verify.mjs seo-gates`

## Coverage contract

The CLI's checks map 1:1 to the mechanical items in the `mailbox-plus-page-checklist`
and `article-writing-workflow` skills. When skills change, the CLI changes in the
same PR. Judgment items (SB7, fact-check against official carrier sources, visual design,
blind predictions in the vault ledger) intentionally stay in their respective review flows.
