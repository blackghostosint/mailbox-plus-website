/**
 * Centralized date utility module with explicit UTC timezone formatting.
 * Eliminates hydration date drift between build servers and client browsers.
 */

export type DateInput = string | Date | number | null | undefined;

/**
 * Safely parses input into a valid Date object or returns null if invalid/missing.
 */
export function parseValidDate(input: DateInput): Date | null {
  if (input === null || input === undefined || input === '') {
    return null;
  }
  if (input instanceof Date) {
    return isNaN(input.getTime()) ? null : input;
  }
  const d = new Date(input);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Formats ISO date strings or Date objects into human-readable text with explicit UTC timezone enforcement.
 * Default format: "Month DD, YYYY" (e.g. "August 19, 2026")
 */
export function formatDisplayDate(
  input: DateInput,
  fallback: string = 'N/A',
  options?: Intl.DateTimeFormatOptions
): string {
  const d = parseValidDate(input);
  if (!d) return fallback;

  const formatOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
    ...options,
  };

  return new Intl.DateTimeFormat('en-US', formatOptions).format(d);
}

/**
 * Converts valid date inputs into standard YYYY-MM-DD or full ISO-8601 strings.
 * @param input Date, string, number, null, or undefined
 * @param fallback Fallback string if date is invalid or missing (defaults to 'unknown')
 * @param format 'date' for YYYY-MM-DD or 'iso' for full ISO string
 */
export function toISODateString(
  input: DateInput,
  fallback: string = 'unknown',
  format: 'date' | 'iso' = 'date'
): string {
  const d = parseValidDate(input);
  if (!d) return fallback;

  const iso = d.toISOString();
  return format === 'date' ? iso.slice(0, 10) : iso;
}

/**
 * Type-safe comparator function to standardize descending date sorting (newest date first).
 */
export function compareDatesDesc(a: DateInput, b: DateInput): number {
  const dateA = parseValidDate(a);
  const dateB = parseValidDate(b);

  const timeA = dateA ? dateA.getTime() : 0;
  const timeB = dateB ? dateB.getTime() : 0;

  return timeB - timeA;
}
