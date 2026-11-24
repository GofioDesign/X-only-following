// Dezombify — Instagram: feed «Siguiendo» (cronológico)
// Idea de usar /?variant=following tomada de Escape the Algorithm (MIT, © 2025 Ernest Wolfe).
(() => {
  const KTA = (globalThis.KTA = globalThis.KTA || { sites: {} });
  const FOR_YOU = /^(para ti|for you|pour vous|für dich|per te|voor jou|dla ciebie|senin için|для вас|おすすめ|추천|为你推荐|為你推薦|para você)$/i;
  const SUGGESTED = /^(sugerencias para ti|suggested for you|suggestions pour vous|vorschläge für dich|suggeriti per te|sugestões para você|voorgesteld voor jou|propozycje dla ciebie|senin için öneriler|рекомендации для вас|おすすめ|회원님을 위한 추천|为你推荐|為你推薦|publicaciones sugeridas|suggested posts)$/i;

  const AD = /^(publicidad|patrocinado|sponsored|sponsorisé|gesponsert|sponsorizzato|gesponsord|sponsorowane|sponsorlu|реклама|広告|광고|赞助内容|贊助)$/i;
  const REPOST = /(ha republicado|republicó|reposted|a republié|hat reposted|ha ripubblicato|republicou|heeft opnieuw geplaatst|udostępnił ponownie|yeniden paylaştı|сделал репост)/i;

  // Contenedor del bloque de sugerencias: el article que lo contiene o, si no hay,
  // subir como mucho 3 niveles sin llegar a nada que contenga el feed. Antes se usaba
  // closest('section'), y Instagram envuelve ahora toda la página (main incluido) en
  // un <section>: al ver «Sugerencias para ti» en la barra lateral se ocultaba todo.
  const FEED = 'main, article, [role="tab"], [role="tablist"]';
  function suggestionBox(el) {
    const art = el.closest('article');
    if (art) return art;
    let n = el;
    for (let i = 0; i < 3 && n.parentElement; i++) {
      const p = n.parentElement;
      if (p.matches('main, body, html') || p.querySelector(FEED)) break;
      n = p;
    }
    return n === el ? null : n;
  }

  function toFollowing(s) {
    if (KTA.demo) return false;
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
      document.querySelectorAll('a[href="/"]').forEach((a) => { if (!KTA.demo) a.setAttribute('href', '/?variant=following'); });

      if (s.ig_explore) {
        // Menú lateral: ocultar Explorar y Reels
        document.querySelectorAll('a[href="/explore/"], a[href="/reels/"]').forEach((a) => KTA.hide(a));
      }

      // Publicaciones patrocinadas («Publicidad» bajo el nombre de la cuenta)
      document.querySelectorAll('main article').forEach((art) => {
        if (!KTA.isHidden(art) && KTA.leafTexts(art, 12).some((t) => AD.test(t))) KTA.hideAd(art);
      });

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
          const box = suggestionBox(el);
          if (box) KTA.hide(box);
        }
      });
    }
  };
})();
