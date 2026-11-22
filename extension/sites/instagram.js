// Dezombify — Instagram: feed «Siguiendo» (cronológico)
// Idea de usar /?variant=following tomada de Escape the Algorithm (MIT, © 2025 Ernest Wolfe).
(() => {
  const KTA = (globalThis.KTA = globalThis.KTA || { sites: {} });
  const FOR_YOU = /^(para ti|for you|pour vous|für dich|per te|voor jou|dla ciebie|senin için|для вас|おすすめ|추천|为你推荐|為你推薦|para você)$/i;
  const SUGGESTED = /^(sugerencias para ti|suggested for you|suggestions pour vous|vorschläge für dich|suggeriti per te|sugestões para você|voorgesteld voor jou|propozycje dla ciebie|senin için öneriler|рекомендации для вас|おすすめ|회원님을 위한 추천|为你推荐|為你推薦|publicaciones sugeridas|suggested posts)$/i;

  const REPOST = /(ha republicado|republicó|reposted|a republié|hat reposted|ha ripubblicato|republicou|heeft opnieuw geplaatst|udostępnił ponownie|yeniden paylaştı|сделал репост)/i;

  function toFollowing(s) {
    const p = location.pathname;
    const variant = new URLSearchParams(location.search).get('variant');
    if ((p === '/' || p === '') && variant !== 'following' && variant !== 'favorites') {
      location.replace('/?variant=following');
      return true;
    }
    if (s.ig_explore && (p === '/explore/' || p === '/explore' || p === '/reels/' || p === '/reels')) {
      location.replace('/?variant=following');
      return true;
    }
    return false;
  }

  KTA.sites.instagram = {
    key: 'ig',
    match: (h) => /(^|\.)instagram\.com$/.test(h),
    early(s) { toFollowing(s); },
    apply(s, { urlChanged }) {
      if (urlChanged && toFollowing(s)) return;

      // Pestaña «Para ti» del inicio
      document.querySelectorAll('[role="tab"]').forEach((tab) => {
        if (FOR_YOU.test(tab.textContent.trim())) KTA.hide(tab);
      });
      // Enlaces del menú que llevan al inicio algorítmico: forzar el feed «Siguiendo»
      document.querySelectorAll('a[href="/"]').forEach((a) => a.setAttribute('href', '/?variant=following'));

      if (s.ig_explore) {
        // Menú lateral: ocultar Explorar y Reels
        document.querySelectorAll('a[href="/explore/"], a[href="/reels/"]').forEach((a) => KTA.hide(a));
      }

      // Reposts de cuentas que sigues
      if (s.ig_reposts) {
        document.querySelectorAll('main article').forEach((art) => {
          if (KTA.isHidden(art)) return;
          if (KTA.leafTexts(art, 8).some((t) => REPOST.test(t))) KTA.hide(art);
        });
      }

      // Bloques de sugerencias (cuentas o publicaciones sugeridas)
      document.querySelectorAll('span, h4, div').forEach((el) => {
        if (el.childElementCount === 0 && SUGGESTED.test(el.textContent.trim())) {
          const box = el.closest('article') || el.closest('section') || el.parentElement?.parentElement?.parentElement;
          if (box && !box.matches('main, body, html')) KTA.hide(box);
        }
      });
    }
  };
})();
