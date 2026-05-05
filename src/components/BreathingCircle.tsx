interface Props {
  size?: number
  showHint?: boolean
}

export default function BreathingCircle({ size = 240, showHint = true }: Props) {
  return (
    <div
      className="relative grid place-items-center drift-slow"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 rounded-full breathe-halo2"
        style={{
          background:
            'radial-gradient(circle, var(--color-primary-light) 0%, transparent 65%)',
        }}
      />
      <div
        className="absolute inset-[10%] rounded-full breathe-halo"
        style={{
          background:
            'radial-gradient(circle, var(--color-primary) 0%, var(--color-primary-light) 50%, transparent 75%)',
        }}
      />
      <div
        className="relative rounded-full breathe-core grid place-items-center text-white"
        style={{
          width: size * 0.55,
          height: size * 0.55,
          background:
            'radial-gradient(circle at 30% 30%, var(--color-primary-light), var(--color-primary) 80%)',
          boxShadow:
            '0 18px 40px -12px rgb(91 123 90 / 0.45), inset 0 -8px 20px rgb(0 0 0 / 0.08)',
        }}
      >
        {showHint && (
          <span
            className="text-xs uppercase tracking-[0.18em] font-medium select-none"
            style={{ animation: 'breathe-text 9s ease-in-out infinite' }}
          >
            Inspira
          </span>
        )}
      </div>
    </div>
  )
}
