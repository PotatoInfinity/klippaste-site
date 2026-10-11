# AGENTS.md — klippaste-site

Static marketing site (vanilla HTML/CSS/JS, no framework, no build step).
Deploys via GitHub Pages from `main`: every push rebuilds, live in ~1 min.

## Rule: ship every finished change

When a site task is DONE (edited + verified below), commit and push
immediately in this repo. Never leave completed work uncommitted, and
never batch unrelated tasks into one commit.

```sh
git -C site add <files touched>   # never git add -A
git -C site commit -m "feat(site): <what>"
git -C site pull --rebase && git -C site push
```

If push is rejected (non-fast-forward — GitHub auto-commits CNAME), pull
--rebase first, then push. Verify live after ~60s:
`curl -s https://klippaste.com/<page> | grep -o "<expected string>"`.

## Before commit

- Every src/href/id referenced exists; no dead anchors.
- No console-breaking JS (`node --check` if app.js touched).
- CSS braces balanced; responsive intact (390/768/1440 by reasoning).
- Copy stays truthful: prices Klip $4.99 USD / KlipOCR $2.99 USD / bundle
  $6.99 USD (Save $0.99), no subscriptions. Per-card microcopy on
  `license.html`: USD, +tax if applies at checkout, per 1 Mac, final sale.
- Free tiers verbatim everywhere (index FAQ = license cards): Klip pastes
  up to 1000 characters, 21 free the first week, then 14 a week; KlipOCR
  free snips with unlimited length, document mode locked.
- Offline claims always carry the after-one-time-online-activation
  qualifier (hero, badges, feature cards, FAQ, license cards). Index FAQ is
  scoped: document content never leaves the device; activation / feedback /
  site traffic does (Terms §9 / Privacy §4). Never write "ever".
- Refunds: all sales final, stated inline in `terms.html` §§7+11 (+ VI).
  No separate refund page; no goodwill, no reissue (LS-discretion +
  mandatory-law carve-outs noted in §11). No refund/help promises elsewhere.
- Support: none whatsoever; seller mail is legal-notices-only (privacy
  rights answered within 30 days; COMPLAINT notices acked within 3 days —
  ack is receipt only, never a fix). No help/reply/fix promises anywhere;
  ticket-status pages say best-effort, no reply promise.
- License page: conspicuous pre-price warning box required (final sale,
  1 Mac never moves, no support, try-free-first; links Terms §§5-8 +
  §§10-12). Enterprise labeled Coming later, button dead, seat-count +
  total set at checkout. Try-free-first line per card.
- Index: download `<button type="button">`s stay dead with adjacent small
  print (free tier, macOS download, paid key at License page, checkout NOT
  active). Try-free-first one-liner under hero badges + near final CTA.
- Footer: single combined Terms & Privacy link only; Back-to-top present;
  copy `© 2026 Klip. Offline by design.` on every page; no VI in footer.
- Processors: factual disclosures only (Supabase Mumbai ap-south-1,
  Resend, Lemon Squeezy future MoR, OpenRouter support path, Google Fonts).
  No model/vendor marketing claims.
- Buttons that must not navigate yet stay `<button type="button">` with
  no handler.
