# This file defines RULES and CONSTRAINTS only. It is not a content source.



You are converting a finalized micro-problem service page into a
Mailbox Plus V2 service config object.

THIS IS A TRANSLATION TASK — NOT A CREATION TASK.

────────────────────────────────
HARD RULES (DO NOT VIOLATE)
────────────────────────────────

1. Output ONLY a single TypeScript object.
2. Do NOT include JSX, comments, markdown, or explanations.
3. Do NOT invent services, pricing, guarantees, partnerships, or policies.
4. Use ONLY information explicitly present in the provided page content.
5. Do NOT add marketing language, urgency, or superlatives.
6. Do NOT mention Cleveland, Cleveland Heights, or any city other than Concord Township.
7. Do NOT surface this page in navigation (search-entry only).
8. If information is unclear or missing, OMIT it — do not guess.

────────────────────────────────
BUSINESS CONTEXT (FIXED)
────────────────────────────────

Business Name: Mailbox Plus  
Address: 7554 Fredle Drive  
City: Concord Township  
State: OH  
ZIP: 44077  

Primary Geo (ONLY): Concord Township  
Category: "micro-problem"  
Visibility: search-only (not listed in navigation)

────────────────────────────────
OUTPUT FORMAT
────────────────────────────────

Return ONE object matching the Service type used in services.ts.

**Allowed Config Fields (Micro-Problem Pages)**
 Only the following fields may appear in the output:
 `id, category, city, serviceName, slug, pageTitle, metaDescription, heroTitle, heroSubtitle, heroImage`

Any other fields must be omitted.

Populate ONLY these fields:

- id  
  → kebab-case  
  → short, intent-based (no city names)

- category  
  → "micro-problem"

- city  
  → "Concord Township"

- serviceName  
  → Plain English description of the problem  
  → No city names

- slug  
  → SEO-safe  
  → No city names  
  → Based on the micro-problem

- pageTitle  
  → Must include "Concord Township"  
  → No hype, factual only

- metaDescription  
  → 150–160 characters  
  → Calm, factual, reassurance-focused  
  → No guarantees, no pricing claims

- heroTitle  
  → Problem-focused  
  → No city names

- heroSubtitle  
  → Reassuring and descriptive  
  → No absolutes, no promises

- heroImage  
  → If no specific image is implied, always use `getServiceImageUrl("/images/micro/pack-ship.webp")`
  
  → Do NOT invent imagery concepts

Canonical URLs are generated programmatically from slug + siteConfig.baseUrl.

────────────────────────────────
CONTENT SOURCE
────────────────────────────────

Use ONLY the content between the markers below.

--- BEGIN PAGE CONTENT ---

--- END PAGE CONTENT ---

────────────────────────────────
FINAL INSTRUCTION
────────────────────────────────

Output ONLY the config object.

If any field is not explicitly allowed, it must be omitted.

No extra text.
No validation messages.
No assumptions.