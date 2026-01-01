# GEMINI.md - Micro-Problem Governance & Architecture

## 1. Project Identity & Context

Mission Statement: To reduce real-world customer friction by providing highly specific, data-driven landing pages for niche shipping, packaging, and return issues.

Business Logic:

- **Source of Truth**: The TypeScript configuration files in `src/config/micro-problems/` are the sole authority for page content.
- **Intent-First**: Each page must solve a unique real-world problem. If a page does not reduce friction, it is slated for deletion.
- **Data-Driven**: Page lifecycle decisions (KEEP, MERGE, REWRITE, DELETE) are dictated by Google Search Console data and staff feedback, not personal opinion.

**Target Audience**:

- **Public Users**: Customers searching for specific shipping or return solutions in Concord Township, Ohio and surrounding areas.
- **Internal Staff**: Mailbox Plus employees who use these pages to clarify service boundaries and reduce explanation time.

## 2. Technical Stack & Architecture

Frontend: React 18.3.1 (SPA) built with Vite 5.4.21.

Styling: TailwindCSS 3.4.1 using a utility-first approach.

Infrastructure: Node.js 18+ environment; local development via Vite dev server.

**Folder Map**:

- `/src/config/micro-problems`: Domain-specific configuration shards (returns.ts, shipping.ts, etc.).
- `/src/components`: UI components including Radix UI accordions and Framer Motion animations.
- `.agent/workflows`: Automated audit and maintenance protocols.

## 3. Engineering Standards

**Code Style**:

- **TypeScript Strict Mode**: Mandatory.
- **Naming**: CamelCase for functions/variables; IDs must be URL-friendly slugs.
- **Mandatory Fields**: Every micro-problem config **must** include a unique `intentKey` for Signal C validation.

**UI/UX**:

- **Mobile-First**: Optimized for customers on the go.
- **SEO**: Metadata managed via `react-helmet-async`.

**Performance**:

- **Image Optimization**: Use optimized loading for all landing page assets.
- **Bundle Splitting**: Vendor chunking for React and Framer Motion to ensure fast initial loads.

## 4. Operating Protocols (AI Persona)

**Workflow (PRAR)**:

1. **Perceive**: Read the existing config shard (e.g., `shipping.ts`) and audit signals (Search Console/Staff Logs).
2. **Reason**: Apply the **Micro-Problem Page Decision Flowchart** to determine the page's status.
3. **Act**: Execute the decision (DELETE config, MERGE copy, or REWRITE hero text).
4. **Refine**: Run `npm run lint` and `npm run typecheck` to verify the modified config.

**Documentation Mandate**: All changes must be logged in `PROJECT_UPDATES.md` with the specific Signal (A, B, or C) that triggered the change.

**Verification**: Use `cat` or `grep` to verify that `intentKey` duplicates were removed after a MERGE or DELETE operation.

## 5. Testing & Audit Strategy

**The TDD Cycle**:

1. Write a failing test case that checks for a missing or duplicate `intentKey`.
2. Update the config shard to satisfy the governance requirement.
3. Execute `npm run audit:micro-problems` to ensure the site structure remains valid.

**Audit Frequency**: Mandatory review every 90 days (March, June, September, December).

## 6. Security & Deployment

Secret Management: Ensure the Resend API key and reCAPTCHA keys are never hardcoded; use .env.

CI/CD: Automated sitemap generation via vite-plugin-sitemap must run after every config change to reflect deleted or merged pages.

## 7. Known Issues & Quirks

- **Signal A Latency**: Search Console data has a 2-3 day lag; always use the "Last 90 Days" filter for consistency.
- **Redirect Policy**: Per Governance Policy, do **not** create 301 redirects for deleted micro-problem pages; allow them to 404 to clean the index naturally.

------

**Next Step**: Would you like me to generate the **Q1 Audit Report** template based on this new `GEMINI.md` structure?