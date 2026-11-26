import { AssistantTip } from '../../components/AssistantTip'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { Icon } from '../../components/Icon'
import { PageHeader } from '../../components/PageHeader'
import { StatusPill } from '../../components/StatusPill'
import { proposal, sample, tinaReceipt, tomatoMembers } from '../../data/sample'
import { kg, minusPeso, peso } from '../../format'

export default function Settle() {
  const r = tinaReceipt
  return (
    <>
      <PageHeader
        title="Settle"
        subtitle={`${sample.pickupDay} tomato pickup. Weigh each farm's harvest, check the grade, then send the receipt.`}
      />

      <div className="row-gap-12 wrap">
        <div className="notice notice--ok">
          <Icon name="check" strokeWidth={2.5} />
          {sample.buyerA} deposit received: {peso(sample.deposit)}
        </div>
        <div className="notice">{sample.buyerA} balance: due after delivery</div>
      </div>

      <div className="split">
        <Card as="section" aria-label="Farms on this pickup" padding="8px 24px" className="col-main">
          <ol>
            {tomatoMembers.map((m, i) => {
              const state = i === 0 ? 'done' : i === 1 ? 'now' : 'later'
              return (
                <li className={`farm-row${state === 'later' ? ' farm-row--later' : ''}`} key={m.id}>
                  {state === 'done' ? (
                    <span className="num-dot num-dot--done"><Icon name="check" size={15} strokeWidth={3} /></span>
                  ) : (
                    <span className={`num-dot num-dot--${state}`}>{i + 1}</span>
                  )}
                  <div className="grow">
                    <div className="strong farm-row__name">{m.name}</div>
                    <div className={state === 'done' ? 'muted' : undefined}>
                      {state === 'done' && `${kg(m.kg)}, ${sample.grade}`}
                      {state === 'now' && 'Truck is at the farm gate'}
                      {state === 'later' && 'Waiting for pickup'}
                    </div>
                  </div>
                  {state === 'done' && <StatusPill tone="ok">Receipt sent</StatusPill>}
                  {state === 'now' && <Button size="sm" style={{ padding: '0 18px' }}>Weigh in</Button>}
                </li>
              )
            })}
          </ol>
        </Card>

        <Card as="section" aria-label="Aling Tina's settlement" className="col-side stack-16" style={{ flexBasis: 340 }}>
          <div>
            <h2 className="h-card h-card--lg">{proposal.farmer.name}</h2>
            <p className="muted">Weighed and graded by coop staff</p>
          </div>
          <dl className="rows rows--gap10">
            <div><dt>{r.kg} kg × {peso(r.pricePerKg)}</dt><dd>{peso(r.sale)}</dd></div>
            <div><dt>Loan payment, fully paid</dt><dd>{minusPeso(r.loanPaid)}</dd></div>
            <div><dt>Truck share</dt><dd>{minusPeso(r.truckShare)}</dd></div>
            <div><dt>Cash paid at pickup</dt><dd>{minusPeso(r.cashAtPickup)}</dd></div>
            <div className="rows__total">
              <dt className="strong">Balance to credit</dt>
              <dd className="h-num h-num--md">{peso(r.balance)}</dd>
            </div>
          </dl>
          <AssistantTip mascot="receipt" width={56} height={80}>
            Her loan is fully paid. I'll credit her {peso(r.balance)} once {sample.buyerA}'s payment reaches the coop.
          </AssistantTip>
          <div className="between wrap-gap resend">
            <span>Receipt sent by text, 10:15 AM</span>
            <Button variant="secondary" size="sm" style={{ padding: '0 16px', height: 42 }}>Resend</Button>
          </div>
        </Card>
      </div>
    </>
  )
}
