import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Eyebrow, Reveal, RevealText } from '../components/Reveal.jsx'
import { CATEGORIES, getProductsByCategory } from '../data/products.js'

/**
 * "Freshness You Can Taste" — the category index. A numbered editorial list
 * rather than a grid of cards, so it reads as a counter, not a catalogue.
 */
export default function Freshness() {
  const categories = CATEGORIES.filter((c) => c.id !== 'counter')

  return (
    <section className="relative bg-ivory-100 py-20 sm:py-28 lg:py-36" aria-labelledby="freshness-heading">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          {/* ------------------------------------------------------ intro -- */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start">
            <Reveal y={16}>
              <span data-reveal className="block">
                <Eyebrow>What we make</Eyebrow>
              </span>
            </Reveal>

            <RevealText
              as="h2"
              id="freshness-heading"
              className="fluid-h2 mt-5 font-display font-medium text-emerald-950"
              stagger={0.1}
            >
              <span>Freshness</span>
              <span>
                you can <em className="text-gold-600 not-italic">taste</em>
              </span>
            </RevealText>

            <Reveal y={20} delay={0.15}>
              <p
                data-reveal
                className="mt-6 max-w-md font-sans text-[0.95rem] leading-relaxed text-ink-soft"
              >
                Everything on our counter starts with the same milk. What changes is how long it is
                cooked, how it is set and what goes in at the end — which is how one ingredient
                becomes six very different trays.
              </p>

              <Link
                data-reveal
                to="/menu"
                data-cursor="link"
                className="group mt-8 inline-flex items-center gap-3 font-sans text-[0.78rem] font-semibold tracking-[0.14em] text-emerald-800 uppercase"
              >
                <span className="border-b border-emerald-800/30 pb-1 transition-colors group-hover:border-emerald-800">
                  See the full menu
                </span>
                <ArrowUpRight
                  size={16}
                  strokeWidth={1.75}
                  className="transition-transform duration-400 group-hover:translate-x-1 group-hover:-translate-y-1"
                  aria-hidden="true"
                />
              </Link>
            </Reveal>
          </div>

          {/* -------------------------------------------------- the list --- */}
          <Reveal className="lg:col-span-7" y={26} stagger={0.07} start="top 88%">
            <ul className="border-t hairline">
              {categories.map((category, index) => {
                const count = getProductsByCategory(category.id).length
                return (
                  <li key={category.id} data-reveal className="border-b hairline">
                    <Link
                      to={`/menu?category=${category.id}`}
                      data-cursor="view"
                      data-cursor-label="Open"
                      className="group relative flex items-baseline gap-4 py-6 transition-colors duration-500 sm:gap-7 sm:py-8"
                    >
                      {/* Emerald wash sweeping in from the left on hover. */}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-y-0 -left-4 -right-4 origin-left scale-x-0 bg-emerald-800/[0.045] transition-transform duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 sm:-left-6 sm:-right-6"
                      />

                      <span className="relative shrink-0 font-sans text-[0.65rem] tracking-[0.2em] text-gold-600 tabular-nums">
                        0{index + 1}
                      </span>

                      <span className="relative min-w-0 flex-1">
                        <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <span className="font-display text-[1.85rem] leading-none font-medium text-emerald-950 transition-transform duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 sm:text-[2.4rem] lg:text-[2.7rem]">
                            {category.name}
                          </span>
                          <span className="font-sans text-[0.68rem] tracking-[0.16em] text-ink-muted uppercase">
                            {count} {count === 1 ? 'item' : 'items'}
                          </span>
                        </span>
                        <span className="mt-2 block max-w-sm font-sans text-[0.82rem] leading-relaxed text-ink-muted transition-transform duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2">
                          {category.tagline}
                        </span>
                      </span>

                      <span
                        aria-hidden="true"
                        className="relative mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-800/15 text-emerald-800 transition-ui duration-500 group-hover:border-emerald-800 group-hover:bg-emerald-800 group-hover:text-ivory-100 sm:h-11 sm:w-11"
                      >
                        <ArrowUpRight size={16} strokeWidth={1.75} />
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
