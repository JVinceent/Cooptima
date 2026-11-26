import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Icon, type IconName } from '../components/Icon'
import { PhoneFrame } from '../components/PhoneFrame'
import { proposal, sample } from '../data/sample'
import { LangProvider, useT } from '../i18n'

// Every trucker screen has a way back: Home goes to the role list, the rest go to the screen before them.
function BackButton({ to }: { to: string }) {
  const { t } = useT()
  return (
    <Link to={to} className="trk-back" aria-label={t.back}>
      <Icon name="back" size={22} strokeWidth={2} />
    </Link>
  )
}

function CallButton() {
  const { t } = useT()
  return (
    <button type="button" className="call-btn call-btn--sm" aria-label={t.callCoop}>
      <Icon name="phone" size={20} />
    </button>
  )
}

// The language lives above every trucker screen so Profile can switch all of them.
export function TruckerLayout() {
  return (
    <LangProvider>
      <TruckerShell />
    </LangProvider>
  )
}

// Trucker: phone screen with a header on top. The header changes by screen.
// The bottom tabs show on Home, Map and Profile, and hide during a trip so the job stays in focus.
function TruckerShell() {
  const { t, date } = useT()
  const tabs: { to: string; label: string; icon: IconName; end?: boolean }[] = [
    { to: '/trucker', label: t.tabHome, icon: 'home', end: true },
    { to: '/trucker/map', label: t.tabMap, icon: 'map' },
    { to: '/trucker/profile', label: t.tabProfile, icon: 'user' },
  ]
  const { pathname } = useLocation()
  const inTrip = pathname === '/trucker/today' || pathname === '/trucker/dropoff'

  let header
  if (pathname === '/trucker/today') {
    header = (
      <header className="trk-head trk-head--today">
        <BackButton to="/trucker" />
        <img src="/assets/logo-mark.png" alt="Cooptima" className="trk-head__logo" />
        <div className="trk-head__text">
          <div className="trk-head__title">{t.todaysTrip}</div>
          <div className="trk-head__sub">{date(sample.pickupDay)}, {proposal.coopName}</div>
        </div>
        <CallButton />
      </header>
    )
  } else if (pathname === '/trucker/dropoff') {
    header = (
      <header className="trk-head trk-head--back">
        <Link to="/trucker/today" className="back-link">
          <Icon name="back" size={20} strokeWidth={2} />
          {t.todaysTrip}
        </Link>
      </header>
    )
  } else if (pathname === '/trucker/map') {
    header = (
      <header className="trk-head trk-head--today">
        <BackButton to="/trucker" />
        <img src="/assets/logo-mark.png" alt="Cooptima" className="trk-head__logo" />
        <div className="trk-head__text">
          <div className="trk-head__title">{t.map}</div>
          <div className="trk-head__sub">{t.mapSub}</div>
        </div>
        <CallButton />
      </header>
    )
  } else {
    header = (
      <header className="trk-head trk-head--trips">
        <div className="trk-head__row">
          <BackButton to={pathname === '/trucker' ? '/' : '/trucker'} />
          <img src="/assets/logo-mark.png" alt="Cooptima" className="trk-head__logo" />
          <span className="trk-head__who">{sample.trucker.name}</span>
          <CallButton />
        </div>
        <h1>{pathname === '/trucker/profile' ? t.profile : t.myTrips}</h1>
      </header>
    )
  }

  return (
    <PhoneFrame>
      {header}
      <Outlet />
      {!inTrip && (
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
      )}
    </PhoneFrame>
  )
}
