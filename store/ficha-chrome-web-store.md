# Chalablock: ficha para Chrome Web Store

Material listo para pegar en <https://chrome.google.com/webstore/devconsole> (cuenta de desarrollador `joelchala07@gmail.com`, ya registrada). El panel no se puede automatizar: se llena a mano, en el orden de este documento. Los textos largos de descripción son los mismos de [ficha-tienda.md](ficha-tienda.md), sección 5.

## 0. Antes de empezar

- En **Account**: correo de contacto `info@chaladev.site` verificado (sin eso no deja publicar) y declaración de **non-trader** (proyecto gratuito sin ventas).
- Si al subir el paquete aparece el diálogo **«Aceptar subidas de CRX verificadas»**, pulsar **Cancelar**: es opcional y, si se activa, toda subida futura exige firmar con una clave privada que no se puede perder.

## 1. Package (paquete)

Subir `store/paquetes/Chalablock_1.0.1.chromium.zip` (o el `.chromium.zip` de la última release en <https://github.com/joelchala/Chalablock/releases>). **No subas el de Edge.**

Si para entonces hay una versión más nueva, usa el `.chromium.zip` de esa versión: Chrome Web Store no acepta volver a subir un número de versión ya usado.

## 2. Store listing (ficha)

| Campo | Valor |
|---|---|
| Title / Summary | Se leen del paquete («Chalablock» y la descripción corta de 132 caracteres) |
| Description | Texto en español de `ficha-tienda.md`; añadir el inglés en el selector de idioma |
| Category | **Privacy & Security** (si no aparece, **Productivity > Tools**) |
| Language | Español (añadir English como segundo idioma) |
| Store icon (128×128) | `platform/mv3/extension/img/icon_128.png` (ya lleva el margen de 16 px que pide Google) |
| Screenshots (1280×800) | `captura-1-popup.png`, `captura-2-configuracion.png`, `captura-3-bienvenida.png` |
| Small promo tile (440×280) | `promo-440x280.png` |
| Marquee promo tile (1400×560) | `destacada-1400x560.png` (opcional) |
| Official URL | Dejar en «None» (requiere verificar un dominio propio) |
| Homepage URL | `https://github.com/joelchala/Chalablock` |
| Support URL | `https://github.com/joelchala/Chalablock/issues` |
| Mature content | No |

## 3. Privacy practices (prácticas de privacidad)

**Single purpose:**

```
Chalablock blocks ads, trackers and malicious sites on the pages the user visits.
```

**Permission justifications** (un campo por permiso):

| Permiso | Texto |
|---|---|
| activeTab | Used when the user opens the popup: it runs the element zapper and the filter picker on the current tab when the user clicks them, and reads the number of blocked requests for that tab to show it in the popup. |
| alarms | Schedules deferred internal maintenance tasks. Manifest V3 service workers are short-lived and cannot rely on long timers, so the alarms API is required for this. No data leaves the browser. |
| declarativeNetRequest | Core function of the extension: blocks ad, tracker and malware network requests using the static filtering rulesets bundled in the package. |
| offscreen | Compiles filter lists that the user chooses to import into usable rules. This needs a DOM/CSS parser, which is not available in a service worker, so it runs in an offscreen document. Nothing is displayed or sent anywhere. |
| scripting | Injects cosmetic filters (CSS and small scriptlets bundled in the package) that hide the empty ad placeholders left on the page after ad requests are blocked, and runs the element zapper and picker tools. |
| storage | Stores the user's settings locally in the browser: per-site filtering modes, enabled filter lists and custom filters. |
| unlimitedStorage | Users can import additional filter lists and write custom filters. The compiled rules can exceed the default storage quota, so unlimited local storage is needed. All data stays in the browser. |
| userScripts | Optional feature: applies cosmetic and scriptlet filters from filter lists the user imported or wrote themselves. It does nothing unless the user explicitly enables "Allow user scripts" for the extension in the browser. |
| Host permission | Ads and trackers can appear on any website, so the blocking rules and cosmetic filters must be able to apply to every site the user visits. The extension does not read, collect or transmit page content; all filtering happens locally. |

**Are you using remote code?** No, I am not using remote code.

**Data usage:** no marcar ninguna categoría de datos. Marcar las tres certificaciones.

**Privacy policy URL:** `https://github.com/joelchala/Chalablock/blob/chalablock/PRIVACY.md`

## 4. Distribution (distribución)

- **Payments:** Free of charge
- **Visibility:** Public
- **Regions:** All regions

## 5. Test instructions (instrucciones de prueba)

Usuario y contraseña: dejar vacíos. Pegar en «Additional instructions» (límite de 500 caracteres; este texto tiene 495):

```
No login needed.
1. Install: a welcome page opens once.
2. Open https://adblock-tester.com/ : ads and trackers are blocked; the toolbar badge counts blocked requests.
3. Click the toolbar icon: popup with per-site filtering mode and counter.
Open source (GPLv3), modified uBlock Origin Lite: own branding, Spanish lists by default, counter, welcome page. No remote code or analytics; rules are bundled static DNR rulesets. Donate link is optional.
Source: https://github.com/joelchala/Chalablock
```

## Riesgos de revisión a tener presentes

- **Permiso de host amplio (`<all_urls>`):** Google avisa que alarga la revisión («in-depth review»). Es inevitable en un bloqueador de anuncios.
- **Parecido con uBlock Origin Lite:** la política de spam de Chrome Web Store rechaza extensiones que duplican a otra sin aportar nada. Lo que distingue a Chalablock está en las instrucciones de prueba y en la descripción: marca y tema propios, listas en español por defecto, contador en el popup y bienvenida.
- **Uso del nombre «uBlock Origin Lite»:** aparece solo una vez en la descripción, como crédito obligatorio por la licencia. No lo repitas ni lo pongas en el título o en palabras clave: Google lo trata como uso indebido de marca ajena.
- **Donaciones:** enlace externo opcional, permitido. No declarar compras dentro de la extensión.
