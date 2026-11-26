// Forecast logic: where bars sit in the 7-week window, next steps per crop, and season figures.
import { proposal, sample, type CropSeason } from './data/sample'

export const WEEKS_SHOWN = 7
const DAY = 86_400_000
const ms = (iso: string) => Date.parse(`${iso}T00:00:00Z`)
const weeksBetween = (fromIso: string, toIso: string) => Math.round((ms(toIso) - ms(fromIso)) / (7 * DAY))

/** ISO date plus whole days (UTC, so daylight saving never shifts the day). */
export const addDays = (iso: string, days: number) => new Date(ms(iso) + days * DAY).toISOString().slice(0, 10)
export const daysBetween = (fromIso: string, toIso: string) => Math.round((ms(toIso) - ms(fromIso)) / DAY)
const mondayOf = (iso: string) => addDays(iso, -((new Date(ms(iso)).getUTCDay() + 6) % 7))

/** First and last expected harvest date of a crop (ISO). */
export function harvestRange(season: CropSeason) {
  const ready = season.farms.map((f) => f.readyOn).sort() // ISO strings sort by date
  return { from: ready[0], to: ready[ready.length - 1] }
}

/**
 * Grid lines for a crop's bar inside the window that starts on `windowStart` (a Monday).
 * The bar covers the weeks from the first to the last harvest date, so it always agrees with the cards.
 * Grid column 1 holds the crop label, so week 0 is column 2. Returns null when the bar is outside the window;
 * a bar cut off by the window edge is clipped to it.
 */
export function barPlacement(season: CropSeason, windowStart: string) {
  const { from, to } = harvestRange(season)
  const first = weeksBetween(windowStart, mondayOf(from))
  const last = weeksBetween(windowStart, mondayOf(to))
  if (last < 0 || first > WEEKS_SHOWN - 1) return null
  return { from: Math.max(first, 0) + 2, to: Math.min(last, WEEKS_SHOWN - 1) + 3 }
}

/** The alert goes out a set number of weeks before the first harvest; says where the crop stands today. */
export function nextStep(season: CropSeason, today: string = sample.today) {
  const harvestStart = harvestRange(season).from
  const alertDate = addDays(harvestStart, -proposal.forecastAlertWeeksBefore * 7)
  return {
    alertDate,
    alertSent: alertDate <= today,
    daysToAlert: daysBetween(today, alertDate),
    daysToHarvest: daysBetween(today, harvestStart),
  }
}

const sum = (values: number[]) => values.reduce((total, v) => total + v, 0)

/** Figures for the "season at a glance" card, for one crop or several crops combined. */
export function summarize(seasons: CropSeason[]) {
  const farms = seasons.flatMap((s) => s.farms.map((f) => ({ ...f, crop: s.crop, pricePerKg: s.pricePerKg })))
  const loans = sum(farms.map((f) => f.loan))
  const kg = sum(farms.map((f) => f.kg))
  const sale = sum(farms.map((f) => f.kg * f.pricePerKg))
  const planted = farms.map((f) => f.plantedOn).sort()
  const ready = farms.map((f) => f.readyOn).sort()
  const { interestPctPerMonth, months, marketingFeePerKg } = sample.coopRates
  const interest = Math.round(loans * (interestPctPerMonth / 100) * months)
  const marketingFee = kg * marketingFeePerKg
  return {
    farms,
    loans,
    kg,
    sale,
    coverage: loans ? sale / loans : 0, // how many times the expected sales cover the loans
    kgPerFarm: farms.length ? Math.round(kg / farms.length) : 0,
    plantedFrom: planted[0],
    plantedTo: planted[planted.length - 1],
    harvestFrom: ready[0],
    harvestTo: ready[ready.length - 1],
    interest,
    marketingFee,
    coopEarns: interest + marketingFee,
  }
}
