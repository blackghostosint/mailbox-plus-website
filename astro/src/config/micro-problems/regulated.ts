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
];
