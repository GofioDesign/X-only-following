// Kill the Algorithm — Twitch: solo «Siguiendo»
(() => {
  const KTA = (globalThis.KTA = globalThis.KTA || { sites: {} });
  const RECOMMENDED = /^(canales recomendados|recommended channels|chaînes recommandées|empfohlene kanäle|canali consigliati|canais recomendados|aanbevolen kanalen|polecane kanały|önerilen kanallar|рекомендуемые каналы|おすすめチャンネル|추천 채널|推荐频道|推薦頻道|categorías recomendadas|recommended categories)$/i;
  const FOR_YOU = /^(para ti|for you|pour vous|für dich|per te|voor jou|dla ciebie|senin için|для вас|おすすめ|추천|为你推荐|為你推薦)$/i;
  const FOLLOWED = /(seguid|followed|suivies|gefolgt|seguiti|gevolgd|obserwowan|takip edilen|отслеживаемые|フォロー中|팔로우|关注|關注)/i;

  function toFollowing() {
    if (location.pathname === '/') { location.replace('/directory/following'); return true; }
    return false;
  }

  // Sube desde un título hasta el bloque que lo contiene junto a su contenido
  function sectionOf(el) {
    let n = el;
    for (let i = 0; i < 7 && n.parentElement; i++) {
      n = n.parentElement;
      if (n.children.length >= 2 && !n.matches('main, section[aria-label], body')) return n;
    }
    return null;
  }

  KTA.sites.twitch = {
    key: 'tw',
    match: (h) => /(^|\.)twitch\.tv$/.test(h) && !/^(dashboard|dev|help|safety)\./.test(h),
    early() { toFollowing(); },
    apply(s, { urlChanged }) {
      if (urlChanged && toFollowing()) return;

      // Inicio (recomendaciones) → Siguiendo
      document.querySelectorAll('a[data-a-target="home-link"], a[href="/"]').forEach((a) => a.setAttribute('href', '/directory/following'));
      document.querySelectorAll('a[data-a-target="home-link"]').forEach((a) => { if (a.closest('nav')) KTA.hide(a.closest('[class*="navigation-link"]') || a); });
      if (s.tw_browse) document.querySelectorAll('a[data-a-target="browse-link"]').forEach((a) => KTA.hide(a.parentElement?.matches('div') ? a.parentElement : a));

      // Secciones de recomendados dentro de las páginas
      document.querySelectorAll('main h2, main h3').forEach((h) => {
        if (RECOMMENDED.test(h.textContent.trim())) { const sec = sectionOf(h); if (sec) KTA.hide(sec); }
      });

      // Barra lateral: solo «Canales seguidos»
      const side = document.querySelector('nav[aria-label] [role="group"]')?.closest('nav');
      if (side) {
        side.querySelectorAll('[role="group"][aria-label]').forEach((g) => {
          if (!FOLLOWED.test(g.getAttribute('aria-label'))) KTA.hide(g);
        });
        side.querySelectorAll('h2, h3').forEach((h) => { if (FOR_YOU.test(h.textContent.trim())) KTA.hide(h.closest('p, div') || h); });
      }
    }
  };
})();
