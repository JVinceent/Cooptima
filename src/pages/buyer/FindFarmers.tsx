import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { Icon } from '../../components/Icon'
import { MapArt } from '../../components/MapArt'
import { StatusPill } from '../../components/StatusPill'
import { buyerCrops, buyerFarmers, buyerSpot, sample, type BuyerFarmer } from '../../data/sample'
import { kg, peso, weekdayDate } from '../../format'

type Request = { location: string; date: string; crop: string }

// A map pin whose tip sits on (x, y).
function Pin({ x, y, fill, ring, dot, scale = 1 }: { x: number; y: number; fill: string; ring: string; dot: string; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M0 0 L-11 -15 A14 14 0 1 1 11 -15 Z" fill={fill} stroke={ring} strokeWidth={3} strokeLinejoin="round" />
      <circle cx={0} cy={-24} r={5} fill={dot} />
    </g>
  )
}

function Chip({ x, y, text }: { x: number; y: number; text: string }) {
  const w = text.length * 11 + 20
  return (
    <g>
      <rect x={x - w / 2} y={y - 22} width={w} height={26} rx={13} fill="#1D1F1A" />
      <text x={x} y={y - 4} fill="#FFFFFF" fontSize={15} fontWeight={600} textAnchor="middle">{text}</text>
    </g>
  )
}

