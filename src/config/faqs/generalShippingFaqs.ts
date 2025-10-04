import { FAQ } from "../../types/faq";

export const generalShippingFaqs: FAQ[] = [
  {
    id: "shipping-carriers",
    question: "Which carriers do you work with?",
    answer: "We ship with FedEx, UPS, USPS, and DHL to provide you with flexible options for domestic and international shipping.",
    category: "Carriers",
    tags: ["fedex", "ups", "usps", "dhl", "carriers"],
    isFeatured: true,
    order: 1,
    lastUpdated: "2025-10-03"
  },
  {
    id: "shipping-tracking",
    question: "Will I receive tracking information?",
    answer: "Yes, every shipment comes with a tracking number so you can monitor your package in real-time.",
    category: "Tracking",
    tags: ["tracking", "delivery status", "shipping updates"],
    order: 2,
    lastUpdated: "2025-10-03"
  },
  {
    id: "shipping-insurance",
    question: "Do you offer shipping insurance?",
    answer: "Yes, we provide third-party insurance for high-value shipments. Coverage amounts depend on the carrier and declared value.",
    category: "Insurance",
    tags: ["insurance", "coverage", "value"],
    order: 3
  },
  {
    id: "shipping-international",
    question: "Can you ship internationally?",
    answer: "Absolutely. We provide international shipping services, including assistance with customs documentation and duties.",
    category: "International",
    tags: ["international", "customs", "duties"],
    order: 4
  },
  {
    id: "shipping-customs",
    question: "Do you handle customs paperwork?",
    answer: "Yes, our team can prepare and guide you through the required customs forms for international shipments.",
    category: "International",
    tags: ["customs paperwork", "forms", "international"],
    order: 5
  },
  {
    id: "shipping-restricted-items",
    question: "Are there items you cannot ship?",
    answer: "Yes, certain items such as hazardous materials, perishables, and restricted goods may not be eligible for shipment. We’ll advise you case by case.",
    category: "Restrictions",
    tags: ["restricted items", "hazmat", "perishable"],
    order: 6
  },
  {
    id: "shipping-fragile-items",
    question: "Can you pack fragile items?",
    answer: "Yes, our expert team provides professional packing services with materials designed for fragile and high-value items.",
    category: "Packing",
    tags: ["fragile", "glass", "packing"],
    order: 7
  },
  {
    id: "shipping-custom-boxes",
    question: "Do you make custom boxes?",
    answer: "Yes, we can design and cut custom boxes or crates for items that don’t fit standard packaging.",
    category: "Packing",
    tags: ["custom boxes", "crating", "oversized"],
    order: 8
  },
  {
    id: "shipping-delivery-time",
    question: "How long will shipping take?",
    answer: "Transit times vary by carrier and destination. We’ll show you multiple options—overnight, 2-day, ground, or international delivery speeds.",
    category: "Delivery",
    tags: ["delivery time", "overnight", "2-day", "ground"],
    order: 9
  },
  {
    id: "shipping-dropoff",
    question: "Can I drop off pre-labeled packages?",
    answer: "Yes, we accept drop-offs for FedEx, UPS, USPS, and DHL. Just bring your labeled package to our store.",
    category: "Drop-off",
    tags: ["drop-off", "pre-labeled", "returns"],
    order: 10
  },
  {
    id: "shipping-pickup",
    question: "Do you offer pickup service?",
    answer: "We can help arrange pickup with carriers for larger shipments or recurring business accounts.",
    category: "Pickup",
    tags: ["pickup", "scheduled pickup", "business accounts"],
    order: 11
  },
  {
    id: "shipping-returns",
    question: "Can you handle product returns?",
    answer: "Yes, we process returns for Amazon, UPS, FedEx, and other retailers. Bring your return label or QR code.",
    category: "Returns",
    tags: ["returns", "amazon", "qr code"],
    order: 12
  },
  {
    id: "shipping-cost",
    question: "How are shipping rates calculated?",
    answer: "Rates are based on carrier, package size, weight, destination, and service speed. We’ll compare carriers to find the best option.",
    category: "Pricing",
    tags: ["rates", "pricing", "carriers"],
    order: 13
  },
  {
    id: "shipping-bulk",
    question: "Do you offer discounts for bulk shipping?",
    answer: "Yes, we can arrange volume-based discounts for businesses and organizations with regular shipping needs.",
    category: "Business",
    tags: ["bulk", "discounts", "business"],
    order: 14
  },
  {
    id: "shipping-mailboxes",
    question: "Can I receive packages at your store?",
    answer: "Yes, with a Mailbox Plus rental, you can have packages securely delivered to our location for pickup at your convenience.",
    category: "Mailbox",
    tags: ["mailbox rental", "receiving", "secure"],
    order: 15
  },
  {
    id: "shipping-size-limits",
    question: "Is there a maximum size or weight limit?",
    answer: "We can handle shipments from small parcels to freight. Size and weight limits depend on the carrier and service.",
    category: "Shipping",
    tags: ["oversized", "freight", "limits"],
    order: 16
  },
  {
    id: "shipping-holiday",
    question: "Do shipping times change during holidays?",
    answer: "Yes, carriers may experience delays during peak seasons. We recommend shipping early to avoid disruptions.",
    category: "Delivery",
    tags: ["holidays", "delays", "peak season"],
    order: 17
  },
  {
    id: "shipping-packing-service",
    question: "Do you offer full-service packing?",
    answer: "Yes, we handle everything—boxes, bubble wrap, tape, and secure packing—so your items are shipment-ready.",
    category: "Packing",
    tags: ["packing service", "boxes", "bubble wrap"],
    order: 18
  },
  {
    id: "shipping-high-value",
    question: "What if I’m shipping high-value items?",
    answer: "We recommend professional packing and insurance coverage to ensure maximum protection for your shipment.",
    category: "Insurance",
    tags: ["high-value", "protection", "coverage"],
    order: 19
  },
  {
    id: "shipping-status",
    question: "How do I check my shipment status?",
    answer: "You can use the tracking number provided or ask our team to help track your package in-store.",
    category: "Tracking",
    tags: ["status", "tracking", "updates"],
    order: 20
  }
];
