import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.js'

/**
 * A gold hairline across the very top of the page showing how far down the
 * document you are.
 *
 * Deliberately 2px and low-contrast: it should register as a detail you notice
 * on the second visit, not a loading bar. Driven by a transform on a
 * pre-scaled element so it never triggers layout, and read from a rAF rather
 * than on every scroll event.
 */
export default function ScrollProgress() {
  const barRef = useRef(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const bar = barRef.current
    if (!bar || reduced) return undefined

    let frame = 0
    let queued = false

    const update = () => {
      queued = false
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      bar.style.transform = `scaleX(${progress})`
      bar.style.opacity = progress > 0.004 ? '1' : '0'
    }

    const onScroll = () => {
      if (queued) return
      queued = true
      frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [reduced])

  if (reduced) return null

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[88] h-[2px]">
      <div
        ref={barRef}
        className="h-full origin-left bg-gradient-to-r from-gold-600 to-gold-400 opacity-0 transition-opacity duration-500"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  )
}
