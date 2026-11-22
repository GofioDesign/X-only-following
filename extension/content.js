// Solo Siguiendo para X — content script
(() => {
  'use strict';

  const DEFAULTS = {
    enabled: true,
    forceFollowing: true,   // Cambiar automáticamente a la pestaña "Siguiendo"
    hideForYou: true,       // Ocultar la pestaña "Para ti"
    hideAds: true,          // Ocultar posts promocionados
    hideReposts: false,     // Ocultar reposts (pueden traer cuentas que no sigues)
    hideSuggestions: true   // Ocultar "A quién seguir", tendencias y bloques sugeridos
  };

  const HIDDEN = 'ssx-hidden';
  const AD_LABELS = /^(ad|ads|promoted|promocionado|anuncio|sponsorisé|sponsorizzato|gesponsert|patrocinado|publicidade)$/i;
  const REPOST_TEXT = /(repost|retwe|retuit|reposte|ha reposteado|han reposteado|a reposté|hat repostet)/i;

  let settings = { ...DEFAULTS };
  let scheduled = false;
  let lastTabClick = 0;

  const isHome = () => location.pathname === '/home' || location.pathname === '/';

  function hide(el) {
    if (el && !el.classList.contains(HIDDEN)) el.classList.add(HIDDEN);
  }

  function unhideAll() {
    document.querySelectorAll('.' + HIDDEN).forEach(el => el.classList.remove(HIDDEN));
  }

  // ---- Pestañas "Para ti" / "Siguiendo" -----------------------------------
  function handleTabs() {
    const column = document.querySelector('[data-testid="primaryColumn"]');
    if (!column) return;
    const tablist = column.querySelector('[role="tablist"]');
    if (!tablist) return;
    const tabs = [...tablist.querySelectorAll('[role="tab"]')];
    if (tabs.length < 2) return;

    // En /home la primera pestaña es "Para ti" y la segunda "Siguiendo".
    // Si tienes listas fijadas aparecen después, así que usamos la posición.
    const forYou = tabs[0];
    const following = tabs[1];

    if (settings.forceFollowing && following.getAttribute('aria-selected') !== 'true') {
      const now = Date.now();
      if (now - lastTabClick > 1500) {
        lastTabClick = now;
        following.click();
      }
    }

    if (settings.hideForYou) {
      hide(forYou.closest('[role="presentation"]') || forYou);
    }
  }

  // ---- Posts del timeline -------------------------------------------------
  function isAd(article) {
    // Nota: no usar [data-testid="placementTracking"]; X lo pone también en vídeos normales.
    for (const span of article.querySelectorAll('span')) {
      if (span.childElementCount === 0 && AD_LABELS.test(span.textContent.trim())) return true;
    }
    return false;
  }

  function isRepost(article) {
    const ctx = article.querySelector('[data-testid="socialContext"]');
    return !!ctx && REPOST_TEXT.test(ctx.textContent);
  }

  function handleTimeline() {
    const cells = document.querySelectorAll('[data-testid="primaryColumn"] [data-testid="cellInnerDiv"]');
    for (const cell of cells) {
      if (cell.classList.contains(HIDDEN)) continue;

      const article = cell.querySelector('article');
      if (article) {
        if (settings.hideAds && isAd(article)) { hide(cell); continue; }
        if (isHome() && settings.hideReposts && isRepost(article)) { hide(cell); continue; }
      }

      // Bloques "A quién seguir" incrustados en el feed de inicio
      if (isHome() && settings.hideSuggestions && !article && cell.querySelector('[data-testid="UserCell"]')) {
        hide(cell);
        // Ocultar también la cabecera del bloque y el enlace "Mostrar más"
        let prev = cell.previousElementSibling;
        if (prev && !prev.querySelector('article')) hide(prev);
        let next = cell.nextElementSibling;
        if (next && !next.querySelector('article') && !next.querySelector('[data-testid="UserCell"]')) hide(next);
      }
    }
  }

  // ---- Barra lateral ------------------------------------------------------
  function handleSidebar() {
    if (!settings.hideSuggestions) return;
    const sidebar = document.querySelector('[data-testid="sidebarColumn"]');
    if (!sidebar) return;
    sidebar.querySelectorAll('section, aside').forEach(block => {
      if (block.querySelector('[data-testid="trend"], [data-testid="UserCell"]')) {
        hide(block.parentElement || block);
      }
    });
  }

  // ---- Bucle principal ----------------------------------------------------
  function run() {
    scheduled = false;
    if (!settings.enabled) return;
    try {
      if (isHome()) handleTabs();
      handleTimeline();
      handleSidebar();
    } catch (err) {
      console.warn('[Solo Siguiendo] error:', err);
    }
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(run);
  }

  async function loadSettings() {
    try {
      const stored = await chrome.storage.sync.get(DEFAULTS);
      settings = { ...DEFAULTS, ...stored };
    } catch (err) {
      console.warn('[Solo Siguiendo] no se pudieron leer los ajustes:', err);
    }
  }

  chrome.storage.onChanged.addListener(async (_changes, area) => {
    if (area !== 'sync') return;
    await loadSettings();
    unhideAll();
    lastTabClick = 0;
    schedule();
  });

  (async () => {
    await loadSettings();
    new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
    schedule();
  })();
})();
