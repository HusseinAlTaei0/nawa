/**
 * نموذج التواصل (Netlify Forms).
 * - تحقق بسيط قبل الإرسال مع رسائل خطأ واضحة تحت كل حقل
 * - إرسال AJAX حتى تبقى الصفحة في مكانها، ثم لحظة "الإطلاق": خيط ذهبي يصعد ورسالة نجاح
 * - بدون JavaScript النموذج يُرسل بالطريقة العادية (POST) ويعمل أيضاً
 * - حقل bot-field مخفي لصيد السبام (honeypot)
 */
import { motionOn } from './motion';

const form = document.querySelector<HTMLFormElement>('form[data-contact]');
if (form) {
  const status = form.querySelector<HTMLElement>('.form-status')!;
  const btn = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const label = btn.querySelector<HTMLElement>('.btn-label')!;
  const msg = (k: string) => form.dataset[k] || '';

  const rules: Record<string, (v: string) => boolean> = {
    name: (v) => v.trim().length >= 2,
    phone: (v) => v.replace(/[^\d]/g, '').length >= 7,
    message: (v) => v.trim().length >= 8,
  };
  function validate(): boolean {
    let firstBad: HTMLElement | null = null;
    for (const key of Object.keys(rules)) {
      const el = form!.elements.namedItem(key) as HTMLInputElement | HTMLTextAreaElement;
      const err = form!.querySelector<HTMLElement>(`#err-${key}`)!;
      const ok = rules[key](el.value);
      el.setAttribute('aria-invalid', String(!ok));
      err.textContent = ok ? '' : msg(`err${key[0].toUpperCase()}${key.slice(1)}`);
      if (!ok && !firstBad) firstBad = el;
    }
    firstBad?.focus();
    return !firstBad;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;
    btn.disabled = true; label.textContent = msg('sending');
    status.textContent = ''; status.className = 'form-status';
    try {
      const body = new URLSearchParams(new FormData(form) as unknown as Record<string, string>).toString();
      const res = await fetch(form.getAttribute('action') || '/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body });
      if (!res.ok) throw new Error(String(res.status));
      // لحظة الإطلاق
      if (motionOn()) {
        const r = btn.getBoundingClientRect(), trail = document.createElement('div');
        trail.className = 'launch'; trail.style.left = `${r.left + 23}px`;
        document.body.appendChild(trail);
        trail.addEventListener('animationend', () => trail.remove());
      }
      const done = document.createElement('div');
      done.className = 'form-done'; done.setAttribute('role', 'status');
      const h = document.createElement('h3'); h.textContent = msg('success');
      done.appendChild(h);
      form.replaceChildren(done);
      done.setAttribute('tabindex', '-1'); done.focus();
    } catch {
      status.textContent = msg('fail'); status.className = 'form-status bad';
      btn.disabled = false; label.textContent = msg('send');
    }
  });
}
