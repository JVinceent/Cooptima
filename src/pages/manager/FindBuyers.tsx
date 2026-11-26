import { AssistantTip } from '../../components/AssistantTip'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { PageHeader } from '../../components/PageHeader'
import { StatusPill } from '../../components/StatusPill'
import { proposal, sample, totals } from '../../data/sample'
import { kg, peso } from '../../format'

export default function FindBuyers() {
  return (
    <>
      <PageHeader
        title="Find buyers"
        subtitle="Offer pooled harvests to registered buyers. Price and grade are agreed before pickup."
      />

      <Card as="section" aria-label="Supply post" className="supply-post">
        <div className="stack-10">
          <h2 className="h-card">Tomatoes</h2>
          <ul className="chips">
            <li>About {kg(totals.kg)}</li>
            <li>Pickup {sample.pickupWeek.replace('Week', 'week')}</li>
            <li>{sample.grade}</li>
          </ul>
        </div>
        <div className="row-gap-12">
          <StatusPill tone="ok">Sent to buyers {sample.postSentOn}</StatusPill>
          <Button variant="secondary" size="sm" style={{ padding: '0 18px' }}>Edit post</Button>
        </div>
      </Card>

      <div className="split">
        <Card as="section" aria-label="Offers" className="col-main">
          <h2 className="h-card" style={{ marginBottom: 8 }}>{sample.buyerOffers.length} offers</h2>
          {sample.buyerOffers.map((offer, i) => (
            <article className="offer" key={offer.buyer}>
              <div className="offer__text">
                <div className="strong lg">{offer.buyer}</div>
                <div className="muted">
                  {offer.allHarvest ? `All ${kg(offer.kg)}` : `${kg(offer.kg)} only`}, {peso(offer.kg * offer.pricePerKg)} total
                </div>
                <div className="muted">Pays {peso(offer.deposit)} deposit before pickup</div>
              </div>
              <div className="h-num h-num--lg">
                {peso(offer.pricePerKg)}
                <span className="per-kg">/kg</span>
              </div>
              <div className="btn-row">
                <Button variant="secondary" size="sm" style={{ padding: '0 16px' }}>Decline</Button>
                {/* The best offer (first) is the highlighted one */}
                <Button variant={i === 0 ? 'primary' : 'secondary'} size="sm" style={{ padding: '0 18px' }}>
                  Accept offer
                </Button>
              </div>
            </article>
          ))}
        </Card>

        <Card as="section" aria-label="Compare prices" className="col-side stack-14">
          <h2 className="h-card">Compare before you accept</h2>
          <AssistantTip mascot="clipboard" width={56} height={82}>
            {sample.buyerA} pays {peso(totals.perKgMoreThanBiyahero)} more per kilo than the biyahero's farm gate offer and takes the
            whole harvest.
          </AssistantTip>
          <dl className="rows rows--bordered">
            <div><dt>Biyahero offer at the farm gate</dt><dd className="strong">{peso(proposal.biyaheroPerKg)}/kg</dd></div>
            <div><dt>Your last pooled sale</dt><dd className="muted">None yet</dd></div>
          </dl>
          <a href="#prices" onClick={(e) => e.preventDefault()} className="strong">Check posted farm gate prices</a>
        </Card>
      </div>
    </>
  )
}
