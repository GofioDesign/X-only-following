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
  // Cada elemento ocultado cuenta para el resumen anual (solo en local)
  let hiddenNow = 0;
  const counted = new WeakSet();
  KTA.hide = (el) => {
    if (!el || el.classList.contains(HIDDEN)) return;
    el.classList.add(HIDDEN);
    if (!counted.has(el)) { counted.add(el); hiddenNow++; }
  };
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
  // - Cada 5 usos el panel pide la valoración (salvo «recuérdamelo el próximo año»).
  // - A los 20 usos, y luego en cada aniversario de la instalación, se abre la
  //   página de estadísticas con el resumen y la invitación a donar.
  // Todo se guarda solo en chrome.storage.local: nada sale del navegador.
  const REVIEW_EVERY = 5, DONATE_FIRST = 20, DONATE_MIN_YEAR_USES = 5;
  const YEAR_MS = 365.25 * 24 * 3600 * 1000;
  async function countUse() {
    try {
      const now = Date.now();
      const st = await chrome.storage.local.get({
        uses: 0, lastUse: 0, installDate: 0, yearUses: 0, stats: null,
        reviewDone: false, reviewSnoozeUntil: 0,
        donateFirstShown: false, donateYearsShown: 0, donateSnoozeUntil: 0
      });
      if (now - st.lastUse < 30 * 60 * 1000) return;
      const n = st.uses + 1;
      const installDate = st.installDate || now;
      const update = { uses: n, lastUse: now, yearUses: st.yearUses + 1, installDate };
      if (!st.stats) update.stats = { since: installDate, nets: {} };
      const years = Math.floor((now - installDate) / YEAR_MS);
      const donateOk = now >= st.donateSnoozeUntil;
      let open = null, review = false;
      if (years > st.donateYearsShown) {
        // Aniversario: se guarda el año que termina y los contadores vuelven a cero
        Object.assign(update, {
          donateYearsShown: years, donateFirstShown: true, yearUses: 1,
          lastYear: { ...(st.stats || { since: installDate, nets: {} }), until: now },
          stats: { since: now, nets: {} }
        });
        if (st.yearUses >= DONATE_MIN_YEAR_USES && donateOk) open = 'year';
      } else if (!st.donateFirstShown && n >= DONATE_FIRST) {
        update.donateFirstShown = true;
        if (donateOk) open = 'first';
      } else if (!st.reviewDone && now >= st.reviewSnoozeUntil && n % REVIEW_EVERY === 0) {
        review = true;
      }
      await chrome.storage.local.set(update);
      if (open) chrome.runtime.sendMessage({ type: 'openStats', from: open }).catch(() => {});
      else if (review) chrome.runtime.sendMessage({ type: 'reviewDue' }).catch(() => {});
    } catch { /* contexto invalidado al actualizar la extensión */ }
  }

  // Tiempo de uso: cada minuto con la pestaña visible y enfocada suma un minuto a
  // esta red; también se suman los elementos ocultados en ese minuto.
  function trackTime() {
    setInterval(async () => {
      const active = settings.enabled && settings[site.key + '_on'];
      const ms = active && document.visibilityState === 'visible' && document.hasFocus() ? 60000 : 0;
      const hidden = hiddenNow;
      if (!ms && !hidden) return;
      hiddenNow = 0;
      try {
        const { stats } = await chrome.storage.local.get({ stats: { since: Date.now(), nets: {} } });
        const net = stats.nets[site.key] || { ms: 0, hidden: 0 };
        stats.nets[site.key] = { ms: net.ms + ms, hidden: net.hidden + hidden };
        await chrome.storage.local.set({ stats });
      } catch { /* contexto invalidado */ }
    }, 60000);
  }

  (async () => {
    await loadSettings();
    if (settings.enabled && settings[site.key + '_on']) countUse();
    trackTime();
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
