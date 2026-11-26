# Forecast Figures and Bar Hover Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a hover popup to the Forecast timeline bars and a "Tomato season at a glance" section (lent, planting range, expected harvest, coop earnings) below the planting-check card, all computed from `sample.ts`.

**Architecture:** New fields live in `src/data/sample.ts` (sample placeholders, derived into `totals`), so every screen reads one source. The popup is a CSS-only tooltip inside each timeline bar; the summary is a plain `Card` with a small CSS grid. No new dependencies.

**Tech Stack:** React 18, TypeScript 5.6, Vite 5, plain CSS in `src/styles.css`.

**Spec:** `docs/superpowers/specs/2026-11-25-forecast-figures-design.md`

## Global Constraints

- Tomato kg everywhere is **3,450 kg** (the sum over `tomatoMembers`); the popup and the cards read the same value, never a typed-in copy.
- Keep the current look: reuse `Card`, `.h-card`, `.h-num`, `.muted`, `.small`; no new colours outside the existing CSS variables.
- No new dependencies. The project has no test runner; verification is `npm run build` (runs `tsc -b`) plus a visual check in `npm run dev`.
- Interest (1.5% a month for 3 months) and marketing fee (₱1/kg) are **sample placeholders**, labelled so in `sample.ts`, kept in the SAMPLE section, not `proposal`.
- The folder is not a git repo, so there are no commit steps.

## Review Focus

- Tooltip on the first row sits above the grid, inside `.table-scroll` (`overflow-x: auto` also clips vertically): it must not be cut off.
- Tooltip on the Pechay bar (last column) must not push the page into horizontal scroll.
- Keyboard user tabbing to a bar sees the same popup as a mouse user.
- Squash and Pechay have no kg data: popup reads "kg estimate pending", never "NaN kg" or "0 kg".
- Coop earns total equals interest plus marketing fee exactly (₱2,565 + ₱3,450 = ₱6,015).

---

### Task 1: Data and format helpers

**Files:**
- Modify: `src/format.ts`
- Modify: `src/data/sample.ts` (`Member` type and `members` list, `sample`, `totals`, new `forecastTips`)

