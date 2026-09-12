import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react'
import {
  getProductById,
  getWeight,
  isOrderable,
  SALE_TYPE,
  unitPriceFor,
} from '../data/products.js'

const STORAGE_KEY = 'laxmi-dairy-cart-v1'
const MAX_QTY = 50

const CartContext = createContext(null)

/* -------------------------------------------------------------------------
 *  A cart line is identified by product + chosen option (weight / unit).
 * ---------------------------------------------------------------------- */
const lineKey = (productId, optionId) => `${productId}::${optionId ?? 'default'}`

function readStoredCart() {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    // Drop anything that no longer exists in the catalogue or is unorderable.
    return parsed
      .filter((l) => l && typeof l.productId === 'string')
      .filter((l) => isOrderable(getProductById(l.productId)))
      .map((l) => ({
        productId: l.productId,
        optionId: l.optionId ?? null,
        quantity: Math.min(MAX_QTY, Math.max(1, Number(l.quantity) || 1)),
      }))
  } catch {
    return []
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      const { productId, optionId, quantity } = action
      const key = lineKey(productId, optionId)
      const existing = state.find((l) => lineKey(l.productId, l.optionId) === key)
      if (existing) {
        return state.map((l) =>
          lineKey(l.productId, l.optionId) === key
            ? { ...l, quantity: Math.min(MAX_QTY, l.quantity + quantity) }
            : l,
        )
      }
      return [...state, { productId, optionId, quantity: Math.min(MAX_QTY, quantity) }]
    }

    case 'setQuantity': {
      const key = action.key
      if (action.quantity <= 0) {
        return state.filter((l) => lineKey(l.productId, l.optionId) !== key)
      }
      return state.map((l) =>
        lineKey(l.productId, l.optionId) === key
          ? { ...l, quantity: Math.min(MAX_QTY, action.quantity) }
          : l,
      )
    }

    case 'remove':
      return state.filter((l) => lineKey(l.productId, l.optionId) !== action.key)

    case 'clear':
      return []

    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [lines, dispatch] = useReducer(reducer, undefined, readStoredCart)
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  /** Bumped whenever something is added, so the nav badge can pulse. */
  const [lastAddedAt, setLastAddedAt] = useState(0)
  const firstRender = useRef(true)

  /* Persist across navigation and reloads. */
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      if (lines.length === 0) return
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      /* storage unavailable (private mode) — the cart still works in memory */
    }
  }, [lines])

  /* Resolve each stored line against the catalogue, so prices are never stale. */
  const items = useMemo(
    () =>
      lines
        .map((line) => {
          const product = getProductById(line.productId)
          if (!product) return null

          const weight = product.type === SALE_TYPE.WEIGHT ? getWeight(line.optionId) : null
          const unitPrice = unitPriceFor(product, line.optionId)
          if (unitPrice == null) return null

          const optionLabel =
            product.type === SALE_TYPE.WEIGHT
              ? (weight?.label ?? '')
              : `${line.quantity} ${line.quantity === 1 ? product.unitLabel : (product.unitLabelPlural ?? `${product.unitLabel}s`)}`

          return {
            key: lineKey(line.productId, line.optionId),
            productId: product.id,
            slug: product.slug,
            name: product.name,
            category: product.category,
            image: product.image,
            art: product.art,
            tint: product.tint,
            type: product.type,
            optionId: line.optionId,
            optionLabel,
            unitNoun:
              product.type === SALE_TYPE.UNIT
                ? (line.quantity === 1
                    ? product.unitLabel
                    : (product.unitLabelPlural ?? `${product.unitLabel}s`))
                : null,
            unitPrice,
            quantity: line.quantity,
            lineTotal: unitPrice * line.quantity,
          }
        })
        .filter(Boolean),
    [lines],
  )

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.lineTotal, 0), [items])
  const count = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items])

  const addItem = useCallback((product, { optionId = null, quantity = 1 } = {}) => {
    if (!isOrderable(product)) return false
    if (product.type === SALE_TYPE.WEIGHT && !getWeight(optionId)) return false

    dispatch({
      type: 'add',
      productId: product.id,
      optionId: product.type === SALE_TYPE.WEIGHT ? optionId : null,
      quantity: Math.max(1, Math.floor(quantity)),
    })
    setLastAddedAt(Date.now())
    return true
  }, [])

  const setQuantity = useCallback((key, quantity) => {
    dispatch({ type: 'setQuantity', key, quantity: Math.floor(quantity) })
  }, [])

  const removeItem = useCallback((key) => dispatch({ type: 'remove', key }), [])
  const clearCart = useCallback(() => dispatch({ type: 'clear' }), [])

  const openDrawer = useCallback(() => setDrawerOpen(true), [])
  const closeDrawer = useCallback(() => setDrawerOpen(false), [])

  const value = useMemo(
    () => ({
      items,
      subtotal,
      total: subtotal,
      count,
      isEmpty: items.length === 0,
      addItem,
      setQuantity,
      removeItem,
      clearCart,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      lastAddedAt,
    }),
    [
      items,
      subtotal,
      count,
      addItem,
      setQuantity,
      removeItem,
      clearCart,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      lastAddedAt,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
