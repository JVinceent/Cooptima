import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Icon, type IconName } from '../components/Icon'
import { PhoneFrame } from '../components/PhoneFrame'
import { proposal } from '../data/sample'

const tabs: { to: string; label: string; icon: IconName; end?: boolean }[] = [
  { to: '/farmer', label: 'Home', icon: 'home', end: true },
  { to: '/farmer/farm', label: 'Farm', icon: 'map' },
  { to: '/farmer/market', label: 'Market', icon: 'trend' },
  { to: '/farmer/passbook', label: 'Passbook', icon: 'book' },
]

const titles: Record<string, string> = {
  '/farmer': `Hi, ${proposal.farmer.name}`,
  '/farmer/farm': 'My farm',
  '/farmer/market': 'Market',
  '/farmer/passbook': 'Passbook',
  '/farmer/receipts': 'Receipts',
}

// Farmer: phone screen with bottom tabs. The biggest text in the app.
// The mascot button in the header opens the chat from every tab screen.
export function FarmerLayout() {
  const { pathname } = useLocation()
  const isReceipts = pathname === '/farmer/receipts'
  return (
    <PhoneFrame text="large">
      <header className="phone-head">
        <div className="phone-head__row">
          {isReceipts && (
            <Link to="/farmer/passbook" className="trk-back" aria-label="Back to passbook">
              <Icon name="back" size={22} strokeWidth={2} />
            </Link>
          )}
          <img src="/assets/logo-mark.png" alt="Cooptima" className="phone-head__logo" />
          <span className="phone-head__org">{proposal.coopName}</span>
          <Link to="/farmer/chat" className="call-btn chat-btn" aria-label="Ask the assistant">
            <img src="/assets/mascot-wave.png" alt="" width={36} height={36} />
          </Link>
          <button type="button" className="call-btn" aria-label="Call the coop">
            <Icon name="phone" size={20} />
          </button>
        </div>
        <h1>{titles[pathname]}</h1>
      </header>
      <main className="phone-main">
        <Outlet />
      </main>
      <nav className="tabs" aria-label="Main">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) => `tab${isActive ? ' tab--active' : ''}`}
          >
            {({ isActive }) => (
              <>
                <Icon name={tab.icon} size={24} strokeWidth={isActive ? 2 : 1.8} />
                {tab.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </PhoneFrame>
  )
}
