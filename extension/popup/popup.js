// Kill the Algorithm — panel de ajustes
const DEFAULTS = {
  enabled: true,
  x_on: true, x_reposts: false,
  yt_on: true, yt_shorts: true, yt_related: true, yt_autoplay: true,
  ig_on: true, ig_explore: true,
  li_on: true, li_activity: false,
  fb_on: true, fb_friends: false, fb_reels: true,
  tt_on: true, tt_explore: true
};

document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = chrome.i18n.getMessage(el.dataset.i18n) || ''; });
const inputs = document.querySelectorAll('input[data-key]');

function refresh(s) {
  document.getElementById('options').classList.toggle('off', !s.enabled);
  document.querySelectorAll('.sub[data-parent]').forEach((row) => row.classList.toggle('off', !s[row.dataset.parent]));
}

(async () => {
  try {
    const s = await chrome.storage.sync.get(DEFAULTS);
    inputs.forEach((i) => { i.checked = !!s[i.dataset.key]; });
    refresh(s);
  } catch (err) { console.error(err); }
})();

inputs.forEach((i) => i.addEventListener('change', async () => {
  try {
    await chrome.storage.sync.set({ [i.dataset.key]: i.checked });
    refresh(await chrome.storage.sync.get(DEFAULTS));
  } catch (err) { console.error(err); }
}));
