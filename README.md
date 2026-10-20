# Glassify - Glass for your FMDX Webserver by MCelliotG

Layered glass appearance plugin for FM-DX Webserver. Version **1.4.1**.

## Installation

Copy `Glassify.js` and the complete `Glassify/` folder from this repository into your FM-DX Webserver `plugins/` directory, restart the server, and enable **Glassify** in the server plugin settings. Visitors can then use **Enable Glassify** in the sidebar. The appearance is OFF by default.

Keep `Glassify.js` and the complete `Glassify/` directory together, including its `assets/` folder. No core file edits are required. The logo is copied to the web-served plugin asset directory at startup, with text branding as a fallback.

## Features

- Eleven glass presets plus a personal Custom preset; blur, opacity, reflections, embossed edges and layered effects.
- Native sidebar switch, G ◈ toolbar buttons beside the online user count on desktop and mobile, and draggable settings panel.
- Paint-only panel styling preserves core layout dimensions.
- Transparent modal backdrop for live preview; the settings panel follows the chosen glass settings.
- Admin-controlled initial appearance for visitors; personal browser settings remain independent.
- Compact header with version below the logo and a reserved update notification row.

## Updates

Opening settings checks the raw frontend source once per plugin initialization, following the AudioMetrix version-check convention. A newer numeric version shows **Update available: v…**, linking to this repository. Network failures remain silent, and checks time out after six seconds. Remote code is never executed.

Update source: `https://raw.githubusercontent.com/MCelliotG/Glassify-for-FMDX-Webservers/main/Glassify/glassify.js`

Install updates by replacing the **complete plugin package** and restarting the server. Glassify includes backend code, a model and assets, so updating only the frontend is insufficient. There is no automatic installation.

## Settings and removal

Personal settings use browser local storage. Server defaults are stored beside the server configuration in its `.glassify.json` companion file. Publishing defaults requires an authenticated administrator and a CSRF token.

Disable the plugin, stop the server, and remove `plugins/Glassify.js` and `plugins/Glassify/` to uninstall. On installations where web assets were copied rather than linked, remove the generated `web/js/plugins/Glassify/` directory too.

## 1.2.0 — Accent lighting

**Theme accent glow** controls a soft theme-colored halo. **Twin overglow intensity** adds two opposing bright edge bands; **Overglow angle** rotates their direction (0° top/bottom, 90° left/right). Both intensities default to zero, preserving existing appearances. The bands use directional shadows and follow rectangular edges rather than tracing two circular points. No animation or continuous JavaScript rendering is used.

**Theme aware** uses the Prism gradient layout with the active theme’s accent, bright and base colors. Theme changes update the colors through CSS variables. Overlay strength controls its transparency.

New controls are included in Custom and administrator defaults. Existing saved server defaults are migrated with lighting OFF. Replace all plugin files together when upgrading.

## Upgrading from earlier folder names

Stop the server. Remove the obsolete Glassify plugin files before copying this package: the loader `plugins/Glassify.js`, the old lowercase `plugins/glassify/` folder, and its generated `web/js/plugins/glassify/` copy/link if present. Do not remove your server's `.glassify.json` defaults file.

Copy the new `Glassify.js` loader and `Glassify/` folder into `plugins/`, start the server, and re-enable Glassify in the plugin settings. The registered frontend path is now `Glassify/glassify.js` (capital G). This also avoids problems with case-only renames on Windows. Personal settings and saved server defaults retain their existing storage keys.

## 1.3.0 — Toolbar buttons and textured glass

The floating button has been replaced by **G ◈** next to the online user count. On mobile it appears in the bottom tray. Button-position controls have been removed.

- **Enable Glassify in the sidebar:** turns the effects and toolbar buttons on or off.
- **Enable glass effects inside the panel:** pauses/resumes the effects while keeping the toolbar buttons available. This distinction persists across page reloads.
- **Frosted:** transparent granular relief texture, with a revised preset.
- **Obscure:** irregular vertical texture with a ribbed-glass appearance.
- **Mica:** a smooth theme-tinted surface with very fine grain, inspired by Windows 11.

Choose a preset or select the material under **Overlay effect**. **Glass effect overlay strength** controls texture/tint intensity; background opacity, blur and other controls remain independent. Existing personal and server settings are preserved. The new Frosted defaults apply when selecting the preset again.

Textures are static SVG background tiles with no animation loop and no filtering of text. They visually suggest textured glass; they do not physically refract the page or use the native Windows Mica compositor. Effects can still cost GPU time, particularly at high blur values.

Verification includes simulated-DOM toolbar placement, independent button/effect state across reloads, settings persistence, and backend/asset checks. Actual mobile/theme rendering should be checked on the installed server.

## 1.3.1 — Appearance refinement

Toolbar buttons share vertical alignment with the adjacent settings button. Frosted and Obscure textures are denser, darker and more transparent, including at maximum overlay strength. Mica is unchanged. The renamed **Glass effect overlay strength** slider is now immediately below the effect selector. Saved slider values are preserved.

## Repository layout

`Glassify.js` is the loader. `Glassify/` contains `glassify.js`, `backend.js`, `model.js`, and `assets/`. There is no enclosing `plugins/` directory or tests folder in the published package.

## 1.4.1 — Release paths

All version labels and the frontend fallback path now use 1.4.1 and the capitalized Glassify directory. The update URL points to this renamed repository. To see an update notification, the installed version must be older and must already check the new URL.
