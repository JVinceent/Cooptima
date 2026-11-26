import { Link } from 'react-router-dom'
import { Icon } from '../../components/Icon'
import { PhoneFrame } from '../../components/PhoneFrame'
import { proposal, sample, tinaReceipt } from '../../data/sample'

// "P" instead of the peso sign, because this is a plain text message.
const p = (n: number) => `P${n.toLocaleString('en-US')}`

// A mock of the text messages a farmer gets from the coop. No tabs: it's the phone's own SMS app.
export default function Sms() {
  const r = tinaReceipt
  const receiptText = [
    'Receipt: tomatoes',
    `${r.kg} kg x ${p(r.pricePerKg)} = ${p(r.sale)}`,
    `Loan paid: -${p(r.loanPaid)} (fully paid)`,
    `Truck share: -${p(r.truckShare)}`,
    `Cash today: ${p(r.cashAtPickup)}`,
    `Balance: ${p(r.balance)} when the buyer pays`,
  ].join('\n')

  return (
    <PhoneFrame background="white" text="large">
      <header className="sms-head">
        <Link to="/farmer" className="sms-head__back" aria-label="Back">
          <Icon name="back" size={24} strokeWidth={2} />
        </Link>
        <span className="sms-head__avatar" aria-hidden="true">SP</span>
        <div>
          <div className="sms-head__name">{proposal.coopName}</div>
          <div className="muted small">Text message</div>
        </div>
      </header>

      <div className="sms-thread">
        <div className="sms-date">{sample.sms[0].date}</div>
        <p className="sms-bubble">{sample.sms[0].text}</p>

        <div className="sms-date sms-date--gap">{sample.sms[1].date}</div>
        <p className="sms-bubble">{sample.sms[1].text}</p>

        <div className="sms-date sms-date--gap">{sample.pickupDay}</div>
        <p className="sms-bubble sms-bubble--receipt">{receiptText}</p>
        <p className="sms-bubble sms-bubble--me">Salamat po!</p>
      </div>

      <form className="sms-form" onSubmit={(e) => e.preventDefault()}>
        <label className="grow">
          <span className="sr-only">Message</span>
          <input type="text" placeholder="Text message" />
        </label>
        <button type="button" className="sms-send" aria-label="Send">
          <Icon name="send" size={20} strokeWidth={2} />
        </button>
      </form>
    </PhoneFrame>
  )
}
