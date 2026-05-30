- ## Mailbox Plus — Micro-Problem Pages (V2 Dynamic Route)

  ### SYSTEM CONTEXT

  You are working inside the **Mailbox Plus V2 React + TypeScript codebase**.

  Micro-problem pages are **not individual page files**.
  They are **data-driven pages rendered by a single dynamic route** using `ServicePageV2`.

  Your job is to **extend configuration and/or the dynamic page logic**, never to create new page shells.

  ***

  ## 🚨 NON-NEGOTIABLE RULES (HARD FAIL IF VIOLATED)

  ### 1. Canonical Page Shell

  **All micro-problem pages MUST use `ServicePageV2` from:**

  ```
  src/components/ServicePageV2.tsx
  ```

  ❌ Do NOT import or reference `ServicePage.tsx`
  ❌ Do NOT create alternate page shells
  ❌ Do NOT wrap or modify `ServicePageV2`

  ***

  ### 2. Single Dynamic Route Only

  There MUST be **exactly one** micro-problem page component:

  ```
  src/pages/micro/MicroProblemPage.tsx
  ```

  ❌ Do NOT create files like:
  - `ReturnWithoutBoxPage.tsx`
  - `NoPrinterReturnsPage.tsx`
  - Any per-problem `.tsx` file

  All micro-problems are rendered by **this one page**.

  ***

  ### 3. Config Is the Source of Truth

  Each micro-problem is defined by **one config object**.

  You MUST:
  - Put all page-specific content in config
  - Treat pages as **data, not code**
  - Avoid duplicated strings inside JSX

  Allowed:
  - `empathyCopy`
  - `whatWeDo[]`
  - `whatToBring[]`
  - `whoItsFor[]`

  ❌ No inline SEO copy
  ❌ No fallback logic per page
  ❌ No computed content

  ***

  ## 4. URL & Routing Contract

  Micro-problem URLs follow this pattern:

  ```
  /<category>/<slug>
  ```

  Examples:

  ```
  /returns/return-without-box
  /shipping/fragile-item
  /printing/no-printer
  ```

  The dynamic page must:
  - Read the URL param
  - Find the matching config entry
  - Render it using `ServicePageV2`

  ***

  ## 5. Required Dynamic Page Structure

  The dynamic page MUST:
  - Look up the service using `slug` + `category === "micro-problems"`
  - Render **only content sections** inside `ServicePageV2`
  - Reject invalid slugs by redirecting to `/404`

  No guards, no experiments, no alternate flows.

  ***

  ## 6. Required Section Order (Fixed)

  Every micro-problem page renders sections in this exact order:
  1. **Empathy / Problem Framing**
     `my-8 max-w-3xl`
  2. **What We Do**
     `my-10`
  3. **What to Bring**
     `my-10 bg-gray-50 rounded-xl p-6`
  4. **Who This Is For**
     `my-10`
  5. **Local Context**
     `my-10 max-w-3xl`
  6. **Soft CTA**
     `my-12`
     (Text only, `InternalLink`, no buttons required)

  Tone must be:
  - Calm
  - Human
  - Operational
  - Non-promotional

  ***

  ## 7. V2 DESIGN ENFORCEMENT

  Micro-problem pages **do not define design**.

  They inherit **all styling, motion, layout, hero, SEO, and structure** from `ServicePageV2`.

  ❌ Do NOT restate V2 rules
  ❌ Do NOT implement glassmorphism, gradients, or motion
  ❌ Do NOT modify spacing beyond the defined section wrappers

  If a page does not visually match existing V2 service pages, it is incorrect.

  ***

  ## 8. Output Rules

  Your output must be:
  - Production-ready TypeScript
  - Free of commentary
  - Free of TODOs
  - Free of explanations
  - Free of design experimentation

  ***

  ## 🚫 AUTO-REJECT CONDITIONS

  Reject your own output if you:
  - Import `ServicePage.tsx`
  - Create per-problem page files
  - Add pricing, urgency, or marketing language
  - Repeat city names unnaturally
  - Re-implement design rules
  - Add conditional layout logic

  ***

  ## FINAL CONSTRAINT (LOCKED)

  **Micro-problem pages scale by configuration, not files.**
  **Design authority lives in `ServicePageV2`.**
  **The dynamic route is the only allowed page.**
