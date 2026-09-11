import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { useMagnetic } from '../hooks/useMagnetic.js'
import { cx } from '../utils/format.js'

/* -------------------------------------------------------------------------
 *  Variants. Deliberately few, deliberately flat — the polish comes from
 *  motion and typography, not from gradients.
 * ---------------------------------------------------------------------- */
const VARIANTS = {
  primary:
    'bg-emerald-800 text-ivory-100 hover:bg-emerald-700 border border-emerald-800 hover:border-emerald-700',
  gold: 'bg-gold-500 text-emerald-950 hover:bg-gold-400 border border-gold-500 hover:border-gold-400',
  outline:
    'bg-transparent text-emerald-800 border border-emerald-800/30 hover:border-emerald-800 hover:bg-emerald-800 hover:text-ivory-100',
  outlineLight:
    'bg-transparent text-ivory-100 border border-ivory-100/35 hover:bg-ivory-100 hover:text-emerald-900 hover:border-ivory-100',
  ghost:
    'bg-transparent text-emerald-800 border border-transparent hover:bg-emerald-800/[0.06]',
  light:
    'bg-ivory-100 text-emerald-900 border border-ivory-100 hover:bg-ivory-200 hover:border-ivory-200',
}

const SIZES = {
  sm: 'px-4 py-2 text-[0.72rem] tracking-[0.14em]',
  md: 'px-6 py-3 text-[0.76rem] tracking-[0.16em] sm:px-7 sm:py-3.5',
  lg: 'px-7 py-3.5 text-[0.8rem] tracking-[0.16em] sm:px-9 sm:py-4.5',
}

const BASE =
  'group/btn relative inline-flex items-center justify-center gap-2.5 rounded-full font-sans font-semibold uppercase ' +
  'transition-colors duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ' +
  'disabled:pointer-events-none disabled:opacity-45 select-none'

/**
 * One button for the whole site. Renders as <button>, <a> or react-router
 * <Link> depending on the props it is given, and leans toward the cursor on
 * pointer-fine devices.
 */
const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    to,
    href,
    className,
    magnetic = true,
    icon: Icon,
    iconPosition = 'right',
    cursorLabel,
    ...rest
  },
  forwardedRef,
) {
  const magneticRef = useMagnetic(magnetic ? 10 : 0)

  const classes = cx(BASE, VARIANTS[variant] ?? VARIANTS.primary, SIZES[size] ?? SIZES.md, className)

  const content = (
    <>
      {Icon && iconPosition === 'left' && (
        <Icon
          size={16}
          strokeWidth={1.75}
          className="shrink-0 transition-transform duration-400 group-hover/btn:-translate-x-0.5"
          aria-hidden="true"
        />
      )}
      <span className="whitespace-nowrap">{children}</span>
      {Icon && iconPosition === 'right' && (
        <Icon
          size={16}
          strokeWidth={1.75}
          className="shrink-0 transition-transform duration-400 group-hover/btn:translate-x-0.5"
          aria-hidden="true"
        />
      )}
    </>
  )

  const shared = {
    className: classes,
    'data-cursor': 'button',
    'data-cursor-label': cursorLabel,
    ...rest,
  }

  const setRefs = (node) => {
    magneticRef.current = node
    if (typeof forwardedRef === 'function') forwardedRef(node)
    else if (forwardedRef) forwardedRef.current = node
  }

  if (to) {
    return (
      <Link to={to} ref={setRefs} {...shared}>
        {content}
      </Link>
    )
  }

  if (href) {
    const external = /^https?:|^mailto:|^tel:|^upi:/.test(href)
    return (
      <a
        href={href}
        ref={setRefs}
        {...(external && !href.startsWith('upi:')
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {})}
        {...shared}
      >
        {content}
      </a>
    )
  }

  return (
    <button type="button" ref={setRefs} {...shared}>
      {content}
    </button>
  )
})

export default Button
