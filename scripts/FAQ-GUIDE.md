# 📌 FAQ Management Guide

This project uses a **centralized FAQ system** so FAQs can be reused across multiple services without copy/pasting.  
Every service can include **general FAQs** (universal questions) plus **service-specific FAQs** (unique to that service).

---

## 1. Defining FAQs

All FAQ sets live in `src/config/faqs.ts`.  
Each service (or category) has its own array of question/answer objects.  
We also maintain a **generalShippingFaqs** array that applies to all shipping-related services.

```ts
// src/config/faqs.ts

// ✅ General FAQs (apply to most shipping services)
export const generalShippingFaqs = [
  { question: "Do you ship with all carriers?", answer: "Yes, we work with FedEx, UPS, USPS, and DHL." },
  { question: "Can I drop off pre-labeled packages?", answer: "Yes, we accept drop-offs for all major carriers free of charge." },
  { question: "Do you provide packing supplies?", answer: "Yes, we stock boxes, tape, bubble wrap, and packing materials for all shipping needs." }
];

// ✅ Artwork Shipping FAQs (service-specific)
export const artworkShippingFaqs = [
  { question: "Can you ship large sculptures?", answer: "Yes, we provide crating and freight solutions for oversized artwork." },
  { question: "Is insurance available?", answer: "Yes, we offer third-party insurance for high-value art shipments." },
  { question: "Do you provide custom packing materials?", answer: "Yes, our team uses museum-quality materials and can build custom crates or boxes." },
  { question: "Can you ship internationally?", answer: "Absolutely. We handle international shipping and provide customs documentation assistance." },
  { question: "What is the maximum value you can insure?", answer: "We can insure shipments up to $50,000 per package with our third-party coverage, provided items are professionally packed by our staff." }
];
````

---

## 2. Importing FAQs into `services.ts`

At the top of `src/config/services.ts`, import both **general FAQs** and **service-specific FAQs**:

```ts
import { generalShippingFaqs, artworkShippingFaqs } from "./faqs";
```

---

## 3. Using FAQs in a Service

Inside a service object, **merge general + specific FAQs** with the spread operator.
This ensures every shipping service page has both **universal** and **unique** questions.

```ts
{
  id: "artwork-shipping",
  category: "pack-ship",
  serviceName: "Artwork Shipping",
  slug: "/pack-ship/artwork-shipping",
  pageTitle: "Artwork Shipping in Concord Township, Lake County, Ohio | Mailbox Plus",
  metaDescription: "Professional artwork packing and shipping for paintings, sculptures, and antiques.",
  keywords: "artwork shipping, fine art shipping, packing paintings, Concord Township, Lake County",
  heroTitle: "Artwork Shipping Services",
  heroSubtitle: "Expert packing and shipping solutions for paintings, sculptures, and fine art.",
  heroImage: "...",
  features: [
    { icon: Package, title: "Custom Crating", description: "We design custom crates for delicate artwork." }
  ],
  // 👇 Always merge general + specific FAQs
  faqs: [...generalShippingFaqs, ...artworkShippingFaqs]
}
```

---

## ✅ Benefits of This Pattern

* **Consistency** → Every shipping page has the same baseline FAQs (carriers, drop-offs, insurance).
* **Flexibility** → Each service can still add unique FAQs without duplication.
* **Easy Maintenance** → Update general FAQs once and they update across all shipping services.
* **Cleaner Code** → No repeated question/answer blocks inside `services.ts`.

---

## 📂 Suggested File Structure

```
src/
  config/
    faqs.ts        # All FAQ definitions (general + service-specific)
    services.ts    # Service definitions (imports FAQ sets)
    FAQ-GUIDE.md   # This guide
```
