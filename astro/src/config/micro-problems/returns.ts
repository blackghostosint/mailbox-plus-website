import type { Service } from '../../types/services';
import { getServiceImageUrl } from '../../lib/storage';

export const returnMicroProblems: Service[] = [
  {
    id: 'return-without-original-box',
    category: 'micro-problem',
    city: 'Concord Township',
    serviceName: 'Return a Package Without the Original Box',
    slug: '/return-without-original-box',
    pageTitle: 'Return a Package Without the Original Box in Concord Township',
    metaDescription:
      'Lost your original box? Mailbox Plus in Concord Township provides professional packing services to ensure your return items are shipped safely and securely.',
    heroTitle: 'Return a Package Without the Original Box',
    heroSubtitle: 'Lost the original packaging? We can help prepare your return properly.',
    heroImage: getServiceImageUrl('/images/micro/pack-ship.webp'),
    robots: 'index, follow',
  },
  {
    id: 'print-return-label-without-printer',
    category: 'micro-problem',
    city: 'Concord Township',
    serviceName: 'Print a Return Shipping Label Without a Printer',
    slug: '/print-return-label-without-printer',
    pageTitle: 'Print a Return Shipping Label Without a Printer Near Concord Township',
    metaDescription:
      "Don't have a printer? You're not alone—most people don't anymore. Bring your phone or email, and we'll print your label in 30 seconds.",
    heroTitle: 'Print a Return Shipping Label Without a Printer',
    heroSubtitle:
      "Don't have a printer? You're not alone—most people don't anymore. Bring your phone or email, and we'll print your label in 30 seconds.",
    heroImage: getServiceImageUrl('/images/micro/print-label.webp'),
    content: [
      {
        heading: 'What We Do',
        body: "You show us the label (email, text, QR code, screenshot—anything), we print it on the right paper, and you're done.",
      },
      {
        heading: 'Why This Happens',
        body: "Retailers still assume everyone has a printer. They don't. It's 2025. You shouldn't need one just to return a pair of shoes.",
      },
      {
        heading: 'How We Help',
        body: `<ol>
<li>Open the return email or text on your phone</li>
<li>Show us the label (PDF, image, QR code—any format works)</li>
<li>We print it on proper adhesive label paper</li>
<li>We can attach it to your package if you need help</li>
<li>Drop it off or we hand it to the carrier for you</li>
</ol>`,
      },
      {
        heading: 'What to Bring',
        body: `<ul>
<li>Your phone with the return email/label open</li>
<li>Or just your order number—we can usually pull it up</li>
<li>The item if you need us to package it too</li>
</ul>`,
      },
    ],
    faqs: [
      {
        question: 'What if the label is a QR code?',
        answer:
          'Perfect—we scan and print those all the time. Most Amazon returns are QR codes now.',
      },
      {
        question: 'Can you email me the label so I can come back later?',
        answer:
          "If you forward us the email, yes. But honestly, it's faster to just show us your phone and print it now.",
      },
      {
        question: 'Do you charge for printing labels?',
        answer:
          "$1–2 depending on size. If you're also using our packing or shipping services, we usually include it.",
      },
    ],
    cta: {
      title: "Stop by with your phone—we'll have you out the door in under 2 minutes.",
      buttonText: 'Get Directions',
      buttonLink: '/contact-us',
    },
    robots: 'index, follow',
  },
  {
    id: 'print-amazon-return-label',
    category: 'micro-problem',
    city: 'Concord Township',
    serviceName: 'Print an Amazon Return Label',
    slug: '/print-amazon-return-label',
    pageTitle: 'Print an Amazon Return Label in Concord Township (QR Code or PDF)',
    metaDescription:
      'Amazon gave you a QR code or PDF label? We print them every single day. Show us your phone or email—takes 30 seconds. We can help you pack the item too.',
    heroTitle: 'Print an Amazon Return Label (QR Code or PDF)',
    heroSubtitle:
      'Amazon gave you a QR code or PDF label? We print them every single day. Show us your phone or email—takes 30 seconds.',
    heroImage: getServiceImageUrl('/images/micro/print-label.webp'),
    content: [
      {
        heading: 'What We Do',
        body: 'We print your Amazon return label (from the PDF), help you pack it if needed, and hand it straight to the carrier. No printer required.',
      },
      {
        heading: 'Why This Happens',
        body: "Amazon's return system assumes you have a printer. Half the time they give you a QR code, half the time they give you a PDF. We need to have the label.",
      },
      {
        heading: 'How We Help',
        body: `<ol>
<li>Open your Amazon app or return email</li>
<li>Tap "Print label"</li>
<li>We print the label</li>
<li>If you need the item packed, we do that too</li>
<li>We drop it with UPS, USPS, or the carrier Amazon assigned</li>
</ol>`,
      },
      {
        heading: 'What to Bring',
        body: `<ul>
<li>Your phone with the Amazon return pulled up</li>
<li>The item you're returning (if you want us to pack it)</li>
<li>Original box optional—we have boxes if you don't</li>
</ul>`,
      },
    ],
    faqs: [
      {
        question: 'Amazon says "QR code label-free return"—do I still need a label?',
        answer:
          "If you'd rather we handle it, we can not scan the code. We need a label and then we can pack it for you.",
      },
      {
        question: 'Amazon assigned UPS—can I drop it off?',
        answer: 'Yes. We acceptUPS returns every day.',
      },
      {
        question: "What if I don't have the original box?",
        answer: "Totally fine. We'll box it securely.",
      },
    ],
    cta: {
      title: "Bring your phone and your return—we'll handle the rest in under 5 minutes.",
      buttonText: 'Get Directions',
      buttonLink: '/contact-us',
    },
    robots: 'index, follow',
  },
  {
    id: 'package-a-return-so-its-accepted-by-the-carrier',
    category: 'micro-problem',
    city: 'Concord Township',
    serviceName: "Package a Return So It's Accepted by the Carrier",
    slug: '/package-a-return-so-its-accepted-by-the-carrier',
    pageTitle: "Package a Return So It's Accepted by the Carrier in Concord Township",
    metaDescription:
      "Worried the carrier will reject your return because it's not packed right? That happens—and it's frustrating. We'll pack it to carrier standards so it gets accepted the first time.",
    heroTitle: "Package a Return So It's Accepted by the Carrier",
    heroSubtitle:
      "Worried the carrier will reject your return because it's not packed right? That happens—and it's frustrating. We'll pack it to carrier standards so it gets accepted the first time.",
    heroImage: getServiceImageUrl('/images/micro/pack-ship.webp'),
    content: [
      {
        heading: 'What We Do',
        body: "We pack your return using the right box, proper cushioning, and carrier-compliant materials. Then we hand it directly to UPS, FedEx, or USPS so there's no question it'll be accepted.",
      },
      {
        heading: 'Why This Happens',
        body: "Carriers have rules: box condition, weight distribution, sealing method, label placement. Most people don't know these rules until a package gets rejected. We know them cold.",
      },
      {
        heading: 'How We Help',
        body: `<ol>
<li>You bring the item and tell us which carrier</li>
<li>We choose a box that meets their size/weight requirements</li>
<li>We pad and protect the item so it won't shift or break</li>
<li>We seal it with proper tape (not scotch tape or string)</li>
<li>We place the label exactly where the carrier expects it</li>
<li>We hand it to the carrier for you</li>
</ol>`,
      },
      {
        heading: 'What to Bring',
        body: `<ul>
<li>The item you're returning</li>
<li>Your return label or order info</li>
<li>Any return instructions from the retailer</li>
</ul>`,
      },
    ],
    faqs: [
      {
        question: 'How do I know if my packaging would be rejected?',
        answer:
          "Common rejections: box is damaged, item rattles inside, tape isn't strong enough, label is in the wrong spot, or the box is unsealed. We fix all of that.",
      },
      {
        question: "What if I already packed it but I'm not sure it's good enough?",
        answer:
          "Bring it in. We'll check it for free. If it needs adjusting, we'll repack it properly.",
      },
      {
        question: 'Do different carriers have different rules?',
        answer:
          'Yes. UPS is strict about box condition. FedEx cares about weight distribution. USPS has size limits for certain services. We know all of them.',
      },
    ],
    cta: {
      title: "Bring your return in—we'll make sure it gets accepted. No appointment needed.",
      buttonText: 'Get Directions',
      buttonLink: '/contact-us',
    },
    robots: 'index, follow',
  },
  {
    id: 'ups-drop-off-near-concord-township-not-sure-if-its-packed-right',
    category: 'micro-problem',
    city: 'Concord Township',
    serviceName: "UPS Drop-Off But Unsure If It's Packed Correctly",
    slug: '/ups-drop-off-near-concord-township-not-sure-if-its-packed-right',
    pageTitle: "UPS Drop-Off Near Concord Township – Not Sure If It's Packed Right?",
    metaDescription:
      "Already packed your box but worried UPS will reject it? We check packages all day. Bring it in—we'll either confirm it's good to go or fix it on the spot.",
    heroTitle: "UPS Drop-Off Near Concord Township – Not Sure If It's Packed Right?",
    heroSubtitle:
      "Already packed your box but worried UPS will reject it? We check packages all day. Bring it in—we'll either confirm it's good to go or fix it on the spot.",
    heroImage: getServiceImageUrl('/images/micro/pack-ship.webp'),
    content: [
      {
        heading: 'What We Do',
        body: 'We inspect your package against UPS requirements (box condition, cushioning, sealing, label placement). If it passes, you drop it off. If not, we repack it in 5 minutes.',
      },
      {
        heading: 'Why This Happens',
        body: "UPS drivers can refuse packages that don't meet standards: torn boxes, weak tape, items moving inside, labels covering seams. You don't know the rules until they say no.",
      },
      {
        heading: 'How We Help',
        body: `<ol>
<li>Bring your packed box to the counter</li>
<li>We check: box integrity, cushioning, seal strength, label position</li>
<li>If it's good, we accept it for UPS pickup</li>
<li>If it needs fixing, we repack or reinforce it right there</li>
<li>You get a receipt and tracking number</li>
</ol>`,
      },
      {
        heading: 'What to Bring',
        body: `<ul>
<li>Your packed box</li>
<li>UPS label (printed or on your phone)</li>
<li>A couple extra minutes if it needs adjusting</li>
</ul>`,
      },
    ],
    faqs: [
      {
        question: 'What if UPS rejects my package after I drop it off with you?',
        answer:
          "If we accept it, UPS accepts it. We're a UPS authorized location—we know their standards. If there's ever an issue, we fix it at no extra charge.",
      },
      {
        question: 'Can you just reinforce my box without repacking everything?',
        answer:
          'Yes. Often we just add corner protection, better tape, or a layer of bubble wrap. Takes 2 minutes, costs $2–3.',
      },
      {
        question: 'Do I have to repack it in a new box?',
        answer:
          'Only if the current box is damaged or too weak. Most of the time we can work with what you brought.',
      },
    ],
    cta: {
      title: "Walk in with your box—we'll check it for free and make sure UPS takes it.",
      buttonText: 'Get Directions',
      buttonLink: '/contact-us',
    },
    robots: 'index, follow',
  },
  {
    id: 'fedex-drop-off-in-concord-township-have-label-need-packaging',
    category: 'micro-problem',
    city: 'Concord Township',
    serviceName: 'FedEx Drop-Off With Label But No Packaging',
    slug: '/fedex-drop-off-in-concord-township-have-label-need-packaging',
    pageTitle: 'FedEx Drop-Off in Concord Township – Have Label, Need Packaging',
    metaDescription:
      "Got your FedEx label printed but nothing to put it in? No problem. We'll box it, pad it, attach your label, and hand it to FedEx. Takes about 5 minutes.",
    heroTitle: 'FedEx Drop-Off in Concord Township – Have Label, Need Packaging',
    heroSubtitle:
      "Got your FedEx label printed but nothing to put it in? No problem. We'll box it, pad it, attach your label, and hand it to FedEx. Takes about 5 minutes.",
    heroImage: getServiceImageUrl('/images/micro/pack-ship.webp'),
    content: [
      {
        heading: 'What We Do',
        body: 'You bring the item and label. We provide the box, cushioning, tape, and proper packing. Then we drop it with FedEx and give you a receipt.',
      },
      {
        heading: 'Why This Happens',
        body: "FedEx (and most retailers) assume you have boxes lying around. You don't. Most people don't. That's why we exist.",
      },
      {
        heading: 'How We Help',
        body: `<ol>
<li>Bring your item and FedEx label (printed or on phone)</li>
<li>We select the right-sized box for your item</li>
<li>We cushion and secure the item inside</li>
<li>We attach your label in the correct spot</li>
<li>We hand it to FedEx and scan it into their system</li>
<li>You get a receipt with tracking</li>
</ol>`,
      },
      {
        heading: 'What to Bring',
        body: `<ul>
<li>The item you're shipping or returning</li>
<li>Your FedEx label (paper or digital)</li>
<li>Any special instructions (fragile, signature required, etc.)</li>
</ul>`,
      },
    ],
    faqs: [
      {
        question: 'Can I use any box I have at home?',
        answer:
          "You can, but FedEx may reject it if it's damaged, too big, or improperly sealed. We use boxes that meet FedEx specs.",
      },
      {
        question: 'What if my label is on my phone?',
        answer: "Perfect—we'll print it on adhesive label paper and attach it for you.",
      },
      {
        question: 'How much does boxing and packing cost?',
        answer:
          'Typically $5–10 depending on the size of the item and how much protection it needs.',
      },
    ],
    cta: {
      title: "Bring your item and label—we'll have it packed and dropped off in minutes.",
      buttonText: 'Get Directions',
      buttonLink: '/contact-us',
    },
    robots: 'index, follow',
  },
  {
    id: 'usps-drop-off-in-concord-township-label-printing-and-packaging-help',
    category: 'micro-problem',
    city: 'Concord Township',
    serviceName: 'USPS Drop-Off With Label and Packaging Help',
    slug: '/usps-drop-off-in-concord-township-label-printing-and-packaging-help',
    pageTitle: 'USPS Drop-Off in Concord Township – Label Printing and Packaging Help',
    metaDescription:
      "Need to drop something off with USPS but you're not sure about the label or the packaging? We handle both. Print, pack, and drop off—all in one stop.",
    heroTitle: 'USPS Drop-Off in Concord Township – Label Printing and Packaging Help',
    heroSubtitle:
      "Need to drop something off with USPS but you're not sure about the label or the packaging? We handle both. Print, pack, and drop off—all in one stop.",
    heroImage: getServiceImageUrl('/images/micro/pack-ship.webp'),
    content: [
      {
        heading: 'What We Do',
        body: "We print USPS labels, pack items to postal standards, and accept packages for USPS pickup. Whether you have a label or need us to create one, we've got you covered.",
      },
      {
        heading: 'Why This Happens',
        body: 'USPS has specific rules: flat rate boxes, media mail restrictions, label formats, size limits. Most people find out about these at the post office counter after waiting in line.',
      },
      {
        heading: 'How We Help',
        body: `<ol>
<li>Bring your item and label info (or just the destination)</li>
<li>We print your USPS label if you need one</li>
<li>We select compliant packaging (flat rate, priority, or custom box)</li>
<li>We pack it securely and attach the label</li>
<li>We hand it to USPS.</li>
</ol>`,
      },
      {
        heading: 'What to Bring',
        body: `<ul>
<li>The item you're shipping</li>
<li>USPS label (email or we can create one)</li>
<li>Destination address if we're creating the label</li>
</ul>`,
      },
    ],
    faqs: [
      {
        question: 'Can you tell me if my item qualifies for flat rate?',
        answer:
          "Yes. We'll weigh it, measure it, and show you the cost difference between flat rate and regular Priority Mail.",
      },
      {
        question: 'What if I need it postmarked today?',
        answer:
          "USPS picks up from us daily (usually by 2pm). If you come in before noon, it'll go out same-day.",
      },
      {
        question: 'Can I ship this as Media Mail?',
        answer:
          "We'll check. Media Mail is cheap but restricted (books, educational materials, recordings). If it qualifies, we'll use it. If not, we'll show you the next cheapest option.",
      },
    ],
    cta: {
      title: 'Stop by before 2pm for same-day USPS pickup. No appointment needed.',
      buttonText: 'Get Directions',
      buttonLink: '/contact-us',
    },
    robots: 'index, follow',
  },
  {
    id: 'drop-off-a-prepaid-label-from-your-phone',
    category: 'micro-problem',
    city: 'Concord Township',
    serviceName: 'Drop Off a Prepaid Label From Your Phone',
    slug: '/drop-off-a-prepaid-label-from-your-phone',
    pageTitle: 'Drop Off a Prepaid Label From Your Phone in Concord Township',
    metaDescription:
      "Show us your QR code or prepaid label on your phone—we'll print it, attach it, and drop it off for you. Takes 2 minutes. No printer needed.",
    heroTitle: 'Drop Off a Prepaid Label From Your Phone',
    heroSubtitle:
      "Show us your screen—we'll print it, attach it, and drop it off for you. Takes 2 minutes.",
    heroImage: getServiceImageUrl('/images/micro/pack-ship.webp'),
    content: [
      {
        heading: 'What We Do',
        body: 'You show us the prepaid label (email, text, app, PDF, QR code—any format), we print it on adhesive label paper, and we accept the package for carrier pickup.',
      },
      {
        heading: 'Why This Happens',
        body: 'Retailers assume you have a printer. Most people don\'t anymore. They send you a label and say "print and attach." We\'re the print-and-attach place.',
      },
      {
        heading: 'How We Help',
        body: `<ol>
<li>Open the label on your phone (email, app, screenshot, QR code)</li>
<li>Show it to us at the counter</li>
<li>We print it on proper label paper</li>
<li>We attach it to your package (or you can do it yourself)</li>
<li>We drop it with the carrier</li>
<li>You get a receipt with tracking</li>
</ol>`,
      },
      {
        heading: 'What to Bring',
        body: `<ul>
<li>Your phone with the label pulled up</li>
<li>The item if you need it packed</li>
<li>Literally nothing else</li>
</ul>`,
      },
    ],
    faqs: [
      {
        question: "What if it's a QR code?",
        answer: 'Perfect—we scan it and print the label in 10 seconds.',
      },
      {
        question: 'Do I need to email you the label?',
        answer: 'Nope. Just show us your phone.',
      },
      {
        question: 'What if the label is buried in my email?',
        answer:
          "We'll help you find it. Or just give us your order number—we can usually pull it up.",
      },
    ],
    cta: {
      title: "Walk in with your phone—seriously, that's all you need.",
      buttonText: 'Get Directions',
      buttonLink: '/contact-us',
    },
    robots: 'index, follow',
  },
  {
    id: 'ship-a-return-with-strict-size-or-weight-limits',
    category: 'micro-problem',
    city: 'Concord Township',
    serviceName: 'Ship a Return With Strict Size or Weight Limits',
    slug: '/ship-return-strict-size-weight-limits',
    pageTitle: 'Ship a Return With Strict Size or Weight Limits in Concord Township',
    metaDescription:
      "Retailer says your return has to be under a certain size or weight or they'll reject it? We measure and weigh accurately, then pack it to fit their requirements.",
    heroTitle: 'Ship a Return With Strict Size or Weight Limits',
    heroSubtitle:
      "Retailer says your return has to be under a certain size or weight or they'll reject it? We measure and weigh accurately, then pack it to fit their requirements exactly.",
    heroImage: getServiceImageUrl('/images/micro/pack-ship.webp'),
    content: [
      {
        heading: 'What We Do',
        body: "We check the retailer's limits, weigh your item on a certified scale, measure the box dimensions, and repack if needed to meet their specifications.",
      },
      {
        heading: 'Why This Happens',
        body: 'Many retailers (especially online fashion or subscription boxes) have strict return policies: "must be under 5 lbs," "box must be under 20 inches on any side." Go over and they refuse the return or charge you.',
      },
      {
        heading: 'How We Help',
        body: `<ol>
<li>Bring the return item and the retailer's instructions</li>
<li>We weigh it on our certified scale</li>
<li>We measure the packed dimensions</li>
<li>If it's over, we repack in a smaller box or remove excess packaging</li>
<li>We confirm it meets specs before handing it to the carrier</li>
<li>You get a receipt with the weight and dimensions noted</li>
</ol>`,
      },
      {
        heading: 'What to Bring',
        body: `<ul>
<li>The item you're returning</li>
<li>Return instructions or email (with size/weight limits)</li>
<li>Return label or order number</li>
</ul>`,
      },
    ],
    faqs: [
      {
        question: "What if it's just barely over the weight limit?",
        answer:
          "We'll remove unnecessary packaging (extra bubble wrap, oversized box) and reweigh. Often that brings it under.",
      },
      {
        question: 'Can you split it into two returns?',
        answer:
          'If the retailer allows multiple return shipments, yes. But check their policy first—some charge per return.',
      },
      {
        question: "What if the retailer's limits are unrealistic?",
        answer:
          "Then we'll help you contact them or suggest an alternative (like refusing the shipment and requesting a refund). But usually we can make it work.",
      },
    ],
    cta: {
      title:
        "Bring the return and the retailer's rules—we'll make sure it fits their requirements.",
      buttonText: 'Get Directions',
      buttonLink: '/contact-us',
    },
    robots: 'index, follow',
  },
  {
    id: 'fix-a-return-that-was-rejected-due-to-packaging-issues-in-concord-township',
    category: 'micro-problem',
    city: 'Concord Township',
    serviceName: 'Fix a Return That Was Rejected Due to Packaging Issues',
    slug: '/fix-a-return-that-was-rejected-due-to-packaging-issues-in-concord-township',
    pageTitle: 'Fix a Return That Was Rejected Due to Packaging Issues in Concord Township',
    metaDescription:
      'UPS, FedEx, or retailer rejected your return due to packaging? We repack returns to carrier standards and re-ship properly. Bring rejected packages to Mailbox Plus in Concord Township.',
    heroTitle: 'Fix a Return That Was Rejected Due to Packaging Issues in Concord Township',
    heroSubtitle:
      "Did UPS, FedEx, or the retailer reject your return because of how it was packed? Frustrating, but fixable. Bring it in—we'll repack it to standards and get it accepted.",
    heroImage: getServiceImageUrl('/images/micro/pack-ship.webp'),
    content: [
      {
        heading: 'What We Do',
        body: 'We figure out why it was rejected (damaged box, insufficient padding, wrong label placement, weight issue), fix it, and re-ship it properly.',
      },
      {
        heading: 'Why This Happens',
        body: "Carriers and retailers have rules most people don't know: box condition, seal strength, label placement, cushioning requirements. One mistake = rejection.",
      },
      {
        heading: 'How We Help',
        body: `<ol>
<li>Bring the rejected package</li>
<li>We identify the issue (box, padding, label, or weight)</li>
<li>We fix it: new box, better padding, correct label placement</li>
<li>We re-ship it with a receipt</li>
<li>You get tracking confirmation</li>
</ol>`,
      },
      {
        heading: 'What to Bring',
        body: `<ul>
<li>The rejected package</li>
<li>Any rejection notice or email</li>
<li>Your return label (or order info to reprint one)</li>
</ul>`,
      },
    ],
    faqs: [
      {
        question: 'Why was my return rejected?',
        answer:
          "Common reasons: box was damaged, item was loose inside, label covered tape or a seam, old labels weren't removed, or the package was overweight.",
      },
      {
        question: 'Will the retailer still accept it if I repack and resend?',
        answer:
          "Yes, as long as you're within their return window. We'll make sure the packaging meets their standards this time.",
      },
      {
        question: 'How much does it cost to fix a rejected return?',
        answer: 'Usually $5–10 for repacking, plus shipping cost if you need a new label.',
      },
    ],
    cta: {
      title: "Bring in the rejected package—we'll figure out what went wrong and fix it today.",
      buttonText: 'Get Directions',
      buttonLink: '/contact-us',
    },
    robots: 'index, follow',
  },
  {
    id: 'vinted-drop-off-concord-township',
    category: 'micro-problem',
    city: 'Concord Township',
    serviceName: 'Vinted Drop-Off Location',
    slug: '/vinted-drop-off',
    pageTitle: 'Vinted Drop-Off Location in Concord Township, OH | Mailbox Plus',
    metaDescription:
      'Selling on Vinted? Drop off your prepaid packages at Mailbox Plus in Concord Township. We are an official Vinted Go drop-off location — fast, friendly, and local.',
    heroTitle: 'Vinted Drop-Off Location in Concord Township',
    heroSubtitle:
      'Selling clothes, shoes, or accessories on Vinted? We are an official Vinted Go drop-off location. Bring your prepaid package — we scan, receipt, and send it on its way.',
    content: [
      {
        heading: 'We Are a Vinted Go Drop-Off Location',
        body: `<p>Mailbox Plus is listed as an official <strong>Vinted Go drop-off point</strong>. If you sell on Vinted and need to ship an item, you can drop your prepaid package at our counter.</p>
<p>When you select a drop-off location on Vinted, choose <strong>Mailbox Plus</strong> at <strong>7554 Fredle Drive, Concord Township</strong> — and we will handle the rest.</p>
<p><a href="https://vintedgo.com/en/carrier-locations?country=us&region=usa&bounds=%7B%22south%22%3A41.62709183690886%2C%22west%22%3A-81.3299555189492%2C%22north%22%3A41.81765298829317%2C%22east%22%3A-81.07463982316776%7D&selected_point=147495" rel="nofollow" target="_blank">View Mailbox Plus on the Vinted Go locations map →</a></p>`,
      },
      {
        heading: 'How Vinted Shipping Works',
        body: `<ol>
<li><strong>You make a sale</strong> on Vinted — the buyer purchases your item.</li>
<li><strong>Vinted generates a prepaid shipping label</strong> with a QR code or barcode.</li>
<li><strong>Pack your item</strong> — box it up securely and attach the label if printed, or bring the QR code on your phone.</li>
<li><strong>Drop it off at Mailbox Plus</strong> — we scan the label or QR code, print it on adhesive paper if needed, and provide a receipt.</li>
<li><strong>We hand it to the carrier</strong> — your package is on its way to the buyer.</li>
</ol>`,
      },
      {
        heading: 'Why Drop Off at Mailbox Plus?',
        body: `<ul>
<li><strong>Official Vinted Go location</strong> — listed on Vinted's carrier locator</li>
<li><strong>No printer needed</strong> — bring the QR code on your phone and we print the label for you</li>
<li><strong>Immediate scanning</strong> — your package is scanned and receipted right away, so Vinted knows it is on its way</li>
<li><strong>No waiting in line</strong> — we are faster and friendlier than the big chain stores</li>
<li><strong>Local convenience</strong> — serving Concord Township, Painesville, Mentor, Willoughby, and all of Lake County</li>
<li><strong>Multi-carrier</strong> — we handle Vinted packages shipped via any of our carrier partners (UPS, FedEx, USPS, DHL)</li>
</ul>`,
      },
      {
        heading: 'What to Bring',
        body: `<ul>
<li>Your packaged item (securely boxed or bagged)</li>
<li>The prepaid shipping label (printed) <strong>or</strong> the QR code/barcode from Vinted on your phone</li>
<li>That is it — no need to print anything at home if you have the QR code</li>
</ul>`,
      },
    ],
    faqs: [
      {
        question: 'Does Mailbox Plus really accept Vinted drop-offs?',
        answer:
          'Yes — we are listed on Vinted Go as an official drop-off location. Just select us when you choose your drop-off point on Vinted.',
      },
      {
        question: 'Do I need to print a label before coming in?',
        answer:
          'No. Bring the QR code or barcode from the Vinted app on your phone. We will print the label on adhesive paper for a small fee.',
      },
      {
        question: 'What are your hours for Vinted drop-offs?',
        answer:
          'Same as our regular hours: Monday–Friday 9:00 AM – 6:00 PM, Saturday 9:00 AM – 2:00 PM. No appointment needed.',
      },
      {
        question: 'How long does it take?',
        answer:
          'Under a minute if you have the QR code ready. We scan, label, receipt, and you are on your way.',
      },
      {
        question: 'Which carriers does Vinted use?',
        answer:
          'Vinted uses various carriers depending on the buyer and seller locations. We accept prepaid packages from all major carriers — UPS, FedEx, USPS, and DHL.',
      },
    ],
    cta: {
      title:
        'Selling on Vinted? Make Mailbox Plus your drop-off spot. Fast, local, and no printer needed.',
      buttonText: 'Get Directions',
      buttonLink: '/contact-us',
    },
    robots: 'index, follow',
  },
];
