import { Link } from 'react-router-dom'
import { Button } from '../../components/Button'
import { Icon } from '../../components/Icon'
import { MapArt, routePoints, routeStops } from '../../components/MapArt'
import { sample, tomatoMembers, totals } from '../../data/sample'
import { kg } from '../../format'
import { useT } from '../../i18n'

// Stop 1 is picked up, stop 2 is next, the rest are waiting.
const NEXT = sample.truckerTrips.today.done

export default function TodayTrip() {
  const { t } = useT()
  const next = tomatoMembers[NEXT]
  return (
    <>
      <div className="trk-map">
        <MapArt label={t.routeAria} top={-48} bottom={346}>
          <polyline
            points={routePoints}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={4}
            strokeDasharray="8 7"
            strokeLinecap="round"
          />
          {routeStops.map((pt, i) => {
            if (i < NEXT) {
              return (
                <g key={i}>
                  <circle cx={pt.x} cy={pt.y} r={17} fill="#3F8113" stroke="#FFFFFF" strokeWidth={3} />
                  <path d={`M${pt.x - 8} ${pt.y}l6 6 10-11`} fill="none" stroke="#FFFFFF" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
                </g>
              )
            }
            if (i === NEXT) {
              return (
                <g key={i}>
                  <circle cx={pt.x} cy={pt.y} r={20} fill="#DD5909" stroke="#FFFFFF" strokeWidth={4} />
                  <text x={pt.x} y={pt.y + 7} className="map-num map-num--lg" fill="#FFFFFF">{i + 1}</text>
                </g>
              )
            }
            return (
              <g key={i}>
                <circle cx={pt.x} cy={pt.y} r={17} fill="#FFFFFF" />
                <text x={pt.x} y={pt.y + 6} className="map-num map-num--md" fill="#1D1F1A">{i + 1}</text>
              </g>
            )
          })}
        </MapArt>
        <span className="map-chip map-chip--dark map-chip--top">{t.pickedUpCount(NEXT, tomatoMembers.length)}</span>
      </div>

      <div className="trk-sheet">
        <section aria-label={t.nextStop(NEXT + 1)} className="peach-card">
          <div>
            <div className="peach-card__eyebrow">{t.nextStop(NEXT + 1)}</div>
            <div className="h-num h-num--sm">{next.name}</div>
            <div className="muted">{t.atFarmGate(kg(next.kg))}</div>
          </div>
          <div className="btn-row btn-row--phone">
            <Button variant="secondary" size="lg" style={{ flex: 1, borderRadius: 12 }}>{t.directions}</Button>
            <Button size="lg" style={{ flex: 1.4, borderRadius: 12 }}>{t.pickedUp}</Button>
          </div>
        </section>

        <ol aria-label={t.allStops} className="stops">
          {tomatoMembers.map((m, i) => {
            const state = i < NEXT ? 'done' : i === NEXT ? 'next' : 'later'
            return (
              <li key={m.id} className={state === 'done' ? 'muted' : undefined}>
                {state === 'done' ? (
                  <span className="num-dot num-dot--done num-dot--sm"><Icon name="check" size={14} strokeWidth={3} /></span>
                ) : (
                  <span className={`num-dot num-dot--sm num-dot--${state === 'next' ? 'solid-orange' : 'later'}`}>{i + 1}</span>
                )}
                <span className={`grow${state === 'next' ? ' strong' : ''}`}>{m.name}</span>
                <span>{state === 'done' ? t.pickedUpKg(kg(m.kg)) : kg(m.kg)}</span>
              </li>
            )
          })}
          <li>
            <span className="drop-dot"><Icon name="warehouse" size={15} strokeWidth={2} /></span>
            <Link to="/trucker/dropoff" className="grow strong">{t.dropOffAt(sample.buyerA)}</Link>
            <span className="strong">{kg(totals.kg)}</span>
          </li>
        </ol>
      </div>
    </>
  )
}
