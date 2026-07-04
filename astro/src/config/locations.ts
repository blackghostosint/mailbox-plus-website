/**
 * Lake County Location Configuration
 *
 * This file implements the LOCATIONS playbook from programmatic SEO.
 * Each location has unique local content to avoid "doorway page" penalties.
 *
 * Following programmatic-seo skill principles:
 * - Unique value per page (local directions, landmarks)
 * - Proprietary data (our store's proximity to each location)
 * - Clean URL structure (subfolder paths)
 * - Genuine search intent match ("[service] in [city]")
 */

export interface LocationData {
  name: string;
  slug: string;
  county: string;
  population?: number;

  // CRITICAL: Unique local content to avoid thin content penalties
  uniqueContent: {
    directions: string; // How to get to Mailbox Plus from this city
    landmarks: string[]; // Notable landmarks in/near this city
    localExample?: string; // A local business/resident example (real or illustrative)
    driveTime: string; // Approximate drive time to our store
    nearbyHighways?: string[]; // Major roads connecting this city to us
  };

  // SEO modifiers for this location
  seo: {
    demonymSingular: string; // "Mentor resident", "Painesville business"
    demonymPlural: string; // "Mentor residents", "Painesville businesses"
    areaDescriptor: string; // "western Lake County", "near the lake"
  };
}

/**
 * Primary service areas - these get full location pages
 */
export const primaryLocations: LocationData[] = [
  {
    name: 'Concord Township',
    slug: 'concord-township',
    county: 'Lake',
    population: 18000,
    uniqueContent: {
      directions:
        "We're located at 7554 Fredle Drive in the Capital Plaza, right next to Pet Supplies Plus.",
      landmarks: ['Great Lakes Mall', 'Target Plaza', 'Quail Hollow', 'Auburn Career Center'],
      localExample: 'We help Quail Hollow families ship packages to college students every fall.',
      driveTime: "You're already here!",
      nearbyHighways: ['Route 44', 'Auburn Road', 'Route 6'],
    },
    seo: {
      demonymSingular: 'Concord Township resident',
      demonymPlural: 'Concord Township residents',
      areaDescriptor: 'eastern Lake County',
    },
  },
  {
    name: 'Mentor',
    slug: 'mentor',
    county: 'Lake',
    population: 47000,
    uniqueContent: {
      directions:
        "From Mentor, take Route 44 south about 3 miles. We're in Capital Plaza on the left, past Johnnycake Ridge.",
      landmarks: [
        'Mentor Headlands Beach',
        'Great Lakes Mall',
        'Mentor Civic Center',
        'Steele Mansion',
      ],
      localExample: 'Mentor small businesses use us daily for UPS and FedEx pickups.',
      driveTime: 'About 5-8 minutes from downtown Mentor',
      nearbyHighways: ['Route 44', 'Route 2', 'Route 615'],
    },
    seo: {
      demonymSingular: 'Mentor resident',
      demonymPlural: 'Mentor residents',
      areaDescriptor: 'central Lake County',
    },
  },
  {
    name: 'Painesville',
    slug: 'painesville',
    county: 'Lake',
    population: 20000,
    uniqueContent: {
      directions:
        "From downtown Painesville, take Route 44 south about 6 miles. We're located at 7554 Fredle Drive in the Capital Plaza (on Auburn Road).",
      landmarks: [
        'Lake County Courthouse',
        'Painesville Square',
        'Lake Erie College',
        'Riverside High School',
      ],
      localExample: 'Lake Erie College students trust us for care package shipping.',
      driveTime: 'About 10-12 minutes from Painesville Square',
      nearbyHighways: ['Route 44', 'Route 2', 'Route 20', 'I-90'],
    },
    seo: {
      demonymSingular: 'Painesville resident',
      demonymPlural: 'Painesville residents',
      areaDescriptor: 'north-central Lake County',
    },
  },
  {
    name: 'Willoughby',
    slug: 'willoughby',
    county: 'Lake',
    population: 24000,
    uniqueContent: {
      directions:
        "From downtown Willoughby, take Route 306 north to Route 6, then east to Route 44 south. We're about 8 minutes from there.",
      landmarks: [
        'Downtown Willoughby',
        'Lost Nation Airport',
        'Willoughby Town Center',
        'Lakeland Community College',
      ],
      localExample: 'Downtown Willoughby boutique owners use us for e-commerce fulfillment.',
      driveTime: 'About 12-15 minutes from downtown',
      nearbyHighways: ['Route 306', 'Route 6', 'Route 2'],
    },
    seo: {
      demonymSingular: 'Willoughby resident',
      demonymPlural: 'Willoughby residents',
      areaDescriptor: 'southwest Lake County',
    },
  },
  {
    name: 'Chardon',
    slug: 'chardon',
    county: 'Geauga',
    population: 5200,
    uniqueContent: {
      directions:
        "From Chardon Square, take Route 44 north about 8 miles. We're located at 7554 Fredle Drive in the Capital Plaza (on Auburn Road) in Concord Township.",
      landmarks: [
        'Chardon Square',
        'Geauga County Courthouse',
        'Maple Highlands Trail',
        'Chardon High School',
      ],
      localExample: 'Chardon businesses ship maple products nationwide through us every spring.',
      driveTime: 'About 15 minutes from Chardon Square',
      nearbyHighways: ['Route 44', 'Route 6'],
    },
    seo: {
      demonymSingular: 'Chardon resident',
      demonymPlural: 'Chardon residents',
      areaDescriptor: 'Geauga County (just south of Lake County)',
    },
  },
];

