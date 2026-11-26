import { useState } from 'react'
import { Button } from '../../components/Button'
import { MapArt, routePoints, routeStops, routeToBuyer } from '../../components/MapArt'
import { onMyWayKm, sample, totals, truckerPay, truckerRequests } from '../../data/sample'
import { kg, peso } from '../../format'
import { useT } from '../../i18n'

// My truck sits between the last picked-up stop and the next one.
const done = sample.truckerTrips.today.done
const from = routeStops[Math.max(done - 1, 0)]
const to = routeStops[Math.min(done, routeStops.length - 1)]
const you = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 }

// My stops are white numbered circles (green check once picked up). Farmers asking for a truck are orange
// lettered pins that match the letters in the list; tapping a pin or a row opens that request.
// Adding one checks it against the truck's capacity, and added requests turn green.
export default function MapScreen() {
  const { t, crop } = useT()
  const [onMyWay, setOnMyWay] = useState(true)
  const [selected, setSelected] = useState<string>()
  const [added, setAdded] = useState<string[]>([])
  const [declined, setDeclined] = useState<string[]>([])

  const capacity = sample.trucker.capacityKg
  const addedRequests = truckerRequests.filter((r) => added.includes(r.pin))
  const loadKg = totals.kg + addedRequests.reduce((sum, r) => sum + r.kg, 0)
  const open = truckerRequests.filter(
    (r) => !added.includes(r.pin) && !declined.includes(r.pin) && (!onMyWay || r.detourKm <= onMyWayKm),
  )
  const current = open.find((r) => r.pin === selected) ?? open[0]
  const others = open.filter((r) => r !== current)
  const afterKg = current ? loadKg + current.kg : loadKg
  const fits = afterKg <= capacity
  const lastAdded = truckerRequests.find((r) => r.pin === added[added.length - 1])

  const accept = () => {
    if (!current) return
    setAdded([...added, current.pin])
    setSelected(undefined)
  }
  const decline = () => {
    if (!current) return
    setDeclined([...declined, current.pin])
    setSelected(undefined)
  }

  return (
    <>
      <div className="trk-map">
        <MapArt label={t.mapAria(routeStops.length)} top={-48} bottom={346}>
          <polyline points={routePoints} fill="none" stroke="#FFFFFF" strokeWidth={4} strokeDasharray="8 7" strokeLinecap="round" />

          {routeStops.map((pt, i) =>
            i < done ? (
              <g key={`stop-${i}`}>
                <circle cx={pt.x} cy={pt.y} r={17} fill="#3F8113" stroke="#FFFFFF" strokeWidth={3} />
                <path d={`M${pt.x - 8} ${pt.y}l6 6 10-11`} fill="none" stroke="#FFFFFF" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
              </g>
            ) : (
              <g key={`stop-${i}`}>
                <circle cx={pt.x} cy={pt.y} r={17} fill="#FFFFFF" />
                <text x={pt.x} y={pt.y + 6} className="map-num map-num--md" fill="#1D1F1A">{i + 1}</text>
              </g>
            ),
          )}

          {/* Buyer A, the end of the route */}
          <circle cx={routeToBuyer.x} cy={routeToBuyer.y} r={9} fill="#1D1F1A" stroke="#FFFFFF" strokeWidth={3} />
          <rect x={routeToBuyer.x - 96} y={routeToBuyer.y - 12} width={80} height={24} rx={12} fill="#1D1F1A" />
          <text x={routeToBuyer.x - 56} y={routeToBuyer.y + 5} fill="#FFFFFF" fontSize={13} fontWeight={600} textAnchor="middle">{sample.buyerA}</text>

          {/* Added requests are part of the trip now */}
          {addedRequests.map((r) => (
            <g key={r.pin}>
              <circle cx={r.x} cy={r.y} r={16} fill="#3F8113" stroke="#FFFFFF" strokeWidth={3} />
              <text x={r.x} y={r.y + 6} className="map-num map-num--md" fill="#FFFFFF">{r.pin}</text>
            </g>
          ))}

          {/* Open requests: tap one to see it */}
          {open.map((r) => {
            const isCurrent = r === current
            const pick = () => setSelected(r.pin)
            return (
              <g
                key={r.pin}
                role="button"
                tabIndex={0}
                aria-label={t.requestLabel(r.pin, crop(r.crop), kg(r.kg))}
                style={{ cursor: 'pointer' }}
                onClick={pick}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    pick()
                  }
                }}
              >
                {isCurrent && <circle cx={r.x} cy={r.y} r={24} fill="none" stroke="#FFFFFF" strokeWidth={3} />}
                <circle cx={r.x} cy={r.y} r={16} fill="#DD5909" stroke="#FFFFFF" strokeWidth={3} />
                <text x={r.x} y={r.y + 6} className="map-num map-num--md" fill="#FFFFFF">{r.pin}</text>
              </g>
            )
          })}

          {/* You */}
          <circle cx={you.x} cy={you.y} r={10} fill="#1D1F1A" stroke="#FFFFFF" strokeWidth={3} />
          <rect x={you.x - 20} y={you.y - 38} width={40} height={22} rx={11} fill="#1D1F1A" />
          <text x={you.x} y={you.y - 23} fill="#FFFFFF" fontSize={13} fontWeight={600} textAnchor="middle">{t.you}</text>
        </MapArt>
        <span className="map-chip map-chip--dark map-chip--top">{t.stopsRequests(routeStops.length, open.length)}</span>
      </div>

      <div className="trk-sheet">
        <div className="stack-10">
          <h2 className="h-sub">{t.askingForTruck}</h2>
          <div className="row-gap-12 wrap" role="group" aria-label={t.allNearby}>
            <button type="button" className="chip-btn" aria-pressed={onMyWay} onClick={() => setOnMyWay(true)}>
              {t.onMyWay(sample.buyerA)}
            </button>
            <button type="button" className="chip-btn" aria-pressed={!onMyWay} onClick={() => setOnMyWay(false)}>
              {t.allNearby}
            </button>
          </div>
        </div>

        {lastAdded && (
          <p className="green-text strong">
            {t.added(crop(lastAdded.crop), kg(lastAdded.kg), kg(loadKg), kg(capacity))}
          </p>
        )}

        {current ? (
          <section aria-label={t.requestLabel(current.pin, crop(current.crop), kg(current.kg))} className="peach-card">
            <div className="row-gap-12">
              <span className="num-dot num-dot--sm num-dot--solid-orange">{current.pin}</span>
              <div>
                <div className="h-num h-num--sm">{crop(current.crop)}, {kg(current.kg)}</div>
                <div className="muted small">{t.offRoute(current.farmer, current.detourKm)}</div>
              </div>
            </div>
            <div className="pay-line">
              <span className="h-num h-num--md">{peso(truckerPay.farmShare)}</span>
              <span className="muted small">{t.payForFarm(sample.buyerA)}</span>
            </div>
            <p className={fits ? 'muted small' : 'hot-note small'}>
              {fits ? t.loadAfter(kg(afterKg), kg(capacity)) : t.tooHeavy(kg(afterKg), kg(capacity))}
            </p>
            <div className="btn-row btn-row--phone">
              <Button variant="secondary" size="lg" style={{ flex: 1, borderRadius: 12 }} onClick={decline}>{t.decline}</Button>
              <Button size="lg" style={{ flex: 1.6, borderRadius: 12 }} disabled={!fits} onClick={accept}>{t.addToTrip}</Button>
            </div>
          </section>
        ) : (
          <p className="muted">{added.length > 0 ? t.noMoreRequests : t.noRequests}</p>
        )}

        {others.length > 0 && (
          <div className="stack-10">
            <h3 className="h-sub">{t.moreNearby}</h3>
            <ol aria-label={t.moreNearby} className="stops">
              {others.map((r) => (
                <li key={r.pin}>
                  <button type="button" className="request-row" onClick={() => setSelected(r.pin)}>
                    <span className="num-dot num-dot--sm num-dot--solid-orange">{r.pin}</span>
                    <span className="grow">
                      <span className="strong">{crop(r.crop)}, {kg(r.kg)}</span>
                      <br />
                      <span className="muted small">{t.offRoute(r.farmer, r.detourKm)}</span>
                    </span>
                    <span className="strong">{peso(truckerPay.farmShare)}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </>
  )
}
