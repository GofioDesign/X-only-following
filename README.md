# Dezombify

**Solo lo que sigues.** Extensión de Chrome que quita el feed algorítmico de tus redes sociales y te deja ver únicamente lo que publican las cuentas que sigues.

> Versión 2.0 de «Solo Siguiendo para X», ampliada a más redes.

## Qué hace en cada red

| Red | Qué cambia |
|---|---|
| **X** | Abre siempre «Siguiendo»; oculta «Para ti», anuncios, «A quién seguir» y tendencias. Opcional: ocultar reposts. |
| **YouTube** | Inicio abre **Suscripciones**; oculta Inicio y Explorar del menú. Opcional (activado): ocultar Shorts (los que abras se ven como vídeo normal), vídeos recomendados y pantalla final, y desactivar la reproducción automática. |
| **Instagram** | Inicio abre el feed cronológico **Seguidos**; oculta la pestaña «Para ti» y las sugerencias. Opcional (activado): ocultar Explorar y Reels. |
| **Facebook** | Inicio abre **Feeds → Todo**: el cronológico de amigos, grupos y páginas que sigues. Oculta los **anuncios** (también los de «X amigos siguen a…»). Opcional: solo amigos; ocultar Reels y Vídeo (activado). |
| **TikTok** | Inicio y «Para ti» abren **Siguiendo**; oculta los vídeos de cuentas que no sigues (TikTok los mete cuando acabas los tuyos) y los anuncios. Opcional (activado): ocultar Explorar, LIVE y Minidramas. |
| **Threads** | Inicio y «Para ti» abren **Seguidos** (cronológico); oculta anuncios y sugerencias. Opcional: ocultar lo que republican. |
| **Bluesky** | Abre siempre **Siguiendo**; oculta las pestañas Discover, Video y otros feeds. Opcional: ocultar lo que republican. |
| **Twitch** | Inicio abre **Siguiendo**; oculta canales y categorías recomendados (en la página y en la barra lateral). Opcional (activado): ocultar Explorar. |
| **LinkedIn** | En el feed oculta publicaciones **promocionadas**, **sugeridas** y de **autores que no sigues**. Opcional: ocultar las que ves porque a un contacto «le gusta» o las ha comentado. |

**Lo que publican, lo que republican y la actividad.** En cada red puedes elegir si ver también lo que republican o comparten las cuentas que sigues (visible por defecto: es una recomendación de una persona, no del algoritmo). La actividad («a X le gusta», «X y Y siguen a…») se oculta por defecto, porque la elige el algoritmo.

**Ajustes.** El icono de la extensión muestra solo las opciones de la red en la que estás; fuera de ellas, un interruptor por red. Todas las opciones están en **Opciones** (clic derecho en el icono → Opciones).

**Limitación:** funciona en el navegador del ordenador. Las apps del móvil no se pueden modificar.

## Al instalarla

Se abre una pantalla de bienvenida (español o inglés) que explica cómo fijar la extensión y cómo ajustar cada red. El panel incluye un enlace a [más extensiones de Gofio Design](https://gofiodesign.eu/extensiones.html), una invitación a valorarla cada 5 usos (el icono muestra una ★ y el aviso aparece al abrir el panel) y, una vez al año, a donar; todo voluntario y contado solo en local.

## Instalación manual

1. Descarga el repositorio y descomprímelo.
2. Abre `chrome://extensions` y activa el **Modo de desarrollador**.
3. Pulsa **Cargar descomprimida** y elige la carpeta `extension`.

## Privacidad

No recoge, envía ni guarda datos personales. Solo guarda tus preferencias (qué opciones tienes activadas). Ver [PRIVACY.md](PRIVACY.md).

## Si una red deja de funcionar

Las redes cambian su web a menudo. Cada red tiene su módulo en `extension/sites/`. Abre un issue indicando la red y qué ves.

## Créditos

Algunos selectores de YouTube e Instagram se basan en [Escape the Algorithm](https://github.com/nestolobo/escapethealgorithm) (MIT). Ver [NOTICE.md](NOTICE.md).

## Licencia

[MIT](LICENSE) © Gofio Design — proyecto independiente, sin relación con las redes mencionadas.
