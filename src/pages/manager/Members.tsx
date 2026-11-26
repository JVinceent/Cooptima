import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { PageHeader } from '../../components/PageHeader'
import { members, proposal, sample } from '../../data/sample'
import { minusPeso, peso } from '../../format'

export default function Members() {
  return (
    <>
      <PageHeader
        title="Members and loans"
        subtitle="This season's production loans and how each one gets repaid."
        action={<Button style={{ padding: '0 20px' }}>Record a loan</Button>}
      />

      <div className="split">
        <Card as="section" aria-label="Members" padding={0} className="col-main" style={{ overflow: 'hidden' }}>
          <div className="table-scroll">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Member</th>
                  <th scope="col">Crop</th>
                  <th scope="col" className="right">Loan</th>
                  <th scope="col">Repays from</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id} className={m.id === 1 ? 'table__hl' : undefined}>
                    <td className="strong">{m.name}</td>
                    <td>{m.crop}</td>
                    <td className="right">{peso(m.loan)}</td>
                    <td>{m.repaysFrom}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card as="section" aria-label="Aling Tina's passbook" className="col-side stack-18">
          <div>
            <h2 className="h-card h-card--lg">{proposal.farmer.name}</h2>
            <p className="muted">
              Tomatoes on about {proposal.farmer.areaM2.toLocaleString('en-US')} m². Borrowing from the coop since{' '}
              {proposal.farmer.borrowingSince}.
            </p>
          </div>
          <div className="well">
            <div className="muted small">Still owed</div>
            <div className="h-num h-num--xl">{peso(proposal.loan)}</div>
            <div className="muted small">Paid from her share of the Dec 7 sale</div>
          </div>
          <div>
            <h3 className="h-sub">Passbook</h3>
            <ol className="ledger">
              <li>
                <div>
                  <div>Loan for seeds and fertilizer</div>
                  <div className="muted small">{sample.loanDate}</div>
                </div>
                <div className="strong">{peso(proposal.loan)}</div>
              </li>
              <li className="muted">
                <div>
                  <div>Payment from tomato sale</div>
                  <div className="small">Dec 7, scheduled</div>
                </div>
                <div>{minusPeso(proposal.loan)}</div>
              </li>
            </ol>
          </div>
          <a href="#passbook" onClick={(e) => e.preventDefault()} className="strong">
            Open full passbook
          </a>
        </Card>
      </div>
    </>
  )
}
