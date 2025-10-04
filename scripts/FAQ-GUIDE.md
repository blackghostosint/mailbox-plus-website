# 📌 FAQ Management Guide

This project uses a **centralized FAQ system** so FAQs can be reused across multiple services without copy/pasting.  

---

## 1. Defining FAQs

All FAQ sets live in `src/config/faqs.ts`.  
Each service (or category) has its own array of question/answer objects.

```ts
// src/config/faqs.ts

// ✅ General FAQs (apply to most shipping services)
export const generalShippingFaqs = [
  { question: "Do you ship with all carriers?", answer: "Yes, we work with FedEx, UPS, USPS, and DHL." },
  { question: "Can I drop off pre-labeled packages?", answer: "Yes, we accept drop-offs for all major carriers free of charge." }
];

// ✅ Artwork Shipping FAQs
export const artworkShippingFaqs = [
  { question: "Can you ship large sculptures?", answer: "Yes, we provide crating and freight solutions for oversized artwork." },
  { question: "Is insurance available?", answer: "Yes, we offer third-party insurance for high-value art shipments." }
];
````

---

## 2. Importing FAQs into `services.ts`

At the top of `src/config/services.ts`, import the FAQ sets you need:

```ts
import { generalShippingFaqs, artworkShippingFaqs } from "./faqs";
```

---

## 3. Using FAQs in a Service

Inside a service object, **reference the imported FAQ array** instead of hardcoding.

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
  // 👇 Pulls FAQs from the shared file
  faqs: artworkShippingFaqs
}
```

---

## 4. Merging General + Service-Specific FAQs

If you want a service to have **both universal FAQs** and **unique ones**, merge them with the spread operator:

```ts
faqs: [...generalShippingFaqs, ...artworkShippingFaqs]
```

This combines the two arrays into one.

---

## ✅ Benefits of This Pattern

* Centralized FAQ management
* Reusable across multiple services
* Easy to maintain (update once → updates everywhere)
* Cleaner `services.ts` file

---
