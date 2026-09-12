import { ArrowRight } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import SmartImage from '../components/SmartImage.jsx'
import Marquee from '../components/Marquee.jsx'
import Button from '../components/Button.jsx'
import VisitUs from '../sections/VisitUs.jsx'
import { Eyebrow, Reveal } from '../components/Reveal.jsx'
import { useParallax } from '../hooks/useReveal.js'
import { usePageMeta } from '../hooks/usePageMeta.js'
import { BUSINESS, ADDRESS } from '../config/site.js'
import { CATEGORIES } from '../data/products.js'

/**
 * Our Story.
 *
 * Every claim on this page is one the shop can stand behind: what it sells,
 * how it is made, where it is. No invented heritage, certifications or
 * statistics.
 */
const CHAPTERS = [
  {
    number: '01',
    title: 'It starts with the milk',
    body: 'Buffalo milk is the base for almost everything on our counter — thick enough to set curd properly, and rich enough that the malai is worth arguing over. Cow milk is here too, for the households that prefer it lighter.',
  },
  {
    number: '02',
    title: 'Then it is worked by hand',
    body: 'Shrikhand is strained and set. Peda is cooked down until the mava crumbs and then rolled, one at a time. Rabdi is simmered until the cream gathers on the surface. None of it is quick, which is why we make it in batches through the day instead of all at once.',
  },
  {
    number: '03',
    title: 'And it is sold the same day',
    body: 'Fresh dairy has a short window and we work inside it. Trays go out as they are finished rather than sitting in stock, so what you take home is what we made that morning — and if we have run out of something, we will tell you rather than sell you yesterday.',
  },
]

export default function OurStory() {
  usePageMeta({
    title: 'Our Story | Laxmi Dairy, Surat',
    description:
      'How Laxmi Dairy works: buffalo milk, small batches worked by hand, and dairy and sweets sold fresh the same day from our counter in Bhesan Gam, Surat.',
    path: '/our-story',
  })

  const parallaxRef = useParallax(0.08)

  return (
    <>
      <PageHeader
        eyebrow="Our story"
        titleLines={['Rooted in', 'everyday freshness.']}
        intro={BUSINESS.shortDescription}
      />

      {/* ------------------------------------------------------- lead image */}
      <div className="bg-ivory-100">
        <div className="container-x">
          <Reveal y={28}>
            <div data-reveal className="overflow-hidden">
              <div ref={parallaxRef} className="will-change-transform">
                <SmartImage
                  src="/products/shop-wide.jpeg"
                  alt="Laxmi Dairy's counter in Bhesan Gam, Surat"
                  category="dairy"
                  art="shop"
                  ratio="aspect-[16/10] sm:aspect-[21/9]"
                  priority
                  sizes="100vw"
                  className="scale-[1.1]"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ------------------------------------------------------- the pitch  */}
      <section className="bg-ivory-100 py-20 sm:py-28" aria-labelledby="story-lead">
        <div className="container-x">
          <Reveal className="mx-auto max-w-3xl text-center" y={22} stagger={0.08}>
            <h2
              data-reveal
              id="story-lead"
              className="font-display text-[1.8rem] leading-[1.35] font-medium text-emerald-950 sm:text-[2.5rem]"
            >
              From wholesome dairy essentials to handcrafted Indian sweets, Laxmi Dairy brings
              familiar flavours to the table.
            </h2>
            <p
              data-reveal
              className="mx-auto mt-7 max-w-xl font-sans text-[0.98rem] leading-[1.8] text-ink-soft"
            >
              We are a neighbourhood dairy in Bhesan Gam. That means the milk, curd, paneer, ghee
              and buttermilk that a household needs on a Tuesday, and the shrikhand, peda, matho,
              rabdi and mithai that it needs for a festival — from the same counter, made by the
              same hands.
            </p>
          </Reveal>
        </div>
      </section>

      <Marquee items={CATEGORIES.map((c) => c.name)} />

      {/* --------------------------------------------------------- chapters */}
      <section className="bg-ivory-200 py-20 sm:py-28 lg:py-32" aria-labelledby="how-heading">
        <div className="container-x">
          <Reveal y={16}>
            <span data-reveal className="block">
              <Eyebrow>How it works</Eyebrow>
            </span>
            <h2
              data-reveal
              id="how-heading"
              className="fluid-h3 mt-4 max-w-lg font-display font-medium text-emerald-950"
            >
              Three things happen, in this order, every day.
            </h2>
          </Reveal>

          <Reveal className="mt-12 grid gap-px border hairline bg-emerald-800/10 sm:mt-16 lg:grid-cols-3" y={28} stagger={0.1}>
            {CHAPTERS.map((chapter) => (
              <article data-reveal key={chapter.number} className="bg-ivory-200 p-7 sm:p-9">
                <p className="font-sans text-[0.68rem] tracking-[0.22em] text-gold-600 tabular-nums">
                  {chapter.number}
                </p>
                <h3 className="mt-5 font-display text-[1.7rem] leading-tight font-medium text-emerald-950 sm:text-[2rem]">
                  {chapter.title}
                </h3>
                <p className="mt-4 font-sans text-[0.9rem] leading-[1.75] text-ink-soft">
                  {chapter.body}
                </p>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------ quote */}
      <section className="bg-emerald-950 py-20 text-ivory-100 sm:py-28 lg:py-32">
        <div className="container-x">
          <Reveal className="mx-auto max-w-3xl text-center" y={24} stagger={0.08}>
            <p
              data-reveal
              className="font-display text-[2rem] leading-[1.25] font-medium text-balance sm:text-[3rem]"
            >
              “Made this morning, sold today.”
            </p>
            <p data-reveal className="mt-6 font-sans text-[0.76rem] tracking-[0.18em] text-gold-300/70 uppercase">
              {BUSINESS.proprietor} · {ADDRESS.city}
            </p>
            <div data-reveal className="mt-10 flex flex-wrap justify-center gap-3">
              <Button to="/menu" variant="gold" size="lg" icon={ArrowRight}>
                See the full menu
              </Button>
              <Button to="/visit-us" variant="outlineLight" size="lg">
                Visit the shop
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <VisitUs />
    </>
  )
}
