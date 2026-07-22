# @KINGdeusX — portfolio-as-a-feed

A single-page site built to look like a social profile: sticky nav, profile
header with fake "live status," story highlights, a project feed with
engagement bars, a tech stack, a photography grid, and a hobbies reel.
Black / white / red. Archivo Black + Inter + JetBrains Mono. A subtle
canvas particle background sits behind everything (physics-based drift,
elastic wall bounce, gentle cursor repulsion, connecting lines) — it's
intentionally low-opacity so it never fights the content, and it respects
`prefers-reduced-motion`.

No build step, no dependencies. It's just HTML/CSS/JS.

## File structure

```
index.html
css/style.css
js/physics-bg.js   <- the particle background
js/main.js         <- nav, status rotator, like buttons, scroll reveal
images/             <- placeholder images, see table below
favicon.svg
```

## Replacing the placeholder images

Every placeholder is baked at the exact pixel size the layout expects, and
each one has its dimensions printed in the corner so you can't mix them up.
Keep the same filename and pixel size (or close to it — the CSS crops with
`object-fit: cover`, so a little variance is fine) and it'll drop right in.

| File | Used for | Size (px) | Notes |
|---|---|---|---|
| `avatar.jpg` | profile photo + mini avatars | 400×400 | square crop, keep under ~150KB |
| `og-cover.jpg` | link-share preview image | 1200×630 | shown on Discord/Twitter/etc. link previews |
| `project-*.jpg` (6 files) | feed post covers | 1200×800 | 3:2 ratio |
| `gallery-0X.jpg` (8 files) | photography grid | 1080×1080 | square, shoot/export square or crop to square |
| `hobby-*.jpg` (6 files) | hobbies reel cards | 900×1125 | 4:5 portrait, text overlays the bottom third so keep that area uncluttered |

General tips:
- Export photos as JPG at ~80% quality — keeps pages fast without visible loss.
- Keep each file under ~300KB where you can; nothing here needs to be huge.
- If you swap in a transparent-background logo anywhere, use PNG instead of JPG.

## Customizing

Everything lives in CSS custom properties at the top of `css/style.css`:

```css
:root {
  --black: #0a0a0a;
  --red: #ff2b2b;
  --font-display: 'Archivo Black', ...;
  --font-body: 'Inter', ...;
  --font-mono: 'JetBrains Mono', ...;
}
```

Change a value once, it updates everywhere.

- **Status pill messages**: edit the `statuses` array near the top of `js/main.js`.
- **Project posts / captions / stats**: edit the text directly in `index.html` — it's plain markup, search for `<article class="post">`.
- **Particle background density/speed**: tweak the `CONFIG` object at the top of `js/physics-bg.js` (`maxParticles`, `linkDistance`, `maxSpeed`).

## Deploying to kingdeusx.github.io

1. Clone `KINGdeusX/KINGdeusX.github.io`.
2. Delete its current contents, copy everything from this folder in (keeping the same structure).
3. Commit and push to `main` — GitHub Pages will pick it up automatically.
4. Give it a minute, then check `https://kingdeusx.github.io`.

## Accessibility / performance notes already handled

- `prefers-reduced-motion` disables the particle animation and scroll-reveal transitions.
- The particle canvas pauses when the tab isn't visible.
- All images have explicit `width`/`height` (no layout shift) and `loading="lazy"` outside the hero.
- Keyboard focus is visible everywhere (red outline), and there's a skip-to-content link.
