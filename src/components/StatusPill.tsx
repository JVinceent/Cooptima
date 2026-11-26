import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  /** ok = green, warn = orange ("Needs your OK"), neutral = grey */
  tone?: 'ok' | 'warn' | 'neutral'
  /** md is the slightly larger pill used on buyer and trucker screens */
  size?: 'sm' | 'md'
}

export function StatusPill({ children, tone = 'neutral', size = 'sm' }: Props) {
  return <span className={`pill pill--${tone} pill--${size}`}>{children}</span>
}
