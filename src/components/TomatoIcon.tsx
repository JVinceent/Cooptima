// A small drawn tomato in the brand tomato orange and leaf green.
export function TomatoIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="27" r="16" fill="#DD5909" />
      <ellipse cx="17.5" cy="21" rx="4.5" ry="2.6" fill="#F2A06E" transform="rotate(-30 17.5 21)" />
      <path d="M24 13c-3 0-6.200 1.500-7.500 4.200 3.200-1.200 5.200-1.200 7.500 0 2.300-1.200 4.300-1.200 7.500 0C30.200 14.500 27 13 24 13z" fill="#3F8113" />
      <path d="M24 8.500V16" stroke="#2D6410" strokeWidth="2.800" strokeLinecap="round" />
    </svg>
  )
}
