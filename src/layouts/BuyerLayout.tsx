import { NavLink, Outlet } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { sample } from '../data/sample'

// Buyer: desktop web with a top bar.
export function BuyerLayout() {
  return (
    <div className="buyer">
      <header className="buyer__bar">
        <div className="buyer__bar-inner">
          <Logo size="sm" />
          <nav className="buyer__nav" aria-label="Main">
            <NavLink to="/buyer" end className={({ isActive }) => `toplink${isActive ? ' toplink--active' : ''}`}>
              Find farmers
            </NavLink>
            <NavLink to="/buyer/orders" className={({ isActive }) => `toplink${isActive ? ' toplink--active' : ''}`}>
              My orders
            </NavLink>
          </nav>
          <div className="buyer__user">
            <span className="avatar" aria-hidden="true">BA</span>
            <span>{sample.buyerA}</span>
          </div>
        </div>
      </header>
      <main className="buyer__main">
        <Outlet />
      </main>
    </div>
  )
}
