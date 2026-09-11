import { formatINR, cx } from '../utils/format.js'

/**
 * Weight picker for products sold by the kilo. Every option carries its own
 * resolved price, so an impossible weight/price pairing cannot be built — the
 * price shown is always the price added to the cart.
 *
 * Rendered as a radiogroup for keyboard and screen-reader support.
 */
export default function WeightSelector({
  options,
  value,
  onChange,
  showPrices = true,
  columns = 3,
  className,
  label = 'Choose a weight',
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cx(
        'grid gap-2',
        columns === 2 ? 'grid-cols-2' : 'grid-cols-3',
        className,
      )}
    >
      {options.map((option) => {
        const active = option.id === value
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.id)}
            data-cursor="button"
            className={cx(
              'flex flex-col items-center justify-center rounded-lg border px-2 py-2.5 text-center transition-ui duration-300',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500',
              active
                ? 'border-emerald-800 bg-emerald-800 text-ivory-100 shadow-[0_8px_20px_-12px_rgba(11,59,46,0.7)]'
                : 'border-emerald-800/15 bg-transparent text-emerald-900 hover:border-emerald-800/45 hover:bg-emerald-800/[0.04]',
            )}
          >
            <span className="font-sans text-[0.78rem] font-semibold tracking-wide">
              {option.short}
            </span>
            {showPrices && (
              <span
                className={cx(
                  'mt-0.5 font-sans text-[0.7rem] tabular-nums',
                  active ? 'text-gold-300' : 'text-ink-muted',
                )}
              >
                {formatINR(option.price)}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
