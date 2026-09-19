import type { FAQ } from '../types/faq';

/**
 * Recursively flattens an object containing FAQ arrays or nested FAQ category objects
 * into a single flat array of FAQ items.
 */
export const flattenFaqs = (obj: Record<string, unknown>): FAQ[] => {
  let arr: FAQ[] = [];
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const val = obj[key];
      if (Array.isArray(val)) {
        arr = arr.concat(val as FAQ[]);
      } else if (typeof val === 'object' && val !== null) {
        arr = arr.concat(flattenFaqs(val as Record<string, unknown>));
      }
    }
  }
  return arr;
};
