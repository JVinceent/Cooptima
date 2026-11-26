import { useState } from 'react'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { Icon } from '../../components/Icon'
import { Mascot } from '../../components/AssistantTip'
import { sample, totals, truckerPay } from '../../data/sample'
import { kg, peso } from '../../format'
import { useT } from '../../i18n'

export default function Dropoff() {
  const { t } = useT()
  const [delivered, setDelivered] = useState(false)

  if (delivered) {
    return (
      <main className="trk-main trk-main--drop">
        <section aria-label={t.delivered} className="drop-done">
          <Mascot name="receipt" width={72} height={105} />
          <h1>{t.delivered}</h1>
          <p className="muted lg">{t.haveBeenTold(sample.buyerA)}</p>
        </section>

        <Card as="section" aria-label={t.yourPayTrip} padding={18}>
          <div className="muted small">{t.yourPayTrip}</div>
          <div className="h-num h-num--xl">{peso(truckerPay.perTrip)}</div>
          <ul className="ledger">
            <li><span>{t.pay}</span><span>{truckerPay.farms} × {peso(truckerPay.farmShare)}</span></li>
            <li><span>{t.pickupsLabel}</span><span>{totals.farms}</span></li>
            <li><span>{t.load}</span><span>{kg(totals.kg)}</span></li>
          </ul>
        </Card>

        <div className="push-down">
          <Button to="/trucker" size="xl" style={{ borderRadius: 14, fontSize: 18 }}>{t.backToTrips}</Button>
        </div>
      </main>
    )
  }

  return (
    <main className="trk-main trk-main--drop">
      <section aria-label={t.allPickupsDone(totals.farms)} className="drop-done">
        <span className="big-check">
          <Icon name="check" size={30} strokeWidth={3} />
        </span>
        <h1>{t.allPickupsDone(totals.farms)}</h1>
        <p className="muted lg">{t.onTruck(kg(totals.kg))}</p>
      </section>

      <Card as="section" aria-label={t.dropOff} padding={18} className="stack-14">
        <div className="row-gap-12">
          <span className="drop-icon"><Icon name="warehouse" size={22} strokeWidth={2} /></span>
          <div>
            <div className="muted small">{t.dropOff}</div>
            <div className="h-num h-num--sm">{sample.buyerA}</div>
          </div>
        </div>
        <Button variant="secondary" size="lg" style={{ borderRadius: 12 }}>{t.directions}</Button>
      </Card>

      <div className="stack-10 push-down">
        <Button size="xl" style={{ borderRadius: 14, fontSize: 18 }} onClick={() => setDelivered(true)}>{t.markDelivered}</Button>
        <p className="muted small center">{t.toldRightAway(sample.buyerA)}</p>
      </div>
    </main>
  )
}
