# Laxmi Dairy

Website for **Laxmi Dairy** — fresh dairy products and handcrafted Indian sweets,
Shop No. J-2, Siddhivinayak Elements, Bhesan Gam, Dahin Nagar, Surat, Gujarat – 395005.

Browse the full menu, pick a weight, build a cart, check out, pay by UPI or cash,
and send the finished order to the shop on WhatsApp.

---

## Running it

```bash
npm install      # once
npm run dev      # development server → http://localhost:5173
npm run build    # production build → dist/
npm run preview  # serve the production build locally
npm run lint     # oxlint
```

Node 20+ recommended (built and tested on Node 22).

---

## The things you will want to edit

Everything a shop owner is likely to change lives in two files.

| What you want to change | Where |
| --- | --- |
| **Product photos** | Drop files into `public/products/`, then point `image:` at them in `src/data/products.js` |
| **Prices** | `src/data/products.js` — one `pricePerKg` (or `unitPrice`) per product |
| **WhatsApp number** | `src/config/site.js` → `CONTACT.whatsappNumber` |
| **UPI ID** | `src/config/site.js` → `UPI.id` |
| **Shop address** | `src/config/site.js` → `ADDRESS` |
| **Your logo** | Drop it at `public/logo.png` — picked up automatically |

Phone number, Google Maps link, opening hours, nav links and the site's canonical
URL are all in `src/config/site.js` too.

### Adding your product photos

Put the files in `public/products/` and use these names, and they appear with no
code change at all:

```
public/products/ghee.jpeg
public/products/buttermilk.jpeg
public/products/curd.jpeg
public/products/paneer.jpeg
public/products/milk.jpeg
```

If your files are `.jpg`, `.png` or `.webp` instead, keep the real extension and
update the matching `image:` line in `src/data/products.js`.

Two more images are referenced for the story sections; both are optional:

```
public/products/shop.jpeg        # portrait, the counter — used on the home page
public/products/shop-wide.jpeg   # landscape, used at the top of Our Story
```

Every other product has an `image:` path ready in `src/data/products.js` waiting
for a photo. **Until a file exists, the site draws a quiet tinted panel with the
product's initial** — nothing ever renders as a broken image, so you can add
photos a few at a time.

Suggested sizes: roughly **1200 × 1500** for product shots (they are displayed
in a 4:5 frame) and **2000 × 1000** for `shop-wide.jpeg`. Save as JPEG at ~80%
quality; anything over ~400 KB per photo is larger than it needs to be.

### Your logo

Drop your artwork at `public/logo.png` and it is picked up automatically
everywhere — navbar, footer, hero. Until then the site draws an SVG recreation
of the ring-and-LD monogram, so it never looks unfinished.

`public/logo.svg` (the full mark, including the cow and *GIRISHBHAI* lockup) and
`public/favicon.svg` are also there and can be replaced directly.

### Changing a price

Each product carries a single rate. Every weight option is derived from it and
rounded to the nearest rupee, which reproduces the shop's printed price list exactly:

```js
{
  id: 'peda-kesar',
  name: 'Kesar Peda',
  type: SALE_TYPE.WEIGHT,
  pricePerKg: 600,          // ← change this one number
  ...
}
```

`600/kg` then gives 250 g ₹150 · 500 g ₹300 · 750 g ₹450 · 1 kg ₹600 · 1.5 kg ₹900 · 2 kg ₹1200,
on the card, on the product page, in the cart and in the WhatsApp message.

Three sale models are supported:

- `SALE_TYPE.WEIGHT` — sold by the kilo, with the six weight options
- `SALE_TYPE.UNIT` — sold per glass / litre / piece (`unitPrice` + `unitLabel`)
- `SALE_TYPE.ON_REQUEST` — no price shown; the customer gets a
  "Contact us for today's price" message and a WhatsApp button instead

---

## How ordering works

```
Home → Menu → Product → pick weight → Add to cart
     → Cart → Checkout → details → payment → review → WhatsApp
```

- The cart lives in React context and is saved to `localStorage`, so it survives
  navigation and a page reload.
- Checkout validates the customer's name, Indian mobile number, address, area,
  city and PIN code, and rejects keyboard-mash like `asdf`, `bruh`, `qwerty`
  or `123`.
- Payment offers **UPI** (a QR encoding the real amount, a "Pay via UPI" intent
  button, and a copyable UPI ID) or **cash**.
- The final step opens WhatsApp with the whole order written out: customer,
  address, every item with its weight, quantity and price, the total, the
  payment method and any order note.

### What the payment step does *not* do