/**
 * Secondary service areas - smaller cities, can get pages in Phase 2
 */
export const secondaryLocations: LocationData[] = [
  {
    name: 'Kirtland',
    slug: 'kirtland',
    county: 'Lake',
    population: 7000,
    uniqueContent: {
      directions:
        'From Kirtland, take Route 306 to Route 6 east, then Route 44 south. About 10 minutes total.',
      landmarks: ['Kirtland Temple', 'Holden Arboretum', 'Lake Metroparks Farmpark'],
      localExample: 'Holden Arboretum members ship plant specimens through us.',
      driveTime: 'About 10-12 minutes',
      nearbyHighways: ['Route 306', 'Route 6'],
    },
    seo: {
      demonymSingular: 'Kirtland resident',
      demonymPlural: 'Kirtland residents',
      areaDescriptor: 'southeast Lake County',
    },
  },
  {
    name: 'Madison',
    slug: 'madison',
    county: 'Lake',
    population: 3200,
    uniqueContent: {
      directions:
        'From Madison, take Route 528 to Route 6 west, then Route 44 south. About 20 minutes.',
      landmarks: ['Madison Winery District', 'Grand River Academy', 'Lake Erie shoreline'],
      localExample: 'Madison winery owners ship wine club packages through us.',
      driveTime: 'About 18-20 minutes',
      nearbyHighways: ['Route 528', 'Route 20', 'I-90'],
    },
    seo: {
      demonymSingular: 'Madison resident',
      demonymPlural: 'Madison residents',
      areaDescriptor: 'eastern Lake County',
    },
  },
  {
    name: 'Eastlake',
    slug: 'eastlake',
    county: 'Lake',
    population: 18000,
    uniqueContent: {
      directions:
        'From Eastlake, take Vine Street to Route 306 north, then Route 6 east to Route 44 south.',
      landmarks: ['Classic Park', 'Eastlake North High School', 'Lakeland Boulevard'],
      localExample: 'Eastlake residents ship collectibles from estate sales through us.',
      driveTime: 'About 12-15 minutes',
      nearbyHighways: ['Route 306', 'Route 2', 'I-90'],
    },
    seo: {
      demonymSingular: 'Eastlake resident',
      demonymPlural: 'Eastlake residents',
      areaDescriptor: 'western Lake County',
    },
  },
  {
    name: 'Wickliffe',
    slug: 'wickliffe',
    county: 'Lake',
    population: 12500,
    uniqueContent: {
      directions:
        'From Wickliffe, take Route 306 north to Route 6 east, then Route 44 south. About 10 minutes.',
      landmarks: ['Notre Dame College', 'Lloyd Road Shopping', 'Wickliffe Italian-American Club'],
      localExample: 'Notre Dame College families ship care packages through us.',
      driveTime: 'About 10-12 minutes',
      nearbyHighways: ['Route 306', 'I-90', 'Route 2'],
    },
    seo: {
      demonymSingular: 'Wickliffe resident',
      demonymPlural: 'Wickliffe residents',
      areaDescriptor: 'southwest Lake County',
    },
  },
  {
    name: 'Mentor-on-the-Lake',
    slug: 'mentor-on-the-lake',
    county: 'Lake',
    population: 7500,
    uniqueContent: {
      directions: 'From Mentor-on-the-Lake, take Route 283 to Route 44 south. About 8 minutes.',
      landmarks: ['Mentor Lagoons', 'Lake Erie shoreline', 'Mentor Harbor Yacht Club'],
      localExample: 'Boat owners ship marine parts through us during boating season.',
      driveTime: 'About 8-10 minutes',
      nearbyHighways: ['Route 283', 'Route 44'],
    },
    seo: {
      demonymSingular: 'Mentor-on-the-Lake resident',
      demonymPlural: 'Mentor-on-the-Lake residents',
      areaDescriptor: 'lakefront Lake County',
    },
  },
];

