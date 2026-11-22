'use strict';
// Textos desde _locales. Los mensajes pueden llevar <strong> y <kbd>: se
// convierten a elementos de forma segura (sin innerHTML).
const t = (key) => chrome.i18n.getMessage(key) || '';

function fill(el, text) {
  el.textContent = '';
  const re = /<(strong|kbd)>(.*?)<\/\1>/g;
  let last = 0, m;
  while ((m = re.exec(text))) {
    if (m.index > last) el.append(text.slice(last, m.index));
    const tag = document.createElement(m[1]);
    tag.textContent = m[2];
    el.append(tag);
    last = re.lastIndex;
  }
  if (last < text.length) el.append(text.slice(last));
}

document.documentElement.lang = (chrome.i18n.getUILanguage() || 'es').split('-')[0];
document.title = t('extName');
document.querySelectorAll('[data-i18n]').forEach((el) => fill(el, t(el.dataset.i18n)));
document.getElementById('moreLink').href = t('moreUrl');
document.getElementById('moreLink').href = t('moreUrl');
document.getElementById('openOptions').addEventListener('click', (e) => { e.preventDefault(); chrome.runtime.openOptionsPage(); });
