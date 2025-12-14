import { Service } from "../../types/services";
import { getServiceImageUrl } from "../../lib/storage";

export const microProblems: Service[] = [
    {
        id: "return-without-original-box",
        category: "micro-problem",
        city: "Concord Township",
        serviceName: "Return a Package Without the Original Box",
        slug: "/return-without-original-box",
        pageTitle: "Return a Package Without the Original Box in Concord Township",
        metaDescription: "Lost your original box? Mailbox Plus in Concord Township provides professional packing services to ensure your return items are shipped safely and securely.",
        heroTitle: "Return a Package Without the Original Box",
        heroSubtitle: "Lost the original packaging? We can help prepare your return properly.",
        heroImage: getServiceImageUrl("/images/micro/pack-ship.webp")
    },
    {
        id: "print-return-label-without-printer",
        category: "micro-problem",
        city: "Concord Township",
        serviceName: "Print a Return Shipping Label Without a Printer",
        slug: "/print-return-label-without-printer",
        pageTitle: "Print a Return Shipping Label Without a Printer Near Concord Township",
        metaDescription: "Don't have a printer? You're not alone—most people don't anymore. Bring your phone or email, and we'll print your label in 30 seconds.",
        heroTitle: "Print a Return Shipping Label Without a Printer",
        heroSubtitle: "Don't have a printer? You're not alone—most people don't anymore. Bring your phone or email, and we'll print your label in 30 seconds.",
        heroImage: getServiceImageUrl("/images/micro/print-label.webp"),
        content: [
            {
                heading: "What We Do",
                body: "You show us the label (email, text, QR code, screenshot—anything), we print it on the right paper, and you're done."
            },
            {
                heading: "Why This Happens",
                body: "Retailers still assume everyone has a printer. They don't. It's 2025. You shouldn't need one just to return a pair of shoes."
            },
            {
                heading: "How We Help",
                body: `<ol>
<li>Open the return email or text on your phone</li>
<li>Show us the label (PDF, image, QR code—any format works)</li>
<li>We print it on proper adhesive label paper</li>
<li>We can attach it to your package if you need help</li>
<li>Drop it off or we hand it to the carrier for you</li>
</ol>`
            },
            {
                heading: "What to Bring",
                body: `<ul>
<li>Your phone with the return email/label open</li>
<li>Or just your order number—we can usually pull it up</li>
<li>The item if you need us to package it too</li>
</ul>`
            }
        ],
        faqs: [
            {
                question: "What if the label is a QR code?",
                answer: "Perfect—we scan and print those all the time. Most Amazon returns are QR codes now."
            },
            {
                question: "Can you email me the label so I can come back later?",
                answer: "If you forward us the email, yes. But honestly, it's faster to just show us your phone and print it now."
            },
            {
                question: "Do you charge for printing labels?",
                answer: "$1–2 depending on size. If you're also using our packing or shipping services, we usually include it."
            }
        ],
        cta: {
            title: "Stop by with your phone—we'll have you out the door in under 2 minutes.",
            buttonText: "Get Directions",
            buttonLink: "/contact-us"
        }
    },
    {
        id: "print-amazon-return-label",
        category: "micro-problem",
        city: "Concord Township",
        serviceName: "Print an Amazon Return Label",
        slug: "/print-amazon-return-label",
        pageTitle: "Print an Amazon Return Label in Concord Township (QR Code or PDF)",
        metaDescription: "Amazon gave you a QR code or PDF label? We print them every single day. Show us your phone or email—takes 30 seconds. We can help you pack the item too.",
        heroTitle: "Print an Amazon Return Label (QR Code or PDF)",
        heroSubtitle: "Amazon gave you a QR code or PDF label? We print them every single day. Show us your phone or email—takes 30 seconds.",
        heroImage: getServiceImageUrl("/images/micro/print-label.webp"),
        content: [
            {
                heading: "What We Do",
                body: "We print your Amazon return label (from the PDF), help you pack it if needed, and hand it straight to the carrier. No printer required."
            },
            {
                heading: "Why This Happens",
                body: "Amazon's return system assumes you have a printer. Half the time they give you a QR code, half the time they give you a PDF. We need to have the label."
            },
            {
                heading: "How We Help",
                body: `<ol>
<li>Open your Amazon app or return email</li>
<li>Tap "Print label"</li>
<li>We print the label</li>
<li>If you need the item packed, we do that too</li>
<li>We drop it with UPS, USPS, or the carrier Amazon assigned</li>
</ol>`
            },
            {
                heading: "What to Bring",
                body: `<ul>
<li>Your phone with the Amazon return pulled up</li>
<li>The item you're returning (if you want us to pack it)</li>
<li>Original box optional—we have boxes if you don't</li>
</ul>`
            }
        ],
        faqs: [
            {
                question: 'Amazon says "QR code label-free return"—do I still need a label?',
                answer: "If you'd rather we handle it, we can not scan the code. We need a label and then we can pack it for you."
            },
            {
                question: "Amazon assigned UPS—can I drop it off?",
                answer: "Yes. We acceptUPS returns every day."
            },
            {
                question: "What if I don't have the original box?",
                answer: "Totally fine. We'll box it securely."
            }
        ],
        cta: {
            title: "Bring your phone and your return—we'll handle the rest in under 5 minutes.",
            buttonText: "Get Directions",
            buttonLink: "/contact-us"
        }
    },
    {
        id: "package-a-return-so-its-accepted-by-the-carrier",
        category: "micro-problem",
        city: "Concord Township",
        serviceName: "Package a Return So It's Accepted by the Carrier",
        slug: "/package-a-return-so-its-accepted-by-the-carrier",
        pageTitle: "Package a Return So It's Accepted by the Carrier in Concord Township",
        metaDescription: "Worried the carrier will reject your return because it's not packed right? That happens—and it's frustrating. We'll pack it to carrier standards so it gets accepted the first time.",
        heroTitle: "Package a Return So It's Accepted by the Carrier",
        heroSubtitle: "Worried the carrier will reject your return because it's not packed right? That happens—and it's frustrating. We'll pack it to carrier standards so it gets accepted the first time.",
        heroImage: getServiceImageUrl("/images/micro/pack-ship.webp"),
        content: [
            {
                heading: "What We Do",
                body: "We pack your return using the right box, proper cushioning, and carrier-compliant materials. Then we hand it directly to UPS, FedEx, or USPS so there's no question it'll be accepted."
            },
            {
                heading: "Why This Happens",
                body: "Carriers have rules: box condition, weight distribution, sealing method, label placement. Most people don't know these rules until a package gets rejected. We know them cold."
            },
            {
                heading: "How We Help",
                body: `<ol>
<li>You bring the item and tell us which carrier</li>
<li>We choose a box that meets their size/weight requirements</li>
<li>We pad and protect the item so it won't shift or break</li>
<li>We seal it with proper tape (not scotch tape or string)</li>
<li>We place the label exactly where the carrier expects it</li>
<li>We hand it to the carrier for you</li>
</ol>`
            },
            {
                heading: "What to Bring",
                body: `<ul>
<li>The item you're returning</li>
<li>Your return label or order info</li>
<li>Any return instructions from the retailer</li>
</ul>`
            }
        ],
        faqs: [
            {
                question: "How do I know if my packaging would be rejected?",
                answer: "Common rejections: box is damaged, item rattles inside, tape isn't strong enough, label is in the wrong spot, or the box is unsealed. We fix all of that."
            },
            {
                question: "What if I already packed it but I'm not sure it's good enough?",
                answer: "Bring it in. We'll check it for free. If it needs adjusting, we'll repack it properly."
            },
            {
                question: "Do different carriers have different rules?",
                answer: "Yes. UPS is strict about box condition. FedEx cares about weight distribution. USPS has size limits for certain services. We know all of them."
            }
        ],
        cta: {
            title: "Bring your return in—we'll make sure it gets accepted. No appointment needed.",
            buttonText: "Get Directions",
            buttonLink: "/contact-us"
        }
    },
    {
        id: "ups-drop-off-near-concord-township-not-sure-if-its-packed-right",
        category: "micro-problem",
        city: "Concord Township",
        serviceName: "UPS Drop-Off But Unsure If It's Packed Correctly",
        slug: "/ups-drop-off-near-concord-township-not-sure-if-its-packed-right",
        pageTitle: "UPS Drop-Off Near Concord Township – Not Sure If It's Packed Right?",
        metaDescription: "Already packed your box but worried UPS will reject it? We check packages all day. Bring it in—we'll either confirm it's good to go or fix it on the spot.",
        heroTitle: "UPS Drop-Off Near Concord Township – Not Sure If It's Packed Right?",
        heroSubtitle: "Already packed your box but worried UPS will reject it? We check packages all day. Bring it in—we'll either confirm it's good to go or fix it on the spot.",
        heroImage: getServiceImageUrl("/images/micro/pack-ship.webp"),
        content: [
            {
                heading: "What We Do",
                body: "We inspect your package against UPS requirements (box condition, cushioning, sealing, label placement). If it passes, you drop it off. If not, we repack it in 5 minutes."
            },
            {
                heading: "Why This Happens",
                body: "UPS drivers can refuse packages that don't meet standards: torn boxes, weak tape, items moving inside, labels covering seams. You don't know the rules until they say no."
            },
            {
                heading: "How We Help",
                body: `<ol>
<li>Bring your packed box to the counter</li>
<li>We check: box integrity, cushioning, seal strength, label position</li>
<li>If it's good, we accept it for UPS pickup</li>
<li>If it needs fixing, we repack or reinforce it right there</li>
<li>You get a receipt and tracking number</li>
</ol>`
            },
            {
                heading: "What to Bring",
                body: `<ul>
<li>Your packed box</li>
<li>UPS label (printed or on your phone)</li>
<li>A couple extra minutes if it needs adjusting</li>
</ul>`
            }
        ],
        faqs: [
            {
                question: "What if UPS rejects my package after I drop it off with you?",
                answer: "If we accept it, UPS accepts it. We're a UPS authorized location—we know their standards. If there's ever an issue, we fix it at no extra charge."
            },
            {
                question: "Can you just reinforce my box without repacking everything?",
                answer: "Yes. Often we just add corner protection, better tape, or a layer of bubble wrap. Takes 2 minutes, costs $2–3."
            },
            {
                question: "Do I have to repack it in a new box?",
                answer: "Only if the current box is damaged or too weak. Most of the time we can work with what you brought."
            }
        ],
        cta: {
            title: "Walk in with your box—we'll check it for free and make sure UPS takes it.",
            buttonText: "Get Directions",
            buttonLink: "/contact-us"
        }
    },
    {
        id: "fedex-drop-off-in-concord-township-have-label-need-packaging",
        category: "micro-problem",
        city: "Concord Township",
        serviceName: "FedEx Drop-Off With Label But No Packaging",
        slug: "/fedex-drop-off-in-concord-township-have-label-need-packaging",
        pageTitle: "FedEx Drop-Off in Concord Township – Have Label, Need Packaging",
        metaDescription: "Got your FedEx label printed but nothing to put it in? No problem. We'll box it, pad it, attach your label, and hand it to FedEx. Takes about 5 minutes.",
        heroTitle: "FedEx Drop-Off in Concord Township – Have Label, Need Packaging",
        heroSubtitle: "Got your FedEx label printed but nothing to put it in? No problem. We'll box it, pad it, attach your label, and hand it to FedEx. Takes about 5 minutes.",
        heroImage: getServiceImageUrl("/images/micro/pack-ship.webp"),
        content: [
            {
                heading: "What We Do",
                body: "You bring the item and label. We provide the box, cushioning, tape, and proper packing. Then we drop it with FedEx and give you a receipt."
            },
            {
                heading: "Why This Happens",
                body: "FedEx (and most retailers) assume you have boxes lying around. You don't. Most people don't. That's why we exist."
            },
            {
                heading: "How We Help",
                body: `<ol>
<li>Bring your item and FedEx label (printed or on phone)</li>
<li>We select the right-sized box for your item</li>
<li>We cushion and secure the item inside</li>
<li>We attach your label in the correct spot</li>
<li>We hand it to FedEx and scan it into their system</li>
<li>You get a receipt with tracking</li>
</ol>`
            },
            {
                heading: "What to Bring",
                body: `<ul>
<li>The item you're shipping or returning</li>
<li>Your FedEx label (paper or digital)</li>
<li>Any special instructions (fragile, signature required, etc.)</li>
</ul>`
            }
        ],
        faqs: [
            {
                question: "Can I use any box I have at home?",
                answer: "You can, but FedEx may reject it if it's damaged, too big, or improperly sealed. We use boxes that meet FedEx specs."
            },
            {
                question: "What if my label is on my phone?",
                answer: "Perfect—we'll print it on adhesive label paper and attach it for you."
            },
            {
                question: "How much does boxing and packing cost?",
                answer: "Typically $5–10 depending on the size of the item and how much protection it needs."
            }
        ],
        cta: {
            title: "Bring your item and label—we'll have it packed and dropped off in minutes.",
            buttonText: "Get Directions",
            buttonLink: "/contact-us"
        }
    },
    {
        id: "usps-drop-off-in-concord-township-label-printing-and-packaging-help",
        category: "micro-problem",
        city: "Concord Township",
        serviceName: "USPS Drop-Off With Label and Packaging Help",
        slug: "/usps-drop-off-in-concord-township-label-printing-and-packaging-help",
        pageTitle: "USPS Drop-Off in Concord Township – Label Printing and Packaging Help",
        metaDescription: "Need to drop something off with USPS but you're not sure about the label or the packaging? We handle both. Print, pack, and drop off—all in one stop.",
        heroTitle: "USPS Drop-Off in Concord Township – Label Printing and Packaging Help",
        heroSubtitle: "Need to drop something off with USPS but you're not sure about the label or the packaging? We handle both. Print, pack, and drop off—all in one stop.",
        heroImage: getServiceImageUrl("/images/micro/pack-ship.webp"),
        content: [
            {
                heading: "What We Do",
                body: "We print USPS labels, pack items to postal standards, and accept packages for USPS pickup. Whether you have a label or need us to create one, we've got you covered."
            },
            {
                heading: "Why This Happens",
                body: "USPS has specific rules: flat rate boxes, media mail restrictions, label formats, size limits. Most people find out about these at the post office counter after waiting in line."
            },
            {
                heading: "How We Help",
                body: `<ol>
<li>Bring your item and label info (or just the destination)</li>
<li>We print your USPS label if you need one</li>
<li>We select compliant packaging (flat rate, priority, or custom box)</li>
<li>We pack it securely and attach the label</li>
<li>We hand it to USPS.</li>
</ol>`
            },
            {
                heading: "What to Bring",
                body: `<ul>
<li>The item you're shipping</li>
<li>USPS label (email or we can create one)</li>
<li>Destination address if we're creating the label</li>
</ul>`
            }
        ],
        faqs: [
            {
                question: "Can you tell me if my item qualifies for flat rate?",
                answer: "Yes. We'll weigh it, measure it, and show you the cost difference between flat rate and regular Priority Mail."
            },
            {
                question: "What if I need it postmarked today?",
                answer: "USPS picks up from us daily (usually by 2pm). If you come in before noon, it'll go out same-day."
            },
            {
                question: "Can I ship this as Media Mail?",
                answer: "We'll check. Media Mail is cheap but restricted (books, educational materials, recordings). If it qualifies, we'll use it. If not, we'll show you the next cheapest option."
            }
        ],
        cta: {
            title: "Stop by before 2pm for same-day USPS pickup. No appointment needed.",
            buttonText: "Get Directions",
            buttonLink: "/contact-us"
        }
    },
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
<li>We add \"Heavy\" labels so handlers know</li>
<li>We hand it to the carrier with weight documentation</li>
</ol>`
            },
            {
                heading: 'What to Bring',
                body: `<ul>
<li>The heavy item</li>
<li>Destination address</li>
<li>Patience—we\'ll show you options and you pick what makes sense</li>
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
    }
];

