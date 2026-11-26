import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Icon } from '../../components/Icon'
import { MAP_CREDIT, TripMap } from '../../components/GeoMap'
import { RoundBack } from '../../components/RoundBack'
import { useChosen } from '../../chosen'
import { kg, peso } from '../../format'
import { duration, meters, navLinks, tripRoute, type TripInfo } from '../../geo'
import { useT } from '../../i18n'

const KG_STEP = 10 // the kilos stepper at the farm gate moves this much
// The turn arrow points this way for each kind of turn (degrees from straight ahead)
const ARROW: Record<string, number> = {
  straight: 0, 'slight right': 45, right: 90, 'sharp right': 135, uturn: 180, 'sharp left': -135, left: -90, 'slight left': -45,
}

function TurnArrow({ modifier }: { modifier: string }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true" style={{ transform: `rotate(${ARROW[modifier] ?? 0}deg)` }}>
      <path d="M12 20V5M6 11l6-6 6 6" />
    </svg>
  )
}

// Slide the knob to the end to confirm (like Lalamove's "Arrived"), so a bump in the road can't press it.
// A plain tap asks the question instead, and the keyboard can press the knob, so nobody has to drag.
function SlideToConfirm(props: { label: string; question: string; yes: string; no: string; onConfirm: () => void }) {
  const track = useRef<HTMLDivElement>(null)
  const start = useRef(0)
  const [x, setX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [asking, setAsking] = useState(false)
  const KNOB = 48
  const max = () => (track.current?.clientWidth ?? 320) - KNOB - 8

  const down = (e: PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    start.current = e.clientX
    setDragging(true)
  }
  const move = (e: PointerEvent<HTMLButtonElement>) => {
    if (dragging) setX(Math.min(max(), Math.max(0, e.clientX - start.current)))
  }
  const up = (e: PointerEvent<HTMLButtonElement>) => {
    if (!dragging) return
    setDragging(false)
    if (x >= max() * 0.88) {
      setX(max())
      props.onConfirm()
      return
    }
    if (Math.abs(e.clientX - start.current) < 6) setAsking(true)
    setX(0)
  }

  if (asking) {
    return (
      <div className="slide-ask" role="group" aria-label={props.question}>
        <p className="slide-ask__q">{props.question}</p>
        <div className="slide-ask__btns">
          <button type="button" className="wide-btn wide-btn--outline wide-btn--sm" onClick={() => setAsking(false)}>{props.no}</button>
          <button type="button" className="wide-btn wide-btn--sm" onClick={props.onConfirm}>{props.yes}</button>
        </div>
      </div>
    )
  }
  return (
    <div ref={track} className="slide">
      <span className="slide__fill" style={{ width: x + KNOB + 8 }} />
      <span className="slide__label" aria-hidden="true">{props.label}</span>
      <button
        type="button"
        className={`slide__knob${dragging ? ' is-dragging' : ''}`}
        style={{ transform: `translateX(${x}px)` }}
        aria-label={props.question}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={() => { setDragging(false); setX(0) }}
        onClick={(e) => e.detail === 0 && props.onConfirm()}
      >
        <Icon name="next" size={22} strokeWidth={2.4} />
      </button>
    </div>
  )
}

// The trip guide: drive the confirmed route farm by farm, then to the drop-off.
// Each leg: Start driving (the truck follows the real road) → slide "Arrived" → confirm kilos → Picked up.
// At the drop-off: slide "Arrived" → Mark delivered → the trip summary.
export default function TripGuide() {
  const { t } = useT()
  const { trip, updateTrip, setChosen } = useChosen()
  const go = useNavigate()
  const route = trip?.route
  const [info, setInfo] = useState<TripInfo>()
  const [drive, setDrive] = useState<{ key: string; leg: number }>()
  const [travelled, setTravelled] = useState(0)
  const [kgNow, setKgNow] = useState(0)

  useEffect(() => {
    if (trip?.status === 'booked') updateTrip({ status: 'driving' })
  }, [])

  useEffect(() => {
    if (!route) return
    const stop = new AbortController()
    tripRoute([route.from, ...route.stops, route.to], stop.signal).then(setInfo, () => {})
    return () => stop.abort()
  }, [route?.id])

  // At a farm gate the kilos start at what the farm expects to hand over
  useEffect(() => {
    if (route && trip?.phase === 'arrived' && trip.stop < route.stops.length) setKgNow(route.stops[trip.stop].kg)
  }, [trip?.stop, trip?.phase])

  if (!trip || !route) return <Navigate to="/trucker/map" replace />

  const n = route.stops.length
  const { stop, phase } = trip
  const atDrop = stop >= n
  const target = atDrop ? route.to : route.stops[stop]
  const name = atDrop ? route.to.name : route.stops[stop].farmer
  const truckAt = phase === 'toStop' ? (stop === 0 ? route.from : route.stops[stop - 1]) : target
  const onTruck = trip.pickedKg.reduce((sum, k) => sum + k, 0)
  const leg = info?.legs[stop]
  const driving = drive !== undefined

  // Trip done: what was delivered and what the trucker earned
  if (trip.status === 'done') {
    return (
      <div className="find-page">
        <header className="find-head">
          <RoundBack to="/trucker" label={t.back} />
        </header>
        <main className="find-page__body">
          <div className="find-done">
            <span className="find-done__check"><Icon name="check" size={28} strokeWidth={2.4} /></span>
            <h1>{t.delivered}</h1>
            <p className="find-note">{t.haveBeenTold(route.to.name)}</p>
          </div>
          <section className="route-card" aria-label={t.yourPayTrip}>
            <div>
              <div className="find-note">{t.yourPayTrip}</div>
              <div className="pay-row__amount">{peso(route.pay)}</div>
            </div>
            <dl className="route-stats">
              <div><dt>{t.farmsLabel}</dt><dd>{n}</dd></div>
              <div><dt>{t.pickedUpLabel}</dt><dd>{kg(onTruck)}</dd></div>
              <div><dt>{t.distanceLabel}</dt><dd>{info ? `${Math.round(info.km)} km` : '…'}</dd></div>
            </dl>
          </section>
          <div className="stack-10">
            <Link to="/trucker" className="wide-btn">{t.backToTrips}</Link>
            <button
              type="button"
              className="wide-btn wide-btn--outline"
              onClick={() => {
                setChosen(undefined)
                go('/trucker/map')
              }}
            >
              {t.findAnother}
            </button>
          </div>
        </main>
      </div>
    )
  }

  // The turn banner: the next turn on this leg, or "Arrive at …" once there are no more turns
  let banner: { text: string; dist?: string; modifier?: string }
  if (phase !== 'toStop') banner = { text: t.reached(name) }
  else if (!leg) banner = { text: t.headTo(name) }
  else {
    const next = leg.turns.find((turn) => turn.at > travelled + 5)
    banner = next
      ? { text: t.turn(next.kind, t.dirWord(next.modifier), next.road), dist: meters(next.at - travelled), modifier: next.modifier }
      : { text: t.arriveAt(name), dist: meters(Math.max(0, leg.meters - travelled)) }
  }

  const startDriving = () => {
    setTravelled(0)
    setDrive({ key: `${stop}-${Date.now()}`, leg: stop })
  }
  const pickUp = () => {
    const pickedKg = [...trip.pickedKg]
    pickedKg[stop] = kgNow
    updateTrip({ pickedKg, stop: stop + 1, phase: 'toStop' })
  }
  const links = navLinks(target)

  return (
    <div className="find">
      <TripMap
        className="geo-map__canvas"
        label={t.tripMapAria}
        legs={info?.legs}
        stops={route.stops}
        end={route.to}
        picked={Math.min(stop, n)}
        target={atDrop ? -1 : stop}
        drivenLegs={phase === 'toStop' ? stop : stop + 1}
        truck={truckAt}
        drive={drive}
        onProgress={(m) => setTravelled(Math.round(m / 25) * 25)}
        onDriven={() => {
          setDrive(undefined)
          updateTrip({ phase: 'near' })
        }}
        focus={phase === 'toStop' ? [truckAt, target] : [target]}
        focusKey={`${stop}-${phase}`}
        padding={{ top: 140, bottom: 330, left: 48, right: 48 }}
      />

      <div className="find__top">
        <RoundBack to="/trucker" label={t.back} />
        <div className={`turn-banner${phase !== 'toStop' ? ' turn-banner--here' : ''}`} aria-live="polite">
          <span className="turn-banner__icon">
            {phase !== 'toStop' ? <Icon name="pin" size={24} strokeWidth={2.2} /> : <TurnArrow modifier={banner.modifier ?? 'straight'} />}
          </span>
          <span className="turn-banner__text">
            {banner.dist && <span className="turn-banner__dist">{banner.dist}</span>}
            <span className="turn-banner__what">{banner.text}</span>
          </span>
        </div>
      </div>

      <div className="find__bottom">
        <section className="find-sheet trip-sheet" aria-label={atDrop ? t.dropOff : t.stopOf(stop + 1, n)}>
          <span className="find-sheet__grabber" aria-hidden="true" />

          {/* Where we are in the trip: one dot per farm, then the drop-off */}
          <div className="trip-dots" aria-hidden="true">
            {[...route.stops.map((_, i) => i), n].map((i) => (
              <span key={i} className={`trip-dots__dot${i < stop ? ' is-done' : i === stop ? ' is-now' : ''}${i === n ? ' is-end' : ''}`} />
            ))}
          </div>

          <div className="trip-sheet__head">
            <div className="grow">
              <div className="trip-sheet__eyebrow">{atDrop ? t.dropOff : t.stopOf(stop + 1, n)}</div>
              <div className="trip-sheet__name">{name}</div>
              <div className="find-note">
                {atDrop ? t.totalOnTruck(kg(onTruck)) : t.toPickUp(kg(route.stops[stop].kg))}
                {phase === 'toStop' && leg && !driving && <> · {t.awayTime(meters(leg.meters), duration(leg.minutes))}</>}
              </div>
            </div>
            {phase === 'toStop' && (
              <button type="button" className="call-btn call-btn--sm" aria-label={atDrop ? t.callCoop : t.callFarm(name)}>
                <Icon name="phone" size={18} />
              </button>
            )}
          </div>

          {phase === 'toStop' && driving && (
            <div className="stack-6">
              <div className="trip-progress"><span style={{ width: `${leg ? Math.min(100, (travelled / leg.meters) * 100) : 0}%` }} /></div>
              <p className="find-note">{t.drivingTo(name)}, {leg ? t.toGo(meters(Math.max(0, leg.meters - travelled))) : '…'}</p>
            </div>
          )}

          {phase === 'toStop' && !driving && (
            <>
              <div className="nav-apps">
                <span className="find-note">{t.openIn}</span>
                <a className="pill-btn pill-btn--outline" href={links.google} target="_blank" rel="noreferrer">Google Maps</a>
                <a className="pill-btn pill-btn--outline" href={links.waze} target="_blank" rel="noreferrer">Waze</a>
              </div>
              <button type="button" className="wide-btn" disabled={!info} onClick={startDriving}>{t.startDriving}</button>
            </>
          )}

          {phase === 'near' && (
            <SlideToConfirm
              label={t.slideArrived}
              question={t.arrivedQ(name)}
              yes={t.yesArrived}
              no={t.notYet}
              onConfirm={() => updateTrip({ phase: 'arrived' })}
            />
          )}

          {phase === 'arrived' && !atDrop && (
            <div className="kilos">
              <h2 className="find-label">{t.weighed}</h2>
              <div className="kilo-stepper" role="group" aria-label={t.weighed}>
                <button type="button" className="kilo-stepper__btn" aria-label={t.lessKgShort} disabled={kgNow <= KG_STEP} onClick={() => setKgNow(kgNow - KG_STEP)}>
                  <span aria-hidden="true">−</span>
                </button>
                <output className="kilo-stepper__value" aria-live="polite">{kg(kgNow)}</output>
                <button type="button" className="kilo-stepper__btn" aria-label={t.moreKgShort} onClick={() => setKgNow(kgNow + KG_STEP)}>
                  <span aria-hidden="true">+</span>
                </button>
              </div>
              <button type="button" className="wide-btn" onClick={pickUp}>{t.pickedUp}</button>
            </div>
          )}

          {phase === 'arrived' && atDrop && (
            <button type="button" className="wide-btn" onClick={() => updateTrip({ status: 'done' })}>{t.markDelivered}</button>
          )}

          <p className="map-credit">{MAP_CREDIT}</p>
        </section>
      </div>
    </div>
  )
}
