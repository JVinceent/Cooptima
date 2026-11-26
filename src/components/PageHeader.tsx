import type { ReactNode } from 'react'

type Props = {
  title: string
  subtitle?: string
  /** Optional button on the right */
  action?: ReactNode
}

// Page title (32px Poppins) with a short line under it.
export function PageHeader({ title, subtitle, action }: Props) {
  return (
    <header className="page-head">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action}
    </header>
  )
}
