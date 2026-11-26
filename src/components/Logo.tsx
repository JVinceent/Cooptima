type Props = {
  size?: 'sm' | 'md'
}

// Logo mark + "Cooptima" wordmark (Coo in brand green, ptima in orange).
export function Logo({ size = 'md' }: Props) {
  return (
    <div className={`logo logo--${size}`}>
      <img src="/assets/logo-mark.png" alt="" />
      <span className="logo__word">
        <span className="logo__coo">Coo</span>
        <span className="logo__ptima">ptima</span>
      </span>
    </div>
  )
}
