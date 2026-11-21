/**
 * فرع NAWA Agency (وكالة الذكاء الاصطناعي): كل نصوص الموقع كما كانت حتى 21 نوفمبر 2026.
 * غير مفعّل حالياً. لتفعيله أو لبناء فرع جديد (NAWA Branding، NAWA Scaling) انظر src/data/divisions/README.md
 */
export const DIVISION_ID = 'agency' as const;
export { ui } from './ui';
export { home, processData, servicesPage, workPage, aboutPage, contactPage, privacyPage } from './pages';
export { services, getService, serviceCopy, type Service, type ServiceCopy, type PlanetKey } from './services';
export { launchCopy, type LaunchCopy, type QuestionCopy } from './launch';
