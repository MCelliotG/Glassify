<p align="center">
  <img src="Glassify/assets/glassify-logo.png" alt="Glassify — Glass for your FM-DX Webserver by MCelliotG" width="420">
</p>

<h1 align="center">✨ Glassify</h1>
<p align="center"><strong>Glass for your FM-DX Webserver · by MCelliotG</strong><br>Layered glass. Theme-inspired light. Your personal style.</p>

Give your FM-DX Webserver a new dimension with **Glassify**, a customizable glassmorphism plugin that combines translucent surfaces, textured glass, soft reflections and theme-colored lighting. Create a subtle, crystal-clear interface, a dark smoked finish or a vivid layered look — and fine-tune it while watching the changes live.

Glassify works alongside your server’s theme, with **no core file edits required**. Its panel styling preserves the existing layout dimensions, while each visitor can choose their own appearance.

## 💎 Find your glass

Choose from **11 presets**, then make the look your own:

| Preset | Character |
| --- | --- |
| **Classic** | A balanced blend of transparency, gloss and defined edges. |
| **Clear** | Light, transparent glass that lets the background shine through. |
| **Frosted** | Fine granular texture with a soft, translucent finish. |
| **Obscure** | Dense, irregular ribbed texture for a more tactile glass appearance. |
| **Mica** | A smooth, theme-tinted surface with subtle grain, inspired by Windows 11. |
| **Smoked** | A darker, muted finish with depth and soft shadows. |
| **Crystal** | Crisp contrast, vivid color and bright reflective edges. |
| **Prism** | Colorful layered gradients with a luminous glass finish. |
| **Ripple** | A restrained, embossed ripple-style overlay. |
| **Aurora** | Rich color, soft blur and a vibrant atmospheric finish. |
| **Mist** | A soft, diffused look with gentle contrast. |

Save your favorite combination as a **personal Custom preset** and return to it whenever you like.

## 🌈 Layer color, texture and light

Presets are just a starting point. Choose an overlay independently and adjust **Glass effect overlay strength** to blend it into your glass:

- **Prism** — colorful gradients layered across the surface.
- **Theme aware** — a Prism-style overlay that draws its colors from the active theme.
- **Ripple** — embossed, ripple-like highlights.
- **Mist** — a soft atmospheric layer.
- **Frosted** — fine, dense granular texture.
- **Obscure** — irregular vertical texture with a ribbed-glass character.
- **Mica** — subtle grain and theme-tinted depth.
- **None** — keep the glass surface free of an additional overlay.

Add **Theme accent glow** for a soft halo around panels. **Twin overglow** adds two opposing highlights, with an adjustable angle to move their direction around the panel. Both lighting intensities are adjustable, from understated accents to a more expressive finish.

## 🎛️ Shape every detail

Fine-tune **blur, background opacity, corner radius, gloss, edge definition, shadows, saturation, contrast and brightness**, alongside overlay strength and accent lighting.

Choose where Glassify applies: **main panels, the sidebar and supported popups**, with separate mobile and hover-effect options. The draggable settings panel follows your glass settings, while its transparent backdrop keeps the server visible so you can judge every adjustment in context.

## 📱 Made for desktop and mobile

Enable **Glassify** from the sidebar to reveal the **G ◈** settings button beside the online user count. On mobile, it appears in the bottom toolbar.

The sidebar switch controls Glassify and its launcher. The **Enable glass effects** switch inside the settings panel lets you pause the appearance while keeping the settings button available — convenient for comparing your look with the underlying theme.

## 👤 Your look, your choice

Personal settings are remembered in the current browser. Adjust a preset, save your Custom look or choose **Follow server defaults** to use the administrator’s appearance. **Factory defaults (OFF)** provides a simple reset.

## 🛠️ A shared starting point for your server

Administrators can publish the current look as **server defaults**, including whether Glassify starts enabled for visitors who have no personal settings. Give your server a coordinated appearance while letting visitors personalize it: publishing defaults does not overwrite existing personal choices.

Glassify’s factory setting is **OFF**.

## 📦 Installation

1. Download this repository using **Code → Download ZIP** and extract it.
2. Copy **`Glassify.js`** and the complete **`Glassify/`** folder into your FM-DX Webserver’s **`plugins/`** directory. Keep the included **`assets/`** folder inside `Glassify/`.
3. Restart FM-DX Webserver and enable **Glassify** in the server’s plugin settings.
4. Open the sidebar, turn on **Enable Glassify**, and click **G ◈** to start creating your look.

For administrator defaults, open Glassify while signed in as a server administrator and use **Admin · Server defaults**.

## 🔔 Update notifications

When you open the settings panel, Glassify checks this repository for a newer version. If one is available, a highlighted **Update available** link takes you here. Updates are installed manually by replacing the complete plugin package and restarting the server.

## ⚡ Appearance and performance

Glassify uses CSS-based styling and static texture layers, with no continuous JavaScript animation loop for the glass effects. Background blur still requires graphics processing; on less powerful devices, lower the blur or disable effects on mobile to find your preferred balance.

Detailed backgrounds make the glass effects more noticeable. Frosted, Obscure and Mica are visual interpretations built for the web; Mica does not require Windows or use its native compositor.

## 🧹 Removal

Disable Glassify, stop the server, and remove `plugins/Glassify.js` and `plugins/Glassify/`. If your installation contains a generated copy or link at `web/js/plugins/Glassify/`, remove that too.

---

**Glassify by MCelliotG** · Built for [FM-DX Webserver](https://github.com/NoobishSVK/fm-dx-webserver)

💎 **Make your receiver look as distinctive as the signals you discover.**
