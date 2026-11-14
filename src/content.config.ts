/**
 * مجموعة "الأعمال" (دراسات الحالة). كل دراسة = ملف Markdown في src/content/work/<lang>/<slug>.md
 * draft: true (الافتراضي) = محتوى تجريبي لا يظهر في الموقع الحي. اجعلها false عند اعتماد الدراسة.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    lang: z.enum(['en', 'ar']),
    client: z.string(),
    sector: z.string(),
    year: z.number(),
    service: z.string(), // slug الخدمة من src/data/services.ts
    metric: z.string(), // الرقم الأبرز، مثل "3 hrs"
    metricLabel: z.string(),
    summary: z.string(),
    results: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
    order: z.number().default(0),
    draft: z.boolean().default(true),
  }),
});

export const collections = { work };
