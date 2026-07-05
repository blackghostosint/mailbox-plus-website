import Box from '~icons/lucide/box';
import Shield from '~icons/lucide/shield';
import Package from '~icons/lucide/package';
import Star from '~icons/lucide/star';
import type { Service } from '../../../types/services';
import { getServiceImageUrl } from '../../../lib/storage';
import {
  generalShippingFaqs,
  customBoxMakingFaqs,
  professionalPackingFaqs,
  packagingSuppliesFaqs,
} from '../../faqs';

export const packingServices: Service[] = [
  {
    id: 'professional-packing',
    category: 'pack-ship',
    city: 'Concord Township',
    serviceName: 'Professional Packing',
    slug: '/pack-ship/professional-packing',
    pageTitle: 'Professional Packing in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'Professional packing services in Concord Township. We pack fragile, valuable, and odd-shaped items with carrier-compliant materials. Damage-free delivery guaranteed.',
    keywords:
      'professional packing, secure shipping, concord township, lake county, fragile packing',
    heroTitle: 'We Pack It So Carriers Can\u2019t Break It',
    heroSubtitle:
      'Fragile, valuable, or oddly shaped? Our trained packers use carrier-compliant materials to protect your shipment from sorting machine abuse.',
    heroImage: getServiceImageUrl('/images/professional-packing.webp'),
    hideCarrierLogos: true,
    content: [
      {
        heading: 'The DIY Packing Gamble \u2014 Why Sorting Machines Destroy Poorly Packed Items',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              You packed it yourself. You used a box from the grocery store, some packing tape, and whatever cushioning you had around the house. You dropped it off and hoped for the best.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              <strong>This is the DIY Packing Gamble.</strong> Carrier sorting machines subject packages to drops, vibrations, and compression. A poorly packed item has a high chance of arriving damaged \u2014 and if the carrier determines it was underpacked, your insurance claim gets denied.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              You're not just gambling on the item. You're gambling on replacement costs, customer satisfaction, and your time dealing with claims.
            </p>`,
      },
      {
        heading: 'Trained Packers. Carrier-Compliant Materials. Guaranteed.',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              At Mailbox Plus, <strong>our trained packers use professional-grade materials and proven methods</strong> to ensure your items arrive safely. We know what carrier sorting machines do to packages \u2014 and we pack accordingly.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Double-boxing for fragile items. Foam cushioning for electronics. Reinforced corners for heavy shipments. Custom crating for irregular shapes. <strong>Every packing job is insurance-eligible and carrier-approved.</strong>
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              Bring your item in. We\u2019ll assess it, pack it with the right materials, and ship it with the right carrier \u2014 all from one counter.
            </p>`,
      },
      {
        heading: 'Packing in Three Steps',
        body: `<div class="grid md:grid-cols-3 gap-6">
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">1</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Bring It In</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Fragile heirloom, valuable artwork, or oddly shaped item \u2014 we assess it and recommend the best approach.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">2</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">We Pack It Right</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Carrier-compliant materials, professional techniques, and insurance-ready packing \u2014 done on-site.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">3</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Ship With Confidence</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Packed, labeled, insured, and shipped. You get tracking and peace of mind.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
      {
        heading: 'What Bad Packing Costs You',
        body: `<div class="grid md:grid-cols-2 gap-6 mb-8">
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Damaged Items</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Sorting machines subject packages to drops up to 3 feet. Professional packing absorbs abuse that DIY packing can't.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Denied Claims</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Carriers inspect packaging on damage claims. Improper packing = denied claim. We pack to carrier standards.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Time &amp; Stress</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Packing takes time and materials. Let our experts do it in minutes while you handle more important things.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Custom Help Available</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Need a custom-sized box? We build them in-house. Need <a href="/pack-ship/packaging-supplies" class="text-[var(--color-primary)] hover:underline">packaging supplies</a>? We stock them at our counter.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
      {
        heading: 'From Fragile to Shipped \u2014 Safely',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Imagine handing over a fragile item and knowing it will arrive intact. That\u2019s what professional packing gives you.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Our packers have seen every type of item \u2014 from antique vases to flat-screen TVs to golf clubs. We know exactly how to protect each one.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              <strong>Bring your item to Mailbox Plus.</strong> We\u2019ll pack it right, ship it safe, and you\u2019ll have peace of mind.
            </p>`,
      },
    ],
    features: [
      {
        icon: Shield,
        title: 'Trained Packers',
        description: 'Professional techniques for fragile, valuable, and odd-shaped items.',
      },
      {
        icon: Package,
        title: 'Carrier-Compliant',
        description: 'Insurance-ready packing that meets all carrier standards.',
      },
      {
        icon: Star,
        title: 'Peace of Mind',
        description: 'Your item arrives safely or we help make it right.',
      },
    ],
    faqs: [...generalShippingFaqs, ...professionalPackingFaqs],
    cta: {
      title: 'Got Something Fragile?',
      subtitle:
        "We pack it so sorting machines can't break it. Carrier-compliant materials. From $35/month for a private mailbox.",
      buttonText: 'Bring It In \u2192',
      buttonLink: '/contact-us',
      variant: 'brand',
      align: 'center',
    },
  },
  {
    id: 'custom-box-making',
    category: 'pack-ship',
    city: 'Concord Township',
    serviceName: 'Custom Box Making',
    slug: '/pack-ship/custom-box-making',
    pageTitle: 'Custom Box Making in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'Custom box making service in Concord Township. We build heavy-duty, made-to-measure boxes for items that don\u2019t fit standard packaging. Protect odd-shaped shipments.',
    keywords: 'custom boxes, packaging, concord township, lake county, custom crating',
    heroTitle: 'Custom Boxes for Items That Don\u2019t Fit Standard Sizes',
    heroSubtitle:
      'Odd-shaped, oversized, or uniquely valuable? We build custom boxes and crates that fit your item perfectly.',
    heroImage: getServiceImageUrl('/images/custom-box-making.webp'),
    hideCarrierLogos: true,
    content: [
      {
        heading: 'The Standard Box Problem \u2014 When Your Item Doesn\u2019t Fit',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              You have an item to ship. It\u2019s too big, too oddly shaped, or too fragile for any standard box on the shelf. You try to make it work with extra padding, but it shifts around inside \u2014 and you know that means damage in transit.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              <strong>This is the Standard Box Problem.</strong> Mass-produced boxes are made for average-sized items. If yours doesn\u2019t fit, your shipping options are limited and risky.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              A box that\u2019s too big means your item slides around. A box that\u2019s too small means crushing. Neither ends well.
            </p>`,
      },
      {
        heading: 'Built to Fit \u2014 Custom Boxes, Made While You Wait',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              At Mailbox Plus, we <strong>build custom boxes to your item\u2019s exact dimensions</strong>. Heavy-duty corrugated board, reinforced corners, and precision cuts \u2014 your item fits snugly with no shifting room.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Artwork, antiques, machinery parts, musical instruments, prototypes \u2014 if it doesn\u2019t fit a standard box, we\u2019ll build one that does. We can also add <strong>foam inserts, double-wall construction, and custom crating</strong> for maximum protection.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              Most boxes built while you wait or within 24 hours. No ordering from a catalog. No guessing on dimensions.
            </p>`,
      },
      {
        heading: 'From Measurement to Shipment \u2014 Fast',
        body: `<div class="grid md:grid-cols-3 gap-6">
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">1</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Bring Your Item</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">We measure your item and determine the ideal box dimensions, material thickness, and cushioning needs.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">2</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">We Build Your Box</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Custom-cut, reinforced, and assembled in-house \u2014 with foam, double-walls, or crating as needed.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">3</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Pack &amp; Ship</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Your item goes in, gets packed with protective materials, and ships out \u2014 all from our counter.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
      {
        heading: 'Fits Where Standard Boxes Fail',
        body: `<div class="grid md:grid-cols-2 gap-6 mb-8">
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Odd Shapes Welcome</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Sculptures, musical instruments, machinery, prototypes \u2014 we build boxes for items that don\u2019t fit any standard size.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Heavy-Duty Protection</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Double-wall corrugated, reinforced corners, and custom cushioning for fragile or heavy items.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Insurance Ready</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Custom boxes built to carrier standards means your shipment qualifies for declared value coverage.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Online Design Tool</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Design your own box layout at <a href="https://boxsize.cc/" target="_blank" rel="noopener noreferrer" class="text-[var(--color-primary)] hover:underline">boxsize.cc</a> and bring it in for professional assembly.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
      {
        heading: 'Perfect Fit, Perfect Shipment',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              A custom box means your item doesn\u2019t move during transit. No shifting, no rattling, no crushing. Just a perfect fit.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Whether it\u2019s a one-of-a-kind item or a regular shipment that needs special handling, we build the box that fits.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              <strong>Bring your item to Mailbox Plus.</strong> We\u2019ll measure, build, pack, and ship \u2014 all from one counter.
            </p>`,
      },
    ],
    features: [
      {
        icon: Box,
        title: 'Made to Measure',
        description:
          'Custom boxes built to your item\u2019s exact dimensions. No gaps, no shifting.',
      },
      {
        icon: Shield,
        title: 'Heavy-Duty Materials',
        description: 'Double-wall corrugated, reinforced corners, and foam cushioning options.',
      },
      {
        icon: Package,
        title: 'Fast Turnaround',
        description: 'Most boxes built while you wait or within 24 hours.',
      },
    ],
    faqs: [...generalShippingFaqs, ...customBoxMakingFaqs],
    cta: {
      title: "Item Doesn't Fit a Standard Box?",
      subtitle:
        'We build custom boxes for odd-shaped, oversized, and fragile items. From $35/month for a private mailbox.',
      buttonText: 'Get a Custom Box \u2192',
      buttonLink: '/contact-us',
      variant: 'brand',
      align: 'center',
    },
  },
  {
    id: 'packaging-supplies',
    category: 'pack-ship',
    city: 'Concord Township',
    serviceName: 'Packaging Supplies',
    slug: '/pack-ship/packaging-supplies',
    pageTitle: 'Packaging Supplies in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'Packaging supplies in Concord Township. Boxes, bubble wrap, tape, and packing peanuts available at our counter. Grab what you need right where you ship.',
    keywords: 'shipping supplies, boxes, tape, bubble wrap, concord township',
    heroTitle: 'Boxes, Tape, Bubble Wrap \u2014 Grab What You Need, Right Where You Ship',
    heroSubtitle:
      'Professional packaging supplies at our counter. Standard and heavy-duty boxes, cushioning materials, and tape \u2014 no second stop required.',
    heroImage: getServiceImageUrl('/images/packaging-supplies.webp'),
    hideCarrierLogos: true,
    content: [
      {
        heading: 'The Supply Store Detour \u2014 Why Buying Boxes Means a Separate Trip',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              You need to ship a package. You realize you don\u2019t have a box, tape, or bubble wrap. So you drive to the big-box store, wander the aisles, and pick up supplies. Then you go home, pack it, and drive back to the shipping counter.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              <strong>This is the Supply Store Detour.</strong> One errand turns into three stops. And you paid retail prices for supplies you could have grabbed in 30 seconds.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              You just want to ship something. But the system makes you run around to get the supplies first.
            </p>`,
      },
      {
        heading: 'All the Supplies You Need \u2014 Right at Our Counter',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              At Mailbox Plus, <strong>we stock professional packaging supplies at our counter</strong>. Boxes in multiple sizes, bubble wrap, packing tape, mailing tubes, and packing peanuts \u2014 grab them while you\u2019re here to ship.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Need something specific? We carry <strong>heavy-duty double-wall boxes, foam cushioning, and specialty inserts</strong> for fragile or odd-shaped items. And if a standard box won\u2019t work, we offer <a href="/pack-ship/custom-box-making" class="text-[var(--color-primary)] hover:underline">custom box making</a> for items that don\u2019t fit standard sizes.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              Pick up what you need, pack your item, and ship it \u2014 all at the same counter. One stop, done.
            </p>`,
      },
      {
        heading: 'What We Stock',
        body: `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="text-3xl mb-3">📦</div>
                <h3 class="text-lg font-bold text-[var(--color-text-primary)] mb-1">Shipping Boxes</h3>
                <p class="text-sm text-[var(--color-text-secondary)]">Multiple sizes from small to large \u2014 plus heavy-duty double-wall options.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="text-3xl mb-3">🛡️</div>
                <h3 class="text-lg font-bold text-[var(--color-text-primary)] mb-1">Bubble Wrap &amp; Foam</h3>
                <p class="text-sm text-[var(--color-text-secondary)]">Protective cushioning for fragile items and electronics.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="text-3xl mb-3">📎</div>
                <h3 class="text-lg font-bold text-[var(--color-text-primary)] mb-1">Packing Tape</h3>
                <p class="text-sm text-[var(--color-text-secondary)]">Clear and reinforced tape for secure box sealing.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="text-3xl mb-3">🥜</div>
                <h3 class="text-lg font-bold text-[var(--color-text-primary)] mb-1">Packing Peanuts</h3>
                <p class="text-sm text-[var(--color-text-secondary)]">Loose fill for void-filling in large boxes.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="text-3xl mb-3">📭</div>
                <h3 class="text-lg font-bold text-[var(--color-text-primary)] mb-1">Mailing Tubes</h3>
                <p class="text-sm text-[var(--color-text-secondary)]">For posters, blueprints, rolled documents, and artwork.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="text-3xl mb-3">🔨</div>
                <h3 class="text-lg font-bold text-[var(--color-text-primary)] mb-1">Custom Crating</h3>
                <p class="text-sm text-[var(--color-text-secondary)]">Custom boxes and crates built to your item\u2019s exact dimensions.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
      {
        heading: 'Ship Without the Extra Stop',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Grab your supplies, pack your item, and ship it \u2014 all in one trip. No second store. No backtracking.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Our staff can help you choose the right box and cushioning for your item, and if you need <a href="/pack-ship/professional-packing" class="text-[var(--color-primary)] hover:underline">professional packing</a>, we can handle that too.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              <strong>Next time you need to ship, grab your supplies here.</strong> We\u2019ve got what you need \u2014 right where you need it.
            </p>`,
      },
    ],
    features: [
      {
        icon: Package,
        title: 'Full Supply Selection',
        description: 'Boxes, bubble wrap, tape, tubes, and peanuts \u2014 all at our counter.',
      },
      {
        icon: Shield,
        title: 'Carrier-Grade Quality',
        description: 'Professional materials that meet UPS, FedEx, USPS, and DHL standards.',
      },
      {
        icon: Star,
        title: 'One-Stop Convenience',
        description: 'Grab supplies and ship in the same trip. No extra stops.',
      },
    ],
    faqs: [...generalShippingFaqs, ...packagingSuppliesFaqs],
    cta: {
      title: 'Need Boxes or Tape?',
      subtitle:
        'Boxes, bubble wrap, tape, peanuts \u2014 everything you need, right where you ship. From $35/month for a private mailbox.',
      buttonText: 'Shop Supplies \u2192',
      buttonLink: '/contact-us',
      variant: 'brand',
      align: 'center',
    },
  },
];
