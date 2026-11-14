/** دوال مساعدة لمجموعة الأعمال: تُرجع فقط ما يُسمح بعرضه (تخفي draft في الموقع الحي) */
import { getCollection, type CollectionEntry } from 'astro:content';
import { showDrafts } from './drafts';
import type { Lang } from '../config/site';

export type WorkEntry = CollectionEntry<'work'>;
export const workSlug = (e: WorkEntry) => e.id.split('/').pop()!.replace(/\.md$/, '');

export async function getWork(lang: Lang): Promise<WorkEntry[]> {
  const all = await getCollection('work', (e) => e.data.lang === lang && (showDrafts || !e.data.draft));
  return all.sort((a, b) => a.data.order - b.data.order);
}
