import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import SmartImage from '../components/SmartImage.jsx'
import { Eyebrow, Reveal, RevealText } from '../components/Reveal.jsx'
import { useParallax } from '../hooks/useReveal.js'
import { BUSINESS } from '../config/site.js'

/**
 * Our Story — truthful copy only. No invented heritage, certifications or
 * percentages; everything here describes how the shop actually works.
 */
export default function Story() {
  const parallaxRef = useParallax(0.07)

  return (
    <section className="relative bg-ivory-200 py-20 sm:py-28 lg:py-36" aria-labelledby="story-heading">
      <div className="container-x">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* ------------------------------------------------------ image -- */}
          <Reveal className="lg:col-span-5" y={32}>
            <div data-reveal className="relative">
              <div className="overflow-hidden">
                <div ref={parallaxRef} className="will-change-transform">
                  <SmartImage
                    src="/products/shop.jpeg"
                    alt="The Laxmi Dairy counter in Surat"
                    label="Laxmi Dairy"
                    category="dairy"
                    ratio="aspect-[4/5]"
                    sizes="(max-width: 1024px) 92vw, 40vw"
                    className="scale-[1.12]"
                  />
                </div>
              </div>

              {/* Quiet caption plate, overlapping the image corner. */}
              <div className="absolute -right-3 -bottom-5 max-w-[13rem] bg-emerald-950 px-5 py-4 text-ivory-100 sm:-right-6 sm:-bottom-7 sm:max-w-[15rem] sm:px-6 sm:py-5">
                <p className="font-display text-xl leading-tight sm:text-2xl">
                  Made this morning,
                  <br />
                  sold today.
                </p>
                <p className="mt-2 font-sans text-[0.68rem] tracking-[0.14em] text-gold-300/80 uppercase">
                  {BUSINESS.proprietor} · Surat
                </p>
              </div>
            </div>
          </Reveal>

          {/* -------------------------------------------------------- copy -- */}
          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal y={16}>
              <span data-reveal className="block">
                <Eyebrow>Our story</Eyebrow>
              </span>
            </Reveal>

            <RevealText
              as="h2"
              id="story-heading"
              className="fluid-h2 mt-5 font-display font-medium text-emerald-950"
              stagger={0.1}
            >
              <span>Rooted in</span>
              <span>
                everyday <em className="text-gold-600 not-italic">freshness.</em>
              </span>
            </RevealText>

            <Reveal y={22} delay={0.1} stagger={0.09}>
              <p
                data-reveal
                className="mt-7 max-w-xl font-sans text-[0.98rem] leading-[1.75] text-ink-soft"
              >
                From wholesome dairy essentials to handcrafted Indian sweets, Laxmi Dairy brings
                familiar flavours to the table. Milk, curd, paneer, ghee and buttermilk for the
                everyday — and the shrikhand, peda, matho and mithai that turn an ordinary evening
                into an occasion.
              </p>

              <p
                data-reveal
                className="mt-5 max-w-xl font-sans text-[0.98rem] leading-[1.75] text-ink-soft"
              >
                We work in small batches because that is what the counter needs. Trays are made
                through the day rather than stocked ahead, so what you take home is what we made
                that morning. Nothing about that is complicated — it is simply how a neighbourhood
                dairy is supposed to run.
              </p>

              {/* Three honest facts, not marketing claims. */}
              <dl data-reveal className="mt-9 grid grid-cols-1 gap-px border hairline bg-emerald-800/10 sm:grid-cols-3">
                {[
                  { term: 'Made in', detail: 'Small batches, through the day' },
                  { term: 'Sold at', detail: 'Our own counter in Bhesan Gam' },
                  { term: 'Ordered by', detail: 'WhatsApp, phone or in person' },
                ].map((fact) => (
                  <div key={fact.term} className="bg-ivory-200 px-5 py-5">
                    <dt className="eyebrow text-[0.6rem] text-gold-700">{fact.term}</dt>
                    <dd className="mt-2 font-display text-[1.15rem] leading-snug text-emerald-950">
                      {fact.detail}
                    </dd>
                  </div>
                ))}
              </dl>

              <Link
                data-reveal
                to="/our-story"
                data-cursor="link"
                className="group mt-9 inline-flex items-center gap-3 font-sans text-[0.78rem] font-semibold tracking-[0.14em] text-emerald-800 uppercase"
              >
                <span className="border-b border-emerald-800/30 pb-1 transition-colors group-hover:border-emerald-800">
                  Read our story
                </span>
                <ArrowRight
                  size={16}
                  strokeWidth={1.75}
                  className="transition-transform duration-400 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
