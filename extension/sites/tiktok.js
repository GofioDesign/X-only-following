// Kill the Algorithm — TikTok: solo «Siguiendo»
(() => {
  const KTA = (globalThis.KTA = globalThis.KTA || { sites: {} });
  const AD = /^(patrocinado|sponsored|publicidad|anuncio|ad|sponsorisé|gesponsert|sponsorizzato|patrocinado|gesponsord|sponsorowane|sponsorlu|реклама|広告|광고|广告|廣告)$/i;
  const ALGO_PATHS = /^\/(foryou|explore|live|minidrama|short-drama)?\/?$/;

  function toFollowing(s) {
    const p = location.pathname;
    if (p === '/' || p === '/foryou' || p === '/foryou/') { location.replace('/following'); return true; }
    if (s.tt_explore && ALGO_PATHS.test(p) && p !== '/' && !p.startsWith('/foryou')) { location.replace('/following'); return true; }
    return false;
  }

  KTA.sites.tiktok = {
    key: 'tt',
    match: (h) => /(^|\.)tiktok\.com$/.test(h) && !/^(ads|seller|business)/.test(h),
    early(s) { toFollowing(s); },
    apply(s, { urlChanged }) {
      if (urlChanged && toFollowing(s)) return;

      // Logo → Siguiendo; fuera «Para ti» del menú
      document.querySelectorAll('a[data-e2e="tiktok-logo"]').forEach((a) => a.setAttribute('href', '/following'));
      const hideNav = ['nav-foryou'];
      if (s.tt_explore) hideNav.push('nav-explore', 'nav-live', 'nav-short-drama');
      hideNav.forEach((k) => document.querySelectorAll(`[data-e2e="${k}"]`).forEach((el) => KTA.hide(el.closest('a, li') || el)));

      // En «Siguiendo», cuando se acaban tus cuentas TikTok mete sugerencias:
      // se reconocen por el botón «Seguir» del autor. También anuncios.
      if (location.pathname.startsWith('/following') || location.pathname.startsWith('/friends')) {
        for (const item of document.querySelectorAll('[data-e2e="recommend-list-item-container"]')) {
          if (KTA.isHidden(item)) continue;
          const notFollowed = !!item.querySelector('[data-e2e="feed-follow"]');
          const ad = !!item.querySelector('[data-e2e*="ad-tag"], [data-e2e*="sponsor"]') ||
            [...item.querySelectorAll('span, div')].some((el) => el.childElementCount === 0 && AD.test(el.textContent.trim()));
          if (notFollowed || ad) {
            item.querySelectorAll('video').forEach((v) => { try { v.pause(); v.muted = true; } catch {} });
            KTA.hide(item);
          }
        }
      }
    }
  };
})();
