import { useEffect, useRef } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getLenis } from '../hooks/useSmoothScroll.js'

/**
 * Resets scroll when the *displayed* route changes — i.e. while the transition
 * panel is covering the screen, not the instant a link is clicked — then
 * re-measures every ScrollTrigger for the new page.
 *
 * Anchor links (`/menu#shrikhand`) are left alone.
 */
export default function ScrollToTop({ location }) {
  const lastPath = useRef(null)

  useEffect(() => {
    if (location.hash) return undefined
    if (lastPath.current === location.pathname) return undefined
    lastPath.current = location.pathname

    const lenis = getLenis()
    if (lenis) lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)

    // Let the new route paint before ScrollTrigger measures it.
    const id = requestAnimationFrame(() => requestAnimationFrame(() => ScrollTrigger.refresh()))
    return () => cancelAnimationFrame(id)
  }, [location.pathname, location.hash])

  return null
}
