import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Check, MessageCircle, Plus } from 'lucide-react'
import { gsap } from 'gsap'
import SmartImage from './SmartImage.jsx'
import WeightSelector from './WeightSelector.jsx'
import { useCart } from '../context/CartContext.jsx'
import { SALE_TYPE, weightOptions, displayPrice, unitPriceFor } from '../data/products.js'
import { enquiryUrl } from '../utils/whatsapp.js'
import { formatINR, cx } from '../utils/format.js'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.js'
import { useHasFinePointer } from '../hooks/useMediaQuery.js'

/**
 * The product card used on the menu, the home showcase and related rails.
 *
 * Three shapes, one component:
 *   • weight products  → inline weight picker, price updates live
 *   • unit products    → straight add, priced per glass/litre/piece
 *   • on-request       → WhatsApp enquiry instead of a fake price
 */
export default function ProductCard({ product, priority = false, compact = false }) {
  const { addItem, openDrawer } = useCart()
  const reduced = usePrefersReducedMotion()
  const fine = useHasFinePointer()

  const isWeight = product.type === SALE_TYPE.WEIGHT
  const isRequest = product.type === SALE_TYPE.ON_REQUEST
  const options = isWeight ? weightOptions(product) : []

  // 500 g is the size most customers buy, so it is the sensible default.
  const [weightId, setWeightId] = useState(isWeight ? '500g' : null)
  const [added, setAdded] = useState(false)

  const cardRef = useRef(null)
  const mediaRef = useRef(null)
  const addedTimer = useRef(null)

  const price = isWeight
    ? (options.find((o) => o.id === weightId)?.price ?? null)
    : unitPriceFor(product, null)

  /* Cursor-reactive tilt — a couple of degrees, pointer-fine devices only. */
  const handlePointerMove = (event) => {
    if (!fine || reduced || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width - 0.5
    const py = (event.clientY - rect.top) / rect.height - 0.5
    gsap.to(cardRef.current, {
      rotateY: px * 4,
      rotateX: -py * 4,
      duration: 0.6,
      ease: 'power3.out',
      transformPerspective: 900,
    })
    gsap.to(mediaRef.current, { x: px * 12, y: py * 12, duration: 0.8, ease: 'power3.out' })
  }

  const handlePointerLeave = () => {
    if (!fine || reduced) return
    gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'power3.out' })
    gsap.to(mediaRef.current, { x: 0, y: 0, duration: 0.9, ease: 'power3.out' })
  }

  const handleAdd = () => {
    const ok = addItem(product, { optionId: weightId, quantity: 1 })
    if (!ok) return
    setAdded(true)
    clearTimeout(addedTimer.current)
    addedTimer.current = setTimeout(() => setAdded(false), 1800)
    openDrawer()
  }

  return (
    <article
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="group/card relative flex h-full flex-col bg-ivory-50 transition-[box-shadow,translate] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform hover:-translate-y-1 hover:shadow-[var(--shadow-lift-lg)]"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* ---------------------------------------------------------- media -- */}
      <Link
        to={`/menu/${product.slug}`}
        className="relative block overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
        data-cursor="view"
        data-cursor-label="View"
        aria-label={`View details for ${product.name}`}
      >
        <div ref={mediaRef} className="will-change-transform">
          <SmartImage
            src={product.image}
            alt={product.name}
            category={product.category}
            art={product.art}
            seed={product.slug}
            tint={product.tint}
            priority={priority}
            ratio={compact ? 'aspect-[4/3]' : 'aspect-[4/5]'}
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
            imgClassName="transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:scale-[1.06]"
            className="bg-ivory-200"
          />
        </div>

        {/* Reveals on hover, sits above the image. */}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-emerald-950/45 to-transparent opacity-0 transition-opacity duration-500 group-hover/card:opacity-100" />
        <span className="pointer-events-none absolute right-4 bottom-4 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-ivory-50 text-emerald-900 opacity-0 transition-ui duration-500 group-hover/card:translate-y-0 group-hover/card:opacity-100">
          <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" />
        </span>

        {isRequest && (
          <span className="eyebrow absolute top-4 left-4 rounded-full bg-ivory-50/95 px-3 py-1.5 text-[0.55rem] text-emerald-800">
            Ask today&apos;s rate
          </span>
        )}
      </Link>

      {/* ---------------------------------------------------------- body --- */}
      <div className="flex flex-1 flex-col border-x border-b hairline px-5 pt-5 pb-5 sm:px-6 sm:pb-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-[1.4rem] leading-tight font-semibold text-emerald-950 transition-colors duration-400 group-hover/card:text-emerald-700 sm:text-[1.55rem]">
            <Link
              to={`/menu/${product.slug}`}
              className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
            >
              {product.name}
            </Link>
          </h3>
          <span className="mt-1.5 shrink-0 text-right font-sans text-[0.82rem] font-semibold tabular-nums text-emerald-800">
            {price != null ? formatINR(price) : displayPrice(product)}
          </span>
        </div>

        <p className="mt-2 line-clamp-2 font-sans text-[0.83rem] leading-relaxed text-ink-muted">
          {product.description}
        </p>

        {/* Pushed to the bottom so the buttons line up across a row even when
            one product's name wraps to two lines and another's does not. */}
        <div className="mt-auto pt-4">
          {isWeight && (
            <div>
              <WeightSelector
                options={options}
                value={weightId}
                onChange={setWeightId}
                showPrices={false}
                label={`Choose a weight for ${product.name}`}
              />
            </div>
          )}

          {product.type === SALE_TYPE.UNIT && (
            <p className="font-sans text-[0.74rem] tracking-wide text-ink-muted">
              Sold per {product.unitLabel}
              {product.counterOnly ? ' · served at the shop' : ''}
            </p>
          )}

          {/* ------------------------------------------------------ action -- */}
          <div className="mt-4 flex items-center gap-2">
            {isRequest ? (
              <a
                href={enquiryUrl(product.name)}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="button"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-emerald-800/30 px-4 py-2.5 font-sans text-[0.72rem] font-semibold tracking-[0.14em] uppercase text-emerald-800 transition-colors duration-400 hover:border-emerald-800 hover:bg-emerald-800 hover:text-ivory-100"
              >
                <MessageCircle size={15} strokeWidth={1.75} aria-hidden="true" />
                Contact us
              </a>
            ) : (
              <button
                type="button"
                onClick={handleAdd}
                data-cursor="button"
                aria-label={`Add ${product.name}${weightId ? `, ${weightId}` : ''} to cart`}
                className={cx(
                  'inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 font-sans text-[0.72rem] font-semibold tracking-[0.14em] uppercase transition-ui duration-400',
                  added
                    ? 'bg-emerald-600 text-ivory-100'
                    : 'bg-emerald-800 text-ivory-100 hover:bg-emerald-700',
                )}
              >
                {added ? (
                  <>
                    <Check size={15} strokeWidth={2.2} aria-hidden="true" />
                    Added
                  </>
                ) : (
                  <>
                    <Plus size={15} strokeWidth={2} aria-hidden="true" />
                    Add to cart
                  </>
                )}
              </button>
            )}

            <Link
              to={`/menu/${product.slug}`}
              data-cursor="link"
              aria-label={`View details for ${product.name}`}
              className="inline-flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border border-emerald-800/20 text-emerald-800 transition-colors duration-400 hover:border-emerald-800 hover:bg-emerald-800 hover:text-ivory-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
            >
              <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
