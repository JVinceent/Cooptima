import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { Icon, type IconName } from '../components/Icon'
import { Logo } from '../components/Logo'
import { roles, type RoleId } from '../data/sample'

const icons: Record<RoleId, IconName> = {
  manager: 'calendar',
  buyer: 'tag',
  farmer: 'home',
  trucker: 'truck',
}

// Start page: pick a role, the assistant greets that role, then continue.
export default function Start() {
  const [selected, setSelected] = useState<RoleId>('manager')
  const navigate = useNavigate()
  const role = roles.find((r) => r.id === selected)!

  return (
    <main className="start">
      <div className="start__inner">
        <div className="start__body">
          <div className="greeter">
            <div aria-live="polite" className="greeter__live">
              <p className="bubble" key={role.id}>
                {role.greeting}
              </p>
            </div>
            <img
              key={role.id}
              className="greeter__mascot"
              src={`/assets/${role.image}`}
              alt={`Cooptima assistant dressed as the ${role.name.toLowerCase()}`}
            />
          </div>

          <div className="start__choices">
            <div className="start__head">
              <Logo />
              <h1>Choose a role</h1>
            </div>
            <div className="role-grid" role="radiogroup" aria-label="Role">
              {roles.map((r) => (
                <label className="role-card" key={r.id}>
                  <input
                    type="radio"
                    name="role"
                    value={r.id}
                    checked={selected === r.id}
                    onChange={() => setSelected(r.id)}
                  />
                  <span className="role-card__icon">
                    <Icon name={icons[r.id]} size={22} />
                  </span>
                  <span className="role-card__name">{r.name}</span>
                  <span className="role-card__device">{r.device}</span>
                </label>
              ))}
            </div>
            <Button size="lg" onClick={() => navigate(role.to)} className="start__continue">
              Continue
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
