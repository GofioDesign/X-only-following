// Kill the Algorithm — Facebook: Feeds cronológico (Todo o Amigos), sin anuncios
(() => {
  const KTA = (globalThis.KTA = globalThis.KTA || { sites: {} });
  const AD_WORDS = /^(publicidad|patrocinado|sponsored|sponsorisé|gesponsert|sponsorizzato|gesponsord|sponsorowane|sponsorlu|реклама|広告|광고|赞助内容|贊助)$/i;
  const WORD_JOINER = '⁠'; // Facebook lo pone en lugar de la fecha en los anuncios
  // «X ha compartido una publicación»
  const SHARED = /(ha compartido|han compartido|shared a |shared an |a partagé|hat .* geteilt|ha condiviso|compartilhou|partilhou|heeft .* gedeeld|udostępnił|paylaştı|поделил)/i;
  // «X y Y siguen a…», «A X le gusta…», «X ha comentado…» (lo elige el algoritmo)
  const ACTIVITY = /(\bsiguen a\b|\bsigue a\b|le gusta|les gusta|ha comentado|han comentado|\bfollows?\b|\blikes?\b this|commented on|suivent|aime|folgen|gefällt|seguono|piace|seguem|curtiu|volgen|vind|obserwują|takip ediyor|подписаны)/i;
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

  // Fechas relativas («Hace 3 h», «4 h», «Yesterday»…) a las que apuntan las etiquetas accesibles.
  // Una publicación compartida lleva dos: la de quien comparte y la del original incrustado.
  const TIME = /(\d|ayer|yesterday|hier|gestern|ieri|ontem|gisteren|wczoraj|dün|вчера|昨日|어제|昨天|hace |\bago\b|il y a|\bvor |\bfa$|há |geleden|temu|önce|назад|前|전)/i;
  // Cuenta las fechas distintas, fuera de los comentarios (role=article anidado) y agrupando
  // las que están a la misma altura (cada fecha aparece en varios nodos).
  const DATE_TEXT = /^(\d{1,2}\s?(min|h|d|sem|w|m|j|t|g|std|hr|hrs|mins?)\.?|\d{1,2}\s\p{L}{3,5}\.?(\s\d{4})?|\p{L}{3,5}\.?\s\d{1,2}(,\s\d{4})?|ayer|yesterday)$/iu;
  function timeLabels(post) {
    const ys = [];
    // 1) elementos con etiqueta accesible de fecha; 2) los reels incrustados son un único enlace
    //    grande y la fecha va como texto visible («21 nov.», «2 d») en un <span> dentro de él
    const cands = [...post.querySelectorAll('[aria-labelledby], a span')];
    for (const el of cands) {
      const art = el.closest('[role="article"]');
      if (art && art !== post && post.contains(art)) continue;
      if (el.hasAttribute('aria-labelledby')) {
        const txt = el.getAttribute('aria-labelledby').split(' ')
          .map((id) => (document.getElementById(id)?.textContent || '').trim()).join(' ');
        // fechas cortas (≤5 palabras, o con hora «a las 13:42»): descarta textos alternativos de fotos con números
        if (!txt || txt.length >= 40 || (txt.split(/\s+/).length > 5 && !/\d:\d\d/.test(txt)) || !TIME.test(txt) || AD_WORDS.test(txt)) continue;
      } else {
        if (el.childElementCount) continue;
        const txt = el.textContent.trim();
        if (!txt || txt.length > 16 || !DATE_TEXT.test(txt)) continue;
      }
      const y = el.getBoundingClientRect().top;
      if (!ys.some((v) => Math.abs(v - y) < 6)) ys.push(y);
    }
    return ys.length;
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
        if (isAd(post)) { KTA.hide(post); continue; }
        const head = post.innerText.split('\n').map((t) => t.trim()).filter((t) => t && t !== 'Facebook').slice(0, 3).join(' ');
        if (s.fb_activity && ACTIVITY.test(head.slice(0, 160))) { KTA.hide(post); continue; }
        if (s.fb_shares && (timeLabels(post) >= 2 || SHARED.test(head.slice(0, 160)))) KTA.hide(post);
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
