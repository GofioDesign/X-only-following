'use strict';
// Estadísticas de uso (solo en local, las guarda common.js) e invitaciones a
// valorar y donar. Se abre desde el panel y, sola, a los 20 usos y en cada
// aniversario de la instalación (?from=first | ?from=year).
const t = (key, subs) => chrome.i18n.getMessage(key, subs) || '';
const SECONDS_PER_ITEM = 6; // estimación: lo que cuesta pasar de largo un anuncio o recomendación
const NEXT_YEAR_MS = 358 * 24 * 3600 * 1000;
const REVIEW_URL = 'https://chromewebstore.google.com/detail/fhajebegoleecljdhfokiokejdkalhji/reviews';
const NETS = [['x', 'X'], ['yt', 'YouTube'], ['ig', 'Instagram'], ['fb', 'Facebook'], ['li', 'LinkedIn'],
  ['tt', 'TikTok'], ['th', 'Threads'], ['bs', 'Bluesky'], ['tw', 'Twitch']];

const lang = chrome.i18n.getUILanguage() || 'es';
const num = (n, d = 0) => new Intl.NumberFormat(lang, { maximumFractionDigits: d }).format(n);
const date = (ts) => new Intl.DateTimeFormat(lang, { dateStyle: 'long' }).format(new Date(ts));
function dur(ms) {
  const min = ms / 60000;
  if (min < 60) return `${num(min)} min`;
  const h = min / 60;
  return `${num(h, h < 10 ? 1 : 0)} h`;
}

(async () => {
  document.documentElement.lang = lang.split('-')[0];
  document.title = `${t('extName')} · ${t('statsLink')}`;
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.getElementById('moreLink').href = t('moreUrl');

  const from = new URLSearchParams(location.search).get('from');
  const st = await chrome.storage.local.get({ stats: null, lastYear: null, installDate: 0, reviewDone: false });
  // En el aviso anual se enseña el año que acaba de terminar
  const data = (from === 'year' && st.lastYear) || st.stats || { since: st.installDate || Date.now(), nets: {} };
  const until = data.until || Date.now();

  const title = from === 'year' ? 'donateYearTitle' : from === 'first' ? 'donateTitle' : 'statsTitle';
  document.getElementById('title').textContent = t(title);
  if (from) { const lead = document.getElementById('lead'); lead.textContent = t('donateYearText'); lead.hidden = false; }
  document.getElementById('period').textContent = t('statsPeriod', [date(data.since), date(until)]);

  let ms = 0, hidden = 0;
  const rows = document.getElementById('rows');
  for (const [key, name] of NETS) {
    const n = data.nets?.[key];
    if (!n || (!n.ms && !n.hidden)) continue;
    ms += n.ms; hidden += n.hidden;
    const tr = document.createElement('tr');
    [name, dur(n.ms), num(n.hidden), '≈ ' + dur(n.hidden * SECONDS_PER_ITEM * 1000)].forEach((v) => {
      const td = document.createElement('td'); td.textContent = v; tr.appendChild(td);
    });
    rows.appendChild(tr);
  }
  if (!ms && !hidden) {
    document.getElementById('summary').hidden = true;
    document.getElementById('empty').hidden = false;
  }
  const days = Math.max(1, (until - data.since) / 864e5);
  document.getElementById('totHours').textContent = dur(ms);
  document.getElementById('totDaily').textContent = dur(ms / days);
  document.getElementById('totHidden').textContent = num(hidden);
  document.getElementById('totSaved').textContent = '≈ ' + dur(hidden * SECONDS_PER_ITEM * 1000);

  // Donar: el botón y «recuérdamelo» dejan el siguiente aviso para el próximo año
  const snooze = (k, box, msg) => async () => {
    try { await chrome.storage.local.set({ [k]: Date.now() + NEXT_YEAR_MS }); } catch {}
    box.querySelector('.actions').hidden = true;
    if (msg) document.getElementById(msg).hidden = false;
  };
  const donateBox = document.getElementById('donateBox');
  const donateGo = document.getElementById('donateGo');
  donateGo.href = `${t('moreUrl')}#donar`;
  donateGo.addEventListener('click', snooze('donateSnoozeUntil', donateBox, null));
  document.getElementById('donateLater').addEventListener('click', snooze('donateSnoozeUntil', donateBox, 'donateSnoozed'));

  const reviewBox = document.getElementById('reviewBox');
  if (st.reviewDone) reviewBox.hidden = true;
  const reviewGo = document.getElementById('reviewGo');
  reviewGo.href = REVIEW_URL;
  reviewGo.addEventListener('click', async () => { try { await chrome.storage.local.set({ reviewDone: true }); } catch {} });
  document.getElementById('reviewLater').addEventListener('click', snooze('reviewSnoozeUntil', reviewBox, 'reviewSnoozed'));
})();
