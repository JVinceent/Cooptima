// All data for the Cooptima mockup lives in this one file.
// Replace it later with real data; screens only read from here.
//
// Two clearly separate parts:
//   1. PROPOSAL  - real figures from the proposal (Aling Tina's case)
//   2. SAMPLE    - made-up placeholders so the screens look complete
// Totals are computed from both so the numbers add up across screens.

// ---------------------------------------------------------------------------
// 1. PROPOSAL (real case)
// ---------------------------------------------------------------------------
export const proposal = {
  coopName: 'San Pedro MPC',
  farmer: {
    name: 'Aling Tina',
    crop: 'Tomatoes',
    areaM2: 4000, // about 4,000 m²
    yearsWithCoop: 9,
    borrowingSince: 2017, // 9 years with the coop
  },
  loan: 12000, // seeds and fertilizer
  soldKg: 700,
  pricePerKg: 30,
  truckShare: 800, // per farm, 5 farms share one truck
  cashAtPickup: 1400, // for pickers
  biyaheroPerKg: 12, // farm-gate offer
  farmsPerTruck: 5,
  forecastAlertWeeksBefore: 2,
}

// Aling Tina's settlement, worked out from the proposal figures above
const tinaSale = proposal.soldKg * proposal.pricePerKg // 21,000
export const tinaReceipt = {
  kg: proposal.soldKg,
  pricePerKg: proposal.pricePerKg,
  sale: tinaSale, // 21,000
  loanPaid: proposal.loan, // 12,000, fully paid
  truckShare: proposal.truckShare, // 800
  cashAtPickup: proposal.cashAtPickup, // 1,400
  balance: tinaSale - proposal.loan - proposal.truckShare - proposal.cashAtPickup, // 6,800
}

// ---------------------------------------------------------------------------
// 2. SAMPLE placeholders (not real: replace later)
// ---------------------------------------------------------------------------
export type Member = {
  id: number
  name: string
  crop: string
  kg: number // expected / weighed volume (tomatoes only)
  loan: number
  repaysFrom: string
  plantedOn?: string // ISO date, sample placeholder (only set for tomato members)
  readyOn?: string // ISO date the harvest is expected, sample placeholder (tomato members)
}

// Tina's kg and loan come from the proposal; the other members are placeholders.
export const members: Member[] = [
  { id: 1, name: proposal.farmer.name, crop: 'Tomatoes', kg: proposal.soldKg, loan: proposal.loan, repaysFrom: 'Dec 7 pickup', plantedOn: '2026-09-15', readyOn: '2026-12-07' },
  { id: 2, name: 'Member 2', crop: 'Tomatoes', kg: 650, loan: 10000, repaysFrom: 'Dec 7 pickup', plantedOn: '2026-09-12', readyOn: '2026-12-07' },
  { id: 3, name: 'Member 3', crop: 'Tomatoes', kg: 800, loan: 15000, repaysFrom: 'Dec 7 pickup', plantedOn: '2026-09-15', readyOn: '2026-12-07' },
  { id: 4, name: 'Member 4', crop: 'Tomatoes', kg: 600, loan: 8000, repaysFrom: 'Dec 7 pickup', plantedOn: '2026-09-20', readyOn: '2026-12-10' },
  { id: 5, name: 'Member 5', crop: 'Tomatoes', kg: 700, loan: 12000, repaysFrom: 'Dec 7 pickup', plantedOn: '2026-09-22', readyOn: '2026-12-14' },
  { id: 6, name: 'Member 6', crop: 'Squash', kg: 0, loan: 9000, repaysFrom: 'Late Dec harvest' },
  { id: 7, name: 'Member 7', crop: 'Pechay', kg: 0, loan: 6000, repaysFrom: 'Jan harvest' },
]

export const tomatoMembers = members.filter((m) => m.crop === 'Tomatoes')

