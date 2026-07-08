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
    disclaimer:
      'We are not attorneys and cannot provide legal advice. This information is for educational purposes and reflects carrier policies as we understand them. Laws vary by state and change frequently. Always consult the carrier directly and review applicable federal and state regulations before shipping regulated items.',
    refLink: {
      url: 'https://www.fedex.com/en-us/shipping/alcohol.html',
      label: 'FedEx official alcohol shipping policy',
    },
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
    disclaimer:
      'We are not attorneys and cannot provide legal advice. This information is for educational purposes and reflects carrier policies as we understand them. Laws vary by state and change frequently. Always consult the carrier directly and review applicable federal and state regulations before shipping regulated items.',
    refLink: {
      url: 'https://www.fedex.com/en-us/shipping/how-to-ship-batteries.html',
      label: 'FedEx official battery shipping policy',
    },
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
    disclaimer:
      'We are not attorneys and cannot provide legal advice. This information is for educational purposes and reflects carrier policies as we understand them. Laws vary by state and change frequently. Always consult the carrier directly and review applicable federal and state regulations before shipping regulated items.',
    refLink: {
      url: 'https://www.fedex.com/en-us/shipping/how-to-ship-firearms.html',
      label: 'FedEx official firearms shipping policy',
    },
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
    disclaimer:
      'We are not attorneys and cannot provide legal advice. This information is for educational purposes and reflects carrier policies as we understand them. Laws vary by state and change frequently. Always consult the carrier directly and review applicable federal and state regulations before shipping regulated items.',
    refLink: {
      url: 'https://www.ups.com/us/en/support/shipping-support/shipping-special-care-regulated-items/hazardous-materials-guide/how-to-ship-ammunition',
      label: 'UPS official ammunition shipping policy',
    },
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
    disclaimer:
      'We are not attorneys and cannot provide legal advice. This information is for educational purposes and reflects carrier policies as we understand them. Laws vary by state and change frequently. Always consult the carrier directly and review applicable federal and state regulations before shipping regulated items.',
    refLink: {
      url: 'https://www.ups.com/us/en/support/shipping-support/shipping-special-care-regulated-items/hazardous-materials-guide/how-to-ship-dry-ice',
      label: 'UPS official dry ice shipping policy',
    },
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
    disclaimer:
      'We are not attorneys and cannot provide legal advice. This information is for educational purposes and reflects carrier policies as we understand them. Laws vary by state and change frequently. Always consult the carrier directly and review applicable federal and state regulations before shipping regulated items.',
    refLink: {
      url: 'https://www.ups.com/us/en/support/shipping-support/shipping-special-care-regulated-items/prohibited-items',
      label: 'UPS official prohibited items list',
    },
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
    disclaimer:
      'We are not attorneys and cannot provide legal advice. This information is for educational purposes and reflects carrier policies as we understand them. Laws vary by state and change frequently. Always consult the carrier directly and review applicable federal and state regulations before shipping regulated items.',
    refLink: {
      url: 'https://www.ups.com/us/en/support/shipping-support/shipping-special-care-regulated-items/hazardous-materials-guide/common-hazardous-items',
      label: 'UPS common hazardous items list',
    },
  },
  {
    id: 'shipping-wine-guide-concord-township',
    category: 'micro-problem',
    city: 'Concord Township',
    serviceName: 'How to Ship Wine via FedEx & UPS',
    slug: '/guide/shipping-wine',
    pageTitle: 'How to Ship Wine via FedEx and UPS — Rules, Licensing & State Laws',
    metaDescription:
      'Shipping wine? FedEx ships wine licensee-to-consumer; UPS has winery direct, on-site purchase, and retailer rules. Both require a license and contract. Learn the details here.',
    heroTitle: 'How to Ship Wine via FedEx and UPS',
    heroSubtitle:
      'Wine is the most commonly shipped alcoholic beverage. Both FedEx and UPS accept wine shipments — but only from licensed shippers with a signed contract.',
    content: [
      {
        heading: 'FedEx Rules for Wine',
        body: `<ul>
<li>FedEx only permits <strong>wine</strong> for licensee-to-consumer shipments. Beer and spirits are licensee-to-licensee only.</li>
<li>Shipper must be a FedEx-approved alcohol shipper with a signed <strong>FedEx Alcohol Shipping Agreement</strong></li>
<li>Must use <strong>Adult Signature Required</strong> (ASR) for delivery</li>
<li>Special <strong>SEL-170 alcohol shipping label</strong> required</li>
<li>Proper packaging: molded EPS foam, corrugated tray, or fiber tray inside sturdy outer box</li>
<li>Refer to FedEx <strong>Direct-to-Consumer Wine Shipping State Reference Guide</strong> for which states allow direct shipments</li>
<li>FedEx does not accept wine shipments from <strong>retailers</strong> to consumers — only wineries</li>
</ul>`,
      },
      {
        heading: 'UPS Rules for Wine',
        body: `<p>UPS has a more complex set of wine shipping rules based on state laws and shipper type:</p>
<ul>
<li><strong>All wine shippers must have a signed UPS Agreement for Approved Wine Shippers</strong></li>
<li><strong>Licensee-to-Licensee:</strong> Wine can ship between licensed businesses (winery → distributor → retailer)</li>
<li><strong>Winery On-Site Purchase:</strong> Some states allow shipments only if the consumer bought the wine in person at the winery</li>
<li><strong>Winery Direct Shipment:</strong> Some states allow out-of-state wineries to ship directly to consumers (purchase can be online or by phone)</li>
<li><strong>Retailer Direct:</strong> Some states allow licensed out-of-state retailers to ship wine to consumers</li>
<li><strong>Adult Signature Required</strong> on all wine deliveries</li>
<li>Approved packaging: EPS foam, corrugated tray, molded fiber tray, or thermoformed plastic trays</li>
<li>Alcohol shipping label required (item #01990336, 150 per pack)</li>
</ul>`,
      },
      {
        heading: 'Who Cannot Ship Wine',
        body: `<p><strong>Individuals cannot ship wine through either carrier.</strong> If you are not a licensed winery, brewery, distillery, or retailer with a signed carrier contract, you cannot tender a wine shipment. No exceptions.</p>
<p>Your options:</p>
<ul>
<li>Order wine directly from a winery that has its own shipping account</li>
<li>Use a licensed third-party delivery service if available in your area</li>
<li>Bring the wine with you (check TSA rules for air travel)</li>
</ul>`,
      },
    ],
    faqs: [
      {
        question: 'Can I ship a bottle of wine as a gift to a friend?',
        answer:
          'No — not through FedEx, UPS, or USPS as an individual. The winery must ship it on your behalf if they have the proper license and carrier contract.',
      },
      {
        question: 'What states allow direct wine shipping?',
        answer:
          'It varies. FedEx publishes a Direct-to-Consumer Wine Shipping State Reference Guide. UPS uses Addendum A to their Wine Agreement. Both change frequently. Always check current laws.',
      },
      {
        question: 'Can a wine retailer ship to me?',
        answer:
          'UPS allows retailer-to-consumer wine shipments in certain states (Retailer Direct Shipment States). FedEx only allows winery-to-consumer, not retailer-to-consumer.',
      },
    ],
    cta: {
      title:
        'Need to ship something that is not alcohol? We do that. Stop by Mailbox Plus at 7554 Fredle Drive.',
      buttonText: 'Get Directions',
      buttonLink: '/contact-us',
    },
    robots: 'index, follow',
    disclaimer:
      'We are not attorneys and cannot provide legal advice. This information is for educational purposes and reflects carrier policies as we understand them. Laws vary by state and change frequently. Always consult the carrier directly and review applicable federal and state regulations before shipping regulated items.',
    refLink: {
      url: 'https://www.ups.com/us/en/support/shipping-support/shipping-special-care-regulated-items/prohibited-items/wine',
      label: 'UPS official wine shipping policy',
    },
  },
  {
    id: 'shipping-beer-guide-concord-township',
    category: 'micro-problem',
    city: 'Concord Township',
    serviceName: 'How to Ship Beer via FedEx & UPS',
    slug: '/guide/shipping-beer',
    pageTitle: 'How to Ship Beer via FedEx and UPS — Brewery & Retailer Rules',
    metaDescription:
      'Shipping beer? FedEx requires licensee-to-licensee only. UPS allows licensed breweries to ship direct to consumers in select states. Both require a contract and adult signature.',
    heroTitle: 'How to Ship Beer via FedEx and UPS',
    heroSubtitle:
      'Beer has different rules than wine. FedEx only allows beer shipments between licensed businesses. UPS allows breweries to ship to consumers in approved states.',
    content: [
      {
        heading: 'FedEx Rules for Beer',
        body: `<p>FedEx only permits beer shipments <strong>licensee-to-licensee</strong> — from one licensed business to another licensed business. Beer <strong>cannot</strong> be shipped directly to consumers through FedEx.</p>
<ul>
<li>Shipper must be a FedEx-approved alcohol shipper with a signed agreement</li>
<li>Recipient must be a licensed business entity</li>
<li>Adult Signature Required on delivery</li>
<li>Special alcohol shipping label required</li>
<li>Proper packaging: EPS foam, corrugated dividers, sturdy outer box</li>
</ul>
<p><strong>Note:</strong> FedEx has not traditionally offered a specific beer shipping program in the same way they do for wine. Check with your FedEx account executive.</p>`,
      },
      {
        heading: 'UPS Rules for Beer',
        body: `<p>UPS accepts beer shipments under a <strong>UPS Agreement for Approved Beer Shippers</strong>. The rules vary by shipment type:</p>
<ul>
<li><strong>Licensee-to-Licensee:</strong> Beer can ship between licensed businesses (brewery → distributor → retailer) in compliance with all laws</li>
<li><strong>Direct to Consumer:</strong> Breweries and licensed retailers may ship beer to consumers in states that allow it, subject to approval</li>
<li><strong>Interstate Brewery Shipments:</strong> Certain states allow out-of-state breweries to ship to consumers (listed in Beer Addendum A)</li>
<li><strong>Intrastate Brewery Shipments:</strong> Some states allow in-state brewery shipments to consumers</li>
<li><strong>Adult Signature Required</strong> on all deliveries</li>
<li>Approved packaging with EPS foam or corrugated dividers</li>
<li>Alcohol shipping label required</li>
</ul>`,
      },
      {
        heading: 'Who Cannot Ship Beer',
        body: `<p><strong>Individuals cannot ship beer through either carrier.</strong> Homebrewers, beer enthusiasts, and gift-givers cannot tender beer shipments through FedEx or UPS.</p>
<p>Your options:</p>
<ul>
<li>Check if your local brewery has a direct shipping program</li>
<li>Use a licensed retailer that ships beer</li>
<li>Bring it with you when traveling</li>
</ul>`,
      },
    ],
    faqs: [
      {
        question: 'Can I ship homebrew through FedEx or UPS?',
        answer:
          'No — homebrew is still alcohol and requires a license and carrier contract to ship legally.',
      },
      {
        question: 'Can a brewery ship beer directly to me?',
        answer:
          'In some states, yes. UPS allows Direct to Consumer beer shipments from licensed breweries in approved states. Check with the brewery — they will know if they can ship to your state.',
      },
      {
        question: 'Is shipping beer different from shipping wine?',
        answer:
          'Yes. FedEx treats beer differently — it is licensee-to-licensee only, not to consumers. UPS has separate agreements and Addendum A for beer vs. wine. Always check carrier policies.',
      },
    ],
    cta: {
      title:
        'We cannot ship beer, but we can handle everything else. Come see us in Concord Township.',
      buttonText: 'Contact Us',
      buttonLink: '/contact-us',
    },
    robots: 'index, follow',
    disclaimer:
      'We are not attorneys and cannot provide legal advice. This information is for educational purposes and reflects carrier policies as we understand them. Laws vary by state and change frequently. Always consult the carrier directly and review applicable federal and state regulations before shipping regulated items.',
    refLink: {
      url: 'https://www.ups.com/us/en/support/shipping-support/shipping-special-care-regulated-items/prohibited-items/beer',
      label: 'UPS official beer shipping policy',
    },
  },
  {
    id: 'shipping-spirits-guide-concord-township',
    category: 'micro-problem',
    city: 'Concord Township',
    serviceName: 'How to Ship Spirits via FedEx & UPS',
    slug: '/guide/shipping-spirits',
    pageTitle: 'How to Ship Spirits via FedEx and UPS — The Most Restricted Alcohol Category',
    metaDescription:
      'Shipping spirits (whiskey, vodka, gin)? Both FedEx and UPS treat spirits as the most restricted alcohol category — licensee-to-licensee or distillery direct only. No consumer-to-consumer.',
    heroTitle: 'How to Ship Spirits via FedEx and UPS',
    heroSubtitle:
      'Spirits (whiskey, vodka, gin, rum, etc.) are the most restricted alcohol category. Both carriers limit spirits shipments significantly more than wine or beer.',
    content: [
      {
        heading: 'FedEx Rules for Spirits',
        body: `<p>FedEx only permits spirits shipments <strong>licensee-to-licensee</strong>. Spirits cannot be shipped directly to consumers through FedEx under any circumstances.</p>
<ul>
<li>Shipper must be a FedEx-approved alcohol shipper with a signed agreement</li>
<li>Recipient must be a licensed business entity</li>
<li>Adult Signature Required on delivery</li>
<li>Special alcohol shipping label (SEL-170) required</li>
<li>Proper packaging: EPS foam, fiber tray, sturdy outer box</li>
</ul>`,
      },
      {
        heading: 'UPS Rules for Spirits',
        body: `<p>UPS accepts spirits under a <strong>UPS Agreement for Approved Spirits Shippers</strong>. The rules are more restrictive than wine or beer:</p>
<ul>
<li><strong>Licensee-to-Licensee:</strong> Spirits can ship between licensed businesses only where permitted by law</li>
<li><strong>Direct to Consumer:</strong> Distilleries may ship to consumers in approved states with a contract</li>
<li><strong>Interstate Distillery Shipments:</strong> Certain states allow out-of-state distilleries to ship to consumers (listed in Spirits Addendum A)</li>
<li><strong>Intrastate Distillery Shipments:</strong> Some states allow in-state distillery shipments — some require "On Site Only" purchase</li>
<li><strong>Adult Signature Required</strong> on all deliveries</li>
<li>Approved packaging with EPS foam, corrugated trays, or fiber dividers</li>
<li>Alcohol shipping label required</li>
</ul>
<p><strong>Key difference:</strong> UPS allows spirits direct-to-consumer from distilleries (in approved states). FedEx does not.</p>`,
      },
      {
        heading: 'The Bottom Line',
        body: `<p>Spirits are the most heavily regulated alcohol category for shipping. If you are not a licensed distillery or spirits retailer with a carrier contract, you cannot ship spirits through FedEx or UPS.</p>
<p>Your best bet: buy spirits from a local store or distillery in person. For shipping, check if the distillery has a direct-to-consumer program that ships to your state.</p>`,
      },
    ],
    faqs: [
      {
        question: 'Can I ship a bottle of whiskey as a gift?',
        answer:
          'No — spirits require a licensed shipper with a carrier contract. No individual can ship spirits through FedEx or UPS.',
      },
      {
        question: 'Can a distillery ship spirits to me?',
        answer:
          'Through UPS, yes — in approved states. Through FedEx, no — FedEx does not offer direct-to-consumer spirits shipping. Check with the distillery.',
      },
      {
        question: 'Are spirits harder to ship than wine?',
        answer:
          'Yes. FedEx does not allow spirits to consumers at all. UPS allows it but only from distilleries in approved states. Wine is the easiest alcohol to ship.',
      },
    ],
    cta: {
      title:
        'We ship everything that is legal to ship. Spirits are not one of them — but we can help with anything else.',
      buttonText: 'Stop By',
      buttonLink: '/contact-us',
    },
    robots: 'index, follow',
    disclaimer:
      'We are not attorneys and cannot provide legal advice. This information is for educational purposes and reflects carrier policies as we understand them. Laws vary by state and change frequently. Always consult the carrier directly and review applicable federal and state regulations before shipping regulated items.',
    refLink: {
      url: 'https://www.ups.com/us/en/support/shipping-support/shipping-special-care-regulated-items/prohibited-items/spirits',
      label: 'UPS official spirits shipping policy',
    },
  },
  {
    id: 'shipping-hemp-cbd-guide-concord-township',
    category: 'micro-problem',
    city: 'Concord Township',
    serviceName: 'How to Ship Hemp, CBD & Marijuana Products',
    slug: '/guide/shipping-hemp-cbd',
    pageTitle: 'Can You Ship Hemp, CBD, or Marijuana? Rules for FedEx, UPS & USPS',
    metaDescription:
      'Shipping hemp or CBD products? UPS accepts hemp with a contract and Certificate of Analysis. Marijuana is prohibited by all carriers. FedEx and USPS do not accept hemp or CBD.',
    heroTitle: 'Can You Ship Hemp, CBD, or Marijuana?',
    heroSubtitle:
      'The rules are strict and vary dramatically by product type. Hemp-derived CBD with under 0.3% THC may ship through UPS with a contract. Marijuana is prohibited by all carriers.',
    content: [
      {
        heading: 'The Three Categories',
        body: `<p>There are three distinct categories, and each has completely different rules:</p>
<ul>
<li><strong>Marijuana (THC > 0.3%):</strong> Prohibited by ALL carriers — FedEx, UPS, and USPS — even for medicinal use</li>
<li><strong>Hemp-derived CBD (THC < 0.3%):</strong> UPS accepts with a contract and Certificate of Analysis. FedEx and USPS do not accept.</li>
<li><strong>Synthetic cannabinoids:</strong> Prohibited by all carriers</li>
</ul>`,
      },
      {
        heading: 'UPS Rules for Hemp & CBD',
        body: `<ul>
<li>Requires a signed <strong>UPS agreement</strong> for hemp/hemp-derivative shipments</li>
<li>Must provide <strong>Certificate of Analysis</strong> showing less than 0.3% delta-9 THC on a dry weight basis</li>
<li><strong>Adult Signature Required</strong> on all deliveries</li>
<li>Packaging must not identify contents as containing hemp (non-descriptive labeling)</li>
<li>UPS <strong>prohibits</strong> hemp derivatives intended for consumption through an aerosolized solution (vapes)</li>
<li>UPS <strong>will not accept</strong> shipments from any location that sells marijuana or marijuana products</li>
<li>Synthetic/lab-made cannabinoids are strictly prohibited</li>
</ul>`,
      },
      {
        heading: 'FedEx & USPS Rules',
        body: `<p><strong>FedEx:</strong> FedEx prohibits the shipment of marijuana, hemp, CBD, and all related products. Even with a license, FedEx will not accept these shipments.</p>
<p><strong>USPS:</strong> USPS prohibits marijuana and CBD under federal law. Hemp (with under 0.3% THC) may be mailable under specific conditions per the USPS hemp shipping rules, but the rules are complex and require strict compliance.</p>`,
      },
    ],
    faqs: [
      {
        question: 'Can I ship CBD oil through UPS?',
        answer:
          'Only if you have a signed UPS agreement and a Certificate of Analysis showing under 0.3% THC. Individuals cannot ship CBD through UPS.',
      },
      {
        question: 'Is CBD legal to ship if it is derived from hemp?',
        answer:
          'The 2018 Farm Bill made hemp-derived CBD with under 0.3% THC federally legal, but carriers have their own policies. UPS is currently the only major carrier that accepts hemp/CBD on a contractual basis.',
      },
      {
        question: 'What happens if I ship marijuana through a carrier?',
        answer:
          'Marijuana is prohibited by all carriers. Shipments found in transit may be seized, disposed of, and the shipper may face legal consequences. UPS reserves the right to dispose of any marijuana shipment.',
      },
    ],
    cta: {
      title: 'Questions about shipping? We give straight answers. Stop by or call.',
      buttonText: 'Contact Us',
      buttonLink: '/contact-us',
    },
    robots: 'index, follow',
    disclaimer:
      'We are not attorneys and cannot provide legal advice. This information is for educational purposes and reflects carrier policies as we understand them. Laws vary by state and change frequently. Always consult the carrier directly and review applicable federal and state regulations before shipping regulated items.',
    refLink: {
      url: 'https://www.ups.com/us/en/support/shipping-support/shipping-special-care-regulated-items/prohibited-items/hemp-cbd-marijuana',
      label: 'UPS official hemp/CBD shipping policy',
    },
  },
  {
    id: 'shipping-plants-animals-guide-concord-township',
    category: 'micro-problem',
    city: 'Concord Township',
    serviceName: 'How to Ship Plants & Live Animals',
    slug: '/guide/shipping-plants-animals',
    pageTitle: 'How to Ship Plants and Live Animals via UPS — Rules & Requirements',
    metaDescription:
      'Shipping live animals or plants? UPS accepts certain species (fish, amphibians, beneficial insects, reptiles) on a limited contractual basis. Next-day delivery required.',
    heroTitle: 'How to Ship Plants and Live Animals via UPS',
    heroSubtitle:
      'Live animals and plants are among the most restricted items to ship. UPS accepts certain species on a limited, contractual basis — but the rules are strict.',
    content: [
      {
        heading: 'UPS Rules for Live Animals',
        body: `<p>UPS accepts live animals on a <strong>limited, contractual basis</strong>. The rules are specific:</p>
<ul>
<li><strong>Next-day delivery required</strong> — cannot ship on Fridays or before holidays</li>
<li>Must use a <strong>new corrugated box</strong> (minimum 275 lb burst strength)</li>
<li>Package must be marked "LIVE ANIMALS" in 1-inch bold lettering on opposing sides</li>
<li>Shipped at <strong>shipper's own risk</strong> for perishable nature</li>
<li>International shipments require an <strong>International Special Commodities (ISC) contract</strong></li>
</ul>`,
      },
      {
        heading: 'Accepted Animals',
        body: `<p>UPS accepts the following live animals (unless poisonous, venomous, or endangered):</p>
<ul>
<li><strong>Amphibians:</strong> frogs, salamanders, toads</li>
<li><strong>Cephalopods:</strong> squid, octopus, nautilus</li>
<li><strong>Crustaceans:</strong> crabs, crawfish, lobsters, shrimp</li>
<li><strong>Fish:</strong> all species</li>
<li><strong>Insects:</strong> beneficial insects only (bees, butterflies, crickets, lady bugs)</li>
<li><strong>Mollusks:</strong> clams, mussels, snails</li>
<li><strong>Reptiles:</strong> lizards, non-venomous snakes (contract), freshwater turtles, land tortoises, sea turtles</li>
<li><strong>Non-venomous spiders</strong> (contract only)</li>
<li><strong>Worms:</strong> all species</li>
</ul>
<p><strong>Prohibited:</strong> birds, mammals, venomous creatures, endangered species, crocodiles/alligators, obnoxious insects (flies, roaches, termites)</p>`,
      },
      {
        heading: 'What About Other Carriers?',
        body: `<p><strong>FedEx:</strong> Does not accept live animals for shipment through standard services. Contact FedEx Custom Critical for specialized animal transport.</p>
<p><strong>USPS:</strong> USPS accepts some live animals (day-old poultry, honeybees, certain insects) under specific conditions. Most mammals, reptiles, and fish are prohibited.</p>
<p><strong>Plants:</strong> UPS accepts plants with a shipping account. The rules depend on the plant type, origin, and destination. Some states have agricultural restrictions.</p>`,
      },
    ],
    faqs: [
      {
        question: 'Can I ship a pet through UPS?',
        answer:
          'No — UPS prohibits mammals of any kind. Pets must travel through specialized pet transport services or airlines that offer pet cargo.',
      },
      {
        question: 'Can I ship live fish?',
        answer:
          'Yes — fish are accepted by UPS. They must be double-bagged in 4-mil plastic bags (1/3 water, 2/3 oxygen) inside a sturdy box. Next-day delivery only.',
      },
      {
        question: 'Can I ship live bees?',
        answer:
          'Yes — bees are accepted by UPS as beneficial insects. Shipments must use a corrugated sleeve around the traditional wooden crate. Liquid food supplies are prohibited (use hard candy only).',
      },
    ],
    cta: {
      title:
        'Shipping plants or animals? These are highly specialized — we can point you in the right direction.',
      buttonText: 'Contact Us',
      buttonLink: '/contact-us',
    },
    robots: 'index, follow',
    disclaimer:
      'We are not attorneys and cannot provide legal advice. This information is for educational purposes and reflects carrier policies as we understand them. Laws vary by state and change frequently. Always consult the carrier directly and review applicable federal and state regulations before shipping regulated items.',
    refLink: {
      url: 'https://www.ups.com/us/en/support/shipping-support/shipping-special-care-regulated-items/prohibited-items/plants-and-animals',
      label: 'UPS official plants/animals shipping policy',
    },
  },
  {
    id: 'shipping-tobacco-guide-concord-township',
    category: 'micro-problem',
    city: 'Concord Township',
    serviceName: 'How to Ship Tobacco & Vape Products',
    slug: '/guide/shipping-tobacco',
    pageTitle: 'Can You Ship Tobacco or Vape Products? FedEx, UPS, and USPS Rules',
    metaDescription:
      'Shipping tobacco? FedEx prohibits all tobacco. UPS accepts tobacco with a contract — but prohibits all vape products. USPS prohibits cigarettes. Learn the rules here.',
    heroTitle: 'Can You Ship Tobacco or Vape Products?',
    heroSubtitle:
      'Tobacco rules are strict and vary dramatically by carrier. FedEx prohibits all tobacco. UPS accepts it with a contract but bans vapes entirely. USPS prohibits cigarettes.',
    content: [
      {
        heading: 'FedEx — Tobacco Completely Prohibited',
        body: `<p><strong>FedEx prohibits the shipping of tobacco and tobacco products entirely.</strong> This includes:</p>
<ul>
<li>Cigarettes and cigars</li>
<li>Loose tobacco (pipe, chewing, rolling)</li>
<li>Smokeless tobacco</li>
<li>Hookah or shisha</li>
<li>Vaporizers and e-cigarettes</li>
</ul>
<p>Even if you have proper licenses, FedEx will not accept tobacco shipments at any FedEx or FedEx Office location.</p>`,
      },
      {
        heading: 'UPS — Contract Only (No Vapes)',
        body: `<ul>
<li>UPS accepts tobacco products <strong>only under a signed UPS agreement</strong></li>
<li><strong>Cigarettes and little cigars cannot be shipped to consumers</strong> — licensee-to-licensee only</li>
<li><strong>All vaping products are prohibited</strong> — e-cigarettes, vape pens, e-liquids, regardless of nicotine content</li>
<li>Must use <strong>Adult Signature Required</strong> on all tobacco shipments</li>
<li>Federal labeling, record-keeping, and tax-collecting obligations apply (18 U.S.C. § 376a)</li>
<li>Quantity limits apply per federal law</li>
<li>Most states require tax stamps on tobacco products</li>
<li>Shippers must make an annual certification of compliance to UPS (Addendum A)</li>
<li>UPS does not serve any entity on the ATF PACT Act Non-Compliant List</li>
</ul>`,
      },
      {
        heading: 'USPS Rules',
        body: `<p><strong>USPS:</strong> Federal law (the PACT Act) prohibits USPS from delivering cigarettes and smokeless tobacco. Some cigar shipments may be allowed under specific conditions. Check current USPS regulations.</p>
<p><strong>The bottom line:</strong> If you are an individual trying to ship tobacco products, your options are extremely limited. Licensed businesses with carrier contracts may ship through UPS, but the compliance requirements are substantial.</p>`,
      },
    ],
    faqs: [
      {
        question: 'Can I ship cigars through USPS?',
        answer:
          'The PACT Act restricts tobacco shipments through USPS. Cigar shipments may be allowed in limited circumstances — check current USPS regulations and federal law.',
      },
      {
        question: 'Can I ship vape juice or e-liquids?',
        answer:
          'No — UPS prohibits all vaping products. FedEx also prohibits them. USPS restrictions apply. Vape products are effectively unshippable through major carriers.',
      },
      {
        question: 'Can a licensed tobacco shop ship to customers?',
        answer:
          'Through UPS, yes — with a signed UPS agreement and compliance with all federal and state laws. Cigarettes and little cigars cannot go to consumers. Cigars may have different rules.',
      },
    ],
    cta: {
      title:
        'Tobacco shipping is complex. For everything else, we make it simple — stop by Mailbox Plus.',
      buttonText: 'Get Directions',
      buttonLink: '/contact-us',
    },
    robots: 'index, follow',
    disclaimer:
      'We are not attorneys and cannot provide legal advice. This information is for educational purposes and reflects carrier policies as we understand them. Laws vary by state and change frequently. Always consult the carrier directly and review applicable federal and state regulations before shipping regulated items.',
    refLink: {
      url: 'https://www.ups.com/us/en/support/shipping-support/shipping-special-care-regulated-items/prohibited-items/tobacco',
      label: 'UPS official tobacco shipping policy',
    },
  },
];
