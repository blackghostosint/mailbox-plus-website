import siteStructure from '../data/siteStructure.json';
import { serviceAreas } from '../config/serviceAreas';
import { services } from '../config/services';

export const getLocalPriorityServices = (citySlug: string) => {
  const city = serviceAreas.find((c) => c.slug === citySlug);
  if (!city || !city.priorityServices) return [];
  return city.priorityServices.map((id) => services.find((s) => s.id === id)).filter(Boolean);
};

export const getBreadcrumbs = (pathname: string) => {
  const path = pathname.replace(/\/$/, ''); // Remove trailing slash

  if (path === '') return [];

  // Check Pillars
  const pillar = siteStructure.pillars.find((p) => p.url === path);
  if (pillar) {
    return [
      { label: 'Home', url: '/' },
      { label: pillar.title, url: pillar.url, active: true },
    ];
  }

  // Check Children
  for (const p of siteStructure.pillars) {
    const child = p.children.find((c) => c.url === path);
    if (child) {
      return [
        { label: 'Home', url: '/' },
        { label: p.title, url: p.url },
        { label: child.title, url: child.url, active: true },
      ];
    }
  }

  // Check Local Pages
  const local = serviceAreas.find((l) => l.canonicalUrl === path);
  if (local) {
    return [
      { label: 'Home', url: '/' },
      { label: 'Service Areas', url: '/service-area' },
      { label: local.city, url: local.canonicalUrl, active: true },
    ];
  }

  // Check Landing Pages
  const landingPages: Record<string, string> = {
    '/staples-printing-alternative-concord-township': 'Staples Alternative',
    '/printing-services-concord-township': 'Printing Services',
    '/office-depot-alternative-concord-township': 'Office Depot Alternative',
    '/mail-forwarding-concord-township': 'Mail Forwarding',
    '/document-services-concord-township': 'Document Services',
  };

  if (landingPages[path]) {
    return [
      { label: 'Home', url: '/' },
      { label: landingPages[path], url: path, active: true },
    ];
  }

  return [{ label: 'Home', url: '/' }];
};
