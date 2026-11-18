# Nuxt: with an overlapping page transition, the scroll to top waits until the transition ends

> This README was written by an AI agent (Claude Code) on behalf of @timbtimbtimb.

Minimal reproduction, Nuxt 4.6.4.

[Open in StackBlitz](https://stackblitz.com/github/timbtimbtimb/nuxt-overlap-transition-scroll)

## Setup

- `/` (page A) and `/b` (page B) are tall pages with a link at the bottom.
- Both set `pageTransition: { name: 'cross-fade' }` with no `mode`, so the two pages animate at the same time. The entering page fades in over 1 s. The leaving page is lifted out of the flow and stays in place under it until then.
- `/out-in` is a control page with `mode: 'out-in'`.
- The box in the top-right corner shows `window.scrollY` and a timeline of the last navigation: when `page:transition:finish` fired and when `scrollY` reached 0.

`npm run dev` runs Nuxt's default `scrollBehavior`. `npm run dev:early` sets `EARLY_SCROLL=1`, which swaps in a copy of Nuxt 4.6.4's `scrollBehavior` with the proposed fix applied (`early-scroll/router.options.ts`, changes marked `FIX`).

## Steps

1. Run `npm run dev`.
2. On page A, scroll to the bottom and click **Go to page B**.

## Expected

The page scrolls to the top while page B fades in.

## Actual

Page B fades in at the bottom of the page, at the old scroll position. When the fade ends, the page jumps to the top. The timeline shows `scrollY reached 0` after `page transition finished`, about 1 s after the click.

With `npm run dev:early`, the page scrolls smoothly to the top as page B starts fading in. The timeline shows `scrollY reached 0` before `page transition finished`.

## Controls

| Action | Nuxt default | `EARLY_SCROLL=1` |
| --- | --- | --- |
| Page A → page B → browser Back | restores page A's position | restores page A's position |
| Page A → `/out-in` (`mode: 'out-in'`) | scrolls after the old page has left | same: `out-in` still waits |
