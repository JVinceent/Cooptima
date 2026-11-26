import { useEffect, useState } from 'react'
import { TripMap } from '../../components/GeoMap'
import { RoundBack } from '../../components/RoundBack'
import { sample, type LoadRoute } from '../../data/sample'
import { kg, peso, weekdayDate } from '../../format'
import { duration, meters, tripRoute, type TripInfo } from '../../geo'
import { useT } from '../../i18n'

type Props = { route: LoadRoute; onBack: () => void; onConfirm: () => void }

// Find loads, between "Routes for you" and "Route confirmed": the whole trip before the trucker commits to it.
// The farms in pickup order with the road distance to each, the totals, the pay, then Confirm route.
export function RouteDetails({ route, onBack, onConfirm }: Props) {
  const { t, date, crop } = useT()
  const [info, setInfo] = useState<TripInfo>()
  const points = [route.from, ...route.stops, route.to]

  useEffect(() => {
    const stop = new AbortController()
    tripRoute(points, stop.signal).then(setInfo, () => {})
    return () => stop.abort()
  }, [route.id])

  const leg = (i: number) => info && t.legNote(meters(info.legs[i].meters), duration(info.legs[i].minutes))

  return (
    <div className="find-page">
      <header className="find-head">
        <RoundBack onClick={onBack} label={t.back} />
        <h1>{t.routeDetails}</h1>
      </header>

      <main className="find-page__body">
        <TripMap
          still
          className="route-thumb route-thumb--tall"
          label={t.tripMapAria}
          legs={info?.legs}
          stops={route.stops}
          end={route.to}
          truck={route.from}
          picked={0}
          target={-1}
          drivenLegs={0}
          focus={points}
          focusKey={route.id}
        />

        <div className="stack-6">
          <div className="between baseline">
            <h2 className="route-card__crop">{crop(route.crop)}</h2>
            <span className="find-note">{t.pickupOn(date(weekdayDate(route.pickupOn)))}</span>
          </div>
          <p className="find-note">{t.ifYouLeave(sample.truckerTrips.newBooking.start)}</p>
        </div>

        <section className="stack-10" aria-label={t.pickupsHeading}>
          <h2 className="find-label">{t.pickupsHeading}</h2>
          <ol className="stop-list">
            {route.stops.map((s, i) => (
              <li key={s.farmer}>
                <span className="stop-dot" aria-hidden="true">{i + 1}</span>
                <span className="stop-list__text">
                  <span className="stop-list__name">{s.farmer}</span>
                  <span className="find-note">{leg(i) ?? '…'}</span>
                </span>
                <span className="stop-list__kg">{kg(s.kg)}</span>
              </li>
            ))}
            <li>
              <span className="stop-dot stop-dot--end" aria-hidden="true"><span className="end-mark end-mark--end" /></span>
              <span className="stop-list__text">
                <span className="stop-list__name">{route.to.name}</span>
                <span className="find-note">{leg(route.stops.length) ?? '…'}</span>
              </span>
              <span className="stop-list__kg">{kg(route.kg)}</span>
            </li>
          </ol>
        </section>

        <dl className="route-stats">
          <div><dt>{t.farmsLabel}</dt><dd>{route.farms}</dd></div>
          <div><dt>{t.weightLabel}</dt><dd>{kg(route.kg)}</dd></div>
          <div><dt>{t.distanceLabel}</dt><dd>{info ? `${Math.round(info.km)} km` : '…'}</dd></div>
          <div><dt>{t.timeLabel}</dt><dd>{info ? duration(info.minutes) : '…'}</dd></div>
        </dl>

        <div className="pay-row">
          <span className="find-note">{t.payLabel}</span>
          <span className="pay-row__amount">{peso(route.pay)}</span>
        </div>
      </main>

      <div className="find-page__foot">
        <button type="button" className="wide-btn" onClick={onConfirm}>{t.confirmRoute}</button>
      </div>
    </div>
  )
}