**Interfaces:**
- Produces in `format.ts`: `shortDate(iso: string): string` (e.g. `'2026-09-12'` → `'Sep 12'`, UTC-safe).
- Produces in `sample.ts`:
  - `Member` gains `plantedOn?: string` (ISO date).
  - `sample.coopRates = { interestPctPerMonth: 1.5, months: 3, marketingFeePerKg: 1 }` with a comment marking them placeholders.
  - `totals` gains `plantedFrom: string`, `plantedTo: string` (ISO, min and max of tomato members' `plantedOn`), `kgPerFarm: number` (rounded), `interest: number`, `marketingFee: number`, `coopEarns: number`.
  - `forecastTips: Record<string, string>` keyed by crop name matching `sample.forecastRows[].crop`.

- [ ] **Step 1: Add `shortDate` to `src/format.ts`.** Parse as UTC and format with `toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })`.

- [ ] **Step 2: Add `plantedOn` to the tomato members in `sample.ts`.** Values: Tina `'2026-09-15'`, Member 2 `'2026-09-12'`, Member 3 `'2026-09-15'`, Member 4 `'2026-09-20'`, Member 5 `'2026-09-22'`. Tina's entry keeps matching `sample.farmPlanted` (`'Sep 15'`). Leave Squash and Pechay members without it.

- [ ] **Step 3: Add `sample.coopRates` and the new `totals` fields.**
  - `interest = Math.round(tomatoLoans * (interestPctPerMonth / 100) * months)`
  - `marketingFee = tomatoKg * marketingFeePerKg`
  - `coopEarns = interest + marketingFee`
  - `kgPerFarm = Math.round(tomatoKg / tomatoMembers.length)`
  - `plantedFrom`/`plantedTo` from sorting the defined `plantedOn` values of `tomatoMembers`.
  - Expected: `interest` 2565, `marketingFee` 3450, `coopEarns` 6015, `kgPerFarm` 690, range `2026-09-12` to `2026-09-22`.
  - Note: `sample` is defined before `totals`; reference `sample.coopRates` from the totals block, not the other way round.

- [ ] **Step 4: Add `forecastTips`.** `Tomatoes: \`A total of ${kg(totals.kg)} is expected\`` (import `kg` from `../format`), `Squash` and `Pechay`: `'kg estimate pending'`.

- [ ] **Step 5: Verify.** Run `npm run build`. Expected: exits 0 with no type errors.

### Task 2: Forecast UI (popup, summary section, styles)

**Files:**
- Modify: `src/pages/manager/Forecast.tsx`
- Modify: `src/styles.css` (Forecast block, after `.planting__text .h-card`)

**Interfaces:**
- Consumes: `totals`, `forecastTips`, `sample.forecastRows` from `sample.ts`; `peso`, `kg`, `shortDate` from `format.ts`.
- Produces: `FragmentRow` accepts `tip: string`; new CSS classes `.timeline__tip`, `.timeline__tip--end`, `.glance`, `.glance__label`.

- [ ] **Step 1: Popup markup in `FragmentRow`.** The bar gets `tabIndex={0}`, `aria-describedby` pointing to a child `<span role="tooltip" id=...>` with class `timeline__tip` and text `Info: ${tip}` (use `useId` or `crop`-based id). Pass `forecastTips[row.crop]` from the parent. Bars whose `to` is 9 or more (end at the last column) also get `timeline__tip--end`.

- [ ] **Step 2: Popup styles.** `.timeline__bar` becomes `position: relative`. `.timeline__tip`: hidden by default, absolutely positioned above the bar (`bottom: calc(100% + 8px)`, `left: 0`), dark surface (`var(--ink)` background, white text), `font-size: 14px`, radius 8px, padding `8px 12px`, `white-space: nowrap`, `z-index: 2`. Show on `.timeline__bar:hover .timeline__tip` and `.timeline__bar:focus-visible .timeline__tip`. `--end` variant anchors `right: 0; left: auto`.

- [ ] **Step 3: Stop the scroll box clipping the popup.** In `Forecast.tsx`, give the `.table-scroll` wrapper of the timeline a modifier class (e.g. `table-scroll--tips`) with `padding-top: 52px; margin-top: -52px` so the area above the first row is inside the scrollable box.

- [ ] **Step 4: Summary section.** After the planting-check card, add `<Card as="section" aria-label="Tomato season at a glance">` with `<h2 className="h-card">Tomato season at a glance</h2>` and a `.glance` grid (`display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px; margin-top: 18px`) of four items. Each item: `.glance__label` (`muted small`), value in `.h-num .h-num--md`, one `muted small` line:
  - **Lent this season** → `peso(totals.loansTotal)` ("₱57,000"), line: `${totals.farms} tomato farms`
  - **Planting date range** → `${shortDate(totals.plantedFrom)} to ${shortDate(totals.plantedTo)}` ("Sep 12 to Sep 22"), line: `${totals.farms} farmers`
  - **Expected harvest** → `kg(totals.kg)` ("3,450 kg"), line: `about ${kg(totals.kgPerFarm)} per farm`
  - **Coop earns** → `peso(totals.coopEarns)` ("₱6,015"), two lines: `Interest ${peso(totals.interest)}` and `Marketing fee ${peso(totals.marketingFee)}`

- [ ] **Step 5: Verify build.** Run `npm run build`. Expected: exits 0.

- [ ] **Step 6: Verify visually.** Run `npm run dev`, open the manager Forecast page, and check:
  - Hovering the tomato bar shows "Info: A total of 3,450 kg is expected", fully visible above the bar.
  - Tabbing onto each bar shows its popup; Squash and Pechay read "kg estimate pending".
  - The Pechay popup does not create a horizontal scrollbar.
  - The four figures read ₱57,000 / Sep 12 to Sep 22 / 3,450 kg, about 690 kg per farm / ₱6,015 with ₱2,565 and ₱3,450.
  - Spacing between the new card and the planting card matches the spacing between the existing two cards.
  - At a narrow window (about 800px wide) the four figures wrap cleanly.

## Self-review notes

- Spec coverage: popup (Task 2 steps 1–3), four figures with coop total and breakdown (Task 2 step 4), computed from `sample.ts` (Task 1), placeholder labelling (Task 1 step 3), keyboard focus (Task 2 step 2).
- Types consistent: `forecastTips`, `totals.*`, `shortDate` named identically across tasks.
