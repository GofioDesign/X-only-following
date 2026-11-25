# Chrome Web Store — Dezombify

> Última actualización: 2026-11-24 · Versión 2.1.0 (actualización del ítem «Solo Siguiendo para X», id `fhajebegoleecljdhfokiokejdkalhji`)

Paquete a subir: `releases/dezombify-2.1.0.zip` (también en el release v2.1.0 de GitHub).
Idiomas del paquete: español (predeterminado) e inglés.

---

## 1. Paquete → «Package»

Sube `dezombify-2.1.0.zip` como nueva versión. El nombre y la descripción breve salen del manifest:

- **Nombre:** `Dezombify`
- **Descripción breve (es, 127 caracteres):** Mata al algoritmo de tus redes sociales y trae a tus amigos de vuelta a casa, sanos y salvos: solo lo que publica quien sigues.
- **Descripción breve (en, 127 caracteres):** Kill the algorithm of your social networks and bring your friends back home, safe and sound: only posts from people you follow.

---

## 2. Ficha → «Store listing»

**Categoría:** Social Networking (Redes sociales)
**Idioma principal:** Español

### Descripción — Español

```
Dezombify mata al algoritmo de tus redes sociales y trae a tus amigos de vuelta a casa, sanos y salvos.

Las redes ya no te enseñan lo que publica la gente que sigues: te llenan el inicio de «Para ti», sugerencias, vídeos virales y anuncios para que sigas haciendo scroll. Dezombify devuelve tu inicio a lo que de verdad elegiste seguir.

Funciona en las principales redes sociales y plataformas de vídeo. La lista completa de sitios compatibles está en la página de opciones de la extensión y en https://github.com/GofioDesign/dezombify.

QUÉ HACE
• Abre siempre el feed de quien sigues (Siguiendo, Suscripciones o el cronológico de amigos) en lugar del algorítmico.
• Oculta las pestañas «Para ti», las sugerencias de cuentas, las tendencias y las publicaciones promocionadas.
• Opcional, en cada red: ocultar lo que tus contactos republican o comparten, la actividad («A X le gusta…», «X y Y siguen a…»), Reels, Shorts y vídeos recomendados.
• En YouTube puede ocultar los anuncios gráficos y pulsar «Saltar» en los anuncios de vídeo en cuanto se permite.

OPCIONES SIN LÍOS
Al abrir el panel ves solo las opciones de la red en la que estás. Todas las demás están juntas en la página de opciones. Los cambios se aplican al momento, sin recargar.

PRIVACIDAD
Dezombify no recoge, envía ni vende ningún dato. Todo ocurre en tu navegador: tus preferencias se guardan en el almacenamiento de Chrome y solo se cuentan en local tus estadísticas de uso (tiempo, anuncios y algoritmo ocultados), para enseñártelas y para pedirte de vez en cuando una valoración. Sin cuentas, sin analítica, sin servidores.

GRATIS Y DE CÓDIGO ABIERTO
Código fuente: https://github.com/GofioDesign/dezombify
Más extensiones y donaciones voluntarias: https://gofiodesign.eu/extensiones.html

Funciona en el navegador del ordenador; no cambia las apps del móvil.
```

### Description — English

```
Dezombify kills the algorithm of your social networks and brings your friends back home, safe and sound.

Social networks no longer show you what the people you follow post: they fill your home feed with “For you”, suggestions, viral videos and ads to keep you scrolling. Dezombify brings your feed back to what you actually chose to follow.

It works on the major social networks and video platforms. The full list of supported sites is on the extension's options page and at https://github.com/GofioDesign/dezombify.

WHAT IT DOES
• Always opens the feed of people you follow (Following, Subscriptions or the chronological friends feed) instead of the algorithmic one.
• Hides “For you” tabs, account suggestions, trends and promoted posts.
• Optional, per network: hide what your contacts repost or share, activity (“X likes this”, “X and Y follow…”), Reels, Shorts and recommended videos.
• On YouTube it can hide display ads and press “Skip” on video ads as soon as it is allowed.

NO CLUTTER
The panel only shows the options for the network you are on. Everything else is together on the options page. Changes apply instantly, no reload needed.

PRIVACY
Dezombify does not collect, send or sell any data. Everything happens in your browser: your preferences are stored in Chrome storage and only local usage statistics are kept (time, ads and algorithmic content hidden), to show them to you and to occasionally ask for a rating. No accounts, no analytics, no servers.

FREE AND OPEN SOURCE
Source code: https://github.com/GofioDesign/dezombify
More extensions and voluntary donations: https://gofiodesign.eu/extensiones.html

Works in the desktop browser; it does not change mobile apps.
```

