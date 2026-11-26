const paths = {
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  book: <><path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z" /><path d="M5 17a3 3 0 0 1 3-3h11" /></>,
  map: <><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z" /><path d="M9 4v14M15 6v14" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  truck: <><path d="M2 7h12v9H2zM14 10h4l3 3v3h-7z" /><circle cx="6" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></>,
  tag: <><path d="M3 12V4h8l10 10-8 8z" /><circle cx="7.5" cy="7.5" r="1.5" /></>,
  receipt: <><path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" /><path d="M9 8h6M9 12h6" /></>,
  home: <><path d="M4 11l8-7 8 7v9H4z" /><path d="M10 20v-5h4v5" /></>,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  check: <path d="M5 12l5 5 9-10" />,
  back: <path d="M15 5l-7 7 7 7" />,
  next: <path d="M9 5l7 7-7 7" />,
  send: <path d="M4 12l16-8-6 16-2-7z" />,
  trend: <path d="M3 17l6-6 4 4 8-8M15 7h6v6" />,
  user:<><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></>,
  bell:<><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></>,
  warehouse:<path d="M4 21V9l8-5 8 5v12M9 21v-6h6v6" />,
}

export type IconName = keyof typeof paths

type Props = {
  name: IconName
  size?: number
  strokeWidth?: number
}

// Simple line icons. They take the text colour of their parent.
export function Icon({ name, size = 18, strokeWidth = 1.8 }: Props) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  )
}
