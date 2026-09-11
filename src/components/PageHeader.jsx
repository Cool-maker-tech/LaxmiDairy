import { Eyebrow, Reveal, RevealText } from './Reveal.jsx'
import { cx } from '../utils/format.js'

/**
 * The masthead every inner page opens with. Keeps the type rhythm consistent
 * across Menu, Story, Visit, Cart and Checkout.
 */
export default function PageHeader({
  eyebrow,
  titleLines = [],
  intro,
  align = 'left',
  tone = 'dark',
  children,
  className,
}) {
  const light = tone === 'light'

  return (
    <header
      className={cx(
        'relative',
        light ? 'bg-emerald-950 text-ivory-100' : 'bg-ivory-100 text-emerald-950',
        'pt-28 pb-12 sm:pt-36 sm:pb-16 lg:pt-40 lg:pb-20',
        className,
      )}
    >
      <div className="container-x">
        <div className={cx('max-w-3xl', align === 'center' && 'mx-auto text-center')}>
          {eyebrow && (
            <Reveal y={14}>
              <span data-reveal className="block">
                <Eyebrow tone={light ? 'light' : 'dark'}>{eyebrow}</Eyebrow>
              </span>
            </Reveal>
          )}

          {titleLines.length > 0 && (
            <RevealText
              as="h1"
              className="fluid-h2 mt-5 font-display font-medium tracking-[-0.02em]"
              stagger={0.1}
            >
              {titleLines.map((line, i) => (
                <span key={i} className={i === titleLines.length - 1 && titleLines.length > 1 ? (light ? 'text-gold-300' : 'text-gold-600') : ''}>
                  {line}
                </span>
              ))}
            </RevealText>
          )}

          {intro && (
            <Reveal y={20} delay={0.15}>
              <p
                data-reveal
                className={cx(
                  'mt-6 max-w-xl font-sans text-[0.95rem] leading-relaxed',
                  align === 'center' && 'mx-auto',
                  light ? 'text-ivory-200/65' : 'text-ink-soft',
                )}
              >
                {intro}
              </p>
            </Reveal>
          )}

          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </header>
  )
}
