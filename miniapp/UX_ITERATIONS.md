# UX iterations (Phase 7)

Follow-up UX automation on branches `ux-iteration-1` … `ux-iteration-5`. Research: Base docs (mini-apps, embeds, design guidelines), paymasters (gasless copy). Target: Lighthouse perf/accessibility >90.

## Iteration 1 (ux-iteration-1)

- **Done:** Rich unfurl: Open Graph + Twitter card + `fc:miniapp` with og.png; manifest ogDescription with pot/ladder teaser; "Join arena" button title. Gasless copy: "0 gas—sponsored!" on home, lobby, feed-pot; preview toast "0 gas—sponsored!". WCAG: 44px touch targets, aria-labels, footer disclaimer (skill-based; no purchase necessary), focus ring on Terms. Value prop: "Unlock prizes—gasless!" on home and lobby.
- **Test:** `cd miniapp && npm run build && npm run test:e2e`. Manual: Lighthouse (aim >90 accessibility), keyboard nav.

## Iteration 2 (ux-iteration-2)

- **Done:** Vertical ladder scroll (max-h, overflow-y-auto) with glowing milestones at Q5/Q10 (arena-ladder-milestone CSS animation); 30s countdown as SVG circle (stroke-dashoffset); pulse when ≤10s; lifeline buttons with cost preview in title and label (e.g. "50:50 (10 $MILLION?)"); 44px lifeline touch targets; progress bar with "Safe at Q5, Q10" caption.
- **Test:** Build + E2E (dev server required for Cypress).

## Iteration 3 (ux-iteration-3)

- **Done:** Leaderboard: avatar circles (initials from displayName or address), display names when API returns them (fallback truncated address); pot feed banner on home ("Feed now—gasless stake!") dismissible via localStorage; results page Share recap (navigator.share or copy link + "Reached Q15—join!"); ArenaFooter on results.
## Iteration 4 (ux-iteration-4)

- **Done:** Post-game: confetti on /results?outcome=win (canvas-confetti); loss feedback on ?outcome=loss ("Practice hard trivia"); gasless claim copy on win. Theme: dark / light / high-contrast via footer toggle (ThemeProvider + data-theme, localStorage); CSS variables in globals.css for each theme; WCAG-friendly high-contrast palette.

## Iteration 5 (ux-iteration-5)

- **Done:** Error handling: feed-pot and lobby/leaderboard show "Network busy—retry gasless?" (or "Retry") with Retry button on API failure. Mobile-first: viewport meta, responsive padding p-4 sm:p-6 and max-w-md on all main pages. Vercel: miniapp/vercel.json (build from miniapp); deploy with `cd miniapp && npx vercel` or connect repo with root directory `miniapp`.

## Summary

- **Branches:** ux-iteration-1 … ux-iteration-5 (each commit as described). Merge ux-iteration-5 for full UX stack.
- **Tests:** `npm run build:miniapp` (root) or `cd miniapp && npm run build`. E2E: `cd miniapp && npm run dev` (separate terminal) then `npm run test:e2e`. Lighthouse: run against production or `npm run dev` (aim >90 accessibility, >90 perf).
- **Preview:** Deploy miniapp to Vercel (root directory: miniapp). Preview URL per PR when Vercel is connected.
- **Base compliance:** High contrast (WCAG AA), tooltips, disclaimer ("Skill-based contest; no purchase necessary"), gasless previews ("0 gas—sponsored!").