export const sample = {
  grade: 'Grade A',
  deposit: 7000, // Buyer A deposit before pickup
  pickupWeek: 'Week of Dec 7',
  pickupDay: 'Mon, Dec 7',
  pickupTime: '7:00 AM',
  farmPlanted: 'Sep 15',
  farmExpectedHarvest: 'Week of Dec 7',
  loanDate: 'Sep 8',
  forecastAlertSent: 'Nov 23',
  postSentOn: 'Nov 24',
  trucker: { name: 'Trucker A', short: 'TA', trucks: 1, plate: 'NBC 4821', capacityKg: 4000 }, // plate and capacity: placeholders
  buyerA: 'Buyer A',
  buyerB: 'Buyer B',
  buyerOffers: [
    { buyer: 'Buyer A', pricePerKg: 30, kg: 3450, deposit: 7000, allHarvest: true },
    { buyer: 'Buyer B', pricePerKg: 26, kg: 2000, deposit: 4000, allHarvest: false },
  ],
  // Other cooperatives' posts (buyer screens)
  otherPosts: [
    { crop: 'Ampalaya', kg: 1200, coop: 'Cooperative B', pickup: 'pickup week of Dec 14' },
    { crop: 'Sitaw', kg: 900, coop: 'Cooperative C', pickup: 'pickup week of Dec 21' },
  ],
  // Manager "Pool trucks" trips
  trips: [
    { weekday: 'Mon', date: 'Dec 7', title: 'Tomatoes, first picking', detail: '5 pickups, about 3,450 kg, Trucker A', status: 'needs-ok' as const },
    { weekday: 'Thu', date: 'Dec 10', title: 'Tomatoes, second picking', detail: '5 pickups, Trucker A', status: 'draft' as const },
    { weekday: 'Mon', date: 'Dec 14', title: 'Tomatoes, third picking', detail: '5 pickups, Trucker A', status: 'draft' as const },
  ],
  // Manager "Forecast" chart opens on this Monday; the arrows move it a week at a time
  forecastStart: '2026-11-30',
  today: '2026-11-25', // the mockup's "now"; used for alert-sent and days-to-harvest
  plantingCheck: { members: 6, month: 'March' },
  // Coop earnings rates: PLACEHOLDERS, not San Pedro MPC's real rates. Replace with the real ones.
  coopRates: { interestPctPerMonth: 1.5, months: 3, marketingFeePerKg: 1 },
  // Trucker screens
  truckerTrips: {
    // start is a placeholder (assumed to be the usual 7 AM)
    newBooking: { date: 'Mon, Dec 14', detail: 'Tomatoes, 5 pickups, then to Buyer A', start: '7:00 AM' },
    today: { label: 'Today, Mon Dec 7', detail: '5 pickups, 1 done', done: 1 }, // done = pickups finished so far
    upcoming: { label: 'Thu, Dec 10', detail: '5 pickups' },
    week: { trips: 2 }, // trips this week (Dec 7 to 13): today's and Thu Dec 10
  },
  // Farmer SMS thread
  sms: [
    { date: 'Mon, Nov 23', text: "Aling Tina, your tomatoes should be ready in about 2 weeks. We're pooling one truck with 4 nearby farms." },
    { date: 'Sat, Dec 5', text: 'Pickup: Mon, Dec 7, 7 AM at your farm gate. Price P30/kg, Grade A. Please use crates.' },
  ],
  // Buyer "My orders" progress
  orderTimeline: { offerSent: 'Nov 24', accepted: 'Nov 25' },
}

// ---------------------------------------------------------------------------
// Totals (computed so every screen agrees)
// ---------------------------------------------------------------------------
const tomatoKg = tomatoMembers.reduce((sum, m) => sum + m.kg, 0) // 3,450
const tomatoLoans = tomatoMembers.reduce((sum, m) => sum + m.loan, 0) // 57,000
const saleTotal = tomatoKg * proposal.pricePerKg // 103,500
const truckTotal = proposal.truckShare * proposal.farmsPerTruck // 4,000

export const totals = {
  farms: tomatoMembers.length, // 5
  kg: tomatoKg,
  saleTotal,
  loansTotal: tomatoLoans,
  truckTotal,
  toFarmers: saleTotal - tomatoLoans - truckTotal, // 42,500
  balanceAfterDeposit: saleTotal - sample.deposit, // 96,500 (buyer pays on delivery)
  perKgMoreThanBiyahero: proposal.pricePerKg - proposal.biyaheroPerKg, // 18
}

// Trucker pay per trip. ASSUMPTION, not confirmed with the coop: the trucker is paid the whole truck cost
// the farms share (P800 x 5 farms). Payout timing is unknown, so no screen states one.
export const truckerPay = { perTrip: truckTotal, farmShare: proposal.truckShare, farms: proposal.farmsPerTruck }

