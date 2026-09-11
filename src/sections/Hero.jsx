import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ArrowDown, ArrowRight } from 'lucide-react'
import Button from '../components/Button.jsx'
import Logo from '../components/Logo.jsx'
import { BUSINESS, ADDRESS } from '../config/site.js'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.js'
import { useMediaQuery } from '../hooks/useMediaQuery.js'

/** The WebGL form is optional chrome — it never blocks the hero's text. */
const CreamForm = lazy(() => import('../components/CreamForm.jsx'))

const HEADLINE = ['Pure.', 'Fresh.', 'Every day.']

export default function Hero() {
  const reduced = usePrefersReducedMotion()
  // Phones and low-width tablets skip WebGL entirely.
  const allow3D = useMediaQuery('(min-width: 768px)')
  const [show3D, setShow3D] = useState(false)
  // Set if WebGL is missing, the shader fails, or the context is lost.
  const [formUnavailable, setFormUnavailable] = useState(false)

  const rootRef = useRef(null)
  const formRef = useRef(null)

  const handleFormUnavailable = useCallback(() => setFormUnavailable(true), [])

  /* Defer WebGL until the browser is idle, so it cannot delay first paint. */
  useEffect(() => {
    if (!allow3D) return undefined
    const schedule = window.requestIdleCallback ?? ((cb) => setTimeout(cb, 600))
    const cancel = window.cancelIdleCallback ?? clearTimeout
    const id = schedule(() => setShow3D(true), { timeout: 2200 })
    return () => cancel(id)
  }, [allow3D])

  /* Entrance timeline. */
  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    const lines = root.querySelectorAll('[data-hero-line] > span')
    const fades = root.querySelectorAll('[data-hero-fade]')
    const rule = root.querySelector('[data-hero-rule]')

    if (reduced) {
      gsap.set([...lines, ...fades], { autoAlpha: 1, yPercent: 0, y: 0 })
      if (rule) gsap.set(rule, { scaleX: 1 })
      return undefined
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.15 })

      tl.set(lines, { yPercent: 115 })
        .set(fades, { autoAlpha: 0, y: 22 })
        .set(rule, { scaleX: 0, transformOrigin: 'left center' })
        .to(lines, { yPercent: 0, duration: 1.3, stagger: 0.11 })
        .to(rule, { scaleX: 1, duration: 1.1, ease: 'power3.inOut' }, '-=0.85')
        .to(fades, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08 }, '-=0.9')

      if (formRef.current) {
        tl.fromTo(
          formRef.current,
          { autoAlpha: 0, scale: 0.86 },
          { autoAlpha: 1, scale: 1, duration: 1.6, ease: 'expo.out' },
          '-=1.5',
        )
      }
    }, root)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-emerald-950 text-ivory-100"
      aria-labelledby="hero-heading"
    >
      {/* ------------------------------------------------------ backdrop -- */}
      <div aria-hidden="true" className="absolute inset-0">
        {/* Warm pool of light behind the form. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(85% 65% at 72% 28%, rgba(231,211,161,0.22) 0%, rgba(11,59,46,0) 62%), radial-gradient(120% 100% at 10% 100%, rgba(4,34,26,0.85) 0%, rgba(7,45,34,0) 60%)',
          }}
        />
        {/* Faint vertical rules — a structural grid, not decoration. */}
        <div className="absolute inset-0 hidden lg:block">
          {[25, 50, 75].map((left) => (
            <span
              key={left}
              className="absolute top-0 bottom-0 w-px bg-ivory-100/[0.055]"
              style={{ left: `${left}%` }}
            />
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------ 3D form ---- */}
      <div
        ref={formRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-[6%] right-[-14%] h-[62vh] w-[86vw] opacity-0 sm:top-[4%] sm:right-[-8%] sm:h-[68vh] sm:w-[62vw] lg:top-0 lg:right-[2%] lg:h-[86vh] lg:w-[46vw]"
      >
        {show3D && !reduced && !formUnavailable ? (
          <Suspense fallback={null}>
            <CreamForm
              reducedMotion={reduced}
              onUnavailable={handleFormUnavailable}
              className="h-full w-full"
            />
          </Suspense>
        ) : (
          // Static stand-in: same silhouette, zero JavaScript. Held back to
          // 70% opacity so the headline keeps its contrast where they overlap.
          <div className="flex h-full w-full items-center justify-center opacity-70">
            <div
              className="h-[70%] w-[70%] rounded-full blur-[2px]"
              style={{
                background:
                  'radial-gradient(38% 38% at 34% 28%, #fdf6e6 0%, #ead7ad 45%, #c9ac78 78%, rgba(201,172,120,0) 100%)',
              }}
            />
          </div>
        )}
      </div>

      {/* ------------------------------------------------------- content -- */}
      <div className="relative container-x pt-32 pb-10 sm:pt-36 sm:pb-12 lg:pb-16">
        <div className="max-w-[62rem]">
          <div data-hero-fade className="flex items-center gap-3 text-gold-300 opacity-0">
            <span className="h-px w-10 bg-gold-300/50" aria-hidden="true" />
            <span className="eyebrow text-[0.6rem] sm:text-[0.6875rem]">
              {ADDRESS.city} · {ADDRESS.state}
            </span>
          </div>

          <h1
            id="hero-heading"
            className="fluid-display mt-5 font-display font-medium tracking-[-0.025em] sm:mt-6"
          >
            {HEADLINE.map((line, i) => (
              <span key={line} data-hero-line className="block overflow-hidden">
                <span className={`block will-change-transform ${i === 2 ? 'text-gold-300 italic' : ''}`}>
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <span
            data-hero-rule
            aria-hidden="true"
            className="mt-7 block h-px w-full max-w-md bg-gradient-to-r from-gold-400/70 to-transparent sm:mt-9"
          />

          <p
            data-hero-fade
            className="mt-6 max-w-lg font-sans text-[0.95rem] leading-relaxed text-ivory-200/70 opacity-0 sm:mt-7 sm:text-base"
          >
            {BUSINESS.shortDescription}
          </p>

          <div data-hero-fade className="mt-8 flex flex-wrap items-center gap-3 opacity-0 sm:mt-10 sm:gap-4">
            <Button to="/menu" variant="gold" size="lg" icon={ArrowRight} cursorLabel="Shop">
              Shop now
            </Button>
            <Button to="/menu" variant="outlineLight" size="lg">
              Explore menu
            </Button>
          </div>
        </div>

        {/* ---------------------------------------------------- baseline -- */}
        <div
          data-hero-fade
          className="mt-12 flex items-end justify-between gap-6 border-t border-ivory-100/10 pt-6 opacity-0 sm:mt-14"
        >
          <div className="flex items-center gap-5 sm:gap-8">
            <span className="hidden text-ivory-100/70 sm:block">
              <Logo variant="mark" className="h-12 w-12" />
            </span>
            <p className="max-w-[22rem] font-sans text-[0.72rem] leading-relaxed tracking-wide text-ivory-200/45 sm:text-[0.78rem]">
              Shrikhand · Peda · Matho · Rabdi · Mithai · Milk, curd, paneer, ghee and buttermilk,
              fresh at the counter.
            </p>
          </div>

          <span className="hidden shrink-0 items-center gap-2.5 font-sans text-[0.65rem] tracking-[0.18em] text-ivory-200/40 uppercase sm:flex">
            Scroll
            <ArrowDown size={14} strokeWidth={1.5} className="animate-bounce" aria-hidden="true" />
          </span>
        </div>
      </div>
    </section>
  )
}
