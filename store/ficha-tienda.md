# Chalablock: ficha para las tiendas de extensiones

Material listo para copiar y pegar en **Microsoft Partner Center (Edge Add-ons)**. Sirve también para la Chrome Web Store, cambiando el paquete.

## 1. Packages (paquete)

| Tienda | Archivo a subir |
|---|---|
| Edge Add-ons | `store/paquetes/Chalablock_1.0.0.edge.zip` |
| Chrome Web Store | `store/paquetes/Chalablock_1.0.0.chromium.zip` |

Ambos se generan en GitHub Actions y también están en <https://github.com/joelchala/Chalablock/releases/tag/1.0.0>. **No subas a Edge el paquete de Chromium**: Edge exige los archivos de reglas en la raíz del paquete.

## 2. Availability (disponibilidad)

- **Visibility:** Public
- **Markets:** todos

## 3. Properties (propiedades)

- **Category:** Productivity (Edge no tiene una categoría de privacidad o bloqueo de anuncios)
- **Privacy policy requirements:** la extensión **no** accede, recopila ni transmite información personal → responder **No**
- **Privacy policy URL:** `https://github.com/joelchala/Chalablock/blob/chalablock/PRIVACY.md`
- **Website URL:** `https://github.com/joelchala/Chalablock`
- **Support contact details:** `https://github.com/joelchala/Chalablock/issues`
- **Mature content:** No

## 4. Privacy (privacidad)

**Single purpose (propósito único):**

> Chalablock blocks ads, trackers and malicious sites on the pages the user visits.

**Justificación de permisos** (pegar en el campo de cada permiso):

| Permiso | Justificación |
|---|---|
| `declarativeNetRequest` | Blocks ad and tracker network requests using the filter rules bundled with the extension. This is the core function. |
| Host permission `<all_urls>` | Ads and trackers can appear on any website, so the blocking rules and cosmetic filters must apply to every site the user visits. |
| `scripting` | Injects the cosmetic filters (CSS and small scriptlets) that hide ad placeholders left on the page after requests are blocked. |
| `userScripts` | Optional: lets the user apply cosmetic/scriptlet filters from filter lists they import themselves. Does nothing unless the user enables it. |
| `activeTab` | Runs the element zapper and the filter picker on the current tab when the user clicks them in the popup, and reads the blocked-request count for that tab. |
| `storage`, `unlimitedStorage` | Stores the user's settings, per-site filtering modes and custom filters locally in the browser. |
| `alarms` | Schedules internal maintenance tasks (for example refreshing lists the user imported). |
| `offscreen` | Compiles user-imported filter lists in an offscreen document, since service workers have no DOM parser. |

**Remote code:** No. All code is included in the package.

**Data usage:** the extension does not collect or transmit any user data. Marcar ninguna categoría de datos y aceptar las tres declaraciones de cumplimiento.

## 5. Store listings (ficha)

Crear dos idiomas: **Spanish** y **English**. El nombre y la descripción corta se leen del paquete.

### Imágenes (carpeta `store/`)

| Campo | Archivo | Tamaño |
|---|---|---|
| Extension logo | `logo-300x300.png` | 300×300 |
| Small promotional tile | `promo-440x280.png` | 440×280 |
| Screenshots | `captura-1-popup.png`, `captura-2-configuracion.png`, `captura-3-bienvenida.png` | 1280×800 |

### Descripción (español)

```
Chalablock es un bloqueador de anuncios de código abierto, rápido y privado, pensado para quienes navegan en español.

Empieza a funcionar al instalarlo, sin configuración: bloquea anuncios, rastreadores, criptomineros y sitios maliciosos. Las reglas de bloqueo vienen incluidas en la extensión y las aplica el propio navegador, así que no consume memoria en segundo plano ni envía tus datos a ningún servidor.

CARACTERÍSTICAS
• Bloqueo inmediato de anuncios y rastreadores
• Listas en español activas por defecto (EasyList Spanish y AdGuard Spanish/Portuguese), además de las listas generales
• Contador de peticiones bloqueadas en cada página
• Modos de filtrado por sitio: sin filtrado, básico, óptimo y completo
• Elimina con un clic cualquier elemento molesto de una página
• Crea tus propios filtros personalizados
• Más de 50 listas opcionales: avisos de cookies, redes sociales, listas regionales
• Tema claro y oscuro
• Pantalla de bienvenida en español

PRIVACIDAD
Chalablock no recopila, transmite, vende ni comparte ningún dato personal ni de navegación. No tiene servidores propios, analíticas ni telemetría, y no requiere crear una cuenta.

CÓDIGO ABIERTO
Chalablock es software libre bajo la licencia GPLv3. Es una versión modificada de uBlock Origin Lite, creado por Raymond Hill, y no está afiliado al proyecto original. El código fuente está disponible en https://github.com/joelchala/Chalablock

Chalablock es gratuito. Las donaciones son opcionales y no desbloquean ninguna función.
```

### Description (English)

```
Chalablock is a fast, private, open-source ad blocker designed with Spanish-speaking users in mind.

It works as soon as it is installed, with no setup: it blocks ads, trackers, coin miners and malicious sites. The blocking rules are bundled with the extension and enforced by the browser itself, so it uses no background memory and sends your data nowhere.

FEATURES
• Blocks ads and trackers out of the box
• Spanish filter lists enabled by default (EasyList Spanish and AdGuard Spanish/Portuguese), on top of the general lists
• Counter of blocked requests on each page
• Per-site filtering modes: no filtering, basic, optimal and complete
• Remove any annoying page element with one click
• Create your own custom filters
• More than 50 optional lists: cookie notices, social widgets, regional lists
• Light and dark themes
• Welcome page that explains how it works

PRIVACY
Chalablock does not collect, transmit, sell or share any personal or browsing data. It has no servers of its own, no analytics or telemetry, and requires no account.

OPEN SOURCE
Chalablock is free software under the GPLv3 license. It is a modified version of uBlock Origin Lite, created by Raymond Hill, and is not affiliated with the original project. Source code: https://github.com/joelchala/Chalablock

Chalablock is free. Donations are optional and unlock no features.
```

### Search terms (máximo 7)

```
bloqueador de anuncios
adblock
ad blocker
privacidad
bloquear publicidad
antirastreo
anuncios
```

## 6. Notes for certification (notas para el revisor)

```
Chalablock is an open-source (GPLv3) content blocker built on Manifest V3. It is a modified version of uBlock Origin Lite by Raymond Hill, with its own branding, theme, default Spanish filter lists, blocked-request counter and welcome page. Full source code: https://github.com/joelchala/Chalablock

No account or credentials are needed to test it.

How to test:
1. Install the extension. A welcome page opens once.
2. Visit any site with ads (for example https://adblock-tester.com/). Ads and trackers are blocked and the toolbar badge shows the number of blocked requests.
3. Click the toolbar icon to open the popup: it shows the per-site filtering mode slider and the blocked-request counter.

The extension contains no remote code, no analytics and makes no network requests of its own. All filtering rules are bundled in the package as declarativeNetRequest static rulesets. The only external requests happen when the user imports a filter list by URL.

The "Donate" link opens an external PayPal page. It is optional and unlocks no functionality.
```

## Antes de enviar

- [ ] Subir `Chalablock_1.0.0.edge.zip` en **Packages**.
- [ ] Revisar que el nombre «Chalablock» y la descripción corta aparezcan bien tras subir el paquete.
- [ ] Reemplazar las capturas por capturas reales si lo prefieres: las incluidas son composiciones hechas con el HTML y CSS reales de la extensión.
