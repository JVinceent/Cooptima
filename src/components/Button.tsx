import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Props = {
  children: ReactNode
  variant?: 'primary' | 'secondary'
  /** sm 44px, md 46px, lg 50px, xl 56px */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** Pass `to` to render a link to another screen; otherwise it is a plain button. */
  to?: string
  onClick?: () => void
  /** Greys out a plain button (ignored on links) */
  disabled?: boolean
  /** Makes it submit the form it sits in (a plain button never does) */
  submit?: boolean
  className?: string
  style?: CSSProperties
}

export function Button({ children, variant = 'primary', size = 'md', to, onClick, disabled, submit, className = '', style }: Props) {
  const classes = `btn btn--${variant} btn--${size} ${className}`.trim()
  if (to) {
    return (
      <Link to={to} className={classes} style={style}>
        {children}
      </Link>
    )
  }
  return (
    <button type={submit ? 'submit' : 'button'} className={classes} style={style} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}
