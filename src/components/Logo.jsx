import { useEffect, useState } from 'react'
import { cx } from '../utils/format.js'

/**
 * Brand mark.
 *
 * Drop the shop's own artwork at `public/logo.png` and it is used
 * automatically; until then the inline SVG recreation below is shown, so the
 * site never renders a broken image.
 */
const CUSTOM_LOGO_SRC = '/logo.png'

let customLogoStatus = 'unknown' // 'unknown' | 'available' | 'missing'
const listeners = new Set()

function probeCustomLogo() {
  if (customLogoStatus !== 'unknown' || typeof window === 'undefined') return
  customLogoStatus = 'probing'
  const img = new Image()
  img.onload = () => {
    customLogoStatus = 'available'
    listeners.forEach((l) => l())
  }
  img.onerror = () => {
    customLogoStatus = 'missing'
    listeners.forEach((l) => l())
  }
  img.src = CUSTOM_LOGO_SRC
}

function useCustomLogo() {
  const [status, setStatus] = useState(customLogoStatus)

  useEffect(() => {
    const update = () => setStatus(customLogoStatus)
    listeners.add(update)
    probeCustomLogo()
    update()
    return () => listeners.delete(update)
  }, [])

  return status === 'available'
}

/**
 * The ring-and-monogram mark, drawn inline so it inherits currentColor.
 * Only the ring and the LD monogram: the shop's full artwork also sets LAXMI
 * and DAIRY inside the ring, which turns to mud at navbar size — and the
 * wordmark beside it already says the name.
 */
function Mark({ className }) {
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor">
        <circle cx="200" cy="200" r="170" strokeWidth="7" />
        <circle cx="200" cy="200" r="158" strokeWidth="3" />
      </g>
      <g fill="currentColor">
        <circle cx="292" cy="66" r="6" />
        <circle cx="318" cy="92" r="4" />
        <circle cx="340" cy="120" r="3" />
        <circle cx="268" cy="52" r="3.4" />
        <circle cx="358" cy="168" r="4.6" />
        <circle cx="372" cy="212" r="3" />
        <circle cx="104" cy="330" r="6" />
        <circle cx="76" cy="304" r="4" />
        <circle cx="56" cy="272" r="3.2" />
        <circle cx="134" cy="352" r="3.6" />
        <circle cx="38" cy="230" r="4.4" />
        <circle cx="30" cy="186" r="3" />
      </g>
      <g
        fill="currentColor"
        fontFamily="'Cormorant Garamond', Georgia, 'Times New Roman', serif"
        fontWeight="600"
      >
        <text x="128" y="268" fontSize="210" textAnchor="middle">
          L
        </text>
        <text x="252" y="292" fontSize="235" textAnchor="middle">
          D
        </text>
      </g>
    </svg>
  )
}

/**
 * @param {'mark'|'lockup'} variant  'mark' = ring only, 'lockup' = ring + wordmark
 */
export default function Logo({ variant = 'lockup', className, markClassName }) {
  const hasCustom = useCustomLogo()

  const mark = hasCustom ? (
    <img
      src={CUSTOM_LOGO_SRC}
      alt=""
      aria-hidden="true"
      className={cx('h-full w-auto object-contain', markClassName)}
    />
  ) : (
    <Mark className={cx('h-full w-auto', markClassName)} />
  )

  if (variant === 'mark') {
    return <span className={cx('block', className)}>{mark}</span>
  }

  return (
    <span className={cx('flex items-center gap-2.5 sm:gap-3', className)}>
      <span className="h-9 shrink-0 sm:h-10">{mark}</span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.32rem] leading-[0.95] font-semibold tracking-[0.02em] sm:text-[1.5rem]">
          Laxmi Dairy
        </span>
        <span className="eyebrow mt-[3px] text-[0.5rem] opacity-60 sm:text-[0.5625rem]">
          Surat · Gujarat
        </span>
      </span>
    </span>
  )
}
