import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useHasFinePointer } from './useMediaQuery.js'
import { usePrefersReducedMotion } from './usePrefersReducedMotion.js'

/**
 * Magnetic hover: the element leans a few pixels toward the cursor.
 * Pointer-fine devices only, and never when reduced motion is requested.
 *
 * @param {number} strength  how far the element may travel, in px
 */
export function useMagnetic(strength = 14) {
  const ref = useRef(null)
  const fine = useHasFinePointer()
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || !fine || reduced) return undefined

    const quickX = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' })
    const quickY = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' })

    const onMove = (event) => {
      const rect = el.getBoundingClientRect()
      const relX = event.clientX - (rect.left + rect.width / 2)
      const relY = event.clientY - (rect.top + rect.height / 2)
      // Normalise by half-size so the pull is consistent across button sizes.
      quickX((relX / (rect.width / 2)) * strength)
      quickY((relY / (rect.height / 2)) * strength * 0.6)
    }

    const onLeave = () => {
      quickX(0)
      quickY(0)
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      gsap.killTweensOf(el)
    }
  }, [fine, reduced, strength])

  return ref
}
