/**
 * Medidor em formato de frasco de perfume — o elemento visual de
 * assinatura do sistema. O preenchimento representa o nível de
 * estoque em relação a um limite de referência (3x o estoque mínimo).
 */
export default function VialGauge({ percent, low }) {
  const clamped = Math.max(0, Math.min(1, percent))
  const fillH = 44 * clamped
  const fillY = 64 - fillH
  const color = low ? 'var(--danger-soft)' : 'var(--gold-soft)'
  const clipId = `vial-clip-${Math.round(clamped * 1000)}-${low ? 'l' : 'h'}`

  return (
    <svg viewBox="0 0 40 70" width="40" height="70" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="2" width="12" height="15" rx="2" stroke="var(--border)" strokeWidth="1.4" />
      <rect x="16" y="0" width="8" height="4" rx="1" fill="var(--border)" />
      <path
        d="M7 26c0-3 2-8 7-9h12c5 1 7 6 7 9v34a5 5 0 0 1-5 5H12a5 5 0 0 1-5-5V26z"
        stroke="var(--border)"
        strokeWidth="1.4"
      />
      <clipPath id={clipId}>
        <path d="M7.7 26.3c0-2.7 1.9-7.4 6.6-8.3h11.4c4.7 0.9 6.6 5.6 6.6 8.3v33.5a4.3 4.3 0 0 1-4.3 4.3H12a4.3 4.3 0 0 1-4.3-4.3V26.3z" />
      </clipPath>
      <rect x="7" y={fillY} width="26" height={fillH} fill={color} opacity="0.85" clipPath={`url(#${clipId})`} />
    </svg>
  )
}