/**
 * All locations combined for iteration
 */
export const allLocations = [...primaryLocations, ...secondaryLocations];

/**
 * Core services that get location pages
 * These are the "[service] in [city]" patterns
 */
export const locationEligibleServices = [
  {
    serviceName: 'UPS Drop-Off',
    slug: 'ups-drop-off',
    searchPattern: 'UPS drop off near me',
    metaTemplate:
      'Drop off your UPS packages at Mailbox Plus in {city}. No lines, expert packing help, same-day pickup. Open 6 days a week.',
  },
  {
    serviceName: 'FedEx Shipping',
    slug: 'fedex-shipping',
    searchPattern: 'FedEx shipping near me',
    metaTemplate:
      'Ship FedEx from Mailbox Plus near {city}. Ground, Express, International. We pack it right and get it out same-day.',
  },
  {
    serviceName: 'Package Shipping',
    slug: 'package-shipping',
    searchPattern: 'package shipping near me',
    metaTemplate:
      'Need to ship a package from {city}? Mailbox Plus compares UPS, FedEx, and USPS to find you the best rate.',
  },
  {
    serviceName: 'Notary Services',
    slug: 'notary',
    searchPattern: 'notary near me',
    metaTemplate:
      'Walk-in notary near {city}. No appointment needed. $5 per signature. Open 6 days a week.',
  },
  {
    serviceName: 'Mailbox Rental',
    slug: 'mailbox-rental',
    searchPattern: 'mailbox rental near me',
    metaTemplate:
      'Rent a private mailbox near {city}. Real street address, package acceptance, secure and professional service.',
  },
  {
    serviceName: 'Printing Services',
    slug: 'printing',
    searchPattern: 'printing near me',
    metaTemplate:
      'Print documents near {city}. Color copies, business cards, flyers, banners. Same-day service available.',
  },
  {
    serviceName: 'Fax Services',
    slug: 'fax',
    searchPattern: 'fax near me',
    metaTemplate:
      'Send or receive faxes near {city}. Walk in, no appointment. $1 per page to send, $0.50 to receive.',
  },
  {
    serviceName: 'Shredding Services',
    slug: 'shredding',
    searchPattern: 'shredding near me',
    metaTemplate:
      'Secure document shredding near {city}. Micro-cut technology, watch-while-we-shred, HIPAA compliant.',
  },
];

/**
 * PROGRAMMATIC SEO: Generate location page configurations
 *
 * This function combines a base service with location data
 * to create unique location-specific pages.
 *
 * Following the skill's "Unique Value Per Page" principle:
 * - Each page has unique directions from that city
 * - Each page references local landmarks
 * - Each page has location-specific meta descriptions
 */
