# UX iterations (Phase 7)

Follow-up UX automation on branches `ux-iteration-1` … `ux-iteration-5`. Research: Base docs (mini-apps, embeds, design guidelines), paymasters (gasless copy). Target: Lighthouse perf/accessibility >90.

## Iteration 1 (ux-iteration-1)

- **Done:** Rich unfurl: Open Graph + Twitter card + `fc:miniapp` with og.png; manifest ogDescription with pot/ladder teaser; "Join arena" button title. Gasless copy: "0 gas—sponsored!" on home, lobby, feed-pot; preview toast "0 gas—sponsored!". WCAG: 44px touch targets, aria-labels, footer disclaimer (skill-based; no purchase necessary), focus ring on Terms. Value prop: "Unlock prizes—gasless!" on home and lobby.
- **Test:** `cd miniapp && npm run build && npm run test:e2e`. Manual: Lighthouse (aim >90 accessibility), keyboard nav.

## Iteration 2 (ux-iteration-2)

- **Done:** Vertical ladder scroll (max-h, overflow-y-auto) with glowing milestones at Q5/Q10 (arena-ladder-milestone CSS animation); 30s countdown as SVG circle (stroke-dashoffset); pulse when ≤10s; lifeline buttons with cost preview in title and label (e.g. "50:50 (10 $MILLION?)"); 44px lifeline touch targets; progress bar with "Safe at Q5, Q10" caption.
- **Test:** Build + E2E (dev server required for Cypress).

## Iteration 3 (ux-iteration-3)

- **Iteration 3:** Real-time leaderboard with avatars/display names; pot feed banner; shareable recap.
- **Iteration 4:** Embedded XMTP chat panel; pot feed banners; shareable recaps.
- **Iteration 5:** Post-game confetti on win; loss feedback; dark/light mode toggle; optional AI suggestions.

Each iteration: create branch from `feat/core-agent-miniapp`, apply changes, run Cypress and Lighthouse (accessibility), document score in this file, push and open PR.
