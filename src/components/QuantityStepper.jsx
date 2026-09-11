import { Minus, Plus } from 'lucide-react'
import { cx } from '../utils/format.js'

/**
 * Accessible −/+ stepper. The value itself is a live region so screen readers
 * announce the new quantity without the control losing focus.
 */
export default function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 50,
  label = 'Quantity',
  size = 'md',
  tone = 'dark',
  className,
}) {
  const dec = () => onChange(Math.max(min, value - 1))
  const inc = () => onChange(Math.min(max, value + 1))

  const sizes = {
    sm: { box: 'h-8', btn: 'h-8 w-8', icon: 13, text: 'text-xs w-8' },
    md: { box: 'h-11', btn: 'h-11 w-11', icon: 15, text: 'text-sm w-11' },
  }
  const s = sizes[size] ?? sizes.md

  const toneClasses =
    tone === 'light'
      ? 'border-ivory-100/25 text-ivory-100'
      : 'border-emerald-800/18 text-emerald-900'
  const hoverTone =
    tone === 'light' ? 'hover:bg-ivory-100/10' : 'hover:bg-emerald-800/[0.06]'

  return (
    <div
      className={cx(
        'inline-flex items-center rounded-full border',
        toneClasses,
        s.box,
        className,
      )}
    >
      <button
        type="button"
        onClick={dec}
        disabled={value <= min}
        aria-label={`Decrease ${label.toLowerCase()}`}
        className={cx(
          'flex items-center justify-center rounded-full transition-colors',
          s.btn,
          hoverTone,
          'disabled:opacity-30 disabled:hover:bg-transparent',
        )}
      >
        <Minus size={s.icon} strokeWidth={2} aria-hidden="true" />
      </button>

      <span
        className={cx('text-center font-sans font-semibold tabular-nums', s.text)}
        aria-live="polite"
        aria-atomic="true"
      >
        {value}
      </span>

      <button
        type="button"
        onClick={inc}
        disabled={value >= max}
        aria-label={`Increase ${label.toLowerCase()}`}
        className={cx(
          'flex items-center justify-center rounded-full transition-colors',
          s.btn,
          hoverTone,
          'disabled:opacity-30 disabled:hover:bg-transparent',
        )}
      >
        <Plus size={s.icon} strokeWidth={2} aria-hidden="true" />
      </button>
    </div>
  )
}
