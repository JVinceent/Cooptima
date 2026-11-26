import { Link } from 'react-router-dom'
import { Icon } from './Icon'

// The round back button on the trucker's Find loads and trip screens: a link, or a button that steps back.
export function RoundBack({ to, onClick, label }: { to?: string; onClick?: () => void; label: string }) {
  const icon = <Icon name="back" size={20} strokeWidth={2} />
  return to ? (
    <Link to={to} className="round-btn" aria-label={label}>{icon}</Link>
  ) : (
    <button type="button" className="round-btn" aria-label={label} onClick={onClick}>{icon}</button>
  )
}
