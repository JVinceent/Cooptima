import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../../components/Icon'
import { Mascot } from '../../components/AssistantTip'
import { MAP_CREDIT, PinMap, RouteThumb, type End } from '../../components/GeoMap'
import { RoundBack } from '../../components/RoundBack'
import { useChosen } from '../../chosen'
import { RouteDetails } from './RouteDetails'
import { loadRoutes, matchKm, places, proposal, sample, truckerStart, type LoadRoute } from '../../data/sample'
import { kg, peso, weekdayDate } from '../../format'
import {
  clockAfter, distanceKm, duration, fastestRoute, placeName, searchPlaces, type Found, type LatLng, type RouteInfo,
} from '../../geo'
import { useT } from '../../i18n'

const STEP_KG = 250 // the kilos stepper moves this much at a time
const SHOWN = 2 // routes shown before "See more"
const LEAVE_AT = sample.truckerTrips.newBooking.start // the usual start time (a placeholder)
const SUGGESTED: Found[] = Object.values(places).map((p) => ({ ...p, detail: '' }))

type Step = 1 | 2 | 3 | 'details' | 4
type Spot = LatLng & { name: string } // name is '' while it is being looked up
type SearchState = 'idle' | 'loading' | 'done' | 'error'
const short = (name: string) => name.split(',')[0]
const BackButton = RoundBack

