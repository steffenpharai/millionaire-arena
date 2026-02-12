# UX iterations (Phase 7)

Follow-up UX automation on branches `ux-iteration-1` … `ux-iteration-5`. Research: Base docs (mini-apps, embeds, design guidelines), paymasters (gasless copy). Target: Lighthouse perf/accessibility >90.

## Iteration 1 (ux-iteration-1)

- **Done:** Rich unfurl: Open Graph + Twitter card + `fc:miniapp` with og.png; manifest ogDescription with pot/ladder teaser; "Join arena" button title. Gasless copy: "0 gas—sponsored!" on home, lobby, feed-pot; preview toast "0 gas—sponsored!". WCAG: 44px touch targets, aria-labels, footer disclaimer (skill-based; no purchase necessary), focus ring on Terms. Value prop: "Unlock prizes—gasless!" on home and lobby.
- **Test:** `cd miniapp && npm run build && npm run test:e2e`. Manual: Lighthouse (aim >90 accessibility), keyboard nav.

## Iteration 2 (ux-iteration-2)

- **Iteration 2:** Rich preview card for chat unfurl (pot/players/ladder); one-tap Base Accounts sign-in CTA.
- **Iteration 3:** Vertical ladder scroll + haptics (if available); countdown pulse animation; real-time leaderboard with avatars.
- **Iteration 4:** Embedded XMTP chat panel; pot feed banners; shareable recaps.
- **Iteration 5:** Post-game confetti on win; loss feedback; dark/light mode toggle; optional AI suggestions.

Each iteration: create branch from `feat/core-agent-miniapp`, apply changes, run Cypress and Lighthouse (accessibility), document score in this file, push and open PR.