// Step 1: where, when, what. Step 2: a map with "You" in the middle and the farmers around you.
// Tap a farmer to see them and order. Laid out like a phone screen.
export default function FindFarmers() {
  const [request, setRequest] = useState<Request | null>(null)
  const [form, setForm] = useState<Request>({ location: 'Quezon City, Metro Manila', date: '2026-12-07', crop: 'Tomatoes' })
  const [selectedId, setSelectedId] = useState<string>()
  const [qty, setQty] = useState('')
  const [ordered, setOrdered] = useState<string[]>([])

  if (!request) {
    return (
      <div className="buyer-phone">
        <div className="row-gap-14">
          <img src="/assets/chibi-buyer.webp" alt="" width={64} height={64} />
          <h1 className="buyer__title">Hello, {sample.buyerA}!</h1>
        </div>

        <form
          className="stack-16"
          onSubmit={(e) => {
            e.preventDefault()
            setSelectedId(undefined)
            setRequest(form)
          }}
        >
          <label className="field">
            Location
            <input type="text" required placeholder="Type your location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </label>

          <div className="findmap" aria-label="Your location on the map">
            <MapArt label="Map showing your location" top={-48} bottom={346}>
              <Pin x={buyerSpot.x} y={buyerSpot.y} fill="#1D1F1A" ring="#FFFFFF" dot="#FFFFFF" scale={1.3} />
              <Chip x={buyerSpot.x} y={buyerSpot.y - 44} text="You" />
            </MapArt>
          </div>

          <div className="row-gap-16 wrap">
            <label className="field">
              Date
              <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </label>
            <label className="field">
              Goods
              <select value={form.crop} onChange={(e) => setForm({ ...form, crop: e.target.value })}>
                {buyerCrops.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
          </div>

          <Button submit size="lg" style={{ height: 50, fontSize: 17 }}>Find farmers</Button>
        </form>
      </div>
    )
  }

  const matches = buyerFarmers.filter((f) => f.crop === request.crop)
  const selected = matches.find((f) => f.id === selectedId)
  const readyInTime = (f: BuyerFarmer) => f.readyOn <= request.date
  const choose = (f: BuyerFarmer) => {
    setSelectedId(f.id)
    setQty(String(f.kg))
  }
  const quantity = selected ? Math.min(selected.kg, Math.max(1, Number(qty) || 0)) : 0
  const isOrdered = selected ? ordered.includes(selected.id) : false

  return (
    <div className="buyer-phone">
      <div className="between baseline">
        <div>
          <h1 className="buyer__title">Farmers near you</h1>
          <p className="muted">{request.crop}, needed by {weekdayDate(request.date)}</p>
        </div>
        <button type="button" className="link-btn strong" onClick={() => setRequest(null)}>Change</button>
      </div>

      <div className="findmap">
        <MapArt label={`Map of ${matches.length} farmers growing ${request.crop}, with you in the middle`} top={-48} bottom={346}>
          {matches.map((f) => {
            const fit = readyInTime(f)
            const isSelected = f.id === selectedId
            const pick = () => choose(f)
            return (
              <g
                key={f.id}
                role="button"
                tabIndex={0}
                aria-label={`${f.farmer}, ${peso(f.pricePerKg)} per kg, ${f.distanceKm} km away`}
                style={{ cursor: 'pointer' }}
                onClick={pick}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    pick()
                  }
                }}
              >
                <Pin x={f.x} y={f.y} fill={fit ? '#3F8113' : '#FFFFFF'} ring={isSelected ? '#DD5909' : fit ? '#FFFFFF' : '#1D1F1A'} dot={fit ? '#FFFFFF' : '#1D1F1A'} scale={isSelected ? 1.5 : 1.15} />
              </g>
            )
          })}
          <Pin x={buyerSpot.x} y={buyerSpot.y} fill="#1D1F1A" ring="#FFFFFF" dot="#FFFFFF" scale={1.3} />
          <Chip x={buyerSpot.x} y={buyerSpot.y - 44} text="You" />
          {selected && <Chip x={selected.x} y={selected.y - 52} text={selected.farmer} />}
        </MapArt>
      </div>
      <div className="legend-row small muted">
        <span><i style={{ background: '#3F8113' }} />Ready by your date</span>
        <span><i style={{ background: '#FFFFFF', border: '1px solid #1D1F1A' }} />Ready later</span>
      </div>

      {selected ? (
        <Card as="section" aria-label={selected.farmer} padding={18} className="stack-14">
          <div className="row-gap-14">
            <span className="profile-avatar" aria-hidden="true"><Icon name="user" size={26} /></span>
            <div className="grow">
              <h2 className="h-card h-card--lg">{selected.farmer}</h2>
              <p className="muted small">{selected.crop}, {selected.distanceKm} km away, {kg(selected.kg)} available</p>
            </div>
            <div className="right">
              <div className="h-num h-num--md">{peso(selected.pricePerKg)}</div>
              <div className="muted small">per kg</div>
            </div>
          </div>

          <div className="between wrap-gap baseline">
            <span className="muted">Ready {weekdayDate(selected.readyOn)}</span>
            {!readyInTime(selected) && <StatusPill tone="warn" size="sm">After your date</StatusPill>}
          </div>

          {isOrdered ? (
            <>
              <div className="banner banner--ok">
                <Icon name="check" size={20} strokeWidth={2.5} />
                Order sent to {selected.coop}
              </div>
              <p className="muted small">The coop manager will accept or decline it, then arrange pickup and delivery.</p>
              <Link to="/buyer/orders" className="strong">See my orders</Link>
            </>
          ) : (
            <form
              className="stack-14"
              onSubmit={(e) => {
                e.preventDefault()
                setOrdered([...ordered, selected.id])
              }}
            >
              <div className="row-gap-16">
                <label className="field">
                  How many kg?
                  <input type="number" min={1} max={selected.kg} step={10} value={qty} onChange={(e) => setQty(e.target.value)} />
                </label>
                <div className="right">
                  <div className="muted small">Total</div>
                  <div className="h-num h-num--md">{peso(quantity * selected.pricePerKg)}</div>
                </div>
              </div>
              <Button submit size="lg" style={{ height: 48 }}>Order</Button>
            </form>
          )}
        </Card>
      ) : (
        <Card as="section" aria-label="Choose a farmer" padding={18}>
          <p className="muted">
            {matches.length} {matches.length === 1 ? 'farmer' : 'farmers'} growing {request.crop.toLowerCase()}. Tap one on the map to see them and order.
          </p>
        </Card>
      )}
    </div>
  )
}
