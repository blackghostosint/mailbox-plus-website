# Mailbox Plus Ohio — Unified Source of Truth

> **Status:** Canonical owner-approved reference (verified 2026-11-21, Frank Schwarz)  
> **Core Rule:** If a Mailbox Plus store capability, price, policy, or claim is not in this document, it is **not approved** to be said, published, promised, or implied without explicit owner sign-off.  
> **Machine-synced companions:** `content/facts.json`, `content/approved-store-claims.json`, and `scripts/verify/check-source-of-truth.mjs`.

---

## 1. Store Identity, Location & Hours (Canonical)

- **Brand / DBA Name:** Mailbox Plus
- **Legal Business Name:** `Mailbox Plus Ohio, LLC`
- **Tagline / Positioning:** `"Shipping shouldn't cost you an hour."` Independent local pack-and-ship store — **not a franchise**, not owned by any carrier (PR #953, #791, #821). Mental substitute for The UPS Store / FedEx Office; bold, sassy, local.
- **Founding Year:** `2024` | **Official Opening:** `May 5, 2025`
- **Address:** `7554 Fredle Drive, Concord Township, OH 44077`
- **Coordinates:** `41.664989741819, -81.24164826876654`
- **Google Maps Pin:** `https://maps.app.goo.gl/Rs1NQkR6gRrtxAq37`
- **Phone:** `(440) 709-1946` (`440-709-1946`) | **Email:** `help@mailboxplusohio.com` | **Website:** `https://mailboxplusohio.com/`
- **Hours:**
  - **Monday–Friday:** `9:00 AM – 6:00 PM`
  - **Saturday:** `9:00 AM – 2:00 PM`
  - **Sunday:** **Closed**
  - **Holidays:** Closed on major holidays (observed-Monday rule).
- **Location / Plaza / Road Rules (STRICT):**
  - **Plaza:** **Gristmill Village**, next to **Pub Frato**.
  - **Roads:** Fredle Drive runs between **Auburn Road and Crile Road**, adjacent to **SR-44**. Access road for copy: **Crile Road**.
  - **Approved phrasing for articles:** `"just off Crile Road, minutes from SR-44 and I-90"`
  - **NEVER say:** `"Route 306"` / `"SR 306"` / `"just off Route 306"` / `"on Route 306"` (OH-306 is ~3 miles west and does not touch Fredle Drive; valid ONLY when describing a reader's own Kirtland-area streets — PR #1011).
  - **NEVER say:** `"Capital Plaza"` or `"Pet Supplies Plus"` (stale programmatic-SEO junk in legacy configs — WRONG).
  - **Drive times:** Must come from a live OSRM query (town center/hall → store coordinates), be recorded in `.factchecks/<slug>.factcheck.md`, and match consistently across meta description, body, and receipt (PR #1012).

---

## 2. Shipping, Packing & Carrier Capabilities

### Approved Store Claims (No `⏳ awaiting Frank` needed)

- **All four major carriers:** Authorized shipping center and drop-off outlet for **USPS, UPS, FedEx, and DHL** (PR #821, #879, #904).
- **Rate comparison:** `"We pull live rates from all four carriers — UPS, FedEx, USPS, and DHL — side by side"` (use **"pull"**, not "put" — PR #754, #791).
- **Packing, boxes & custom box making:** Boxes for sale (many sizes plus custom boxes), **custom box making built in-house**, and full-service professional packing for fragile/high-value items. Staff boxes, custom-packs, tapes, weighs, and prints labels at the counter for items brought in unboxed or untaped (PR #724, #947).
- **Pre-labeled drop-offs:** Accepts pre-labeled drop-off packages for UPS, FedEx, USPS, and DHL.
- **International shipments (STRICT):** **Pre-labeled international drop-offs accepted; NO in-store international shipment processing** (owner confirmed 2026-11-21; PR #460/#462).
- **Label printing service:** **`$2.00 flat`** (customer emails PDF, we print — NOT `$1–$2`).
- **Re-seal / tape-check service:** **`$1.00`** (`content/facts.json`, PR #457).
- **Shipping insurance / declared-value coverage:** Third-party shipping insurance / declared-value coverage through **Marsh**, an established insurer, with coverage available up to **$50,000 per package** when packing meets the policy's standard (PR #828).
- **Certified Mail:** Can accept a Certified Mail letter and stamp **PS Form 3800** (PR #953).
- **Alcohol (outbound & inbound):** **Cannot** ship consumer alcohol outbound (`"we can't take your bottle outbound either. Not won't — can't."` — PR #894). **Can** receive inbound alcohol shipments, and we sign for the deliveries if needed (owner confirmed 2026-11-21). Citing published carrier alcohol rules IS publishable.
- **Visit speed (approved phrasing):** `"most visits are done in under ten minutes"` is approved (PR #725).
- **Pricing philosophy:** We compete on **trust, convenience, expert packaging, and friendly service** — we do **NOT** compete on lowest price.

### Explicitly FALSE / Forbidden Claims (Never Write)

- **NEVER** say `"We keep USPS/Certified Mail forms in stock and fill them out for you"` or that we do USPS forwarding/COA paperwork for customers (PR #953, #957).
- **NEVER** say `"we'll read the scans with you... and help you pull together a Missing Mail search / service request / insurance claim"` (PR #904).
- **NEVER** say `"Sizing up the surcharge stack on your package is our job"` — carriers dictate surcharges, not Mailbox Plus (PR #791).
- **NEVER** promise `"never get a door tag"` / `"No door tag will ever be involved"` (PR #1002).
- **NEVER** say `"we are mail experts"` — use **`"we are package experts, not your attorneys… we cannot give legal advice"`** (PR #829).
- **NEVER** say `"Your refund doesn't move until the return does"` (PR #748).
- **NEVER** claim Mailbox Plus processes outbound international shipments or fills out international customs forms in-store — **pre-labeled international drop-offs ONLY** (owner confirmed 2026-11-21; PR #460/#462).
- **NEVER** promise `"Guaranteed delivery"` (unless citing a specific carrier-guaranteed service) or `"Unlimited"` (unless defined in a contract).
- **BATTERY & HAZMAT CONTENT HOLD (2026-10-14):** **NO battery/hazmat shipping articles** ship until Frank personally researches USPS Pub 52 / 49 CFR / UPS & FedEx battery rules and signs off Rule 3. Never write unapproved counter-handling promises for batteries, alcohol, or dangerous goods.

---

## 3. Returns & Equipment Drop-Offs

### Approved Returns & Drop-Offs

- **QR-code boxless returns (EXACT 3 programs accepted):**
  1. **Happy Returns Bar** — official location (`#1` locator for `44077`; scan QR, bag, receipt — no box or label needed).
  2. **FedEx Easy Returns** — QR-code returns accepted (no box or label needed).
  3. **USPS Label Broker** — QR-code label printing supported.
- **Other accepted return partners & drop-offs:**
  - **Nuuly**
  - **Vinted** (pre-labeled / supported drop-offs via **SpeedX, FedEx, or USPS** per `https://www.vinted.com/help/234` — NEVER call the service `"Vinted Go"`)
  - **SpeedX** drop-off location (carriers UPS, FedEx, DHL, SpeedX pick up from our counter)
  - **Pre-labeled returns** via UPS (incl. UPS prepaid return labels), FedEx, USPS, and DHL.
- **Amazon returns (STRICT RULE):** Accepted **ONLY with a pre-printed carrier label** already on the package. **NO Amazon QR codes accepted.** We are **NOT** an official Amazon hub or Amazon return desk. (The `/amazon-counter/` campaign page is the ONLY context where pushing to become an official Amazon drop-off may appear.)

### Explicitly FALSE / Forbidden

- **NEVER** imply we accept **Amazon QR codes** or act as an official Amazon return desk / Hub (PR #1010, #1007).
- **NEVER** claim we accept **AT&T, Verizon, Spectrum, Cox, or Xfinity** carrier equipment returns (franchise-only programs). We will tell customers where they can take their equipment (PR #823). **NEVER pitch carrier equipment-return articles.**
- **NEVER** call Vinted `"Vinted Go"` (use `Vinted (via SpeedX, FedEx, or USPS)` — PR #1011).

---

## 4. Private Mailbox Rentals (PMB) & Pricing Rules

### Canonical Published Pricing (Live from `/private-mailbox-rental/` & `/home-business/mailbox-rental/`)

**Personal / Everyday PMB Tiers (new customers — from $15/mo, month-to-month only):**

| Tier                     |    Monthly | Included                                                                                                                            |
| ------------------------ | ---------: | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Small · Mail Only**    | **$15/mo** | Bare: real street address + unit `#`, behind counter — **mail only** (no carrier package receiving, no signing, no notifications)   |
| **Small · +10 Packages** | **$25/mo** | All 4 carriers deliver, we sign **if required**, **10 packages/mo** included (then `$5/pkg`), free text + email alerts              |
| **Large · Mail Only**    | **$30/mo** | Bare: roomier box for bulk mail, behind counter — **mail only** (no package receiving, no signing, no notifications)                |
| **Large · +10 Packages** | **$40/mo** | Roomier box, all 4 carriers deliver, we sign **if required**, **10 packages/mo** included (then `$5/pkg`), free text + email alerts |

**Business Class PMB Tiers (new customers — from $35/mo, month-to-month only):**

| Tier                                |    Monthly | Included                                                                                                                                                                                                                                                                       |
| ----------------------------------- | ---------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Business Small** _(Most Popular)_ | **$35/mo** | Real business filing address (LLC/DBA, website, cards, vendors), all 4 carriers, we sign **if required**, **10 packages/mo** included (then `$5/pkg`), text + email alerts, **up to 3 authorized recipients**, **Digital Business Card page + 250 business cards** (first run) |
| **Business Large**                  | **$50/mo** | Everything in Business Small + roomier box for bulk mail, **25 packages/mo** included (then `$5/pkg`), **free notarizations included**, **1 mail-forwarding batch/mo** (shipping at cost)                                                                                      |

**Shared PMB Fees, Terms, Virtual Mail & Setup:**

- **Real street address formatting:** Use `#` or `PMB` — **NEVER `Suite`**.
- **Contract / commitment wording:** **`"Month-to-month, no term commitment, cancel anytime"`** (no annual, no 3/6/12-month lock-in, no cancellation fee, no notice period — PR #594, #1008, #1012).
- **Package overage:** **`$5.00 per package`** beyond monthly allowance (10 on +10 / Business Small; 25 on Business Large).
- **Oversized packages:** Over `18"` length OR `20 lbs` = **`$5.00 flat`**.
- **Long-hold storage:** Held longer than `5 days` = **`$1.00/package/day`**.
- **Key deposit:** **`$5.00` refundable** when you cancel and return the key (PR #898).
- **Notifications:** Free 4-hour text + email notifications on **package-receiving & business tiers ONLY**; Mail-Only tiers are bare (no notifications).
- **Signatures:** `"we sign for your deliveries if required"` — **ONLY qualified as "if required"** (PR #898), and anchor sign-for claims at `$25+` (never `$15` Mail-Only).
- **Setup:** Mandatory one-time in-person **USPS Form 1583** (~10 minutes) with two valid forms of ID (primary photo ID + secondary proof of current address); each authorized recipient needs their own ID check.
- **Grandfathering:** Existing customers keep their current rate — published pricing is for new customers.
- **Virtual Mail:** Third-party providers **`Anytime Mail`**, **`iPostal1`**, and **`PostScan`**.
- **Mail Forwarding:** Offered.
- **Package Receiving:** Offered for **both mailbox holders and non-holders**. Non-holder walk-in package receiving fee is **`$10.00/package`** (owner confirmed 2026-11-21; PMB holder overage beyond plan allowance is `$5.00/package`).

### Explicitly FALSE / Forbidden

- **NEVER** use **`"no annual contract"`** — use **`"no term commitment"`** (PR #1012).
- **NEVER** use **`"30-day risk-free"`** or unapproved guarantee/offer language (PR #1009 / W8 P2).
- **NEVER** use **business-use framing on personal/consumer PMB tiers** — business use ALWAYS = Business Small (`$35/mo`) or Business Large (`$50/mo`).
- **NEVER** cite **`"$35/month"`** as the _personal_ mailbox starting price (personal starts at `$15/mo` mail-only / `$25/mo` with packages; `$35/mo` is **Business Small** only — PR #1008, #1009).
- **NEVER** claim Mail-Only tiers include package receiving, signing, or notifications.
- **NEVER** invent **`"$30 per month unlimited"`** receiving fees (PR #1008, #1012). (Non-holder walk-in receiving is `$10/package`; PMB overage is `$5/package`.)
- **NEVER** use **`"24/7 access"`** or `"24-hour"` anything — access and services are during **regular store hours only**.

---

## 5. Notary, Printing, Fax, Shredding, EDDM & In-Store Services

### Approved

- **Notary Public:** Walk-in notary during all store hours (Mon–Fri 9–6, Sat 9–2, Sun closed — PR #824). **`$5.00 per signature/notarization`** (Ohio statutory fee cap). Can notarize and ship documents (e.g., for Ohio apostille to Columbus) in a single transaction (PR #895, #829).
- **Copies & Document Printing (In-House):** B&W and color copies (collated/sorted) and document printing from USB/email/cloud, single/double-sided, sizes **`8.5×11`, `LEGAL`, `11×17`** (PR #663).
- **Laminating (In-House):** Yes, **up to `8.5×11` (letter size)**.
- **Graphic Design (In-House):** We actually design (logos, layouts, etc.).
- **Outsourced Print Products (ORDERED — NOT printed on-site):** **Business cards, flyers & brochures, postcards, posters, banners, and custom prints** are ordered through a third party (PR #663).
- **EDDM (Every Door Direct Mail):** We process **and** design, including mailing and zones.
- **Digital Fax:** Digital fax send **and** receive — **no customer-operated physical fax machine and no printed confirmation slip**.
- **Shredding:** Drop-off only, commercial + personal, **`$1.00/lb`, no minimum, staples OK**, **Certificate of Destruction** provided (overrides stale `$1.25/lb` copy).
- **Document Scanning:** Virtually any format/volume — offered in store.
- **Digital Fingerprinting / Background Checks:** **Live Scan (Ohio BCI/FBI)** via the **`fastfingerprints.com`** program — offered in store.

### Explicitly FALSE / Forbidden

- **NEVER** claim **`"everything prints here on our own equipment"`** or that business cards/posters/banners print on-site (PR #663).
- **NEVER** claim **passport photos** — planning only, **NOT offered in store**.
- **NEVER** claim **Rewards / Plus Points** — **NOT live yet**.
- **NEVER** cite stale **`"$1.25/lb"`** shredding pricing (canonical is `$1.00/lb`).
- **NEVER** invent competitor/reseller pricing (e.g., `"$200 apostille assembly fee"` — PR #895) unless backed by a live source URL in `.factchecks/`.

---

## 6. Live Carrier Information Rule (FedEx, UPS, USPS, DHL)

**Two-Layer Rule — NEVER store volatile carrier rates/policies in this file, and NEVER rely on LLM memory:**

1. **This document (`docs/SOURCE_OF_TRUTH.md`) covers Mailbox Plus store truth ONLY** — facts Frank controls.
2. **All carrier facts (FedEx, UPS, USPS, DHL) MUST be pulled live at draft time** from official carrier domains (`usps.com`, `ups.com`, `fedex.com`, `dhl.com`) — **never from model memory** and never from old articles.
   - This applies to: shipping rates, surcharges, dimensional-weight divisors, oversize/weight limits, transit windows, holiday cutoff dates, insurance/declared-value caps, prohibited/restricted items, and carrier return rules.
   - Local carrier FAQ datasets (e.g., `fedex-faq-dataset`) may be used **only as a URL index** to locate the official carrier page to fetch live — never as a static answer cache without re-fetching.
   - Every carrier claim in an article MUST be recorded in `.factchecks/<slug>.factcheck.md` with: **official URL + access date (`YYYY-MM-DD`) + verbatim quoted sentence** settling the claim. If a live official source cannot be fetched, soften or remove the claim.

---

## 7. Standing Editorial & Workflow Rules (Shared by Writer + Reviewer)

1. **No invented numbers/SLAs/superlatives:** Never invent turnaround promises (`"in under 3 minutes"`, `"in two minutes"`, `"guaranteed same-hour"`), superlatives (`"cheapest"`, `"best"`, `"#1"`, `"lowest price"` — exception: Happy Returns `#1 locator for 44077`), or volume counts (`"thousands of packages"`, `"decades"`).
2. **Qualitative texture is allowed:** Hedged words like `"often"`, `"typically"`, `"usually"` are pre-approved — do not trigger L3 objections on them (PR #782 ruling).
3. **Skip uninteresting carrier news fluff:** Basic carrier news that isn't useful to local customers should not be published (PR #961).
4. **Receipt ↔ Copy Sync:** Every edited claim in an article MUST match its `.factchecks/<slug>.factcheck.md` receipt row verbatim (PR #1012).
5. **No Netlify deploy previews:** Permanently disabled repo-wide; never flag missing previews.
6. **Trailing slashes:** Every internal same-site link (including `public/llms.txt`) must end with `/`.
