import { useState } from 'react'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { Icon } from '../../components/Icon'
import { Mascot } from '../../components/AssistantTip'
import { PageHeader } from '../../components/PageHeader'
import { cropSeasons, proposal, sample, type CropSeason } from '../../data/sample'
import { addDays, barPlacement, harvestRange, nextStep, summarize, WEEKS_SHOWN } from '../../forecast'
import { kg, peso, shortDate, shortRange } from '../../format'

const ALL = 'All'
const times = (n: number) => `${n.toFixed(1)}×`

export default function Forecast() {
  const check = sample.plantingCheck
  const [crop, setCrop] = useState<string>(ALL)
  const [windowStart, setWindowStart] = useState(sample.forecastStart)
  const [showRecord, setShowRecord] = useState(false)

  const single = crop !== ALL // kg and dates only make sense for one crop; "All" shows money only
  const seasons = single ? cropSeasons.filter((s) => s.crop === crop) : cropSeasons
  const figures = summarize(seasons)
  const weeks = Array.from({ length: WEEKS_SHOWN }, (_, i) => addDays(windowStart, i * 7))
  const windowEnd = addDays(windowStart, WEEKS_SHOWN * 7 - 1)
  const atStart = windowStart === sample.forecastStart
  const glanceTitle = single ? `${crop} season at a glance` : 'Season at a glance'

  return (
    <>
      <PageHeader
        title="Forecast"
        subtitle={`Expected harvests from planting dates, adjusted for weather. You get an alert ${proposal.forecastAlertWeeksBefore} weeks before each one.`}
        action={
          <Button variant="secondary" style={{ padding: 0, width: 46 }}>
            <Icon name="bell" size={20} />
            <span className="sr-only">Notifications</span>
          </Button>
        }
      />

      <Card as="section" aria-label="Planting check" className="planting">
        <Mascot name="clipboard" width={80} height={116} />
        <div className="planting__text">
          <span className="pill pill--warn pill--sm">Before planting</span>
          <h2 className="h-card">{check.members} members plan to plant tomatoes the same week</h2>
          <p className="muted">
            Their harvests would land together in {check.month}. Spreading planting over 2 to 3 weeks avoids one big glut.
          </p>
        </div>
        <Button variant="secondary" style={{ padding: '0 20px' }}>See the {check.members} members</Button>
      </Card>

      <Card as="section" aria-label="Forecast timeline">
        <div className="forecast-head">
          <h2 className="h-card">{atStart ? 'Next 7 weeks' : `7 weeks from ${shortDate(windowStart)}`}</h2>

          <div className="forecast-controls">
            <div className="row-gap-12 wrap" role="group" aria-label="Crop">
              {[ALL, ...cropSeasons.map((s) => s.crop)].map((name) => (
                <button
                  key={name}
                  type="button"
                  className="chip-btn"
                  aria-pressed={crop === name}
                  onClick={() => setCrop(name)}
                >
                  {name}
                </button>
              ))}
            </div>

            <div className="row-gap-12" role="group" aria-label="Dates">
              <button type="button" className="chip-btn chip-btn--icon" aria-label="Previous week" onClick={() => setWindowStart(addDays(windowStart, -7))}>‹</button>
              <span className="muted small forecast-range">{shortDate(windowStart)} to {shortDate(windowEnd)}</span>
              <button type="button" className="chip-btn chip-btn--icon" aria-label="Next week" onClick={() => setWindowStart(addDays(windowStart, 7))}>›</button>
              {!atStart && (
                <button type="button" className="link-btn strong" onClick={() => setWindowStart(sample.forecastStart)}>Reset</button>
              )}
            </div>
          </div>
        </div>

        <div className="table-scroll table-scroll--tips">
          <div className="timeline">
            <div />
            {weeks.map((w) => (
              <div className="timeline__week" key={w}>{shortDate(w)}</div>
            ))}
            {seasons.map((season) => (
              <FragmentRow key={season.crop} season={season} windowStart={windowStart} />
            ))}
          </div>
        </div>
      </Card>

      <Card as="section" aria-label={glanceTitle} className="card--green">
        <h2 className="h-card">{glanceTitle}</h2>

        <div className="glance__hero">
          <div className="muted small">Coop earns (estimate)</div>
          <div className="h-num h-num--xxl glance__amount">{peso(figures.coopEarns)}</div>
          <div className="glance__breakdown muted small">
            <span>Interest {peso(figures.interest)}</span>
            <span>Marketing fee {peso(figures.marketingFee)}</span>
          </div>
        </div>

        <button
          type="button"
          className="link-btn glance__toggle strong"
          aria-expanded={showRecord}
          aria-controls="full-record"
          onClick={() => setShowRecord((open) => !open)}
        >
          {showRecord ? 'Hide full record' : 'Review full record'}
        </button>

        {showRecord && (
          <>
        <div className="glance">
          {single ? (
            <>
              <Figure
                label="Lent this season"
                value={peso(figures.loans)}
                lines={[`${figures.farms.length} farms`, `Covered ${times(figures.coverage)} by expected sales`]}
              />
              <Figure
                label="Planting date range"
                value={`${shortDate(figures.plantedFrom)} to ${shortDate(figures.plantedTo)}`}
                lines={[`${figures.farms.length} farmers`]}
              />
              <Figure
                label="Expected harvest dates"
                value={`${shortDate(figures.harvestFrom)} to ${shortDate(figures.harvestTo)}`}
                lines={['first to last picking']}
              />
              <Figure
                label="Expected harvest volume"
                value={kg(figures.kg)}
                lines={[`about ${kg(figures.kgPerFarm)} per farm`]}
              />
            </>
          ) : (
            <>
              <Figure
                label="Lent this season"
                value={peso(figures.loans)}
                lines={[`Covered ${times(figures.coverage)} by expected sales`]}
              />
              <Figure label="Expected sales" value={peso(figures.sale)} lines={["at each crop's price"]} />
              <Figure label="Farms" value={String(figures.farms.length)} lines={[`${seasons.length} crops`]} />
            </>
          )}
        </div>

            <div id="full-record" className="table-scroll glance__record">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Member</th>
                  {!single && <th scope="col">Crop</th>}
                  <th scope="col" className="right">Loan</th>
                  <th scope="col">Planted</th>
                  <th scope="col">Harvest</th>
                  <th scope="col" className="right">Expected kg</th>
                  <th scope="col" className="right">{single ? `Sale at ${peso(seasons[0].pricePerKg)}/kg` : 'Sale'}</th>
                </tr>
              </thead>
              <tbody>
                {figures.farms.map((f) => (
                  <tr key={`${f.crop}-${f.name}`}>
                    <td className="strong">{f.name}</td>
                    {!single && <td>{f.crop}</td>}
                    <td className="right">{peso(f.loan)}</td>
                    <td>{shortDate(f.plantedOn)}</td>
                    <td>{shortDate(f.readyOn)}</td>
                    <td className="right">{kg(f.kg)}</td>
                    <td className="right">{peso(f.kg * f.pricePerKg)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="table__hl strong">
                  <td>Total</td>
                  {!single && <td />}
                  <td className="right">{peso(figures.loans)}</td>
                  <td>{single && `${shortDate(figures.plantedFrom)} to ${shortDate(figures.plantedTo)}`}</td>
                  <td>{single && `${shortDate(figures.harvestFrom)} to ${shortDate(figures.harvestTo)}`}</td>
                  <td className="right">{single && kg(figures.kg)}</td>
                  <td className="right">{peso(figures.sale)}</td>
                </tr>
              </tfoot>
            </table>
            </div>
          </>
        )}
      </Card>
    </>
  )
}

// One figure in the season summary: small label, big number, muted detail lines.
function Figure({ label, value, lines }: { label: string; value: string; lines: string[] }) {
  return (
    <div>
      <div className="muted small">{label}</div>
      <div className="h-num h-num--sm glance__value">{value}</div>
      {lines.map((line) => (
        <div className="muted small" key={line}>{line}</div>
      ))}
    </div>
  )
}

// One crop row: its label in the first column, then a bar across the harvest weeks showing kg and dates.
// Hovering or focusing the bar shows an info popup with the expected total and the alert.
function FragmentRow({ season, windowStart }: { season: CropSeason; windowStart: string }) {
  const { crop, color } = season
  const place = barPlacement(season, windowStart)
  const range = harvestRange(season)
  const total = kg(summarize([season]).kg)
  const step = nextStep(season)
  const tipId = `tip-${crop}`
  return (
    <>
      <div style={{ gridColumn: 1 }}>
        <div className="strong">{crop}</div>
        <div className="muted small">{season.farms.length} farms</div>
      </div>
      {place ? (
        <div className="timeline__bar" tabIndex={0} aria-describedby={tipId} style={{ gridColumn: `${place.from} / ${place.to}`, background: color }}>
          <span className="timeline__text">{total} · {shortRange(range.from, range.to)}</span>
          {/* bars touching the right edge anchor the popup to the right so it stays inside the card */}
          <span id={tipId} role="tooltip" className={`timeline__tip${place.to >= WEEKS_SHOWN + 2 ? ' timeline__tip--end' : ''}`}>
            Info: A total of {total} is expected. {step.alertSent ? 'Alert sent' : 'Alert on'} {shortDate(step.alertDate)}.
          </span>
        </div>
      ) : (
        <div className="muted small" style={{ gridColumn: `2 / ${WEEKS_SHOWN + 2}` }}>Not ready in these weeks</div>
      )}
    </>
  )
}
