/**
 * ============================================================================
 *  LAXMI DAIRY — PRODUCT CATALOGUE
 * ============================================================================
 *  This is the single source of truth for the whole site.
 *  To change a price, edit `pricePerKg` (or `unitPrice`) below — every weight
 *  option, product card, cart line and WhatsApp order updates automatically.
 *
 *  To change a photo, drop your file into `public/products/` and point
 *  `image` at it, e.g. image: '/products/ghee.jpeg'
 * ============================================================================
 */

/* --------------------------------------------------------------------------
 *  Weight options for everything sold by the kilo.
 *  `factor` is the multiple of the per-kg price.
 * ----------------------------------------------------------------------- */
export const WEIGHTS = [
  { id: '250g', label: '250 g', short: '250g', factor: 0.25 },
  { id: '500g', label: '500 g', short: '500g', factor: 0.5 },
  { id: '750g', label: '750 g', short: '750g', factor: 0.75 },
  { id: '1kg', label: '1 kg', short: '1kg', factor: 1 },
  { id: '1.5kg', label: '1.5 kg', short: '1.5kg', factor: 1.5 },
  { id: '2kg', label: '2 kg', short: '2kg', factor: 2 },
]

/** Product sale models. */
export const SALE_TYPE = {
  /** Priced per kilogram, sold in the WEIGHTS above. */
  WEIGHT: 'weight',
  /** Priced per piece / per glass / per litre. */
  UNIT: 'unit',
  /** Rate varies day to day — the customer is asked to contact the shop. */
  ON_REQUEST: 'request',
}

export const CATEGORIES = [
  {
    id: 'shrikhand',
    name: 'Shrikhand',
    tagline: 'Strained, sweetened, slow-set',
    description:
      'Thick set shrikhand, finished by hand in small batches and sold fresh from the counter.',
  },
  {
    id: 'peda',
    name: 'Peda',
    tagline: 'Mava worked down to a soft crumb',
    description:
      'Classic mava peda and barfi, shaped through the day so the counter always has a fresh tray.',
  },
  {
    id: 'matho',
    name: 'Matho',
    tagline: 'Lighter, spoonable, Surti-style',
    description:
      'Soft matho in plain and fruit varieties — a Surat favourite, best eaten the same day.',
  },
  {
    id: 'rabdi',
    name: 'Rabdi & Drinks',
    tagline: 'Reduced milk and cold glasses',
    description:
      'Milk cooked down slowly for rabdi, plus chilled lassi and coco by the glass.',
  },
  {
    id: 'mithai',
    name: 'Mithai',
    tagline: 'Kaju, kesar and festival boxes',
    description:
      'Cashew-forward mithai cut fresh — the tray we reach for at festivals and celebrations.',
  },
  {
    id: 'dairy',
    name: 'Milk & Dairy',
    tagline: 'The everyday essentials',
    description:
      'Milk, curd, paneer, ghee and buttermilk — the daily basics the shop was built on.',
  },
  {
    id: 'counter',
    name: 'Also at Our Counter',
    tagline: 'Ask us on the day',
    description: 'Small things we keep alongside the main trays.',
  },
]

/* --------------------------------------------------------------------------
 *  PRODUCTS
 *
 *  `tint` colours that illustration where the real sweet is a different colour
 *  (saffron, chocolate, fig, strawberry). Optional.
 *
 *  `art` names the illustration shown until a real photograph is dropped into
 *  `public/products/` (see src/components/ProductArt.jsx). Products without an
 *  `art` key fall back to their category's drawing, which is the right one for
 *  every sweet — only the dairy counter needs to distinguish milk from curd
 *  from paneer from ghee.
 * ----------------------------------------------------------------------- */
