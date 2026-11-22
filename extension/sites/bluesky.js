// Dezombify — Bluesky: solo «Siguiendo»
(() => {
  const KTA = (globalThis.KTA = globalThis.KTA || { sites: {} });
  const FOLLOWING = /^(siguiendo|following|abonnements|folge ich|seguiti|seguindo|volgend|obserwowani|takip edilenler|подписки|フォロー中|팔로우 중|关注|關注)$/i;
  const REPOST = /^(republicado por|reposted by|reposté par|repostet von|ripubblicato da|repostado por|gerepost door|udostępnione przez|yeniden paylaşan|репост от)/i;
  let lastClick = 0;

  function homeTabs() {
    return [...document.querySelectorAll('[data-testid^="homeScreenFeedTabs-selector-"]')]
      .filter((t) => /-selector-\d+$/.test(t.dataset.testid));
  }

  KTA.sites.bluesky = {
    key: 'bs',
    match: (h) => /(^|\.)bsky\.app$/.test(h),
    reset() { lastClick = 0; },
    apply(s) {
      const isHome = location.pathname === '/' || location.pathname === '/home';
      if (isHome) {
        const tabs = homeTabs();
        const following = tabs.find((t) => FOLLOWING.test(t.innerText.trim()));
        if (following) {
          // Otras pestañas (Discover, Video, feeds algorítmicos): fuera
          tabs.forEach((t) => { if (t !== following) KTA.hide(t); });
          const onFollowing = [...document.querySelectorAll('[data-testid="followingFeedPage"]')].some((e) => e.offsetParent !== null);
          if (!onFollowing && Date.now() - lastClick > 2000) { lastClick = Date.now(); following.click(); }
        }
      }

      if (s.bs_reposts) {
        for (const item of document.querySelectorAll('[data-testid^="feedItem-by-"]')) {
          if (KTA.isHidden(item)) continue;
          const first = (item.innerText || '').split('\n')[0].trim();
          if (REPOST.test(first)) KTA.hide(item);
        }
      }
    }
  };
})();
