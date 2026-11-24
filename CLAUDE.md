# Dezombify — contexto para Claude

Extensión de Chrome (Manifest V3) de **Gofio Design** (Juan Alberto). Lema: «Mata al algoritmo de tus redes sociales y trae a tus amigos de vuelta a casa, sanos y salvos» / *Kill the algorithm…*. Hace que cada red muestre solo lo que publican las cuentas que sigues: abre el feed «Siguiendo»/cronológico y oculta «Para ti», sugerencias, anuncios y contenido algorítmico.

- Antes se llamaba **«Solo Siguiendo para X»** (v1.0.0, solo X). La 2.0.0 es una **actualización del mismo ítem** de la Chrome Web Store (id `fhajebegoleecljdhfokiokejdkalhji`), no una extensión nueva (las extensiones duplicadas están prohibidas).
- Repo: https://github.com/GofioDesign/dezombify (antes `X-only-following`). Release v2.0.0 publicado con `dezombify-2.0.0.zip`.
- El usuario habla en **español**; responde en español.

## Estructura

```
extension/
  manifest.json      MV3, default_locale es, permisos: storage + host_permissions de las 9 redes
  common.js          núcleo: DEFAULTS, carga ajustes, MutationObserver + sondeo de URL (SPA), KTA.hide/isHidden/unhideAll, cuenta usos
  content.css        .kta-hidden { display:none !important }
  sites/<red>.js     un módulo por red, registrado en globalThis.KTA.sites
  background.js      installDate, bienvenida (instalación o update desde 1.x), insignia ★ de valoración
  popup/             popup.html|css|js: panel del icono y, con data-mode="full", la página de opciones
  options/           options.html (misma UI que el popup en modo completo)
  welcome/           pantalla de bienvenida (cómo fijar el icono)
  _locales/es|en     solo español e inglés por ahora
store/es|en          imágenes de la tienda; store/src/ tiene el HTML y scripts (playwright) que las generan
releases/            zips publicados
build.sh             genera dist/dezombify-<versión>.zip (archivos en la raíz del zip, si no Chrome dice «falta el manifiesto»)
CHROMEWEBSTORE.md    todos los campos de la ficha y de privacidad, listos para copiar
```

El prefijo interno `KTA` (de «Kill the Algorithm», nombre provisional) se queda: no es visible.

### Módulo de red

```js
KTA.sites.facebook = {
  key: 'fb',                       // prefijo de las opciones: fb_on, fb_shares…
  match: (hostname) => bool,
  early(settings) {},              // run_at document_start: redirecciones antes de pintar el feed
  apply(settings, { urlChanged }), // se llama en cada mutación del DOM (rAF) y cambio de URL
  reset() {}                       // opcional, al cambiar ajustes
};
```

Cada `content_scripts` del manifest carga `[sites/<red>.js, common.js]` + `content.css`.

### Añadir una opción
1. Valor por defecto en `DEFAULTS` de **common.js y popup/popup.js** (están duplicados).
2. Añadirla a `subs` de su red en `NETS` (popup.js).
3. Textos `<clave>` y `<clave>_hint` en `_locales/es` y `_locales/en`.
4. Usarla en `sites/<red>.js` (`if (s.clave) …`).

### Añadir una red
Módulo en `sites/`, host en `host_permissions` y `content_scripts`, entrada en `NETS`, `<key>_on` en DEFAULTS, textos, fila en README, y **actualizar la justificación de permisos de host** en CHROMEWEBSTORE.md.

## Preferencias del usuario (respetarlas)

- **«No queremos aturullar al usuario»:** en el panel solo salen las opciones de la red en la que estás (detecta la pestaña por `tab.url`, disponible gracias a los permisos de host). Fuera de una red, solo los interruptores principales. Todas las opciones juntas en la página de opciones.
- Una opción por red para lo que republican o comparten (reposts/shares) y la actividad.
- Logo: **jeringa cargada de corazones** (rosa `#ff5fa2` sobre `#17191d`); a 16 px va sin corazones. Fuente en `store/src/icon.svg` e `icon-16.svg`.
- Aviso de valoración **cada 5 usos reales**: un uso = abrir una red con la extensión activa, máximo uno cada 30 min (common.js `countUse`). Al llegar a múltiplo de 5, background pone una ★ en el icono y el panel muestra el aviso; desde la 3.ª vez sale «No volver a mostrar». Donación: como mucho una vez al año. Todo contado en local (`chrome.storage.local`) y explicado en PRIVACY.md.
- Enlace «Más extensiones · Apoya el proyecto» a https://gofiodesign.eu/extensiones.html (donaciones en paypal.me/gofiodesign).
- Cambios en la web gofiodesign.eu: siempre por PR en `GofioDesign/GofioDesign.github.io`.

## Detección por red (lo aprendido probando en vivo)

