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
        - image:exists — HEAD against the R2 CDN; strict-fails on non-200 (skip with --offline)
        - gates:factcheck — requires drafts/<slug>.factcheck.md (>200 bytes) under --strict
        - Astro layout hygiene (no body H1 '# Title', no duplicate featured image embed)
        - banned software terms (PostalMate, Stamps.com, Endicia)
        - word count 400-5300 (workflow target 1200-4000)
        - heading variation: no-retired-headings + heading-diversity (see below)
        - robots status check

    node scripts/verify/verify.mjs articles [--json] [--strict]
      Batch verification across all articles in content/articles/.

    node scripts/verify/verify.mjs review <path.md> [--provider <p>] [--model <m>] [--min-score 80]
      Grades draft against the 5-point adversarial Direct Response copy rubric:
        1. Sensory & Physical Grounding (20 pts)
        2. One-Person Ear & Intimacy (20 pts)
        3. Identity & Status Stakes (20 pts)
        4. Villain Legitimacy & Mechanism (20 pts)
        5. Fluff Density (20 pts)
      Fails closed (exit 1) if overall score is below 80/100.

    node scripts/verify/verify.mjs build
      Runs npm run build, reports page-count delta (catches "build passes but page didn't generate").

    node scripts/verify/verify.mjs sitemap <path-or-slug>
      Confirms URL is in dist/sitemap-0.xml (article slugs auto-resolve to their /articles/<slug>/ route form).

    node scripts/verify/verify.mjs headings [--json]
      Heading-variation report across the whole corpus: article count, H2 count,
      how many H2s are still retired template strings, how many articles are
      legacy-boilerplate, and the 10 most-reused headings.

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

## Heading variation gate

The batch rewrite prompts used to hardcode literal H2 strings, so 58% of every
H2 on the site was one of 8 boilerplate headings (`Bring It In` alone appears
129 times). Structure is frozen — the 9 SB7 slots never change — but the surface
text must vary, so headings are now assigned per article from
`content/heading_banks.json` via `scripts/assign_headings.py` (in the
batch_articles pipeline).

Two checks enforce it:

- `content:no-retired-headings` — a new or changed article may not reuse 3+ of the
  retired template strings. Advisory in standard mode.
- `content:heading-diversity` — max H2-set overlap against any other article, limit
  60% (override with `HEADING_OVERLAP_MAX`). Advisory in standard mode.

Both hard-fail only in `--strict` **and** only for articles added or modified vs
`origin/main`, so the 100-article legacy backlog doesn't drown the signal and
`articles --strict` stays green over the existing corpus. Legacy subjects
(≥60% retired headings) are skipped as subjects but still count in the baseline —
so copying the old template into a new article still fails.

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