> **No enumerar las redes en la descripción.** El 22-11-2026 Google rechazó la 2.0 por «keyword stuffing» (referencia *Yellow Argon*) por la frase que listaba las nueve redes. La lista completa va en el README y en la página de opciones, no en la ficha. Tampoco pongas nombres de redes en el título ni en la descripción breve.

### Recursos gráficos (`store/es` y `store/en`)

| Campo | Archivo |
|---|---|
| Icono de la tienda (128×128) | `extension/icons/icon-128.png` |
| Capturas (1280×800) | `1-captura` … `4-captura-1280x800.png` |
| Mosaico pequeño (440×280) | `mosaico-pequeno-440x280.png` |
| Mosaico marquesina (1400×560) | `mosaico-marquesina-1400x560.png` |

Sube las de `store/es` en la ficha española y las de `store/en` en la inglesa.

### Enlaces

- **URL oficial:** https://gofiodesign.eu
- **Página principal:** https://github.com/GofioDesign/dezombify
- **Soporte:** https://github.com/GofioDesign/dezombify/issues

---

## 3. Privacidad → «Privacy practices»

**Propósito único**
```
Dezombify makes supported social networks show only posts from accounts the user follows: it opens the "Following"/chronological feed instead of the algorithmic one and hides suggested content, promoted posts and other algorithmic recommendations, with per-network options.
```

**Justificación de `storage`**
```
Stores the user's on/off settings for each social network (chrome.storage.sync) and, locally only, the install date and usage statistics (use count, minutes per network, number of ads and algorithmic items hidden) used to show the user their own statistics page and occasional rating and donation invitations. Nothing is transmitted.
```

**Justificación de los permisos de host**
```
The extension needs access to x.com, twitter.com, youtube.com, instagram.com, facebook.com, linkedin.com, tiktok.com, threads.com/threads.net, bsky.app and twitch.tv to run its content scripts on those sites only: redirect the home page to the feed of followed accounts and hide algorithmic, suggested and promoted elements in the page. It does not read, store or send page content or personal data. It runs on no other website.
```

**Código remoto:** No, no uso código remoto.

**Uso de datos:** no marcar ninguna categoría. Marcar las tres certificaciones:
- No vendo ni transfiero datos de usuario a terceros, salvo en los casos de uso aprobados.
- No uso ni transfiero datos de usuario para fines no relacionados con el propósito único del elemento.
- No uso ni transfiero datos de usuario para determinar la solvencia crediticia ni para conceder préstamos.

**URL de la política de privacidad**
```
https://github.com/GofioDesign/dezombify/blob/main/PRIVACY.md
```

---

## Historial de versiones

| Versión | Fecha | Cambios |
|---|---|---|
| 2.1.0 | 2026-11-24 | Traducida a 15 idiomas. Página de Estadísticas (tiempo, anuncios y algoritmo ocultados por red). Invitación a donar a los 20 usos y luego una vez al año con el resumen; «Recuérdamelo el próximo año» en valoración y donación. |
| 2.0.2 | 2026-11-24 | Opción «Ver lo que se omite» (tapa anuncios con ADS y lo algorítmico con ALGORITHM). X: oculta «Suscríbete a Premium» y «En directo en X». Instagram: oculta publicaciones patrocinadas. |
| 2.0.1 | 2026-11-24 | Instagram: el feed salía en blanco (se ocultaba toda la página al detectar «Sugerencias para ti»). |
| 2.0.0 | 2026-11-22 | Rechazada una vez por la lista de redes en la descripción (corregido). Pasa a llamarse Dezombify. Nueve redes sociales, opciones por red, anuncios de YouTube, nuevo logo, bienvenida, aviso de valoración cada 5 usos. |
| 1.0.0 | 2026-11 | «Solo Siguiendo para X»: solo X. |
