import Users from '~icons/lucide/users';
import Star from '~icons/lucide/star';
import NotebookText from '~icons/lucide/notebook-text';
import Shield from '~icons/lucide/shield';
import Clock from '~icons/lucide/clock';
import Truck from '~icons/lucide/truck';
import Package from '~icons/lucide/package';
import Printer from '~icons/lucide/printer';
import Fingerprint from '~icons/lucide/fingerprint';
import Scan from '~icons/lucide/scan';
import { Service } from '../../types/services';
import { getServiceImageUrl } from '../../lib/storage';
import { generalHomeBusinessFaqs, notaryServicesFaqs } from '../faqs';

export const additionalServices: Service[] = [
  // ---------------------------
  // ADDITIONAL SERVICES
  // ---------------------------
  // Nuuly Returns service removed

  {
    id: 'notary-services',
    category: 'additional-services',
    city: 'Concord Township',
    serviceName: 'Notary Services',
    slug: '/home-business/notary-services',
    canonicalUrl: 'https://mailboxplus.com/home-business/notary-services',
    pageTitle: 'Notary Services in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'Walk-in notary in Concord Township. No appointment needed. The Notary Runaround ends here \u2014 $5 per signature, certified notary on staff during all business hours.',
    keywords:
      'notary services, notary public, concord township, lake county, walk-in notary, notary near me',
    heroTitle: 'Notary? Done. No Appointment Needed.',
    heroSubtitle: 'Your document\u2019s ready. The notary shouldn\u2019t be the hard part.',
    heroImage: getServiceImageUrl('/images/notary-services.webp'),
    offers: [
      {
        name: 'Notary Service - Per Signature',
        price: '5.00',
        currency: 'USD',
        availability: 'https://schema.org/InStock',
      },
    ],
    content: [
      {
        heading:
          'The Notary Runaround \u2014 Why Getting One Signature Shouldn\u2019t Take Three Phone Calls',
        body: '<p>You have a document. It needs one signature. One. Simple. Signature.</p><p>You call the bank: "You need an account with us." You call the library: "Our notary is in from 2\u20134 on Tuesdays." The big-box shipping store: "Forty-five minute wait, maybe longer."</p><p>This is <strong>The Notary Runaround</strong> \u2014 a system designed to make a two-minute signature take all afternoon. Every "our notary isn\u2019t here today" adds another errand to your list. Every "come back tomorrow" pushes your deadline closer.</p>',
      },
      {
        heading: 'We\u2019re Your Notary. No Account. No Appointments. No Runaround.',
        body: '<p>At Mailbox Plus, our <strong>certified notary is on staff during all business hours</strong>. Walk in with your unsigned document and a valid ID. That\u2019s it.</p><p><strong>$5 per signature</strong>, as set by Ohio state law. No membership required. No hidden fees. No "come back when our notary is in."</p><p>We notarize contracts, affidavits, real estate documents, powers of attorney, loan documents, and more.</p>',
      },
      {
        heading: 'The 3-Step Plan \u2014 Faster Than a Coffee Run',
        body: '<ol><li><strong>Bring your unsigned document</strong> plus valid government-issued photo ID (driver\u2019s license, state ID, or passport)</li><li><strong>Sign in the presence of our notary</strong> \u2014 we verify your identity and witness your signature</li><li><strong>Done.</strong> Stamped, notarized, back in your day in about 5 minutes</li></ol><p class="mt-4">No forms to fill out ahead of time. No online scheduler. No account creation. Just walk in.</p>',
        isFullWidth: true,
      },
      {
        heading: 'What to Bring & What It Costs',
        body: '<table class="w-full text-sm"><thead><tr><th class="text-left pb-2">What You Need</th><th class="text-left pb-2">Details</th></tr></thead><tbody><tr><td class="pr-4 py-2"><strong>Valid Government ID</strong></td><td>Driver\u2019s license, state ID, or passport \u2014 all signers</td></tr><tr><td class="pr-4 py-2"><strong>Unsigned Document</strong></td><td>Document must be unsigned until you\u2019re in front of the notary</td></tr><tr><td class="pr-4 py-2"><strong>Cost</strong></td><td><strong>$5.00</strong> per signature (Ohio state law, no markup)</td></tr><tr><td class="pr-4 py-2"><strong>Availability</strong></td><td>During all store hours \u2014 walk in, no appointment</td></tr></tbody></table><p class="mt-4">Most documents handled on the spot. For complex real estate closings or multi-signer documents, feel free to call ahead so we can prepare.</p>',
        isFullWidth: true,
      },
      {
        heading: 'What Happens If You Keep Putting It Off?',
        body: '<p>Every "come back tomorrow" is another errand you didn\u2019t need. Another day your document sits unsigned. Another deadline creeping closer.</p><p>That contract you need to submit. That affidavit for court. That power of attorney the bank needs. The one thing holding it up is <strong>one signature</strong>.</p><p>Mailbox Plus has a notary on staff <strong>right now</strong>. While you\u2019re reading this, you could be walking out with a stamped document and checking this off your list.</p>',
      },
      {
        heading: 'Back to Your Day \u2014 It\u2019s That Simple',
        body: '<p>Walk in. Show your ID. Sign. Done.</p><p><strong>Five minutes.</strong> Document stamped, notarized, and ready to go. You checked it off \u2014 no appointment. No runaround. No wasted afternoon.</p><p>That\u2019s how getting something notarized should feel. Simple, fast, and handled by someone who makes sure it\u2019s right.</p><p>While you\u2019re here, ask us about <strong>protecting your privacy with a private mailbox</strong> \u2014 because the same people who need notary services often need their home address off public documents too.</p>',
      },
      {
        heading: 'What Our Customers Say',
        body: '<blockquote class="border-l-4 border-[var(--color-accent-warm)] pl-4 italic text-[var(--color-text-secondary)]"><p>"Walked in, signed, done. No appointment needed. Took maybe 5 minutes."</p><footer class="mt-2 text-sm not-italic text-[var(--color-text-muted)]">\u2014 James R., Concord Township</footer></blockquote><blockquote class="border-l-4 border-[var(--color-accent-warm)] pl-4 italic text-[var(--color-text-secondary)] mt-6"><p>"I called three other places before coming here. Wish I\u2019d started with Mailbox Plus."</p><footer class="mt-2 text-sm not-italic text-[var(--color-text-muted)]">\u2014 Linda M., Painesville</footer></blockquote>',
        isFullWidth: true,
      },
      {
        heading: 'Notary Services & Privacy \u2014 They Go Together',
        body: '<p>Many documents that require notarization also include your home address \u2014 deeds, powers of attorney, loan documents, LLC filings. Once notarized, those documents become public record in many cases.</p><p>That\u2019s why we say: <strong>"We can be your notary and help protect your privacy \u2014 ask us how."</strong></p><p>A Mailbox Plus private mailbox gives you a real street address for your legal documents and business filings \u2014 keeping your home address off public records. <a href="/home-business/mailbox-rental" class="text-[var(--color-primary)] hover:underline">Learn more about mailbox rentals</a>.</p>',
      },
    ],
    features: [
      {
        icon: NotebookText,
        title: 'Certified Notary On Staff',
        description:
          'Our licensed notary is available during all business hours. Walk in, get it done.',
      },
      {
        icon: Clock,
        title: 'No Appointment Needed',
        description: 'Forget the scheduling dance. Just show up with your ID and document.',
      },
      {
        icon: Users,
        title: '$5 Per Signature \u2014 Set by Law',
        description:
          'Ohio state law sets the rate. We don\u2019t mark it up. $5.00 per signature, no hidden fees.',
      },
    ],
    featuresTitle: 'Why Our Notary Service Is Different',
    featuresSubtitle:
      'Certified, available, and priced exactly as the state requires \u2014 no games, no runaround.',
    cta: {
      title: 'Ready to Get That Signature Notarized?',
      subtitle: 'Walk in any time during business hours. No appointment required.',
      buttonText: 'Stop By \u2014 No Appointment Needed',
      buttonLink: '/pickup-hours',
      variant: 'brand',
      align: 'center',
    },
    hideCarrierLogos: true,
    faqs: [...generalHomeBusinessFaqs, ...notaryServicesFaqs],
  },
  {
    id: 'fedex-easy-returns',
    category: 'additional-services',
    city: 'Concord Township',
    serviceName: 'FedEx Easy Returns',
    slug: '/fedex-easy-returns',
    canonicalUrl: 'https://mailboxplus.com/fedex-easy-returns',
    pageTitle: 'FedEx Easy Returns in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'Convenient FedEx Easy Returns in Concord Township. Drop off your pre-labeled or QR code returns quickly. We pack and ship for you.',
    keywords:
      'fedex easy returns, return qr code, return shipping label, concord township, lake county',
    heroTitle: 'FedEx Easy Returns \u2013 Fast, Hassle-Free Returns',
    heroSubtitle: 'Quick drop-offs, QR code scanning, label printing, and tracking receipts.',
    heroImage: getServiceImageUrl('/images/fedex-easy-returns.webp'),
    content: [],
    features: [],
    faqs: [],
  },
  {
    id: 'business-services-concord-township',
    category: 'additional-services',
    city: 'Concord Township',
    serviceName: 'Business Services',
    slug: '/business-services-concord-township',
    canonicalUrl: 'https://mailboxplus.com/business-services-concord-township',
    pageTitle: 'Business Services in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'Essential business services in Concord Township: shipping, printing, mailbox rentals, notary, and more. Your local office away from the office.',
    keywords: 'business services, Concord Township, Mailbox Plus',
    heroTitle: 'Essential Business Services in Concord Township: Mailbox Plus',
    heroSubtitle:
      'Mailbox Plus is the one-stop shop for all your business services in Concord Township, Ohio.',
    heroImage: getServiceImageUrl('/images/pack-ship.webp'),
    content: [
      {
        heading: 'Essential Business Services in Concord Township: Mailbox Plus',
        body: `<p>Mailbox Plus is the one-stop shop for all your <strong><a href="/home-business">business services</a> in Concord Township, Ohio</strong>.</p>
                <p>We provide the essential tools you need to run your business efficiently, without the overhead of a large office.</p>
                <p>From <strong>UPS, FedEx, USPS, and DHL</strong> shipping to private mailbox rentals, <a href="/home-business/notary-services">notary services</a>, and document shredding, we have you covered. Our team acts as your personal support staff, helping you tackle your to-do list so you can focus on what matters most.</p>`,
      },
      {
        heading: 'Your Local Business Support Center',
        body: `<ul>
                    <li><strong>Efficiency:</strong> Get multiple errands done in one quick trip.</li>
                    <li><strong>Reliability:</strong> Count on us for secure handling of your mail and packages.</li>
                    <li><strong>Professionalism:</strong> Enhance your business image with our high-quality services.</li>
                    <li><strong>Flexibility:</strong> We offer solutions tailored to small businesses and home offices.</li>
                    <li><strong>Cost-Effective:</strong> Save money by only paying for the services you need.</li>
                    <li><strong>Local Partner:</strong> We are invested in the success of the Concord Township business community.</li>
                </ul>`,
      },
      {
        heading: 'Comprehensive Business Solutions',
        body: `<ul>
                    <li><strong>Mailbox Rentals:</strong> Get a prestigious street address and secure 24-hour access to your mail.</li>
                    <li><strong>Notary Public:</strong> On-site notary services to legalize your important documents.</li>
                    <li><strong>Document Shredding:</strong> Securely destroy sensitive files and protect your business data.</li>
                    <li><strong>Fax & Scan:</strong> Send and receive faxes or digitize your paper records.</li>
                </ul>`,
      },
    ],
    features: [
      { title: 'Cost', description: 'Low Monthly Fee.', icon: Star },
      { title: 'Staffing', description: 'Our Team Helps You.', icon: Users },
      { title: 'Equipment', description: 'Use Ours (Print/Fax).', icon: Printer },
    ],
    faqs: [
      {
        question: 'Can I use your address for my business?',
        answer:
          'Yes! Our mailbox rentals provide a real street address that you can use for business registration and marketing.',
      },
      {
        question: 'Do you offer volume discounts?',
        answer:
          'We may offer discounts for high-volume shipping or printing. Please ask us for details.',
      },
      {
        question: 'Is the notary always in?',
        answer:
          'Our notary is typically available during all business hours, but feel free to call ahead to confirm.',
      },
    ],
  },
  {
    id: 'amazon-returns-drop-off-concord-township',
    category: 'additional-services',
    city: 'Concord Township',
    serviceName: 'Amazon Returns Drop Off',
    slug: '/amazon-returns-drop-off-concord-township',
    canonicalUrl: 'https://mailboxplus.com/amazon-returns-drop-off-concord-township',
    pageTitle: 'Amazon Returns Drop Off in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'Fast Amazon returns drop-off in Concord Township. Bring your pre-paid UPS label packages to Mailbox Plus for quick, hassle-free returns.',
    keywords: 'Amazon returns drop off, Concord Township, Mailbox Plus',
    heroTitle: 'Easy Amazon Returns Drop Off in Concord Township: Mailbox Plus',
    heroSubtitle:
      'Need to return an Amazon package? Mailbox Plus is your convenient Amazon returns drop-off location in Concord Township, Ohio.',
    heroImage: getServiceImageUrl('/images/ups-shipping.webp'),
    content: [
      {
        heading: 'Easy Amazon Returns Drop Off in Concord Township: Mailbox Plus',
        body: `<p>Need to return an Amazon package? Mailbox Plus is your convenient <strong><a href="/amazon-returns">Amazon returns drop-off</a> location in Concord Township, Ohio</strong>.</p>
                <p>We accept eligible Amazon returns that have a pre-paid UPS shipping label. Skip the long lines at other stores and enjoy a quick, hassle-free <a href="/pack-ship/package-drop-offs">package drop-off</a> experience. While you're here, check out our other services including <strong>FedEx, USPS, and DHL shipping</strong>, packing supplies, and more.</p>`,
      },
      {
        heading: 'Why Drop Off Amazon Returns at Mailbox Plus?',
        body: `<ul>
                <li><strong>Fast & Easy:</strong> We scan your label and get you on your way in seconds.</li>
                <li><strong>No Long Lines:</strong> Avoid the crowds often found at The UPS Store.</li>
                <li><strong>Convenient Location:</strong> Right here in Concord Township, close to home.</li>
                <li><strong>Friendly Service:</strong> Our staff is happy to help with any shipping questions.</li>
                <li><strong>Receipt Provided:</strong> We'll give you a drop-off receipt for your records.</li>
                <li><strong>More Services:</strong> Buy a box or tape if you need to pack your return.</li>
                </ul>`,
      },
      {
        heading: 'Return & Shipping Services',
        body: `<ul>
                <li><strong>Amazon Drop-Offs:</strong> Accepting Amazon returns with pre-paid UPS shipping labels.</li>
                <li><strong>Packing Assistance:</strong> Need a box? We sell packaging supplies to get your return ready.</li>
                <li><strong>Label Printing:</strong> Email us your label and we can print it for you (small fee may apply).</li>
                <li><strong>Multi-Carrier Shipping:</strong> We also ship via FedEx, USPS, and DHL for your other needs.</li>
                </ul>`,
      },
    ],
    features: [
      { title: 'Wait Time', description: 'Minimal.', icon: Clock },
      { title: 'Service', description: 'Personal & Friendly.', icon: Users },
      { title: 'Flexibility', description: 'Accepts UPS, FedEx, USPS.', icon: Truck },
    ],
    faqs: [
      {
        question: 'Do I need to print my label?',
        answer:
          "Yes, please have your label printed and attached to the package. If you don't have a printer, we can print it for a small fee.",
      },
      {
        question: 'Do you take QR codes?',
        answer:
          'Currently, we accept packages with pre-printed shipping labels. For QR codes, please check the instructions from Amazon.',
      },
      {
        question: 'Do I need to box my return?',
        answer: 'Yes, items must be boxed and sealed. We sell boxes and tape if you need them!',
      },
    ],
  },
  {
    id: 'nuuly-returns',
    category: 'additional-services',
    city: 'Concord Township',
    serviceName: 'Nuuly Returns',
    slug: '/nuuly-returns',
    canonicalUrl: 'https://mailboxplus.com/nuuly-returns',
    pageTitle: 'Nuuly Returns in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'Easy Nuuly clothing rental returns in Concord Township. Drop off your Nuuly bag at Mailbox Plus - authorized UPS drop-off location. Fast, convenient service.',
    keywords: 'nuuly returns, clothing rental returns, UPS drop off, concord township, lake county',
    heroTitle: 'Nuuly Returns Drop-Off',
    heroSubtitle:
      'Convenient Nuuly clothing rental returns at your local UPS authorized drop-off location.',
    heroImage: getServiceImageUrl(
      'https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev/nullyreturns.webp'
    ),
    content: [
      {
        heading: 'Fast & Easy Nuuly Returns',
        body: "Returning your Nuuly clothing rental is simple at Mailbox Plus. Just bring your prepaid Nuuly bag with the UPS return label attached, and we'll handle the rest.",
      },
      {
        heading: 'Why Choose Mailbox Plus for Nuuly Returns?',
        body: `<ul>
                    <li><strong>Authorized UPS Drop-Off:</strong> We're an official UPS drop-off location, ensuring your Nuuly return is scanned and processed immediately.</li>
                    <li><strong>Same-Day Processing:</strong> Drop off your Nuuly bag and get it scanned right away so you can unlock your next box faster.</li>
                    <li><strong>Receipt Provided:</strong> We'll give you a receipt confirming your return has been scanned by UPS.</li>
                    <li><strong>No Long Lines:</strong> Skip the crowded UPS Store - we offer faster, friendly service.</li>
                    <li><strong>Local & Convenient:</strong> Located in Concord Township, serving all of Lake County.</li>
                </ul>`,
      },
      {
        heading: 'Simple Nuuly Returns',
        body: 'Mailbox Plus is your local, convenient solution for <strong>Nuuly clothing rental returns</strong>. As an <strong>authorized UPS drop-off location</strong>, we accept Nuuly returns with prepaid labels and provide immediate scanning.',
      },
      {
        heading: 'How It Works',
        body: "Nuuly is a monthly clothing rental subscription. When you're ready to return, simply pack your items in the reusable Nuuly bag, attach the prepaid UPS return label, and drop it off at Mailbox Plus.",
      },
      {
        heading: 'Fast Scanning & Recycling',
        body: 'Our team will <strong>scan your return immediately</strong> and provide you with a <strong>UPS receipt</strong>. This ensures your return is tracked and processed quickly, so you can access your next box without delay.',
        isFullWidth: true,
      },
    ],
    features: [
      {
        icon: Truck,
        title: 'Authorized UPS Location',
        description: 'Official UPS drop-off point for Nuuly returns.',
      },
      {
        icon: Clock,
        title: 'Same-Day Scanning',
        description: 'Get your return scanned immediately.',
      },
      {
        icon: Users,
        title: 'Friendly Service',
        description: 'Personal assistance from our local team.',
      },
    ],
    faqs: [
      {
        question: 'Can I drop off my Nuuly returns at Mailbox Plus?',
        answer:
          "Yes! We are an authorized UPS drop-off location and accept all Nuuly returns with prepaid UPS labels. Just bring your sealed Nuuly bag and we'll scan it right away.",
      },
      {
        question: 'Do I need to print a label for my Nuuly return?',
        answer:
          "No, Nuuly includes a prepaid UPS return label with each delivery. Simply attach it to your Nuuly bag before dropping it off. If you've lost your label, you can print a new one from your Nuuly account.",
      },
      {
        question: 'Will I get a receipt for my Nuuly return?',
        answer:
          'Yes! We provide a UPS receipt showing that your return has been scanned and accepted. This serves as proof of your return.',
      },
      {
        question: 'How quickly will my next Nuuly box unlock after I return my items?',
        answer:
          "Once we scan your return at our location, UPS processes it immediately. Nuuly typically unlocks your next box within minutes of the UPS scan. You can also use Nuuly's 'Check My Return' feature to expedite the process.",
      },
      {
        question: 'What if I forgot to attach the label to my Nuuly bag?',
        answer:
          "No problem! If you have the label with you, we can attach it for you. If you don't have it, you can print a new one from your Nuuly account and bring it back, or we can print it for a small $2.00 fee.",
      },
      {
        question: 'Do you charge for Nuuly returns?',
        answer:
          "No, drop-offs for prepaid packages are free at Mailbox Plus. If you need us to print your return label, there's a $2.00 printing fee.",
      },
    ],
  },
  // ---------------------------
  // DIGITAL FINGERPRINTING
  // ---------------------------
  {
    id: 'digital-fingerprinting',
    category: 'additional-services',
    city: 'Concord Township',
    serviceName: 'Digital Fingerprinting',
    slug: '/specialty/digital-fingerprinting',
    pageTitle: 'Digital Fingerprinting in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'Digital fingerprinting in Concord Township \u2014 walk in, no appointment needed. Fast digital capture for background checks, licensing, and employment. BCI & FBI compliant.',
    keywords: 'digital fingerprinting, background check, BCI, FBI, Concord Township, Lake County',
    heroTitle: 'Digital Fingerprinting \u2014 Walk In, Get Printed, Done.',
    heroSubtitle:
      'Need fingerprints for a job, license, or background check? We make it fast and simple. Digital capture, no ink, no mess, no appointment needed.',
    heroImage: getServiceImageUrl('/images/fingerprinting.webp'),
    hideCarrierLogos: true,
    content: [
      {
        heading: 'The Background Check Runaround \u2014 Why a Two-Minute Task Takes Two Weeks',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              You need fingerprints for a new job, a professional license, or a volunteer position. It should be simple. Instead, you're hunting for appointments weeks out, driving across town during work hours, and wondering why something so routine is so hard to get done.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              <strong>This is the Background Check Runaround.</strong> Some places only fingerprint on Tuesdays. Others require an online reservation system that never has openings. The sheriff's office has limited hours that overlap exactly with your work day.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              Meanwhile, your start date keeps slipping. Or that license renewal is looming. All because of a two-minute fingerprint scan.
            </p>`,
      },
      {
        heading: 'Fast Digital Fingerprinting \u2014 Walk In, We Handle It',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              At Mailbox Plus, we offer <strong>digital fingerprinting services</strong> \u2014 walk in during business hours, no appointment required. Our digital system captures your prints electronically (no ink, no mess) and produces clean, submission-ready results.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              We handle fingerprinting for <strong>BCI background checks, FBI background checks, professional licensing, employment screening, and volunteer organizations</strong>. Just bring your valid government-issued ID and any forms or instructions you received from the requesting agency.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              The whole process takes <strong>just a few minutes</strong>. In and out, back to your day.
            </p>`,
      },
      {
        heading: 'Three Simple Steps to Fingerprinted',
        body: `<div class="grid md:grid-cols-3 gap-6">
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">1</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Walk In With Your ID</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Bring your valid driver's license or state ID, plus any forms from the requesting agency. No appointment needed.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">2</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Digital Scan \u2014 No Ink, No Mess</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Our digital fingerprint scanner captures your prints electronically. Clean, fast, and accurate \u2014 BCI and FBI compliant.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">3</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Done. You're on Your Way</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">We provide your fingerprint card or digital submission receipt. Most visits are done in under 10 minutes.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
      {
        heading: 'Who Uses Our Fingerprinting Services',
        body: `<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <h3 class="font-bold text-[var(--color-text-primary)] mb-2">Job Applicants</h3>
                <p class="text-sm text-[var(--color-text-secondary)]">New hires needing background screening for employment \u2014 we help you get started faster.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <h3 class="font-bold text-[var(--color-text-primary)] mb-2">Licensed Professionals</h3>
                <p class="text-sm text-[var(--color-text-secondary)]">Nurses, teachers, real estate agents, insurance producers, and other licensed professionals requiring BCI/FBI checks.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <h3 class="font-bold text-[var(--color-text-primary)] mb-2">Volunteers</h3>
                <p class="text-sm text-[var(--color-text-secondary)]">Coaching, school volunteering, mentoring \u2014 many organizations require fingerprint-based background checks.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <h3 class="font-bold text-[var(--color-text-primary)] mb-2">Adoptions & Immigration</h3>
                <p class="text-sm text-[var(--color-text-secondary)]">Fingerprint-based background checks for adoption proceedings and immigration applications.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
      {
        heading: 'Every Day You Wait Is a Day Your Application Sits Still',
        body: `<div class="grid md:grid-cols-2 gap-6 mb-8">
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Your Start Date Depends on It</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Many employers can't process your hire until the background check clears. Don't let a fingerprint appointment delay your first paycheck.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">License Renewals Have Deadlines</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Professional licenses lapse if background checks aren't completed in time. Avoid lapses \u2014 get fingerprinted early.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Appointments Are Hard to Find</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Most fingerprinting locations require appointments weeks in advance. We take walk-ins \u2014 just show up during business hours.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">More Than One Errand</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">While you're here: get your <a href="/home-business/notary-services" class="text-[var(--color-primary)] hover:underline">documents notarized</a> or <a href="/copy-print/copies" class="text-[var(--color-primary)] hover:underline">make copies</a> of your application forms.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
      {
        heading: 'Background Check? Check. Done in Minutes.',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Walk in. Get fingerprinted. Walk out. That's it. No appointment, no waiting list, no complicated scheduling dance.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Whether you're starting a new job, renewing a license, or volunteering in your community, we make the fingerprinting part the easiest step in your process.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              <strong>Stop by Mailbox Plus during business hours.</strong> Bring your ID and any forms. We'll take care of the rest.
            </p>`,
      },
    ],
    features: [
      {
        icon: Fingerprint,
        title: 'Digital Capture',
        description: 'Clean electronic fingerprints \u2014 no ink, no mess, no smudges.',
      },
      {
        icon: Clock,
        title: 'Walk-In Friendly',
        description: 'No appointment needed. Fingerprinted in minutes during business hours.',
      },
      {
        icon: Shield,
        title: 'BCI & FBI Compliant',
        description: 'Digital prints accepted for background checks, licensing, and employment.',
      },
    ],
  },
  // ---------------------------
  // SHIPPING INSURANCE
  // ---------------------------
  {
    id: 'insurance',
    category: 'additional-services',
    city: 'Concord Township',
    serviceName: 'Shipping Insurance',
    slug: '/specialty/insurance',
    pageTitle: 'Shipping Insurance in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'Shipping insurance in Concord Township \u2014 protect your valuable shipments. Declared value coverage for UPS, FedEx, USPS, and DHL shipments. Peace of mind included.',
    keywords:
      'shipping insurance, declared value, package protection, Concord Township, Lake County',
    heroTitle: 'Ship With Confidence \u2014 We\u2019ll Make Sure You\u2019re Covered',
    heroSubtitle:
      'Default carrier liability covers almost nothing. Protect your valuable shipments with declared value coverage that actually pays out.',
    heroImage: getServiceImageUrl('/images/pack-ship.webp'),
    hideCarrierLogos: true,
    content: [
      {
        heading: 'The $100 Gamble \u2014 Why Default Coverage Is a Trap',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              You're shipping an expensive item. Artwork worth $500. A repaired laptop worth $1,200. A set of golf clubs worth $800. You drop it off at the counter, pay for shipping, and assume if anything goes wrong, you're covered.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              <strong>You're not.</strong> Default carrier liability for most services is just <strong>$100</strong>. UPS, FedEx, and USPS all limit their base liability to around $100 per package. That means if your $1,200 laptop gets lost or damaged in transit, the carrier pays you $100 \u2014 and you eat the rest.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              <strong>This is the $100 Gamble.</strong> Most people don't know default coverage is so low until it's too late \u2014 and their claim is denied because they didn't declare the value at the counter.
            </p>`,
      },
      {
        heading: 'Declared Value Coverage \u2014 We Make Sure You Know Your Options',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              At Mailbox Plus, we <strong>ask about declared value on every valuable shipment</strong>. We don't just hand you a label and move on \u2014 we help you understand what you're shipping is worth and whether the default coverage is enough.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              <strong>Declared value coverage</strong> is available on UPS, FedEx, and USPS shipments. You tell us the value of your item, and we add the appropriate coverage \u2014 typically a small fee based on the declared amount. If the package is lost or damaged, the carrier pays out up to the declared value.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              For high-value or uniquely valuable items, we can also discuss <strong>third-party shipping insurance</strong> options that provide broader coverage than standard carrier protection.
            </p>`,
      },
      {
        heading: 'Getting Covered Is as Easy as 1-2-3',
        body: `<div class="grid md:grid-cols-3 gap-6">
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">1</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Tell Us What You're Shipping</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Bring in your item. We'll help you determine its value and whether additional coverage is recommended.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">2</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Choose Your Coverage</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">We explain the options \u2014 carrier declared value or third-party insurance \u2014 and the cost. No pressure, just the facts.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">3</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Ship With Peace of Mind</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Your package is shipped with proper coverage. If something goes wrong, you're protected up to the declared value.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
      {
        heading: 'When Should You Add Coverage?',
        body: `<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="text-3xl mb-3">📱</div>
                <h3 class="text-lg font-bold text-[var(--color-text-primary)] mb-1">Electronics</h3>
                <p class="text-sm text-[var(--color-text-secondary)]">Laptops, phones, tablets, and computer components \u2014 repairs and replacements are expensive.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="text-3xl mb-3">🎨</div>
                <h3 class="text-lg font-bold text-[var(--color-text-primary)] mb-1">Artwork & Collectibles</h3>
                <p class="text-sm text-[var(--color-text-secondary)]">Paintings, sculptures, antiques, and one-of-a-kind items with no replacement value.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="text-3xl mb-3">🏌️</div>
                <h3 class="text-lg font-bold text-[var(--color-text-primary)] mb-1">Sports Equipment</h3>
                <p class="text-sm text-[var(--color-text-secondary)]">Golf clubs, bicycles, skis \u2014 sets that cost hundreds or thousands to replace.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="text-3xl mb-3">📦</div>
                <h3 class="text-lg font-bold text-[var(--color-text-primary)] mb-1">Business Inventory</h3>
                <p class="text-sm text-[var(--color-text-secondary)]">Product shipments, wholesale orders, and customer deliveries \u2014 protect your margins.</p>
              </div>
            </div>
            <p class="text-center text-[var(--color-text-secondary)] text-sm mt-4">
              <strong>Unsure?</strong> Ask us at the counter. We'll help you decide based on the item value, destination, and shipping method. It only takes a minute and the peace of mind is worth it.
            </p>`,
        isFullWidth: true,
      },
      {
        heading: 'The Real Cost of Not Insuring',
        body: `<div class="grid md:grid-cols-2 gap-6 mb-8">
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Carriers Limit Liability</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">UPS/FedEx ground: $100 max. USPS Priority: $100 max (or $50 for some classes). You assume the risk above that amount.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Claims Are a Headache Without It</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">If you didn't declare value at the counter, most carriers deny or limit damage claims. Proper declared value gives you a clear path to reimbursement.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Irreplaceable Items</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Some things simply can't be replaced \u2014 family heirlooms, original artwork, custom builds. Insurance protects against the unthinkable.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">It's Surprisingly Affordable</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Declared value coverage typically costs pennies per $100 of coverage. Compare that to the cost of losing a $500 item uninsured.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
      {
        heading: 'Ship With Peace of Mind \u2014 Every Time',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Imagine handing your valuable package across the counter knowing that if anything goes wrong, you're protected. That's the feeling of shipping with proper coverage.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              At Mailbox Plus, we don't just process packages \u2014 we help you understand the risks and make informed decisions. A two-minute conversation at the counter can save you hundreds or thousands of dollars later.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              <strong>Next time you ship something valuable, ask us about declared value coverage.</strong> We'll walk you through your options with no pressure \u2014 just honest advice so you can ship with confidence.
            </p>`,
      },
    ],
    features: [
      {
        icon: Shield,
        title: 'Carrier Coverage Options',
        description:
          'Declared value for UPS, FedEx, and USPS \u2014 we explain the limits and costs.',
      },
      {
        icon: Package,
        title: 'High-Value Shipments',
        description:
          "Electronics, artwork, sports equipment, and business inventory \u2014 we've got you covered.",
      },
      {
        icon: Clock,
        title: 'Quick & Easy',
        description:
          'Adding coverage takes one minute at the counter. Peace of mind included at no extra hassle.',
      },
    ],
  },
  // ---------------------------
  // HAPPY RETURNS RETURN BAR
  // ---------------------------
  {
    id: 'happy-returns',
    category: 'additional-services',
    city: 'Concord Township',
    serviceName: 'Happy Returns Return Bar',
    slug: '/happy-returns',
    canonicalUrl: 'https://mailboxplus.com/happy-returns',
    pageTitle: 'Happy Returns Return Bar in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'Mailbox Plus is a Happy Returns Return Bar in Concord Township. Bring your QR code — no box, no label, no printer needed. We scan, bag, and receipt you in under 60 seconds. Free, fast, and friendly.',
    keywords:
      'happy returns, return bar, happy returns location, happy returns near me, concord township, lake county, ohio, no box returns, QR code returns, ups returns',
    heroTitle: "Happy Returns Return Bar — We Scan. You're Done.",
    heroSubtitle:
      'Your online return doesn’t need a box, a label, or a printer. Just bring your QR code and your item. We handle everything else.',
    hideCarrierLogos: true,
    content: [
      {
        heading: 'The Returns Runaround — Why One Click to Buy Takes an Afternoon to Send Back',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              You bought something online. It doesn't fit. It's not what you expected. You need to send it back. Simple, right?
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              Except finding a box. And printing a label. And tape. And driving somewhere. And waiting in line. And hoping the person at the counter knows how Happy Returns works.
            </p>
            <div class="grid md:grid-cols-3 gap-6 mt-8">
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4 text-red-500 text-lg font-bold">1</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">THE PROCESS YOU CAN SEE</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Find a box that fits. Print a return label. Tape it up, drive to a drop-off, wait in line, hope it gets scanned. Every step adds friction.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mb-4 text-orange-500 text-lg font-bold">2</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">THE FEELING YOU KNOW</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Returns feel like a chore you keep putting off. That box in the corner stares at you. "I'll deal with it tomorrow." Tomorrow becomes next week.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mb-4 text-amber-600 text-lg font-bold">3</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">THE THING THAT'S WRONG</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Returns shouldn't be harder than buying. You clicked once to order. Why does sending it back take an afternoon and three errands?</p>
              </div>
            </div>
            <p class="text-[var(--color-text-secondary)] text-sm mt-6 text-center">
              Every day that box sits unreturned is a day your refund doesn't process. Happy Returns fixes that. And Mailbox Plus is where you bring it.
            </p>`,
      },
      {
        heading: 'Why Mailbox Plus Is Your Happy Returns Return Bar',
        body: `<div class="grid md:grid-cols-2 gap-8">
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-3 text-lg">We Know the Feeling</h4>
                <p class="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  You open the box, try it on, and know immediately it's going back. But then the chore begins: hunt for a box, find tape, print a label, stand in a line.
                </p>
                <p class="text-sm text-[var(--color-text-secondary)] leading-relaxed mt-4">
                  Happy Returns eliminates all of that. No box. No label. No tape. Just your QR code and your item. And Mailbox Plus is one of the closest Return Bars in Lake County.
                </p>
              </div>
              <div class="space-y-3">
                <div class="flex items-start gap-3 p-3 bg-[var(--color-bg-primary)] rounded-xl border border-[var(--color-border)] shadow-sm">
                  <div class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 text-blue-600"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 7v10"/><path d="M17 7v10"/><path d="M7 12h10"/></svg></div>
                  <div><p class="font-semibold text-[var(--color-text-primary)] text-sm">Authorized Return Bar</p><p class="text-xs text-[var(--color-text-secondary)]">Official Happy Returns location — #1 in Lake County for 44077</p></div>
                </div>
                <div class="flex items-start gap-3 p-3 bg-[var(--color-bg-primary)] rounded-xl border border-[var(--color-border)] shadow-sm">
                  <div class="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0 text-green-600"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg></div>
                  <div><p class="font-semibold text-[var(--color-text-primary)] text-sm">No Box. No Label.</p><p class="text-xs text-[var(--color-text-secondary)]">We provide the bag. Just show your QR code on your phone.</p></div>
                </div>
                <div class="flex items-start gap-3 p-3 bg-[var(--color-bg-primary)] rounded-xl border border-[var(--color-border)] shadow-sm">
                  <div class="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center shrink-0 text-purple-600"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
                  <div><p class="font-semibold text-[var(--color-text-primary)] text-sm">Under 60 Seconds</p><p class="text-xs text-[var(--color-text-secondary)]">We scan, bag, and receipt you. In and out before you know it.</p></div>
                </div>
                <div class="flex items-start gap-3 p-3 bg-[var(--color-bg-primary)] rounded-xl border border-[var(--color-border)] shadow-sm">
                  <div class="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center shrink-0 text-amber-600"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
                  <div><p class="font-semibold text-[var(--color-text-primary)] text-sm">Friendly Local Staff</p><p class="text-xs text-[var(--color-text-secondary)]">Not a chaotic big-box counter. We know you by name.</p></div>
                </div>
              </div>
            </div>`,
      },
      {
        heading: 'How It Works — Three Steps, Faster Than a Coffee Run',
        body: `<div class="grid md:grid-cols-3 gap-6 mb-8">
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm text-center">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">1</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Get Your QR Code</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Start your return on the retailer's website. When they offer Happy Returns, they'll give you a QR code. Save it to your phone.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm text-center">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">2</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Bring Your Item to Us</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Just the item — no box, no label, no packaging. We're at 7554 Fredle Dr in Concord Township, next to Pub Frato.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm text-center">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">3</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">We Handle the Rest</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">We scan your QR code, bag the item, print the label, and hand you a receipt. Your refund is initiated immediately. Done.</p>
              </div>
            </div>
            <div class="relative overflow-hidden rounded-2xl mb-8">
              <img
                src="https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev/happy-returns.webp"
                alt="Customer at Mailbox Plus return counter showing a Happy Returns QR code on their phone — no box, no label needed"
                loading="lazy"
                width="1024"
                height="576"
                class="w-full h-auto object-cover rounded-2xl shadow-sm"
              />
            </div>
            <div class="p-6 bg-gradient-to-br from-[var(--color-primary-dark)]/5 via-[var(--color-primary)]/5 to-[var(--color-primary-deep)]/5 rounded-2xl border border-[var(--color-primary)]/20 shadow-sm">
              <h4 class="font-bold text-[var(--color-text-primary)] mb-4 text-lg">What You Get</h4>
              <div class="grid md:grid-cols-2 gap-3">
                <div class="flex items-start gap-2"><svg class="w-5 h-5 text-green-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg><span class="text-sm text-[var(--color-text-secondary)]">Free — no charge to you</span></div>
                <div class="flex items-start gap-2"><svg class="w-5 h-5 text-green-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg><span class="text-sm text-[var(--color-text-secondary)]">No box, label, tape, or printer needed</span></div>
                <div class="flex items-start gap-2"><svg class="w-5 h-5 text-green-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg><span class="text-sm text-[var(--color-text-secondary)]">Refund initiated immediately at drop-off</span></div>
                <div class="flex items-start gap-2"><svg class="w-5 h-5 text-green-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg><span class="text-sm text-[var(--color-text-secondary)]">Receipt provided — proof of return</span></div>
                <div class="flex items-start gap-2"><svg class="w-5 h-5 text-green-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg><span class="text-sm text-[var(--color-text-secondary)]">Friendly staff — not a crowded big-box counter</span></div>
                <div class="flex items-start gap-2"><svg class="w-5 h-5 text-green-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg><span class="text-sm text-[var(--color-text-secondary)]">Closest Return Bar to most of Concord Township</span></div>
              </div>
            </div>`,
      },
      {
        heading: 'What You’re Avoiding by Coming Here',
        body: `<div class="grid md:grid-cols-2 gap-6 mb-8">
              <div class="p-6 bg-[var(--color-bg-warm-tint)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">The UPS Store Line</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Twenty-minute wait on a good day. You stand there watching packaged boxes get handed over while your bagged return sits in your hand.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-warm-tint)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Untrained Staff</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Some locations have staff who don't know the Happy Returns process. You explain it. They call a manager. Your "60-second return" takes 20 minutes of explaining.</p>
              </div>
            </div>
            <div class="space-y-4 mt-8">
              <div class="flex items-start gap-4 p-4 bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-border)]">
                <div class="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0 text-red-500 font-bold text-sm">1</div>
                <div><p class="font-semibold text-[var(--color-text-primary)] text-sm">The Problem</p><p class="text-xs text-[var(--color-text-secondary)] mt-1">Every return has friction. Box. Label. Tape. Line. By the time you're done, you've spent an afternoon on something that should take five minutes.</p></div>
              </div>
              <div class="flex items-start gap-4 p-4 bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-border)]">
                <div class="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center shrink-0 text-orange-500 font-bold text-sm">2</div>
                <div><p class="font-semibold text-[var(--color-text-primary)] text-sm">The Fix</p><p class="text-xs text-[var(--color-text-secondary)] mt-1">Happy Returns removes the box, label, and tape entirely. One QR code on your phone. That's all you need. The rest is on us.</p></div>
              </div>
              <div class="flex items-start gap-4 p-4 bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-border)]">
                <div class="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center shrink-0 text-amber-600 font-bold text-sm">3</div>
                <div><p class="font-semibold text-[var(--color-text-primary)] text-sm">Mailbox Plus Specifically</p><p class="text-xs text-[var(--color-text-secondary)] mt-1">We're an authorized Return Bar. We know the process inside out. Show your QR code, we scan, bag, and receipt you. Under 60 seconds.</p></div>
              </div>
              <div class="flex items-start gap-4 p-4 bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-border)]">
                <div class="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0 text-green-600 font-bold text-sm">4</div>
                <div><p class="font-semibold text-[var(--color-text-primary)] text-sm">Take Action</p><p class="text-xs text-[var(--color-text-secondary)] mt-1">Bring your QR code to Mailbox Plus. Free. Fast. Friendly. We're the closest Return Bar to most of Concord Township.</p></div>
              </div>
            </div>`,
      },
      {
        heading: 'From \\"Ugh, I Need to Return This\\" to \\"Done.\\"',
        body: `<div class="grid md:grid-cols-2 gap-6 mb-8">
              <div class="p-6 bg-[var(--color-bg-warm-tint)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-red-600 mb-3 text-lg">Before</h4>
                <ul class="space-y-2 text-sm text-[var(--color-text-secondary)]">
                  <li class="flex items-start gap-2"><svg class="w-4 h-4 text-red-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>Finding a box, printing a label, hunting for tape</li>
                  <li class="flex items-start gap-2"><svg class="w-4 h-4 text-red-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>Standing in line at a crowded big-box counter</li>
                  <li class="flex items-start gap-2"><svg class="w-4 h-4 text-red-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>Hoping the return actually went through</li>
                  <li class="flex items-start gap-2"><svg class="w-4 h-4 text-red-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>Explaining the process to untrained staff</li>
                </ul>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-green-200 shadow-sm">
                <h4 class="font-bold text-green-700 mb-3 text-lg">After</h4>
                <ul class="space-y-2 text-sm text-[var(--color-text-secondary)]">
                  <li class="flex items-start gap-2"><svg class="w-4 h-4 text-green-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>Walk in with your item and your QR code</li>
                  <li class="flex items-start gap-2"><svg class="w-4 h-4 text-green-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>60 seconds at the counter — in and out</li>
                  <li class="flex items-start gap-2"><svg class="w-4 h-4 text-green-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>Receipt in hand, refund initiated, done</li>
                  <li class="flex items-start gap-2"><svg class="w-4 h-4 text-green-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>Friendly staff who know exactly how it works</li>
                </ul>
              </div>
            </div>
            <blockquote class="border-l-4 border-[var(--color-accent-warm)] pl-4 italic text-[var(--color-text-secondary)] my-8">
              <p>"You made the right call. Bringing your Happy Returns to Mailbox Plus is the easiest return you'll make all year. Walk in, hand it over, and walk out with your receipt. Your refund is on its way before you leave the parking lot."</p>
            </blockquote>
            <div class="grid md:grid-cols-3 gap-4 mt-8 text-center">
              <div class="p-4 bg-[var(--color-bg-primary)] rounded-xl border border-[var(--color-border)] shadow-sm">
                <div class="text-2xl mb-1">✅</div>
                <p class="text-sm font-semibold text-[var(--color-text-primary)]">Your return is processed</p>
                <p class="text-xs text-green-600 font-medium mt-1">External problem resolved</p>
              </div>
              <div class="p-4 bg-[var(--color-bg-primary)] rounded-xl border border-[var(--color-border)] shadow-sm">
                <div class="text-2xl mb-1">✅</div>
                <p class="text-sm font-semibold text-[var(--color-text-primary)]">No more dreaded chore</p>
                <p class="text-xs text-green-600 font-medium mt-1">Internal problem resolved</p>
              </div>
              <div class="p-4 bg-[var(--color-bg-primary)] rounded-xl border border-[var(--color-border)] shadow-sm">
                <div class="text-2xl mb-1">✅</div>
                <p class="text-sm font-semibold text-[var(--color-text-primary)]">Returns don’t have to be hard</p>
                <p class="text-xs text-green-600 font-medium mt-1">Rights the wrong</p>
              </div>
            </div>`,
      },
    ],
    features: [
      {
        icon: Scan,
        title: 'QR Code Returns',
        description:
          'Show your QR code on your phone. We scan, bag, and receipt you in under 60 seconds.',
      },
      {
        icon: Package,
        title: 'No Box, No Label',
        description: 'Just bring the item. No packaging, no printing, no tape, no hassle.',
      },
      {
        icon: Clock,
        title: '60-Second Drop-Off',
        description: 'In and out with a receipt. Your refund is initiated immediately at drop-off.',
      },
    ],
    featuresTitle: 'Why Return With Us?',
    featuresSubtitle: 'No box, no label, no line. Just show your QR code and we handle the rest.',
    faqs: [
      {
        question: 'What do I need to bring for a Happy Returns drop-off?',
        answer:
          "Just the item you're returning and the QR code from the retailer on your phone. No box, no label, no printed receipt needed. We provide the bag and handle everything else.",
      },
      {
        question: 'Does Happy Returns cost anything?',
        answer:
          "No. Happy Returns is free for shoppers. There's no charge to drop off your return at Mailbox Plus.",
      },
      {
        question: 'How long until I get my refund?',
        answer:
          'Your refund is initiated immediately when we scan your return at drop-off. Depending on your payment method and retailer, it typically posts to your account within 3–5 business days.',
      },
      {
        question: 'Do you accept all Happy Returns items?',
        answer:
          'Yes. We accept most items eligible for Happy Returns — clothing, electronics, home goods, accessories, and more. If you have a valid Happy Returns QR code from the retailer, we can process it.',
      },
      {
        question: 'Do I need to print anything?',
        answer:
          'Nope. Just show the QR code on your phone. We scan it, print the label, and bag your item. No printer needed on your end.',
      },
      {
        question: 'Why should I come to Mailbox Plus instead of The UPS Store or Ulta?',
        answer:
          "We're closer to most of Concord Township (just 4 miles), we know the Happy Returns process inside and out, and you won't wait in a long line. Friendly staff, free parking, and we bag your item in seconds.",
      },
    ],
    cta: {
      title: "Ready for the Easiest Return You'll Make This Year?",
      subtitle:
        'Bring your QR code and your item. No box, no label, no line. We scan, bag, and receipt you in under 60 seconds.',
      buttonText: "Stop By — We're a Return Bar",
      buttonLink: '/pickup-hours',
      variant: 'brand',
      align: 'center',
    },
  },
];