The UPI button hands the customer's UPI app a correctly pre-filled payment
intent. **It cannot confirm that a payment actually happened** — verifying a UPI
collection needs a server talking to a payment gateway, which a front-end cannot
do. The site says so plainly on the payment screen rather than implying
otherwise, and the shop confirms payment against its own account before packing.

The payment code is isolated in `src/utils/upi.js` so a real gateway can be
added later without touching the checkout UI.

Similarly, the WhatsApp step opens WhatsApp with the message ready — **the
customer still presses Send.** No website can send a WhatsApp message on
someone's behalf.

---

## Project structure

```
public/
  products/            your photos go here
  fonts/               self-hosted Cormorant Garamond + Manrope
  logo.svg             brand mark (replaced by logo.png if you add one)
  favicon.svg
src/
  config/site.js       business details — phone, UPI, address, hours
  data/products.js     the whole catalogue and all price logic
  context/CartContext.jsx
  components/          Navbar, Footer, ProductCard, CartDrawer, CustomCursor,
                       Button, Field, WeightSelector, UpiPayment, CreamForm…
  sections/            Hero, Freshness, ProductShowcase, Story, VisitUs…
  pages/               Home, Menu, ProductDetails, Cart, Checkout, OurStory,
                       Visit, NotFound
  hooks/               smooth scroll, reveals, parallax, magnetic buttons,
                       media queries, reduced motion, page meta
  utils/               whatsapp.js, upi.js, validation.js, format.js
  styles/fonts.css     @font-face declarations for the local fonts
  index.css            design tokens and base styles
```

---

## Built with

React 19 · Vite 8 · Tailwind CSS v4 · GSAP + ScrollTrigger · Lenis · React Router 7 ·
lucide-react · qrcode

**Three deliberate deviations from a default stack:**

- **No Three.js / React Three Fiber.** The hero's floating cream form is a
  hand-written WebGL shader (`src/components/CreamForm.jsx`) — a ray marched
  against a noise-displaced sphere. It is **7 kB instead of the ~525 kB** a
  general-purpose 3D engine costs for a single mesh, and R3F's optional Expo
  peers also conflict with React 19. It is lazy-loaded at idle, never mounted on
  phones or under reduced motion, pauses off-screen, and falls back to a static
  gradient if WebGL is unavailable.
- **No Framer Motion.** GSAP already drives every animation; a second animation
  runtime would add weight without adding capability.
- **Fonts are self-hosted, not loaded from the Google Fonts CDN.** Cormorant
  Garamond and Manrope live in `public/fonts` as variable fonts — one file per
  style covers every weight, 200 kB for both families including italics. That
  removes a render-blocking request to a third party, keeps the site working on
  networks that block Google, and sends nothing about your customers to another
  host. Both are SIL Open Font License 1.1 (`public/fonts/OFL.txt`).
  Declarations are in `src/styles/fonts.css`.

---

## Performance

Initial JS is roughly **112 kB gzipped** (React + router + GSAP + app), with each
route, the QR encoder and the WebGL hero split into their own chunks and fetched
only when needed. **The site makes no third-party requests at all** — fonts are
self-hosted, and the only external call anywhere is the Google Maps iframe on
Visit Us, which is lazy-loaded below the fold.

- Images are lazy-loaded with `sizes` hints and async decoding
- Animations run on GPU-friendly transforms and opacity only
- Scroll is driven by GSAP's ticker, not a scroll listener
- The WebGL hero renders below CSS resolution, pauses off-screen and when the
  tab is hidden

## Accessibility

Semantic landmarks, one `<h1>` per page, a skip link, visible gold focus rings on
every interactive control, a focus-trapped and `inert`-aware cart drawer, labelled
form fields with `aria-invalid` + `aria-describedby` error messages, a proper
radiogroup for weight selection, and full `prefers-reduced-motion` support — which
disables smooth scrolling, the custom cursor, the WebGL hero and every reveal
animation rather than merely shortening them.

---

## Before going live

1. Add your product photos to `public/products/` and your `logo.png`.
2. Replace `https://laxmidairy.example` with the real domain in
   `src/config/site.js` (`SITE_URL`) and in `index.html` (canonical link, Open
   Graph URLs, and the `LocalBusiness` structured data).
3. Add a `public/og-image.jpg` (1200 × 630) for link previews.
4. Confirm opening hours in `src/config/site.js` → `HOURS`; it currently says
   only "Open daily", which is all we could state truthfully.
5. Deploy `dist/` to any static host. The site uses client-side routing, so
   configure the host to rewrite unknown paths to `/index.html`.
