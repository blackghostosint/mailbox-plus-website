import type { Service } from '../../../types/services';
import Box from '~icons/lucide/box';
import Scale from '~icons/lucide/scale';
import Truck from '~icons/lucide/truck';

export const competePages: Service[] = [
  {
    id: 'ship-a-return-with-strict-size-or-weight-limits',
    category: 'pack-ship',
    city: 'Concord Township',
    serviceName: 'Ship a Return With Strict Size or Weight Limits | Mailbox Plus',
    slug: '/ship-a-return-with-strict-size-or-weight-limits',
    canonicalUrl: 'https://mailboxplusohio.com/ship-a-return-with-strict-size-or-weight-limits',
    pageTitle: 'Ship a Return With Strict Size or Weight Limits | Mailbox Plus',
    metaDescription:
      'Shipping a return with strict size or weight limits? We pack it right and ship via the best carrier so your return is accepted the first time, every time.',
    keywords:
      'ship return with strict size limits, oversize return shipping, heavy return package, return packaging help, Concord Township shipping, Mailbox Plus',
    heroTitle: 'Shipping a Return With Strict Size or Weight Limits in Concord Township',
    heroSubtitle:
      'Big item, heavy item, or an item that barely fits the box — we pack it right and choose the carrier that will actually accept it. Fast, reliable service at Mailbox Plus, 7554 Fredle Drive.',
    features: [
      {
        title: 'Packed to Carrier Standards',
        description:
          'Correct box size, cushioning, and sealing so your return isn’t rejected at the counter.',
        icon: Box,
      },
      {
        title: 'Right Carrier for the Job',
        description:
          'We compare UPS, FedEx, USPS, and DHL — some have stricter size and weight limits than others.',
        icon: Scale,
      },
      {
        title: 'One Counter, All Carriers',
        description:
          'Bring it to 7554 Fredle Drive and we handle the rest. No running between shipping stores.',
        icon: Truck,
      },
    ],
    content: [
      {
        heading: 'What We Do',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              When a retailer sets strict size or weight limits on a return — think mattresses, furniture, large appliances, or heavy boxes — the package has to meet two sets of rules: the retailer's return policy and the carrier's acceptance rules.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              At Mailbox Plus, we handle the carrier side. We inspect your item, pick the right box, add the right cushioning, seal it properly, and choose the carrier that will accept it. For <a href="/pack-ship/package-drop-offs" class="text-[var(--color-primary)] hover:underline">package drop-offs</a> and returns of any size, we make sure it goes out right the first time.
            </p>`,
      },
      {
        heading: 'Why This Happens',
        body: `<p class="text-lg text-[var(--color-text-primary)] leading-relaxed mb-6">
              Oversized and overweight returns are the ones that get rejected. Carriers enforce maximum size and weight per package — and when a package exceeds those limits, it can be refused at the counter or hit with unexpected surcharges.
            </p>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              The confusion is that every carrier has different limits. A package that's fine for one carrier may be over the limit for another. Most people don't find this out until the return is refused — and by then the retailer's return window may have closed.
            </p>`,
      },
      {
        heading: 'How We Help',
        body: `<ol class="space-y-4 my-6 list-decimal list-inside text-lg text-[var(--color-text-primary)] leading-relaxed">
              <li><strong>Bring it in.</strong> Bring the item, the return label or QR code from the retailer, and any original packaging you still have.</li>
              <li><strong>We size it up.</strong> We measure and weigh the package, then check the limits for each carrier.</li>
              <li><strong>We pack it right.</strong> Right box, right cushioning, right sealing — so it clears carrier acceptance.</li>
              <li><strong>We ship it.</strong> We pick the carrier that fits the size and weight, hand it off, and give you a drop-off receipt.</li>
            </ol>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              If the item is truly too large or heavy for standard carrier shipping, we'll tell you straight — and point you to the options that do exist. We also handle <a href="/pack-ship/professional-packing" class="text-[var(--color-primary)] hover:underline">professional packing</a> for fragile and awkward items, and <a href="/pack-ship/package-receiving" class="text-[var(--color-primary)] hover:underline">package receiving</a> for inbound deliveries.
            </p>`,
      },
      {
        heading: 'What to Bring',
        body: `<ul class="space-y-4 my-6 list-disc list-inside text-lg text-[var(--color-text-primary)] leading-relaxed">
              <li>The item you're returning (assembled or disassembled as much as practical).</li>
              <li>The retailer's return label, QR code, or return authorization.</li>
              <li>Original packaging if you still have it — we'll reuse what we can.</li>
              <li>Any documentation about the retailer's size or weight limits if you received it.</li>
            </ul>
            <p class="text-lg text-[var(--color-text-primary)] leading-relaxed">
              Note: the retailer's return policy is theirs to enforce — we can't change their window or their restocking rules. What we can do is make sure the package is accepted by the carrier so it actually arrives in time.
            </p>`,
      },
    ],
    faqs: [
      {
        question: 'What happens if my return package is over the carrier size limit?',
        answer:
          "Carriers set maximum size and weight per package. For U.S. ground service, the general standard is 108 inches in length and 165 inches in combined length and girth, with a 150 lb weight cap (UPS and FedEx). USPS Ground Advantage caps at 70 lbs and 130 inches combined. If your item exceeds those, standard ground shipping won't accept it — we'll tell you the options, including freight and special handling.",
      },
      {
        question: 'Why do some packages get an "additional handling" surcharge?',
        answer:
          'Carriers add an additional handling surcharge when a package trips a size or weight trigger — typically the longest side over 48 inches, the second-longest side over 30 inches, or actual weight over 50 lbs (UPS and FedEx U.S. services). The package is still shippable; the surcharge is extra. We flag this up front so there are no surprises at the counter.',
      },
      {
        question: 'Can you ship a return that weighs over 100 pounds?',
        answer:
          "Yes, for the carriers that allow it. UPS and FedEx ground accept packages up to 150 lbs, so most heavy returns are shippable. USPS caps at 70 lbs. For anything over 150 lbs, the best option depends on the item and destination — we'll check carrier limits and be honest about what will work.",
      },
      {
        question: 'Will you make sure the retailer accepts my return?',
        answer:
          "We make sure the carrier accepts the package — that's the part we control. The retailer's own return policy (window, condition, restocking fee) is between you and them, and we'll flag anything in their instructions that could cause a rejection.",
      },
      {
        question: 'Where are you located?',
        answer:
          'Mailbox Plus is at 7554 Fredle Drive in Concord Township, OH — serving Concord, Mentor, Willoughby, Painesville, Eastlake, and all of Lake County.',
      },
    ],
    aggregateRating: {
      ratingValue: 5.0,
      reviewCount: 32,
    },
    cta: {
      title: 'Big Return? Bring It In.',
      subtitle: 'We’ll size it, pack it, and ship it — the right way, the first time.',
      buttonText: 'Get Directions',
      buttonLink: '/contact-us',
    },
    hideCarrierLogos: true,
  },
];
