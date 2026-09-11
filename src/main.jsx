import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import './index.css'

/*
 * The normal build uses clean paths (/menu, /cart) and needs a host that
 * rewrites unknown paths to index.html.
 *
 * `npm run build:single` produces one self-contained .html file that has to
 * work with no server at all — opened straight off a disk or a USB stick — so
 * it routes on the hash (#/menu) instead, which needs nothing from the host.
 */
const Router = import.meta.env.VITE_SINGLE_FILE ? HashRouter : BrowserRouter

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <CartProvider>
        <App />
      </CartProvider>
    </Router>
  </StrictMode>,
)
