import Package from '~icons/lucide/package';
import Truck from '~icons/lucide/truck';
import MapPin from '~icons/lucide/map-pin';
import Shield from '~icons/lucide/shield';
import Clock from '~icons/lucide/clock';
import type { Service } from '../../../types/services';
import { getServiceImageUrl } from '../../../lib/storage';
import { generalShippingFaqs, packageDropOffsFaqs, packageReceivingFaqs } from '../../faqs';

export const receivingDropOffServices: Service[] = [
  {
    id: 'package-drop-offs',
    category: 'pack-ship',
    city: 'Concord Township',
    serviceName: 'Package Drop-Offs',
    slug: '/pack-ship/package-drop-offs',
    canonicalUrl: 'https://mailboxplusohio.com/pack-ship/package-drop-offs',
    pageTitle: 'Package Drop-Off in Concord Township | Free | Mailbox Plus',
    metaDescription:
      'Free package drop-off in Concord Township (44077). Drop UPS, FedEx, USPS & DHL returns at one counter. Quick scan, receipt given. Open Mon-Sat. No charge.',
    keywords: 'package drop-offs, fedex, ups, usps, dhl, concord township',
    heroTitle: 'Drop Off Packages for All 4 Carriers \u2014 One Stop, Free',
    heroSubtitle:
      'Already have a label? Drop off UPS, FedEx, USPS, and DHL packages at our counter. Free scanning, receipt included, one location.',
    heroImage: getServiceImageUrl('/images/package-drop-offs.webp'),
    hideCarrierLogos: true,
    content: [
      {
        heading: 'The Multi-Stop Drop-Off \u2014 Why 4 Packages Means 4 Errands',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              You have packages to return. One has a UPS label. Another is FedEx. A third is USPS. To drop them all off, you'd normally drive to three different locations \u2014 burning gas and time on something that should take five minutes.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              <strong>This is the Multi-Stop Drop-Off.</strong> Each carrier has its own drop-off location. Each one is in a different direction. And none of them give you a simple receipt showing your package was accepted.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              You just want your returns dropped off and confirmed. But the system makes you run around to do it.
            </p>`,
      },
      {
        heading: 'All 4 Carriers, One Counter \u2014 Free Drop-Offs',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              At Mailbox Plus, <strong>we accept pre-labeled packages from all 4 major carriers</strong> \u2014 UPS, FedEx, USPS, and DHL. Bring them all in at once. We scan each one and hand you a receipt.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              No charge. No appointment. No running around. Just drop off your packages, get your confirmation, and go.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              Need a label printed? We can do that for <strong>$2.00 per label</strong>. We accept Amazon returns, eBay returns, and all major prepaid return labels.
            </p>`,
      },
      {
        heading: 'Drop-Off in Three Simple Steps',
        body: `<div class="grid md:grid-cols-3 gap-6">
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">1</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Bring Your Packages</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Pre-labeled with any carrier. Mixed carriers? No problem \u2014 we take them all at once.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">2</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">We Scan &amp; Confirm</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Every package gets scanned at our counter. You receive a drop-off receipt for your records.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">3</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Carriers Pick Up Daily</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">We sort and hold for daily carrier pickup. Your packages are in the system.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
      {
        heading: 'Why Drop Off Here?',
        body: `<div class="grid md:grid-cols-2 gap-6 mb-8">
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">One Stop for All Carriers</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">UPS, FedEx, USPS, DHL \u2014 one counter instead of three separate trips. Free with a pre-paid label.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Drop-Off Receipt Included</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">We scan every package and provide a receipt. No guessing whether your return was accepted.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Label Printing Available</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Don't have a printer? Email us your label and we'll print it for $2.00. QR codes accepted for FedEx.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Bundle Your Errands</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Drop off returns, <a href="/pack-ship" class="text-[var(--color-primary)] hover:underline">ship a package</a>, <a href="/home-business/notary-services" class="text-[var(--color-primary)] hover:underline">notarize</a>, <a href="/copy-print/copies" class="text-[var(--color-primary)] hover:underline">make copies</a> \u2014 all in one trip.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
      {
        heading: 'From Multiple Stops to One Counter',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Imagine dropping off all your returns \u2014 Amazon, eBay, wherever \u2014 at one counter. One stop. One receipt. Done.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              That\u2019s the Mailbox Plus advantage. All 4 carriers, free drop-offs, and a receipt you can trust.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              <strong>Stop by with your pre-labeled packages.</strong> We\u2019ll scan them in and get you back on your way.
            </p>`,
      },
    ],
    features: [
      {
        icon: Package,
        title: 'All 4 Carriers',
        description: 'FedEx, UPS, USPS, and DHL \u2014 drop off at one counter.',
      },
      {
        icon: Truck,
        title: 'Free Drop-Offs',
        description: 'No charge for pre-labeled packages. Receipt provided.',
      },
      {
        icon: MapPin,
        title: 'Local Convenience',
        description: 'One location in Concord Township instead of three separate stops.',
      },
    ],
    faqs: [...generalShippingFaqs, ...packageDropOffsFaqs],
    cta: {
      title: 'Got a Pre-Labeled Package?',
      subtitle:
        'Free drop-offs for UPS, FedEx, USPS, DHL. One stop, all 4 carriers. From $35/month for a private mailbox.',
      buttonText: 'Drop It Off \u2192',
      buttonLink: '/contact-us',
      variant: 'brand',
      align: 'center',
    },
  },
  {
    id: 'package-receiving',
    category: 'pack-ship',
    city: 'Concord Township',
    serviceName: 'Package Receiving',
    slug: '/pack-ship/package-receiving',
    canonicalUrl: 'https://mailboxplusohio.com/pack-ship/package-receiving',
    pageTitle: 'Package Receiving in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'Secure package receiving in Concord Township. We sign for and store packages from all carriers. No more porch pirates or missed deliveries.',
    keywords:
      'package receiving, mail handling, Concord Township, Lake County, porch pirate protection',
    heroTitle: 'Never Miss a Package Again',
    heroSubtitle:
      'We sign for and securely store packages from all carriers. No porch pirates. No missed deliveries. From $10/package or $30/month unlimited.',
    heroImage: getServiceImageUrl('/images/package-receiving.webp'),
    hideCarrierLogos: true,
    content: [
      {
        heading: 'The Porch Pirate Problem \u2014 Your Packages Are Sitting Unprotected',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              You order something online. The tracking says "Delivered \u2014 Left at Front Door." You get home hours later and the box is gone. Or it's there, but it's been sitting in the rain all day. Or the delivery driver left it in plain view of the street.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              <strong>This is the Porch Pirate Problem.</strong> Millions of packages are stolen every year. And even when they're not stolen, they can be damaged by weather, hidden from view, or left in a spot you'll never find.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              You paid for your items. You shouldn't have to worry about whether they'll still be there when you get home.
            </p>`,
      },
      {
        heading: 'We Sign. We Store. You Pick Up.',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Mailbox Plus offers <strong>secure package receiving</strong> for all carriers \u2014 UPS, FedEx, USPS, and DHL. When a package arrives with your name, we sign for it, log it in our system, and store it safely in our secure facility.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Two options to fit your needs: <strong>$10 per package</strong> for occasional deliveries, or <strong>$30 per month unlimited</strong> for regular shippers and small businesses. No contract required.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              Pick up during our business hours. Just show your ID, and we'll hand you your package \u2014 dry, safe, and waiting for you.
            </p>`,
      },
      {
        heading: 'Getting Started Is Simple',
        body: `<div class="grid md:grid-cols-3 gap-6">
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">1</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Choose Your Plan</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Per-package ($10) for occasional use, or unlimited ($30/month) for regular shipments.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">2</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Use Our Address</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Have packages sent to our address with your name. We sign for everything from all carriers.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">3</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Pick Up at Your Convenience</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Packages stored securely until you arrive. Show your ID and they're yours.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
      {
        heading: 'What You Gain by Receiving Here',
        body: `<div class="grid md:grid-cols-2 gap-6 mb-8">
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Porch Pirate Protection</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Your packages are stored inside our secure facility \u2014 never left unattended on a porch or doorstep.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">All Carriers Accepted</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">UPS, FedEx, USPS, DHL \u2014 every carrier delivers to us. One address for all your shipments.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Weather Protection</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">No rain, snow, or sun damage. Your packages stay dry and safe until you pick them up.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Flexible Pickup</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Pick up during all business hours. No missed delivery notices. No rescheduling.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
      {
        heading: 'Peace of Mind \u2014 Every Package, Every Time',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Imagine never worrying about package theft again. Every delivery arrives safely, signed for, and waiting for you at your convenience.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Whether you travel frequently, work during delivery hours, or just want the peace of mind that your packages are safe \u2014 Mailbox Plus has you covered.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              <strong>Stop by and set up package receiving.</strong> From $10/package or $30/month unlimited. No contract, no hassle.
            </p>`,
      },
    ],
    features: [
      {
        icon: Package,
        title: 'All Carriers',
        description:
          'FedEx, UPS, USPS, DHL \u2014 we sign for and store packages from all of them.',
      },
      {
        icon: Shield,
        title: 'Secure Storage',
        description:
          'Packages kept in our secure facility \u2014 never left on a porch or doorstep.',
      },
      {
        icon: Clock,
        title: 'Pick Up When You Want',
        description: 'Packages available during all business hours. Show your ID and go.',
      },
    ],
    faqs: [...generalShippingFaqs, ...packageReceivingFaqs],
    cta: {
      title: 'Tired of Porch Pirates?',
      subtitle:
        'We sign. We store. You pick up. From $10/package or $30/month unlimited. From $35/month for a private mailbox.',
      buttonText: 'Set Up Package Receiving \u2192',
      buttonLink: '/contact-us',
      variant: 'brand',
      align: 'center',
    },
  },
];
