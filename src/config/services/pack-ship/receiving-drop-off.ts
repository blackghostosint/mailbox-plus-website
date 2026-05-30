import Package from '~icons/lucide/package';
import Truck from '~icons/lucide/truck';
import MapPin from '~icons/lucide/map-pin';
import Shield from '~icons/lucide/shield';
import Clock from '~icons/lucide/clock';
import { Service } from '../../../types/services';
import { getServiceImageUrl } from '../../../lib/storage';
import { generalShippingFaqs, packageDropOffsFaqs, packageReceivingFaqs } from '../../faqs';

export const receivingDropOffServices: Service[] = [
  {
    id: 'package-drop-offs',
    category: 'pack-ship',
    city: 'Concord Township',
    serviceName: 'Package Drop-Offs',
    slug: '/pack-ship/package-drop-offs',
    canonicalUrl: 'https://mailboxplus.com/pack-ship/package-drop-offs',
    pageTitle: 'Package Drop-Offs in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'Free package drop-off location in Concord Township. Accepted carrier drop-offs: UPS, FedEx, USPS, and DHL. Drop off pre-labeled packages for free.',
    keywords: 'package drop-offs, fedex, ups, usps, dhl, concord township',
    heroTitle: 'Package Drop-Offs',
    heroSubtitle: 'Drop off your pre-labeled packages for free with all major carriers.',
    heroImage: getServiceImageUrl('/images/package-drop-offs.webp'),
    content: [
      {
        heading: 'Convenient Drop-Offs',
        body: 'Already have a prepaid label? Drop off your packages here for FedEx, UPS, USPS, and DHL at no extra cost.',
      },
      {
        heading: 'Save Time & Gas',
        body: 'Avoid long drives to carrier hubs and drop your packages at one local location.',
      },
      {
        heading: 'Authorized Local Drop-Off',
        body: 'Mailbox Plus makes it simple to drop off your pre-labeled packages for <strong>FedEx, UPS, DHL, and USPS</strong>. As an authorized local hub serving Concord Township, we provide a secure and convenient way to handle your outgoing shipments for business or personal returns.',
      },
      {
        heading: 'Labels & QR Codes',
        body: 'A return shipping label is required on all packages. If you need yours printed, we can help for just <strong>$2.00 per label</strong>. Please note: <em>we cannot process Amazon QR codes</em>, but FedEx QR codes work successfully about 90% of the time.',
      },
      {
        heading: 'Secure Processing',
        body: "Once dropped off, we scan your package and ensure it's placed in the correct pickup area for daily carrier collection. We accept <strong>Amazon, eBay, and all major prepaid returns</strong> with standard labels.",
      },
    ],
    features: [
      {
        icon: Package,
        title: 'All Carriers Accepted',
        description: 'FedEx, UPS, USPS, and DHL drop-offs welcome.',
      },
      { icon: Truck, title: 'Free Service', description: 'No charge for package drop-offs.' },
      {
        icon: MapPin,
        title: 'Local Convenience',
        description: 'Located right in Concord Township.',
      },
    ],
    faqs: [...generalShippingFaqs, ...packageDropOffsFaqs],
  },
  {
    id: 'package-receiving',
    category: 'pack-ship',
    city: 'Concord Township',
    serviceName: 'Package Receiving',
    slug: '/pack-ship/package-receiving',
    canonicalUrl: 'https://mailboxplus.com/pack-ship/package-receiving',
    pageTitle: 'Package Receiving in Concord Township, Ohio | Mailbox Plus',
    metaDescription:
      'Secure package receiving in Concord Township. Never miss a delivery again. We sign for your packages from all carriers. Safe, secure, and convenient.',
    keywords: 'package receiving, mail handling, Concord Township, Lake County',
    heroTitle: 'Package Receiving',
    heroSubtitle: 'Let us sign for and securely store your packages.',
    heroImage: getServiceImageUrl('/images/package-receiving.webp'),
    content: [
      {
        heading: 'Safe & Secure',
        body: 'We accept packages from all carriers and keep them safe until you pick them up.',
      },
      {
        heading: 'Convenient & Affordable',
        body: 'For occasional deliveries, we offer a straightforward $10.00 per package setup, or choose our UNLIMITED Package Receiving Plan for just $30.00 per month—perfect for individuals and small businesses that receive regular shipments.',
      },
      {
        heading: 'Safe & Professional Handling',
        body: 'Mailbox Plus provides secure <strong>package receiving services</strong> for residents and small businesses in Concord Township. We accept deliveries from <strong>UPS, FedEx, USPS, and DHL</strong> and sign for them on your behalf so you never miss a delivery.',
      },
      {
        heading: 'Affordable Protection',
        body: "Protect your shipments from 'porch pirates' with our secure storage. Choose between our <strong>$10.00 per package</strong> one-time setup or our <strong>UNLIMITED Package Receiving Plan for just $30.00 per month</strong>—perfect for regular shipments.",
      },
      {
        heading: 'Real-Time Notifications',
        body: "Our team provides <strong>real-time delivery notifications</strong> and logs every package in a secure area. Whether you're a traveler or a local business, we offer flexibile solutions to keep your items safe until you're ready for pickup.",
      },
    ],
    features: [
      { icon: Package, title: 'All Carriers', description: 'FedEx, UPS, USPS, and DHL accepted.' },
      { icon: Shield, title: 'Secure Storage', description: 'We keep your packages safe.' },
      {
        icon: Clock,
        title: 'Convenient Pickup',
        description: 'Pick up packages during store hours.',
      },
    ],
    faqs: [...generalShippingFaqs, ...packageReceivingFaqs],
  },
  // Nuuly Returns service removed
];
