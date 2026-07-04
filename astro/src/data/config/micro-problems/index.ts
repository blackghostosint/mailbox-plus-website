import { returnMicroProblems } from './returns';
import { shippingMicroProblems } from './shipping';
import { packagingMicroProblems } from './packaging';
import { miscMicroProblems } from './misc';

export const microProblems = [
  ...returnMicroProblems,
  ...shippingMicroProblems,
  ...packagingMicroProblems,
  ...miscMicroProblems,
];

if (import.meta.env.DEV) {
  const ids = new Set<string>();
  const slugs = new Set<string>();

  microProblems.forEach((mp, index) => {
    if (!mp.id) {
      throw new Error(`Micro-problem at index ${index} is missing required field: id`);
    }
    if (!mp.slug) {
      throw new Error(
        `Micro-problem at index ${index} (id: ${mp.id}) is missing required field: slug`
      );
    }
    if (!mp.serviceName) {
      throw new Error(
        `Micro-problem at index ${index} (id: ${mp.id}) is missing required field: serviceName`
      );
    }
    if (!mp.heroTitle) {
      throw new Error(
        `Micro-problem at index ${index} (id: ${mp.id}) is missing required field: heroTitle`
      );
    }

    if (ids.has(mp.id)) {
      throw new Error(`Duplicate micro-problem id: ${mp.id}`);
    }
    if (slugs.has(mp.slug)) {
      throw new Error(`Duplicate micro-problem slug: ${mp.slug}`);
    }

    ids.add(mp.id);
    slugs.add(mp.slug);
  });

  const intentMap = new Map<string, string>();

  microProblems.forEach((mp) => {
    if (!mp.intentKey) return;

    if (intentMap.has(mp.intentKey)) {
      throw new Error(
        `Duplicate intent detected: "${mp.intentKey}"
Conflicts:
- ${intentMap.get(mp.intentKey)}
- ${mp.id}`
      );
    }

    intentMap.set(mp.intentKey, mp.id);
  });
}