| Red | Feed | Notas |
|---|---|---|
| X | `/home` pestaña «Siguiendo» | reposts opcionales |
| YouTube | `/` → `/feed/subscriptions` | Shorts abiertos → `/watch?v=`; anuncios: `ytd-ad-slot-renderer`, `ytd-in-feed-ad-layout-renderer`, `ytd-search-pyv-renderer`, `#player-ads`… (ocultar el `ytd-rich-item-renderer` contenedor); vídeo: solo pulsa «Saltar» cuando aparece. **No** bloquear anuncios no saltables (YouTube detecta bloqueadores) |
| Instagram | `/?variant=following` | toda la página va dentro de un `<section>`: nunca usar `closest('section')` para ocultar bloques (dejó el feed en blanco en 2.0.0) |
| Facebook | `/?filter=all&sk=h_chr` (o `filter=friends`) | ver abajo |
| LinkedIn | — | oculta promocionados, sugeridos y posts con botón «Seguir a…» (autor no seguido) |
| TikTok | `/following` | `[data-e2e="feed-follow"]` = sugerencia |
| Threads | `/following` | |
| Bluesky | testid `followingFeedPage`; pestañas `homeScreenFeedTabs-selector-N` | |
| Twitch | `/directory/following` | barra lateral: `[role=group][aria-label]`; los encabezados son h3 |

### Facebook (lo más delicado)
- Publicaciones: `div[role="main"] [aria-posinset]`.
- **Anuncios:** un `aria-labelledby` que apunta a un texto «Publicidad»/«Sponsored»…, o un enlace de fecha cuyo texto es solo U+2060 (word joiner).
- **Compartidos:** Facebook ya no escribe «ha compartido»; mete el post original dentro, con su propia fecha. `timeLabels(post)` cuenta fechas **distintas** (agrupadas por altura, ±6 px) y si hay ≥2 es un compartido. Trampas resueltas:
  - cada fecha sale duplicada (enlace + span), por eso se agrupa por altura;
  - fechas en `aria-labelledby` («Hace 3 h») **y** en `aria-describedby` («martes, 3 de noviembre de 2026 a las 17:18»);
  - «hace un día» no tiene dígitos (TIME incluye «hace», «ago», «il y a»…);
  - los reels compartidos son un único enlace grande con la fecha en un `<span>` visible («21 nov.») → `DATE_TEXT`;
  - descartar textos alternativos de fotos («Puede ser una imagen de 2 personas»: >5 palabras sin año/hora) y duraciones de vídeo («2:36»);
  - excluir comentarios (`[role=article]` anidado).
- Los enlaces a webs que pone tu amigo (sin post de otra persona) **no** se ocultan: no son compartidos.
- FB virtualiza el feed: las publicaciones fuera de pantalla quedan vacías; al probar, hay que hacer scroll.

## Cómo probar

- En el Chrome del usuario: inyectar el código del módulo con la herramienta de JavaScript y **marcar con un contorno rojo en vez de ocultar**, luego capturas para verificar a ojo.
- UI (popup/opciones/bienvenida): playwright con `/usr/bin/google-chrome` y un stub de `chrome.*` (i18n desde `_locales`, `storage.sync/local`, `tabs.query` con la URL de la red). Ver `store/src/render_ui.py`.
- `bash build.sh` antes de entregar un zip.

## Chrome Web Store: normas que ya nos han tumbado algo

- **Keyword stuffing («Yellow Argon»):** nada de listas de marcas. La 2.0 se rechazó el 22-11-2026 por la frase que enumeraba las nueve redes; ahora la descripción no nombra ninguna (la lista va en README y en las opciones). Ni nombres de redes en el título ni en la descripción breve.
- Descripción breve ≤ 132 caracteres por idioma; descripción larga ≤ 16 000.
- Prohibido incentivar valoraciones (nada de «valora y desbloquea»). Duplicados prohibidos.
- Datos contados solo en local no cuentan como «recogidos»: en privacidad no se marca ninguna categoría.
- Cambiar el nombre o añadir permisos de host alarga la revisión.

## Entorno (sesiones en la nube de Claude)

- Los `git push` funcionan con las credenciales de `add_repo`; **`gh` no tiene token válido** y **subir etiquetas falla** por el proxy → los releases se crean desde el formulario web de GitHub (el usuario adjunta el zip y publica).
- Las herramientas del navegador no pueden abrir `chrome://` ni páginas de la Chrome Web Store.

## Pendiente

1. Revisión en la tienda: la 2.0.0 se reenvió tras quitar la lista de redes; la 2.0.1 arregla el feed en blanco de Instagram.
2. Traducir a los **15 idiomas** que tiene la otra extensión del usuario, IA → PDF (repo GofioDesign/AI-PDF, `tools/locales.py` sirve de modelo), y después la ficha y las imágenes por idioma.
3. Actualizar la página de la extensión en gofiodesign.eu (ES/EN/DE/FR) con el nuevo nombre, logo y capturas (por PR).
4. Posibles redes futuras, de momento descartadas por el usuario: Reddit, Tumblr, Pinterest, Medium, Substack.

## Modo demo (rama `claude/project-thread-4rp8fr`, no se publica en la tienda)
Ajuste `demo` (casilla «Modo demo (vídeo)» en el panel). No oculta, no redirige ni pulsa pestañas: tapa con `::after` lo que ocultaría. `KTA.hideAd(el)` → negro «ADS»; `KTA.hide(el)` → rojo «ALGORITHM». Los módulos comprueban `KTA.demo` antes de redirigir, reescribir enlaces o hacer clic. Funciona aunque la extensión esté apagada.
