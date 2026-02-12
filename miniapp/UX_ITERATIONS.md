# UX iterations (Phase 7)

Follow-up UX automation can be done on separate branches (e.g. `ux-iteration-1`, `ux-iteration-2`). Use browser tools to research Base docs and UX references, then implement and test.

## Iteration 1 (included in feat/core-agent-miniapp)

- **Done:** High-contrast palette (WCAG AA); tooltips on footer and lifelines; progress bar and safe milestones on ladder; timer pulse when ≤10s; plain/obfuscated toggle on game page; gasless preview on feed-pot.
- **Test:** Run `cd miniapp && npm run dev` and `npm run test:e2e` (Cypress). Manual check: contrast, keyboard nav, footer disclaimer.

## Future iterations (suggested branches)

- **Iteration 2:** Rich preview card for chat unfurl (pot/players/ladder); one-tap Base Accounts sign-in CTA.
- **Iteration 3:** Vertical ladder scroll + haptics (if available); countdown pulse animation; real-time leaderboard with avatars.
- **Iteration 4:** Embedded XMTP chat panel; pot feed banners; shareable recaps.
- **Iteration 5:** Post-game confetti on win; loss feedback; dark/light mode toggle; optional AI suggestions.

Each iteration: create branch from `feat/core-agent-miniapp`, apply changes, run Cypress and Lighthouse (accessibility), document score in this file, push and open PR.
