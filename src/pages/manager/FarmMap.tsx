import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { MapArt } from '../../components/MapArt'
import { PageHeader } from '../../components/PageHeader'
import { proposal, sample } from '../../data/sample'

export default function FarmMap() {
  const f = proposal.farmer
  return (
    <>
      <PageHeader
        title="Farm map"
        subtitle="Each member's farm, crop and planting date. Forecasts start here."
        action={<Button style={{ padding: '0 20px' }}>Plot a farm</Button>}
      />

      <div className="split split--stretch">
        <div className="col-main bigmap">
          <MapArt
            label="Map of member farms. Orange plots grow tomatoes. Aling Tina's farm is outlined."
            top={-60}
            bottom={360}
            outlineTina
          >
            <rect x={8} y={36} width={104} height={30} rx={15} fill="#FFFFFF" />
            <text x={60} y={56} className="map-label" fill="#1D1F1A">{f.name}</text>
          </MapArt>
          <div className="map-legend">
            <span><i style={{ background: '#DD5909' }} />Tomatoes</span>
            <span><i style={{ background: '#4E9128' }} />Other crops</span>
          </div>
        </div>

        <Card as="section" aria-label="Aling Tina's farm" className="col-side stack-18">
          <h2 className="h-card h-card--lg">{f.name}'s farm</h2>
          <dl className="rows rows--bordered">
            <div><dt>Crop</dt><dd>{f.crop}</dd></div>
            <div><dt>Area</dt><dd>About {f.areaM2.toLocaleString('en-US')} m²</dd></div>
            <div><dt>Planted</dt><dd>{sample.farmPlanted}</dd></div>
            <div><dt>Expected harvest</dt><dd>{sample.farmExpectedHarvest}</dd></div>
          </dl>
          <p className="muted small">Changing the planting date updates the forecast.</p>
          <Button variant="secondary">Edit farm</Button>
        </Card>
      </div>
    </>
  )
}