export const PRODUCTS = [
  /* ---------------------------------------------------------- SHRIKHAND -- */
  {
    id: 'shrikhand-plain',
    slug: 'plain-shrikhand',
    name: 'Plain Shrikhand',
    shortName: 'Plain',
    category: 'shrikhand',
    type: SALE_TYPE.WEIGHT,
    pricePerKg: 400,
    image: '/products/shrikhand-plain.jpeg',
    description: 'Strained curd, sweetened and set thick. The plain one — nothing to hide behind.',
    details:
      'Our everyday shrikhand: curd hung until it is dense, sweetened, then rested so it sets to a smooth spoonable body. Serve chilled with puri, or on its own.',
  },
  {
    id: 'shrikhand-badam-cadbury',
    tint: '#E8D3B8',
    slug: 'badam-cadbury-shrikhand',
    name: 'Badam Cadbury Shrikhand',
    shortName: 'Badam Cadbury',
    category: 'shrikhand',
    type: SALE_TYPE.WEIGHT,
    pricePerKg: 420,
    image: '/products/shrikhand-badam-cadbury.jpeg',
    description: 'Almond and chocolate folded through a plain base — the one children ask for.',
    details:
      'Plain shrikhand finished with almond and chocolate. Sweeter than the classic, and a reliable favourite for birthdays and family lunches.',
  },
  {
    id: 'shrikhand-kesar-ilaichi',
    tint: '#F7E3B4',
    slug: 'kesar-ilaichi-shrikhand',
    name: 'Kesar Ilaichi Shrikhand',
    shortName: 'Kesar Ilaichi',
    category: 'shrikhand',
    type: SALE_TYPE.WEIGHT,
    pricePerKg: 420,
    image: '/products/shrikhand-kesar-ilaichi.jpeg',
    description: 'Saffron and green cardamom — the festival standard.',
    details:
      'Saffron steeped into warm milk, then folded in with freshly ground cardamom. Warm colour, gentle perfume, and the version most families order for a festival thali.',
  },
  {
    id: 'shrikhand-rajbhog',
    tint: '#F6DFA8',
    slug: 'rajbhog-shrikhand',
    name: 'Rajbhog Shrikhand',
    shortName: 'Rajbhog',
    category: 'shrikhand',
    type: SALE_TYPE.WEIGHT,
    pricePerKg: 440,
    image: '/products/shrikhand-rajbhog.jpeg',
    description: 'Saffron, cardamom and dry fruit — our richest shrikhand.',
    details:
      'The fullest version we make: saffron and cardamom with chopped dry fruit worked right through, so every spoon has something in it.',
  },

  /* --------------------------------------------------------------- PEDA -- */
  {
    id: 'peda-kalakand-barfi',
    tint: '#F8EEDC',
    slug: 'kalakand-barfi',
    name: 'Kalakand Barfi',
    shortName: 'Kalakand Barfi',
    category: 'peda',
    type: SALE_TYPE.WEIGHT,
    pricePerKg: 600,
    image: '/products/kalakand-barfi.jpeg',
    description: 'Grainy, milky, cut into squares. Soft set rather than firm.',
    details:
      'Milk cooked until it grains, set into a tray and cut fresh. Moist in the middle, with the loose crumb kalakand is meant to have.',
  },
  {
    id: 'peda-sada',
    slug: 'sada-peda',
    name: 'Sada Peda',
    shortName: 'Sada Peda',
    category: 'peda',
    type: SALE_TYPE.WEIGHT,
    pricePerKg: 500,
    image: '/products/sada-peda.jpeg',
    description: 'The plain mava peda — shaped by hand, all day.',
    details:
      'Mava worked down, sweetened and rolled by hand. No colour, no flavouring — this is the peda you buy for the mandir and for the house.',
  },
  {
    id: 'peda-kesar',
    tint: '#F7E3B4',
    slug: 'kesar-peda',
    name: 'Kesar Peda',
    shortName: 'Kesar Peda',
    category: 'peda',
    type: SALE_TYPE.WEIGHT,
    pricePerKg: 600,
    image: '/products/kesar-peda.jpeg',
    description: 'Saffron through the mava, pressed with a thumb.',
    details:
      'Our sada peda with saffron folded through before shaping — deeper colour, and a rounder flavour that carries well in a gift box.',
  },
  {
    id: 'peda-fancy',
    slug: 'fancy-peda',
    name: 'Fancy Peda',
    shortName: 'Fancy Peda',
    category: 'peda',
    type: SALE_TYPE.WEIGHT,
    pricePerKg: 600,
    image: '/products/fancy-peda.jpeg',
    description: 'Decorated peda for boxes, trays and occasions.',
    details:
      'Peda finished with dry fruit and a decorative top — made for gifting, festival trays and anything that arrives at someone else’s door.',
  },
  {
    id: 'peda-thabdi',
    tint: '#E4C79A',
    slug: 'thabdi-peda',
    name: 'Thabdi Peda',
    shortName: 'Thabdi Peda',
    category: 'peda',
    type: SALE_TYPE.WEIGHT,
    pricePerKg: 560,
    image: '/products/thabdi-peda.jpeg',
    description: 'Kathiyawadi style — darker, granular, cooked longer.',
    details:
      'Cooked further than a sada peda, so the milk catches colour and the texture turns granular. If you grew up on thabdi, you already know this one.',
  },
  {
    id: 'peda-bonty',
    slug: 'bonty-penda',
    name: 'Bonty Penda',
    shortName: 'Bonty Penda',
    category: 'peda',
    type: SALE_TYPE.WEIGHT,
    pricePerKg: 600,
    image: '/products/bonty-penda.jpeg',
    description: 'Small, dense rounds — rich and easy to hand around.',
    details:
      'Bite-sized penda, rolled small and dense. Good for trays where people are standing rather than sitting.',
  },

  /* -------------------------------------------------------------- MATHO -- */
  {
    id: 'matho-plain',
    slug: 'plain-matho',
    name: 'Plain Matho',
    shortName: 'Plain',
    category: 'matho',
    type: SALE_TYPE.WEIGHT,
    pricePerKg: 380,
    image: '/products/matho-plain.jpeg',
    description: 'Lighter and looser than shrikhand. Plain and cold.',
    details:
      'Surti matho — the same strained-curd family as shrikhand but set softer, so it falls off a spoon. Best eaten the day you buy it.',
  },
  {
    id: 'matho-american-dry-fruit',
    tint: '#F7EEDC',
    slug: 'american-dry-fruit-matho',
    name: 'American Dry Fruit Matho',
    shortName: 'American Dry Fruit',
    category: 'matho',
    type: SALE_TYPE.WEIGHT,
    pricePerKg: 400,
    image: '/products/matho-dry-fruit.jpeg',
    description: 'Plain matho loaded with chopped dry fruit.',
    details:
      'Our plain matho with a generous quantity of mixed dry fruit stirred through — texture in every spoon, without making it heavy.',
  },
  {
    id: 'matho-mango-pulp',
    tint: '#FBE2A6',
    slug: 'mango-pulp-matho',
    name: 'Mango Pulp Matho',
    shortName: 'Mango Pulp',
    category: 'matho',
    type: SALE_TYPE.WEIGHT,
    pricePerKg: 400,
    image: '/products/matho-mango.jpeg',
    description: 'Mango pulp folded in. Bright, cold, seasonal in spirit.',
    details:
      'Matho blended with mango pulp until the colour runs right through. The one that empties fastest in summer.',
  },
  {
    id: 'matho-mava-malai',
    tint: '#F6E8CB',
    slug: 'mava-malai-matho',
    name: 'Mava Malai Matho',
    shortName: 'Mava Malai',
    category: 'matho',
    type: SALE_TYPE.WEIGHT,
    pricePerKg: 440,
    image: '/products/matho-mava-malai.jpeg',
    description: 'Mava and malai make it the richest matho on the counter.',
    details:
      'Matho enriched with mava and malai — closer to a dessert than the plain version, and the one to order when you want something that feels special.',
  },

  /* ----------------------------------------------------- RABDI & DRINKS -- */
  {
    id: 'rabdi-dry-fruit',
    slug: 'dry-fruit-rabdi',
    name: 'Dry Fruit Rabdi',
    shortName: 'Dry Fruit Rabdi',
    category: 'rabdi',
    type: SALE_TYPE.WEIGHT,
    pricePerKg: 480,
    image: '/products/rabdi-dry-fruit.jpeg',
    description: 'Milk reduced down, layered with dry fruit.',
    details:
      'Milk simmered until it thickens and the cream gathers, then finished with chopped dry fruit. Served chilled.',
  },
  {
    id: 'rabdi-angur',
    tint: '#F3E7C8',
    slug: 'angur-rabdi',
    name: 'Angur Rabdi',
    shortName: 'Angur Rabdi',
    category: 'rabdi',
    type: SALE_TYPE.WEIGHT,
    pricePerKg: 500,
    image: '/products/rabdi-angur.jpeg',
    description: 'Small chhena pearls suspended in thick rabdi.',
    details:
      'Tiny angur — soft chhena beads — soaked through our rabdi so they carry the sweetness. Light to eat despite how rich it looks.',
  },
  {
    id: 'rabdi-anjir',
    tint: '#E3CBA8',
    slug: 'anjir-rabdi',
    name: 'Anjir Rabdi',
    shortName: 'Anjir Rabdi',
    category: 'rabdi',
    type: SALE_TYPE.WEIGHT,
    pricePerKg: 550,
    image: '/products/rabdi-anjir.jpeg',
    description: 'Fig-forward and deep. Our most grown-up rabdi.',
    details:
      'Rabdi built around anjir, so it carries a darker, less sugary sweetness. Good after a heavy meal.',
  },
  {
    id: 'rabdi-sitafal',
    tint: '#F1EBD5',
    slug: 'sitafal-rabdi',
    name: 'Sitafal Rabdi',
    shortName: 'Sitafal Rabdi',
    category: 'rabdi',
    type: SALE_TYPE.WEIGHT,
    pricePerKg: 500,
    image: '/products/rabdi-sitafal.jpeg',
    description: 'Custard apple stirred through thickened milk.',
    details:
      'Sitafal folded into rabdi — fragrant, soft and unmistakable. Ask on the day; sitafal is at its best in season.',
  },
  {
    id: 'drink-lassi',
    art: 'lassi',
    slug: 'lassi',
    name: 'Lassi',
    shortName: 'Lassi',
    category: 'rabdi',
    type: SALE_TYPE.UNIT,
    unitPrice: 60,
    unitLabel: 'glass',
    unitLabelPlural: 'glasses',
    image: '/products/lassi.jpeg',
    description: 'Sweet, cold, thick enough to need a straw with some effort.',
    details:
      'Curd churned sweet and poured cold over the counter. Served by the glass at the shop.',
    counterOnly: true,
  },
  {
    id: 'drink-coco',
    art: 'coco',
    slug: 'coco',
    name: 'Coco',
    shortName: 'Coco',
    category: 'rabdi',
    type: SALE_TYPE.UNIT,
    unitPrice: 60,
    unitLabel: 'glass',
    unitLabelPlural: 'glasses',
    image: '/products/coco.jpeg',
    description: 'Chilled chocolate milk, by the glass.',
    details: 'Cold cocoa milk, shaken and poured fresh. Served by the glass at the shop.',
    counterOnly: true,
  },

  /* ------------------------------------------------------------- MITHAI -- */
  {
    id: 'mithai-kaju-katli',
    slug: 'kaju-katli',
    name: 'Kaju Katli',
    shortName: 'Kaju Katli',
    category: 'mithai',
    type: SALE_TYPE.WEIGHT,
    pricePerKg: 1000,
    image: '/products/kaju-katli.jpeg',
    description: 'Thin cashew diamonds with a clean silver finish.',
    details:
      'Cashew ground fine, cooked to the right thread and rolled thin before cutting. The mithai everyone recognises, and the one that has to be right.',
  },
  {
    id: 'mithai-kaju-roll',
    slug: 'kaju-roll',
    name: 'Kaju Roll',
    shortName: 'Kaju Roll',
    category: 'mithai',
    type: SALE_TYPE.WEIGHT,
    pricePerKg: 1100,
    image: '/products/kaju-roll.jpeg',
    description: 'Cashew sheet rolled around a soft centre.',
    details:
      'The same cashew base as our katli, rolled around a filling and sliced into rounds — a step richer, and it holds well in a gift box.',
  },
  {
    id: 'mithai-kaju-kasata',
    tint: '#F4DEC2',
    slug: 'kaju-kasata',
    name: 'Kaju Kasata',
    shortName: 'Kaju Kasata',
    category: 'mithai',
    type: SALE_TYPE.WEIGHT,
    pricePerKg: 1100,
    image: '/products/kaju-kasata.jpeg',
    description: 'Layered cashew mithai, cut to show the section.',
    details:
      'Coloured cashew layers set together and cut so the section shows. A tray of kasata does the decorating for you.',
  },
  {
    id: 'mithai-strawberry-katli',
    tint: '#F3D4CE',
    slug: 'strawberry-katli',
    name: 'Strawberry Katli',
    shortName: 'Strawberry Katli',
    category: 'mithai',
    type: SALE_TYPE.WEIGHT,
    pricePerKg: 1100,
    image: '/products/strawberry-katli.jpeg',
    description: 'Cashew katli with a strawberry layer.',
    details:
      'Our katli with a strawberry layer set over it — the sweeter, brighter option on a mixed mithai tray.',
  },
  {
    id: 'mithai-kesar-katli',
    tint: '#F6E2B0',
    slug: 'kesar-katli',
    name: 'Kesar Katli',
    shortName: 'Kesar Katli',
    category: 'mithai',
    type: SALE_TYPE.WEIGHT,
    pricePerKg: 1100,
    image: '/products/kesar-katli.jpeg',
    description: 'Saffron worked into the cashew sheet.',
    details:
      'Kaju katli with saffron through the sheet — warmer in colour and gentler in flavour than the plain version.',
  },
  {
    id: 'mithai-kamal-bhog',
    slug: 'kamal-bhog',
    name: 'Kamal Bhog',
    shortName: 'Kamal Bhog',
    category: 'mithai',
    type: SALE_TYPE.WEIGHT,
    pricePerKg: 1150,
    image: '/products/kamal-bhog.jpeg',
    description: 'Shaped like a lotus, made for the festival tray.',
    details:
      'A cashew mithai shaped and finished by hand. It takes longer to make than anything else on this list, which is why it comes out for occasions.',
  },
  {
    id: 'mithai-anjir-roll',
    tint: '#E0C6A4',
    slug: 'anjir-roll',
    name: 'Anjir Roll',
    shortName: 'Anjir Roll',
    category: 'mithai',
    type: SALE_TYPE.WEIGHT,
    pricePerKg: 1150,
    image: '/products/anjir-roll.jpeg',
    description: 'Fig and cashew rolled together, sliced into rounds.',
    details:
      'Fig worked with cashew and rolled, then sliced. Less sugary than most of the tray — usually the first thing the elders pick up.',
  },

  /* -------------------------------------------------------- MILK & DAIRY --
   *  The five products with photography supplied by the shop.
   * ----------------------------------------------------------------------- */
  {
    id: 'dairy-buffalo-milk',
    art: 'milk',
    slug: 'buffalo-milk',
    name: 'Buffalo Milk',
    shortName: 'Buffalo Milk',
    category: 'dairy',
    type: SALE_TYPE.UNIT,
    unitPrice: 82,
    unitLabel: 'litre',
    unitLabelPlural: 'litres',
    image: '/products/milk.jpeg',
    featured: true,
    featuredName: 'Milk',
    description: 'Full-cream buffalo milk, sold by the litre.',
    details:
      'The milk everything else here is made from. Thick enough to set curd properly and to leave a real layer of malai on top.',
  },
  {
    id: 'dairy-cow-milk',
    art: 'milk',
    slug: 'cow-milk',
    name: 'Cow Milk',
    shortName: 'Cow Milk',
    category: 'dairy',
    type: SALE_TYPE.ON_REQUEST,
    image: '/products/cow-milk.jpeg',
    description: 'Lighter than buffalo milk. Ask us for today’s rate.',
    details:
      'Cow milk for households that prefer it lighter — for tea, for children, and for anyone who finds buffalo milk too rich.',
  },
  {
    id: 'dairy-curd',
    art: 'curd',
    slug: 'curd-dahi',
    name: 'Curd / Dahi',
    shortName: 'Curd / Dahi',
    category: 'dairy',
    type: SALE_TYPE.ON_REQUEST,
    image: '/products/curd.jpeg',
    featured: true,
    featuredName: 'Curd',
    description: 'Set fresh each day. Ask us for today’s rate.',
    details:
      'Curd set from our own milk and sold the same day — thick, mild, and not sour unless you leave it out too long.',
  },
  {
    id: 'dairy-punjabi-dahi',
    art: 'curd',
    slug: 'punjabi-dahi',
    name: 'Punjabi Dahi',
    shortName: 'Punjabi Dahi',
    category: 'dairy',
    type: SALE_TYPE.WEIGHT,
    pricePerKg: 180,
    image: '/products/punjabi-dahi.jpeg',
    description: 'Thicker, creamier set curd — sold by weight.',
    details:
      'A richer set than our everyday dahi: firm enough to hold a spoon upright, and the one to buy for raita, lassi at home, or eating plain.',
  },
  {
    id: 'dairy-paneer',
    art: 'paneer',
    slug: 'paneer',
    name: 'Paneer',
    shortName: 'Paneer',
    category: 'dairy',
    type: SALE_TYPE.ON_REQUEST,
    image: '/products/paneer.jpeg',
    featured: true,
    featuredName: 'Paneer',
    description: 'Pressed fresh from our own milk. Ask us for today’s rate.',
    details:
      'Fresh paneer, pressed the same morning. Soft enough to eat as it is, and firm enough to hold its shape in a sabzi.',
  },
  {
    id: 'dairy-ghee',
    art: 'ghee',
    slug: 'ghee',
    name: 'Ghee',
    shortName: 'Ghee',
    category: 'dairy',
    type: SALE_TYPE.ON_REQUEST,
    image: '/products/ghee.jpeg',
    featured: true,
    featuredName: 'Ghee',
    description: 'Golden, grainy and aromatic. Ask us for today’s rate.',
    details:
      'Ghee made from our own cream. Cook with it, spoon it over dal, or keep a jar for the lamp — it does all three jobs.',
  },
  {
    id: 'dairy-buttermilk',
    art: 'buttermilk',
    slug: 'buttermilk',
    name: 'Buttermilk / Chaas',
    shortName: 'Buttermilk',
    category: 'dairy',
    type: SALE_TYPE.ON_REQUEST,
    image: '/products/buttermilk.jpeg',
    featured: true,
    featuredName: 'Buttermilk',
    description: 'Churned thin, lightly salted. Ask us for today’s rate.',
    details:
      'Chaas churned from our curd — thin, cool and lightly spiced. The right thing after a Gujarati thali, and the right thing in May.',
  },

  /* ------------------------------------------------------------ COUNTER -- */
  {
    id: 'counter-rasgulla',
    art: 'rasgulla',
    slug: 'rasgulla',
    name: 'Rasgulla',
    shortName: 'Rasgulla',
    category: 'counter',
    type: SALE_TYPE.UNIT,
    unitPrice: 20,
    unitLabel: 'piece',
    unitLabelPlural: 'pieces',
    image: '/products/rasgulla.jpeg',
    description: 'Soft chhena, sitting in light syrup. Sold by the piece.',
    details:
      'Spongy chhena rasgulla in a light sugar syrup. Order as many pieces as you need — we pack them with syrup so they stay soft.',
  },
]

