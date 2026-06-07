# Aušrinė

A offline first focus sanctuary. One task at a time, before the noise begins.

Named after the Lithuanian morning star — the first light at dawn, a single point of brightness before the day floods in.

---

## What it does

- **One task focus** — dashboard shows a single task, not a list
- **Brain dump** — pour everything out, break it down later
- **Daily reset** — clean slate every morning, carryover for what's left
- **Variable rewards** — rotating sounds and messages so completion stays fresh
- **New tab, new focus** — lives as your browser's new tab page
- **100% offline** — all data in IndexedDB, no server, no accounts

## Stack

React 19 · Vite · TypeScript · Tailwind CSS v4 · IndexedDB · Web Audio API · PWA

## Development

```sh
make dev      # start dev server
make build    # typecheck + production bundle
make test     # run tests once
```

## Philosophy

- Anonymous — `crypto.randomUUID()`, no email, no password
- offline first; no server, no network requests after load
- Quiet, not silent; subtle sounds and micro interactions
- Every pixel earns its place
