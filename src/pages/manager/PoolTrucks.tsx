import { AssistantTip } from '../../components/AssistantTip'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { PageHeader } from '../../components/PageHeader'
import { StatusPill } from '../../components/StatusPill'
import { sample } from '../../data/sample'

export default function PoolTrucks() {
  return (
    <>
      <PageHeader title="Pool trucks" subtitle="Shared trips for members who harvest in the same week." />

      <AssistantTip mascot="truck" width={96} height={100} bubble="card">
        Tomatoes are picked in rounds, so I drafted 2 more trips for the same farms. Check them after the first pickup.
      </AssistantTip>

      <div className="split">
        <Card as="section" aria-label="Trips" padding="8px 24px" className="col-main">
          <ol>
            {sample.trips.map((trip) => (
              <li className="trip" key={trip.date}>
                <div className="trip__date">
                  <div className="muted small">{trip.weekday}</div>
                  <div className="h-num">{trip.date}</div>
                </div>
                <div className="trip__text">
                  <div className="strong">{trip.title}</div>
                  <div className="muted">{trip.detail}</div>
                </div>
                {trip.status === 'needs-ok' ? (
                  <>
                    <StatusPill tone="warn">Needs your OK</StatusPill>
                    <Button to="/manager" size="sm" style={{ padding: '0 18px' }}>Review</Button>
                  </>
                ) : (
                  <>
                    <StatusPill>Draft</StatusPill>
                    <Button variant="secondary" size="sm" style={{ padding: '0 18px' }}>Review</Button>
                  </>
                )}
              </li>
            ))}
          </ol>
        </Card>

        <Card as="section" aria-label="Partner truckers" className="col-side stack-16">
          <h2 className="h-card">Partner truckers</h2>
          <div className="trucker-row">
            <span className="avatar avatar--lg" aria-hidden="true">{sample.trucker.short}</span>
            <div className="grow">
              <div className="strong">{sample.trucker.name}</div>
              <div className="muted small">{sample.trucker.trucks} truck</div>
            </div>
            <StatusPill tone="ok">Verified</StatusPill>
          </div>
          <p className="muted small">Only verified truckers get bookings.</p>
          <Button variant="secondary">Add a trucker</Button>
        </Card>
      </div>
    </>
  )
}
