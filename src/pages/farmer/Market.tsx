import { Card } from '../../components/Card'
import { Icon } from '../../components/Icon'
import { StatusPill } from '../../components/StatusPill'
import { marketNews, proposal, sample, tomatoMarket, totals } from '../../data/sample'
import { peso } from '../../format'

// Tomato price per kg over the last 8 weeks, with the coop's price drawn as a dashed line to compare.
const W = 320
const H = 150
const PAD = { left: 8, right: 8, top: 18, bottom: 26 }

export default function Market() {
  const weeks = tomatoMarket.weeks
  const prices = weeks.map((w) => w.price)
  const now = prices[prices.length - 1]
  const before = prices[prices.length - 2]
  const coop = proposal.pricePerKg
  const lo = Math.min(...prices, coop) - 2
  const hi = Math.max(...prices, coop) + 2
  const x = (i: number) => PAD.left + (i * (W - PAD.left - PAD.right)) / (weeks.length - 1)
  const y = (p: number) => PAD.top + ((hi - p) * (H - PAD.top - PAD.bottom)) / (hi - lo)
  const line = weeks.map((w, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(w.price).toFixed(1)}`).join(' ')
  const diff = now - before

  return (
    <>
      <Card as="section" variant="phone" aria-label="Tomato price" className="stack-10">
        <div>
          <div className="muted">Tomato price this week</div>
          <div className="h-num h-num--xxl">{peso(now)}<span className="per-kg">/kg</span></div>
          <div className="muted">
            {diff === 0 ? 'Same as last week' : `${diff > 0 ? 'Up' : 'Down'} ${peso(Math.abs(diff))} from last week`}
          </div>
        </div>

        <svg role="img" aria-label={`Tomato price over 8 weeks, from ${peso(prices[0])} to ${peso(now)} per kg`} viewBox={`0 0 ${W} ${H}`} width="100%">
          <line x1={PAD.left} x2={W - PAD.right} y1={y(coop)} y2={y(coop)} stroke="#3F8113" strokeWidth={2} strokeDasharray="6 5" />
          <text x={W - PAD.right} y={y(coop) - 6} textAnchor="end" fontSize={12} fontWeight={600} fill="#2D6410">Your coop price {peso(coop)}</text>
          <path d={line} fill="none" stroke="#1D1F1A" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={x(weeks.length - 1)} cy={y(now)} r={5} fill="#DD5909" stroke="#FFFFFF" strokeWidth={2} />
          <text x={PAD.left} y={H - 6} fontSize={12} fill="#4A5045">{weeks[0].label}</text>
          <text x={W - PAD.right} y={H - 6} textAnchor="end" fontSize={12} fill="#4A5045">{weeks[weeks.length - 1].label}</text>
        </svg>
      </Card>

      <Card as="section" variant="phone" aria-label="Your price" className="stack-14">
        <dl className="rows rows--gap10">
          <div><dt>Your coop price</dt><dd className="strong">{peso(coop)}/kg</dd></div>
          <div><dt>Buyer</dt><dd>{sample.buyerA}, {sample.grade}</dd></div>
          <div><dt>Trader at the farm gate</dt><dd>{peso(proposal.biyaheroPerKg)}/kg</dd></div>
        </dl>
        <div className="banner banner--ok">
          <Icon name="check" size={20} strokeWidth={2.5} />
          {peso(totals.perKgMoreThanBiyahero)} more per kg than the trader
        </div>
      </Card>

      <Card as="section" variant="phone" aria-label="News and announcements" padding="20px 20px 8px">
        <h2 className="h-card h-card--lg">News and announcements</h2>
        <ul className="news">
          {marketNews.map((n) => (
            <li key={n.text} className="news__item">
              <div className="row-gap-12">
                <StatusPill tone={n.tag === 'Coop' ? 'ok' : 'neutral'} size="sm">{n.tag}</StatusPill>
                <span className="muted small">{n.date}</span>
              </div>
              <p>{n.text}</p>
            </li>
          ))}
        </ul>
      </Card>
    </>
  )
}
