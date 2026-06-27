import Package from '~icons/lucide/package';
import Shield from '~icons/lucide/shield';
import Globe from '~icons/lucide/globe';
import Truck from '~icons/lucide/truck';
import { Service } from '../../../types/services';
import { getServiceImageUrl } from '../../../lib/storage';
import {
  generalShippingFaqs,
  artworkShippingFaqs,
  bicycleShippingFaqs,
  golfClubShippingFaqs,
} from '../../faqs';

export const specialtyShippingServices: Service[] = [
  {
    id: 'artwork-shipping',
    category: 'pack-ship',
    city: 'Concord Township',
    serviceName: 'Artwork Shipping',
    slug: '/pack-ship/artwork-shipping',
    canonicalUrl: 'https://mailboxplusohio.com/pack-ship/artwork-shipping',
    pageTitle: 'Artwork Shipping in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'Professional artwork shipping in Concord Township. Custom crating for paintings, sculptures, and fine art. White-glove handling, insured worldwide delivery.',
    keywords:
      'artwork shipping, fine art shipping, packing paintings, Concord Township, Lake County',
    heroTitle: 'Fine Art Shipping \u2014 White-Glove Handling From Start to Arrival',
    heroSubtitle:
      'Custom crating, archival materials, and insured shipping for paintings, sculptures, and valuable artwork.',
    heroImage: getServiceImageUrl('/images/artwork-shipping.webp'),
    hideCarrierLogos: true,
    content: [
      {
        heading: 'The Package That Deserves More Than Bubble Wrap',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              You have a piece of artwork that needs to get somewhere safely. An oil painting. A sculpture. A framed print. Standard packing materials and a generic box aren't going to cut it \u2014 one wrong bump and it's damaged beyond repair.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              <strong>This is the Artwork Transport Problem.</strong> Art has unique needs: archival materials that won't react with the surface, custom supports that prevent flexing, crating that distributes pressure evenly. Most shipping counters aren't equipped for it.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              You've invested in your art. It deserves more than a box and a prayer.
            </p>`,
      },
      {
        heading: 'White-Glove Art Handling \u2014 Museum-Grade Packing, Local Convenience',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              At Mailbox Plus, we treat artwork differently. <strong>Our white-glove process uses archival-grade materials, custom crating, and carrier-compliant methods</strong> designed specifically for fine art transport.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              <strong>Archival Materials:</strong> Acid-free papers and tissues that won't react with delicate surfaces. <strong>Custom Crating:</strong> Precision-fit crates built to your piece's exact dimensions. <strong>Expert Guidance:</strong> We help you choose the right insurance, the right carrier, and the right level of protection for your artwork's value.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              Paintings, sculptures, photographs, framed pieces, and limited editions \u2014 we handle them all with the same care a gallery would.
            </p>`,
      },
      {
        heading: 'Artwork Shipping in Three Steps',
        body: `<div class="grid md:grid-cols-3 gap-6">
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">1</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Bring Your Artwork</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">We assess the piece, measure dimensions, and determine the ideal packing approach \u2014 crating, bracing, or boxing.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">2</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Custom Packing</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Archival wrapping, custom crate construction, and protective cushioning \u2014 done in-house by trained packers.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">3</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Insured &amp; Shipped</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">We arrange third-party insurance, select the right carrier, and ship with tracking worldwide.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
      {
        heading: 'What Standard Packing Misses',
        body: `<div class="grid md:grid-cols-2 gap-6 mb-8">
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Flex &amp; Vibration Damage</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Art needs rigid support to prevent canvas flexing. Standard boxes don't provide it. Our custom crating does.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Archival Safety</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Acid-free materials prevent chemical reactions with sensitive surfaces. No cheap paper touching your art.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Insurance That Covers Value</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Standard shipping insurance caps are low. We help you get third-party coverage that actually reflects your piece's value.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Customs for International Art</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Shipping art internationally requires specific customs documentation. We help you get it right.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
      {
        heading: 'From Gallery to Destination \u2014 Safely',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Your artwork arrives the way it left \u2014 intact, protected, and professionally handled every step of the way.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Museum-grade packing, custom crating, insured shipping \u2014 right from our Concord Township counter.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              <strong>Bring your artwork to Mailbox Plus.</strong> We'll handle it with the care it deserves.
            </p>`,
      },
    ],
    features: [
      {
        icon: Package,
        title: 'Custom Crating',
        description: 'Precision-fit crates built to your artwork\u2019s exact dimensions.',
      },
      {
        icon: Shield,
        title: 'Archival Materials',
        description: 'Acid-free packing that protects sensitive surfaces during transit.',
      },
      {
        icon: Globe,
        title: 'Insured Worldwide',
        description:
          'Third-party insurance and customs support for domestic and international shipments.',
      },
    ],
    faqs: [...generalShippingFaqs, ...artworkShippingFaqs],
  },
  {
    id: 'bicycle-shipping',
    category: 'pack-ship',
    city: 'Concord Township',
    serviceName: 'Bicycle Shipping',
    slug: '/pack-ship/bicycle-shipping',
    canonicalUrl: 'https://mailboxplusohio.com/pack-ship/bicycle-shipping',
    pageTitle: 'Bicycle Shipping in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'Safe bicycle shipping in Concord Township. We pack and ship road bikes, mountain bikes, and e-bikes. Reinforced boxes with frame protection and axle guards.',
    keywords: 'bicycle shipping, bike box, shipping bicycles, Concord Township, Lake County',
    heroTitle: 'Ship Your Bike \u2014 Without Taking It Apart Yourself',
    heroSubtitle:
      'Professional bike packing and shipping. Reinforced boxes, frame protection, and carrier comparison for the best rate.',
    heroImage: getServiceImageUrl('/images/bicycle-shipping.webp'),
    hideCarrierLogos: true,
    content: [
      {
        heading: 'The Bike Packing Nightmare \u2014 Taking It Apart, Hoping It Arrives Intact',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              You need to ship a bicycle. You look at it and think: handlebars, wheels, pedals, derailleur \u2014 do I need to remove all of this? You try to pack it yourself, but the bike shifts inside the box. The derailleur hanger gets bent. The frame gets scratched.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              <strong>This is the Bike Packing Nightmare.</strong> Bicycles don't fit in standard boxes. They require disassembly, protective bracing, and careful positioning. Get it wrong and you're looking at expensive repairs.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              You want to ship your bike. You don't want to become an expert bike packer to do it.
            </p>`,
      },
      {
        heading: 'We Pack Bikes Every Day \u2014 Road, Mountain, and E-Bikes',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              At Mailbox Plus, <strong>we ship bicycles regularly</strong>. Road bikes, mountain bikes, e-bikes, and kids' bikes \u2014 we know how to pack each one for safe transit.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              <strong>Reinforced double-wall bike boxes:</strong> Sturdy boxes that don't crush. <strong>Foam wrapping and axle protection:</strong> Frame, fork, and derailleur protected from impact. <strong>Multi-carrier rate comparison:</strong> We check FedEx and UPS to find the best rate for your destination.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              Bring your bike in. We'll disassemble what needs to be disassembled, pack it properly, and ship it \u2014 while you wait.
            </p>`,
      },
      {
        heading: 'Bike Shipping in Three Steps',
        body: `<div class="grid md:grid-cols-3 gap-6">
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">1</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Ride or Drop It Off</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Bring your bike in. We assess it and recommend the best packing approach based on bike type and destination.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">2</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">We Pack It Right</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Professional disassembly, foam wrapping, axle guards, and reinforced boxing \u2014 done on-site by trained packers.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">3</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Compare Rates &amp; Ship</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">We check FedEx and UPS rates, recommend the best option, and ship with tracking and insurance available.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
      {
        heading: 'Why Professional Packing Matters for Bikes',
        body: `<div class="grid md:grid-cols-2 gap-6 mb-8">
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Frame Protection</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Foam wrap and strategic bracing prevent the frame from shifting during transit \u2014 the #1 cause of shipping damage.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Derailleur Safety</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">The derailleur is the most vulnerable part. We protect it with specific bracing that prevents bent hangers.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Reinforced Boxing</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Standard boxes crush under bike weight. We use reinforced double-wall boxes designed for the load.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Rate Comparison</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">FedEx or UPS? We check both carriers and recommend the most cost-effective option for your route.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
      {
        heading: 'Ready for the Road \u2014 Or the Destination',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Your bike arrives ready to ride \u2014 not ready for a repair shop. That's the difference professional bike packing makes.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              We pack and ship bikes daily. Let us handle the disassembly and packing so you can focus on the ride ahead.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              <strong>Bring your bike to Mailbox Plus.</strong> We'll pack it, compare rates, and ship it \u2014 all from one counter.
            </p>`,
      },
    ],
    features: [
      {
        icon: Package,
        title: 'Reinforced Bike Boxes',
        description:
          'Double-wall boxes designed to protect frames, forks, and wheels during transit.',
      },
      {
        icon: Shield,
        title: 'Professional Packing',
        description: 'Foam wrap, axle guards, and strategic bracing by trained packers.',
      },
      {
        icon: Truck,
        title: 'Rate Comparison',
        description:
          'FedEx vs. UPS \u2014 we check both and recommend the best value for your route.',
      },
    ],
    faqs: [...generalShippingFaqs, ...bicycleShippingFaqs],
  },
  {
    id: 'golf-club-shipping',
    category: 'pack-ship',
    city: 'Concord Township',
    serviceName: 'Golf Club Shipping',
    slug: '/pack-ship/golf-club-shipping',
    canonicalUrl: 'https://mailboxplusohio.com/pack-ship/golf-club-shipping',
    pageTitle: 'Golf Club Shipping in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'Ship your golf clubs from Concord Township. Secure packing for golf bags and sets. Travel light and insured \u2014 your clubs arrive ready to play.',
    keywords: 'golf club shipping, sports equipment shipping, Concord Township, Lake County',
    heroTitle: 'Ship Your Clubs \u2014 Skip the Airport Baggage Line',
    heroSubtitle:
      'Travel light. We pack and ship your golf clubs to your destination. Insured, tracked, and ready for your first tee time.',
    heroImage: getServiceImageUrl('/images/golf-club-shipping.webp'),
    hideCarrierLogos: true,
    content: [
      {
        heading: 'The Airport Baggage Gamble \u2014 Why Checking Clubs Is a Risk',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              You're heading to a golf trip. You drag your clubs through the airport, check them at the counter, and hope they arrive in one piece. You've heard stories about snapped shafts and dented club heads. And the baggage fees? Another added cost.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              <strong>This is the Airport Baggage Gamble.</strong> Airlines lose, damage, or mishandle thousands of golf bags every year. And when they do, the compensation rarely covers the cost of a good set of clubs.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              You want to arrive at your destination ready to play. Instead, you're hoping your clubs made it.
            </p>`,
      },
      {
        heading: 'Ship Your Clubs Ahead \u2014 Arrive Ready to Play',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              At Mailbox Plus, <strong>we pack and ship golf clubs to your destination</strong>. Driver, irons, putter, bag \u2014 we pack everything in a reinforced box with shaft protection and head covers secured.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              <strong>Shaft Protection:</strong> Each club individually wrapped with foam cushioning. <strong>Head Protection:</strong> Club heads padded and separated to prevent impact damage. <strong>Reinforced Boxing:</strong> Heavy-duty boxes designed to withstand stacking and handling.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              Your clubs arrive at your hotel, Airbnb, or course \u2014 before you do. You walk through security with just a carry-on.
            </p>`,
      },
      {
        heading: 'Golf Club Shipping in Three Steps',
        body: `<div class="grid md:grid-cols-3 gap-6">
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">1</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Bring Your Clubs</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Full set, partial set, or just the bag \u2014 we assess and pack them for safe shipping to your destination.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">2</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Professional Packing</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Each club wrapped, heads cushioned, bag stabilized \u2014 all inside a reinforced box with shaft protection.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] shadow-sm">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg mb-4">3</div>
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2 text-lg">Shipped &amp; Tracked</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Insured, tracked, and delivered to your destination. Ship well ahead or last-minute \u2014 we'll get them there.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
      {
        heading: 'Why Shipping Beats Flying With Clubs',
        body: `<div class="grid md:grid-cols-2 gap-6 mb-8">
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">No Baggage Fees</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Airline checked bag fees for golf clubs can be $35-75 each way. Shipping is often cheaper and more reliable.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">No Lost Clubs</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Airlines mishandle clubs regularly. We ship with tracking and insurance so you know where they are.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Travel Light</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">Walk through the airport with a carry-on. Your clubs arrive at the course or hotel \u2014 no baggage claim required.</p>
              </div>
              <div class="p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <h4 class="font-bold text-[var(--color-text-primary)] mb-2">Professional Packing</h4>
                <p class="text-sm text-[var(--color-text-secondary)]">We use sports-specific packing techniques that airlines don't offer \u2014 each shaft and head individually protected.</p>
              </div>
            </div>`,
        isFullWidth: true,
      },
      {
        heading: 'Arrive Ready to Play \u2014 Clubs Included',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Step off the plane, grab your bags, and head straight to the course. Your clubs are already there, waiting for you.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              We pack, ship, and insure your clubs so you can travel light and play well.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              <strong>Bring your clubs to Mailbox Plus before your next trip.</strong> We'll ship them to your destination \u2014 insured, tracked, and ready to play.
            </p>`,
      },
    ],
    features: [
      {
        icon: Package,
        title: 'Shaft Protection',
        description: 'Each club individually wrapped with foam cushioning and head padding.',
      },
      {
        icon: Shield,
        title: 'Insured Shipping',
        description: 'Coverage available for full sets. Tracking included on every shipment.',
      },
      {
        icon: Globe,
        title: 'Destination Delivery',
        description:
          'Ship to hotels, courses, or anywhere your trip takes you \u2014 domestic and international.',
      },
    ],
    faqs: [...generalShippingFaqs, ...golfClubShippingFaqs],
  },
];
