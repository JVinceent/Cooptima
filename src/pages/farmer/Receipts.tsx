import { Card } from '../../components/Card'
import { Icon } from '../../components/Icon'
import { StatusPill } from '../../components/StatusPill'
import { sample, tinaReceipt } from '../../data/sample'
import { minusPeso, peso } from '../../format'

export default function Receipts() {
  const r = tinaReceipt
  return (
    <>
      <Card as="section" variant="phone" aria-label="Receipt for Dec 7" className="stack-16">
        <div>
          <div className="muted">{sample.pickupDay}</div>
          <h2 className="h-card h-card--lg">Tomatoes</h2>
        </div>
        <div className="well well--phone">
          <div className="h-num h-num--xxl green-text">{peso(r.balance)}</div>
          <div>still coming to you</div>
          <div style={{ marginTop: 8 }}>
            <StatusPill tone="warn" size="md">Sent when the buyer pays</StatusPill>
          </div>
        </div>
        <dl className="rows rows--gap10">
          <div><dt>Weighed</dt><dd>{r.kg} kg, {sample.grade}</dd></div>
          <div><dt>Sale at {peso(r.pricePerKg)}/kg</dt><dd>{peso(r.sale)}</dd></div>
          <div><dt>Loan payment</dt><dd>{minusPeso(r.loanPaid)}</dd></div>
          <div><dt>Truck share</dt><dd>{minusPeso(r.truckShare)}</dd></div>
          <div><dt>Cash you got at pickup</dt><dd>{minusPeso(r.cashAtPickup)}</dd></div>
        </dl>
        <div className="banner banner--ok">
          <Icon name="check" size={20} strokeWidth={2.5} />
          Your loan is fully paid
        </div>
      </Card>
      <p className="muted small center">The same receipt was sent to you by text.</p>
    </>
  )
}
