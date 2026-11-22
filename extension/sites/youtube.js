// Kill the Algorithm — YouTube: solo Suscripciones
// Selectores de referencia: Escape the Algorithm (MIT, © 2025 Ernest Wolfe), adaptados.
(() => {
  const KTA = (globalThis.KTA = globalThis.KTA || { sites: {} });
  let autoplayDone = '';

  const SHORTS_SHELVES = 'ytd-rich-shelf-renderer[is-shorts], ytd-reel-shelf-renderer, grid-shelf-view-model';

  function toSubscriptions() {
    if (location.pathname === '/' ) location.replace('/feed/subscriptions');
  }

  KTA.sites.youtube = {
    key: 'yt',
    match: (h) => /(^|\.)youtube\.com$/.test(h) && !/^(music|studio|tv)\./.test(h),
    reset() { autoplayDone = ''; },
    early() { toSubscriptions(); },
    apply(s, { urlChanged }) {
      // Inicio (algorítmico) → Suscripciones
      if (urlChanged) toSubscriptions();
      const path = location.pathname;

      // Menú lateral: ocultar «Inicio» y «Explorar»/«Tendencias»; Shorts si procede
      document.querySelectorAll('ytd-guide-entry-renderer a, ytd-mini-guide-entry-renderer a').forEach((a) => {
        const href = a.getAttribute('href') || '';
        const entry = a.closest('ytd-guide-entry-renderer, ytd-mini-guide-entry-renderer');
        if (href === '/' || href.startsWith('/feed/trending') || href.startsWith('/feed/explore')) KTA.hide(entry);
        if (s.yt_shorts && href.startsWith('/shorts')) KTA.hide(entry);
      });
      // Logo: que lleve a Suscripciones y no a Inicio
      document.querySelectorAll('a#logo, ytd-topbar-logo-renderer a').forEach((a) => {
        if (a.getAttribute('href') === '/') a.setAttribute('href', '/feed/subscriptions');
      });

      if (s.yt_shorts) {
        // Un Short abierto se ve como vídeo normal
        const m = path.match(/^\/shorts\/([\w-]{6,})/);
        if (m) { location.replace(`/watch?v=${m[1]}`); return; }
        document.querySelectorAll(SHORTS_SHELVES).forEach((el) => KTA.hide(el.closest('ytd-rich-section-renderer') || el));
        document.querySelectorAll('ytd-rich-item-renderer a[href^="/shorts/"], ytd-video-renderer a[href^="/shorts/"], ytd-grid-video-renderer a[href^="/shorts/"]').forEach((a) => {
          KTA.hide(a.closest('ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer'));
        });
      }

      if (path === '/watch') {
        if (s.yt_related) {
          document.querySelectorAll('#related, ytd-watch-next-secondary-results-renderer').forEach(KTA.hide);
          document.querySelectorAll('.ytp-endscreen-content, .ytp-ce-element, .ytp-suggestion-set').forEach(KTA.hide);
        }
        if (s.yt_autoplay && autoplayDone !== location.href) {
          const t = document.querySelector('.ytp-autonav-toggle-button');
          if (t) {
            if (t.getAttribute('aria-checked') === 'true') t.click();
            autoplayDone = location.href;
          }
        }
      }
    }
  };
})();
