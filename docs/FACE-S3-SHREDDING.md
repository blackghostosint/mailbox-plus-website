# Face S3 — Paper-Trail Protector (Shredding)

**Date:** 2026-06-25 (created), 2026-07-30 (finalized)
**Author:** Marcus (SB7 BrandScript framework)
**Status:** Canonical — Final

---

## 1. Face Profile

| Field           | Value                                                                                                                                                                                                                    |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **ID**          | S3                                                                                                                                                                                                                       |
| **Name**        | Paper-Trail Protector                                                                                                                                                                                                    |
| **Service**     | Shredding / Document Destruction                                                                                                                                                                                         |
| **Page URL**    | `/home-business/shredding`                                                                                                                                                                                               |
| **Core Hook**   | _"Your tax returns are sitting in a box in your garage. Anyone who opens it has everything they need."_                                                                                                                  |
| **Description** | Local residents and small business owners who have accumulated years of sensitive documents — tax returns, bank statements, medical records — and need them destroyed permanently. They know the risk but haven't acted. |
| **Page Type**   | Commodity service (80/20) — serves searcher intent for "shredding near me" or "document shredding concord township"                                                                                                      |

---

## 2. Depth Data

### 2.1 The Villain: The Curb-Side Data Leak

Every recycling bin, trash bag, and unsecured paper pile is an identity thief's treasure hunt. The mechanism: personal documents thrown away intact are accessible to anyone with five minutes and no shame.

### 2.2 The Three Levels of Problem

| Level             | Statement                                                                                                                                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **External**      | Old tax returns, bank statements, and medical bills are piling up in your garage or home office. Your home shredder jams after three pages. You can't keep up.                                                |
| **Internal**      | You know those boxes are a liability. Every year they grow. You feel like you're sitting on a time bomb — one break-in, one stolen recycling bin, and your entire financial history is in a stranger's hands. |
| **Philosophical** | A person's financial and medical history should not be accessible from a curbside recycling bin.                                                                                                              |

### 2.3 Story Gap

> "What's in your recycling bin right now that could let a stranger open a credit card in your name?"

### 2.4 Loss Statement

> Every year you don't shred, that pile grows. Identity theft from dumpster-diving is real — and it takes years to undo.

### 2.5 Aspirational Identity

| From                                                                    | To                                                                                            |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Someone sitting on a paper time bomb, anxious about what's accumulating | Clutter-free, protected, with an auditable Certificate of Destruction proving the job is done |

### 2.6 Sound Bite

> "Your tax returns are sitting in a box in your garage. One stranger, one recycling bin, and your entire financial history is gone. Mailbox Plus shreds on-site immediately — $1 per pound, no minimum, and you get a signed Certificate of Destruction."

### 2.7 One-Liner

> We help residents and small businesses who have years of sensitive documents piling up get them destroyed immediately on-site with P-4 micro-cut security and a physical proof of destruction.

### 2.8 Affirmation

> "You did it. Those documents are gone for good. Your home is cleaner, your identity is safer, and you have the proof in your hand. That's peace of mind."

---

## 3. Stakes

| Type            | Statement                                                                                                         |
| --------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Tangible**    | Identity thieves go through recycling bins. One document with your SSN, bank account, or DOB is all they need.    |
| **Emotional**   | You can't relax knowing those boxes are still there. Every tax season adds another layer to the pile.             |
| **Opportunity** | Once shredded at Mailbox Plus, the liability is gone immediately. You walk out with a Certificate of Destruction. |

---

## 4. Cross-Sell Frame

> Protecting sensitive docs? A Mailbox Plus private mailbox keeps sensitive mail off your porch first — before it ever needs shredding.

---

## 5. SB7 Spine → Page Section Mapping

### 5.1 Section Map

| #   | Section                 | SB7 Position                    | Component Mapping                                                | Wireframe Status |
| --- | ----------------------- | ------------------------------- | ---------------------------------------------------------------- | :--------------: |
| 1   | **Hero**                | Character + Problem + CTA       | `heroTitle` + `heroSubtitle`                                     |     ✅ Done      |
| 2   | **The Villain Named**   | Problem (all 3 levels)          | `content[0]` — "The Risk Sitting in Your Trash Can"              |     ✅ Done      |
| 3   | **The Guide**           | Guide (Empathy + Authority)     | `content[1]` — "Immediate On-Site P-4 Destruction"               |     ✅ Done      |
| 4   | **The Plan (Pricing)**  | Plan (Agreement)                | `content[2]` — "Simple, Flat-Rate Pricing: Just $1.00 per Pound" |     ✅ Done      |
| 5   | **The Plan (Process)**  | Plan (3-Step)                   | `content[3]` — "No Home Shredder Jams, No Paper Dust"            |     ✅ Done      |
| 6   | **Features Strip**      | Stakes / Guide (Authority)      | `features` — 3 warm glass cards                                  |     ✅ Done      |
| 7   | **Success**             | Success (Aspirational Identity) | `content[4]` — "Our Official Certificate of Destruction"         |     ✅ Done      |
| 8   | **Social Proof / FAQs** | Guide (Authority)               | `faqs` — Shredding-specific Q&A accordion                        |     ✅ Done      |
| 9   | **Cross-Sell**          | CTA (Transitional)              | `content[5]` — "Stop the Leak Before It Hits Your Porch"         |     ✅ Done      |
| 10  | **Final CTA**           | CTA (Direct + Transitional)     | `cta` prop — "Ready to Destroy Your Paper Trail?"                |     ✅ Done      |

