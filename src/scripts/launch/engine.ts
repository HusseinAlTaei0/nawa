/**
 * محرك التشخيص للفرع الفعّال. الواجهة (ui.ts) والسيرفر (netlify/functions/launch.mts) والاختبارات تستورد من هنا.
 * المحركات نفسها في ./engines/ (agency = "اكتشف ليش تخسر زبائنك"، legal = "اكتشف وين يضيع شغلك القانوني").
 * ⚠️ يجب أن يطابق src/data/division.ts و site.division (انظر src/data/divisions/README.md).
 */
export * from './engines/legal.ts';
