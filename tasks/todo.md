# Rubik Solver Image Zoom

## Plan

- [x] Make solver step images tappable for a full-screen view.
- [x] Give algorithm images more space in the main solver card.
- [x] Verify type checking and a browser interaction path.
- [x] Fix final-corners algorithm asset so the bottom movement row is not cut off.

## Review

- Added a full-screen image viewer for the main Rubik solver step image.
- Algorithm steps now reserve a larger image area before expansion.
- Verified `pnpm --filter @joscola/game type-check`.
- Verified `pnpm --filter @joscola/game build`; it passes with existing unrelated lint/workspace warnings.
- Verified in Playwright on the yellow-face algorithm step: `Ampliar imatge` opens the full-screen view and `Tancar` closes it with no console errors.
- Regenerated `algoritme-canviar-cantonades.png` from a taller page-25 crop so the final `R2 U'` row is visible.
- Verified the fixed asset is served at `http://localhost:3002/rubik-2x2-guide/algoritme-canviar-cantonades.png` with dimensions `996x1511`.
