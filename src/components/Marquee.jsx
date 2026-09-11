import { cx } from '../utils/format.js'

/**
 * A slow band of repeating words, used as a transition between dark and light
 * sections. Decorative — hidden from assistive tech, frozen for reduced motion
 * (see the `.marquee-track` rule in index.css).
 */
export default function Marquee({
  items = [],
  className,
  separator = '·',
  tone = 'dark',
}) {
  const sequence = [...items, ...items]

  return (
    <div
      aria-hidden="true"
      className={cx(
        'relative flex overflow-hidden border-y py-4 select-none sm:py-5',
        tone === 'light'
          ? 'border-ivory-100/12 bg-emerald-900 text-ivory-100/70'
          : 'hairline bg-ivory-200 text-emerald-900/70',
        className,
      )}
    >
      <div className="marquee-track flex shrink-0 items-center gap-8 pr-8 sm:gap-12 sm:pr-12">
        {sequence.map((item, i) => (
          <span key={`${item}-${i}`} className="flex shrink-0 items-center gap-8 sm:gap-12">
            <span className="font-display text-[1.35rem] whitespace-nowrap sm:text-[1.7rem]">
              {item}
            </span>
            <span className="text-gold-500/70">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
