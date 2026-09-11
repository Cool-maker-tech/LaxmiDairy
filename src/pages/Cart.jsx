import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ShoppingBag, Trash2 } from 'lucide-react'
import SmartImage from '../components/SmartImage.jsx'
import QuantityStepper from '../components/QuantityStepper.jsx'
import Button from '../components/Button.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { Reveal } from '../components/Reveal.jsx'
import { useCart } from '../context/CartContext.jsx'
import { usePageMeta } from '../hooks/usePageMeta.js'
import { formatINR } from '../utils/format.js'
import { ORDERING } from '../config/site.js'

export default function Cart() {
  usePageMeta({
    title: 'Your Cart | Laxmi Dairy, Surat',
    description: 'Review your Laxmi Dairy order before checkout.',
    path: '/cart',
  })

  const { items, subtotal, count, isEmpty, setQuantity, removeItem, clearCart } = useCart()

  return (
    <>
      <PageHeader
        eyebrow="Step 1 of 3"
        titleLines={['Your order.']}
        intro={
          isEmpty
            ? 'Nothing here yet. Everything on the menu can be added by weight, glass or piece.'
            : `${count} ${count === 1 ? 'item' : 'items'} ready. Adjust anything below, then head to checkout.`
        }
      />

      <div className="bg-ivory-100 pb-20 sm:pb-28">
        <div className="container-x">
          {isEmpty ? (
            <div className="flex flex-col items-center gap-6 border hairline bg-ivory-50 px-6 py-20 text-center sm:py-28">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border hairline text-emerald-800/35">
                <ShoppingBag size={24} strokeWidth={1.25} aria-hidden="true" />
              </span>
              <div>
                <p className="font-display text-3xl text-emerald-950">Your cart is empty</p>
                <p className="mx-auto mt-3 max-w-sm font-sans text-sm leading-relaxed text-ink-muted">
                  Start with the shrikhand, or go straight to the dairy counter for milk, curd,
                  paneer and ghee.
                </p>
              </div>
              <Button to="/menu" variant="primary" size="lg" icon={ArrowRight}>
                Explore the menu
              </Button>
            </div>
          ) : (
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
              {/* ------------------------------------------------- lines -- */}
              <div className="lg:col-span-7 xl:col-span-8">
                <div className="flex items-center justify-between border-b hairline pb-4">
                  <h2 className="eyebrow text-ink-muted">
                    {count} {count === 1 ? 'item' : 'items'}
                  </h2>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="font-sans text-[0.72rem] tracking-[0.12em] text-ink-muted uppercase transition-colors hover:text-red-700"
                  >
                    Clear cart
                  </button>
                </div>

                <Reveal as="ul" className="divide-y divide-emerald-800/[0.08]" y={18} stagger={0.05}>
                  {items.map((item) => (
                    <li data-reveal key={item.key} className="flex gap-4 py-6 sm:gap-6 sm:py-7">
                      <Link
                        to={`/menu/${item.slug}`}
                        className="w-24 shrink-0 overflow-hidden sm:w-32"
                        aria-label={`View ${item.name}`}
                        data-cursor="view"
                        data-cursor-label="View"
                      >
                        <SmartImage
                          src={item.image}
                          alt={item.name}
                          label={item.name}
                          category={item.category}
                          ratio="aspect-square"
                          imgClassName="transition-transform duration-700 hover:scale-105"
                        />
                      </Link>

                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <h3 className="font-display text-[1.35rem] leading-tight font-semibold text-emerald-950 sm:text-[1.6rem]">
                              <Link to={`/menu/${item.slug}`} className="hover:text-emerald-700">
                                {item.name}
                              </Link>
                            </h3>
                            <p className="mt-1 font-sans text-[0.76rem] tracking-wide text-ink-muted">
                              {item.type === 'weight'
                                ? `${item.optionLabel} · ${formatINR(item.unitPrice)} per pack`
                                : `${formatINR(item.unitPrice)} per ${item.unitNoun?.replace(/s$/, '')}`}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(item.key)}
                            aria-label={`Remove ${item.name} from cart`}
                            data-cursor="button"
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-transparent text-ink-muted transition-colors hover:border-red-700/25 hover:text-red-700"
                          >
                            <Trash2 size={16} strokeWidth={1.6} aria-hidden="true" />
                          </button>
                        </div>

                        <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-4">
                          <QuantityStepper
                            value={item.quantity}
                            onChange={(q) => setQuantity(item.key, q)}
                            min={0}
                            label={`quantity of ${item.name}`}
                          />
                          <span className="font-display text-[1.4rem] font-semibold text-emerald-900 tabular-nums">
                            {formatINR(item.lineTotal)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </Reveal>

                <Link
                  to="/menu"
                  data-cursor="link"
                  className="group mt-8 inline-flex items-center gap-2.5 font-sans text-[0.76rem] font-semibold tracking-[0.14em] text-emerald-800 uppercase"
                >
                  <ArrowLeft
                    size={15}
                    strokeWidth={1.75}
                    className="transition-transform duration-400 group-hover:-translate-x-1"
                    aria-hidden="true"
                  />
                  <span className="border-b border-emerald-800/30 pb-1 transition-colors group-hover:border-emerald-800">
                    Continue shopping
                  </span>
                </Link>
              </div>

              {/* ------------------------------------------------ summary -- */}
              <aside className="lg:col-span-5 xl:col-span-4" aria-label="Order summary">
                <div className="border hairline bg-ivory-50 p-6 sm:p-7 lg:sticky lg:top-28">
                  <h2 className="font-display text-[1.75rem] font-semibold text-emerald-950">
                    Order summary
                  </h2>

                  <dl className="mt-6 space-y-3 border-b hairline pb-6">
                    <div className="flex items-baseline justify-between gap-4">
                      <dt className="font-sans text-[0.86rem] text-ink-soft">Subtotal</dt>
                      <dd className="font-sans text-[0.95rem] font-semibold text-emerald-950 tabular-nums">
                        {formatINR(subtotal)}
                      </dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4">
                      <dt className="font-sans text-[0.86rem] text-ink-soft">Delivery</dt>
                      <dd className="text-right font-sans text-[0.78rem] text-ink-muted">
                        Confirmed on WhatsApp
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-6 flex items-baseline justify-between gap-4">
                    <span className="eyebrow text-ink-muted">Total</span>
                    <span className="font-display text-[2.4rem] leading-none font-semibold text-emerald-950 tabular-nums">
                      {formatINR(subtotal)}
                    </span>
                  </div>

                  <p className="mt-3 font-sans text-[0.74rem] leading-relaxed text-ink-muted">
                    {ORDERING.deliveryNote}
                  </p>

                  <Button
                    to="/checkout"
                    variant="primary"
                    size="lg"
                    icon={ArrowRight}
                    className="mt-7 w-full"
                  >
                    Proceed to checkout
                  </Button>
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
