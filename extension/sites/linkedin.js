// Dezombify — LinkedIn: solo publicaciones de quien sigues
(() => {
  const KTA = (globalThis.KTA = globalThis.KTA || { sites: {} });
  const PROMOTED = /^(promocionado|promoted|sponsorisé|gesponsert|promosso|patrocinado|promovido|gepromoot|promowane|tanıtılan|продвигается|プロモーション|광고|推广|推廣)\b/i;
  // Botón «Seguir a …» en la cabecera = autor que no sigues
  const FOLLOW_BTN = /^(seguir a |follow |suivre |folgen|segui |volgen|obserwuj|takip et|подписаться|フォロー|팔로우|关注|關注)/i;
  const SUGGESTED = /^(sugerido|suggested|suggéré|vorgeschlagen|suggerito|sugerido|voorgesteld|sugerowane|önerilen|рекомендуется|おすすめ|추천|推荐|推薦|recomendado para ti|recommended for you)$/i;
  // «A X le gusta esto», «X ha comentado esto»…
  const ACTIVITY = /(le gusta esto|les gusta esto|ha comentado|han comentado|le encanta|celebra esto|apoya esto|likes this|like this|commented on this|loves this|celebrates this|supports this|finds this|aime ça|a commenté|gefällt das|hat kommentiert|piace questo|ha commentato|gostou|comentou|vindt dit|heeft gereageerd|lubi to|skomentował|beğendi|yorum yaptı|нравится|прокомментировал)/i;

  // «X ha compartido esto», «X reposted this»
  const REPOST = /(ha compartido esto|han compartido esto|ha republicado|reposted this|reposted|a republié|a partagé ceci|hat das geteilt|hat reposted|ha ripubblicato|republicou|compartilhou isto|heeft dit gedeeld|udostępnił|yeniden paylaştı|поделился)/i;

  function posts() {
    const feed = document.querySelector('[data-testid="mainFeed"]');
    if (feed) return [...feed.children];
    return [...document.querySelectorAll('.feed-shared-update-v2, [data-urn^="urn:li:activity"], [data-id^="urn:li:activity"]')];
  }

  KTA.sites.linkedin = {
    key: 'li',
    match: (h) => /(^|\.)linkedin\.com$/.test(h),
    apply(s) {
      if (!location.pathname.startsWith('/feed')) return;
      for (const post of posts()) {
        if (KTA.isHidden(post)) continue;
        const head = KTA.leafTexts(post, 40);
        if (!head.length) continue;
        const promoted = head.some((t) => PROMOTED.test(t));
        const suggested = head.slice(0, 6).some((t) => SUGGESTED.test(t));
        const notFollowed = [...post.querySelectorAll('button[aria-label]')].slice(0, 4)
          .some((b) => FOLLOW_BTN.test(b.getAttribute('aria-label').trim()));
        const activity = s.li_activity && head.slice(0, 4).some((t) => ACTIVITY.test(t));
        const repost = s.li_reposts && head.slice(0, 4).some((t) => REPOST.test(t));
        if (promoted || suggested || notFollowed || activity || repost) KTA.hide(post);
      }
      // Barra lateral: «Añadir a tu feed» y noticias recomendadas
      document.querySelectorAll('aside section, aside [data-view-name]').forEach((box) => {
        if (/añadir a tu feed|add to your feed|ajouter à votre fil|zu ihrem feed hinzufügen|linkedin noticias|linkedin news/i.test(box.textContent)) KTA.hide(box);
      });
    }
  };
})();
