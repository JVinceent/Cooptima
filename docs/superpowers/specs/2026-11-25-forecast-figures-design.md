# Forecast figures and bar hover: short design

Status: approved by the user on 2026-11-25 ("Use 3,450 kg, go ahead").

## Intent and why
The manager Forecast screen shows only a timeline and the "6 members plan to plant" warning. A cooperative manager needs the money and volume behind it: how much the coop has lent, when planting happened, how much will be harvested, and what the coop earns. The user likes the current spacing and minimalist look and wants it kept.

## Goals
- Hovering (and keyboard-focusing) the tomato bar shows an info popup: "Info: A total of 3,450 kg is expected". The kg comes from the same data as the cards, never a typed-in copy.
- Below the "6 members plan to plant" card, add one clean section, "Tomato season at a glance", with four figures:
  - Lent this season: P57,000
  - Planting date range: Sep 12 to Sep 22 (5 farmers)
  - Expected harvest: 3,450 kg total, about 690 kg per farm
  - Coop earns: total P6,015, with breakdown: interest P2,565 + marketing fee P3,450
- All numbers are computed from `src/data/sample.ts` so every screen agrees.

## Non-goals
- No price slider, crop or season switch, per-member table or weekly volume chart (discussed, not requested yet).
- No change to the timeline layout or the planting-check card.

## Anti-goals
- The popup and the cards must never disagree on kg.
- The new section must not look heavier than the existing cards.

## Constraints
- Reuse existing `Card` and styles; match the current spacing.
- Hover alone is not enough: the popup must also open on keyboard focus.

## Approaches considered
1. **CSS-only tooltip on the bar plus a static card grid.** Smallest change, matches the current style, accessible with `:hover` and `:focus-visible`. **Chosen.**
2. A tooltip library: adds a dependency for one popup. Rejected.
3. A new Forecast tab for the figures: breaks the "keep the screen as it is" wish. Rejected.

## Decisions made with the user
- The tooltip says 3,450 kg (user choice), matching every other screen.

## My calls (not yet confirmed by the user)
- Section title "Tomato season at a glance"; the kg figure is labelled "Expected harvest", not "Avg harvest".
- Squash and Pechay bars get a popup that reads "kg estimate pending", since there is no data for them.
- Planting dates and the interest (1.5% a month for 3 months) and marketing fee (P1/kg) rates are **sample placeholders**, labelled as such in `sample.ts`, not San Pedro MPC's real rates.

## Left to the builder
Exact markup, CSS class names, and where in `sample.ts` the new sample fields live.
