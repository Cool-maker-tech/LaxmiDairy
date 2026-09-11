import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from './usePrefersReducedMotion.js'

gsap.registerPlugin(ScrollTrigger)

/** Shared Lenis instance, so any component can pause/scroll it. */
let lenisInstance = null
export const getLenis = () => lenisInstance

/** Lock or release page scrolling (used by the drawer and mobile menu). */
export function setScrollLocked(locked) {
  if (lenisInstance) {
    if (locked) lenisInstance.stop()
    else lenisInstance.start()
  }
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('lenis-stopped', locked)
    // Fallback for reduced-motion visitors, where Lenis is not running.
    document.body.style.overflow = locked ? 'hidden' : ''
  }
}

/**
 * Boots Lenis and drives it from GSAP's ticker so ScrollTrigger stays in sync.
 * Disabled entirely when the visitor prefers reduced motion — native scrolling
 * is then used, which is exactly what they asked for.
 */
export function useSmoothScroll() {
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) {
      ScrollTrigger.refresh()
      return undefined
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      // Native momentum on touch devices feels better than a JS emulation.
      syncTouch: false,
      touchMultiplier: 1.4,
    })
    lenisInstance = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    ScrollTrigger.refresh()

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      lenisInstance = null
    }
  }, [reduced])
}
