// Kill the Algorithm — service worker
// Fecha de instalación (solo en local) para el aviso anual de donación, y bienvenida.
chrome.runtime.onInstalled.addListener(async ({ reason, previousVersion }) => {
  try {
    const { installDate } = await chrome.storage.local.get('installDate');
    if (!installDate) await chrome.storage.local.set({ installDate: Date.now() });
  } catch (err) { console.warn(err); }
  const fromV1 = reason === 'update' && /^1\./.test(previousVersion || '');
  if (reason === 'install' || fromV1) {
    try { await chrome.tabs.create({ url: chrome.runtime.getURL('welcome/welcome.html') }); } catch (err) { console.warn(err); }
  }
});
