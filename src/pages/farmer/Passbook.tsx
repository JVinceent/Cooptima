import { Link } from 'react-router-dom'
import { Card } from '../../components/Card'
import { Icon } from '../../components/Icon'
import { StatusPill } from '../../components/StatusPill'
import { proposal, sample } from '../../data/sample'
import { minusPeso, peso } from '../../format'

// Follows a real passbook: date, short plain description, the amount in or out, and the balance after each entry.
// The loan is still owed until the sale on pickup day, so the balance is the full loan and the payment is scheduled.
const paid = 0
const owed = proposal.loan - paid

// 'Sep 8' -> ['Sep', '8'];  'Mon, Dec 7' -> ['Dec', '7']
const monthDay = (text: string) => text.split(', ').pop()!.split(' ')
const [payMonth, payDay] = monthDay(sample.pickupDay)
const [loanMonth, loanDay] = monthDay(sample.loanDate)

export default function Passbook() {
  return (
    <>
      <Card as="section" variant="phone" aria-label="Loan balance" className="stack-14">
        <div>
          <div className="muted">You still owe</div>
          <div className="h-num h-num--xxl">{peso(owed)}</div>
        </div>
        <div>
          <div className="meter" role="img" aria-label={`${peso(paid)} paid of ${peso(proposal.loan)}`}>
            <div className="meter__fill" style={{ width: `${(paid / proposal.loan) * 100}%` }} />
          </div>
          <div className="between small muted pb-sums">
            <span>Paid {peso(paid)}</span>
            <span>Loan {peso(proposal.loan)}</span>
          </div>
        </div>
        <div className="banner banner--ok">
          <Icon name="check" size={20} strokeWidth={2.5} />
          Will be fully paid from your {sample.pickupDay} sale
        </div>
      </Card>

      <section aria-label="History" className="stack-10">
        <h2 className="h-sub">History</h2>
        <Card variant="phone" padding="4px 18px">
          <ol>
            <li className="pb-row">
              <div className="pb-date"><span>{payMonth}</span><strong>{payDay}</strong></div>
              <div className="grow">
                <div className="strong">Payment from tomato sale</div>
                <StatusPill size="sm">Scheduled</StatusPill>
              </div>
              <div className="right">
                <div className="strong green-text">{minusPeso(proposal.loan)}</div>
                <div className="muted small">Balance {peso(0)}</div>
              </div>
            </li>
            <li className="pb-row">
              <div className="pb-date"><span>{loanMonth}</span><strong>{loanDay}</strong></div>
              <div className="grow">
                <div className="strong">Loan given</div>
                <div className="muted small">Seeds and fertilizer</div>
              </div>
              <div className="right">
                <div className="strong">{peso(proposal.loan)}</div>
                <div className="muted small">Balance {peso(proposal.loan)}</div>
              </div>
            </li>
          </ol>
        </Card>
      </section>

      <Link to="/farmer/receipts" className="strong">See my receipts</Link>
    </>
  )
}
