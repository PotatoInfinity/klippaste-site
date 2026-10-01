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
- Copy stays truthful: prices Klip $4.99 / KlipOCR $2.99 / bundle $6.99,
  free tiers as in the apps, zero AI mentions, no subscriptions,
  refunds, or support promises.
- Buttons that must not navigate yet stay `<button type="button">` with
  no handler.
