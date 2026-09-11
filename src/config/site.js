/**
 * ============================================================================
 *  LAXMI DAIRY — CENTRAL BUSINESS CONFIGURATION
 * ============================================================================
 *  Everything the shop owner is likely to change lives in THIS ONE FILE.
 *  Product names and prices live in `src/data/products.js`.
 * ============================================================================
 */

export const BUSINESS = {
  name: 'Laxmi Dairy',
  proprietor: 'Girishbhai',
  tagline: 'Pure. Fresh. Every day.',
  shortDescription:
    'Authentic dairy, handcrafted sweets and timeless flavours from Laxmi Dairy, Surat.',
}

/* --------------------------------------------------------------------------
 *  CONTACT  —  change the phone / WhatsApp number here
 * ----------------------------------------------------------------------- */
export const CONTACT = {
  /** Display form, shown to customers. */
  phoneDisplay: '+91 88663 30092',
  /** Dial form, used by `tel:` links. */
  phoneDial: '+918866330092',
  /**
   * WhatsApp number in full international format, digits only, no `+`.
   * THIS is the number every "Order on WhatsApp" button uses.
   */
  whatsappNumber: '918866330092',
  email: '',
}

/* --------------------------------------------------------------------------
 *  UPI  —  change the payment ID here
 * ----------------------------------------------------------------------- */
export const UPI = {
  /** Merchant Virtual Payment Address (VPA). */
  id: 'paytm.s169uks@pty',
  /** Payee name shown inside the customer's UPI app. */
  payeeName: 'Laxmi Dairy',
  currency: 'INR',
}

/* --------------------------------------------------------------------------
 *  ADDRESS  —  change the shop location here
 * ----------------------------------------------------------------------- */
export const ADDRESS = {
  lines: [
    'Shop No. J-2, Laxmi Dairy',
    'Siddhivinayak Elements',
    'Bhesan Gam, Dahin Nagar',
  ],
  city: 'Surat',
  state: 'Gujarat',
  pincode: '395005',
  country: 'India',
  /** Single-line form used in the WhatsApp message and schema markup. */
  get oneLine() {
    return `${this.lines.join(', ')}, ${this.city}, ${this.state} – ${this.pincode}`
  },
  mapsUrl: 'https://maps.app.goo.gl/eG8AJnLH8ZHuccSAA?g_st=ic',
}

/* --------------------------------------------------------------------------
 *  HOURS  —  informational only
 * ----------------------------------------------------------------------- */
export const HOURS = [
  { days: 'Monday – Sunday', time: 'Open daily' },
]

/* --------------------------------------------------------------------------
 *  ORDERING
 * ----------------------------------------------------------------------- */
export const ORDERING = {
  /**
   * Orders are confirmed over WhatsApp by the shop. Delivery charges, if any,
   * are agreed at that point — the site does not invent a delivery fee.
   */
  deliveryNote: 'Delivery availability and any charges are confirmed on WhatsApp.',
  currencySymbol: '₹',
}

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Menu', to: '/menu' },
  { label: 'Our Story', to: '/our-story' },
  { label: 'Visit Us', to: '/visit-us' },
]

/** Canonical origin — replace once the site is live on its own domain. */
export const SITE_URL = 'https://laxmidairy.example'
