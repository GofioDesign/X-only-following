// Dezombify — panel (icono) y página de opciones
// En el panel: solo la red de la pestaña actual; fuera de ellas, la lista de redes.
// En Opciones: todas las redes con todas sus opciones.
const DEFAULTS = {
  enabled: true,
  x_on: true, x_reposts: false,
  yt_on: true, yt_shorts: true, yt_related: true, yt_autoplay: true, yt_ads: true,
  ig_on: true, ig_explore: true, ig_reposts: false,
  fb_on: true, fb_friends: false, fb_reels: true, fb_shares: false, fb_activity: true,
  li_on: true, li_reposts: false, li_activity: true,
  tt_on: true, tt_explore: true, tt_reposts: false,
  th_on: true, th_reposts: false,
  bs_on: true, bs_reposts: false,
  tw_on: true, tw_browse: true
};
const NETS = [
  { main: 'x_on', host: /(^|\.)(x|twitter)\.com$/, subs: ['x_reposts'] },
  { main: 'yt_on', host: /(^|\.)youtube\.com$/, subs: ['yt_ads', 'yt_shorts', 'yt_related', 'yt_autoplay'] },
  { main: 'ig_on', host: /(^|\.)instagram\.com$/, subs: ['ig_explore', 'ig_reposts'] },
  { main: 'fb_on', host: /(^|\.)facebook\.com$/, subs: ['fb_friends', 'fb_reels', 'fb_shares', 'fb_activity'] },
  { main: 'li_on', host: /(^|\.)linkedin\.com$/, subs: ['li_reposts', 'li_activity'] },
  { main: 'tt_on', host: /(^|\.)tiktok\.com$/, subs: ['tt_explore', 'tt_reposts'] },
  { main: 'th_on', host: /(^|\.)threads\.(com|net)$/, subs: ['th_reposts'] },
  { main: 'bs_on', host: /(^|\.)bsky\.app$/, subs: ['bs_reposts'] },
  { main: 'tw_on', host: /(^|\.)twitch\.tv$/, subs: ['tw_browse'] }
];
const t = (k) => chrome.i18n.getMessage(k) || '';

function row(key, cls) {
  const label = document.createElement('label');
  label.className = `row ${cls}`;
  const text = document.createElement('span');
  const title = document.createElement(cls === 'net' ? 'b' : 'span');
  title.textContent = t(key);
  text.appendChild(title);
  const hint = t(`${key}_hint`);
  if (hint) { const small = document.createElement('small'); small.textContent = hint; text.appendChild(small); }
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.dataset.key = key;
  label.append(text, input);
  return label;
}

function build(nets, withSubs) {
  const box = document.getElementById('options');
  for (const n of nets) {
    const sec = document.createElement('section');
    sec.appendChild(row(n.main, 'net'));
    if (withSubs) n.subs.forEach((k) => { const r = row(k, 'sub'); r.dataset.parent = n.main; sec.appendChild(r); });
    box.appendChild(sec);
  }
}

function refresh(s) {
  document.getElementById('options').classList.toggle('off', !s.enabled);
  document.querySelectorAll('.sub[data-parent]').forEach((r) => r.classList.toggle('off', !s[r.dataset.parent]));
}

// Avisos de valoración (cada 5 aperturas del panel) y de donación (1 vez por año
// desde la instalación). Todo se cuenta en local: nada sale del navegador.
const REVIEW_URL = 'https://chromewebstore.google.com/detail/fhajebegoleecljdhfokiokejdkalhji/reviews';
const YEAR_MS = 365.25 * 24 * 3600 * 1000;

async function maybeAsk() {
  const st = await chrome.storage.local.get({ installDate: 0, donateYearsShown: 0, reviewDone: false, reviewShown: 0, reviewPending: false });
  const update = {};
  if (!st.installDate) update.installDate = Date.now();
  const years = st.installDate ? Math.floor((Date.now() - st.installDate) / YEAR_MS) : 0;

  if (years >= 1 && st.donateYearsShown < years) {
    update.donateYearsShown = years;
    await chrome.storage.local.set(update);
    const box = document.getElementById('donateBox');
    document.getElementById('donateGo').href = `${t('moreUrl')}#donar`;
    document.getElementById('donateGo').addEventListener('click', () => { box.hidden = true; });
    document.getElementById('donateLater').addEventListener('click', () => { box.hidden = true; });
    box.hidden = false;
    return;
  }
  // La valoración se pide cada 5 usos reales (los cuenta common.js en las redes)
  if (!st.reviewDone && st.reviewPending) {
    const shown = st.reviewShown + 1;
    Object.assign(update, { reviewShown: shown, reviewPending: false });
    await chrome.storage.local.set(update);
    try { await chrome.action.setBadgeText({ text: '' }); } catch {}
    const box = document.getElementById('reviewBox');
    const never = document.getElementById('reviewNever');
    const done = async () => { box.hidden = true; try { await chrome.storage.local.set({ reviewDone: true }); } catch {} };
    document.getElementById('reviewGo').href = REVIEW_URL;
    document.getElementById('reviewGo').addEventListener('click', done);
    document.getElementById('reviewLater').addEventListener('click', () => { box.hidden = true; });
    if (shown >= 3) { never.hidden = false; never.addEventListener('click', done); }
    box.hidden = false;
    return;
  }
  if (Object.keys(update).length) await chrome.storage.local.set(update);
}

async function currentNet() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    // tab.url solo está disponible en las webs de las redes (permiso de host)
    const host = tab?.url ? new URL(tab.url).hostname : '';
    return NETS.find((n) => n.host.test(host)) || null;
  } catch { return null; }
}

(async () => {
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  const full = document.body.dataset.mode === 'full';
  document.getElementById('moreLink').href = t('moreUrl');
  if (full) {
    document.title = `${t('extName')} · ${t('optionsTitle')}`;
    build(NETS, true);
    document.getElementById('openOptions').remove();
  } else {
    const net = await currentNet();
    if (net) { build([net], true); document.getElementById('openOptions').textContent = t('allNetworks'); }
    else build(NETS, false);
    document.getElementById('openOptions').addEventListener('click', (e) => { e.preventDefault(); chrome.runtime.openOptionsPage(); });
    try { await maybeAsk(); } catch (err) { console.warn(err); }
  }

  const inputs = document.querySelectorAll('input[data-key]');
  try {
    const s = await chrome.storage.sync.get(DEFAULTS);
    inputs.forEach((i) => { i.checked = !!s[i.dataset.key]; });
    refresh(s);
  } catch (err) { console.error(err); }
  inputs.forEach((i) => i.addEventListener('change', async () => {
    try {
      await chrome.storage.sync.set({ [i.dataset.key]: i.checked });
      refresh(await chrome.storage.sync.get(DEFAULTS));
    } catch (err) { console.error(err); }
  }));
})();
