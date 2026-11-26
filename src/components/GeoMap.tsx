// Real street maps for "Find loads": MapLibre with OpenFreeMap's light "Positron" style (free, no key needed),
// with water and parks tinted so the map reads like a ride-hailing app: grey land, white roads, green parks, blue water.
// PinMap: drag the map under a pin that stays in the middle, like Lalamove or Angkas. RouteThumb: a still map of a route.
import { useEffect, useRef, useState } from 'react'
import maplibregl, { type LngLatBoundsLike, type Map as MlMap } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { distanceKm, type LatLng, type Leg } from '../geo'

const STYLE = 'https://tiles.openfreemap.org/styles/positron'
export const MAP_CREDIT = '© OpenFreeMap © OpenStreetMap'

export type End = 'start' | 'end'
const TRUCK = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1D1F1A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 7h12v9H2zM14 10h4l3 3v3h-7z"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>'

// The two route ends look the same everywhere: a square where the trip starts, a triangle where it ends
function endMarker(kind: End | 'truck') {
  const el = document.createElement('span')
  el.className = `map-end map-end--${kind}`
  el.innerHTML = kind === 'truck' ? TRUCK : '<i></i>'
  return el
}

function makeMap(container: HTMLElement, center: LatLng, interactive: boolean) {
  const map = new maplibregl.Map({
    container,
    style: STYLE,
    center: [center.lng, center.lat],
    zoom: 13,
    interactive,
    attributionControl: false,
    dragRotate: false,
    pitchWithRotate: false,
    touchPitch: false,
  })
  map.touchZoomRotate.disableRotation()
  map.on('load', () => {
    // Tint the pale style: blue water, green parks and woods
    for (const layer of map.getStyle().layers) {
      if (layer.type !== 'fill') continue
      if (/water/.test(layer.id)) map.setPaintProperty(layer.id, 'fill-color', '#AFD3EE')
      else if (/park|wood|grass|forest/.test(layer.id)) map.setPaintProperty(layer.id, 'fill-color', '#CFE8C2')
    }
  })
  return map
}

// Runs now if the map's style has loaded, otherwise once it has
const whenReady = (map: MlMap, run: () => void) => (map.isStyleLoaded() ? run() : map.once('load', run))

type PinMapProps = {
  /** Where the pin is now. The map flies there whenever `focusKey` changes. */
  center: LatLng
  focusKey: string
  /** What the pin stands for, and the words floating above it */
  pin: { kind: End; label: string }
  /** The other end of the trip, shown as a fixed marker */
  other?: { at: LatLng; kind: End }
  /** Called when the map stops moving, with the spot under the pin */
  onSettle: (spot: LatLng) => void
  label: string
}

export function PinMap({ center, focusKey, pin, other, onSettle, label }: PinMapProps) {
  const el = useRef<HTMLDivElement>(null)
  const map = useRef<MlMap>()
  const marker = useRef<maplibregl.Marker>()
  const settle = useRef(onSettle)
  settle.current = onSettle
  const [moving, setMoving] = useState(false)

  useEffect(() => {
    const m = makeMap(el.current!, center, true)
    m.on('movestart', () => setMoving(true))
    m.on('moveend', () => {
      setMoving(false)
      const c = m.getCenter()
      settle.current({ lat: c.lat, lng: c.lng })
    })
    map.current = m
    return () => m.remove()
  }, [])

  // Fly to the pin's spot when the end being set changes, or a searched place is picked
  useEffect(() => {
    map.current?.flyTo({ center: [center.lng, center.lat], zoom: Math.max(map.current.getZoom(), 14), duration: 700 })
  }, [focusKey])

  useEffect(() => {
    marker.current?.remove()
    marker.current = undefined
    if (other && map.current) {
      marker.current = new maplibregl.Marker({ element: endMarker(other.kind) }).setLngLat([other.at.lng, other.at.lat]).addTo(map.current)
    }
  }, [other?.at.lat, other?.at.lng, other?.kind])

  return (
    <div className="geo-map">
      <div ref={el} className="geo-map__canvas" role="application" aria-label={label} />
      <div className={`center-pin center-pin--${pin.kind}${moving ? ' is-moving' : ''}`} aria-hidden="true">
        <span className="center-pin__label">{pin.label}</span>
        <span className="center-pin__head" />
        <span className="center-pin__stem" />
        <span className="center-pin__shadow" />
      </div>
    </div>
  )
}

type RouteThumbProps = { from: LatLng; to: LatLng; line: [number, number][]; label: string }

