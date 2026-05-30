import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes conditionally and handle conflicts.
 * Example:
 *   cn("px-2 py-1", condition && "bg-blue-500", "text-white")
 */
export function cn(...inputs: (string | false | null | undefined)[]) {
  return twMerge(clsx(inputs));
}
