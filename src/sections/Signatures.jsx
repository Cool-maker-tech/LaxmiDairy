import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import ProductCard from '../components/ProductCard.jsx'
import { Eyebrow, Reveal } from '../components/Reveal.jsx'
import { PRODUCTS, getProductById } from '../data/products.js'

/** The three sweets we would hand a first-time customer. */
const SIGNATURE_IDS = ['shrikhand-kesar-ilaichi', 'mithai-kaju-katli', 'rabdi-angur']

export default function Signatures() {
  const products = SIGNATURE_IDS.map(getProductById).filter(Boolean)

  return (
    <section className="bg-ivory-100 py-20 sm:py-28 lg:py-32" aria-labelledby="signatures-heading">
      <div className="container-x">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <Reveal y={16}>
            <span data-reveal className="block">
              <Eyebrow>Signatures</Eyebrow>
            </span>
            <h2
              data-reveal
              id="signatures-heading"
              className="fluid-h3 mt-4 max-w-lg font-display font-medium text-emerald-950"
            >
              If you are buying from us for the first time, start here.
            </h2>
          </Reveal>

          <Reveal y={16} delay={0.1}>
            <Link
              data-reveal
              to="/menu"
              data-cursor="link"
              className="group inline-flex shrink-0 items-center gap-3 font-sans text-[0.76rem] font-semibold tracking-[0.14em] text-emerald-800 uppercase"
            >
              <span className="border-b border-emerald-800/30 pb-1 transition-colors group-hover:border-emerald-800">
                All {PRODUCTS.length} items
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

        <Reveal
          className="mt-10 grid gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
          y={34}
          stagger={0.1}
          start="top 85%"
        >
          {products.map((product) => (
            <div data-reveal key={product.id} className="h-full">
              <ProductCard product={product} />
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