// A still map that fits the whole route, with the truck at the start and a triangle at the drop-off
export function RouteThumb({ from, to, line, label }: RouteThumbProps) {
  const el = useRef<HTMLDivElement>(null)
  const map = useRef<MlMap>()
  const markers = useRef<maplibregl.Marker[]>([])

  useEffect(() => {
    const m = makeMap(el.current!, from, false)
    map.current = m
    return () => m.remove()
  }, [])

  useEffect(() => {
    const m = map.current
    if (!m) return
    const coords = line.map(([lat, lng]) => [lng, lat] as [number, number])
    whenReady(m, () => {
      const data = { type: 'Feature' as const, properties: {}, geometry: { type: 'LineString' as const, coordinates: coords } }
      const source = m.getSource('route') as maplibregl.GeoJSONSource | undefined
      if (source) source.setData(data)
      else {
        m.addSource('route', { type: 'geojson', data })
        m.addLayer({ id: 'route-casing', type: 'line', source: 'route', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#FFFFFF', 'line-width': 8 } })
        m.addLayer({ id: 'route-line', type: 'line', source: 'route', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#3F8113', 'line-width': 4 } })
      }
    })
    markers.current.forEach((mk) => mk.remove())
    markers.current = [
      new maplibregl.Marker({ element: endMarker('end') }).setLngLat([to.lng, to.lat]).addTo(m),
      new maplibregl.Marker({ element: endMarker('truck') }).setLngLat([from.lng, from.lat]).addTo(m),
    ]
    const bounds = coords.reduce(
      (b, c) => b.extend(c),
      new maplibregl.LngLatBounds([from.lng, from.lat], [from.lng, from.lat]).extend([to.lng, to.lat]),
    )
    m.fitBounds(bounds as LngLatBoundsLike, { padding: 28, duration: 0 })
  }, [from, to, line])

  return <div ref={el} className="route-thumb" role="img" aria-label={label} />
}

// ---------------------------------------------------------------------------
// TripMap: the whole trip (start → farms → drop-off) for the route details and the trip guide.
// Farms are numbered; picked-up farms turn into green checks and the legs already driven turn grey.
// `drive` animates the truck along one leg on the real road while the camera follows it.
// ---------------------------------------------------------------------------
const DRIVE_MS = 5000
const CHECK = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg>'

function stopMarker(n: number, state: 'done' | 'next' | 'later') {
  const el = document.createElement('span')
  el.className = `map-stop map-stop--${state}`
  el.innerHTML = state === 'done' ? CHECK : String(n)
  return el
}

const lineData = (line: [number, number][]) => ({
  type: 'Feature' as const,
  properties: {},
  geometry: { type: 'LineString' as const, coordinates: line.map(([lat, lng]) => [lng, lat]) },
})

type TripMapProps = {
  legs?: Leg[]
  stops: LatLng[]
  end: LatLng
  /** Farms already picked up (they show as checks) */
  picked: number
  /** The stop being headed to (highlighted), or -1 for none */
  target: number
  /** Legs already driven (drawn grey) */
  drivenLegs: number
  truck?: LatLng
  /** Change `key` to drive the truck along legs[leg] */
  drive?: { key: string; leg: number }
  onProgress?: (metres: number) => void
  onDriven?: () => void
  /** The map fits these points whenever focusKey changes */
  focus: LatLng[]
  focusKey: string
  padding?: { top: number; bottom: number; left: number; right: number }
  still?: boolean
  className: string
  label: string
}

export function TripMap(props: TripMapProps) {
  const { legs, stops, end, picked, target, drivenLegs, truck, drive, focus, focusKey, padding, still, className, label } = props
  const el = useRef<HTMLDivElement>(null)
  const map = useRef<MlMap>()
  const pins = useRef<maplibregl.Marker[]>([])
  const truckPin = useRef<maplibregl.Marker>()
  const progress = useRef(props.onProgress)
  const driven = useRef(props.onDriven)
  progress.current = props.onProgress
  driven.current = props.onDriven

  useEffect(() => {
    const m = makeMap(el.current!, focus[0] ?? end, !still)
    map.current = m
    return () => {
      // Markers belong to this map; forget them so a re-made map gets its own
      pins.current = []
      truckPin.current = undefined
      m.remove()
    }
  }, [])

  // The route: everything in green, the legs already driven in grey on top
  useEffect(() => {
    const m = map.current
    if (!m || !legs) return
    const all = legs.flatMap((l) => l.line)
    const done = legs.slice(0, drivenLegs).flatMap((l) => l.line)
    whenReady(m, () => {
      const set = (id: string, line: [number, number][]) => (m.getSource(id) as maplibregl.GeoJSONSource | undefined)?.setData(lineData(line))
      if (m.getSource('trip')) {
        set('trip', all)
        set('trip-done', done)
        return
      }
      m.addSource('trip', { type: 'geojson', data: lineData(all) })
      m.addSource('trip-done', { type: 'geojson', data: lineData(done) })
      const layout = { 'line-cap': 'round' as const, 'line-join': 'round' as const }
      m.addLayer({ id: 'trip-casing', type: 'line', source: 'trip', layout, paint: { 'line-color': '#FFFFFF', 'line-width': 9 } })
      m.addLayer({ id: 'trip-line', type: 'line', source: 'trip', layout, paint: { 'line-color': '#3F8113', 'line-width': 5 } })
      m.addLayer({ id: 'trip-done', type: 'line', source: 'trip-done', layout, paint: { 'line-color': '#A9A69C', 'line-width': 5 } })
    })
  }, [legs, drivenLegs])

  // Farm markers and the drop-off
  useEffect(() => {
    const m = map.current
    if (!m) return
    pins.current.forEach((p) => p.remove())
    pins.current = [
      new maplibregl.Marker({ element: endMarker('end') }).setLngLat([end.lng, end.lat]).addTo(m),
      ...stops.map((s, i) =>
        new maplibregl.Marker({ element: stopMarker(i + 1, i < picked ? 'done' : i === target ? 'next' : 'later') })
          .setLngLat([s.lng, s.lat])
          .addTo(m),
      ),
    ]
  }, [stops, end, picked, target])

  // The truck, where it is resting
  useEffect(() => {
    const m = map.current
    if (!m) return
    if (!truck) {
      truckPin.current?.remove()
      truckPin.current = undefined
      return
    }
    if (truckPin.current) truckPin.current.setLngLat([truck.lng, truck.lat])
    else truckPin.current = new maplibregl.Marker({ element: endMarker('truck') }).setLngLat([truck.lng, truck.lat]).addTo(m)
  }, [truck?.lat, truck?.lng])

  useEffect(() => {
    const m = map.current
    if (!m || focus.length === 0) return
    const bounds = focus.reduce(
      (b, p) => b.extend([p.lng, p.lat]),
      new maplibregl.LngLatBounds([focus[0].lng, focus[0].lat], [focus[0].lng, focus[0].lat]),
    )
    m.fitBounds(bounds as LngLatBoundsLike, { padding: padding ?? 28, duration: still ? 0 : 700, maxZoom: 15 })
  }, [focusKey])

  // Drive: move the truck along the leg on the real road, with the camera following
  useEffect(() => {
    const m = map.current
    const leg = drive && legs?.[drive.leg]
    if (!m || !leg || !truckPin.current) return
    const pts = leg.line
    const cum = [0]
    for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + distanceKm({ lat: pts[i - 1][0], lng: pts[i - 1][1] }, { lat: pts[i][0], lng: pts[i][1] }))
    const total = cum[cum.length - 1]
    const last = pts[pts.length - 1]
    const finish = () => {
      truckPin.current?.setLngLat([last[1], last[0]])
      progress.current?.(leg.meters)
      driven.current?.()
    }
    if (total === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish()
      return
    }
    const zoom = leg.meters < 4000 ? 15 : leg.meters < 20000 ? 13 : 11.5
    let raf = 0
    let started: number | undefined
    let i = 1
    const tick = (now: number) => {
      started ??= now
      const f = Math.min(1, (now - started) / DRIVE_MS)
      const eased = f < 0.5 ? 2 * f * f : 1 - (-2 * f + 2) ** 2 / 2
      const d = eased * total
      while (i < cum.length - 1 && cum[i] < d) i++
      const span = cum[i] - cum[i - 1] || 1
      const k = Math.min(1, Math.max(0, (d - cum[i - 1]) / span))
      const lat = pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k
      const lng = pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k
      truckPin.current?.setLngLat([lng, lat])
      m.jumpTo({ center: [lng, lat] })
      progress.current?.(eased * leg.meters)
      if (f < 1) raf = requestAnimationFrame(tick)
      else finish()
    }
    m.easeTo({ center: [pts[0][1], pts[0][0]], zoom, duration: 600 })
    const wait = setTimeout(() => (raf = requestAnimationFrame(tick)), 650)
    return () => {
      clearTimeout(wait)
      cancelAnimationFrame(raf)
    }
  }, [drive?.key])

  return <div ref={el} className={className} role={still ? 'img' : 'application'} aria-label={label} />
}
