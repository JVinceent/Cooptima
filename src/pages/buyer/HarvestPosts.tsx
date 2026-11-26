import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { proposal, sample, totals } from '../../data/sample'
import { kg, peso } from '../../format'

export default function HarvestPosts() {
  return (
    <>
      <div>
        <h1 className="buyer__title">Harvest posts</h1>
        <p className="muted">Cooperatives post pooled harvests before pickup. Agree on price and grade now.</p>
      </div>

      <div className="split split--buyer">
        <ul aria-label="Posts" className="posts">
          <li>
            <button type="button" className="post post--selected" aria-current="true">
              <span className="between">
                <span className="post__crop">Tomatoes</span>
                <span className="muted">About {kg(totals.kg)}</span>
              </span>
              <span className="post__meta">
                {proposal.coopName}, {sample.pickupWeek.replace('Week', 'pickup week')}
              </span>
            </button>
          </li>
          {sample.otherPosts.map((p) => (
            <li key={p.crop}>
              <button type="button" className="post">
                <span className="between">
                  <span className="post__crop">{p.crop}</span>
                  <span className="muted">About {kg(p.kg)}</span>
                </span>
                <span className="post__meta">{p.coop}, {p.pickup}</span>
              </button>
            </li>
          ))}
        </ul>

        <Card as="section" aria-label="Tomatoes from San Pedro MPC" padding={28} className="offer-form stack-22">
          <div>
            <h2 className="h-card h-card--xl">Tomatoes from {proposal.coopName}</h2>
            <p className="muted">Pooled from {totals.farms} member farms in San Pedro, Batangas.</p>
          </div>

          <dl className="facts">
            <div><dt>Volume</dt><dd>About {kg(totals.kg)}</dd></div>
            <div><dt>Pickup</dt><dd>{sample.pickupWeek}</dd></div>
            <div><dt>Grade</dt><dd>{sample.grade}, checked at weighing</dd></div>
            <div><dt>Delivery</dt><dd>Coop truck to your site</dd></div>
          </dl>

          <form className="stack-16" onSubmit={(e) => e.preventDefault()}>
            <h3 className="h-sub h-sub--poppins">Your offer</h3>
            <div className="row-gap-16 wrap">
              <label className="field">
                Price per kg
                <input type="text" defaultValue={`${peso(proposal.pricePerKg)}.00`} />
              </label>
              <label className="field">
                Volume
                <input type="text" defaultValue={kg(totals.kg)} />
              </label>
            </div>

            <div className="well stack-8">
              <div className="between"><span>Order total</span><span className="strong">{peso(totals.saleTotal)}</span></div>
              <div className="between"><span>Deposit before pickup</span><span className="strong">{peso(sample.deposit)}</span></div>
              <div className="between well__total">
                <span>Pay on delivery</span>
                <span className="h-num">{peso(totals.balanceAfterDeposit)}</span>
              </div>
              <p className="muted tiny">The deposit pays the farmers' cash at pickup and comes off your total.</p>
            </div>

            <div className="row-gap-14 wrap">
              <Button size="lg" style={{ height: 48, padding: '0 28px' }}>Send offer</Button>
              <span className="muted small">The coop manager accepts or declines your offer.</span>
            </div>
          </form>
        </Card>
      </div>
    </>
  )
}
