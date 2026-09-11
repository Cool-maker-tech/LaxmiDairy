import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.js'

/**
 * Route transition: an emerald panel wipes up over the outgoing page, the
 * route is swapped while the screen is covered, then the panel wipes away.
 *
 * `children` is a function receiving the location that should currently be
 * rendered. It has to work this way: <Routes> reads the live location from
 * context, so holding a stale element would not hold a stale page — the
 * displayed location must be handed down explicitly.
 *
 *   <PageTransition>
 *     {(location) => <Routes location={location}>…</Routes>}
 *   </PageTransition>
 *
 * Two things to know about that:
 *
 *  1. Passing `location` to <Routes> also overrides `useLocation()` for
 *     everything inside it. So a change that keeps the same pathname — a
 *     `?category=` filter, a hash — must be handed through IMMEDIATELY and
 *     without a wipe, or the page would go on reading stale search params.
 *
 *  2. The effect deliberately depends on `location` alone. `displayLocation`
 *     changes at the timeline's midpoint; if the effect depended on it, that
 *     swap would tear down its own timeline and strand the panel on screen.
 *
 * With reduced motion the panel never renders and routes swap instantly.
 */
export default function PageTransition({ children }) {
  const location = useLocation()

  const reduced = usePrefersReducedMotion()

  const [displayLocation, setDisplayLocation] = useState(location)
  const displayRef = useRef(location)
  const panelRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    if (location === displayRef.current) return undefined

    const show = (next) => {
      displayRef.current = next
      setDisplayLocation(next)
    }

    // Same page, different query/hash — swap straight through.
    if (location.pathname === displayRef.current.pathname) {
      show(location)
      return undefined
    }

    const panel = panelRef.current
    if (reduced || !panel) {
      show(location)
      return undefined
    }

    const tl = gsap.timeline()

    tl.set(panel, { display: 'block', transformOrigin: 'bottom center', scaleY: 0 })
      .to(panel, { scaleY: 1, duration: 0.5, ease: 'power4.inOut' })
      .add(() => show(location))
      .set(panel, { transformOrigin: 'top center' })
      .to(panel, { scaleY: 0, duration: 0.6, ease: 'power4.inOut' }, '+=0.08')
      .set(panel, { display: 'none' })

    if (contentRef.current) {
      tl.fromTo(
        contentRef.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.5, ease: 'power2.out' },
        '<0.05',
      )
    }

    return () => tl.kill()
  }, [location, reduced])

  return (
    <>
      <div
        ref={panelRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[85] hidden bg-emerald-950"
      />
      <div ref={contentRef}>{children(displayLocation)}</div>
    </>
  )
}
