// Kill the Algorithm — Facebook: Feeds cronológico (Todo o Amigos), sin anuncios
(() => {
  const KTA = (globalThis.KTA = globalThis.KTA || { sites: {} });
  const AD_WORDS = /^(publicidad|patrocinado|sponsored|sponsorisé|gesponsert|sponsorizzato|gesponsord|sponsorowane|sponsorlu|реклама|広告|광고|赞助内容|贊助)$/i;
  const WORD_JOINER = '⁠'; // Facebook lo pone en lugar de la fecha en los anuncios
  const SIDEBAR_SPONSORED = /^(patrocinado|publicidad|sponsored|sponsorisé|gesponsert|sponsorizzato|patrocinados)$/i;

  function feedUrl(s) {
    return `/?filter=${s.fb_friends ? 'friends' : 'all'}&sk=h_chr`;
  }

  function toFeeds(s) {
    const params = new URLSearchParams(location.search);
    if ((location.pathname === '/' || location.pathname === '/home.php') && params.get('sk') !== 'h_chr') {
      location.replace(feedUrl(s));
      return true;
    }
    return false;
  }

  // ¿Es un anuncio? 1) etiqueta para lectores de pantalla «Publicidad»
  //                 2) carácter invisible en el enlace donde iría la fecha
  function isAd(post) {
    for (const el of post.querySelectorAll('[aria-labelledby]')) {
      for (const id of el.getAttribute('aria-labelledby').split(' ')) {
        const ref = document.getElementById(id);
        if (ref && AD_WORDS.test(ref.textContent.trim())) return true;
      }
    }
    for (const a of [...post.querySelectorAll('a')].slice(0, 10)) {
      if (a.innerText.replace(/\s/g, '') === WORD_JOINER) return true;
    }
    return false;
  }

  KTA.sites.facebook = {
    key: 'fb',
    match: (h) => /(^|\.)facebook\.com$/.test(h) && !/^(business|developers|m)\./.test(h),
    early(s) { toFeeds(s); },
    apply(s, { urlChanged }) {
      if (urlChanged && toFeeds(s)) return;

      // Logo y botón de Inicio → Feeds
      document.querySelectorAll('a[href="/"], a[href="https://www.facebook.com/"]').forEach((a) => {
        a.setAttribute('href', feedUrl(s));
      });

      // Anuncios dentro del feed
      for (const post of document.querySelectorAll('div[role="main"] [aria-posinset]')) {
        if (KTA.isHidden(post) || !post.innerText.trim()) continue;
        if (isAd(post)) KTA.hide(post);
      }

      // Columna derecha: bloque «Patrocinado»
      document.querySelectorAll('[role="complementary"] h3, [role="complementary"] span').forEach((el) => {
        if (el.childElementCount === 0 && SIDEBAR_SPONSORED.test(el.textContent.trim())) {
          let box = el;
          for (let i = 0; i < 5 && box.parentElement && !box.parentElement.matches('[role="complementary"]'); i++) box = box.parentElement;
          KTA.hide(box);
        }
      });

      // Reels y Vídeo en los menús
      if (s.fb_reels) {
        document.querySelectorAll('a[href*="/reel/"], a[href$="/reels/"], a[href*="/watch/"]').forEach((a) => {
          if (a.closest('[role="navigation"], [role="banner"]')) KTA.hide(a.closest('li') || a);
        });
      }
    }
  };
})();
