import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Icon, type IconName } from '../components/Icon'
import { Logo } from '../components/Logo'
import { proposal } from '../data/sample'

type Item = { to: string; label: string; icon: IconName; end?: boolean; badge?: number }

const groups: { title?: string; items: Item[] }[] = [
  { items: [{ to: '/manager', label: 'Today', icon: 'calendar', end: true }] },
  {
    title: 'Records',
    items: [
      { to: '/manager/members', label: 'Members and loans', icon: 'book' },
      { to: '/manager/farm-map', label: 'Farm map', icon: 'map' },
    ],
  },
  {
    title: 'Harvest',
    items: [
      { to: '/manager/forecast', label: 'Forecast', icon: 'clock' },
      { to: '/manager/pool-trucks', label: 'Pool trucks', icon: 'truck', badge: 1 },
      { to: '/manager/find-buyers', label: 'Find buyers', icon: 'tag', badge: 1 },
      { to: '/manager/settle', label: 'Settle', icon: 'receipt' },
    ],
  },
]

// Manager: desktop web with a left sidebar.
export function ManagerLayout() {
  const { pathname } = useLocation()
  // "Harvest settled" is the end of the Settle step, so Settle stays highlighted.
  const settleActive = pathname === '/manager/settled'

  return (
    <div className="mgr">
      <nav className="mgr__nav" aria-label="Main">
        <div className="mgr__logo">
          <Logo />
        </div>
        <div className="mgr__org">
          <div className="mgr__org-name">{proposal.coopName}</div>
          <div className="mgr__org-role">Manager</div>
        </div>
        {groups.map((group, i) => (
          <div className="mgr__group" key={i}>
            {group.title && <div className="mgr__group-title">{group.title}</div>}
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `navlink${isActive || (item.to === '/manager/settle' && settleActive) ? ' navlink--active' : ''}`
                }
              >
                <Icon name={item.icon} />
                <span className="navlink__label">{item.label}</span>
                {item.badge && (
                  <span className="count-badge" aria-label={`${item.badge} waiting`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
      <main className="mgr__main">
        <div className="mgr__content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
