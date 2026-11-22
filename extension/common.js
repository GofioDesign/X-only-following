// Dezombify — núcleo común a todas las redes.
// Cada archivo de sites/ registra su módulo en KTA.sites antes de que se cargue este.
(() => {
  'use strict';
  const KTA = (globalThis.KTA = globalThis.KTA || { sites: {} });

  KTA.DEFAULTS = {
    enabled: true,
    // X
    x_on: true, x_reposts: false,
    // YouTube
    yt_on: true, yt_shorts: true, yt_related: true, yt_autoplay: true, yt_ads: true,
    // Instagram
    ig_on: true, ig_explore: true, ig_reposts: false,
    // Facebook
    fb_on: true, fb_friends: false, fb_reels: true, fb_shares: false, fb_activity: true,
    // LinkedIn
    li_on: true, li_reposts: false, li_activity: true,
    // TikTok
    tt_on: true, tt_explore: true, tt_reposts: false,
    // Threads
    th_on: true, th_reposts: false,
    // Bluesky
    bs_on: true, bs_reposts: false,
    // Twitch
    tw_on: true, tw_browse: true
  };

  const HIDDEN = 'kta-hidden';
  KTA.hide = (el) => { if (el && !el.classList.contains(HIDDEN)) el.classList.add(HIDDEN); };
  KTA.isHidden = (el) => !!el && el.classList.contains(HIDDEN);
  KTA.unhideAll = () => document.querySelectorAll('.' + HIDDEN).forEach((el) => el.classList.remove(HIDDEN));

  // Texto «hoja» (sin hijos) de un elemento, útil para buscar etiquetas
  KTA.leafTexts = (root, max = 400) => {
    const out = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walker.nextNode()) && out.length < max) {
      const t = n.nodeValue.trim();
      if (t) out.push(t);
    }
    return out;
  };

  const site = Object.values(KTA.sites).find((s) => s.match(location.hostname));
  if (!site) return;

  let settings = { ...KTA.DEFAULTS };
  let scheduled = false;
  let lastUrl = '';

  function run() {
    scheduled = false;
    if (!settings.enabled || !settings[site.key + '_on']) return;
    try {
      const urlChanged = location.href !== lastUrl;
      lastUrl = location.href;
      site.apply(settings, { urlChanged });
    } catch (err) {
      console.warn('[Dezombify]', site.key, err);
    }
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(run);
  }

  async function loadSettings() {
    try {
      settings = { ...KTA.DEFAULTS, ...(await chrome.storage.sync.get(KTA.DEFAULTS)) };
    } catch (err) {
      console.warn('[Dezombify] ajustes', err);
    }
  }

  chrome.storage.onChanged.addListener(async (_c, area) => {
    if (area !== 'sync') return;
    await loadSettings();
    KTA.unhideAll();
    site.reset?.();
    lastUrl = '';
    schedule();
  });

  // Uso real = abrir una red con la extensión activa (como mucho uno cada 30 min).
  // Cada 5 usos, el service worker marca el icono y el panel pide la valoración.
  async function countUse() {
    try {
      const { uses = 0, lastUse = 0, reviewDone = false } = await chrome.storage.local.get(['uses', 'lastUse', 'reviewDone']);
      if (Date.now() - lastUse < 30 * 60 * 1000) return;
      const n = uses + 1;
      await chrome.storage.local.set({ uses: n, lastUse: Date.now() });
      if (!reviewDone && n % 5 === 0) chrome.runtime.sendMessage({ type: 'reviewDue' }).catch(() => {});
    } catch { /* contexto invalidado al actualizar la extensión */ }
  }

  (async () => {
    await loadSettings();
    if (settings.enabled && settings[site.key + '_on']) countUse();
    // Redirecciones tempranas (antes de que se pinte el feed algorítmico)
    if (settings.enabled && settings[site.key + '_on']) {
      try { site.early?.(settings); } catch (err) { console.warn(err); }
    }
    const start = () => {
      new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
      // Las webs de una sola página cambian de URL sin recargar
      window.addEventListener('popstate', schedule);
      setInterval(() => { if (location.href !== lastUrl) schedule(); }, 700);
      schedule();
    };
    if (document.body) start();
    else document.addEventListener('DOMContentLoaded', start, { once: true });
  })();
})();
