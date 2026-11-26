import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../../components/Icon'
import { PhoneFrame } from '../../components/PhoneFrame'
import { proposal, sample, tinaReceipt, tomatoMarket, totals } from '../../data/sample'
import { peso } from '../../format'

type Message = { from: 'bot' | 'me'; text: string }

// Answers come only from figures the app already shows, so the assistant never makes up a number.
const r = tinaReceipt
const marketNow = tomatoMarket.weeks[tomatoMarket.weeks.length - 1].price
const questions: { ask: string; answer: string }[] = [
  {
    ask: 'How much do I owe?',
    answer: `You owe ${peso(proposal.loan)}. It will be paid from your ${sample.pickupDay} tomato sale.`,
  },
  {
    ask: 'When is my pickup?',
    answer: `${sample.pickupDay}, ${sample.pickupTime} at your farm gate, on a shared truck with ${totals.farms - 1} nearby farms.`,
  },
  {
    ask: 'How much will I get?',
    answer: `${peso(r.cashAtPickup)} in cash at pickup and ${peso(r.balance)} after the buyer pays.`,
  },
  {
    ask: "What's the tomato price?",
    answer: `Your coop price is ${peso(proposal.pricePerKg)}/kg for ${sample.grade} from ${sample.buyerA}. The market this week is ${peso(marketNow)}/kg.`,
  },
]

// A chat with the Cooptima assistant. Tap a question or type one; typed questions get a gentle fallback for now.
export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { from: 'bot', text: `Hi ${proposal.farmer.name}! Tap a question and I'll answer.` },
  ])
  const [draft, setDraft] = useState('')

  const ask = (text: string, answer: string) =>
    setMessages((m) => [...m, { from: 'me', text }, { from: 'bot', text: answer }])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    ask(text, 'I can answer the questions above for now. Please tap one.')
    setDraft('')
  }

  return (
    <PhoneFrame background="white" text="large">
      <header className="sms-head">
        <Link to="/farmer" className="sms-head__back" aria-label="Back">
          <Icon name="back" size={24} strokeWidth={2} />
        </Link>
        <span className="chat-avatar" aria-hidden="true">
          <img src="/assets/mascot-wave.png" alt="" width={40} height={40} />
        </span>
        <div>
          <div className="sms-head__name">Cooptima assistant</div>
          <div className="muted small">{proposal.coopName}</div>
        </div>
      </header>

      <div className="sms-thread" aria-live="polite">
        {messages.map((m, i) => (
          <p key={i} className={m.from === 'me' ? 'sms-bubble sms-bubble--me' : 'sms-bubble'}>{m.text}</p>
        ))}
      </div>

      <div className="chat-chips" role="group" aria-label="Questions">
        {questions.map((q) => (
          <button key={q.ask} type="button" className="chat-chip" onClick={() => ask(q.ask, q.answer)}>
            {q.ask}
          </button>
        ))}
      </div>

      <form className="sms-form" onSubmit={submit}>
        <label className="grow">
          <span className="sr-only">Message</span>
          <input type="text" placeholder="Type a question" value={draft} onChange={(e) => setDraft(e.target.value)} />
        </label>
        <button type="submit" className="sms-send" aria-label="Send">
          <Icon name="send" size={20} strokeWidth={2} />
        </button>
      </form>
    </PhoneFrame>
  )
}
