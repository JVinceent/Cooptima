import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useChosen } from '../../chosen'
import { Mascot } from '../../components/AssistantTip'
import { Button } from '../../components/Button'
import { Icon } from '../../components/Icon'
import { StatusPill } from '../../components/StatusPill'
import { cropSeasons, proposal, sample, tomatoMembers, truckerPay } from '../../data/sample'
import { harvestRange, summarize } from '../../forecast'
import { kg, peso, weekdayDate } from '../../format'
import { useT } from '../../i18n'

const SHOWN = 2 // "Coming up" shows this many cards, then "See more"

export default function Trips() {
  const { t, date, crop } = useT()
  const { trip: confirmed } = useChosen()
  const trip = sample.truckerTrips
  const [showAll, setShowAll] = useState(false)
  const weekPay = truckerPay.perTrip * trip.week.trips
  const pickups = tomatoMembers.length
  const next = tomatoMembers[trip.today.done] // the stop the mascot points at
  const left = pickups - trip.today.done

  // Harvests the coop has not booked a truck for yet (tomatoes already have the trips above them).
  const notBooked = cropSeasons
    .filter((s) => s.crop !== 'Tomatoes')
    .map((s) => ({ crop: s.crop, from: harvestRange(s).from, farms: s.farms.length, kg: summarize([s]).kg }))

  const cards = [
    <Link key="today" to="/trucker/today" className="trip-row">
      <div className="grow">
        <div className="strong">{date(trip.today.label)}</div>
        <div className="muted">{t.pickupsDone(pickups, trip.today.done)}</div>
      </div>
      <StatusPill tone="ok" size="md">{t.onTheRoad}</StatusPill>
      <Icon name="next" size={20} strokeWidth={2} />
    </Link>,
    // The route confirmed in Find loads sits right under today's trip; it opens the trip guide until it's delivered
    ...(confirmed
      ? [
          confirmed.status === 'done' ? (
            <div key="chosen" className="trip-row">
              <div className="grow">
                <div className="strong">{date(weekdayDate(confirmed.route.pickupOn))}</div>
                <div className="muted">{t.farmsAndLoad(crop(confirmed.route.crop), confirmed.route.farms, kg(confirmed.route.kg))}</div>
              </div>
              <StatusPill size="md">{t.delivered}</StatusPill>
            </div>
          ) : (
            <Link key="chosen" to="/trucker/go" className="trip-row">
              <div className="grow">
                <div className="strong">{date(weekdayDate(confirmed.route.pickupOn))}</div>
                <div className="muted">{t.farmsAndLoad(crop(confirmed.route.crop), confirmed.route.farms, kg(confirmed.route.kg))}</div>
              </div>
              <StatusPill tone="ok" size="md">{confirmed.status === 'driving' ? t.onTheRoad : t.booked}</StatusPill>
              <Icon name="next" size={20} strokeWidth={2} />
            </Link>
          ),
        ]
      : []),
    <div key="upcoming" className="trip-row">
      <div className="grow">
        <div className="strong">{date(trip.upcoming.label)}</div>
        <div className="muted">{t.pickups(pickups)}</div>
      </div>
      <StatusPill size="md">{t.booked}</StatusPill>
      <Icon name="next" size={20} strokeWidth={2} />
    </div>,
    ...notBooked.map((h) => (
      <div key={h.crop} className="trip-row">
        <div className="grow">
          <div className="strong">{date(weekdayDate(h.from))}</div>
          <div className="muted">{t.farmsAndLoad(crop(h.crop), h.farms, kg(h.kg))}</div>
        </div>
        <StatusPill size="md">{t.notBooked}</StatusPill>
      </div>
    )),
  ]
  const hidden = cards.length - SHOWN

  return (
    <main className="trk-main">
      <section aria-label={t.thisWeek} className="earn-card">
        <div>
          <div className="earn-card__label">{t.thisWeek}</div>
          <div className="h-num h-num--lg">{peso(weekPay)}</div>
        </div>
        <div className="earn-card__side">
          <div>{t.trips(trip.week.trips)}</div>
          <div>{t.each(peso(truckerPay.perTrip))}</div>
        </div>
      </section>

      <section aria-label={t.newBookingFrom(proposal.coopName)} className="peach-card">
        <div>
          <div className="peach-card__eyebrow">{t.newBookingFrom(proposal.coopName)}</div>
          <div className="h-num h-num--sm">{date(trip.newBooking.date)}, {trip.newBooking.start}</div>
          <div className="muted">{t.bookingDetail(crop('Tomatoes'), pickups, sample.buyerA)}</div>
        </div>
        <div className="pay-line">
          <span className="h-num h-num--md">{peso(truckerPay.perTrip)}</span>
          <span className="muted small">{t.yourPay(truckerPay.farms, peso(truckerPay.farmShare))}</span>
        </div>
        <div className="btn-row btn-row--phone">
          <Button variant="secondary" size="lg" style={{ flex: 1, borderRadius: 12 }}>{t.decline}</Button>
          <Button size="lg" style={{ flex: 1.4, borderRadius: 12 }}>{t.accept}</Button>
        </div>
      </section>

      <section aria-label={t.comingUp} className="stack-10">
        <h2 className="h-sub">{t.comingUp}</h2>
        <div className="guide">
          <div className="guide__bubble">
            <div className="strong">{t.tipNext(next.name, kg(next.kg))}</div>
            <div className="muted small">{t.tipLeft(left, sample.buyerA)}</div>
          </div>
          <Mascot name="truck" width={170} height={170} />
        </div>
        <div className="trip-list">{showAll ? cards : cards.slice(0, SHOWN)}</div>
        {hidden > 0 && (
          <button
            type="button"
            className="link-btn strong see-more"
            aria-expanded={showAll}
            onClick={() => setShowAll((open) => !open)}
          >
            {showAll ? t.seeLess : t.seeMore(hidden)}
          </button>
        )}
      </section>
    </main>
  )
}
