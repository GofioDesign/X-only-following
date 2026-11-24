// Dezombify — Threads: solo «Seguidos»
(() => {
  const KTA = (globalThis.KTA = globalThis.KTA || { sites: {} });
  const REPOST = /(lo reposteó|lo republicó|reposted|a reposté|hat reposted|ha ripubblicato|repostou|heeft gerepost|udostępnił|yeniden paylaştı|сделал репост|さんがリポスト|님이 리포스트|转发了|轉發了)/i;
  const AD = /^(publicidad|patrocinado|sponsored|sponsorisé|gesponsert|sponsorizzato|gesponsord|sponsorowane|sponsorlu|реклама|広告|광고|广告|廣告)$/i;
  const SUGGEST = /^(sugerencias para seguir|suggested for you|suggestions pour vous|vorschläge für dich|suggeriti per te|sugestões para você|voorgesteld voor jou|propozycje dla ciebie|senin için öneriler|рекомендации для вас)$/i;

  function toFollowing() {
    if (KTA.demo) return false;
    const p = location.pathname;
    if (p === '/' || p.startsWith('/for_you')) { location.replace('/following'); return true; }
    return false;
  }

  KTA.sites.threads = {
    key: 'th',
    match: (h) => /(^|\.)threads\.(com|net)$/.test(h),
    early() { toFollowing(); },
    apply(s, { urlChanged }) {
      if (urlChanged && toFollowing()) return;

      // Logo / Inicio → Seguidos; fuera los accesos a «Para ti»
      document.querySelectorAll('a[href="/"]').forEach((a) => { if (!KTA.demo) a.setAttribute('href', '/following'); });
      document.querySelectorAll('a[href^="/for_you"]').forEach((a) => KTA.hide(a));

      for (const post of document.querySelectorAll('[data-pressable-container="true"]')) {
        if (KTA.isHidden(post)) continue;
        const head = KTA.leafTexts(post, 8);
        if (head.some((t) => AD.test(t))) { KTA.hideAd(post); continue; }
        if (s.th_reposts && head.slice(0, 4).some((t) => REPOST.test(t))) KTA.hide(post);
      }

      // Carruseles de «Sugerencias para seguir»
      document.querySelectorAll('span, h2, div').forEach((el) => {
        if (el.childElementCount === 0 && SUGGEST.test(el.textContent.trim())) {
          let box = el;
          for (let i = 0; i < 6 && box.parentElement && !box.parentElement.matches('body, main, [role="main"]'); i++) box = box.parentElement;
          KTA.hide(box);
        }
      });
    }
  };
})();