/* ==========================================================================
 *  Derived helpers — keep price logic in one place.
 * ======================================================================== */

/** Every product, keyed by id. */
export const PRODUCTS_BY_ID = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]))

/** Every product, keyed by URL slug. */
export const PRODUCTS_BY_SLUG = Object.fromEntries(PRODUCTS.map((p) => [p.slug, p]))

/** The hero products the shop photographs — used on the home page showcase. */
export const FEATURED_PRODUCTS = PRODUCTS.filter((p) => p.featured)

export const getCategory = (id) => CATEGORIES.find((c) => c.id === id)

export const getProductsByCategory = (id) => PRODUCTS.filter((p) => p.category === id)

export const getProductBySlug = (slug) => PRODUCTS_BY_SLUG[slug] ?? null

export const getProductById = (id) => PRODUCTS_BY_ID[id] ?? null

export const getWeight = (id) => WEIGHTS.find((w) => w.id === id) ?? null

/**
 * Price of a weight-based product at a given weight option.
 * Rounded to the nearest rupee, which reproduces the shop's printed price list.
 */
export function priceForWeight(product, weightId) {
  if (!product || product.type !== SALE_TYPE.WEIGHT) return null
  const weight = getWeight(weightId)
  if (!weight) return null
  return Math.round(product.pricePerKg * weight.factor)
}

