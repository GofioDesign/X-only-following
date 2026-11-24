// Dezombify — TikTok: solo «Siguiendo»
(() => {
  const KTA = (globalThis.KTA = globalThis.KTA || { sites: {} });
  const AD = /^(patrocinado|sponsored|publicidad|anuncio|ad|sponsorisé|gesponsert|sponsorizzato|patrocinado|gesponsord|sponsorowane|sponsorlu|реклама|広告|광고|广告|廣告)$/i;
  const REPOST = /(reposted|republicó|ha republicado|ha reposteado|reposteó|a republié|hat reposted|ha ripubblicato|republicou|repostou|opnieuw geplaatst|udostępnił|yeniden paylaştı|сделал репост|リポスト|재게시|转发了|轉發了)/i;
  const ALGO_PATHS = /^\/(foryou|explore|live|minidrama|short-drama)?\/?$/;

  function toFollowing(s) {
    if (KTA.demo) return false;
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
      document.querySelectorAll('a[data-e2e="tiktok-logo"]').forEach((a) => { if (!KTA.demo) a.setAttribute('href', '/following'); });
      const hideNav = ['nav-foryou'];
      if (s.tt_explore) hideNav.push('nav-explore', 'nav-live', 'nav-short-drama');
      hideNav.forEach((k) => document.querySelectorAll(`[data-e2e="${k}"]`).forEach((el) => KTA.hide(el.closest('a, li') || el)));

      // En «Siguiendo», cuando se acaban tus cuentas TikTok mete sugerencias:
      // se reconocen por el botón «Seguir» del autor. También anuncios.
      if (location.pathname.startsWith('/following') || location.pathname.startsWith('/friends')) {
        for (const item of document.querySelectorAll('[data-e2e="recommend-list-item-container"]')) {
          if (KTA.isHidden(item)) continue;
          // Un repost de alguien que sigues trae a un autor que no sigues: se decide con tt_reposts
          const repost = !!item.querySelector('[data-e2e*="repost" i]') ||
            [...item.querySelectorAll('span, div, p')].slice(0, 60).some((el) => el.childElementCount === 0 && REPOST.test(el.textContent.trim()));
          const notFollowed = !repost && !!item.querySelector('[data-e2e="feed-follow"]');
          if (repost && s.tt_reposts) { if (!KTA.demo) item.querySelectorAll('video').forEach((v) => { try { v.pause(); } catch {} }); KTA.hide(item); continue; }
          const ad = !!item.querySelector('[data-e2e*="ad-tag"], [data-e2e*="sponsor"]') ||
            [...item.querySelectorAll('span, div')].some((el) => el.childElementCount === 0 && AD.test(el.textContent.trim()));
          if (notFollowed || ad) {
            if (!KTA.demo) item.querySelectorAll('video').forEach((v) => { try { v.pause(); v.muted = true; } catch {} });
            KTA.hide(item, ad ? 'ad' : 'algo');
          }
        }
      }
    }
  };
})();
