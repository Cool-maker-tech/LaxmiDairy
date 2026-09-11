import { Children, cloneElement, isValidElement } from 'react'
import { useReveal, useTextReveal } from '../hooks/useReveal.js'
import { cx } from '../utils/format.js'

/**
 * Wraps each child in a clipping mask so it can slide up from behind an
 * invisible edge. Pass `as` to control the rendered tag ('h1', 'p', …).
 *
 * Usage:
 *   <RevealText as="h1"><span>Pure. Fresh.</span><span>Every day.</span></RevealText>
 */
export function RevealText({
  as: Tag = 'div',
  children,
  className,
  delay = 0,
  stagger = 0.09,
  start,
  play = true,
  ...rest
}) {
  const ref = useTextReveal({ delay, stagger, start, play })

  return (
    <Tag ref={ref} className={className} {...rest}>
      {Children.map(children, (child, i) => (
        <span className="reveal-line" key={i}>
          {isValidElement(child) ? (
            cloneElement(child)
          ) : (
            <span>{child}</span>
          )}
        </span>
      ))}
    </Tag>
  )
}

/**
 * Fades and lifts its `[data-reveal]` descendants as the block scrolls in.
 * Children without the attribute are animated as one unit.
 */
export function Reveal({ as: Tag = 'div', children, className, ...options }) {
  const ref = useReveal(options)
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}

/** Small caps label with a gold rule — used above every section heading. */
export function Eyebrow({ children, tone = 'dark', className }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-3',
        tone === 'light' ? 'text-gold-300' : 'text-gold-700',
        className,
      )}
    >
      <span
        className={cx(
          'h-px w-8 sm:w-12',
          tone === 'light' ? 'bg-gold-300/60' : 'bg-gold-600/45',
        )}
        aria-hidden="true"
      />
      <span className="eyebrow">{children}</span>
    </span>
  )
}
