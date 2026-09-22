import type { FAQ } from '../../../types/faq';
import { siteConfig } from '../../siteConfig';

export const privateMailboxRentalFaqs: FAQ[] = [
  {
    question: "I'm not a business — can I still get a mailbox?",
    answer:
      "Absolutely. Most of our mailbox holders are everyday residents — people who get a lot of packages, want their mail off the porch, or just like knowing their home address isn't floating around in shipping databases. You don't need a business to rent one.",
  },
  {
    question: 'Do I need ID to rent a mailbox?',
    answer:
      "Yes — two valid forms of ID are required. One primary photo ID (Passport, Driver's License) and one secondary ID showing your current address (Lease, Mortgage, or Insurance Policy). It's a USPS requirement (Form 1583), done in person.",
  },
  {
    question: 'Can I receive packages from all carriers?',
    answer:
      "Yes. FedEx, UPS, USPS, and DHL all deliver to your Mailbox Plus street address — no exceptions, no Street Addressing workarounds. We handle signature deliveries so you don't have to be home.",
  },
  {
    question: "What's the difference between this and a PO Box?",
    answer:
      "A PO Box is a box number at the post office — carriers generally can't deliver packages to a PO Box number alone (unless USPS Street Addressing is available at that location), and you're locked into 3/6/12-month prepaid terms. Your Mailbox Plus address is a real street address with a box number, so all 4 carriers deliver, and you're on month-to-month with no lock-in.",
  },
  {
    question: "What's your address look like on a label?",
    answer: `Your address is our street address plus your box number — e.g., ${siteConfig.contact.address.street} #234, ${siteConfig.contact.address.city}, ${siteConfig.contact.address.state} ${siteConfig.contact.address.zip}. It's a legitimate street address, not a PO Box number.`,
  },
  {
    question: 'Can businesses use this service?',
    answer:
      'Absolutely. We support both individuals and businesses — LLCs, online sellers, remote workers, and home-based businesses use Mailbox Plus every day.',
  },
  {
    question: 'Can I cancel anytime?',
    answer:
      "Yes. We're month-to-month — no annual contract, no cancellation fee, no surprise charges. Just let us know.",
  },
];
