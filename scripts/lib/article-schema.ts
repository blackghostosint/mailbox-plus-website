import { z } from 'zod';

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

/**
 * Validates frontmatter data against articleFrontmatterSchema.
 * Returns { success: true, data } or { success: false, errors: string[] }.
 */
export function validateArticleFrontmatter(
  data: unknown,
  fileName?: string
): { success: true; data: ArticleFrontmatter } | { success: false; errors: string[] } {
  const result = articleFrontmatterSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }

  const prefix = fileName ? `${fileName}: ` : '';
  const errors = (result.error.issues || []).map((err) => {
    const fieldPath = err.path.join('.');
    return `❌ ${prefix}${fieldPath ? `Field '${fieldPath}': ` : ''}${err.message}`;
  });

  return { success: false, errors };
}
