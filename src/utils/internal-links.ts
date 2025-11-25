import siteStructure from '../data/siteStructure.json';
import internalLinks from '../data/internalLinks.json';
import anchorText from '../data/anchorText.json';
import { serviceAreas } from '../config/serviceAreas';
import { services } from '../config/services';

type AnchorVariant = 'exact' | 'lsi' | 'geo';
type ServiceId = keyof typeof internalLinks;

export const getInternalLink = (serviceId: string) => {
  // Find the service in the site structure
  for (const pillar of siteStructure.pillars) {
    if (pillar.id === serviceId) return pillar;
    const child = pillar.children.find(c => c.id === serviceId);
    if (child) return child;
  }
  // Check sub-supporting
  const sub = siteStructure.subSupporting.find(s => s.id === serviceId);
  if (sub) return sub;

  return null;
};

export const getAnchorText = (serviceId: string, variant: AnchorVariant = 'exact'): string => {
  const anchors = (anchorText as any)[serviceId];
  if (!anchors) {
    // Fallback to title if no specific anchors defined
    const link = getInternalLink(serviceId);
    return link ? link.title : serviceId;
  }

  const variants = anchors[variant] || anchors['exact'];
  // Return random variant to avoid over-optimization
  return variants[Math.floor(Math.random() * variants.length)];
};

export const getRelatedServices = (serviceId: ServiceId) => {
  const linkData = (internalLinks as any)[serviceId];
  if (!linkData || !linkData.related) return [];
  
  return linkData.related.map((id: string) => getInternalLink(id)).filter(Boolean);
};

export const getParentPillar = (serviceId: ServiceId) => {
    const linkData = (internalLinks as any)[serviceId];
    if (!linkData || !linkData.parent) return null;
    return siteStructure.pillars.find(p => p.id === linkData.parent);
};

export const getLocalPriorityServices = (citySlug: string) => {
  const city = serviceAreas.find(c => c.slug === citySlug);
  if (!city) return [];
  return city.priorityServices.map(id => services.find(s => s.id === id)).filter(Boolean);
};

export const getBreadcrumbs = (pathname: string) => {
    const path = pathname.replace(/\/$/, ''); // Remove trailing slash
    
    if (path === '') return [];

    // Check Pillars
    const pillar = siteStructure.pillars.find(p => p.url === path);
    if (pillar) {
        return [
            { label: 'Home', url: '/' },
            { label: pillar.title, url: pillar.url, active: true }
        ];
    }

    // Check Children
    for (const p of siteStructure.pillars) {
        const child = p.children.find(c => c.url === path);
        if (child) {
            return [
                { label: 'Home', url: '/' },
                { label: p.title, url: p.url },
                { label: child.title, url: child.url, active: true }
            ];
        }
    }

    // Check Local Pages
    const local = serviceAreas.find(l => l.canonicalUrl === path);
    if (local) {
        return [
            { label: 'Home', url: '/' },
            { label: 'Service Areas', url: '/service-area' },
            { label: local.city, url: local.canonicalUrl, active: true }
        ];
    }
    
    return [{ label: 'Home', url: '/' }];
};