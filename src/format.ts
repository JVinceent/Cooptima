// Small display helpers (not data).
export const peso = (n: number) => `₱${n.toLocaleString('en-US')}`
export const minusPeso = (n: number) => `−${peso(n)}`
export const kg = (n: number) => `${n.toLocaleString('en-US')} kg`
// Two ISO dates as 'Dec 7–14' (same month) or 'Dec 28–Jan 4'.
export const shortRange = (fromIso: string, toIso: string) =>
  fromIso.slice(0, 7) === toIso.slice(0, 7)
    ? `${shortDate(fromIso)}–${new Date(`${toIso}T00:00:00Z`).getUTCDate()}`
    : `${shortDate(fromIso)}–${shortDate(toIso)}`
// '2026-12-28' -> 'Mon, Dec 28'
export const weekdayDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' })
// '2026-09-12' -> 'Sep 12' (read as UTC so the day never shifts with the viewer's timezone)
export const shortDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
