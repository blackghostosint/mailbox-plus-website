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
