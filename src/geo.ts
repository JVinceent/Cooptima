// Map helpers for "Find loads": distance, the fastest road route, and a place name for a pin.
// Routes come from the public OSRM demo server and names from OpenStreetMap's Nominatim. Both are free services
// meant for light use, fine for this mockup but not for a real app (swap in a paid or self-hosted provider then).
// When either is unreachable the screen still works: the route becomes an estimate and the name the nearest town.
import { places, type Place } from './data/sample'

export type LatLng = { lat: number; lng: number }
export type RouteInfo = { line: [number, number][]; km: number; minutes: number; estimated: boolean }

const rad = (d: number) => (d * Math.PI) / 180
export function distanceKm(a: LatLng, b: LatLng) {
  const h = Math.sin(rad(b.lat - a.lat) / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lng - a.lng) / 2) ** 2
  return 6371 * 2 * Math.asin(Math.sqrt(h))
}

const key = (p: LatLng) => `${p.lat.toFixed(4)},${p.lng.toFixed(4)}`
const routes = new Map<string, RouteInfo>()
const names = new Map<string, string>()

export async function fastestRoute(a: LatLng, b: LatLng, signal?: AbortSignal): Promise<RouteInfo> {
  const id = `${key(a)};${key(b)}`
  const cached = routes.get(id)
  if (cached) return cached
  let info: RouteInfo
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${a.lng},${a.lat};${b.lng},${b.lat}?overview=full&geometries=geojson`
    const res = await fetch(url, { signal })
    const best = (await res.json()).routes?.[0]
    if (!best) throw new Error('no route')
    info = {
      line: best.geometry.coordinates.map(([lng, lat]: [number, number]) => [lat, lng]),
      km: best.distance / 1000,
      minutes: best.duration / 60,
      estimated: false,
    }
  } catch (err) {
    if (signal?.aborted) throw err
    // Offline or refused: a straight line, with road distance and time estimated from it
    const km = distanceKm(a, b) * 1.3
    info = { line: [[a.lat, a.lng], [b.lat, b.lng]], km, minutes: (km / 35) * 60, estimated: true }
  }
  routes.set(id, info)
  return info
}

// A whole trip: start → each farm → drop-off, as one road route split into legs, each with its turns.
// `at` is how far into the leg (in metres) the turn is. Falls back to straight legs with no turns when offline.
export type TurnKind = 'turn' | 'continue' | 'merge' | 'fork' | 'ramp' | 'roundabout'
export type Turn = { kind: TurnKind; modifier: string; road: string; at: number }
export type Leg = { line: [number, number][]; meters: number; minutes: number; turns: Turn[] }
export type TripInfo = { legs: Leg[]; km: number; minutes: number; estimated: boolean }

const trips = new Map<string, TripInfo>()
const kindOf = (type: string): TurnKind | undefined => {
  if (type === 'depart' || type === 'arrive') return undefined
  if (type === 'merge') return 'merge'
  if (type === 'fork') return 'fork'
  if (type.includes('ramp')) return 'ramp'
  if (type.includes('roundabout') || type.includes('rotary')) return 'roundabout'
  if (type === 'continue' || type === 'new name') return 'continue'
  return 'turn'
}

export async function tripRoute(points: LatLng[], signal?: AbortSignal): Promise<TripInfo> {
  const id = points.map(key).join(';')
  const cached = trips.get(id)
  if (cached) return cached
  let info: TripInfo
  try {
    const coords = points.map((p) => `${p.lng},${p.lat}`).join(';')
    const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=false&geometries=geojson&steps=true`, { signal })
    const best = (await res.json()).routes?.[0]
    if (!best) throw new Error('no route')
    const legs: Leg[] = best.legs.map((leg: { distance: number; duration: number; steps: OsrmStep[] }) => {
      const line: [number, number][] = []
      const turns: Turn[] = []
      let at = 0
      for (const step of leg.steps) {
        for (const [lng, lat] of step.geometry.coordinates) line.push([lat, lng])
        const kind = kindOf(step.maneuver.type)
        if (kind && step.distance > 0) turns.push({ kind, modifier: step.maneuver.modifier ?? 'straight', road: step.name ?? '', at })
        at += step.distance
      }
      return { line, meters: leg.distance, minutes: leg.duration / 60, turns }
    })
    info = { legs, km: best.distance / 1000, minutes: best.duration / 60, estimated: false }
  } catch (err) {
    if (signal?.aborted) throw err
    const legs = points.slice(1).map((p, i) => {
      const meters = distanceKm(points[i], p) * 1300
      return { line: [[points[i].lat, points[i].lng], [p.lat, p.lng]] as [number, number][], meters, minutes: (meters / 1000 / 35) * 60, turns: [] }
    })
    info = { legs, km: legs.reduce((n, l) => n + l.meters, 0) / 1000, minutes: legs.reduce((n, l) => n + l.minutes, 0), estimated: true }
  }
  trips.set(id, info)
  return info
}
type OsrmStep = { distance: number; name?: string; maneuver: { type: string; modifier?: string }; geometry: { coordinates: [number, number][] } }

