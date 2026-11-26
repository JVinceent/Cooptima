import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { Icon } from '../../components/Icon'
import { proposal, sample, truckerPay } from '../../data/sample'
import { kg, peso } from '../../format'
import { useT } from '../../i18n'

export default function Profile() {
  const { t, date, lang, setLang } = useT()
  const trip = sample.truckerTrips
  const me = sample.trucker
  return (
    <main className="trk-main">
      <Card as="section" aria-label={me.name} padding={16} className="row-gap-14">
        <span className="profile-avatar">{me.short}</span>
        <div>
          <div className="h-num h-num--sm">{me.name}</div>
          <div className="muted small">{proposal.coopName}</div>
        </div>
      </Card>

      <Card as="section" aria-label={t.myTruck} padding={16}>
        <h2 className="h-sub">{t.myTruck}</h2>
        <ul className="ledger">
          <li><span className="muted">{t.plate}</span><span className="strong">{me.plate}</span></li>
          <li><span className="muted">{t.capacity}</span><span className="strong">{kg(me.capacityKg)}</span></li>
        </ul>
      </Card>

      <Card as="section" aria-label={t.tripPay} padding={16}>
        <div className="between baseline">
          <h2 className="h-sub">{t.tripPay}</h2>
          <span className="muted small">{t.thisWeek}</span>
        </div>
        <div className="h-num h-num--lg">{peso(truckerPay.perTrip * trip.week.trips)}</div>
        <ul className="ledger">
          <li>
            <div>
              <div>{date(trip.today.label)}</div>
              <div className="muted small">{t.onTheRoad}</div>
            </div>
            <span className="strong">{peso(truckerPay.perTrip)}</span>
          </li>
          <li>
            <div>
              <div>{date(trip.upcoming.label)}</div>
              <div className="muted small">{t.booked}</div>
            </div>
            <span className="strong">{peso(truckerPay.perTrip)}</span>
          </li>
          <li><span className="muted">{t.payout}</span><span>{t.setByCoop}</span></li>
        </ul>
      </Card>

      <Card as="section" aria-label={t.language} padding={16} className="stack-10">
        <h2 className="h-sub">{t.language}</h2>
        <div className="row-gap-12 wrap" role="group" aria-label={t.language}>
          <button type="button" className="chip-btn" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>English</button>
          <button type="button" className="chip-btn" aria-pressed={lang === 'tl'} onClick={() => setLang('tl')}>Tagalog</button>
        </div>
      </Card>

      <Button variant="secondary" size="lg" style={{ borderRadius: 12, gap: 8 }}>
        <Icon name="phone" size={20} />
        {t.callCoop}
      </Button>
    </main>
  )
}