// Trucker "Map": farmers asking for a truck near the route to the buyer. SAMPLE placeholders. Assumed to be coop
// members and to pay the usual per-farm share (UNCONFIRMED). x and y place the pin on the drawn map (MapArt).
export const onMyWayKm = 3 // "on my way" means a detour of this many km or less
export const truckerRequests = [
  { pin: 'A', farmer: 'Mang Rodel', crop: 'Ampalaya', kg: 300, detourKm: 1.2, x: 222, y: 118 },
  { pin: 'B', farmer: 'Aling Nena', crop: 'Sitaw', kg: 450, detourKm: 2.5, x: 405, y: 195 },
  { pin: 'C', farmer: 'Mang Ben', crop: 'Talong', kg: 180, detourKm: 6, x: 350, y: 52 },
]

// The shared workflow spine: one harvest lot moves through these stages. Each role reads the same `stage`.
// The stage ids are defined in src/workflow.ts. The tomato lot is at 'offer' in this mockup (Nov 25):
// the forecast alert is out, the buyer has offered, and the manager still has to OK the truck and the buyer.
export const lot = {
  crop: 'Tomatoes',
  stage: 'offer' as const,
}

// Farmer "Farm" and "Market" screens. SAMPLE placeholders: the health reading will come from satellite
// imagery later, and the market prices from a real price source. Neither is real data yet.
export const farmHealth = {
  status: 'Healthy',
  source: 'Satellite',
  checked: 'Nov 24',
  note: 'Leaves are green and the crop is growing well.',
}
// Farmer "Market" news. SAMPLE text (the coop lines match this mockup's numbers); real news comes later.
export const marketNews = [
  { tag: 'Coop', date: 'Nov 24', text: 'Buyer A confirmed ₱30 per kg for Grade A tomatoes this season.' },
  { tag: 'Market', date: 'Nov 23', text: 'Tomato prices are up ₱1 this week as supply slows.' },
  { tag: 'Coop', date: 'Nov 22', text: 'Please use crates on pickup day. Extra crates are at the coop office.' },
]
export const tomatoMarket = {
  // Market price per kg, one reading a week (the last one is this week)
  weeks: [
    { label: 'Oct 5', price: 22 },
    { label: 'Oct 12', price: 23 },
    { label: 'Oct 19', price: 25 },
    { label: 'Oct 26', price: 24 },
    { label: 'Nov 2', price: 26 },
    { label: 'Nov 9', price: 27 },
    { label: 'Nov 16', price: 28 },
    { label: 'Nov 23', price: 29 },
  ],
}

// Forecast: one record per crop. Tomatoes come from the members above, so every screen agrees.
// Squash and Pechay are SAMPLE placeholders (dates, kg, prices, extra farms): replace with real records.
// The timeline bar and the alert date are derived from the farms' harvest dates (see src/forecast.ts).
export type FarmRecord = { name: string; loan: number; kg: number; plantedOn: string; readyOn: string }
export type CropSeason = {
  crop: string
  pricePerKg: number
  color: string
  farms: FarmRecord[]
}

export const cropSeasons: CropSeason[] = [
  {
    crop: 'Tomatoes',
    pricePerKg: proposal.pricePerKg,
    color: '#F2A06E',
    farms: tomatoMembers.flatMap((m) =>
      m.plantedOn && m.readyOn ? [{ name: m.name, loan: m.loan, kg: m.kg, plantedOn: m.plantedOn, readyOn: m.readyOn }] : [],
    ),
  },
  {
    crop: 'Squash',
    pricePerKg: 20,
    color: '#B5DB97',
    farms: [
      { name: 'Member 6', loan: 9000, kg: 900, plantedOn: '2026-09-28', readyOn: '2026-12-28' },
      { name: 'Member 8', loan: 7000, kg: 750, plantedOn: '2026-10-02', readyOn: '2026-12-28' },
      { name: 'Member 9', loan: 8000, kg: 600, plantedOn: '2026-10-06', readyOn: '2027-01-04' },
    ],
  },
  {
    crop: 'Pechay',
    pricePerKg: 25,
    color: '#B5DB97',
    farms: [
      { name: 'Member 7', loan: 6000, kg: 500, plantedOn: '2026-11-18', readyOn: '2027-01-04' },
      { name: 'Member 10', loan: 5000, kg: 450, plantedOn: '2026-11-20', readyOn: '2027-01-04' },
      { name: 'Member 11', loan: 4000, kg: 600, plantedOn: '2026-11-22', readyOn: '2027-01-11' },
      { name: 'Member 12', loan: 5000, kg: 400, plantedOn: '2026-11-25', readyOn: '2027-01-11' },
    ],
  },
]