// "Find loads": 1) set where I start and where I'm going, by searching or by moving the pin, 2) say how many
// kilos I can take, 3) pick one of the routes that qualify. Step 4 confirms it; the choice then shows on Home.
export default function MapScreen() {
  const { t, date, crop } = useT()
  const { chosen, setChosen } = useChosen()
  const [step, setStep] = useState<Step>(1)
  const [from, setFrom] = useState<Spot>(truckerStart.from)
  const [to, setTo] = useState<Spot>(truckerStart.to)
  const [active, setActive] = useState<End>('start') // the end the pin is setting
  const [flights, setFlights] = useState(0) // bumps when the map should fly to a picked place
  const [route, setRoute] = useState<RouteInfo>()
  const [hint, setHint] = useState(true)
  const limit = sample.trucker.capacityKg
  const [maxKg, setMaxKg] = useState(limit)
  const [showAll, setShowAll] = useState(false)
  const [picked, setPicked] = useState<LoadRoute>() // the route whose details are open
  const lookup = useRef<AbortController>()

  // Search: which end it is for (closed when undefined), what was typed, and what came back
  const [searching, setSearching] = useState<End>()
  const [query, setQuery] = useState('')
  const [found, setFound] = useState<Found[]>([])
  const [searchState, setSearchState] = useState<SearchState>('idle')

  // The fastest road route between the two ends, worked out again whenever one moves
  useEffect(() => {
    const stop = new AbortController()
    setRoute(undefined)
    fastestRoute(from, to, stop.signal).then(setRoute, () => {})
    return () => stop.abort()
  }, [from.lat, from.lng, to.lat, to.lng])

  // Search as the trucker types, a moment after they stop
  useEffect(() => {
    if (!searching || query.trim().length < 2) {
      setSearchState('idle')
      return
    }
    const stop = new AbortController()
    setSearchState('loading')
    const wait = setTimeout(() => {
      searchPlaces(query, searching === 'start' ? from : to, stop.signal).then(
        (list) => { setFound(list); setSearchState('done') },
        () => { if (!stop.signal.aborted) setSearchState('error') },
      )
    }, 300)
    return () => { clearTimeout(wait); stop.abort() }
  }, [query, searching]) // the pins are only a hint for nearby results, so moving them doesn't search again

  // The map stopped moving: the pin now marks a new spot for the end being set. Look up its name.
  const settle = (spot: LatLng) => {
    const current = active === 'start' ? from : to
    if (distanceKm(spot, current) < 0.02) return // the map only flew to where the pin already was
    const set = active === 'start' ? setFrom : setTo
    set({ ...spot, name: '' })
    lookup.current?.abort()
    const stop = (lookup.current = new AbortController())
    placeName(spot, stop.signal).then((name) => set({ ...spot, name }), () => {})
  }

  const openSearch = (end: End) => {
    setSearching(end)
    setQuery('')
    setFound([])
  }
  const closeSearch = () => setSearching(undefined)
  // Use a searched (or suggested) place for that end, and move the pin there
  const pick = (place: Found) => {
    lookup.current?.abort()
    const spot = { lat: place.lat, lng: place.lng, name: place.name }
    if (searching === 'start') setFrom(spot)
    else setTo(spot)
    setActive(searching!)
    setFlights((n) => n + 1)
    closeSearch()
  }
  const chooseOnMap = () => {
    setActive(searching!)
    setFlights((n) => n + 1)
    closeSearch()
  }

  const fitting = loadRoutes
    .filter((r) => distanceKm(r.from, from) <= matchKm && distanceKm(r.to, to) <= matchKm && r.kg <= maxKg)
    .sort((a, b) => a.pickupOn.localeCompare(b.pickupOn))
  const hidden = fitting.length - SHOWN
  const here: Step = (step === 4 && !chosen) || (step === 'details' && !picked) ? 3 : step
  const ready = from.name !== '' && to.name !== ''

  const truckRow = (action: ReactNode) => (
    <div className="who-row">
      <span className="avatar" aria-hidden="true">{sample.trucker.short}</span>
      <div className="grow">
        <div className="who-row__name">{sample.trucker.name}</div>
        <div className="who-row__sub">{proposal.coopName}</div>
      </div>
      {action}
    </div>
  )

  const placeRow = (place: Found, onClick: () => void) => (
    <li key={`${place.name}-${place.lat}`}>
      <button type="button" className="place-row" onClick={onClick}>
        <span className="place-row__icon"><Icon name="pin" size={18} /></span>
        <span className="place-row__text">
          <span className="place-row__name">{place.name}</span>
          {place.detail && <span className="place-row__detail">{place.detail}</span>}
        </span>
      </button>
    </li>
  )

  // 1. Where I start and where I'm going
  if (here === 1) {
    const endButton = (kind: End, spot: Spot) => (
      <button
        type="button"
        className="trip-card__row"
        aria-label={kind === 'start' ? t.startIs(spot.name || t.findingPlace) : t.endIs(spot.name || t.findingPlace)}
        onClick={() => openSearch(kind)}
      >
        <span className={`end-mark end-mark--${kind}`} aria-hidden="true" />
        <span className="trip-card__place">{spot.name || t.findingPlace}</span>
      </button>
    )

    return (
      <div className="find">
        <PinMap
          center={active === 'start' ? from : to}
          focusKey={`${active}-${flights}`}
          pin={{ kind: active, label: active === 'start' ? t.pinStart : t.pinEnd }}
          other={{ at: active === 'start' ? to : from, kind: active === 'start' ? 'end' : 'start' }}
          onSettle={settle}
          label={active === 'start' ? t.mapSetStart : t.mapSetEnd}
        />
        <h1 className="sr-only">{t.whereTo}</h1>

        <div className="find__top">
          <BackButton to="/trucker" label={t.back} />
          <div className="trip-card">
            {endButton('start', from)}
            {endButton('end', to)}
            <p className="route-pill" aria-live="polite">
              {route ? (
                <>
                  {route.estimated ? t.aboutRoute : t.fastestRoute}{' '}
                  <strong>{duration(route.minutes)} ({Math.round(route.km)} km)</strong>
                </>
              ) : (
                t.findingRoute
              )}
            </p>
          </div>
        </div>

        <div className="find__bottom">
          {hint && (
            <div className="map-hint" role="status">
              <span className="grow">{t.dragHint}</span>
              <button type="button" className="map-hint__close" aria-label={t.close} onClick={() => setHint(false)}>
                <span aria-hidden="true">×</span>
              </button>
            </div>
          )}
          <section className="find-sheet" aria-label={t.myTruck}>
            <span className="find-sheet__grabber" aria-hidden="true" />
            <div className="find-sheet__truck">
              <div className="stack-6">
                <span className="plate">{sample.trucker.plate}</span>
                <span className="who-row__sub">{t.truckUpTo(kg(limit))}</span>
              </div>
              <Mascot name="truck" width={76} height={76} />
            </div>
            {truckRow(
              <button type="button" className="pill-btn" disabled={!ready} onClick={() => setStep(2)}>{t.next}</button>,
            )}
            <p className="map-credit">{MAP_CREDIT}</p>
          </section>
        </div>

        {searching && (
          <div
            className="place-search"
            role="dialog"
            aria-modal="true"
            aria-label={searching === 'start' ? t.searchStart : t.searchEnd}
            onKeyDown={(e) => e.key === 'Escape' && closeSearch()}
          >
            <div className="place-search__bar">
              <BackButton onClick={closeSearch} label={t.back} />
              <label className="search-field">
                <Icon name="search" size={18} />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={searching === 'start' ? t.searchStart : t.searchEnd}
                  aria-label={searching === 'start' ? t.searchStart : t.searchEnd}
                  enterKeyHint="search"
                />
                {query && (
                  <button type="button" className="search-field__clear" aria-label={t.clearSearch} onClick={() => setQuery('')}>
                    <span aria-hidden="true">×</span>
                  </button>
                )}
              </label>
            </div>

            <button type="button" className="place-row place-row--map" onClick={chooseOnMap}>
              <span className="place-row__icon"><Icon name="map" size={18} /></span>
              <span className="place-row__name">{t.chooseOnMap}</span>
            </button>

            <div className="place-search__list" aria-live="polite">
              {query.trim().length < 2 ? (
                <>
                  <p className="place-search__note">{t.searchExample}</p>
                  <h2 className="place-search__heading">{t.suggested}</h2>
                  <ul className="place-list">{SUGGESTED.map((p) => placeRow(p, () => pick(p)))}</ul>
                </>
              ) : searchState === 'loading' || searchState === 'idle' ? (
                <p className="place-search__note">{t.searching}</p>
              ) : searchState === 'error' ? (
                <p className="place-search__note">{t.searchFailed}</p>
              ) : found.length === 0 ? (
                <p className="place-search__note">{t.noPlaces}</p>
              ) : (
                <ul className="place-list">{found.map((p) => placeRow(p, () => pick(p)))}</ul>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  // 2. The trip, and how many kilos I can take
  if (here === 2) {
    return (
      <div className="find-page">
        <header className="find-head">
          <BackButton onClick={() => setStep(1)} label={t.back} />
          <h1>{t.yourTrip}</h1>
        </header>

        <main className="find-page__body">
          {route ? (
            <RouteThumb from={from} to={to} line={route.line} label={t.routeMapAria(from.name, to.name)} />
          ) : (
            <div className="route-thumb route-thumb--wait">{t.findingRoute}</div>
          )}

          <section aria-label={t.yourTrip}>
            <p className="find-note">{t.ifYouLeave(LEAVE_AT)}</p>
            <ol className="trip-times">
              <li>
                <span className="trip-times__time">{LEAVE_AT}</span>
                <span className="end-mark end-mark--start" aria-hidden="true" />
                <span className="trip-times__place">{from.name}</span>
              </li>
              <li>
                <span className="trip-times__time">{route ? clockAfter(LEAVE_AT, route.minutes) : '…'}</span>
                <span className="end-mark end-mark--end" aria-hidden="true" />
                <span className="trip-times__place">{to.name}</span>
              </li>
            </ol>
          </section>

          <section className="kilos" aria-label={t.howMuch}>
            <h2 className="find-label">{t.howMuch}</h2>
            <div className="kilo-stepper" role="group" aria-label={t.howMuch}>
              <button type="button" className="kilo-stepper__btn" aria-label={t.lessKg} disabled={maxKg <= STEP_KG} onClick={() => setMaxKg(maxKg - STEP_KG)}>
                <span aria-hidden="true">−</span>
              </button>
              <output className="kilo-stepper__value" aria-live="polite">{kg(maxKg)}</output>
              <button type="button" className="kilo-stepper__btn" aria-label={t.moreKg} disabled={maxKg >= limit} onClick={() => setMaxKg(maxKg + STEP_KG)}>
                <span aria-hidden="true">+</span>
              </button>
            </div>
            <p className="between find-note">
              <span className={fitting.length > 0 ? 'green-text strong' : 'hot-note'} aria-live="polite">
                {fitting.length > 0 ? t.routesFit(fitting.length) : t.noneFit}
              </span>
              <span>{t.truckLimit(kg(limit))}</span>
            </p>
          </section>

          {truckRow(<Link to="/trucker/profile" className="pill-btn pill-btn--outline">{t.seeProfile}</Link>)}
        </main>

        <div className="find-page__foot">
          <button type="button" className="wide-btn" disabled={fitting.length === 0} onClick={() => { setShowAll(false); setStep(3) }}>
            {t.showRoutes}
          </button>
        </div>
      </div>
    )
  }

  // 3 and 4: the routes that qualify, then the one I chose
  const card = (r: LoadRoute, action?: ReactNode) => (
    <section key={r.id} aria-label={`${crop(r.crop)}, ${kg(r.kg)}`} className="route-card">
      <div className="between baseline">
        <h2 className="route-card__crop">{crop(r.crop)}</h2>
        <span className="find-note">{t.pickupOn(date(weekdayDate(r.pickupOn)))}</span>
      </div>
      {here === 4 && <p className="find-note">{short(r.from.name)} → {short(r.to.name)}</p>}
      <dl className="route-stats">
        <div><dt>{t.farmsLabel}</dt><dd>{r.farms}</dd></div>
        <div><dt>{t.weightLabel}</dt><dd>{kg(r.kg)}</dd></div>
        <div><dt>{t.distanceLabel}</dt><dd>{r.km} km</dd></div>
        <div><dt>{t.payLabel}</dt><dd className="green-text">{peso(r.pay)}</dd></div>
      </dl>
      {action}
    </section>
  )

  if (here === 3) {
    return (
      <div className="find-page">
        <header className="find-head">
          <BackButton onClick={() => setStep(2)} label={t.back} />
          <div>
            <h1>{t.routesForYou}</h1>
            <p className="find-note">{t.routesTo(short(from.name), short(to.name), kg(maxKg))}</p>
          </div>
        </header>
        <main className="find-page__body">
          {fitting.length === 0 ? (
            <>
              <p className="find-note">{t.noRoutes}</p>
              <button type="button" className="wide-btn wide-btn--outline" onClick={() => setStep(1)}>{t.changeSearch}</button>
            </>
          ) : (
            <>
              {(showAll ? fitting : fitting.slice(0, SHOWN)).map((r) =>
                card(r, <button type="button" className="wide-btn wide-btn--sm wide-btn--soft" onClick={() => { setPicked(r); setStep('details') }}>{t.chooseRoute}</button>),
              )}
              {hidden > 0 && (
                <button type="button" className="link-btn strong see-more" aria-expanded={showAll} onClick={() => setShowAll((open) => !open)}>
                  {showAll ? t.seeLess : t.seeMore(hidden)}
                </button>
              )}
            </>
          )}
        </main>
      </div>
    )
  }

  // Between the list and "Route confirmed": the whole trip, farm by farm
  if (here === 'details' && picked) {
    return (
      <RouteDetails
        route={picked}
        onBack={() => setStep(3)}
        onConfirm={() => {
          setChosen(picked)
          setStep(4)
        }}
      />
    )
  }

  return (
    <div className="find-page">
      <header className="find-head">
        <BackButton to="/trucker" label={t.back} />
      </header>
      {chosen && (
        <main className="find-page__body">
          <div className="find-done">
            <span className="find-done__check"><Icon name="check" size={28} strokeWidth={2.4} /></span>
            <h1>{t.routeChosen}</h1>
            <p className="find-note">{t.chosenTold(chosen.farms)}</p>
          </div>
          {card(chosen)}
          <div className="stack-10">
            <Link to="/trucker/go" className="wide-btn">{t.startTrip}</Link>
            <Link to="/trucker" className="wide-btn wide-btn--outline">{t.viewTrips}</Link>
          </div>
        </main>
      )}
    </div>
  )
}
