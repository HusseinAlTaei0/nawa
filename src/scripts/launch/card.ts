/**
 * بطاقة "مدارك" للمشاركة (PNG مربع 1080×1080، مناسب لحالة الواتساب وستوري الإنستغرام).
 * تحتوي: الكوكب الذي بناه الزائر + اسم المدار + الدرجة + شعار نوى + الرابط.
 * لا تحتوي أي رقم خاص (لا استفسارات ضائعة ولا مبالغ): المشاركة آمنة.
 */
import { HEX, DISC } from '../../lib/mark';

interface CardInput {
  render: (ctx: CanvasRenderingContext2D, w: number, h: number) => void;
  name: string; score: number; scoreLabel: string; eyebrow: string; url: string; rtl: boolean;
}

export async function makeCard(o: CardInput): Promise<Blob | null> {
  const S = 1080;
  const c = document.createElement('canvas'); c.width = S; c.height = S;
  const ctx = c.getContext('2d'); if (!ctx) return null;
  try { await document.fonts.ready; } catch { /* الخطوط غير متاحة: نكمل بالخط الاحتياطي */ }

  ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0, 0, S, S);
  // الكوكب في الثلثين العلويين
  const p = document.createElement('canvas'); p.width = S; p.height = 700;
  const pc = p.getContext('2d');
  if (pc) { o.render(pc, S, 700); ctx.drawImage(p, 0, 40); }

  const display = o.rtl ? '"Najwa Arabic", "IBM Plex Sans Arabic", serif' : '"Playfair Display Variable", Georgia, serif';
  const sans = o.rtl ? '"IBM Plex Sans Arabic", sans-serif' : '"Montserrat Variable", sans-serif';
  ctx.textAlign = 'center'; ctx.direction = o.rtl ? 'rtl' : 'ltr';
  ctx.fillStyle = '#888888'; ctx.font = `500 26px ${sans}`;
  ctx.fillText(o.eyebrow, S / 2, 770);
  ctx.fillStyle = '#ffffff'; ctx.font = `400 76px ${display}`;
  ctx.fillText(o.name, S / 2, 860);
  ctx.fillStyle = '#C5A463'; ctx.font = `400 44px ${display}`;
  ctx.direction = 'ltr';
  ctx.fillText(`${o.score} / 100`, S / 2, 930);
  ctx.direction = o.rtl ? 'rtl' : 'ltr';
  ctx.fillStyle = '#888888'; ctx.font = `400 22px ${sans}`;
  ctx.fillText(o.scoreLabel, S / 2, 968);

  // الشعار + الرابط في الأسفل
  ctx.save();
  const k = 0.16; ctx.translate(S / 2 - 228.89 * k / 2 - 150, 1012); ctx.scale(k, k);
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 12; ctx.lineJoin = 'round'; ctx.stroke(new Path2D(HEX));
  ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(DISC.cx, DISC.cy, DISC.r, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  ctx.direction = 'ltr'; ctx.textAlign = 'left';
  ctx.fillStyle = '#ededed'; ctx.font = `500 24px "Montserrat Variable", sans-serif`;
  ctx.fillText(o.url, S / 2 - 110, 1043);

  return new Promise((res) => c.toBlob((b) => res(b), 'image/png'));
}
