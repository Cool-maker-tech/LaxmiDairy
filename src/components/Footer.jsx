import { Link } from 'react-router-dom'
import { ArrowUpRight, MapPin, Phone } from 'lucide-react'
import Logo from './Logo.jsx'
import { ADDRESS, BUSINESS, CONTACT, NAV_LINKS } from '../config/site.js'
import { enquiryUrl } from '../utils/whatsapp.js'
import { CATEGORIES } from '../data/products.js'
import { Reveal } from './Reveal.jsx'

const year = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-emerald-950 text-ivory-200">
      <div className="container-x pt-16 pb-8 sm:pt-20 lg:pt-24">
        <Reveal className="grid gap-12 lg:grid-cols-12 lg:gap-10" y={20} stagger={0.06}>
          {/* ------------------------------------------------------ brand -- */}
          <div data-reveal className="lg:col-span-4">
            <Link to="/" aria-label="Laxmi Dairy — home" className="inline-block text-ivory-100">
              <Logo />
            </Link>
            <p className="mt-5 max-w-xs font-sans text-sm leading-relaxed text-ivory-200/55">
              {BUSINESS.shortDescription}
            </p>
            <p className="mt-5 font-display text-2xl text-gold-300 italic">
              Rooted in everyday freshness.
            </p>
          </div>

          {/* ------------------------------------------------------ links -- */}
          <nav aria-label="Footer" data-reveal className="lg:col-span-2">
            <h2 className="eyebrow text-ivory-200/35">Explore</h2>
            <ul className="mt-5 flex flex-col gap-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    data-cursor="link"
                    className="font-sans text-sm text-ivory-200/70 transition-colors duration-300 hover:text-gold-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/cart"
                  data-cursor="link"
                  className="font-sans text-sm text-ivory-200/70 transition-colors duration-300 hover:text-gold-300"
                >
                  Cart
                </Link>
              </li>
            </ul>
          </nav>

          {/* -------------------------------------------------- categories -- */}
          <nav aria-label="Menu categories" data-reveal className="lg:col-span-3">
            <h2 className="eyebrow text-ivory-200/35">From the counter</h2>
            <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5 lg:grid-cols-1">
              {CATEGORIES.filter((c) => c.id !== 'counter').map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/menu?category=${category.id}`}
                    data-cursor="link"
                    className="font-sans text-sm text-ivory-200/70 transition-colors duration-300 hover:text-gold-300"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ---------------------------------------------------- contact -- */}
          <div data-reveal className="lg:col-span-3">
            <h2 className="eyebrow text-ivory-200/35">Visit &amp; order</h2>

            <address className="mt-5 not-italic">
              <a
                href={ADDRESS.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="link"
                className="group flex gap-3 font-sans text-sm leading-relaxed text-ivory-200/70 transition-colors duration-300 hover:text-gold-300"
              >
                <MapPin size={15} strokeWidth={1.5} className="mt-1 shrink-0" aria-hidden="true" />
                <span>
                  {ADDRESS.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                  <span className="block">
                    {ADDRESS.city}, {ADDRESS.state} – {ADDRESS.pincode}
                  </span>
                  <span className="mt-1.5 inline-flex items-center gap-1 text-gold-300/80">
                    Open in Google Maps
                    <ArrowUpRight
                      size={13}
                      strokeWidth={1.75}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </span>
              </a>

              <a
                href={`tel:${CONTACT.phoneDial}`}
                data-cursor="link"
                className="mt-4 flex items-center gap-3 font-sans text-sm text-ivory-200/70 transition-colors duration-300 hover:text-gold-300"
              >
                <Phone size={15} strokeWidth={1.5} className="shrink-0" aria-hidden="true" />
                {CONTACT.phoneDisplay}
              </a>
            </address>

            <a
              href={enquiryUrl()}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="button"
              className="mt-6 inline-flex items-center gap-2.5 rounded-full bg-gold-500 px-6 py-3 font-sans text-[0.72rem] font-semibold tracking-[0.14em] text-emerald-950 uppercase transition-colors duration-400 hover:bg-gold-400"
            >
              Order on WhatsApp
              <ArrowUpRight size={15} strokeWidth={2} aria-hidden="true" />
            </a>
          </div>
        </Reveal>

        {/* ------------------------------------------------------ baseline -- */}
        <div className="mt-14 flex flex-col gap-4 border-t border-ivory-100/10 pt-7 sm:mt-16 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-xs text-ivory-200/40">
            © {year} {BUSINESS.name}, Surat. All rights reserved.
          </p>
          <p className="font-sans text-xs text-ivory-200/40">
            Proprietor: {BUSINESS.proprietor} · Prices are subject to change at the counter.
          </p>
        </div>
      </div>

      {/* Oversized wordmark, cropped by the viewport edge. */}
      <div aria-hidden="true" className="pointer-events-none select-none overflow-hidden">
        <p className="-mb-[0.18em] translate-y-[0.12em] text-center font-display leading-none font-semibold whitespace-nowrap text-ivory-100/[0.055]" style={{ fontSize: 'clamp(4rem, 19vw, 18rem)' }}>
          Laxmi Dairy
        </p>
      </div>
    </footer>
  )
}
