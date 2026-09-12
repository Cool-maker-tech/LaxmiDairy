import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, Check, MessageCircle, ShoppingBag } from 'lucide-react'
import SmartImage from '../components/SmartImage.jsx'
import Button from '../components/Button.jsx'
import ProductCard from '../components/ProductCard.jsx'
import QuantityStepper from '../components/QuantityStepper.jsx'
import WeightSelector from '../components/WeightSelector.jsx'
import { Eyebrow, Reveal } from '../components/Reveal.jsx'
import { useCart } from '../context/CartContext.jsx'
import {
  SALE_TYPE,
  getCategory,
  getProductBySlug,
  getProductsByCategory,
  weightOptions,
} from '../data/products.js'
import { enquiryUrl } from '../utils/whatsapp.js'
import { usePageMeta } from '../hooks/usePageMeta.js'
import { formatINR } from '../utils/format.js'

export default function ProductDetails() {
  const { slug } = useParams()
  const product = getProductBySlug(slug)
  const { addItem, openDrawer } = useCart()

  const isWeight = product?.type === SALE_TYPE.WEIGHT
  const isRequest = product?.type === SALE_TYPE.ON_REQUEST
  const options = useMemo(() => (isWeight ? weightOptions(product) : []), [isWeight, product])

  const [weightId, setWeightId] = useState('500g')
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const addedTimer = useRef(null)

  /* Reset selection when navigating between products. */
  useEffect(() => {
    setWeightId('500g')
    setQuantity(1)
    setAdded(false)
  }, [slug])

  useEffect(() => () => clearTimeout(addedTimer.current), [])

  usePageMeta({
    title: product ? `${product.name} | Laxmi Dairy, Surat` : 'Not found | Laxmi Dairy',
    description: product ? `${product.description} Order from Laxmi Dairy, Surat.` : undefined,
    path: product ? `/menu/${product.slug}` : undefined,
    image: product?.image,
  })

  if (!product) return <Navigate to="/menu" replace />

  const category = getCategory(product.category)
  const selected = options.find((o) => o.id === weightId)
  const unitPrice = isWeight ? selected?.price : product.unitPrice
  const lineTotal = unitPrice != null ? unitPrice * quantity : null

  const related = getProductsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 3)

  const handleAdd = () => {
    if (!addItem(product, { optionId: weightId, quantity })) return
    setAdded(true)
    clearTimeout(addedTimer.current)
    addedTimer.current = setTimeout(() => setAdded(false), 2200)
    openDrawer()
  }

  return (
    <>
      <article className="bg-ivory-100 pt-24 pb-20 sm:pt-32 sm:pb-28">
        <div className="container-x">
          {/* ---------------------------------------------------- breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8 sm:mb-10">
            <ol className="flex flex-wrap items-center gap-2 font-sans text-[0.72rem] tracking-[0.1em] text-ink-muted uppercase">
              <li>
                <Link to="/menu" data-cursor="link" className="inline-flex items-center gap-1.5 transition-colors hover:text-emerald-900">
                  <ArrowLeft size={13} strokeWidth={1.75} aria-hidden="true" />
                  Menu
                </Link>
              </li>
              <li aria-hidden="true" className="text-ink-muted/40">/</li>
              <li>
                <Link
                  to={`/menu?category=${product.category}`}
                  data-cursor="link"
                  className="transition-colors hover:text-emerald-900"
                >
                  {category?.name}
                </Link>
              </li>
              <li aria-hidden="true" className="text-ink-muted/40">/</li>
              <li aria-current="page" className="text-emerald-900">
                {product.name}
              </li>
            </ol>
          </nav>

          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            {/* ------------------------------------------------------ media */}
            <Reveal className="lg:col-span-6" y={24}>
              <div data-reveal className="lg:sticky lg:top-28">
                <SmartImage
                  src={product.image}
                  alt={product.name}
                  category={product.category}
                  art={product.art}
                  seed={product.slug}
                  tint={product.tint}
                  ratio="aspect-[4/5]"
                  priority
                  sizes="(max-width: 1024px) 92vw, 46vw"
                />
                <p className="mt-3 font-sans text-[0.68rem] tracking-[0.16em] text-ink-muted uppercase">
                  {category?.name} · Laxmi Dairy, Surat
                </p>
              </div>
            </Reveal>

            {/* ------------------------------------------------------ detail */}
            <div className="lg:col-span-6">
              <Reveal y={22} stagger={0.07}>
                <span data-reveal className="block">
                  <Eyebrow>{category?.name}</Eyebrow>
                </span>

                <h1
                  data-reveal
                  className="mt-4 font-display text-[2.6rem] leading-[1.02] font-medium text-emerald-950 sm:text-[3.6rem]"
                >
                  {product.name}
                </h1>

                <p data-reveal className="mt-5 max-w-lg font-sans text-[1rem] leading-[1.75] text-ink-soft">
                  {product.details}
                </p>

                {/* ------------------------------------------------ pricing */}
                <div data-reveal className="mt-9 border-t hairline pt-7">
                  {isRequest ? (
                    <>
                      <p className="font-display text-[2rem] leading-none text-emerald-950">
                        Contact us for today&apos;s price
                      </p>
                      <p className="mt-3 max-w-md font-sans text-[0.88rem] leading-relaxed text-ink-muted">
                        The rate for {product.name.toLowerCase()} moves with the milk we get that
                        morning, so we quote it on the day rather than printing a number we cannot
                        stand behind.
                      </p>
                      <div className="mt-7 flex flex-wrap gap-3">
                        <Button
                          href={enquiryUrl(product.name)}
                          variant="primary"
                          size="lg"
                          icon={MessageCircle}
                          iconPosition="left"
                        >
                          Ask on WhatsApp
                        </Button>
                        <Button to="/menu" variant="outline" size="lg">
                          Back to menu
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                        <span className="font-display text-[2.6rem] leading-none font-semibold text-emerald-950 tabular-nums">
                          {formatINR(unitPrice)}
                        </span>
                        <span className="font-sans text-[0.8rem] tracking-[0.1em] text-ink-muted uppercase">
                          {isWeight
                            ? `${selected?.label} · ₹${product.pricePerKg} per kg`
                            : `per ${product.unitLabel}`}
                        </span>
                      </div>

                      {isWeight && (
                        <div className="mt-7">
                          <p className="eyebrow mb-3 text-ink-muted">Choose a weight</p>
                          <WeightSelector
                            options={options}
                            value={weightId}
                            onChange={setWeightId}
                            columns={3}
                            label={`Choose a weight for ${product.name}`}
                          />
                        </div>
                      )}

                      <div className="mt-7 flex flex-wrap items-center gap-4">
                        <div>
                          <p className="eyebrow mb-2.5 text-ink-muted">
                            {isWeight ? 'Packs' : `Number of ${product.unitLabelPlural ?? 'units'}`}
                          </p>
                          <QuantityStepper
                            value={quantity}
                            onChange={setQuantity}
                            label={`quantity of ${product.name}`}
                          />
                        </div>

                        <div className="border-l hairline pl-4 sm:pl-6">
                          <p className="eyebrow mb-2.5 text-ink-muted">Total</p>
                          <p className="font-display text-[1.75rem] leading-none font-semibold text-emerald-900 tabular-nums">
                            {formatINR(lineTotal)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-8 flex flex-wrap gap-3">
                        <Button
                          onClick={handleAdd}
                          variant={added ? 'gold' : 'primary'}
                          size="lg"
                          icon={added ? Check : ShoppingBag}
                          iconPosition="left"
                        >
                          {added ? 'Added to cart' : 'Add to cart'}
                        </Button>
                        <Button to="/cart" variant="outline" size="lg">
                          View cart
                        </Button>
                      </div>

                      <p className="mt-5 font-sans text-[0.76rem] leading-relaxed text-ink-muted">
                        {isWeight
                          ? 'Sold in 250 g, 500 g, 750 g, 1 kg, 1.5 kg and 2 kg. Packed fresh when you order.'
                          : product.counterOnly
                            ? 'Served at the shop. Add it to your order and we will have it ready.'
                            : 'Packed fresh when you order.'}
                      </p>
                    </>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </article>

      {/* ---------------------------------------------------------- related */}
      {related.length > 0 && (
        <section className="border-t hairline bg-ivory-200 py-16 sm:py-20" aria-labelledby="related-heading">
          <div className="container-x">
            <div className="flex items-end justify-between gap-6">
              <h2 id="related-heading" className="font-display text-[1.9rem] font-medium text-emerald-950 sm:text-[2.4rem]">
                More from {category?.name.toLowerCase()}
              </h2>
              <Link
                to={`/menu?category=${product.category}`}
                data-cursor="link"
                className="shrink-0 border-b border-emerald-800/30 pb-1 font-sans text-[0.74rem] font-semibold tracking-[0.14em] text-emerald-800 uppercase transition-colors hover:border-emerald-800"
              >
                See all
              </Link>
            </div>

            <Reveal className="mt-8 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3" y={28} stagger={0.08}>
              {related.map((item) => (
                <div data-reveal key={item.id} className="h-full">
                  <ProductCard product={item} />
                </div>
              ))}
            </Reveal>
          </div>
        </section>
      )}
    </>
  )
}
