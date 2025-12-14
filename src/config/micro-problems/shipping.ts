import { Service } from "../../types/services";
import { getServiceImageUrl } from "../../lib/storage";

export const shippingMicroProblems: Service[] = [
    {
        id: "ship-a-fragile-item-safely-in-concord-township-glass-ceramics-electronics",
        category: "micro-problem",
        city: "Concord Township",
        serviceName: "Ship a Fragile Item Safely",
        slug: "/ship-a-fragile-item-safely-in-concord-township-glass-ceramics-electronics",
        pageTitle: "Ship a Fragile Item Safely in Concord Township – Glass, Ceramics, Electronics",
        metaDescription: "Shipping something breakable and terrified it'll arrive in pieces? We pack fragile items every single day—glassware, dishes, electronics, collectibles. We know how to protect it.",
        heroTitle: "Ship a Fragile Item Safely in Concord Township – Glass, Ceramics, Electronics",
        heroSubtitle: "Shipping something breakable and terrified it'll arrive in pieces? We pack fragile items every single day—glassware, dishes, electronics, collectibles. We know how to protect it.",
        heroImage: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=1200&q=80",
        content: [
            {
                heading: "What We Do",
                body: "We use double-boxing, foam inserts, bubble wrap, corner protection, and \"Fragile\" labeling to make sure your item survives the journey. We've shipped everything from fine china to glass art to vintage electronics."
            },
            {
                heading: "Why This Happens",
                body: "Shipping carriers throw packages. That's not an exaggeration—it's reality. Fragile items need internal cushioning that absorbs shock, not just external bubble wrap."
            },
            {
                heading: "How We Help",
                body: `<ol>
<li>Bring your fragile item (or tell us what it is)</li>
<li>We assess the risk: weight, shape, breakable points</li>
<li>We wrap each piece individually in foam or bubble wrap</li>
<li>We use a box with 2–3 inches of cushioning on all sides</li>
<li>For high-value items, we double-box (box inside a box)</li>
<li>We label "Fragile" and "This Side Up" if needed</li>
<li>We can insure it and hand you a receipt with tracking</li>
</ol>`
            },
            {
                heading: "What to Bring",
                body: `<ul>
<li>The fragile item</li>
<li>Original packaging if you have it (helps but not required)</li>
<li>Any documentation if it's valuable (for insurance purposes)</li>
</ul>`
            }
        ],
        faqs: [
            {
                question: "How do I know it won't break?",
                answer: "We can't guarantee carriers won't be rough, but we can guarantee your item is packed to withstand normal (and abnormal) handling. We've had a 99%+ success rate with fragile shipments."
            },
            {
                question: "Should I insure it?",
                answer: "If it's worth more than $100 or irreplaceable, yes. Insurance costs about $1–2 per $100 of value."
            },
            {
                question: "What's double-boxing?",
                answer: "We pack the item in a smaller box with cushioning, then place that box inside a larger box with more cushioning. It's the gold standard for fragile items."
            }
        ],
        cta: {
            title: "Bring it in—we'll pack it like it's our own. No appointment needed.",
            buttonText: "Get Directions",
            buttonLink: "/contact-us"
        }
    },
    {
        id: "ship-an-odd-shaped-or-oversized-item-in-concord-township-guitars-lamps-sports-equipment",
        category: "micro-problem",
        city: "Concord Township",
        serviceName: "Ship an Odd-Shaped or Oversized Item",
        slug: "/ship-an-odd-shaped-or-oversized-item-in-concord-township-guitars-lamps-sports-equipment",
        pageTitle: "Ship an Odd-Shaped or Oversized Item in Concord Township – Guitars, Lamps, Sports Equipment | Mailbox Plus",
        metaDescription: "Got something that doesn't fit in a normal box? Golf clubs, a floor lamp, a bicycle wheel, artwork? We ship weird-shaped stuff all the time. We'll figure it out.",
        heroTitle: "Ship an Odd-Shaped or Oversized Item in Concord Township",
        heroSubtitle: "Guitars, Lamps, Sports Equipment",
        heroImage: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1200&q=80",
        content: [
            {
                heading: "What We Do",
                body: "We find (or build) custom packaging for items that don't fit standard boxes. Then we choose the right carrier and service level so it arrives safely without costing a fortune."
            },
            {
                heading: "Why This Happens",
                body: "Standard boxes are rectangles. Life is not. Carriers charge by dimensional weight, so odd shapes get expensive fast—unless you know the tricks."
            },
            {
                heading: "How We Help",
                body: `<ol>
<li>Bring the item or tell us the dimensions</li>
<li>We assess: can we box it, crate it, or tube it?</li>
<li>We source the right packaging (bike box, mirror box, custom crate)</li>
<li>We pad edges, corners, and protruding parts</li>
<li>We compare carrier rates (UPS vs FedEx vs freight)</li>
<li>We show you the cost before committing</li>
<li>We hand it off and track it</li>
</ol>`
            },
            {
                heading: "What to Bring",
                body: `<ul>
<li>The item itself, or exact dimensions (length x width x height)</li>
<li>Destination address</li>
<li>Any disassembly instructions if it comes apart</li>
</ul>`
            }
        ],
        faqs: [
            {
                question: "Can you ship a guitar?",
                answer: "Yes. Ships via UPS or FedEx Ground."
            },
            {
                question: "What about a bicycle?",
                answer: "Yes. We partially disassemble (remove pedals, turn handlebars), box it in a bike-specific box, and ship via ground service."
            },
            {
                question: "Is freight cheaper for big items?",
                answer: "Sometimes. If it's over 150 lbs or 108 inches combined length+width+height, freight might be cheaper."
            }
        ],
        cta: {
            title: "Call or stop by with dimensions—we'll give you an honest quote before you commit.",
            buttonText: "Get Directions",
            buttonLink: "/contact-us"
        }
    },
    {
        id: 'ship-a-heavy-package-in-concord-township-over-50-lbs-wont-get-rejected',
        category: 'micro-problem',
        city: 'concord-township',
        serviceName: 'Ship a Heavy Package in Concord Township – Over 50 lbs, Won\'t Get Rejected',
        slug: '/ship-a-heavy-package-in-concord-township-over-50-lbs-wont-get-rejected',
        pageTitle: 'Ship a Heavy Package in Concord Township – Over 50 lbs, Won\'t Get Rejected',
        metaDescription: 'Shipping something heavy and worried the carrier will refuse it? Weight limits are real—and confusing. We know exactly which carriers take what weight, and how to pack it so it\'s accepted.',
        heroTitle: 'Ship a Heavy Package in Concord Township – Over 50 lbs, Won\'t Get Rejected',
        heroSubtitle: 'Shipping something heavy and worried the carrier will refuse it? Weight limits are real—and confusing. We know exactly which carriers take what weight, and how to pack it so it\'s accepted.',
        heroImage: getServiceImageUrl('/images/micro/boxes.webp'),
        content: [
            {
                heading: 'What We Do',
                body: 'We weigh your item, choose a carrier that accepts that weight class, use a reinforced box, and distribute the weight properly so it doesn\'t tear through the bottom.'
            },
            {
                heading: 'Why This Happens',
                body: 'UPS and FedEx have a 150 lb limit per package (70 lbs for some services). USPS tops out at 70 lbs. Go over and they reject it—or charge you a surprise fee. Worse: heavy items bust through weak boxes.'
            },
            {
                heading: 'How We Help',
                body: `<ol>
<li>We weigh the item accurately (our scale is certified)</li>
<li>We tell you which carriers will accept it and at what cost</li>
<li>We use double-walled or heavy-duty boxes</li>
<li>We reinforce the bottom with extra tape and support</li>
<li>We add "Heavy" labels so handlers know</li>
<li>We hand it to the carrier with weight documentation</li>
</ol>`
            },
            {
                heading: 'What to Bring',
                body: `<ul>
<li>The heavy item</li>
<li>Destination address</li>
<li>Patience—we'll show you options and you pick what makes sense</li>
</ul>`
            }
        ],
        faqs: [
            {
                question: 'What if it\'s over 150 lbs?',
                answer: 'Then it goes freight, not parcel. Freight is cheaper for heavy items but takes longer (5–10 business days). We can arrange freight pickup.'
            },
            {
                question: 'Will the box hold up?',
                answer: 'If we pack it, yes. We use boxes rated for the weight and reinforce stress points.'
            },
            {
                question: 'Can I split it into multiple boxes to avoid freight?',
                answer: 'Sometimes that makes sense, sometimes it doesn\'t. We\'ll do the math and show you both options.'
            }
        ],
        cta: {
            title: 'Bring it in or call with the weight—we\'ll figure out the smartest way to ship it.',
            buttonText: 'Get Directions',
            buttonLink: '/contact-us'
        }
    },
    {
        id: 'ship-electronics-safely-in-concord-township-phones-laptops-tablets-computers',
        category: 'micro-problem',
        city: 'Concord Township',
        serviceName: 'Ship Electronics Safely in Concord Township – Phones, Laptops, Tablets, Computers',
        slug: '/ship-electronics-safely-in-concord-township-phones-laptops-tablets-computers',
        pageTitle: 'Ship Electronics Safely in Concord Township – Phones, Laptops, Tablets, Computers',
        metaDescription: 'Shipping a phone, laptop, or tablet and worried it\'ll get damaged or stolen? Electronics need special packing—and sometimes special handling. We do this daily.',
        heroTitle: 'Ship Electronics Safely in Concord Township – Phones, Laptops, Tablets, Computers',
        heroSubtitle: 'Shipping a phone, laptop, or tablet and worried it\'ll get damaged or stolen? Electronics need special packing—and sometimes special handling. We do this daily.',
        heroImage: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2001',
        content: [
            {
                heading: 'What We Do',
                body: 'We pack electronics with anti-static materials, foam padding, and discreet packaging. We can insure it, require a signature, and track it every step of the way.'
            },
            {
                heading: 'Why This Happens',
                body: 'Electronics are fragile (screens crack, ports break) and valuable (theft risk). Carriers know this. So do thieves. Smart packing reduces both risks.'
            },
            {
                heading: 'How We Help',
                body: `<ol>
<li>Bring your device (wiped and charged off, ideally)</li>
<li>We wrap it in anti-static bubble wrap or foam</li>
<li>We use a box with 2+ inches of cushioning on all sides</li>
<li>We avoid external labels that say "electronics"</li>
<li>We add insurance and signature confirmation</li>
<li>We hand it to the carrier and give you tracking</li>
</ol>`
            },
            {
                heading: 'What to Bring',
                body: `<ul>
<li>The electronic device (powered off)</li>
<li>Original box if you have it (helps but not required)</li>
<li>Charging cable if you're including it</li>
<li>Proof of value (receipt or email) if you want insurance</li>
</ul>`
            }
        ],
        faqs: [
            {
                question: 'Should I wipe the device before shipping?',
                answer: 'Yes, if it\'s a phone, tablet, or computer. Factory reset recommended. We can\'t be responsible for data.'
            },
            {
                question: 'Do I need insurance?',
                answer: 'For anything worth over $100, yes. Carriers only cover $100 by default. Insurance costs about 1–2% of the item\'s value.'
            },
            {
                question: 'What if it\'s a desktop computer?',
                answer: 'We remove any loose components (graphics card, hard drives), pack them separately, and cushion the case. Then ship in a custom box.'
            }
        ],
        cta: {
            title: 'Bring your device in—we\'ll pack it like it\'s our own and insure it properly.',
            buttonText: 'Get Directions',
            buttonLink: '/contact-us'
        }
    },
    {
        id: 'ship-artwork-framed-items-or-collectibles-safely-in-concord-township',
        category: 'micro-problem',
        city: 'Concord Township',
        serviceName: 'Ship Artwork, Framed Items, or Collectibles',
        slug: '/ship-artwork-framed-items-or-collectibles-safely-in-concord-township',
        pageTitle: 'Ship Artwork, Framed Items, or Collectibles Safely in Concord Township | Mailbox Plus',
        metaDescription: 'Shipping something irreplaceable? A painting, framed photo, signed poster, or collectible? We treat these like museum pieces with corner protectors, custom boxes, and full insurance.',
        heroTitle: 'Ship Artwork, Framed Items, or Collectibles Safely in Concord Township',
        heroSubtitle: 'Shipping something irreplaceable? A painting, framed photo, signed poster, or collectible? We treat these like museum pieces—because to you, they are.',
        heroImage: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=1200&h=600&fit=crop',
        content: [
            {
                heading: 'What We Do',
                body: 'We use corner protectors, custom-sized boxes, foam sheets, and "Do Not Bend" labeling. For high-value items, we double-box and insure. We\'ve shipped original art, vintage posters, and family heirlooms.'
            },
            {
                heading: 'Why This Happens',
                body: 'Art and collectibles have sentimental or financial value that can\'t be replaced. Standard packing doesn\'t cut it—frames break, corners dent, glass shatters.'
            },
            {
                heading: 'How We Help',
                body: `<ol>
<li>Bring the item or describe it (size, framed, glass, canvas, etc.)</li>
<li>We measure and select a box with 3+ inches clearance</li>
<li>We wrap the piece in foam or glassine paper</li>
<li>We add corner protectors if framed</li>
<li>We cushion all sides with foam or bubble wrap</li>
<li>We label "Fragile," "This Side Up," and "Do Not Bend"</li>
<li>We insure it for its full value</li>
</ol>`
            },
            {
                heading: 'What to Bring',
                body: `<ul>
<li>The artwork or collectible</li>
<li>Original packaging if you have it</li>
<li>Any documentation of value (appraisal, receipt, certificate)</li>
</ul>`
            }
        ],
        faqs: [
            {
                question: 'Can you ship a large framed painting?',
                answer: 'Yes. We\'ve shipped pieces up to 48" x 60". Larger than that may require custom crating or freight.'
            },
            {
                question: 'Should I remove the glass from the frame?',
                answer: 'Depends. If it\'s valuable, yes—ship the glass separately. If it\'s standard glass and securely framed, we can pack it as-is.'
            }
        ],
        cta: {
            title: 'Bring it in or call to discuss—we\'ll give you a quote and a plan before touching it.',
            buttonText: 'Get Directions',
            buttonLink: '/contact-us'
        }
    },
    {
        id: "ship-documents-securely-and-flat-in-concord-township-contracts-certificates-legal-papers",
        category: "micro-problem",
        city: "Concord Township",
        serviceName: "Ship Documents Securely and Flat in Concord Township – Contracts, Certificates, Legal Papers",
        slug: "/ship-documents-securely-and-flat-in-concord-township-contracts-certificates-legal-papers",
        pageTitle: "Ship Documents Securely and Flat in Concord Township – Contracts, Certificates, Legal Papers | Mailbox Plus",
        metaDescription: "Need to mail important documents that can't bend, fold, or get lost? Birth certificates, legal contracts, diplomas, tax forms? We ship documents securely every day.",
        heroTitle: "Ship Documents Securely and Flat in Concord Township – Contracts, Certificates, Legal Papers",
        heroSubtitle: "Need to mail important documents that can't bend, fold, or get lost? Birth certificates, legal contracts, diplomas, tax forms? We ship documents securely every day.",
        heroImage: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1200",
        content: [
            {
                heading: "What We Do",
                body: "We use rigid mailers or flat boxes, seal them properly, and send them via tracked, signature-required services. Your documents stay flat, dry, and traceable."
            },
            {
                heading: "Why This Happens",
                body: "Some documents can't be folded (diplomas, certificates) or are too important to risk (legal papers, signed contracts). A regular envelope won't cut it—they bend, tear, or disappear."
            },
            {
                heading: "How We Help",
                body: `<ol>
<li>Bring your documents</li>
<li>We place them in a rigid cardboard mailer or flat box</li>
<li>We seal and reinforce the edges</li>
<li>We send via USPS Certified Mail, UPS, or FedEx with tracking</li>
<li>We add signature confirmation so you know it was received</li>
<li>You get a receipt with tracking number</li>
</ol>`
            },
            {
                heading: "What to Bring",
                body: `<ul>
<li>The documents (don't fold or bend them)</li>
<li>Destination address</li>
<li>Any special instructions (signature required, specific person, etc.)</li>
</ul>`
            }
        ],
        faqs: [
            {
                question: "What's the difference between USPS Certified Mail and UPS?",
                answer: "USPS Certified gives you proof of mailing and delivery for about $4–$7. UPS/FedEx cost more but are faster and include $100 insurance."
            },
            {
                question: "What if they're time-sensitive (deadline tomorrow)?",
                answer: "We offer overnight and same-day options via FedEx or UPS. Bring them in by 4pm for same-day pickup."
            }
        ],
        cta: {
            title: "Bring your documents in—we'll get them there flat, tracked, and signed for.",
            buttonText: "Get Directions",
            buttonLink: "/contact-us"
        }
    },
    {
        id: "ship-a-gift-without-the-receipt-or-invoice-in-concord-township",
        category: "micro-problem",
        city: "Concord Township",
        serviceName: "Ship a Gift Without the Receipt or Invoice",
        slug: "/ship-a-gift-without-the-receipt-or-invoice-in-concord-township",
        pageTitle: "Ship a Gift Without the Receipt or Invoice in Concord Township",
        metaDescription: "Need to send a gift without pricing showing? We remove receipts, invoices, and price tags, repack cleanly, and ship with a handwritten note.",
        heroTitle: "Ship a Gift Without the Receipt or Invoice",
        heroSubtitle: "Sending a gift and don't want the price to show? Or did the retailer include a receipt in the box? We'll repack it cleanly so the recipient just gets the gift—no pricing, no invoices.",
        heroImage: getServiceImageUrl("/images/micro/pack-ship.webp"),
        content: [
            {
                heading: "What We Do",
                body: "We remove any receipts, packing slips, or price tags. We repack the gift in a clean box with fresh padding, and we can add a handwritten note if you'd like."
            },
            {
                heading: "Why This Happens",
                body: "Retailers pack for efficiency, not thoughtfulness. They slap a packing slip on top or print the price on the label. Not ideal when it's a gift."
            },
            {
                heading: "How We Help",
                body: `<ol>
<li>Bring the item in its original packaging (or already opened)</li>
<li>We remove all pricing, receipts, and invoices</li>
<li>We inspect for any missed price stickers or tags</li>
<li>We repack it in a clean, unmarked box</li>
<li>We add a handwritten gift note if you provide one</li>
<li>We ship it directly to the recipient with tracking</li>
</ol>`
            },
            {
                heading: "What to Bring",
                body: `<ul>
<li>The gift item</li>
<li>Recipient's address</li>
<li>A note or message if you want one included</li>
<li>Shipping preference (speed, carrier, etc.)</li>
</ul>`
            }
        ],
        faqs: [
            {
                question: "Can you write the gift note for me?",
                answer: "Yes. Tell us what to write and we'll include it on a card."
            },
            {
                question: "What if the gift came in a branded box (like Apple or Nike)?",
                answer: "We can pack it inside a plain outer box so the brand isn't visible until they open it."
            },
            {
                question: "Can I ship multiple gifts to different people?",
                answer: "Yes. Bring everything in—we'll separate, pack, and ship each one individually."
            }
        ],
        cta: {
            title: "Bring your gift in—we'll make sure it arrives looking thoughtful, not transactional.",
            buttonText: "Get Directions",
            buttonLink: "/contact-us"
        }
    },
    {
        id: "unsure-of-carrier-rules",
        category: "micro-problem",
        city: "Concord Township",
        serviceName: "Shipping Help When Unsure of Carrier Rules",
        slug: "/unsure-of-carrier-rules",
        pageTitle: "Unsure of Carrier Rules? We'll Figure It Out – Concord Township Shipping Help",
        metaDescription: "Not sure which carrier to use or what the rules are? We compare UPS, FedEx, and USPS daily and explain restrictions, costs, and timelines.",
        heroTitle: "Unsure of Carrier Rules? We'll Figure It Out",
        heroSubtitle: "Not sure if UPS, FedEx, or USPS is the right choice? Confused about size limits, weight restrictions, or what you can't ship? We deal with this every single day—we'll walk you through it.",
        heroImage: getServiceImageUrl("/images/micro/pack-ship.webp"),
        content: [
            {
                heading: "What We Do",
                body: "We compare carriers, explain the rules, and recommend the best service for your specific item and timeline. Then we pack and ship it correctly so there are no surprises."
            },
            {
                heading: "Why This Happens",
                body: "Every carrier has different rules: UPS doesn't take hazmat, FedEx has strict dimensional weight formulas, USPS has flat rate options but confusing size limits. Most people only ship a few times a year—we ship hundreds of packages weekly."
            },
            {
                heading: "How We Help",
                body: `<ol>
<li>Tell us what you're shipping and where it's going</li>
<li>We check: size, weight, contents, and timeline</li>
<li>We explain which carrier makes sense (cost vs speed)</li>
<li>We tell you what's not allowed (batteries, liquids, aerosols, etc.)</li>
<li>We pack it to that carrier's standards</li>
<li>We hand it off and you get tracking</li>
</ol>`
            },
            {
                heading: "What to Bring",
                body: `<ul>
<li>The item you're shipping (or a description)</li>
<li>Destination address</li>
<li>Your timeline (does it need to arrive by a certain date?)</li>
</ul>`
            }
        ],
        faqs: [
            {
                question: "How do I know which carrier is cheapest?",
                answer: "We'll quote all three (UPS, FedEx, USPS) and show you the cost and delivery time for each. You pick."
            },
            {
                question: "Can I ship lithium batteries?",
                answer: "Depends. Small lithium batteries (in phones, laptops) are okay with restrictions. Loose batteries or large lithium packs often aren't. We'll check."
            },
            {
                question: "What if I need it there by Monday?",
                answer: "We'll show you overnight, 2-day, and 3-day options from each carrier and tell you the latest drop-off time for Monday delivery."
            }
        ],
        cta: {
            title: "Stop by or call—we'll answer your questions and get it shipped right the first time.",
            buttonText: "Get Directions",
            buttonLink: "/contact-us"
        }
    },
    {
        id: 'ship-an-item-that-needs-extra-protection-or-padding-in-concord-township',
        category: 'micro-problem',
        city: 'Concord Township',
        serviceName: 'Ship an Item That Needs Extra Protection or Padding',
        slug: '/ship-an-item-that-needs-extra-protection-or-padding-in-concord-township',
        pageTitle: 'Ship an Item That Needs Extra Protection or Padding in Concord Township, OH | Mailbox Plus',
        metaDescription: 'Professional protective packaging for delicate, expensive, or sentimental items. We use foam inserts, corner protectors, and double-boxing to protect your shipment from drops and rough handling.',
        heroTitle: 'Ship an Item That Needs Extra Protection or Padding in Concord Township',
        heroSubtitle: 'Got something delicate, expensive, or sentimental that absolutely cannot get damaged? We use professional-grade packing materials—foam inserts, corner protectors, double-boxing—to protect it.',
        heroImage: getServiceImageUrl('/images/micro/pack-ship.webp'),
        content: [
            {
                heading: 'What We Do',
                body: 'We assess the risk (fragility, value, shape), choose the appropriate level of padding, and pack it so it can withstand drops, pressure, and rough handling.'
            },
            {
                heading: 'Why This Happens',
                body: 'Carriers move fast. Packages get tossed, stacked, dropped. If it\'s not packed with serious cushioning, it will get damaged.'
            },
            {
                heading: 'How We Help',
                body: `<ol>
<li>Bring the item or tell us what it is</li>
<li>We determine fragility: glass, electronics, sharp edges, heavy, etc.</li>
<li>We wrap it in foam, bubble wrap, or air pillows</li>
<li>We use a box with 2–3 inches of cushioning on all sides</li>
<li>For high-risk items, we double-box (box within a box)</li>
<li>We label "Fragile" and "This Side Up" if appropriate</li>
</ol>`
            },
            {
                heading: 'What to Bring',
                body: `<ul>
<li>The item</li>
<li>Original packaging if you have it (helps but not required)</li>
<li>Any documentation of value (for insurance purposes)</li>
</ul>`
            }
        ],
        faqs: [
            {
                question: 'How much padding is enough?',
                answer: 'Minimum 2 inches on all sides. For fragile items, 3+ inches. The item should not touch any wall of the outer box.'
            },
            {
                question: 'What\'s the difference between bubble wrap and foam?',
                answer: 'Bubble wrap is good for light protection. Foam is better for impact absorption. For fragile items, we use both.'
            },
            {
                question: 'Should I insure it?',
                answer: 'If it\'s worth more than $100 or irreplaceable, yes. Insurance costs vary based on the item\'s value.'
            }
        ],
        cta: {
            title: 'Bring it in—we\'ll pack it like it matters, because it does.',
            buttonText: 'Get Directions',
            buttonLink: '/contact-us'
        }
    },
    {
        id: 'ship-a-package-when-youre-short-on-time-in-concord-township',
        category: 'micro-problem',
        city: 'Concord Township',
        serviceName: 'Ship a Package When You\'re Short on Time',
        slug: '/ship-a-package-when-youre-short-on-time-in-concord-township',
        pageTitle: 'Ship a Package When You\'re Short on Time in Concord Township | Mailbox Plus',
        metaDescription: 'Need it shipped today? Have 10 minutes before you need to be somewhere else? We move fast. Walk in, tell us what you need, and we\'ll have you out the door with tracking in hand.',
        heroTitle: 'Ship a Package When You\'re Short on Time in Concord Township',
        heroSubtitle: 'Need it shipped today? Have 10 minutes before you need to be somewhere else? We move fast. Walk in, tell us what you need, and we\'ll have you out the door with tracking in hand.',
        heroImage: getServiceImageUrl('/images/micro/pack-ship.webp'),
        content: [
            {
                heading: 'What We Do',
                body: 'We streamline the process: quick packing, instant carrier comparison, print your label, and hand it off for same-day pickup. No waiting, no overthinking.'
            },
            {
                heading: 'Why This Happens',
                body: 'Life is busy. Sometimes you remember you need to ship something an hour before the deadline. We\'re built for that.'
            },
            {
                heading: 'How We Help',
                body: `<ol>
<li>Walk in and tell us: what, where, and when it needs to arrive</li>
<li>We grab the right box and pack it fast</li>
<li>We show you the fastest/cheapest carrier option</li>
<li>You approve, we print the label and attach it</li>
<li>We drop it with the carrier (or you do)</li>
<li>You're out the door in under 10 minutes</li>
</ol>`
            },
            {
                heading: 'What to Bring',
                body: `<ul>
<li>The item</li>
<li>Destination address (or just the zip code)</li>
<li>A credit card or cash</li>
<li>Your phone for the tracking number</li>
</ul>`
            }
        ],
        faqs: [
            {
                question: 'How fast can you pack something?',
                answer: 'Simple items (clothes, books, non-fragile): 5-10 minutes. Fragile or complex items: 15-20 minutes.'
            },
            {
                question: 'What if I need it there overnight?',
                answer: 'We offer FedEx and UPS overnight options. Drop off by 4pm for next-day delivery (to most locations).'
            },
            {
                question: 'Can I schedule a pickup instead of waiting?',
                answer: 'Carriers pick up from us daily. If you drop off by 3pm, it goes out same-day.'
            }
        ],
        cta: {
            title: 'Walk in—we\'ll get it done fast without cutting corners.',
            buttonText: 'Get Directions',
            buttonLink: '/contact-us'
        }
    }
];
