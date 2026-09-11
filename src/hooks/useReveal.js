import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from './usePrefersReducedMotion.js'

gsap.registerPlugin(ScrollTrigger)

/**
 * Scroll-triggered entrance for a container's `[data-reveal]` children
 * (or the container itself when it has none).
 *
 * Reduced motion: elements are simply shown, with no transform at all.
 */
export function useReveal({
  y = 28,
  duration = 0.9,
  stagger = 0.08,
  start = 'top 85%',
  delay = 0,
  once = true,
} = {}) {
  const ref = useRef(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const root = ref.current
    if (!root) return undefined

    const targets = root.querySelectorAll('[data-reveal]')
    const elements = targets.length ? Array.from(targets) : [root]

    if (reduced) {
      gsap.set(elements, { autoAlpha: 1, y: 0, clearProps: 'transform' })
      return undefined
    }

    // fromTo (not set + to): GSAP then owns both the hidden and the revealed
    // state, so a context revert restores the element cleanly. A standalone
    // gsap.set can outlive the tween that was meant to undo it — under React's
    // StrictMode double-mount that leaves content stranded off-screen.
    const ctx = gsap.context(() => {
      gsap.fromTo(
        elements,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          duration,
          delay,
          stagger,
          ease: 'power3.out',
          immediateRender: true,
          overwrite: 'auto',
          scrollTrigger: { trigger: root, start, once, toggleActions: 'play none none none' },
        },
      )
    }, root)

    return () => ctx.revert()
  }, [reduced, y, duration, stagger, start, delay, once])

  return ref
}

/**
 * Line-by-line masked text reveal. Expects markup of the shape
 * `<span class="reveal-line"><span>…</span></span>` produced by <RevealText>.
 */
export function useTextReveal({ start = 'top 88%', delay = 0, stagger = 0.09, play = true } = {}) {
  const ref = useRef(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const root = ref.current
    if (!root || !play) return undefined

    const inner = root.querySelectorAll('.reveal-line > span')
    if (!inner.length) return undefined

    if (reduced) {
      gsap.set(inner, { yPercent: 0, autoAlpha: 1 })
      return undefined
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        inner,
        { yPercent: 112 },
        {
          yPercent: 0,
          duration: 1.15,
          delay,
          stagger,
          ease: 'expo.out',
          immediateRender: true,
          overwrite: 'auto',
          scrollTrigger: { trigger: root, start, once: true },
        },
      )
    }, root)

    return () => ctx.revert()
  }, [reduced, start, delay, stagger, play])

  return ref
}

/**
 * Gentle vertical parallax. `speed` is the fraction of the scroll distance the
 * element lags behind by; keep it small — this should be felt, not seen.
 */
export function useParallax(speed = 0.12) {
  const ref = useRef(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return undefined

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: -speed * 100 },
        {
          yPercent: speed * 100,
          ease: 'none',
          scrollTrigger: {
            trigger: el.parentElement ?? el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      )
    })

    return () => ctx.revert()
  }, [reduced, speed])

  return ref
}