export function generateLocationPageConfig(
  service: (typeof locationEligibleServices)[0],
  location: LocationData
) {
  const uniqueId = `${service.slug}-${location.slug}`;

  return {
    id: uniqueId,
    category: 'location-page' as const,
    city: location.name,
    serviceName: `${service.serviceName} in ${location.name}`,
    slug: `/${service.slug}-${location.slug}`,
    pageTitle: `${service.serviceName} in ${location.name}, ${location.county} County | Mailbox Plus`,
    metaDescription: service.metaTemplate.replace('{city}', location.name),
    heroTitle: `${service.serviceName} in ${location.name}`,
    heroSubtitle: `We're just ${location.uniqueContent.driveTime} from ${location.name}. ${location.uniqueContent.directions}`,

    // UNIQUE CONTENT: This is what makes it NOT a doorway page
    uniqueLocalContent: {
      directions: location.uniqueContent.directions,
      landmarks: location.uniqueContent.landmarks,
      localExample: location.uniqueContent.localExample,
      driveTime: location.uniqueContent.driveTime,
      nearbyHighways: location.uniqueContent.nearbyHighways,
    },

    // Content sections with location-specific details
    content: [
      {
        heading: `${service.serviceName} Near ${location.name}`,
        body: `Looking for ${service.serviceName.toLowerCase()} in ${location.name}? Mailbox Plus is just ${location.uniqueContent.driveTime} away. ${location.uniqueContent.localExample || ''}`,
      },
      {
        heading: `How to Find Us from ${location.name}`,
        body: `${location.uniqueContent.directions} Look for 7554 Fredle Drive in Capital Plaza - we're next to Pet Supplies Plus.${
          location.uniqueContent.nearbyHighways
            ? ` Easy access from ${location.uniqueContent.nearbyHighways.join(', ')}.`
            : ''
        }`,
      },
      {
        heading: `Why ${location.seo.demonymPlural} Choose Mailbox Plus`,
        body: `Unlike the big box stores, we're a local business. We remember your name. ${location.seo.demonymPlural} know they can count on us for fast, friendly service without the lines.`,
      },
    ],

    // Location-specific FAQs
    faqs: [
      {
        question: `How far is Mailbox Plus from ${location.name}?`,
        answer: `About ${location.uniqueContent.driveTime} from ${location.name}. ${location.uniqueContent.directions}`,
      },
      {
        question: `Is this the closest ${service.serviceName.toLowerCase()} to ${location.name}?`,
        answer: `We're one of the most convenient options for ${location.seo.demonymPlural}. We're located in ${location.seo.areaDescriptor}, easy to reach from ${location.uniqueContent.landmarks[0]} and surrounding areas.`,
      },
    ],

    cta: {
      title: `Stop by from ${location.name} - we're open 6 days a week`,
      buttonText: 'Get Directions',
      buttonLink: '/contact-us',
    },

    // Schema.org structured data hints
    structuredData: {
      areaServed: location.name,
      serviceArea: `${location.name}, ${location.county} County, Ohio`,
    },
  };
}

/**
 * Generate all location pages for Phase 1
 * (Primary locations × Core services)
 */
export function generatePhase1LocationPages() {
  const pages = [];

  for (const location of primaryLocations) {
    for (const service of locationEligibleServices) {
      pages.push(generateLocationPageConfig(service, location));
    }
  }

  return pages;
}

/**
 * Generate all location pages for Phase 2
 * (Secondary locations × Core services)
 */
export function generatePhase2LocationPages() {
  const pages = [];

  for (const location of secondaryLocations) {
    for (const service of locationEligibleServices) {
      pages.push(generateLocationPageConfig(service, location));
    }
  }

  return pages;
}

// Preview: Phase 1 would generate this many pages:
// 5 primary locations × 8 services = 40 location pages

// Preview: Phase 2 would add:
// 5 secondary locations × 8 services = 40 more location pages

// Total potential: 80 location pages
