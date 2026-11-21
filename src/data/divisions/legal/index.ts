/**
 * فرع NAWA Legal Tech: التقنية القانونية لمكاتب المحاماة والأقسام القانونية في العراق.
 * هذا هو الفرع المفعّل الآن. لإضافة فرع أو تبديله انظر src/data/divisions/README.md
 */
export const DIVISION_ID = 'legal' as const;
export { ui } from './ui';
export { home, processData, servicesPage, workPage, aboutPage, contactPage, privacyPage } from './pages';
export { services, getService, serviceCopy, type Service, type ServiceCopy, type PlanetKey } from './services';
export { launchCopy, type LaunchCopy, type QuestionCopy } from './launch';
