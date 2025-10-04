import { FAQ } from "../../../types/faq";

export const digitalFingerprintingFaqs: FAQ[] = [
  {
    id: "fingerprint-vs-namecheck",
    question: "Why is a fingerprint-based background check better than a name search?",
    answer:
      "Fingerprint-based checks provide the most reliable and comprehensive identification because they are matched directly against criminal records. Unlike name-only checks, fingerprints cannot be falsified, reducing the risk of incomplete or inaccurate background results.",
    category: "Background Checks",
    tags: ["fingerprinting", "background-checks", "security"],
    isFeatured: true,
    order: 1,
    lastUpdated: "2025-10-03",
  },
  {
    id: "livescan-process",
    question: "What is Live Scan fingerprinting and how does it work?",
    answer:
      "Live Scan is an electronic fingerprinting system that captures high-resolution digital prints in less than 5 minutes. Using SafePrintScan software and National WebCheck (NWC), FastFingerprints transmits your prints securely to state or federal agencies, avoiding errors and delays common with ink cards.",
    category: "Technology",
    tags: ["livescan", "safeprintscan", "digital"],
    order: 2,
    lastUpdated: "2025-10-03",
  },
  {
    id: "fingerprint-card-service",
    question: "Do you provide fingerprint cards?",
    answer:
      "Yes. For $35.00, fingerprints can be captured electronically and printed onto FD-258 fingerprint cards. This service is useful if you need to mail fingerprint cards for an existing background check application.",
    category: "Services",
    tags: ["fingerprint-cards", "FD-258", "electronic"],
    order: 3,
    lastUpdated: "2025-10-03",
  },
  {
    id: "ohio-pricing",
    question: "What are the costs for Ohio background checks?",
    answer:
      "Ohio background checks start at $40.00 for a BCI-only search. FBI-only checks are $52.00, and combined BCI & FBI checks are $72.00. Results are delivered through the secure Web Results portal.",
    category: "Pricing",
    tags: ["Ohio", "BCI", "FBI", "pricing"],
    order: 4,
    lastUpdated: "2025-10-03",
  },
  {
    id: "florida-pricing",
    question: "What are the costs for Florida Level 2 background checks?",
    answer:
      "Florida Level 2 checks cost $75.00. With the AHCA-required photo included, the cost is $94.00. These checks search both state and FBI databases and are required for many licensing and employment positions.",
    category: "Pricing",
    tags: ["Florida", "FDLE", "AHCA", "Level 2"],
    order: 5,
    lastUpdated: "2025-10-03",
  },
  {
    id: "fbi-channeler",
    question: "What does it mean that FastFingerprints is an FBI-approved Channeler?",
    answer:
      "As an FBI Channeler, FastFingerprints can securely submit fingerprints to the FBI on behalf of authorized recipients. This service is used for expedited non-criminal justice purposes, such as personal review of your FBI record, housing, or certain federally regulated industries.",
    category: "FBI Services",
    tags: ["FBI", "channeler", "criminal-records"],
    isFeatured: true,
    order: 6,
    lastUpdated: "2025-10-03",
  },
  {
    id: "personal-fbi-checks",
    question: "Can I request my own FBI background check through FastFingerprints?",
    answer:
      "Yes. Individuals can request a copy of their FBI criminal identification record for personal review or correction under Departmental Order 556-73. Note that this service cannot be used for employment or licensing within the U.S., and results must be sent to a U.S. address.",
    category: "Personal Checks",
    tags: ["FBI", "personal-records", "departmental-order"],
    order: 7,
    lastUpdated: "2025-10-03",
  },
  {
    id: "out-of-state",
    question: "Can out-of-state applicants use your services?",
    answer:
      "Yes. Through its nationwide network of Live Scan locations, FastFingerprints can process Florida Level 2 and FBI channeling requests for applicants who are not physically located in Ohio or Florida.",
    category: "Nationwide",
    tags: ["out-of-state", "nationwide", "fingerprinting"],
    order: 8,
    lastUpdated: "2025-10-03",
  }
];