// '300 m' or '2.4 km'
export const meters = (m: number) => (m < 1000 ? `${Math.max(10, Math.round(m / 10) * 10)} m` : `${(m / 1000).toFixed(1)} km`)

// Hand a stop to the trucker's own navigation app
export const navLinks = (p: LatLng) => ({
  google: `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}&travelmode=driving`,
  waze: `https://waze.com/ul?ll=${p.lat},${p.lng}&navigate=yes`,
})

const nearestTown = (p: LatLng): Place =>
  Object.values(places).reduce((best, town) => (distanceKm(p, town) < distanceKm(p, best) ? town : best))

export async function placeName(p: LatLng, signal?: AbortSignal): Promise<string> {
  const id = key(p)
  const cached = names.get(id)
  if (cached) return cached
  let name: string
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=14&accept-language=en&lat=${p.lat}&lon=${p.lng}`
    const a = (await (await fetch(url, { signal })).json()).address ?? {}
    const spot = a.village ?? a.suburb ?? a.quarter ?? a.neighbourhood ?? a.town ?? a.city
    const area = a.city ?? a.town ?? a.municipality ?? a.county ?? a.state
    name = [spot, area !== spot ? area : undefined].filter(Boolean).join(', ')
    if (!name) throw new Error('no name')
  } catch (err) {
    if (signal?.aborted) throw err
    const town = nearestTown(p)
    name = distanceKm(p, town) < 3 ? town.name : `Near ${town.name}`
  }
  names.set(id, name)
  return name
}

// Place search ("market batangas", "Divisoria", "San Pedro town hall"), using Photon, a free OpenStreetMap search.
// Limited to the Philippines and nudged toward places near `near`. Words like "of" or "sa" are dropped first,
// because the search reads them as part of a name ("market of manila" finds better as "market manila").
export type Found = LatLng & { name: string; detail: string }
const FILLER = /\b(of|the|in|at|near|sa|ng|na|mga)\b/gi

export async function searchPlaces(query: string, near: LatLng, signal?: AbortSignal): Promise<Found[]> {
  const q = query.replace(FILLER, ' ').replace(/\s+/g, ' ').trim()
  if (q.length < 2) return []
  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=7&lang=en&bbox=116,4,127,21&lat=${near.lat}&lon=${near.lng}`
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`search failed (${res.status})`)
  const found: Found[] = []
  for (const f of (await res.json()).features ?? []) {
    const p = f.properties ?? {}
    const [lng, lat] = f.geometry.coordinates
    const name = p.name ?? p.street ?? p.city
    if (!name) continue
    const detail = [p.street && p.street !== name ? p.street : undefined, p.city ?? p.county, p.state]
      .filter((part, i, all) => part && part !== name && all.indexOf(part) === i)
      .join(', ')
    // The same place often comes back twice (as a building and as an area); keep the first
    if (!found.some((x) => x.name === name && distanceKm(x, { lat, lng }) < 0.3)) found.push({ lat, lng, name, detail })
  }
  return found
}

export const duration = (minutes: number) => {
  const m = Math.max(1, Math.round(minutes))
  return m < 60 ? `${m} min` : `${Math.floor(m / 60)} hr ${m % 60 ? `${m % 60} min` : ''}`.trim()
}

// '7:00 AM' plus some minutes, as a clock time
export function clockAfter(start: string, minutes: number) {
  const [, h, m, ap] = start.match(/(\d+):(\d+)\s*(AM|PM)/)!
  const total = ((Number(h) % 12) + (ap === 'PM' ? 12 : 0)) * 60 + Number(m) + Math.round(minutes)
  const hh = Math.floor(total / 60) % 24
  return `${hh % 12 || 12}:${String(total % 60).padStart(2, '0')} ${hh < 12 ? 'AM' : 'PM'}`
}
