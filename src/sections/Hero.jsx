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
        className="pointer-events-none absolute top-[3%] right-[-24%] h-[44vh] w-[74vw] opacity-0 sm:top-[4%] sm:right-[-8%] sm:h-[64vh] sm:w-[60vw] lg:top-0 lg:right-[2%] lg:h-[86vh] lg:w-[46vw]"
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
          /*
           * Static stand-in for phones, reduced motion, and anywhere WebGL is
           * unavailable. Drawn rather than blurred: a soft-focus circle reads
           * as a mistake at phone size, where this is the only thing in the
           * hero besides the words.
           */
          <svg
            viewBox="0 0 400 400"
            className="h-full w-full"
            aria-hidden="true"
            focusable="false"
          >
            <defs>
              <radialGradient id="cream-body" cx="38%" cy="30%" r="72%">
                <stop offset="0%" stopColor="#FFFBF0" />
                <stop offset="46%" stopColor="#F4E3BC" />
                <stop offset="100%" stopColor="#C9A96F" />
              </radialGradient>
              <radialGradient id="cream-glow" cx="50%" cy="48%" r="50%">
                <stop offset="60%" stopColor="#E7D3A1" stopOpacity="0" />
                <stop offset="100%" stopColor="#E7D3A1" stopOpacity="0.22" />
              </radialGradient>
            </defs>

            {/* halo */}
            <circle cx="200" cy="200" r="168" fill="url(#cream-glow)" />

            {/* the form: one soft lobed silhouette, the same family of shape
                the shader draws */}
            <path
              d="M200 44
                 C 258 44, 306 78, 330 128
                 C 352 174, 350 226, 322 268
                 C 294 310, 248 340, 198 338
                 C 146 336, 100 306, 74 262
                 C 48 218, 50 164, 78 120
                 C 106 76, 148 44, 200 44 Z"
              fill="url(#cream-body)"
            />

            {/* Folds, deliberately asymmetric and running off the edge of the
                form. A centred arc below a round highlight reads as a smiling
                face, which is not the brand. */}
            <path
              d="M64 180 C 118 214, 196 226, 262 204 C 302 190, 330 162, 344 128"
              fill="none"
              stroke="#FFFBF0"
              strokeOpacity="0.42"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path
              d="M92 254 C 150 284, 236 288, 306 254"
              fill="none"
              stroke="#C9A96F"
              strokeOpacity="0.28"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <path
              d="M150 312 C 196 330, 250 326, 292 302"
              fill="none"
              stroke="#C9A96F"
              strokeOpacity="0.2"
              strokeWidth="7"
              strokeLinecap="round"
            />

            {/* highlight: a long streak up the shoulder, not a round spot */}
            <ellipse
              cx="132"
              cy="128"
              rx="52"
              ry="20"
              fill="#FFFDF8"
              opacity="0.5"
              transform="rotate(-46 132 128)"
            />
          </svg>
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
