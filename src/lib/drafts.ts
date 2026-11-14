/**
 * المحتوى التجريبي (draft): أرقام ومشاريع وأسماء نموذجية لملء القوالب فقط.
 * - يظهر في وضع التطوير (npm run dev) وفي معاينات Netlify (PUBLIC_SHOW_DRAFTS=true)
 * - لا يظهر أبداً في الموقع الحي، حتى لا ننشر أرقاماً غير حقيقية
 */
export const showDrafts: boolean = import.meta.env.DEV || import.meta.env.PUBLIC_SHOW_DRAFTS === 'true';
