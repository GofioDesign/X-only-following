// Dezombify — X (Twitter): solo «Siguiendo»
(() => {
  const KTA = (globalThis.KTA = globalThis.KTA || { sites: {} });
  const AD_LABELS = /^(ad|ads|promoted|promocionado|anuncio|sponsorisé|sponsorizzato|gesponsert|patrocinado|publicidade|gesponsord|promowane|reklam|реклама|プロモーション|광고|推广|推廣)$/i;
  const REPOST_TEXT = /(repost|retwe|retuit|reposte|ha reposteado|han reposteado|a reposté|hat repostet|ha ripostato|repostou|heeft gerepost|udostępnił|yeniden gönderdi|сделал репост|さんがリポスト|님이 재게시|已转帖|已轉發)/i;
  let lastTabClick = 0;

  const isHome = () => location.pathname === '/home' || location.pathname === '/';

  function tabs() {
    const column = document.querySelector('[data-testid="primaryColumn"]');
    const tablist = column?.querySelector('[role="tablist"]');
    const list = tablist ? [...tablist.querySelectorAll('[role="tab"]')] : [];
    if (list.length < 2) return;
    const [forYou, following] = list; // en /home: 1.ª «Para ti», 2.ª «Siguiendo»
    if (following.getAttribute('aria-selected') !== 'true' && Date.now() - lastTabClick > 1500) {
      lastTabClick = Date.now();
      following.click();
    }
    KTA.hide(forYou.closest('[role="presentation"]') || forYou);
  }

  function isAd(article) {
    for (const span of article.querySelectorAll('span')) {
      if (span.childElementCount === 0 && AD_LABELS.test(span.textContent.trim())) return true;
    }
    return false;
  }

  KTA.sites.x = {
    key: 'x',
    match: (h) => /(^|\.)(x|twitter)\.com$/.test(h),
    reset() { lastTabClick = 0; },
    apply(s) {
      if (isHome()) tabs();
      for (const cell of document.querySelectorAll('[data-testid="primaryColumn"] [data-testid="cellInnerDiv"]')) {
        if (KTA.isHidden(cell)) continue;
        const article = cell.querySelector('article');
        if (article) {
          if (isAd(article)) { KTA.hide(cell); continue; }
          const ctx = article.querySelector('[data-testid="socialContext"]');
          if (isHome() && s.x_reposts && ctx && REPOST_TEXT.test(ctx.textContent)) { KTA.hide(cell); continue; }
        } else if (isHome() && cell.querySelector('[data-testid="UserCell"]')) {
          // Bloques «A quién seguir»: la celda, su cabecera y «Mostrar más»
          KTA.hide(cell);
          const prev = cell.previousElementSibling;
          if (prev && !prev.querySelector('article')) KTA.hide(prev);
          const next = cell.nextElementSibling;
          if (next && !next.querySelector('article, [data-testid="UserCell"]')) KTA.hide(next);
        }
      }
      // Barra lateral: tendencias y sugerencias de cuentas
      document.querySelectorAll('[data-testid="sidebarColumn"] section, [data-testid="sidebarColumn"] aside').forEach((b) => {
        if (b.querySelector('[data-testid="trend"], [data-testid="UserCell"]')) KTA.hide(b.parentElement || b);
      });
    }
  };
})();