// Buyer "Find farmers": every farm the buyer can order from, with a spot on the drawn farm map.
// Tomato farms sit at the same spots as the trucker's route. The buyer's location is the middle of the map, so
// farmers appear all around "You". SAMPLE placeholders: the Squash, Pechay and other-crop spots, the other
// crops' prices and dates, and the km scale.
export type BuyerFarmer = {
  id: string
  farmer: string
  coop: string
  crop: string
  kg: number
  pricePerKg: number
  readyOn: string // ISO date the harvest is ready
  distanceKm: number // from the buyer, worked out from the map spot
  x: number
  y: number
}
export const buyerSpot = { x: 320, y: 150 }
const kmFromBuyer = (x: number, y: number) => Math.max(1, Math.round(Math.hypot(buyerSpot.x - x, buyerSpot.y - y) * 0.1))
const farmSpots: Record<string, { x: number; y: number }[]> = {
  Tomatoes: [{ x: 60, y: 119 }, { x: 139, y: 199 }, { x: 335, y: 254 }, { x: 479, y: 112 }, { x: 589, y: 199 }],
  Squash: [{ x: 215, y: 70 }, { x: 258, y: 160 }, { x: 440, y: 40 }],
  Pechay: [{ x: 545, y: 62 }, { x: 385, y: 150 }, { x: 110, y: 270 }, { x: 240, y: 300 }],
}
const otherFarms = [
  { farmer: 'Mang Rodel', crop: 'Ampalaya', kg: 300, pricePerKg: 60, readyOn: '2026-12-08', x: 222, y: 118 },
  { farmer: 'Aling Nena', crop: 'Sitaw', kg: 450, pricePerKg: 45, readyOn: '2026-12-10', x: 405, y: 195 },
  { farmer: 'Mang Ben', crop: 'Talong', kg: 180, pricePerKg: 40, readyOn: '2026-12-12', x: 350, y: 52 },
]
export const buyerFarmers: BuyerFarmer[] = [
  ...cropSeasons.flatMap((s) =>
    s.farms.map((f, i) => {
      const spot = farmSpots[s.crop][i]
      return {
        id: `${s.crop}-${i}`, farmer: f.name, coop: proposal.coopName, crop: s.crop, kg: f.kg,
        pricePerKg: s.pricePerKg, readyOn: f.readyOn, distanceKm: kmFromBuyer(spot.x, spot.y), ...spot,
      }
    }),
  ),
  ...otherFarms.map((f) => ({ ...f, id: `${f.crop}-0`, coop: proposal.coopName, distanceKm: kmFromBuyer(f.x, f.y) })),
].sort((a, b) => a.distanceKm - b.distanceKm)
export const buyerCrops = [...new Set(buyerFarmers.map((f) => f.crop))]

// Ampalaya order (sample)
export const ampalayaOrder = {
  kg: 1200,
  pricePerKg: 60,
  total: 1200 * 60, // 72,000
}

// Buyer B offer total (sample)
export const buyerBTotal = 2000 * 26 // 52,000

// ---------------------------------------------------------------------------
// SAMPLE: start page roles and the assistant's greeting for each one
// ---------------------------------------------------------------------------
export type RoleId = 'manager' | 'buyer' | 'farmer' | 'trucker'

export const roles: {
  id: RoleId
  name: string
  device: string
  to: string
  /** Chibi mascot dressed for this role, in public/assets */
  image: string
  greeting: string
}[] = [
  {
    id: 'manager',
    name: 'Manager',
    device: 'Desktop web',
    to: '/manager',
    image: 'chibi-manager.webp',
    greeting: 'Magandang araw po, Manager! May 2 hakbang na naghihintay ng inyong OK.',
  },
  {
    id: 'buyer',
    name: 'Buyer',
    device: 'Desktop web',
    to: '/buyer',
    image: 'chibi-buyer.webp',
    greeting: 'Hello, Buyer A! May bagong harvest post ng kamatis na puwede ninyong alukan.',
  },
  {
    id: 'farmer',
    name: 'Farmer',
    device: 'Phone',
    to: '/farmer',
    image: 'chibi-farmer.webp',
    greeting: 'Magandang araw tay! Tingnan natin magkano bentahan ngayon?',
  },
  {
    id: 'trucker',
    name: 'Trucker',
    device: 'Phone',
    to: '/trucker',
    image: 'chibi-trucker.webp',
    greeting: 'Kumusta, Trucker A! May 5 pickups na naghihintay sa ruta mo.',
  },
]
