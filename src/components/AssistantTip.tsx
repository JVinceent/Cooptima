import type { ReactNode } from 'react'

export type MascotName = 'wave' | 'clipboard' | 'truck' | 'receipt'

type MascotProps = {
  name: MascotName
  width: number
  height: number
}

// The assistant mascot. Keep it small (56-96px) and use it at most once per screen.
export function Mascot({ name, width, height }: MascotProps) {
  return (
    <img
      className="mascot"
      src={`/assets/mascot-${name}.png`}
      alt="Cooptima assistant"
      style={{ width, height }}
    />
  )
}

type Props = {
  mascot: MascotName
  width: number
  height: number
  children: ReactNode
  /** soft = grey-beige bubble inside a card; card = white bubble with a border on the page */
  bubble?: 'soft' | 'card'
}

// Mascot + speech bubble. The assistant only suggests; the manager approves.
export function AssistantTip({ mascot, width, height, children, bubble = 'soft' }: Props) {
  return (
    <div className={`tip tip--${bubble}`}>
      <Mascot name={mascot} width={width} height={height} />
      <p className="tip__bubble">{children}</p>
    </div>
  )
}
