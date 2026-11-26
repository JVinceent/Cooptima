import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { StatusPill } from '../../components/StatusPill'
import { ampalayaOrder, proposal, sample, totals } from '../../data/sample'
import { kg, peso } from '../../format'

export default function Orders() {
  return (
    <>
      <div>
        <h1 className="buyer__title">My orders</h1>
        <p className="muted lg">Each order from offer to delivery.</p>
      </div>

      <Card as="section" aria-label="Orders" padding="8px 28px">
        <ul>
          <li className="order-row">
            <div className="order-row__text">
              <div className="order-row__title">Tomatoes from {proposal.coopName}</div>
              <div className="muted">
                {kg(totals.kg)} at {peso(proposal.pricePerKg)}/kg, {peso(totals.saleTotal)}. Pickup {sample.pickupDay}.
              </div>
            </div>
            <StatusPill tone="warn" size="md">Pay {peso(sample.deposit)} deposit</StatusPill>
            <Button to="/buyer/orders/tomatoes" size="md" style={{ padding: '0 22px' }}>Open order</Button>
          </li>
          <li className="order-row">
            <div className="order-row__text">
              <div className="order-row__title">Ampalaya from {sample.otherPosts[0].coop}</div>
              <div className="muted">
                {kg(ampalayaOrder.kg)} at {peso(ampalayaOrder.pricePerKg)}/kg, {peso(ampalayaOrder.total)}. {sample.otherPosts[0].pickup.replace('pickup', 'Pickup')}.
              </div>
            </div>
            <StatusPill size="md">Waiting for the coop</StatusPill>
            <Button variant="secondary" size="sm" style={{ padding: '0 22px' }}>Open order</Button>
          </li>
        </ul>
      </Card>
    </>
  )
}
