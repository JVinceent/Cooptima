import { useState } from 'react'
import { Card } from '../../components/Card'
import { Icon } from '../../components/Icon'
import { TomatoIcon } from '../../components/TomatoIcon'
import { cropSeasons, sample, tinaReceipt, totals } from '../../data/sample'
import { daysBetween, harvestRange } from '../../forecast'
import { minusPeso, peso } from '../../format'

// Three things for a busy farmer: when the truck comes, what is growing, and how much money to expect.
// The full breakdown sits behind "See how it adds up".
export default function Home() {
  const r = tinaReceipt
  const [showDetails, setShowDetails] = useState(false)
  // "Ready in about 2 weeks": from today to the first tomato harvest day
  const tomatoes = cropSeasons.find((s) => s.crop === 'Tomatoes')!
  const weeksToHarvest = Math.max(1, Math.round(daysBetween(sample.today, harvestRange(tomatoes).from) / 7))
  const total = r.cashAtPickup + r.balance // sale - loan - truck share

  return (
    <>
      <section aria-label="Next pickup" className="pickup-card">
        <div className="pickup-card__label">Next pickup</div>
        <div className="pickup-card__date">{sample.pickupDay}</div>
        <div className="pickup-card__time">{sample.pickupTime} at your farm gate</div>
        <div className="pickup-card__truck">
          <Icon name="truck" size={22} />
          Shared truck with {totals.farms - 1} nearby farms
        </div>
      </section>

      <Card as="section" variant="phone" aria-label="Your tomatoes" className="row-gap-14">
        <span className="crop-badge"><TomatoIcon size={40} /></span>
        <div>
          <h2 className="h-card h-card--lg">Your tomatoes</h2>
          <p className="muted">About {r.kg} kg, ready in {weeksToHarvest} weeks</p>
        </div>
      </Card>

      <Card as="section" variant="phone" aria-label="What you'll get" className="stack-14">
        <div>
          <div className="muted">You'll get</div>
          <div className="h-num h-num--xxl green-text">{peso(total)}</div>
        </div>
        <dl className="rows rows--gap8">
          <div><dt>At pickup</dt><dd className="strong">{peso(r.cashAtPickup)}</dd></div>
          <div><dt>After the buyer pays</dt><dd className="strong">{peso(r.balance)}</dd></div>
        </dl>

        <button
          type="button"
          className="link-btn strong see-more"
          aria-expanded={showDetails}
          aria-controls="money-details"
          onClick={() => setShowDetails((open) => !open)}
        >
          {showDetails ? 'Hide details' : 'See how it adds up'}
        </button>

        {showDetails && (
          <div id="money-details" className="stack-10">
            <p className="muted">
              {r.kg} kg at {peso(r.pricePerKg)} per kg, {sample.grade}, from {sample.buyerA}
            </p>
            <dl className="rows rows--gap10">
              <div><dt>Sale</dt><dd>{peso(r.sale)}</dd></div>
              <div><dt>Loan payment</dt><dd>{minusPeso(r.loanPaid)}</dd></div>
              <div><dt>Truck share</dt><dd>{minusPeso(r.truckShare)}</dd></div>
              <div className="rows__total strong"><dt>You'll get</dt><dd>{peso(total)}</dd></div>
            </dl>
            <p className="muted small">Final amounts follow the weighing at pickup.</p>
          </div>
        )}
      </Card>
    </>
  )
}
