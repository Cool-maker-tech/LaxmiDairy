import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useHasFinePointer } from '../hooks/useMediaQuery.js'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.js'

/**
 * Minimal two-part cursor: a solid dot that tracks precisely, and a ring that
 * trails behind it. Mounted only on pointer-fine desktops, and never when the
 * visitor prefers reduced motion — on every touch device this renders nothing
 * and the OS cursor behaviour is untouched.
 *
 * Elements opt in via `data-cursor="button" | "link" | "view" | "hide"` and an
 * optional `data-cursor-label`.
 */
export default function CustomCursor() {
  const fine = useHasFinePointer()
  const reduced = usePrefersReducedMotion()
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const labelRef = useRef(null)

  useEffect(() => {
    if (!fine || reduced) return undefined

    const dot = dotRef.current
    const ring = ringRef.current
    const label = labelRef.current
    if (!dot || !ring) return undefined

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, autoAlpha: 0 })

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3.out' })
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3.out' })
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.55, ease: 'power3.out' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.55, ease: 'power3.out' })

    let visible = false

    const onMove = (event) => {
      if (!visible) {
        visible = true
        gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3 })
      }
      dotX(event.clientX)
      dotY(event.clientY)
      ringX(event.clientX)
      ringY(event.clientY)
    }

    const onLeaveWindow = () => {
      visible = false
      gsap.to([dot, ring], { autoAlpha: 0, duration: 0.2 })
    }

    const setState = (state, text) => {
      const presets = {
        default: { ring: 40, border: 1, bg: 'transparent', dot: 1 },
        button: { ring: 64, border: 1, bg: 'rgba(11,59,46,0.08)', dot: 0 },
        link: { ring: 52, border: 1, bg: 'rgba(11,59,46,0.06)', dot: 0.4 },
        view: { ring: 92, border: 0, bg: 'rgba(11,59,46,0.92)', dot: 0 },
        hide: { ring: 0, border: 0, bg: 'transparent', dot: 0 },
      }
      const p = presets[state] ?? presets.default

      gsap.to(ring, {
        width: p.ring,
        height: p.ring,
        borderWidth: p.border,
        backgroundColor: p.bg,
        duration: 0.42,
        ease: 'expo.out',
      })
      gsap.to(dot, { scale: p.dot, duration: 0.3, ease: 'power3.out' })

      if (label) {
        label.textContent = text ?? ''
        gsap.to(label, { autoAlpha: text ? 1 : 0, duration: 0.25 })
      }
    }

    const onOver = (event) => {
      const target = event.target.closest?.('[data-cursor], a, button')
      if (!target) return setState('default')
      const explicit = target.getAttribute?.('data-cursor')
      const state = explicit ?? (target.tagName === 'BUTTON' ? 'button' : 'link')
      setState(state, target.getAttribute?.('data-cursor-label'))
    }

    const onDown = () => gsap.to(ring, { scale: 0.82, duration: 0.18, ease: 'power2.out' })
    const onUp = () => gsap.to(ring, { scale: 1, duration: 0.3, ease: 'power2.out' })

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeaveWindow)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.documentElement.removeEventListener('pointerleave', onLeaveWindow)
      gsap.killTweensOf([dot, ring, label])
    }
  }, [fine, reduced])

  if (!fine || reduced) return null

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90]">
      <div
        ref={ringRef}
        className="fixed top-0 left-0 flex items-center justify-center rounded-full border border-emerald-800/45 will-change-transform"
        style={{ width: 40, height: 40 }}
      >
        <span
          ref={labelRef}
          className="eyebrow text-[0.5rem] whitespace-nowrap text-ivory-100 opacity-0"
        />
      </div>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 h-1.5 w-1.5 rounded-full bg-emerald-800 will-change-transform"
      />
    </div>
  )
}
