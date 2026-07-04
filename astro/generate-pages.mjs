#!/usr/bin/env node
/**
 * Generate Astro page files for all services.
 * Reads the service config and creates minimal .astro pages.
 */
import { services } from './src/config/services.ts';
import { mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';

for (const service of services) {
  // Skip service landing pages (pack-ship, copy-print — handled separately)
  if (['pack-ship', 'copy-print', 'home-business'].includes(service.id)) continue;

  const slug = service.slug;
  if (!slug || slug === '/' || slug === '/services') continue;

  // Determine file path from slug
  // slug looks like: /pack-ship/postage-stamps or /home-business/mailbox-rental or /copy-print/business-cards
  // or standalone: /fedex-easy-returns or /ups-store-alternative-concord-township
  const parts = slug.split('/').filter(Boolean);
  let filePath;

  if (parts.length === 1) {
    // Standalone: e.g., /fedex-easy-returns → fedex-easy-returns.astro
    filePath = `src/pages/${parts[0]}.astro`;
  } else if (parts.length >= 2) {
    // Nested: e.g., /pack-ship/postage-stamps → src/pages/pack-ship/postage-stamps.astro
    filePath = `src/pages/${parts[0]}/${parts[1]}.astro`;
  }

  if (!filePath) continue;

  // Check if this service has custom intro content (children prop in the React version)
  // We can't easily detect this from config, so create a basic template
  mkdirSync(dirname(filePath), { recursive: true });

  const content = `---
import ServiceLayout from '../../layouts/ServiceLayout.astro';
import { getServiceById } from '../../utils/services-helpers';

const service = getServiceById('${service.id}')!;
---

<ServiceLayout service={service} />
`;

  writeFileSync(filePath, content);
}
