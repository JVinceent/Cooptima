import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  /** Page colour inside the phone. The SMS screen is white. */
  background?: 'ground' | 'white'
  /** Farmer screens use 17px body text, trucker screens 16px. */
  text?: 'large' | 'normal'
}

// 390px wide phone screen, centered on desktop and full screen on a real phone.
export function PhoneFrame({ children, background = 'ground', text = 'normal' }: Props) {
  return (
    <div className="phone-stage">
      <div className={`phone phone--${background} phone--text-${text}`}>{children}</div>
    </div>
  )
}
