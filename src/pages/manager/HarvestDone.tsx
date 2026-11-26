import { Button } from '../../components/Button'
import { sample, totals, proposal } from '../../data/sample'
import { peso } from '../../format'

// The one screen where the mascot is big: the harvest is settled.
export default function HarvestDone() {
  return (
    <div className="settled">
      <div className="settled__art">
        <div className="settled__circle">
          <img src="/assets/mascot-receipt-large.png" alt="The Cooptima assistant cheering with a receipt" />
        </div>
      </div>

      <section aria-label="Harvest settled" className="settled__text">
        <div>
          <p className="muted lg">Tomato harvest, {sample.pickupDay}</p>
          <h1 className="settled__title">Harvest settled</h1>
          <p className="settled__lead">All {totals.farms} members got their receipts, and every loan was repaid from the sale.</p>
        </div>

        <dl className="big-rows">
          <div>
            <dt>Sold to {sample.buyerA} at {peso(proposal.pricePerKg)}/kg</dt>
            <dd>{peso(totals.saleTotal)}</dd>
          </div>
          <div>
            <dt>Loans repaid, 100% of what was due</dt>
            <dd className="green-text">{peso(totals.loansTotal)}</dd>
          </div>
          <div>
            <dt>For farmers, after loans and the truck</dt>
            <dd>{peso(totals.toFarmers)}</dd>
          </div>
        </dl>

        <div className="btn-row">
          <Button to="/manager" size="lg" style={{ padding: '0 26px', fontSize: 17 }}>Back to Today</Button>
          <Button to="/manager/settle" variant="secondary" size="lg" style={{ padding: '0 22px', fontSize: 17 }}>See receipts</Button>
        </div>
      </section>
    </div>
  )
}
