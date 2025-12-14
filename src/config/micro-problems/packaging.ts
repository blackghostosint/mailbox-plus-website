import { Service } from "../../types/services";
import { getServiceImageUrl } from "../../lib/storage";

export const packagingMicroProblems: Service[] = [
    {
        id: "repackage-a-damaged-or-torn-shipping-box-in-concord-township",
        category: "micro-problem",
        city: "Concord Township",
        serviceName: "Repackage a Damaged or Torn Shipping Box",
        slug: "/repackage-a-damaged-or-torn-shipping-box-in-concord-township",
        pageTitle: "Repackage a Damaged or Torn Shipping Box in Concord Township",
        metaDescription: "Box fell apart before you could ship it? Or did the carrier reject it because it's torn or crushed? Happens all the time. We'll repack it into a sturdy box in under 10 minutes.",
        heroTitle: "Repackage a Damaged or Torn Shipping Box in Concord Township",
        heroSubtitle: "Box fell apart before you could ship it? Or did the carrier reject it because it's torn or crushed? Happens all the time. We'll repack it into a sturdy box in under 10 minutes.",
        heroImage: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&q=80&w=2000",
        content: [
            {
                heading: "What We Do",
                body: "We transfer your item from the damaged box into a new, carrier-approved box with fresh padding and proper sealing. Then we attach your label and hand it to the carrier."
            },
            {
                heading: "Why This Happens",
                body: "Old boxes get weak. Tape fails. Corners tear. Carriers won't accept damaged boxes because they fall apart in transit and cause problems for everyone."
            },
            {
                heading: "How We Help",
                body: `<ol>
<li>Bring your damaged box (or just the item)</li>
<li>We open it and inspect the contents</li>
<li>We select a new box that fits properly</li>
<li>We transfer everything with fresh cushioning</li>
<li>We seal it correctly and reattach (or reprint) your label</li>
<li>We hand it to the carrier with a receipt</li>
</ol>`
            },
            {
                heading: "What to Bring",
                body: `<ul>
<li>The damaged box with contents inside, or just the item</li>
<li>Your shipping label (or the info to reprint one)</li>
<li>A few minutes—this is quick</li>
</ul>`
            }
        ],
        faqs: [
            {
                question: "Can you just tape up my box instead of reboxing it?",
                answer: "If the box is structurally sound, yes. But if it's crushed, wet, or split at the seams, it needs a new box or the carrier will reject it again."
            },
            {
                question: "What if my label was on the damaged box?",
                answer: "We'll carefully remove it and attach it to the new box. If it's destroyed, we can reprint it for $1–2."
            },
            {
                question: "How much does a new box cost?",
                answer: "$3-10 depending on size, plus $5-10 for repacking labor."
            }
        ],
        cta: {
            title: "Bring in the damaged box—we'll get it fixed and shipped out today.",
            buttonText: "Get Directions",
            buttonLink: "/contact-us"
        }
    },
    {
        id: 'package-multiple-items-into-one-shipment-in-concord-township',
        category: 'micro-problem',
        city: 'Concord Township',
        serviceName: 'Package Multiple Items Into One Shipment in Concord Township',
        slug: '/package-multiple-items-into-one-shipment-in-concord-township',
        pageTitle: 'Package Multiple Items Into One Shipment in Concord Township | Mailbox Plus',
        metaDescription: 'Shipping several items to the same person? We\'ll combine them into one shipment, packed securely so nothing shifts or breaks. Save on shipping costs at Mailbox Plus in Concord Township.',
        heroTitle: 'Package Multiple Items Into One Shipment in Concord Township',
        heroSubtitle: 'Shipping several items to the same person and don\'t want to pay for multiple boxes? We\'ll combine them into one shipment, packed securely so nothing shifts or breaks.',
        heroImage: getServiceImageUrl('/images/micro/pack-ship.webp'),
        content: [
            {
                heading: 'What We Do',
                body: 'We assess all the items, choose the right-sized box, separate fragile pieces with dividers or padding, and ship it as one package with one tracking number.'
            },
            {
                heading: 'Why This Happens',
                body: 'Shipping multiple boxes is expensive. But throwing everything into one box without planning leads to damage. We know how to pack efficiently and safely.'
            },
            {
                heading: 'How We Help',
                body: `<ol>
<li>Bring all the items you're shipping to one address</li>
<li>We figure out if they'll fit in one box or need two</li>
<li>We wrap fragile items individually</li>
<li>We use dividers or padding to keep items separated</li>
<li>We seal and label it with one tracking number</li>
<li>You save on shipping compared to multiple boxes</li>
</ol>`
            },
            {
                heading: 'What to Bring',
                body: `<ul>
<li>All the items going to the same address</li>
<li>Any packaging materials you already have (optional)</li>
<li>Destination address</li>
</ul>`
            }
        ],
        faqs: [
            {
                question: 'Will combining them actually save money?',
                answer: 'Usually yes—carriers charge per box. We\'ll show you the cost comparison.'
            },
            {
                question: 'What if one item is fragile and the others aren\'t?',
                answer: 'We pack the fragile item with extra padding and place it in the center, away from pressure points.'
            },
            {
                question: 'Is there a limit to how many items you can fit in one box?',
                answer: 'Weight and size limits apply (usually 50–70 lbs and under 108" combined dimensions). If it\'s over that, we\'ll split into two shipments.'
            }
        ],
        cta: {
            title: 'Bring everything in—we\'ll figure out the smartest way to pack and ship it.',
            buttonText: 'Get Directions',
            buttonLink: '/contact-us'
        }
    },
    {
        id: "ship-something-with-no-original-packaging-in-concord-township",
        category: "micro-problem",
        city: "Concord Township",
        serviceName: "Ship Something With No Original Packaging",
        slug: "/ship-something-with-no-original-packaging-in-concord-township",
        pageTitle: "Ship Something With No Original Packaging in Concord Township | Mailbox Plus",
        metaDescription: "Lost the box? We pack items without original packaging—clothes, toys, kitchen items, random stuff. We'll find the right box and pack it properly at Mailbox Plus in Concord Township, OH.",
        heroTitle: "Ship Something With No Original Packaging in Concord Township",
        heroSubtitle: "Lost the box? Never had one? Doesn't matter. We pack items without original packaging all day long—clothes, toys, kitchen items, random stuff. We'll find the right box and pack it properly.",
        heroImage: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?q=80&w=2065",
        content: [
            {
                heading: "What We Do",
                body: "We assess the item, select appropriate packaging (box, tube, padded mailer), add cushioning or protection, and ship it via your preferred carrier."
            },
            {
                heading: "Why This Happens",
                body: "Most things don't come with \"shipping packaging.\" You bought it in a store, or it's a hand-me-down, or the box got tossed years ago. That's normal."
            },
            {
                heading: "How We Help",
                body: `<ol>
<li>Bring the item (or describe it if it's large)</li>
<li>We choose the right type of container: box, tube, crate, or mailer</li>
<li>We wrap or pad it based on fragility</li>
<li>We seal it and add any necessary labels ("Fragile," "This Side Up")</li>
<li>We ship it with tracking</li>
</ol>`
            },
            {
                heading: "What to Bring",
                body: `<ul>
<li>The item itself</li>
<li>Destination address</li>
<li>Any accessories or parts that go with it</li>
</ul>`
            }
        ],
        faqs: [
            {
                question: "What if it's an odd shape?",
                answer: "We'll custom-pack it. We've shipped lamps, sculptures, car parts, musical instruments—weird shapes are our specialty."
            },
            {
                question: "Can you pack something soft like clothes or blankets?",
                answer: "Yes. We use poly mailers or boxes depending on the size and whether it needs to stay dry."
            },
            {
                question: "How much does packaging cost if I have literally nothing?",
                answer: "Typically $5–12 depending on size and how much protection it needs."
            }
        ],
        cta: {
            title: "Just bring the item—we'll take care of the rest.",
            buttonText: "Get Directions",
            buttonLink: "/contact-us"
        }
    },
    {
        id: "print-and-attach-a-shipping-label-correctly-in-concord-township",
        category: "micro-problem",
        city: "Concord Township",
        serviceName: "Print and Attach a Shipping Label Correctly in Concord Township",
        slug: "/print-and-attach-a-shipping-label-correctly-in-concord-township",
        pageTitle: "Print and Attach a Shipping Label Correctly in Concord Township | Mailbox Plus Ohio",
        metaDescription: "Not sure where the label goes? We print and attach shipping labels correctly—flat surface, scannable barcode, no tape coverage. Bring your label and box to Mailbox Plus in Concord Township.",
        heroTitle: "Print and Attach a Shipping Label Correctly in Concord Township",
        heroSubtitle: "Not sure where the label goes? Worried you'll put it in the wrong spot and delay your shipment? We print and attach labels all day—we'll do it right so there's no confusion.",
        heroImage: getServiceImageUrl("/images/micro/print-label.webp"),
        content: [
            {
                heading: "What We Do",
                body: "We print your label on adhesive paper, place it in the correct location (flat surface, away from seams and tape), and make sure the barcode is scannable."
            },
            {
                heading: "Why This Happens",
                body: "Carriers reject packages when labels are placed over tape, on a seam, upside-down, or covering another barcode. Most people don't know these rules."
            },
            {
                heading: "How We Help",
                body: `<ol>
<li>Bring your label (email, phone, or printed)</li>
<li>We print it on adhesive label paper if needed</li>
<li>We place it on the largest flat surface of the box</li>
<li>We make sure no tape covers the barcode</li>
<li>We remove or cover any old labels or barcodes</li>
<li>We hand it to the carrier</li>
</ol>`
            },
            {
                heading: "What to Bring",
                body: `<ul>
<li>Your shipping label (any format: email, PDF)</li>
<li>The packaged item</li>
<li>2 minutes of your time</li>
</ul>`
            }
        ],
        faqs: [
            {
                question: "Why does label placement matter?",
                answer: "Carriers scan barcodes at every facility. If the label is wrinkled, covered, or in the wrong spot, it delays your package or gets sent to the wrong place."
            },
            {
                question: "Can I just tape a paper label on?",
                answer: "You can, but it might fall off or get wet. Adhesive labels stay put. We use those."
            },
            {
                question: "What if there's an old label on the box?",
                answer: "We remove it or cover it completely so scanners don't pick up the wrong tracking number."
            }
        ],
        cta: {
            title: "Bring your label and box—we'll attach it correctly in under a minute.",
            buttonText: "Get Directions",
            buttonLink: "/contact-us"
        }
    },
    {
        id: 'get-help-choosing-the-right-box-for-shipping-in-concord-township',
        category: 'micro-problem',
        city: 'concord-township',
        serviceName: 'Get Help Choosing the Right Box for Shipping',
        slug: '/get-help-choosing-the-right-box-for-shipping-in-concord-township',
        pageTitle: 'Get Help Choosing the Right Box for Shipping in Concord Township | Mailbox Plus',
        metaDescription: 'Not sure what size box to use? We\'ll measure your item and pick the perfect box that fits properly without wasting space or money. Visit Mailbox Plus in Concord Township.',
        heroTitle: 'Get Help Choosing the Right Box for Shipping in Concord Township',
        heroSubtitle: 'Not sure what size box to use? Worried it\'s too big (and you\'ll pay more) or too small (and it\'ll get damaged)? We\'ll measure your item and pick the perfect box.',
        heroImage: getServiceImageUrl('/images/micro/boxes.webp'),
        content: [
            {
                heading: 'What We Do',
                body: 'We measure your item, factor in padding requirements, and select a box that fits properly without wasting space or money.'
            },
            {
                heading: 'Why This Happens',
                body: 'Carriers charge by dimensional weight (size × weight formula). A box that\'s too big costs you more. A box that\'s too small means no room for padding, which means damage.'
            },
            {
                heading: 'How We Help',
                body: `<ol>
<li>Bring your item (or tell us the dimensions)</li>
<li>We measure it</li>
<li>We calculate padding needs (2–3 inches per side for fragile items)</li>
<li>We show you box options and explain the cost difference</li>
<li>You pick, we pack</li>
</ol>`
            },
            {
                heading: 'What to Bring',
                body: `<ul>
<li>The item you're shipping</li>
<li>Any accessories or parts that go with it</li>
<li>Destination address (affects pricing)</li>
</ul>`
            }
        ],
        faqs: [
            {
                question: 'What if I already have a box at home?',
                answer: 'Bring it in. We\'ll tell you if it\'ll work or if you need a different size.'
            },
            {
                question: 'Does box size really affect price that much?',
                answer: 'Yes. Carriers charge by dimensional weight: (Length × Width × Height) / 166. A box that\'s even 2 inches bigger can jump you to the next price tier.'
            },
            {
                question: 'Can I use a smaller box to save money?',
                answer: 'Only if there\'s still room for padding. We won\'t sacrifice protection to save $5 on shipping.'
            }
        ],
        cta: {
            title: 'Bring your item in—we\'ll pick the right box and explain why.',
            buttonText: 'Get Directions',
            buttonLink: '/contact-us'
        }
    }
];
