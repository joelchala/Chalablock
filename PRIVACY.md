# Política de privacidad de Chalablock

*Última actualización: 12 de noviembre de 2026* · [English version below](#chalablock-privacy-policy)

Chalablock es una extensión de navegador de código abierto que bloquea anuncios y rastreadores. Es una versión modificada de [uBlock Origin Lite](https://github.com/gorhill/uBlock) de Raymond Hill, publicada por Joel Chala bajo la licencia GPLv3.

## Resumen

**Chalablock no recopila, transmite, vende ni comparte ningún dato personal ni de navegación.** No tiene servidores propios, no incluye analíticas ni telemetría y no requiere crear una cuenta.

## Qué datos se manejan y dónde

- **Tu configuración** (modo de filtrado por sitio, listas activas, filtros personalizados) se guarda únicamente en tu navegador, mediante el almacenamiento local de extensiones. Nunca sale de tu dispositivo, salvo que tú mismo exportes una copia de seguridad a un archivo.
- **Las páginas que visitas** se filtran localmente con reglas incluidas dentro de la extensión, mediante la API `declarativeNetRequest` del navegador. Chalablock no registra tu historial ni envía a ningún lugar las direcciones que visitas.

## Conexiones de red

En su uso normal, Chalablock no realiza ninguna conexión a servidores externos: las listas de filtros vienen incluidas en la extensión y se actualizan junto con ella.

Las únicas conexiones externas ocurren por una acción tuya:

- **Listas importadas:** si agregas una lista de filtros indicando su URL, la extensión la descarga desde esa dirección, y puede volver a descargarla para mantenerla actualizada. El servidor que elegiste verá tu dirección IP, como con cualquier descarga.
- **Reportar un problema:** abre una página de GitHub con los datos que tú decidas enviar. Aplica la política de privacidad de GitHub.
- **Donaciones:** el botón «Donar» abre una página de PayPal. Chalablock no recibe ni procesa datos de pago; aplica la política de privacidad de PayPal. Donar es opcional y no desbloquea ninguna función.

## Permisos que solicita la extensión

| Permiso | Para qué se usa |
|---|---|
| Acceso a todos los sitios (`<all_urls>`) | Bloquear anuncios y rastreadores y aplicar filtros cosméticos en cualquier página |
| `declarativeNetRequest` | Bloquear peticiones de red con las reglas incluidas |
| `scripting`, `userScripts`, `activeTab` | Ocultar elementos de anuncios y ejecutar las herramientas «Eliminar un elemento» y «Crear un filtro personalizado» en la pestaña actual |
| `storage`, `unlimitedStorage` | Guardar tu configuración y tus filtros en tu navegador |
| `alarms`, `offscreen` | Tareas internas de mantenimiento y compilación de filtros, sin comunicación externa |

Ninguno de estos permisos se usa para recopilar información.

## Cambios a esta política

Cualquier cambio se publicará en este mismo archivo; el historial completo es público en el [repositorio](https://github.com/joelchala/Chalablock/commits/chalablock/PRIVACY.md).

## Contacto

Para preguntas sobre privacidad, abre un reporte en <https://github.com/joelchala/Chalablock/issues>.

---

# Chalablock Privacy Policy

*Last updated: November 12, 2026*

Chalablock is an open-source browser extension that blocks ads and trackers. It is a modified version of [uBlock Origin Lite](https://github.com/gorhill/uBlock) by Raymond Hill, published by Joel Chala under the GPLv3 license.

## Summary

**Chalablock does not collect, transmit, sell or share any personal or browsing data.** It has no servers of its own, includes no analytics or telemetry, and requires no account.

## What data is handled, and where

- **Your settings** (per-site filtering mode, enabled lists, custom filters) are stored only in your browser, using the extension's local storage. They never leave your device unless you export a backup file yourself.
- **The pages you visit** are filtered locally with rules bundled inside the extension, through the browser's `declarativeNetRequest` API. Chalablock does not record your history or send the addresses you visit anywhere.

## Network connections

In normal use, Chalablock makes no connection to external servers: filter lists are bundled with the extension and updated along with it.

External connections only happen as a result of your own action:

- **Imported lists:** if you add a filter list by URL, the extension downloads it from that address and may download it again to keep it up to date. The server you chose will see your IP address, as with any download.
- **Reporting an issue:** opens a GitHub page with the data you decide to submit. GitHub's privacy policy applies.
- **Donations:** the "Donate" button opens a PayPal page. Chalablock does not receive or process payment data; PayPal's privacy policy applies. Donating is optional and unlocks no features.

## Permissions requested by the extension

| Permission | What it is used for |
|---|---|
| Access to all sites (`<all_urls>`) | Blocking ads and trackers and applying cosmetic filters on any page |
| `declarativeNetRequest` | Blocking network requests with the bundled rules |
| `scripting`, `userScripts`, `activeTab` | Hiding ad elements and running the element zapper and custom filter picker in the current tab |
| `storage`, `unlimitedStorage` | Saving your settings and filters in your browser |
| `alarms`, `offscreen` | Internal maintenance and filter compilation tasks, with no external communication |

None of these permissions is used to collect information.

## Changes to this policy

Any change will be published in this same file; the full history is public in the [repository](https://github.com/joelchala/Chalablock/commits/chalablock/PRIVACY.md).

## Contact

For privacy questions, open an issue at <https://github.com/joelchala/Chalablock/issues>.
