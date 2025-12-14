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
    }
];
