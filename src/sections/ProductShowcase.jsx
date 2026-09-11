import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import SmartImage from '../components/SmartImage.jsx'
import { Eyebrow } from '../components/Reveal.jsx'
import { FEATURED_PRODUCTS, displayPrice } from '../data/products.js'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.js'
import { useMediaQuery } from '../hooks/useMediaQuery.js'

gsap.registerPlugin(ScrollTrigger)

/**
 * The five products the shop photographs, shown as a horizontal rail.
 *
 * Desktop: the section pins and the rail translates with scroll.
 * Touch / narrow / reduced-motion: a plain swipeable rail with scroll-snap —
 * no pinning, no hijacking, and the same content.
 */
export default function ProductShowcase() {
  const reduced = usePrefersReducedMotion()
  const canPin = useMediaQuery('(min-width: 1024px)')
  const usePinned = canPin && !reduced

  const sectionRef = useRef(null)
  const trackRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track || !usePinned) return undefined

    const ctx = gsap.context(() => {
      const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth + 96)

      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getDistance() + window.innerHeight * 0.4}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      // Cards drift slightly against the rail so the row does not feel rigid.
      gsap.utils.toArray('[data-showcase-media]').forEach((media, i) => {
        gsap.fromTo(
          media,
          { xPercent: -4 },
          {
            xPercent: 4,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: () => `+=${getDistance()}`,
              scrub: 1 + i * 0.06,
            },
          },
        )
      })

      return () => tween.kill()
    }, section)

    return () => ctx.revert()
  }, [usePinned])

  const heading = (
    <div className="container-x">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Eyebrow tone="light">Every single day</Eyebrow>
          <h2 className="fluid-h2 mt-4 max-w-xl font-display font-medium text-ivory-100">
            Everything here{' '}
            <em className="text-gold-300 not-italic">starts with milk.</em>
          </h2>
        </div>
        <Link
          to="/menu?category=dairy"
          data-cursor="link"
          className="group inline-flex shrink-0 items-center gap-3 font-sans text-[0.76rem] font-semibold tracking-[0.14em] text-ivory-100 uppercase"
        >
          <span className="border-b border-ivory-100/30 pb-1 transition-colors group-hover:border-ivory-100">
            All milk &amp; dairy
          </span>
          <ArrowRight
            size={16}
            strokeWidth={1.75}
            className="transition-transform duration-400 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </div>
    </div>
  )

  const cards = FEATURED_PRODUCTS.map((product, index) => (
    <li
      key={product.id}
      className="group/item w-[78vw] shrink-0 snap-center sm:w-[56vw] md:w-[42vw] lg:w-[30vw] xl:w-[26vw]"
    >
      <Link
        to={`/menu/${product.slug}`}
        data-cursor="view"
        data-cursor-label="View"
        className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-500"
      >
        <div className="relative overflow-hidden">
          <div data-showcase-media className="will-change-transform">
            <SmartImage
              src={product.image}
              alt={product.featuredName ?? product.name}
              label={product.featuredName ?? product.name}
              category={product.category}
              ratio="aspect-[3/4]"
              sizes="(max-width: 768px) 78vw, 30vw"
              imgClassName="transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/item:scale-[1.05]"
            />
          </div>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-emerald-950/55 via-transparent to-transparent"
          />
          <span className="absolute top-4 left-4 font-sans text-[0.62rem] tracking-[0.22em] text-ivory-100/60 tabular-nums">
            0{index + 1}
          </span>
        </div>

        <div className="flex items-start justify-between gap-4 border-b border-ivory-100/12 py-5">
          <div>
            <h3 className="font-display text-[1.7rem] leading-none font-medium text-ivory-100 sm:text-[2rem]">
              {product.featuredName ?? product.name}
            </h3>
            <p className="mt-2 max-w-[22rem] font-sans text-[0.8rem] leading-relaxed text-ivory-200/50">
              {product.description}
            </p>
          </div>
          <span className="mt-1 shrink-0 text-right font-sans text-[0.72rem] tracking-wide text-gold-300">
            {displayPrice(product)}
          </span>
        </div>
      </Link>
    </li>
  ))

  return (
    /*
     * The wrapper is load-bearing, not decorative.
     *
     * ScrollTrigger's `pin` moves the pinned element inside a `pin-spacer` div
     * that it creates. React still believes the section is a direct child of
     * whatever contained it, and when this page unmounts it removes host nodes
     * BEFORE running the cleanup that would un-pin them — so it calls
     * removeChild on the wrong parent and the whole app dies with
     * "the node to be removed is not a child of this node".
     *
     * Pinning a child of a wrapper React owns fixes it: the pin-spacer is
     * created inside this div, and the div's own parent never changes, so
     * React removes exactly what it expects to.
     */
    <div>
      <section
        ref={sectionRef}
        aria-label="Our everyday dairy"
        className="relative overflow-hidden bg-emerald-900 py-20 text-ivory-100 sm:py-24 lg:flex lg:min-h-screen lg:flex-col lg:justify-center lg:py-0"
      >
        <div className="lg:pt-24">{heading}</div>

        {usePinned ? (
          <div className="mt-12 overflow-hidden lg:mt-14 lg:pb-24">
            <ul
              ref={trackRef}
              className="flex gap-5 pl-5 will-change-transform sm:gap-7 sm:pl-8 lg:gap-10 lg:pl-14 2xl:pl-20"
            >
              {cards}
              <li aria-hidden="true" className="w-10 shrink-0" />
            </ul>
          </div>
        ) : (
          <ul className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 sm:gap-7 sm:px-8">
            {cards}
          </ul>
        )}

        {!usePinned && (
          <p className="container-x mt-5 font-sans text-[0.68rem] tracking-[0.18em] text-ivory-200/35 uppercase">
            Swipe to explore
            <ArrowUpRight size={13} strokeWidth={1.5} className="ml-1.5 inline" aria-hidden="true" />
          </p>
        )}
      </section>
    </div>
  )
}
