import { AssistantTip } from '../../components/AssistantTip'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { Icon } from '../../components/Icon'
import { MapArt, routePoints, routeStops } from '../../components/MapArt'
import { PageHeader } from '../../components/PageHeader'
import { kg, peso } from '../../format'
import { lot, proposal, sample, tomatoMembers, totals } from '../../data/sample'
import { stateOf } from '../../workflow'

type Step = { n: number; title: string; note: string; state: 'done' | 'ok-needed' | 'later' }

// Today's four steps follow the shared lot stage (src/workflow.ts), not hard-coded states.
const current = lot.stage
const steps: Step[] = [
  { n: 1, title: 'Forecast', note: `Alert sent ${sample.forecastAlertSent}`, state: stateOf('forecast', current) === 'later' ? 'later' : 'done' },
  { n: 2, title: 'Pool trucks', note: 'Needs your OK', state: stateOf('trucks', current) === 'later' ? 'later' : 'ok-needed' },
  { n: 3, title: 'Find buyers', note: 'Needs your OK', state: stateOf('offer', current) === 'later' ? 'later' : 'ok-needed' },
  { n: 4, title: 'Settle', note: 'After pickup', state: 'later' },
]
const waiting = steps.filter((s) => s.state === 'ok-needed').length

export default function Today() {
  return (
    <>
      <PageHeader
        title="Today"
        subtitle={waiting === 1 ? '1 step is waiting for your OK.' : `${waiting} steps are waiting for your OK.`}
      />

      <Card as="section" aria-label="Tomato harvest progress">
        <div className="between wrap-gap">
          <div>
            <h2 className="h-card">Tomato harvest</h2>
            <p className="muted">
              {totals.farms} member farms, about {kg(totals.kg)}
            </p>
          </div>
          <span className="pill pill--warn pill--lg">Ready in about {proposal.forecastAlertWeeksBefore} weeks</span>
        </div>
        <ol className="steps">
          {steps.map((s) => (
            <li className="step" key={s.n}>
              <div className={`step__bar step__bar--${s.state}`} />
              <div className="step__title">
                {s.state === 'done' ? (
                  <span className="step__dot step__dot--done">
                    <Icon name="check" size={14} strokeWidth={3} />
                  </span>
                ) : (
                  <span className={`step__dot step__dot--${s.state}`}>{s.n}</span>
                )}
                <span>{s.title}</span>
              </div>
              <span className={`step__note step__note--${s.state}`}>{s.note}</span>
            </li>
          ))}
        </ol>
      </Card>

      <Card as="section" aria-label="Pool trucks" padding={20} className="today-trucks">
        <div className="today-trucks__map">
          <MapArt label="Map of 5 tomato farms with a pickup route from stop 1 to stop 5">
            <polyline
              points={routePoints}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth={3}
              strokeDasharray="7 6"
              strokeLinecap="round"
            />
            {routeStops.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r={14} fill="#FFFFFF" />
                <text x={p.x} y={p.y + 5} className="map-num" fill="#1D1F1A">{i + 1}</text>
              </g>
            ))}
          </MapArt>
          <span className="map-chip map-chip--dark">
            <Icon name="truck" size={16} />
            1 truck, {tomatoMembers.length} pickups
          </span>
          <span className="map-chip map-chip--light">Then on to {sample.buyerA}</span>
        </div>

        <div className="today-trucks__info">
          <div>
            <span className="eyebrow">Pool trucks</span>
            <h2 className="h-card h-card--lg">Approve the shared truck</h2>
            <p className="muted">
              {tomatoMembers.length} nearby farms harvest the same week. {sample.trucker.name} picks up from each farm gate.
            </p>
          </div>
          <ol className="stop-list">
            {tomatoMembers.map((m, i) => (
              <li key={m.id}>
                <span className="stop-list__n">{i + 1}</span>
                <span className="grow">{m.name}</span>
                <span className="muted">{kg(m.kg)}</span>
              </li>
            ))}
          </ol>
          <div className="between baseline">
            <span className="muted">Truck cost, split {proposal.farmsPerTruck} ways</span>
            <span className="h-num">{peso(proposal.truckShare)} per farm</span>
          </div>
          <div className="btn-row push-down">
            <Button variant="secondary" style={{ flex: '1 1 120px' }}>Edit route</Button>
            <Button style={{ flex: '2 1 160px' }}>Approve booking</Button>
          </div>
          <AssistantTip mascot="wave" width={56} height={80}>
            I grouped these {tomatoMembers.length} farms because they harvest the same week. Nothing is booked until you approve.
          </AssistantTip>
        </div>
      </Card>

      <Card as="section" aria-label="Find buyers" className="today-buyers">
        <div className="today-buyers__text">
          <div>
            <span className="eyebrow">Find buyers</span>
            <h2 className="h-card">Send the supply post to buyers</h2>
          </div>
          <ul className="chips">
            <li>Tomatoes</li>
            <li>About {kg(totals.kg)}</li>
            <li>Pickup {sample.pickupWeek.replace('Week', 'week')}</li>
            <li>{sample.grade}</li>
          </ul>
        </div>
        <div className="btn-row">
          <Button variant="secondary" style={{ padding: '0 20px' }}>Edit post</Button>
          <Button style={{ padding: '0 22px' }}>Send to buyers</Button>
        </div>
      </Card>
    </>
  )
}
