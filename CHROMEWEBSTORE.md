# Chrome Web Store — Solo Siguiendo para X

> Última actualización: 2026-11-22 · Versión 1.0.0

Paquete a subir: `dist/solo-siguiendo-x-1.0.0.zip` (generado con `./build.sh`).

---

## 1. Ficha de Play Store → «Store listing»

**Nombre** (sale del manifest)
```
Solo Siguiendo para X
```

**Resumen / descripción breve** (máx. 132)
```
Limita tu feed de X a las cuentas que sigues: abre siempre Siguiendo y oculta Para ti, anuncios y sugerencias.
```

**Descripción**
```
Solo Siguiendo para X hace que tu inicio de X (Twitter) muestre únicamente publicaciones de las cuentas que sigues, sin el feed algorítmico.

QUÉ HACE
• Abre siempre la pestaña «Siguiendo» en lugar de «Para ti».
• Oculta la pestaña «Para ti» para que no vuelvas a caer en ella.
• Oculta las publicaciones promocionadas (anuncios).
• Oculta los bloques de «A quién seguir» y las tendencias.
• Opcional: oculta los reposts, que suelen mostrar contenido de cuentas que no sigues.

CÓMO SE USA
1. Instala la extensión.
2. Abre x.com: el inicio pasará solo a «Siguiendo».
3. Pulsa el icono de la extensión para activar o desactivar cada opción. Los cambios se aplican al instante.

PRIVACIDAD
La extensión no recoge, envía ni vende ningún dato. Funciona solo en x.com y twitter.com, y únicamente guarda tus preferencias (qué opciones tienes activadas) en Chrome. Sin analítica ni servicios de terceros.

CÓDIGO ABIERTO
El código es público y puedes revisarlo o reportar problemas en:
https://github.com/GofioDesign/X-only-following

Proyecto independiente, sin relación con X Corp.
```

**Categoría**
```
Redes sociales y comunicación (Social & Communication)
```

**Idioma**
```
Español
```

**Icono de la tienda (128×128)** → `extension/icons/icon-128.png`

**Capturas (1280×800)** → `store/screenshot-1.png`, `store/screenshot-2.png`

**Mosaico promocional pequeño (440×280)** → `store/promo-tile-440x280.png`

**Sitio web oficial / Página principal**
```
https://github.com/GofioDesign/X-only-following
```

**URL de asistencia**
```
https://github.com/GofioDesign/X-only-following/issues
```

---

## 2. Pestaña «Privacidad» (Privacy practices)

**Finalidad única (Single purpose)**
```
Mostrar en x.com solo las publicaciones de las cuentas que el usuario sigue, abriendo la pestaña «Siguiendo» y ocultando el feed algorítmico, los anuncios y las sugerencias.
```

**Justificación de `storage`**
```
Se usa para guardar las preferencias del usuario (qué opciones están activadas, por ejemplo «Ocultar anuncios» u «Ocultar reposts») y mantenerlas entre sesiones y dispositivos. No se guarda ningún otro dato.
```

**Justificación de permisos de host (`https://x.com/*`, `https://twitter.com/*`)**
```
La extensión solo actúa en x.com y twitter.com: necesita acceder a estas páginas para cambiar a la pestaña «Siguiendo» y ocultar en la página los anuncios, las sugerencias de cuentas y, si el usuario lo elige, los reposts. No lee ni envía el contenido a ningún sitio; todo ocurre localmente en el navegador.
```

**¿Usas código remoto?**
```
No, no uso código remoto.
```

**Uso de datos** → no marcar ninguna categoría (no se recoge ningún dato).

Marcar las tres certificaciones:
- [x] No vendo ni transfiero datos de usuarios a terceros fuera de los casos de uso aprobados.
- [x] No uso ni transfiero datos de usuarios para fines no relacionados con la finalidad única.
- [x] No uso ni transfiero datos para determinar solvencia o conceder préstamos.

**URL de la política de privacidad**
```
https://github.com/GofioDesign/X-only-following/blob/main/PRIVACY.md
```

---

## 3. Distribución

- Visibilidad: **Pública**
- Regiones: **Todas**
- Precio: gratis

---

## Historial de versiones

| Versión | Fecha | Cambios | Estado |
|---|---|---|---|
| 1.0.0 | 2026-11-22 | Primera versión | Borrador |

## Notas para la revisión

- El icono es propio (marca de verificación azul): no usa el logotipo de X, y la ficha aclara que no hay relación con X Corp. para evitar rechazos por marca.
- Si piden aclarar el nombre: «para X» indica la web en la que funciona, no afiliación.
