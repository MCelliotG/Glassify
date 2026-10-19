# Glassify - Glass for your FMDX Webserver by MCelliotG

Layered glass appearance plugin for FM-DX Webserver. Version **1.2.0**.

## Installation

Copy the contents of `plugins/` into your FM-DX Webserver `plugins/` directory, restart the server, and enable **Glassify** in the server plugin settings. Visitors can then use **Enable Glassify** in the sidebar. The appearance is OFF by default.

Keep `Glassify.js` and the complete `glassify/` directory together, including its `assets/` folder. No core file edits are required. The logo is copied to the web-served plugin asset directory at startup, with text branding as a fallback.

## Features

- Nine glass presets plus a personal Custom preset; blur, opacity, reflections, embossed edges and layered effects.
- Native sidebar switch, draggable floating button with four corner positions, and draggable settings panel.
- Paint-only panel styling preserves core layout dimensions.
- Transparent modal backdrop for live preview; the settings panel follows the chosen glass settings.
- Admin-controlled initial appearance for visitors; personal browser settings remain independent.
- Compact header with version below the logo and a reserved update notification row.

## Updates

Opening settings checks the raw frontend source once per plugin initialization, following the AudioMetrix version-check convention. A newer numeric version shows **Update available: v…**, linking to this repository. Network failures remain silent, and checks time out after six seconds. Remote code is never executed.

Update source: `https://raw.githubusercontent.com/MCelliotG/Glassify/main/plugins/glassify/glassify.js`

Install updates by replacing the **complete plugin package** and restarting the server. Glassify includes backend code, a model and assets, so updating only the frontend is insufficient. There is no automatic installation.

## Settings and removal

Personal settings use browser local storage. Server defaults are stored beside the server configuration in its `.glassify.json` companion file. Publishing defaults requires an authenticated administrator and a CSRF token.

Disable the plugin, stop the server, and remove `plugins/Glassify.js` and `plugins/glassify/` to uninstall. On installations where web assets were copied rather than linked, remove the generated `web/js/plugins/glassify/` directory too.

## Verification

Run `node tests/frontend.cjs`, `node tests/backend.cjs`, and `node tests/assets.cjs`. Frontend tests use a simulated DOM; they do not establish compatibility with every theme or browser.

## 1.2.0 — Accent lighting

**Theme accent glow** controls a soft theme-colored halo. **Twin overglow intensity** adds two opposing bright edge bands; **Overglow angle** rotates their direction (0° top/bottom, 90° left/right). Both intensities default to zero, preserving existing appearances. The bands use directional shadows and follow rectangular edges rather than tracing two circular points. No animation or continuous JavaScript rendering is used.

**Theme aware** uses the Prism gradient layout with the active theme’s accent, bright and base colors. Theme changes update the colors through CSS variables. Overlay strength controls its transparency.

New controls are included in Custom and administrator defaults. Existing saved server defaults are migrated with lighting OFF. Replace all plugin files together when upgrading.

## Upgrading from the frontend.js filename

Stop the server, replace the plugin files, and remove the obsolete `plugins/glassify/frontend.js` file (and its generated copy/link under `web/js/plugins/glassify/`, if present). Start the server and re-enable Glassify in the plugin settings because the registered frontend path is now `glassify/glassify.js`. Personal settings and saved server defaults retain their existing storage keys.
