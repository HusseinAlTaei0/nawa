// إعدادات Astro لموقع NAWA
// - output ثابت (static): كل صفحة تتحول إلى HTML جاهز، وهذا أفضل للسرعة و SEO ومعاينات واتساب
// - اللغتان /en و /ar مبنيتان يدوياً عبر src/pages/[lang]/ (بدون توجيه i18n تلقائي) حتى يبقى السلوك واضحاً
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://nawa-iq.com',
  trailingSlash: 'always',
  integrations: [
    // خريطة الموقع مع روابط اللغة البديلة (hreflang) لكل صفحة
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', ar: 'ar' } },
      filter: (page) => !page.endsWith('/404/'),
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
