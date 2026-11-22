const DEFAULTS = {
  enabled: true,
  forceFollowing: true,
  hideForYou: true,
  hideAds: true,
  hideReposts: false,
  hideSuggestions: true
};

const inputs = document.querySelectorAll('input[data-key]');
const options = document.getElementById('options');

function refreshState(settings) {
  options.classList.toggle('off', !settings.enabled);
}

async function init() {
  try {
    const settings = await chrome.storage.sync.get(DEFAULTS);
    inputs.forEach(input => { input.checked = !!settings[input.dataset.key]; });
    refreshState(settings);
  } catch (err) {
    console.error('No se pudieron cargar los ajustes', err);
  }
}

inputs.forEach(input => {
  input.addEventListener('change', async () => {
    try {
      await chrome.storage.sync.set({ [input.dataset.key]: input.checked });
      const settings = await chrome.storage.sync.get(DEFAULTS);
      refreshState(settings);
    } catch (err) {
      console.error('No se pudo guardar el ajuste', err);
    }
  });
});

init();
