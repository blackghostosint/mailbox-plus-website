import type { FAQ } from "../../../types/faq";

export const uspsServicesFaqs: FAQ[] = [
  {
    id: "usps-services-offered",
    question: "What USPS services can I access at your location?",
    answer: "We are a full-service USPS authorized shipping center. We offer a wide range of services, including First-Class Mail®, Priority Mail®, Priority Mail Express®, USPS Ground Advantage™, international shipping, and more. We also sell postage stamps and provide mailing supplies.",
    category: "Pack & Ship",
    tags: ["usps", "services", "shipping", "priority mail"],
    relatedServices: ["pack-ship", "international-shipping", "postage-stamps"],
    isFeatured: true,
    order: 1,
    lastUpdated: "2025-10-04"
  },
  {
    id: "usps-sell-stamps",
    question: "Do you sell postage stamps?",
    answer: "Yes, we sell a variety of USPS postage stamps, including Forever® stamps and stamps for international mail, available as single stamps or in books.",
    category: "Pack & Ship",
    tags: ["usps", "stamps", "postage"],
    relatedServices: ["postage-stamps", "usps-services"],
    isFeatured: false,
    order: 2,
    lastUpdated: "2025-10-04"
  },
  {
    id: "usps-international-shipping",
    question: "Can I ship internationally using USPS from your store?",
    answer: "Absolutely. We can help you process international shipments using USPS services like Priority Mail International® and Priority Mail Express International®, including assistance with customs forms.",
    category: "Pack & Ship",
    tags: ["usps", "international", "shipping", "customs"],
    relatedServices: ["international-shipping", "dhl-express", "fedex-shipping"],
    isFeatured: false,
    order: 3,
    lastUpdated: "2025-10-04"
  },
  {
    id: "usps-package-prep",
    question: "What do I need to know when preparing my package for USPS shipping?",
    answer: "Ensure your item is well-packed to prevent damage. If you use your own box, its dimensions may affect the price. For flat-rate boxes, ensure the contents fit without bulging. For any package over 10 oz or more than a half-inch thick with only stamps, you must bring it to the counter.",
    category: "Pack & Ship",
    tags: ["usps", "packaging", "preparation", "tips"],
    relatedServices: ["professional-packing", "custom-box-making", "packaging-supplies"],
    isFeatured: false,
    order: 4,
    lastUpdated: "2025-10-04"
  },
  {
    id: "usps-postage-calculation",
    question: "How is USPS postage calculated?",
    answer: "Postage is determined by the package's weight, dimensions, and the distance it's traveling. We can weigh your package and provide you with a price quote for various service options to find the best fit for your budget and timeline.",
    category: "Pack & Ship",
    tags: ["usps", "postage", "pricing", "cost"],
    relatedServices: ["pack-ship"],
    isFeatured: false,
    order: 5,
    lastUpdated: "2025-10-04"
  },
  {
    id: "usps-shipping-restrictions",
    question: "Are there items I am not allowed to ship with USPS?",
    answer: "Yes, USPS has restrictions on certain items. Prohibited materials include hazardous items like aerosols, firearms, flammable materials, liquids, and lithium batteries. If you're unsure about an item, please ask our staff for guidance.",
    category: "Pack & Ship",
    tags: ["usps", "restrictions", "prohibited items", "hazardous materials"],
    relatedServices: ["artwork-shipping", "bicycle-shipping"],
    isFeatured: false,
    order: 6,
    lastUpdated: "2025-10-04"
  },
  {
    id: "usps-size-weight-limits",
    question: "What are the size and weight limits for USPS packages?",
    answer: "Generally, USPS packages cannot weigh more than 70 pounds. The combined length and girth (the distance around the thickest part) of the package typically cannot exceed 108 inches for most services.",
    category: "Pack & Ship",
    tags: ["usps", "size limit", "weight limit", "dimensions"],
    relatedServices: ["custom-box-making"],
    isFeatured: false,
    order: 7,
    lastUpdated: "2025-10-04"
  },
  {
    id: "usps-tracking",
    question: "Can I track my USPS shipment?",
    answer: "Yes, most USPS services include end-to-end tracking. We will provide you with a tracking number once your shipment is processed, which you can use on the USPS website to monitor your package's journey.",
    category: "Pack & Ship",
    tags: ["usps", "tracking", "shipment", "delivery status"],
    relatedServices: ["package-receiving"],
    isFeatured: false,
    order: 8,
    lastUpdated: "2025-10-04"
  },
  {
    id: "usps-certified-mail",
    question: "Do you offer special services like Certified Mail® or Signature Confirmation™?",
    answer: "Yes, we provide a range of extra services for your USPS shipments, including Certified Mail® for important documents, and Signature Confirmation™ to verify delivery. Just ask our staff, and we can add these to your shipment.",
    category: "Pack & Ship",
    tags: ["usps", "certified mail", "signature confirmation", "extra services"],
    relatedServices: ["notary-services", "document-printing"],
    isFeatured: false,
    order: 9,
    lastUpdated: "2025-10-04"
  },
  {
    id: "usps-prepaid-dropoff",
    question: "Can I drop off a pre-paid USPS package at your location?",
    answer: "Absolutely. If you have a package with a pre-paid USPS shipping label, you can drop it off with us for no additional charge. It's a quick and convenient way to get your package on its way.",
    category: "Pack & Ship",
    tags: ["usps", "drop-off", "pre-paid", "returns"],
    relatedServices: ["package-drop-offs", "fedex-shipping", "ups-authorized-shipper-outlet"],
    isFeatured: false,
    order: 10,
    lastUpdated: "2025-10-04"
  },
  {
    id: "usps-vs-others",
    question: "When should I choose USPS over other carriers like FedEx or UPS?",
    answer: "USPS is often the most cost-effective option for smaller, lightweight packages (under 2-3 lbs) and for shipping to residential addresses, P.O. Boxes, and military bases. We can help you compare rates and delivery times to see which carrier best fits your specific needs.",
    category: "Pack & Ship",
    tags: ["usps", "fedex", "ups", "comparison", "cost"],
    relatedServices: ["pack-ship", "fedex-shipping", "ups-authorized-shipper-outlet"],
    isFeatured: false,
    order: 11,
    lastUpdated: "2025-10-04"
  }
];