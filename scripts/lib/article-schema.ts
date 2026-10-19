import { z } from 'zod';
import { isKnownRoute, type RouteRegistry } from './article-utils.ts';

const isValidDateString = (val: string) => !isNaN(Date.parse(val));

const dateOrStringSchema = z.union([
  z.string().min(1, 'Date string must not be empty').refine(isValidDateString, {
    message: 'Date string must be a valid parseable date/ISO format',
  }),
  z.date().transform((d) => d.toISOString()),
]);

/**
 * Single Zod schema defining all frontmatter validation rules for articles
 * across local checks, LLM generation, copy auditing, and CI gates.
 */
export const articleFrontmatterSchema = z
  .object({
    title: z.string().min(1, "Field 'title' must not be empty"),
    description: z.string().min(1, "Field 'description' must not be empty"),
    slug: z
      .string()
      .min(1, "Field 'slug' must not be empty")
      .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Field 'slug' must be lowercase kebab-case"),
    category: z.string().min(1, "Field 'category' must not be empty"),
    intentKey: z.string().min(1, "Field 'intentKey' must not be empty"),
    pubDate: dateOrStringSchema,
    status: z.string().min(1).default('published'),
    image: z.string().min(1, "Field 'image' must not be empty"),
    imageAlt: z.string().min(1, "Field 'imageAlt' must not be empty"),
    keywords: z.array(z.string()).min(1, "Field 'keywords' must be a non-empty array of strings"),
    relatedServices: z.array(z.string()),
    author: z.string().min(1, "Field 'author' must not be empty"),
    location: z.string().optional(),
    lastModified: dateOrStringSchema.optional(),
    imageBody1: z.string().optional(),
    imageBody1Alt: z.string().optional(),
    eventDate: dateOrStringSchema.optional(),
    source: z.string().optional(),
    sourceLabel: z.string().optional(),
    articleType: z
      .enum(['pillar', 'comparison', 'guide', 'batch'], {
        message: "Field 'articleType' must be one of: pillar, comparison, guide, batch",
      })
      .optional(),
    quickAnswer: z.string().optional(),
    faqs: z.array(z.object({ question: z.string().min(1), answer: z.string().min(1) })).optional(),
  })
  .passthrough();

export type ArticleFrontmatter = z.infer<typeof articleFrontmatterSchema>;

export interface ValidateFrontmatterOptions {
  fileName?: string;
  registry?: RouteRegistry;
  intentKeys?: Map<string, any> | Set<string>;
}

/**
 * Validates frontmatter data against articleFrontmatterSchema, with optional
 * contextual checks (route existence for relatedServices and intentKey uniqueness).
 * Returns { success: true, data } or { success: false, errors: string[] }.
 */
export function validateArticleFrontmatter(
  data: unknown,
  fileNameOrOptions?: string | ValidateFrontmatterOptions,
  optionsParam?: ValidateFrontmatterOptions
): { success: true; data: ArticleFrontmatter } | { success: false; errors: string[] } {
  let opts: ValidateFrontmatterOptions = {};
  if (typeof fileNameOrOptions === 'string') {
    opts = { fileName: fileNameOrOptions, ...optionsParam };
  } else if (fileNameOrOptions && typeof fileNameOrOptions === 'object') {
    opts = fileNameOrOptions;
  }

  const result = articleFrontmatterSchema.safeParse(data);
  const prefix = opts.fileName ? `${opts.fileName}: ` : '';
  const errors: string[] = [];

  if (!result.success) {
    for (const err of result.error.issues || []) {
      const fieldPath = err.path.join('.');
      errors.push(`❌ ${prefix}${fieldPath ? `Field '${fieldPath}': ` : ''}${err.message}`);
    }
    return { success: false, errors };
  }

  const fm = result.data;

  // Contextual check 1: intentKey uniqueness
  if (fm.intentKey && opts.intentKeys) {
    const ik = String(fm.intentKey);
    const fileName = opts.fileName || '';
    if (opts.intentKeys instanceof Map) {
      const existing = opts.intentKeys.get(ik);
      if (existing !== undefined) {
        let otherFile = '';
        if (Array.isArray(existing)) {
          otherFile = existing.filter((f: string) => f !== fileName).join(', ');
        } else if (typeof existing === 'string') {
          if (existing !== fileName) otherFile = existing;
        }
        if (otherFile) {
          errors.push(`❌ ${prefix}Duplicate intentKey '${ik}' (also in ${otherFile})`);
        } else if (existing === fileName) {
          // Same file checked twice or recorded earlier; no duplicate error for same file
        } else {
          errors.push(`❌ ${prefix}Duplicate intentKey '${ik}' (also in ${existing})`);
        }
      } else {
        if (fileName) {
          (opts.intentKeys as Map<string, string>).set(ik, fileName);
        }
      }
    } else if (opts.intentKeys instanceof Set) {
      if (opts.intentKeys.has(ik)) {
        errors.push(`❌ ${prefix}Duplicate intentKey '${ik}'`);
      } else {
        opts.intentKeys.add(ik);
      }
    }
  }

  // Contextual check 2: relatedServices route validity
  if (opts.registry && Array.isArray(fm.relatedServices)) {
    for (const servicePath of fm.relatedServices) {
      if (!isKnownRoute(servicePath, opts.registry)) {
        errors.push(
          `❌ ${prefix}relatedServices path '${servicePath}' does not match any known route`
        );
      }
    }
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return { success: true, data: fm };
}
