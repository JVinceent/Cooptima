import { Link } from 'react-router-dom'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { Icon } from '../../components/Icon'
import { proposal, sample, totals } from '../../data/sample'
import { kg, minusPeso, peso } from '../../format'

type Step = { title: string; note: string; state: 'done' | 'now' | 'later'; n: number; hot?: boolean }

const steps: Step[] = [
  { n: 1, title: 'Offer sent', note: sample.orderTimeline.offerSent, state: 'done' },
  { n: 2, title: 'Accepted by the coop', note: sample.orderTimeline.accepted, state: 'done' },
  { n: 3, title: 'Pay the deposit', note: 'Due before pickup', state: 'now', hot: true },
  { n: 4, title: 'Pickup and delivery', note: sample.pickupDay, state: 'later' },
  { n: 5, title: 'Pay the balance', note: 'After delivery, based on the weighed total', state: 'later' },
]

export default function Order() {
  return (
    <>
      <Link to="/buyer/orders" className="back-link back-link--page">
        <Icon name="back" size={18} strokeWidth={2} />
        My orders
      </Link>
      <div>
        <h1 className="buyer__title">Tomatoes from {proposal.coopName}</h1>
        <p className="muted lg">
          About {kg(totals.kg)} at {peso(proposal.pricePerKg)} per kg, {sample.grade}, delivered by the coop's truck
        </p>
      </div>

      <div className="split">
        <Card as="section" aria-label="Order progress" padding="24px 28px" style={{ flex: '3 1 460px', minWidth: 0 }}>
          <h2 className="h-card" style={{ marginBottom: 18 }}>Order progress</h2>
          <ol className="timeline-v">
            {steps.map((s, i) => {
              const last = i === steps.length - 1
              return (
                <li key={s.n}>
                  <div className="timeline-v__rail">
                    {s.state === 'done' ? (
                      <span className="num-dot num-dot--done"><Icon name="check" size={15} strokeWidth={3} /></span>
                    ) : (
                      <span className={`num-dot num-dot--${s.state === 'now' ? 'now-outline' : 'later'}`}>{s.n}</span>
                    )}
                    {!last && <span className={`timeline-v__line${s.state === 'done' && steps[i + 1].state === 'done' ? ' timeline-v__line--done' : ''}`} />}
                  </div>
                  <div className={last ? undefined : 'timeline-v__body'}>
                    <div className="strong">{s.title}</div>
                    <div className={s.hot ? 'hot-note' : 'muted'}>{s.note}</div>
                  </div>
                </li>
              )
            })}
          </ol>
        </Card>

        <Card as="section" aria-label="Payment" className="stack-16" style={{ flex: '2 1 320px', minWidth: 0 }}>
          <div>
            <div className="muted">Deposit due before pickup</div>
            <div className="h-num h-num--xxl">{peso(sample.deposit)}</div>
            <p className="muted small" style={{ marginTop: 6 }}>Pays the farmers' cash at pickup and comes off your total.</p>
          </div>
          <Button size="lg" style={{ fontSize: 17 }}>Pay deposit</Button>
          <p className="muted small center">Bank transfer or e-wallet</p>
          <dl className="rows rows--gap8 rows--top">
            <div><dt>Order total</dt><dd>{peso(totals.saleTotal)}</dd></div>
            <div><dt>Deposit</dt><dd>{minusPeso(sample.deposit)}</dd></div>
            <div className="strong"><dt>Balance after delivery</dt><dd>{peso(totals.balanceAfterDeposit)}</dd></div>
          </dl>
        </Card>
      </div>
    </>
  )
}
