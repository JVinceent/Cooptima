import { Card } from '../../components/Card'
import { MapArt, tinaPlot } from '../../components/MapArt'
import { StatusPill } from '../../components/StatusPill'
import { farmHealth, proposal, sample, tinaReceipt } from '../../data/sample'

// My plot on the farm map, what I should expect to harvest, and how the crop looks from above.
export default function Farm() {
  const r = tinaReceipt
  const labelX = tinaPlot.x + tinaPlot.width / 2
  const labelY = tinaPlot.y + tinaPlot.height / 2
  return (
    <>
      <Card as="section" variant="phone" aria-label="My plot" padding={0} className="farm-map">
        <div className="farm-map__art">
          <MapArt label="Map of the farms with your tomato plot outlined in white" top={-48} bottom={346} outlineTina>
            <rect x={labelX - 56} y={labelY - 17} width={112} height={34} rx={17} fill="#FFFFFF" />
            <text x={labelX} y={labelY + 8} textAnchor="middle" fontSize={22} fontWeight={600} fill="#1D1F1A">Your plot</text>
          </MapArt>
        </div>
        <div className="farm-map__caption">
          <div className="strong">{proposal.farmer.crop}</div>
          <div className="muted">About {proposal.farmer.areaM2.toLocaleString('en-US')} m², planted {sample.farmPlanted}</div>
        </div>
      </Card>

      <Card as="section" variant="phone" aria-label="Expected harvest" className="stack-6">
        <div className="muted">Expected harvest</div>
        <div className="h-num h-num--xxl">{r.kg} kg</div>
        <div className="muted">{sample.farmExpectedHarvest}, alert sent {sample.forecastAlertSent}</div>
      </Card>

      <Card as="section" variant="phone" aria-label="Farm health" className="stack-10">
        <div className="between baseline">
          <h2 className="h-card h-card--lg">Farm health</h2>
          <StatusPill tone="ok" size="md">{farmHealth.status}</StatusPill>
        </div>
        <p>{farmHealth.note}</p>
        <p className="muted small">We checked your farm with {farmHealth.source.toLowerCase()} photos on {farmHealth.checked}.</p>
      </Card>
    </>
  )
}