/** All six weight options for a product, with their prices resolved. */
export function weightOptions(product) {
  if (!product || product.type !== SALE_TYPE.WEIGHT) return []
  return WEIGHTS.map((w) => ({ ...w, price: Math.round(product.pricePerKg * w.factor) }))
}

/** The price of one sellable unit of a product at the chosen option. */
export function unitPriceFor(product, optionId) {
  if (!product) return null
  if (product.type === SALE_TYPE.WEIGHT) return priceForWeight(product, optionId)
  if (product.type === SALE_TYPE.UNIT) return product.unitPrice
  return null
}

/** Human label for what a single unit of this product is. */
export function unitNoun(product, quantity = 1) {
  if (!product || product.type !== SALE_TYPE.UNIT) return ''
  return quantity === 1 ? product.unitLabel : (product.unitLabelPlural ?? `${product.unitLabel}s`)
}

/** Can this product be added to the cart at all? */
export const isOrderable = (product) => product && product.type !== SALE_TYPE.ON_REQUEST

/** "From ₹95" / "₹82 per litre" / "Price on request" — the card headline price. */
export function displayPrice(product) {
  if (!product) return ''
  if (product.type === SALE_TYPE.WEIGHT) return `₹${product.pricePerKg} / kg`
  if (product.type === SALE_TYPE.UNIT) return `₹${product.unitPrice} / ${product.unitLabel}`
  return 'Price on request'
}
