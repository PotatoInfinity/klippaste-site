# Klip landing page

Vanilla static site for **Klip** + **KlipOCR**. No framework, no build step.

## Run

```sh
cd site
python3 -m http.server 8000
# open http://localhost:8000
```

## Files

- `index.html` — home (hero, two app cards, demo video, flow, bento, pricing teaser, FAQ)
- `license.html` — licensing placeholder (work in progress)
- `styles.css`, `app.js` — forest theme, pill glass nav, reveal motion
- `assets/bg-dither.png` — dithered forest-path art (sky top reuses as tiled section bg)
- `icons/klip-*.png`, `klipocr-*.png` — app icons (1024 master + 512 web)
- `video/klip-demo-720p.mp4` + `poster.jpg` — compressed demo (master stays out of git)

## Swap download links

Buttons currently point at `#`. When signed DMGs ship, replace `href="#"` with release URLs.

## Notes

- Own git repo (nested, parent ignores `site/` like `KlipOCR/`).
- Video master (`Klip.mp4`, 297MB) never committed — only the 12MB 720p copy.
- Reduced-motion + mobile menu included.
