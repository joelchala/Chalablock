<h1 align="center">
<img src="platform/mv3/extension/img/chalablock.svg" height="48" width="48" alt="">
<br>
Chalablock
</h1>

<p align="center">
Bloqueador de anuncios de código abierto para Chrome, Edge y otros navegadores Chromium.<br>
Rápido, privado y pensado para quienes navegan en español.
</p>

***

## Qué es

Chalablock bloquea anuncios, rastreadores y sitios maliciosos desde el momento en que se instala. Funciona con Manifest V3: las reglas de bloqueo vienen incluidas en la extensión y las aplica el propio navegador, así que no hay procesos en segundo plano consumiendo memoria ni servidores a los que se envíen tus datos.

- **Autor y mantenimiento:** Joel Chala
- **Licencia:** [GNU GPLv3](LICENSE.txt)
- **Privacidad:** [no recopila ningún dato](PRIVACY.md)

## Características

- **Bloqueo inmediato**, sin configuración: anuncios, rastreadores, criptomineros y dominios de malware.
- **Listas en español activas por defecto:** EasyList Spanish y AdGuard Spanish/Portuguese, además de las listas generales.
- **Contador de bloqueos:** el popup muestra cuántas peticiones se bloquearon en la página actual.
- **Cuatro modos de filtrado por sitio**, desde «sin filtrado» hasta «completo», con un control deslizante en el popup.
- **Herramientas por página:** eliminar un elemento molesto con un clic y crear filtros personalizados.
- **Más de 50 listas opcionales**, regionales y temáticas (avisos de cookies, redes sociales, molestias).
- **Interfaz propia**, con tema claro y oscuro.
- **Sin telemetría, sin cuentas, sin servidores.**

## Resultados de prueba

| Prueba | Resultado | Navegador | Fecha |
|---|---|---|---|
| [adblock-tester.com](https://adblock-tester.com/), modo óptimo (por defecto) | 91 de 100 | Microsoft Edge | 12 nov 2026 |
| [adblock-tester.com](https://adblock-tester.com/), modo completo | 96 de 100 | Microsoft Edge | 12 nov 2026 |

La prueba cubre 11 servicios y 22 comprobaciones. En modo óptimo, el único punto no superado con certeza es la visibilidad del bloque de Google AdSense, que el propio sitio marca como no determinable de forma automática.

## Instalación

Chalablock todavía no está publicado en las tiendas de extensiones. Para instalarlo desde el código:

1. Compila la extensión (ver más abajo) o descarga una compilación.
2. Abre `chrome://extensions` (Chrome) o `edge://extensions` (Edge).
3. Activa el **modo de desarrollador**.
4. Pulsa **Cargar descomprimida** y elige la carpeta `dist/build/uBOLite.chromium`.

## Compilar

Requisitos: Git, Bash, Node.js 22 o superior y `jq`. En Windows sirve Git Bash.

```bash
git clone --recurse-submodules https://github.com/joelchala/Chalablock.git
```

```bash
cd Chalablock && bash tools/make-mv3.sh chromium
```

El resultado queda en `dist/build/uBOLite.chromium`. Durante la compilación se descargan las listas de filtros desde sus servidores de origen. El código de la extensión está en [`platform/mv3/`](platform/mv3/).

## Hoja de ruta

Mejoras previstas para las próximas versiones. Nada de esto está implementado todavía.

| Mejora | Qué aporta |
|---|---|
| Lista propia para Latinoamérica | Dominios publicitarios de medios y sitios de la región que las listas generales no cubren |
| Pantalla de bienvenida | Explicar en español los modos de filtrado al instalar |
| Traducción completa de los textos propios | Los textos añadidos por Chalablock solo están en español e inglés |
| Canal propio de reportes | Recibir aquí los reportes de sitios en español en vez de enviarlos al proyecto original |
| Compilación automática | Generar el paquete listo para instalar en cada versión, sin compilar a mano |
| Publicación en Chrome Web Store y Edge Add-ons | Instalación con un clic y actualizaciones automáticas |

Las sugerencias son bienvenidas en los [reportes del repositorio](https://github.com/joelchala/Chalablock/issues).

## Apoyar el proyecto

Chalablock es gratuito. Si te resulta útil, puedes hacer una [donación opcional por PayPal](https://www.paypal.com/ncp/payment/LU3SQKTCXX9SW). Donar no desbloquea ninguna función.

## Créditos y licencia

Chalablock es una versión modificada de [uBlock Origin Lite](https://github.com/gorhill/uBlock), creado por Raymond Hill (gorhill) y sus colaboradores, a quienes corresponde el derecho de autor del código original. Las modificaciones y el desarrollo posterior son de Joel Chala (desde noviembre de 2026). Chalablock no está afiliado al proyecto original ni cuenta con su respaldo.

Las listas de filtros son obra de sus respectivos autores, entre ellos [uBlock Origin / uAssets](https://github.com/uBlockOrigin/uAssets), EasyList y AdGuard.

Todo el proyecto se distribuye bajo la [GNU General Public License v3](LICENSE.txt): puedes usarlo, estudiarlo, modificarlo y redistribuirlo bajo la misma licencia.
