import type { ReactNode } from 'react'

// Simple drawn map of the farms, shared by the manager and trucker screens.
// Plots are [x, y, width, height, colour, stretchesToTop, stretchesToBottom].
const TOMATO = '#DD5909'
type Plot = [number, number, number, number, string, boolean?, boolean?]
const plots: Plot[] = [
  [0, 0, 150, 70, '#2E6614', true],
  [154, 0, 90, 70, '#4E9128', true],
  [0, 74, 120, 90, TOMATO],
  [124, 74, 90, 90, '#6BA83F'],
  [0, 168, 90, 132, '#4E9128', false, true],
  [94, 168, 90, 62, TOMATO],
  [94, 234, 80, 66, '#8FC46A', false, true],
  [300, 0, 120, 110, '#6BA83F', true],
  [424, 0, 110, 60, '#2E6614', true],
  [424, 64, 110, 96, TOMATO],
  [538, 0, 102, 160, '#4E9128', true],
  [290, 114, 130, 90, '#8FC46A'],
  [260, 208, 150, 92, TOMATO, false, true],
  [414, 164, 120, 136, '#2E6614', false, true],
  [538, 164, 102, 70, TOMATO],
  [538, 238, 102, 62, '#6BA83F', false, true],
]

// Pickup stops 1 to 5 along the route, then on to the buyer (last point)
export const routeStops = [
  { x: 60, y: 119 },
  { x: 139, y: 199 },
  { x: 335, y: 254 },
  { x: 479, y: 112 },
  { x: 589, y: 199 },
]
export const routeToBuyer = { x: 640, y: 262 }
export const routePoints = [...routeStops, routeToBuyer].map((p) => `${p.x},${p.y}`).join(' ')

// Tina's plot (stop 1)
export const tinaPlot = { x: 0, y: 74, width: 120, height: 90 }

type Props = {
  label: string
  /** Map is drawn from y = top to y = bottom. Default 0 to 300. */
  top?: number
  bottom?: number
  /** Outline Aling Tina's plot in white */
  outlineTina?: boolean
  children?: ReactNode
}

export function MapArt({ label, top = 0, bottom = 300, outlineTina = false, children }: Props) {
  // The dirt road runs diagonally; its x position depends on y.
  const road = (y: number) => 250 - 0.3 * y
  return (
    <svg
      role="img"
      aria-label={label}
      width="100%"
      height="100%"
      viewBox={`0 ${top} 640 ${bottom - top}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <rect x="0" y={top} width="640" height={bottom - top} fill="#3A7A1E" />
      {plots.map(([x, y, w, h, fill, toTop, toBottom], i) => {
        const y0 = toTop ? top : y
        const y1 = toBottom ? bottom : y + h
        const isTina = outlineTina && x === tinaPlot.x && y === tinaPlot.y
        return (
          <rect
            key={i}
            x={x}
            y={y0}
            width={w}
            height={y1 - y0}
            fill={fill}
            stroke={isTina ? '#FFFFFF' : undefined}
            strokeWidth={isTina ? 5 : undefined}
          />
        )
      })}
      <polygon
        points={`${road(top)},${top} ${road(top) + 40},${top} ${road(bottom) + 40},${bottom} ${road(bottom)},${bottom}`}
        fill="#D9CBA3"
      />
      {children}
    </svg>
  )
}
