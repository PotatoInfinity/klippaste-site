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
  $6.99 USD (Save $0.99 stays bare), no subscriptions. Meta/og + button
  labels on `license.html` carry USD. Per-card microcopy on
  `license.html`: per 1 device, try free first; do not repeat final sale,
  +tax, or USD there (final sale lives in the warning box).
- Platform: Mac + Windows are equally supported. Use device, not
  Mac-only, in license/Terms copy; do not add OS caveats.
- Free tiers verbatim everywhere (index FAQ = license cards = Terms §5):
  Klip pastes up to 1000 characters, 21 free in the first 7 days, then 14
  per rolling 7 days; document conversion (document mode) is paid. KlipOCR
  21 free snips in the first 7 days, then 14 per rolling 7 days, no length
  limit per snip; document mode is paid.
- Offline claims always say "offline between checks" and carry the 30-day
  offline window + 14-day grace (44 days) qualifier. Never promise full
  offline use after activation, and never claim revocation cannot reach an
  activated copy. Validation runs about daily when online; it sends only
  license ID, seat, device proof, and IP; no document content. Remote images
  referenced in pasted Markdown/HTML may be fetched from their hosts (URL, IP,
  user agent disclosed); the app's internet toggle or `KLIP_ALLOW_NETWORK=0`
  disables remote fetches.
  Revocation only for actual refund, chargeback, or proven abuse; open
  disputes do not revoke; updates may continue; appeal with human review
  (Terms §11).
- Index FAQ is scoped: document content stays on-device; license validation,
  update checks, feedback, site traffic, and any remote image URL you paste
  leave it (Terms §11 / Privacy §4). Never write "ever".
- Refunds: all sales final, stated inline in `terms.html` §§7+12 (+ VI).
  No separate refund page; no goodwill, no reissue (LS-discretion +
  mandatory-law carve-outs noted in §12). No refund promises; support
  mentions stay best-effort.
- Support: the in-app Help & Feedback portal (Supabase) is available 24/7
  and is the support channel; replies/fixes are best-effort, with no
  response-time guarantee. Seller mail is legal-notices-only and may get no
  reply (privacy rights answered within 30 days; COMPLAINT notices acked
  within 3 days — ack is receipt only, never a fix). Do not promise 24/7
  replies; ticket-status pages say best-effort, no reply promise.
- License page: conspicuous pre-price warning box required (final sale,
  1 device, perpetual but validated about daily online with 30-day + 14-day
  grace, 24/7 best-effort in-app support, try-free-first; links
  Terms §§5-8 + §§10-13 in Terms yellow style: `#7a5c00`, yellow underline,
  hover wash).
  Enterprise labeled Coming later, button dead (`<button
  type="button">`, no handler); base formula Total = (seats × list price)
  − discount + tax, discount tiers + seat-count + total set at checkout.
  Try-free-first line per card. No payment-coming-later fine print;
  checkout links point to Lemon Squeezy; Enterprise stays a non-link until
  offered.
- Index: download `<button type="button">`s stay dead (no handler, no
  navigation) — never imply download works. No dl-note small print, no
  hero badges-note / try-first banner, no final-note try-free line, no
  seller line, no payment-coming-later note (all live in Terms only).
  Compat wall lede speaks to real-time conversion and clean landing in
  every app where you write. Yours-to-keep means on that one device, this
  version only.
- Head: `og:title` matches `<title>` verbatim on every page (`404.html`
  keeps `noindex`); one `h1` per page only.
- Footer: single combined Terms & Privacy link only; Back-to-top present
  (`#top` on own page); copy `© 2026 Klip.` on every page;
  no seller line in footers (seller lives in Terms §1/§13 only);
  no VI in footer.
- Processors: factual disclosures only (Supabase Mumbai ap-south-1,
  Resend, Lemon Squeezy MoR, OpenRouter support path, Google Fonts).
  No model/vendor marketing claims.
- Buttons that must not navigate yet stay `<button type="button">` with
  no handler.
