import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import CustomCursor from './components/CustomCursor.jsx'
import ScrollProgress from './components/ScrollProgress.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import PageTransition from './components/PageTransition.jsx'
import Home from './pages/Home.jsx'
import { useSmoothScroll } from './hooks/useSmoothScroll.js'

/* Home ships in the main bundle; every other route is fetched on demand. */
const Menu = lazy(() => import('./pages/Menu.jsx'))
const ProductDetails = lazy(() => import('./pages/ProductDetails.jsx'))
const Cart = lazy(() => import('./pages/Cart.jsx'))
const Checkout = lazy(() => import('./pages/Checkout.jsx'))
const OurStory = lazy(() => import('./pages/OurStory.jsx'))
const Visit = lazy(() => import('./pages/Visit.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

/** Holds the viewport height steady while a lazy route resolves. */
function RouteFallback() {
  return <div className="min-h-[100svh] bg-ivory-100" aria-busy="true" />
}

export default function App() {
  useSmoothScroll()

  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <CartDrawer />

      <main id="main">
        <PageTransition>
          {(location) => (
            <>
              <ScrollToTop location={location} />
              <Suspense fallback={<RouteFallback />}>
                <Routes location={location}>
                  <Route path="/" element={<Home />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/menu/:slug" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/our-story" element={<OurStory />} />
                  <Route path="/visit-us" element={<Visit />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </>
          )}
        </PageTransition>
      </main>

      <Footer />

      {/* Film grain over the whole page. Decorative, and off for reduced motion. */}
      <div className="grain-overlay" aria-hidden="true" />
    </>
  )
}
