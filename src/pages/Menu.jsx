import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import ProductCard from '../components/ProductCard.jsx'
import { Eyebrow, Reveal } from '../components/Reveal.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { CATEGORIES, PRODUCTS, getProductsByCategory } from '../data/products.js'
import { usePageMeta } from '../hooks/usePageMeta.js'
import { tidy, cx } from '../utils/format.js'

const ALL = 'all'

export default function Menu() {
  usePageMeta({
    title: 'Full Menu | Laxmi Dairy, Surat',
    description:
      'Browse the complete Laxmi Dairy menu — shrikhand, peda, matho, rabdi, mithai, milk, curd, paneer, ghee and buttermilk. Choose a weight and order on WhatsApp.',
    path: '/menu',
  })

  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = searchParams.get('category') ?? ALL
  const [query, setQuery] = useState('')
  const resultsRef = useRef(null)
  const isFirstRender = useRef(true)

  const setCategory = (id) => {
    const next = new URLSearchParams(searchParams)
    if (id === ALL) next.delete('category')
    else next.set('category', id)
    setSearchParams(next, { replace: true })
  }

  /* Grouped results, filtered by category and free-text search. */
  const groups = useMemo(() => {
    const q = tidy(query).toLowerCase()

    const matches = (product) => {
      if (!q) return true
      const haystack =
        `${product.name} ${product.shortName} ${product.description} ${product.category}`.toLowerCase()
      return haystack.includes(q)
    }

    const visible = CATEGORIES.filter((c) => activeCategory === ALL || c.id === activeCategory)

    return visible
      .map((category) => ({
        category,
        products: getProductsByCategory(category.id).filter(matches),
      }))
      .filter((group) => group.products.length > 0)
  }, [activeCategory, query])

  const total = groups.reduce((sum, g) => sum + g.products.length, 0)

  /* Move focus to the results when a filter changes, but never on first paint. */
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    resultsRef.current?.setAttribute('tabindex', '-1')
    resultsRef.current?.focus({ preventScroll: true })
  }, [activeCategory])

  return (
    <>
      <PageHeader
        eyebrow="The full counter"
        titleLines={['Our menu,', 'top to bottom.']}
        intro={`Every item we make, with the weights we sell them in. Pick a size and the price updates — what you see is exactly what goes into your order.`}
      />

      {/* ------------------------------------------------------- controls -- */}
      {/* Offsets match the scrolled navbar exactly: 65px under sm, 69px above. */}
      <div className="sticky top-[65px] z-40 border-y hairline bg-ivory-100/92 backdrop-blur-xl sm:top-[69px]">
        <div className="container-x flex flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between lg:py-3.5">
          {/* categories */}
          <div className="-mx-5 overflow-x-auto px-5 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0">
            <div
              role="tablist"
              aria-label="Menu categories"
              className="no-scrollbar flex min-w-max items-center gap-1.5"
            >
              <FilterChip
                active={activeCategory === ALL}
                onClick={() => setCategory(ALL)}
                count={PRODUCTS.length}
              >
                Everything
              </FilterChip>
              {CATEGORIES.map((category) => (
                <FilterChip
                  key={category.id}
                  active={activeCategory === category.id}
                  onClick={() => setCategory(category.id)}
                  count={getProductsByCategory(category.id).length}
                >
                  {category.name}
                </FilterChip>
              ))}
            </div>
          </div>

          {/* search */}
          <div className="relative shrink-0 lg:w-64">
            <label htmlFor="menu-search" className="sr-only">
              Search the menu
            </label>
            <Search
              size={15}
              strokeWidth={1.75}
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-muted"
            />
            <input
              id="menu-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search kaju, kesar, rabdi…"
              className="h-10 w-full rounded-full border border-emerald-800/15 bg-ivory-50 pr-9 pl-9.5 font-sans text-[0.82rem] text-emerald-950 transition-colors placeholder:text-ink-muted/70 focus:border-emerald-800/50 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute top-1/2 right-3 -translate-y-1/2 text-ink-muted transition-colors hover:text-emerald-900"
              >
                <X size={15} strokeWidth={1.75} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------- results -- */}
      <div ref={resultsRef} className="bg-ivory-100 pt-12 pb-20 outline-none sm:pt-16 sm:pb-28">
        <div className="container-x">
          <p className="sr-only" aria-live="polite">
            {total} {total === 1 ? 'item' : 'items'} shown
          </p>

          {groups.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-display text-3xl text-emerald-950">Nothing matched that.</p>
              <p className="mt-3 font-sans text-sm text-ink-muted">
                Try a shorter word — “kaju”, “kesar”, “rabdi” — or browse a category above.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  setCategory(ALL)
                }}
                className="mt-6 rounded-full border border-emerald-800/30 px-6 py-2.5 font-sans text-[0.72rem] font-semibold tracking-[0.14em] text-emerald-800 uppercase transition-colors hover:bg-emerald-800 hover:text-ivory-100"
              >
                Show everything
              </button>
            </div>
          ) : (
            groups.map((group, groupIndex) => (
              <section
                key={group.category.id}
                id={group.category.id}
                aria-labelledby={`heading-${group.category.id}`}
                className={groupIndex === 0 ? '' : 'mt-16 sm:mt-24'}
              >
                <div className="flex flex-col gap-3 border-b hairline pb-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <Eyebrow>{group.category.tagline}</Eyebrow>
                    <h2
                      id={`heading-${group.category.id}`}
                      className="mt-3 font-display text-[2.2rem] leading-none font-medium text-emerald-950 sm:text-[3rem]"
                    >
                      {group.category.name}
                    </h2>
                  </div>
                  <p className="max-w-md font-sans text-[0.84rem] leading-relaxed text-ink-muted">
                    {group.category.description}
                  </p>
                </div>

                <Reveal
                  className="mt-8 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4"
                  y={30}
                  stagger={0.06}
                  start="top 90%"
                >
                  {group.products.map((product, i) => (
                    <div data-reveal key={product.id} className="h-full">
                      <ProductCard product={product} priority={groupIndex === 0 && i < 4} />
                    </div>
                  ))}
                </Reveal>
              </section>
            ))
          )}
        </div>
      </div>
    </>
  )
}

function FilterChip({ active, onClick, count, children }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      data-cursor="button"
      className={cx(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 font-sans text-[0.74rem] font-semibold tracking-[0.06em] transition-ui duration-400',
        active
          ? 'border-emerald-800 bg-emerald-800 text-ivory-100'
          : 'border-emerald-800/15 text-ink-soft hover:border-emerald-800/45 hover:text-emerald-900',
      )}
    >
      {children}
      <span className={cx('text-[0.62rem] tabular-nums', active ? 'text-gold-300' : 'text-ink-muted')}>
        {count}
      </span>
    </button>
  )
}
