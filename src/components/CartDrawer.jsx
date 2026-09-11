import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ShoppingBag, Trash2, X } from 'lucide-react'
import SmartImage from './SmartImage.jsx'
import QuantityStepper from './QuantityStepper.jsx'
import Button from './Button.jsx'
import { useCart } from '../context/CartContext.jsx'
import { setScrollLocked } from '../hooks/useSmoothScroll.js'
import { formatINR } from '../utils/format.js'
import { ORDERING } from '../config/site.js'

/**
 * Slide-over cart. Traps focus while open, closes on Escape, restores focus to
 * whatever opened it, and locks page scroll (including Lenis).
 */
export default function CartDrawer() {
  const { items, subtotal, count, isEmpty, setQuantity, removeItem, isDrawerOpen, closeDrawer } =
    useCart()

  const panelRef = useRef(null)
  const closeRef = useRef(null)
  const lastFocused = useRef(null)

  useEffect(() => {
    if (!isDrawerOpen) return undefined

    lastFocused.current = document.activeElement
    setScrollLocked(true)
    // Wait a frame so the panel is painted before it takes focus.
    const raf = requestAnimationFrame(() => closeRef.current?.focus())

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeDrawer()
        return
      }
      if (event.key !== 'Tab' || !panelRef.current) return

      const focusables = panelRef.current.querySelectorAll(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
      )
      if (!focusables.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('keydown', onKeyDown)
      setScrollLocked(false)
      lastFocused.current?.focus?.()
    }
  }, [isDrawerOpen, closeDrawer])

  return (
    <>
      {/* scrim */}
      <div
        onClick={closeDrawer}
        aria-hidden="true"
        className={`fixed inset-0 z-[70] bg-emerald-950/45 backdrop-blur-[2px] transition-opacity duration-500 ${
          isDrawerOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        aria-hidden={!isDrawerOpen}
        {...(isDrawerOpen ? {} : { inert: true })}
        className={`fixed top-0 right-0 z-[75] flex h-[100dvh] w-full max-w-[26.5rem] flex-col bg-ivory-50 shadow-[var(--shadow-lift-lg)] transition-transform duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* ------------------------------------------------------- header -- */}
        <header className="flex items-center justify-between border-b hairline px-5 py-5 sm:px-7">
          <div>
            <h2 className="font-display text-[1.6rem] leading-none font-semibold text-emerald-950">
              Your Order
            </h2>
            <p className="eyebrow mt-1.5 text-ink-muted">
              {count} {count === 1 ? 'item' : 'items'}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={closeDrawer}
            aria-label="Close cart"
            data-cursor="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-800/15 text-emerald-900 transition-colors hover:border-emerald-800 hover:bg-emerald-800 hover:text-ivory-100"
          >
            <X size={17} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </header>

        {/* -------------------------------------------------------- items -- */}
        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full border hairline text-emerald-800/40">
              <ShoppingBag size={24} strokeWidth={1.25} aria-hidden="true" />
            </span>
            <div>
              <p className="font-display text-2xl text-emerald-950">Your cart is empty</p>
              <p className="mt-1.5 font-sans text-sm text-ink-muted">
                Shrikhand, peda, rabdi and the day&apos;s fresh dairy are waiting.
              </p>
            </div>
            <Button to="/menu" onClick={closeDrawer} variant="primary" size="sm" icon={ArrowRight}>
              Explore the menu
            </Button>
          </div>
        ) : (
          <ul className="flex-1 divide-y divide-emerald-800/[0.08] overflow-y-auto overscroll-contain px-5 sm:px-7">
            {items.map((item) => (
              <li key={item.key} className="flex gap-4 py-5">
                <Link
                  to={`/menu/${item.slug}`}
                  onClick={closeDrawer}
                  className="w-20 shrink-0 overflow-hidden sm:w-24"
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <SmartImage
                    src={item.image}
                    alt=""
                    label={item.name}
                    category={item.category}
                    ratio="aspect-square"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        to={`/menu/${item.slug}`}
                        onClick={closeDrawer}
                        className="font-display text-[1.1rem] leading-tight font-semibold text-emerald-950 hover:text-emerald-700"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-0.5 font-sans text-[0.72rem] tracking-wide text-ink-muted">
                        {item.type === 'weight'
                          ? item.optionLabel
                          : `${formatINR(item.unitPrice)} / ${item.unitNoun?.replace(/s$/, '')}`}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.key)}
                      aria-label={`Remove ${item.name} from cart`}
                      className="shrink-0 text-ink-muted transition-colors hover:text-red-700"
                    >
                      <Trash2 size={15} strokeWidth={1.6} aria-hidden="true" />
                    </button>
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                    <QuantityStepper
                      value={item.quantity}
                      onChange={(q) => setQuantity(item.key, q)}
                      min={0}
                      size="sm"
                      label={`quantity of ${item.name}`}
                    />
                    <span className="font-sans text-[0.85rem] font-semibold tabular-nums text-emerald-900">
                      {formatINR(item.lineTotal)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* ------------------------------------------------------- footer -- */}
        {!isEmpty && (
          <footer className="border-t hairline bg-ivory-100 px-5 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-7">
            <div className="flex items-baseline justify-between">
              <span className="eyebrow text-ink-muted">Subtotal</span>
              <span className="font-display text-3xl font-semibold text-emerald-950 tabular-nums">
                {formatINR(subtotal)}
              </span>
            </div>
            <p className="mt-1.5 font-sans text-[0.72rem] leading-relaxed text-ink-muted">
              {ORDERING.deliveryNote}
            </p>

            <div className="mt-4 flex flex-col gap-2.5">
              <Button
                to="/checkout"
                onClick={closeDrawer}
                variant="primary"
                size="md"
                icon={ArrowRight}
                className="w-full"
              >
                Proceed to checkout
              </Button>
              <div className="flex gap-2.5">
                <Button
                  to="/cart"
                  onClick={closeDrawer}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  magnetic={false}
                >
                  View cart
                </Button>
                <Button
                  onClick={closeDrawer}
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                  magnetic={false}
                >
                  Keep shopping
                </Button>
              </div>
            </div>
          </footer>
        )}
      </aside>
    </>
  )
}
