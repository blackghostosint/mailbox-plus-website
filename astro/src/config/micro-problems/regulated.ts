import type { Service } from '../../types/services';

export const regulatedMicroProblems: Service[] = [
  {
    id: 'shipping-alcohol-guide-concord-township',
    category: 'micro-problem',
    city: 'Concord Township',
    serviceName: 'Shipping Alcohol Guide',
    slug: '/guide/shipping-alcohol-concord-township',
    pageTitle: 'Can You Ship Alcohol Through FedEx or UPS? Rules & Reality',
    metaDescription:
      'Wondering if you can ship wine, beer, or spirits through FedEx or UPS? The short answer is no — unless you are a licensed business. Here is what you need to know and what we can help with instead.',
    heroTitle: 'Can You Ship Alcohol Through FedEx or UPS?',
    heroSubtitle:
      'The short answer: unless you are a licensed alcohol business with a signed carrier contract, FedEx and UPS will not accept alcohol shipments from you. Here is what that means and what your options are.',
    content: [
      {
        heading: 'The Honest Truth',
        body: `<p>If you walked into any shipping store hoping to mail a bottle of wine or a six-pack of beer to a friend, here is what will happen: <strong>they will not take it.</strong></p>
<p>Neither FedEx nor UPS accepts alcohol shipments from individual consumers. Period. It does not matter if it is a gift, a homebrew competition entry, or a bottle of rare whiskey you want to share. If you do not hold a valid alcohol license and a signed contract with the carrier, the answer is no.</p>
<p>That is not the shipping store being difficult — <strong>it is federal and state law.</strong></p>`,
      },
      {
        heading: 'What the Carriers Require',
        body: `<p>Both FedEx and UPS have near-identical requirements for alcohol shipments:</p>
<ul>
<li><strong>Licensed shipper only.</strong> You must hold the appropriate state and federal alcohol licenses (as a winery, brewery, distillery, or licensed retailer).</li>
<li><strong>Signed contract.</strong> You must enroll in the carrier's alcohol shipping program and sign their shipping agreement.</li>
<li><strong>Adult signature required.</strong> Every delivery requires a signature from someone 21+ with government-issued ID.</li>
<li><strong>Special labeling.</strong> Packages must carry special alcohol shipping labels (FedEx SEL-170 or UPS alcohol stickers).</li>
<li><strong>Approved packaging.</strong> Bottles must be packed in molded foam, corrugated trays, or fiber trays inside sturdy outer boxes.</li>
</ul>
<p>Even home-based businesses running a small winemaking operation are not exempt — you need the license and the contract.</p>`,
      },
      {
        heading: 'What FedEx and UPS Each Allow',
        body: `<table class="min-w-full border-collapse text-sm">
<thead><tr class="bg-[var(--color-bg-tertiary)]">
<th class="p-3 text-left font-semibold border-b border-[var(--color-border)]">Carrier</th>
<th class="p-3 text-left font-semibold border-b border-[var(--color-border)]">Wine</th>
<th class="p-3 text-left font-semibold border-b border-[var(--color-border)]">Beer</th>
<th class="p-3 text-left font-semibold border-b border-[var(--color-border)]">Spirits</th>
</tr></thead>
<tbody>
<tr><td class="p-3 border-b border-[var(--color-border)]"><strong>FedEx</strong></td>
<td class="p-3 border-b border-[var(--color-border)]">Licensee → Consumer ✓</td>
<td class="p-3 border-b border-[var(--color-border)]">Licensee → Licensee only</td>
<td class="p-3 border-b border-[var(--color-border)]">Licensee → Licensee only</td></tr>
<tr><td class="p-3 border-b border-[var(--color-border)]"><strong>UPS</strong></td>
<td class="p-3 border-b border-[var(--color-border)]">Licensee → Consumer ✓</td>
<td class="p-3 border-b border-[var(--color-border)]">Licensee → Consumer ✓</td>
<td class="p-3 border-b border-[var(--color-border)]">Licensee → Licensee only</td></tr>
</tbody>
</table>
<p><strong>Key difference:</strong> FedEx only ships wine directly to consumers (from licensed wineries). Beer and spirits must be business-to-business. UPS allows beer and wine to consumers from licensed shippers, but spirits remain business-to-business only.</p>`,
        isFullWidth: true,
      },
      {
        heading: 'What About USPS?',
        body: `<p><strong>USPS does not accept alcohol shipments under any circumstances.</strong> Federal law (18 U.S.C. § 1716) prohibits mailing alcoholic beverages. This applies to individuals and businesses alike with very narrow exceptions for licensed manufacturers under specific conditions.</p>`,
      },
      {
        heading: 'Your Options as an Individual',
        body: `<p>If you are not a licensed alcohol shipper, here is what you can do:</p>
<ul>
<li><strong>Ship via a licensed third party.</strong> Services like Drizly, Instacart, or Wine.com handle the licensing and shipping on your behalf within their delivery areas.</li>
<li><strong>Check local laws.</strong> Some wineries and breweries ship directly to consumers in select states through their own carrier contracts.</li>
<li><strong>Bring it in person.</strong> If you are traveling, pack it in checked luggage (check TSA and airline rules first).</li>
<li><strong>Non-alcohol alternatives.</strong> We can still help you ship gifts, documents, fragile items, and anything else that is not regulated — just not alcohol.</li>
</ul>`,
      },
      {
        heading: 'What We Can Help With',
        body: `<p>We cannot ship alcohol for you, but we are your go-to for <strong>everything else</strong>:</p>
<ul>
<li><a href="/pack-ship/fedex-shipping">FedEx shipping</a> for packages, documents, and freight</li>
<li><a href="/pack-ship/ups-authorized-shipper-outlet">UPS shipping</a> — Ground, Next Day Air, International</li>
<li><a href="/pack-ship/usps-services">USPS services</a> — Priority Mail, First-Class, Media Mail</li>
<li><a href="/pack-ship/dhl-express">DHL Express</a> international shipping</li>
<li><a href="/pack-ship/professional-packing">Professional packing</a> for fragile, odd-shaped, and valuable items</li>
<li><a href="/pack-ship/package-receiving">Package receiving</a> — never miss a delivery again</li>
</ul>
<p>Come see us at <strong>7554 Fredle Drive, Concord Township</strong> — no appointment needed.</p>`,
      },
    ],
    faqs: [
      {
        question: 'Can I ship a bottle of wine as a gift?',
        answer:
          'No — not through FedEx, UPS, or USPS as an individual. The shipper must have a license and a carrier contract. Some wineries can ship directly to recipients on your behalf if you order through them.',
      },
      {
        question: 'Can my winery or brewery ship through Mailbox Plus?',
        answer:
          'We cannot process alcohol shipments at our counter. If your business has a carrier contract, you would arrange the pickup or drop-off directly with the carrier. We can help with packaging supplies and getting shipments ready for pickup.',
      },
      {
        question: 'What happens if I try to ship alcohol without a license?',
        answer:
          'The carrier will refuse the package at the counter. If it is discovered in transit, it may be seized, destroyed, or returned. Repeat violations can result in account suspension and legal penalties under state and federal law.',
      },
      {
        question: 'Can I ship non-alcoholic beer or wine?',
        answer:
          'Non-alcoholic beverages (under 0.5% ABV) are not regulated as alcohol and can be shipped through normal carrier services. Just make sure the packaging is secure.',
      },
      {
        question: 'What about shipping alcohol through a freight carrier?',
        answer:
          'Freight carriers (trucking companies) have their own rules for alcohol shipments. This is typically for palletized commercial shipments, not individual packages. You would still need the appropriate licenses.',
      },
    ],
    cta: {
      title:
        'We will tell you the truth — even if it means we cannot help. That is the Mailbox Plus difference.',
      subtitle:
        'Stop in or give us a call. We ship everything except the stuff the law says we cannot touch.',
      buttonText: 'Contact Us',
      buttonLink: '/contact-us',
    },
    robots: 'index, follow',
  },
  {
    id: 'shipping-batteries-guide-concord-township',
    category: 'micro-problem',
    city: 'Concord Township',
    serviceName: 'How to Ship Batteries Safely',
    slug: '/guide/shipping-batteries',
    pageTitle: 'How to Ship Batteries Safely via FedEx, UPS, and USPS',
    metaDescription:
      'Shipping batteries? Lithium, alkaline, rechargeable — each has different rules. Learn how to pack and ship batteries safely through FedEx, UPS, and USPS. We can help at our Concord Township counter.',
    heroTitle: 'How to Ship Batteries Safely',
    heroSubtitle:
      'Batteries are one of the most commonly shipped regulated items — and one of the most misunderstood. Lithium, alkaline, rechargeable, loose, installed — each has different rules. Here is what you need to know.',
    content: [
      {
        heading: 'Why Batteries Are Regulated',
        body: `<p>Batteries contain chemicals and energy storage that can overheat, short-circuit, or catch fire during shipping. The Department of Transportation (DOT) and international air authorities (IATA) classify many batteries as <strong>dangerous goods (hazmat)</strong>, which means special handling, packaging, and labeling rules apply.</p>
<p>Ship them wrong, and the carrier can refuse the package, the shipment can be grounded, or — in rare cases — a fire can start in transit.</p>`,
      },
      {
        heading: 'Battery Types and Their Rules',
        body: `<table class="min-w-full border-collapse text-sm">
<thead><tr class="bg-[var(--color-bg-tertiary)]">
<th class="p-3 text-left font-semibold border-b border-[var(--color-border)]">Battery Type</th>
<th class="p-3 text-left font-semibold border-b border-[var(--color-border)]">Regulated?</th>
<th class="p-3 text-left font-semibold border-b border-[var(--color-border)]">Can Individuals Ship?</th>
</tr></thead>
<tbody>
<tr><td class="p-3 border-b border-[var(--color-border)]">Alkaline (AA, AAA, C, D, 9V)</td>
<td class="p-3 border-b border-[var(--color-border)]">No (non-hazmat)</td>
<td class="p-3 border-b border-[var(--color-border)]">Yes — standard shipping</td></tr>
<tr><td class="p-3 border-b border-[var(--color-border)]">Lithium-ion (rechargeable, installed in device)</td>
<td class="p-3 border-b border-[var(--color-border)]">Yes — Section II</td>
<td class="p-3 border-b border-[var(--color-border)]">Yes — with proper packaging</td></tr>
<tr><td class="p-3 border-b border-[var(--color-border)]">Lithium-ion (loose or spare)</td>
<td class="p-3 border-b border-[var(--color-border)]">Yes — Section IB/II</td>
<td class="p-3 border-b border-[var(--color-border)]">Restricted — carrier-specific rules</td></tr>
<tr><td class="p-3 border-b border-[var(--color-border)]">Lithium metal (non-rechargeable, installed)</td>
<td class="p-3 border-b border-[var(--color-border)]">Yes — Section II</td>
<td class="p-3 border-b border-[var(--color-border)]">Yes — with proper packaging</td></tr>
<tr><td class="p-3 border-b border-[var(--color-border)]">Lithium metal (loose or spare)</td>
<td class="p-3 border-b border-[var(--color-border)]">Yes — Section IB/II</td>
<td class="p-3 border-b border-[var(--color-border)]">Restricted — carrier-specific rules</td></tr>
<tr><td class="p-3 border-b border-[var(--color-border)]">Wet (lead-acid, car batteries)</td>
<td class="p-3 border-b border-[var(--color-border)]">Yes — Hazmat</td>
<td class="p-3 border-b border-[var(--color-border)]">Ground only — special handling</td></tr>
</tbody>
</table>`,
        isFullWidth: true,
      },
      {
        heading: 'How to Pack Batteries for Shipping',
        body: `<ol>
<li><strong>Alkaline (AA, AAA, etc.):</strong> Tape the terminals with electrical tape or use battery packaging. Place in a sturdy box with cushioning. No hazmat surcharge.</li>
<li><strong>Lithium batteries installed in a device:</strong> The device must be switched off and protected against accidental activation. Cushion the device so it cannot shift. Label as "Lithium battery in device" if required.</li>
<li><strong>Loose lithium batteries:</strong> Each battery must be individually wrapped (plastic bag or bubble wrap). Terminals must be taped. Place in a box with non-conductive cushioning. Carriers may require hazmat labels and special handling.</li>
<li><strong>Car batteries (wet/lead-acid):</strong> Must be upright, terminals protected, and shipped via ground only. Requires hazmat declaration and special labeling.</li>
</ol>`,
      },
      {
        heading: 'What Each Carrier Allows',
        body: `<ul>
<li><strong>FedEx:</strong> Accepts lithium batteries (installed in devices) from individuals. Spare/loose lithium batteries may require a FedEx approved shipper account. Wet batteries are ground-only hazmat.</li>
<li><strong>UPS:</strong> Similar rules — installed lithium batteries OK with proper packaging. Loose/high-quantity lithium requires a hazmat agreement. Wet batteries are ground-only with hazmat fee.</li>
<li><strong>USPS:</strong> Accepts lithium batteries only when installed in the equipment they power. Loose or spare lithium batteries are prohibited in USPS mail. Alkaline and standard batteries are fine.</li>
</ul>`,
      },
      {
        heading: 'What We Can Help With',
        body: `<p>We handle battery shipments every day at our counter. Here is what we can do for you:</p>
<ul>
<li>Advise on packaging for your specific battery type</li>
<li>Provide proper battery packaging materials</li>
<li>Process shipments with the correct labeling</li>
<li>Choose the right carrier based on what you are shipping</li>
</ul>
<p><strong>Stop by Mailbox Plus at 7554 Fredle Drive, Concord Township</strong> — we will walk you through it.</p>
<div class="text-xs text-[var(--color-text-muted)] mt-4">
  Reference: <a href="https://www.fedex.com/en-us/shipping/how-to-ship-batteries.html" rel="nofollow" target="_blank" class="underline hover:text-[var(--color-primary)]">
    View FedEx official battery shipping policy →
  </a>
</div>`,
      },
    ],
    faqs: [
      {
        question: 'Can I ship a laptop with the battery inside?',
        answer:
          'Yes. A laptop with its lithium battery installed is fine. Power it off, cushion it in a box, and ship via standard FedEx, UPS, or USPS services.',
      },
      {
        question: 'Can I ship loose AA batteries?',
        answer:
          'Yes — alkaline batteries are not regulated. Tape the terminals, put them in a box with cushioning, and you are good to go.',
      },
      {
        question: 'Can I ship a replacement lithium battery for a phone or tool?',
        answer:
          'A single spare lithium-ion battery (under 100 Wh) is generally acceptable via FedEx and UPS ground services with terminal protection. USPS prohibits loose lithium batteries.',
      },
      {
        question: 'How much does it cost to ship batteries?',
        answer:
          'Alkaline batteries ship at standard rates. Lithium batteries may have a hazmat surcharge (typically $15–30 depending on the carrier and quantity).',
      },
      {
        question: 'Do I need a hazmat certification to ship batteries?',
        answer:
          'For small quantities of lithium batteries (Section II — installed in devices or 1-2 spare cells), no certification is needed. For larger quantities or loose high-capacity cells, professional hazmat training is required.',
      },
    ],
    cta: {
      title:
        'Not sure if your batteries are shippable? Bring them in — we will take a look and give you a straight answer.',
      buttonText: 'Get Directions',
      buttonLink: '/contact-us',
    },
    robots: 'index, follow',
  },
  {
    id: 'shipping-firearms-guide-concord-township',
    category: 'micro-problem',
    city: 'Concord Township',
    serviceName: 'How to Ship Firearms Safely',
    slug: '/guide/shipping-firearms',
    pageTitle: 'How to Ship Firearms via FedEx and UPS — License Requirements & Rules',
    metaDescription:
      'Shipping a firearm? Both FedEx and UPS require a Federal Firearms License (FFL) and a signed carrier contract. Individuals without an FFL cannot ship firearms. Here is what you need to know.',
    heroTitle: 'How to Ship Firearms via FedEx and UPS',
    heroSubtitle:
      'Both FedEx and UPS require a Federal Firearms License (FFL) and a signed contract. If you do not have a license, you cannot ship a firearm through either carrier.',
    content: [
      {
        heading: 'The Short Answer',
        body: `<p><strong>You need a Federal Firearms License (FFL) and a signed carrier agreement.</strong></p>
<p>Neither FedEx nor UPS accepts firearm shipments from unlicensed individuals. This is not a store policy — it is federal law. If you do not hold an FFL and have not signed a Firearms Shipping Compliance Agreement with the carrier, they will not accept your package.</p>`,
      },
      {
        heading: 'FedEx Rules',
        body: `<ul>
<li>Only <strong>FFL holders</strong> who have executed a FedEx Firearms Shipping Compliance Agreement may ship firearms</li>
<li>All ammunition must be removed from the firearm before packing</li>
<li>Firearm must be secured in a hard case inside a sturdy outer box with no identifying markings</li>
<li><strong>Adult Signature Required (ASR)</strong> or <strong>Direct Signature Required (DSR)</strong> must be selected</li>
<li>Pre-packaged and pre-labeled firearms may be dropped at FedEx Office locations — staff cannot pack them or create labels for them</li>
<li>Ammunition may never be shipped from a FedEx Office or retail location</li>
</ul>`,
      },
      {
        heading: 'UPS Rules',
        body: `<ul>
<li>Contract service only — requires an approved <strong>UPS Firearm Products agreement</strong></li>
<li>Shipper must be a licensed importer, manufacturer, dealer, or collector (as defined in Title 18 U.S.C.)</li>
<li>Handguns require <strong>UPS Next Day Air</strong> services (Early, Air, or Air Saver)</li>
<li><strong>No automatic weapons</strong> (including machine guns)</li>
<li><strong>No international shipments</strong> of firearms or firearm parts</li>
<li>Firearms must bear a serial number complying with federal law</li>
<li>No identifying markings on outer box — labeling must be non-descriptive</li>
<li>Packaging must be new, single-wall corrugated meeting UPS strength guidelines</li>
<li>Ammunition must be shipped in a <strong>separate package</strong> from firearms</li>
</ul>`,
      },
      {
        heading: 'What About Ammunition?',
        body: `<p>Ammunition (cartridges, small arms) is regulated as a hazardous material. UPS accepts it as a "Limited Quantity" exception via <strong>UPS Ground only</strong> (within the 48 contiguous states). It <strong>cannot</strong> be dropped at The UPS Store, UPS Access Points, or drop boxes — only at UPS Customer Centers or through scheduled pickup. Ammunition is <strong>not accepted for international shipment.</strong></p>`,
      },
      {
        heading: 'Your Options as an Individual',
        body: `<p>If you do not have an FFL, here is what you can do:</p>
<ul>
<li><strong>Use a licensed firearms dealer.</strong> Many FFL holders can ship firearms on your behalf (transfer fees apply). Your local gun shop can help.</li>
<li><strong>Check state laws.</strong> Some states allow private firearm transfers through licensed dealers only — know your local laws.</li>
<li><strong>Travel with it.</strong> If you are transporting a firearm personally, check TSA rules for air travel or state reciprocity for vehicle transport.</li>
<li><strong>What we can do:</strong> We can help pack and ship <strong>non-firearm items</strong> — boxes, fragile goods, documents, electronics, gifts. Stop by and we will take care of you.</li>
</ul>`,
      },
    ],
    faqs: [
      {
        question: 'Can I ship a firearm as a gift to a family member?',
        answer:
          'No — not through FedEx or UPS as an individual. The shipment must go from one FFL holder to another, or from an FFL holder to a licensed recipient. Some states allow person-to-person transfers through a dealer, but the carrier still requires a contract.',
      },
      {
        question: 'Can I ship a firearm for repair or gunsmith work?',
        answer:
          'Yes — but only if you use an FFL holder on both ends. Many gunsmiths and manufacturers hold FFLs and can provide you with a shipping label. The firearm must go through their account, not yours.',
      },
      {
        question: 'What about antique firearms?',
        answer:
          'Antique firearms (pre-1898 or replicas not designed for modern ammunition) may have different rules. Check with the carrier directly. However, most carriers still require an FFL shipper.',
      },
      {
        question: 'Can I ship firearm parts (barrels, scopes, grips)?',
        answer:
          'UPS distinguishes between "Firearms" and "Firearm Parts." Parts that do not meet the definition of a firearm (like scopes, stocks, grips) may ship under different rules. Receivers and frames are treated as firearms. Check carrier policies before shipping.',
      },
    ],
    cta: {
      title:
        'We cannot ship firearms for you, but we can handle everything else — and we will point you to someone who can help with the rest.',
      buttonText: 'Contact Us',
      buttonLink: '/contact-us',
    },
    robots: 'index, follow',
  },
  {
    id: 'shipping-ammunition-guide-concord-township',
    category: 'micro-problem',
    city: 'Concord Township',
    serviceName: 'How to Ship Ammunition',
    slug: '/guide/shipping-ammunition',
    pageTitle: 'How to Ship Ammunition via UPS — Rules, Packaging & Labeling',
    metaDescription:
      'Shipping ammunition? UPS accepts small arms ammunition as a Limited Quantity hazardous material via Ground only. Must be shipped from a UPS Customer Center — not from a UPS Store or drop box.',
    heroTitle: 'How to Ship Ammunition via UPS',
    heroSubtitle:
      'Ammunition is regulated as a hazardous material. UPS accepts small arms ammunition under a Limited Quantity exception — ground only, from a UPS Customer Center, with proper packaging and labeling.',
    content: [
      {
        heading: 'The Rules',
        body: `<p>UPS accepts "cartridges, small arms" ammunition (as defined in 49 C.F.R. § 173.59) under a <strong>Limited Quantity</strong> exception. This means:</p>
<ul>
<li><strong>UPS Ground only</strong> — within the 48 contiguous states, Intra-Oahu, and Intra-Alaska</li>
<li><strong>No international shipments</strong></li>
<li><strong>Not accepted at UPS Stores, UPS Access Points, or Drop Boxes</strong> — must go through a UPS Customer Center or scheduled pickup</li>
<li>Cannot be packaged with firearms</li>
<li>Cannot be shipped to anyone under 18</li>
<li>Maximum package weight: <strong>66 lbs (30 kg)</strong></li>
<li>Maximum caliber: <strong>12.7 mm (50 caliber / 0.5 inch)</strong> for rifle/pistol, <strong>8 gauge</strong> for shotgun shells</li>
</ul>`,
      },
      {
        heading: 'Packaging Requirements',
        body: `<ul>
<li>Must use <strong>new corrugated packaging</strong> meeting UPS Single Wall Box Strength Guidelines</li>
<li>Ammunition must be packed with <strong>internal boxes, partitions, or metal clips</strong> that fit snugly</li>
<li>Outer packaging must be securely closed and cannot open during transport</li>
<li>Must be marked with the <strong>Limited Quantity</strong> hazmat label — a black-and-white diamond, approximately 4 inches square</li>
</ul>`,
      },
      {
        heading: 'What About Other Carriers?',
        body: `<p><strong>FedEx:</strong> Ammunition is a dangerous good and may never be shipped from a FedEx Office or FedEx retail location. It requires a FedEx dangerous goods account.</p>
<p><strong>USPS:</strong> Ammunition is <strong>prohibited</strong> in USPS mail under any circumstances.</p>
<p><strong>DHL:</strong> Ammunition is generally not accepted for shipment.</p>`,
      },
      {
        heading: 'What This Means for You',
        body: `<p>If you are an individual with a box of ammunition to ship, your options are limited:</p>
<ul>
<li><strong>UPS Ground</strong> from a UPS Customer Center — you pack it per hazmat rules, label it, and drop it at a UPS hub (not a retail store)</li>
<li><strong>No retail store (including us) can accept ammunition</strong> for drop-off or shipping</li>
<li>If you need help with <strong>non-hazmat items</strong> — boxes, fragile goods, documents — we are here for that. Stop by Mailbox Plus at 7554 Fredle Drive, Concord Township.</li>
</ul>
<div class="text-xs text-[var(--color-text-muted)] mt-4">
  Reference: <a href="https://www.ups.com/us/en/support/shipping-support/shipping-special-care-regulated-items/hazardous-materials-guide/how-to-ship-ammunition" rel="nofollow" target="_blank" class="underline hover:text-[var(--color-primary)]">
    View UPS official ammunition shipping policy →
  </a>
</div>`,
      },
    ],
    faqs: [
      {
        question: 'Can I ship ammunition through USPS?',
        answer: 'No. USPS prohibits ammunition in any class of mail.',
      },
      {
        question: 'Can I drop ammunition off at The UPS Store?',
        answer:
          'No. Ammunition may only be tendered at a UPS Customer Center (operational facility) or through a scheduled pickup. UPS Stores, Access Points, and drop boxes cannot accept it.',
      },
      {
        question: 'Do I need a hazmat certification?',
        answer:
          'For Limited Quantity small arms ammunition (under 66 lbs, under 50 caliber), no special certification is needed — but you must follow the packaging and labeling rules exactly. Larger quantities require a hazmat agreement.',
      },
    ],
    cta: {
      title:
        'We cannot accept ammunition at our counter, but we can help with everything else — gifts, fragile items, documents, electronics, and more.',
      buttonText: 'Stop By',
      buttonLink: '/contact-us',
    },
    robots: 'index, follow',
  },
  {
    id: 'shipping-dry-ice-guide-concord-township',
    category: 'micro-problem',
    city: 'Concord Township',
    serviceName: 'How to Ship with Dry Ice',
    slug: '/guide/shipping-dry-ice',
    pageTitle: 'How to Ship with Dry Ice via UPS — Packaging, Labeling & Safety',
    metaDescription:
      'Shipping with dry ice? UPS accepts dry ice as a hazardous material (Class 9) with proper packaging, labeling, and documentation. Learn the rules for shipping frozen goods, medical samples, and more.',
    heroTitle: 'How to Ship with Dry Ice via UPS',
    heroSubtitle:
      'Dry ice (solid carbon dioxide) is a hazardous material for shipping. UPS accepts it with proper packaging, labeling, and documentation. Here is what you need to know.',
    content: [
      {
        heading: 'What Is Dry Ice and Why Is It Regulated?',
        body: `<p>Dry ice is solid carbon dioxide at -109.3°F (-78.5°C). It sublimates (turns directly from solid to gas), which creates pressure inside containers. This makes it a <strong>Class 9 hazardous material</strong> for shipping purposes. If packaged incorrectly, the pressure can cause containers to rupture or explode.</p>`,
      },
      {
        heading: 'UPS Rules for Dry Ice',
        body: `<ul>
<li>Accepted via <strong>UPS Ground and UPS Air</strong> services with proper documentation</li>
<li>Must be packed in an <strong>EPS (expanded polystyrene) foam container</strong> inside a sturdy corrugated cardboard box</li>
<li><strong>Do not seal airtight</strong> — the box must allow gas to vent (go light on the tape)</li>
<li>Must be labeled with the appropriate <strong>Class 9 hazardous material label</strong></li>
<li>For air shipments: must comply with <strong>IATA Packing Instructions 954</strong></li>
<li>International dry ice shipments require a signed <strong>International Special Commodities (ISC) contract</strong> with UPS</li>
<li>Estimated sublimation: <strong>5–10 lbs per 24 hours</strong> (depends on foam density and temperature)</li>
</ul>`,
      },
      {
        heading: 'Packaging Best Practices',
        body: `<ol>
<li>Keep contents separate from the dry ice — use dividers or wrapping</li>
<li>Use an EPS foam container for insulation</li>
<li>Place the foam container inside a corrugated cardboard box</li>
<li>Add enough dry ice for transit time <strong>plus 24 hours</strong> as a safety margin</li>
<li>Do not use glass containers (can crack from cold)</li>
<li>Mark and label per hazmat regulations</li>
</ol>`,
      },
      {
        heading: 'Handling Safety',
        body: `<p>Dry ice can cause <strong>severe frostbite</strong> on contact with skin. Handlers should:</p>
<ul>
<li>Wear <strong>insulated gloves</strong> (never bare hands)</li>
<li>Wear <strong>safety goggles</strong> to protect eyes</li>
<li>Work in a <strong>well-ventilated area</strong> — CO2 gas can displace oxygen in enclosed spaces</li>
<li>Never store dry ice in an airtight container</li>
</ul>`,
      },
      {
        heading: 'What About FedEx and USPS?',
        body: `<p><strong>FedEx:</strong> Accepts dry ice with proper hazmat documentation. Requires a FedEx dangerous goods account for regular shipments. Limited quantities may be accepted from individuals with proper packaging and labeling.</p>
<p><strong>USPS:</strong> Dry ice is <strong>prohibited</strong> in USPS mail except under specific conditions for diagnostic medical specimens with prior approval.</p>`,
      },
    ],
    faqs: [
      {
        question: 'Can I ship frozen food with dry ice through UPS?',
        answer:
          'Yes — UPS accepts dry ice for frozen food shipments when properly packed. Use an EPS foam container, enough dry ice to last the transit time plus extra, and proper labeling. Go light on tape to allow gas to vent.',
      },
      {
        question: 'How much dry ice do I need?',
        answer:
          'Plan for 5–10 lbs of dry ice to sublimate every 24 hours. Add extra for safety. The exact amount depends on the foam density, outside temperature, and transit time.',
      },
      {
        question: 'Can I ship dry ice internationally?',
        answer:
          'UPS accepts international dry ice shipments with an International Special Commodities (ISC) contract. IATA regulations apply for air shipments.',
      },
      {
        question: 'Do I need a hazmat certification to ship dry ice?',
        answer:
          'For small quantities (under 5.5 lbs / 2.5 kg per package for air, or under 440 lbs for ground), no formal certification is needed — but you must follow packaging, labeling, and documentation rules. Larger quantities require training.',
      },
    ],
    cta: {
      title:
        'Shipping with dry ice? We can help with packaging supplies and advice — stop in and ask.',
      buttonText: 'Get Directions',
      buttonLink: '/contact-us',
    },
    robots: 'index, follow',
  },
  {
    id: 'prohibited-restricted-items-guide-concord-township',
    category: 'micro-problem',
    city: 'Concord Township',
    serviceName: 'Prohibited & Restricted Items Overview',
    slug: '/guide/prohibited-restricted-items',
    pageTitle: 'Prohibited & Restricted Items for Shipping — FedEx, UPS, USPS Guide',
    metaDescription:
      'Wondering if you can ship it? Alcohol, firearms, batteries, hazmat, perishables, and more — each carrier has different rules. Quick reference guide for what FedEx, UPS, and USPS accept.',
    heroTitle: 'Prohibited & Restricted Items for Shipping',
    heroSubtitle:
      'Quick reference: what FedEx, UPS, and USPS accept and what they do not. Always verify with the carrier before shipping anything unusual.',
    content: [
      {
        heading: 'How the Carriers Think About This',
        body: `<p>Every carrier splits items into three buckets:</p>
<ul>
<li><strong>Prohibited</strong> — cannot be shipped under any circumstances (marijuana, hazardous waste, human remains)</li>
<li><strong>Restricted / Contractual</strong> — may be shipped only with a signed agreement and proper licensing (alcohol, firearms, hazardous materials)</li>
<li><strong>Acceptable</strong> — standard items with normal packaging (clothes, electronics, books, household goods)</li>
</ul>
<p>What counts as "restricted" varies by carrier. An item that one carrier ships freely may be prohibited by another. The shipper is always responsible for knowing the rules.</p>`,
      },
      {
        heading: 'Quick Reference by Item',
        body: `<table class="min-w-full border-collapse text-sm">
<thead><tr class="bg-[var(--color-bg-tertiary)]">
<th class="p-3 text-left font-semibold border-b border-[var(--color-border)]">Item</th>
<th class="p-3 text-center font-semibold border-b border-[var(--color-border)]">FedEx</th>
<th class="p-3 text-center font-semibold border-b border-[var(--color-border)]">UPS</th>
<th class="p-3 text-center font-semibold border-b border-[var(--color-border)]">USPS</th>
</tr></thead>
<tbody>
<tr><td class="p-3 border-b border-[var(--color-border)]">Alcohol (wine/beer)</td><td class="p-3 text-center border-b border-[var(--color-border)]">Contract</td><td class="p-3 text-center border-b border-[var(--color-border)]">Contract</td><td class="p-3 text-center border-b border-[var(--color-border)]">❌</td></tr>
<tr><td class="p-3 border-b border-[var(--color-border)]">Alcohol (spirits)</td><td class="p-3 text-center border-b border-[var(--color-border)]">Lic → Lic only</td><td class="p-3 text-center border-b border-[var(--color-border)]">Contract</td><td class="p-3 text-center border-b border-[var(--color-border)]">❌</td></tr>
<tr><td class="p-3 border-b border-[var(--color-border)]">Firearms</td><td class="p-3 text-center border-b border-[var(--color-border)]">FFL + contract</td><td class="p-3 text-center border-b border-[var(--color-border)]">FFL + contract</td><td class="p-3 text-center border-b border-[var(--color-border)]">❌</td></tr>
<tr><td class="p-3 border-b border-[var(--color-border)]">Ammunition</td><td class="p-3 text-center border-b border-[var(--color-border)]">DG account</td><td class="p-3 text-center border-b border-[var(--color-border)]">Ground LQ</td><td class="p-3 text-center border-b border-[var(--color-border)]">❌</td></tr>
<tr><td class="p-3 border-b border-[var(--color-border)]">Lithium batteries</td><td class="p-3 text-center border-b border-[var(--color-border)]">Installed ✓</td><td class="p-3 text-center border-b border-[var(--color-border)]">Installed ✓</td><td class="p-3 text-center border-b border-[var(--color-border)]">Installed only</td></tr>
<tr><td class="p-3 border-b border-[var(--color-border)]">Marijuana / CBD</td><td class="p-3 text-center border-b border-[var(--color-border)]">❌</td><td class="p-3 text-center border-b border-[var(--color-border)]">Contract (hemp)</td><td class="p-3 text-center border-b border-[var(--color-border)]">❌</td></tr>
<tr><td class="p-3 border-b border-[var(--color-border)]">Tobacco / vape</td><td class="p-3 text-center border-b border-[var(--color-border)]">Contract</td><td class="p-3 text-center border-b border-[var(--color-border)]">Contract (no vape)</td><td class="p-3 text-center border-b border-[var(--color-border)]">❌</td></tr>
<tr><td class="p-3 border-b border-[var(--color-border)]">Dry ice</td><td class="p-3 text-center border-b border-[var(--color-border)]">Class 9 hazmat</td><td class="p-3 text-center border-b border-[var(--color-border)]">Class 9 hazmat</td><td class="p-3 text-center border-b border-[var(--color-border)]">Limited medical</td></tr>
<tr><td class="p-3 border-b border-[var(--color-border)]">Perishable food</td><td class="p-3 text-center border-b border-[var(--color-border)]">Contractual</td><td class="p-3 text-center border-b border-[var(--color-border)]">Contractual</td><td class="p-3 text-center border-b border-[var(--color-border)]">Some services</td></tr>
<tr><td class="p-3 border-b border-[var(--color-border)]">Live animals</td><td class="p-3 text-center border-b border-[var(--color-border)]">Contract only</td><td class="p-3 text-center border-b border-[var(--color-border)]">Contract only</td><td class="p-3 text-center border-b border-[var(--color-border)]">Some allowed</td></tr>
<tr><td class="p-3 border-b border-[var(--color-border)]">Hazardous waste</td><td class="p-3 text-center border-b border-[var(--color-border)]">❌</td><td class="p-3 text-center border-b border-[var(--color-border)]">❌</td><td class="p-3 text-center border-b border-[var(--color-border)]">❌</td></tr>
</tbody>
</table>
<p class="text-xs text-[var(--color-text-muted)] mt-2">Contract = Requires signed carrier agreement + licensing. LQ = Limited Quantity. FFL = Federal Firearms License. DG = Dangerous Goods.</p>`,
        isFullWidth: true,
      },
      {
        heading: 'What We Can Help With',
        body: `<p>We handle <strong>most everyday shipping</strong> at our counter — FedEx, UPS, USPS, and DHL drop-offs and labels. We can also help with:</p>
<ul>
<li>Professional packing for fragile, odd-shaped, and valuable items</li>
<li>Packaging supplies (boxes, tape, bubble wrap, foam)</li>
<li>Package receiving — we sign for all 4 carriers</li>
<li>Advice on how to handle regulated items the right way</li>
</ul>
<p>Stop by <strong>7554 Fredle Drive, Concord Township</strong> — no appointment needed.</p>`,
      },
    ],
    faqs: [
      {
        question: 'Can I ship perfume or cologne?',
        answer:
          'Perfume and cologne containing alcohol are regulated as hazardous materials. Small quantities (under 1 liter) may be shipped via ground with proper labeling. Check carrier rules before shipping.',
      },
      {
        question: 'Can I ship nail polish or nail polish remover?',
        answer:
          'Nail polish is flammable (hazmat). Small quantities may ship ground as Limited Quantity. Nail polish remover (acetone) is also regulated. Check with the carrier.',
      },
      {
        question: 'Can I ship aerosol cans?',
        answer:
          'Aerosol cans are hazardous materials (flammable gas). Some carriers accept them ground only with proper packaging and labeling. No air shipment.',
      },
    ],
    cta: {
      title:
        'Not sure if your item is shippable? Bring it in or call us — we will give you a straight answer.',
      buttonText: 'Contact Us',
      buttonLink: '/contact-us',
    },
    robots: 'index, follow',
  },
  {
    id: 'common-hazardous-items-guide-concord-township',
    category: 'micro-problem',
    city: 'Concord Township',
    serviceName: 'Common Hazardous Items List',
    slug: '/guide/common-hazardous-items',
    pageTitle: 'Common Household Items That Are Hazardous Materials for Shipping',
    metaDescription:
      'Many everyday items are regulated hazardous materials for shipping — perfume, nail polish, aerosols, batteries, cleaners. Learn what counts as hazmat and how to ship it correctly.',
    heroTitle: 'Common Items That Are Hazardous Materials',
    heroSubtitle:
      'You might be surprised what counts as a hazardous material. Perfume, nail polish, aerosol cans, batteries, cleaning products, and more — all have specific rules for shipping.',
    content: [
      {
        heading: 'Surprise — These Are Hazmat',
        body: `<p>Many everyday items are regulated as hazardous materials (dangerous goods) when shipped. Carriers classify them based on their chemical properties — flammability, corrosiveness, toxicity, or reactivity. Here are common items that frequently surprise people:</p>
<ul>
<li><strong>Perfume & cologne</strong> — contain alcohol (flammable liquid)</li>
<li><strong>Nail polish & nail polish remover</strong> — flammable liquids</li>
<li><strong>Aerosol cans</strong> — hairspray, deodorant, spray paint, cooking spray, whipped cream (flammable gas)</li>
<li><strong>Cleaning products</strong> — bleach, ammonia, drain cleaners, oven cleaners (corrosive/toxic)</li>
<li><strong>Batteries</strong> — lithium, lithium-ion, wet/car batteries (various hazmat classes)</li>
<li><strong>Matches & lighters</strong> — flammable solids</li>
<li><strong>Camping fuel / lighter fluid</strong> — flammable liquids</li>
<li><strong>Paint, varnish, stain</strong> — flammable liquids</li>
<li><strong>Pool chemicals</strong> — chlorine tablets, shock treatments (oxidizers)</li>
<li><strong>Propane tanks</strong> — flammable gas (generally not accepted at retail)</li>
<li><strong>Mercury thermometers</strong> — toxic substance</li>
<li><strong>Fire extinguishers</strong> — compressed gas</li>
<li><strong>Hand sanitizer</strong> — alcohol-based (flammable liquid, limited quantities OK)</li>
</ul>`,
      },
      {
        heading: 'How Hazmat Shipping Works',
        body: `<p>When you ship a hazardous material, the rules depend on <strong>quantity</strong> and <strong>service level</strong>:</p>
<ul>
<li><strong>Limited Quantity (LQ)</strong> — Small amounts of certain hazmat can ship under simplified rules with hazmat labeling but no shipping papers. Usually ground-only, sometimes air.</li>
<li><strong>Fully Regulated</strong> — Larger quantities require a hazardous materials contract, certified training, shipping papers (DOT or IATA declaration), and specific packaging.</li>
</ul>
<p><strong>Important:</strong> Most retail shipping stores (including us and the big chains) cannot accept fully regulated hazmat for drop-off. Limited Quantity hazmat may be accepted by some carriers, but rules vary.</p>`,
      },
      {
        heading: 'What We Can Do',
        body: `<p>We cannot accept hazmat packages at our counter, but we can help in other ways:</p>
<ul>
<li>Provide <strong>packaging supplies</strong> for non-hazmat items</li>
<li>Advise on <strong>which carrier to contact</strong> for your specific hazmat needs</li>
<li>Ship <strong>non-regulated items</strong> — 99% of everyday packages go through without issue</li>
</ul>`,
      },
    ],
    faqs: [
      {
        question: 'Can I ship a bottle of perfume?',
        answer:
          'Maybe — small quantities of perfume (under 1 liter) can ship via ground as Limited Quantity with proper hazmat labeling. Check with the carrier before dropping it off.',
      },
      {
        question: 'Can I ship a can of spray paint?',
        answer:
          'Aerosol cans are generally prohibited in USPS. UPS and FedEx may accept them ground-only as Limited Quantity with proper packaging. No air shipment.',
      },
      {
        question: 'What happens if I ship hazmat without declaring it?',
        answer:
          'Carriers use X-ray and screening technology. Undeclared hazmat can cause delays, fines, and legal liability — especially if it causes a safety incident. Always declare properly.',
      },
    ],
    cta: {
      title:
        'Not sure if your item counts as hazmat? Call us — we can help you figure it out before you bring it in.',
      buttonText: 'Contact Us',
      buttonLink: '/contact-us',
    },
    robots: 'index, follow',
  },
];