### 5.2 Content Array Ordering (Final)

| Index | Section Heading                                   | SB7 Position                                      |
| ----- | ------------------------------------------------- | ------------------------------------------------- |
| 0     | "The Risk Sitting in Your Trash Can"              | Problem — Villain named (The Curb-Side Data Leak) |
| 1     | "Immediate On-Site P-4 Destruction"               | Guide — Empathy + Authority                       |
| 2     | "Simple, Flat-Rate Pricing: Just $1.00 per Pound" | Plan — Pricing / Agreement                        |
| 3     | "No Home Shredder Jams, No Paper Dust"            | Plan — 3-Step Process                             |
| 4     | "Our Official Certificate of Destruction"         | Success — Aspirational Identity                   |
| 5     | "Stop the Leak Before It Hits Your Porch"         | Cross-Sell — Transitional CTA                     |
| 6     | "Compliance & Security"                           | Authority Detail — FACTA, HIPAA, GLBA             |

---

## 6. Hero Section (5-Element SB7 Hook)

1. **Hero in a hole:** You have a decade of tax returns, bank statements, and medical bills piling up in your garage. Your home shredder jams after three pages. You know they're a liability.
2. **Stakes:** Identity thieves don't need to hack a database. They go through recycling bins. One document with your SSN, DOB, or bank account is all it takes to open credit in your name.
3. **Unique solution:** Mailbox Plus shreds your documents on-site, immediately. P-4 micro-cut. You can watch us destroy them. You walk out with a signed Certificate of Destruction.
4. **Transformation proof:** $1.00/lb. No minimum. No appointment. Drop off. We weigh. We shred. You leave with proof.
5. **Guide affirms:** "That's it. Gone. You're protected. That's peace of mind."

**Live hero copy:**

```
heroTitle = "Your Private Documents. Permanently Gone."
heroSubtitle = "Immediate, on-site P-4 micro-cut shredding in Concord Township. Simple flat-rate pricing of $1.00 per pound with no minimums. Watch us shred."
```

**Verdict:** ✅ All 5 elements fire in two lines. No change needed.

---

## 7. Design Treatment

| Element        | Treatment                                                                          |
| -------------- | ---------------------------------------------------------------------------------- |
| Hero           | Navy gradient (deep privacy/stakes positioning)                                    |
| CTAs           | Gold / terracotta accent on navy                                                   |
| Content cards  | Warm bg panels per ServicePageV2 standard                                          |
| Features strip | Warm glass cards with icon circles                                                 |
| CTA section    | Brand gradient glass — deep navy + warm accent                                     |
| Carrier logos  | **Hidden** (`hideCarrierLogos: true`) — shredding is not a shipping/parcel service |

---

## 8. Implementation Configuration (document-services.ts)

```ts
id: 'shredding',
category: 'document-services',
slug: '/home-business/shredding',
hideCarrierLogos: true,
// heroTitle, heroSubtitle, content[], features[], cta, faqs — all fully implemented
// See src/config/services/document-services.ts for complete config
```

### Config Checklist

| Element                                                 | Status  |
| ------------------------------------------------------- | :-----: |
| `hideCarrierLogos: true`                                | ✅ Done |
| Villain named ("The Curb-Side Data Leak") in content[0] | ✅ Done |
| Guide section (on-site, immediate, P-4)                 | ✅ Done |
| Pricing ($1.00/lb, no minimums)                         | ✅ Done |
| Process plan (3-step drop-off)                          | ✅ Done |
| Certificate of Destruction (Success)                    | ✅ Done |
| Features strip (3 items)                                | ✅ Done |
| FAQs (7 shredding-specific Q&A)                         | ✅ Done |
| Cross-sell bridge (Mailbox rental)                      | ✅ Done |
| CTA block (title, subtitle, button)                     | ✅ Done |

---

## 9. Related Competitor Alternative Pages

Shredding does NOT have a dedicated competitor alternative page (no "FedEx Office for shredding" mapping). The `ServicePageV2` component's hardcoded competitor alternative map does not include shredding, which is correct — shredding is a true stand-alone service at Mailbox Plus.

---

## 10. Change Log

| Date       | Change                                          | Author              |
| ---------- | ----------------------------------------------- | ------------------- |
| 2026-06-25 | Initial Face definition (parent wireframe)      | creative-director   |
| 2026-06-25 | S3 Spine Wireframe created                      | creative-director   |
| 2026-07-30 | Fixed FAQs (off-site → on-site, added 7 Q&A)    | mailboxplus-website |
| 2026-07-30 | Face definition finalized as canonical document | mailboxplus-website |
