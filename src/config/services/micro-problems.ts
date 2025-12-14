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
        heroImage: getServiceImageUrl("/images/micro/print-label.webp")
    }
];
