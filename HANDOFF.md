# Cooptima mockup handoff

Cooptima helps a farmers' cooperative pool members' harvests, share one truck, sell to a buyer at a price agreed before pickup, and repay each member's production loan from the sale. This is a **clickable mockup with sample data**: no backend, no login, no real payments.

## Design rules (keep these)

1. Each role sees only its own job. Keep screens neat; no walls of text or technical terms.
2. No made-up facts in the UI beyond the sample data listed below.
3. Don't over-engineer: static sample data, simple components, no state libraries.
4. The manager approves anything involving money or produce. The assistant only suggests.
5. Mascot: at most once per screen, small (56–96px), as the assistant's speech bubble. It's big on one screen only: Harvest settled.

## Look

| Token | Value | Use |
|---|---|---|
| ground | `#F5F3EC` | page background |
| surface | `#FFFFFF` | cards |
| ink | `#1D1F1A` | main text |
| muted | `#4A5045` | secondary text (don't go lighter) |
| line | `#E4E1D7` | dividers, card borders |
| control border | `#8E8A7E` | secondary buttons, inputs |
| green | `#3F8113` | primary buttons, done states |
| green dark | `#2D6410` | green text, active nav |
| green soft | `#EAF3E2` | active nav, success pills |
| orange | `#DD5909` | map plots, brand wordmark ("ptima") |
| orange text | `#A33F00` on `#FCE6D8` | "Needs your OK" pills |
| badge | `#B84A06` | count badges (white text) |
| brand green | `#207A21` | wordmark ("Coo") |

- Fonts: **Poppins 600/700** for headings and big numbers; **DM Sans** for everything else (Google Fonts).
- Sizes: web body 16px, small text 14–15px minimum, page titles 32px. Farmer phone screens use 17px body (the largest).
- Cards: 16px radius, 1px `line` border, no shadows. Buttons are 44–50px tall.

## Screens and routes

The reference files in `/reference` are the visual source. They use a custom canvas format (`<x-dc>`, `<helmet>`); **recreate them in React, don't copy the markup.** Links between them (`href="X.dc.html"`) show the navigation.

| Role | Layout | Screens (reference file) |
|---|---|---|
| Manager (desktop web) | left sidebar | Today `Main`, Members and loans `ManagerMembers`, Farm map `ManagerFarmMap`, Forecast `ManagerForecast`, Pool trucks `ManagerPoolTrucks`, Find buyers `ManagerFindBuyers`, Settle `ManagerSettle`, Harvest settled `ManagerHarvestDone` |
| Buyer (desktop web) | top bar | Harvest posts `Buyer`, My orders `BuyerOrders`, Order `BuyerOrder` |
| Farmer (phone) | bottom tabs | Home `FarmerApp`, Receipts `FarmerReceipt`, Passbook `FarmerPassbook`, plus an SMS mock `Farmer` |
| Trucker (phone) | header | My trips `TruckerTrips`, Today's trip `Trucker`, Drop-off `TruckerDropoff` |

Add a simple start page that links to the four roles. Phone screens can render in a centered 390px-wide frame on desktop.

## Images

In the reference files, images use canvas addresses. Map them to `/assets`:

| In reference | File |
|---|---|
| `/_blob/b9019360ff66cae91bc034586722a132` | `logo-mark.png` |
| `/_blob/a9b4976290fb027221ac2cb8d0e1356e` | `mascot-wave.png` |
| `/_blob/c6f59391f20cc7c633c6d254d0ffaabf` | `mascot-clipboard.png` |
| `/_blob/bc8d7ec9abe0bbfb022b6d4f09a3272e` | `mascot-truck.png` |
| `/_blob/f2309fd7506bf40a7c33d1d05bc521a6` | `mascot-receipt.png` |
| `/_blob/3282cf6ce643e3bb3a00b94cc0b723e3` | `mascot-receipt-large.png` |
| (not used yet) | `mascot-worried.png`: system problems only, never for unpaid loans |

## Data

Put all data in **one file** (`src/data/sample.ts`) so it can be replaced later.

**From the proposal (real case):** Aling Tina, tomato farmer, San Pedro MPC, about 4,000 m², with the coop 9 years. ₱12,000 loan for seeds and fertilizer. 700 kg sold at ₱30/kg = ₱21,000. Loan −₱12,000 (fully paid), truck share −₱800, cash at pickup ₱1,400 (for pickers), balance ₱6,800 paid when the buyer pays. Biyahero farm-gate offer: ₱12/kg. 5 farms share one truck. Forecast alert 2 weeks before harvest.

**Sample placeholders (mark as sample in the data file):** Members 2–7, their volumes (650, 800, 600, 700 kg) and loans (₱10k, ₱15k, ₱8k, ₱12k; squash ₱9k, pechay ₱6k), Buyers A/B, Trucker A, Cooperatives B/C, all dates, Grade A, ₱7,000 deposit, Buyer B ₱26/kg for 2,000 kg, ampalaya ₱60/kg. Totals: 3,450 kg, ₱103,500 sale, ₱57,000 loans, ₱42,500 to farmers.

Keep the numbers consistent: they add up across screens.
