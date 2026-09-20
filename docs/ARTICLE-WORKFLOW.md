# Article Workflow

How articles in `content/articles/` are written. These rules are enforced by CI gates — satisfying them is not optional.

## Style Standard

**Direct Response / Long-Form Persuasion** (Schwartz, Halbert, Sugarman, Collier, Ogilvy, Caples). Deep, researched, emotional, personal, conversational. The goal is moving one reader from awareness to action — not mechanical sentence rules.

- Write to **one person**. "You" — singular, specific, intimate. Never broadcast to a crowd.
- **Enter the conversation** already happening in the reader's head. The headline and lead join it; they don't start a new one.
- **Position by awareness level** (Schwartz): problem-aware titles name the pain; solution-aware compare approaches; product-aware differentiate us.
- **Target narrowly.** One article for one specific person beats one article for everyone.

## Length

| Awareness level                        | Words       |
| -------------------------------------- | ----------- |
| Product-aware (knows the category)     | 1,200–1,800 |
| Problem/solution-aware                 | 1,800–2,500 |
| Unaware (must build the problem first) | 2,500–4,000 |

1,200 words minimum. 4,000 maximum. Long-form out-converts short-form — do not write short.

## Title Rules

- **No pipes.** Never `Problem | Mailbox Plus`.
- **No brand suffix.** Never end with `— Mailbox Plus` or `| Mailbox Plus`.
- **Location must read naturally.** If forcing the town name makes the title awkward, move it into the first paragraph.

## Body Structure

Follow the slot sequence below. **Vary the heading wording** — never reuse the same literal H2 set across articles (CI enforces heading diversity via `scripts/verify/verify.mjs`). Keep each slot's _intent_; make the surface your own.

Batch (location) articles — 9 slots:

1. **Direct Lead** (required opener): three short paragraphs, ~80–120 words — (a) the challenge the reader already knows, (b) the outcome they should expect, (c) one sentence on how we solve it. **No time-of-day scene openers** ("it's 9am and…").
2. **The Villain** — name the mechanism causing the frustration (e.g., "The Franchise Markup") and how it operates in plain sight.
3. **What It Actually Feels Like** — physical evidence of the frustration.
4. **Why It Should Not Be This Way** — the philosophical problem.
5. **What We See Every Day** — we enter as the guide: empathy, authority, independence, multi-carrier counter.
6. **How It Works** — three simple, zero-homework steps.
7. **What You Lose by Not Acting** — time, money, privacy, and the chronic drag of the errand itself.
8. **Your Afternoon After the Change** — the success scene. Include the _emotional release_ (dread gone), not just the clock time.
9. **Bring It In** — the CTA. **Not a brochure.** Tell the reader they don't need everything figured out: "Bring the mess to our counter — absorbing that headache is why we exist."

Comparison articles (X vs Y): same skeleton, plus a full comparison section between slots 5 and 6. **Do not straw-man the competitor** — be honest about what the other option does well. Credibility comes from fairness.

Pillar articles (query-targeted, e.g. `private-mailbox-vs-po-box`): same standards, lighter location references, systemic villain instead of location-specific one.

## Astro & Frontmatter Hygiene

- **No H1 in the markdown body.** The layout renders the title from frontmatter.
- **No featured image in the body.** The layout floats it from frontmatter.
- **No image placeholders for files that don't exist** on the R2 CDN — broken images fail review.
- **Every internal URL ends with `/`** — in frontmatter (`relatedServices`) and in body links. Non-negotiable (see AGENTS.md).
- `status: 'published'` from the start (use Netlify deploy previews for review — that's what they're for).
- Frontmatter requirements: `title`, `description`, `slug`, `category`, `intentKey`, `pubDate`, `image`, `imageAlt`, `keywords`. `intentKey` must be unique repo-wide.
- Pillar conventions: `location: 'concord-township'` unless the article is explicitly about another town; slug is query-targeted (2–5 hyphenated words, no location prefix); `intentKey` matches slug exactly; `relatedServices` up to 3, most relevant first.
- **No trademarked software names** (POS systems, postage software). Refer to them generically: "the point-of-sale software," "what the clerk marks in the system."

## Quick Answer Block (AI Overview / featured-snippet extraction)

- **`quickAnswer` frontmatter is REQUIRED for pillar, comparison, and guide articles** (set `articleType: 'pillar' | 'comparison' | 'guide'`); optional for batch articles. Enforced by `content:quick-answer` in verify.
- **40–80 words**, one paragraph. First sentence answers the `intentKey` query directly; the rest adds the load-bearing facts (carriers, prices, steps, addresses).
- **Must contain at least one concrete number, price, or measurable fact** — a vague "it depends" summary is not extractable and fails verify.
- Written for the skimmer and the machine, not the Direct Response ear — this is the one block allowed to be plain. Persuasion stays in the body.
- Facts in the block follow the same fact-check gate as the body. Never invent a number to satisfy the "concrete" rule.
- The layout renders it as a styled aside between the featured image and the body — do NOT also add a "Quick Answer" heading in the markdown body.

## Hard Gates — in order, before opening the PR

1. **Location verification.** Every address, road, route, and drive time verified against real map data. Never fabricate local detail — locals know. When unsure: "a short drive away."
2. **Fact-check.** Every load-bearing claim (carrier policies, platform workflows, pricing, legal requirements) needs an official source (fedex.com, ups.com, usps.com, retailer help pages). Claims that can't be sourced are removed or softened to "check current rates at the counter" — never published as fact. This is AGENTS.md rule 3 applied to prose.
3. **Copy review ≥ 80/100.**
   ```bash
   npx tsx scripts/review-article-copy.ts content/articles/{category}/{slug}.md
   ```
   Five rubric dimensions (sensory grounding, one-person ear, identity stakes & anxiety dissolution, villain legitimacy, fluff density). The success scene and CTA must dissolve the reader's dread (burden transfer), not pitch like a flyer.
4. **Deterministic verification (strict mode).**
   ```bash
   node scripts/verify/verify.mjs article content/articles/{category}/{slug}.md --strict
   ```
   Covers route targets, trailing slashes, layout hygiene, intentKey uniqueness, word count, banned terms, image existence, heading diversity.
5. **Build.** `npm run build` — zero errors.
6. **Blind-prediction ledger.** Before any article goes live, its predictions (position @ 30 days, clicks/day @ 30 days, one secondary signal — with reasons) are logged in the owner's Content-Ledger. If you (the writing agent) cannot access that ledger, state `ledger-entry: pending` in the PR body so the operator logs it before merge. An article must not publish with no ledger entry and no pending note.

## Never (quick list)

- Pipes or brand suffixes in titles.
- Time-of-day scene openers. Direct Lead always.
- Invented facts, prices, SLAs, policies, or local details.
- H1 or featured image inside the body.
- Short posts (<1,200 words), crowd-voice, or retail-brochure CTAs.
- Straw-manning competitors.
- Trademarked software names.
- Missing trailing slashes on internal links.
- Meta-headings copied from instructions ("The Direct Opening That Names the Problem").
