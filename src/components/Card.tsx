import type { CSSProperties, ElementType, ReactNode } from 'react'

type Props = {
  children: ReactNode
  as?: ElementType
  /** 'phone' gives the larger 20px radius used on farmer screens */
  variant?: 'default' | 'phone'
  padding?: CSSProperties['padding']
  className?: string
  style?: CSSProperties
  'aria-label'?: string
}

// White surface, 1px border, rounded corners, no shadow.
export function Card({ children, as: Tag = 'div', variant = 'default', padding, className = '', style, ...rest }: Props) {
  return (
    <Tag
      className={`card card--${variant} ${className}`.trim()}
      style={padding === undefined ? style : { padding, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
