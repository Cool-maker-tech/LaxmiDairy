import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { ShoppingBag } from 'lucide-react'
import Logo from './Logo.jsx'
import { useCart } from '../context/CartContext.jsx'
import { NAV_LINKS, CONTACT } from '../config/site.js'
import { setScrollLocked } from '../hooks/useSmoothScroll.js'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.js'
import { cx } from '../utils/format.js'

/**
 * The navbar starts transparent over the hero and settles into a solid,
 * blurred bar once the page has scrolled. On routes with no hero it starts
 * solid immediately.
 */
export default function Navbar() {
  const { count, openDrawer, lastAddedAt } = useCart()
  const location = useLocation()
  const reduced = usePrefersReducedMotion()

  const hasTransparentHero = location.pathname === '/'
  const [scrolled, setScrolled] = useState(!hasTransparentHero)
  const [menuOpen, setMenuOpen] = useState(false)

  const badgeRef = useRef(null)
  const panelRef = useRef(null)
  const barRef = useRef(null)

  /* -------------------------------------------------------- scroll state -- */
  useEffect(() => {
    if (!hasTransparentHero) {
      setScrolled(true)
      return undefined
    }
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [hasTransparentHero, location.pathname])

  /* ------------------------------------------------- close menu on route -- */
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  /* ------------------------------------------------------ mobile panel ---- */
  useEffect(() => {
    setScrollLocked(menuOpen)

    const panel = panelRef.current
    if (!panel) return undefined

    const items = panel.querySelectorAll('[data-menu-item]')
    if (menuOpen && !reduced) {
      gsap.fromTo(
        items,
        { y: 34, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.75, stagger: 0.06, ease: 'expo.out', delay: 0.12 },
      )
    } else if (!reduced) {
      gsap.set(items, { clearProps: 'all' })
    }

    const onKey = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen, reduced])

  useEffect(() => () => setScrollLocked(false), [])

  /* -------------------------------------------------------- badge pulse --- */
  useEffect(() => {
    if (!lastAddedAt || !badgeRef.current || reduced) return
    gsap.fromTo(
      badgeRef.current,
      { scale: 1 },
      { scale: 1.4, duration: 0.22, yoyo: true, repeat: 1, ease: 'power2.out' },
    )
  }, [lastAddedAt, reduced])

  // While the mobile panel is open the bar sits on emerald, so it goes
  // transparent with light type rather than staying a pale strip on top of it.
  const light = menuOpen || (hasTransparentHero && !scrolled)

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-emerald-800 focus:px-5 focus:py-3 focus:font-sans focus:text-sm focus:text-ivory-100"
      >
        Skip to content
      </a>

      <header
        ref={barRef}
        className={cx(
          'fixed inset-x-0 top-0 z-[80] transition-ui duration-500',
          scrolled && !menuOpen
            ? 'border-b border-emerald-800/10 bg-ivory-100/85 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <nav
          aria-label="Primary"
          className={cx(
            'container-x flex items-center justify-between transition-[padding] duration-500',
            scrolled ? 'py-3' : 'py-5 sm:py-6',
          )}
        >
          <Link
            to="/"
            aria-label="Laxmi Dairy — home"
            data-cursor="link"
            className={cx(
              'transition-colors duration-500',
              light ? 'text-ivory-100' : 'text-emerald-950',
            )}
          >
            <Logo />
          </Link>

          {/* ----------------------------------------------- desktop links -- */}
          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  data-cursor="link"
                  className={({ isActive }) =>
                    cx(
                      'group relative inline-flex px-4 py-2 font-sans text-[0.78rem] font-medium tracking-[0.1em] uppercase transition-colors duration-400',
                      light ? 'text-ivory-100/85 hover:text-ivory-100' : 'text-ink-soft hover:text-emerald-900',
                      isActive && (light ? 'text-ivory-100' : 'text-emerald-900'),
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      <span
                        aria-hidden="true"
                        className={cx(
                          'absolute inset-x-4 bottom-1 h-px origin-left transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                          light ? 'bg-gold-300' : 'bg-gold-600',
                          isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                        )}
                      />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* ----------------------------------------------------- actions -- */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={`tel:${CONTACT.phoneDial}`}
              data-cursor="link"
              className={cx(
                'hidden font-sans text-[0.78rem] font-medium tracking-[0.06em] transition-colors duration-400 xl:inline-block',
                light ? 'text-ivory-100/85 hover:text-ivory-100' : 'text-ink-soft hover:text-emerald-900',
              )}
            >
              {CONTACT.phoneDisplay}
            </a>

            <button
              type="button"
              onClick={openDrawer}
              data-cursor="button"
              aria-label={`Open cart, ${count} ${count === 1 ? 'item' : 'items'}`}
              className={cx(
                'relative flex h-10 w-10 items-center justify-center rounded-full border transition-ui duration-400 sm:h-11 sm:w-11',
                light
                  ? 'border-ivory-100/30 text-ivory-100 hover:bg-ivory-100 hover:text-emerald-900'
                  : 'border-emerald-800/18 text-emerald-900 hover:border-emerald-800 hover:bg-emerald-800 hover:text-ivory-100',
              )}
            >
              <ShoppingBag size={17} strokeWidth={1.6} aria-hidden="true" />
              {count > 0 && (
                <span
                  ref={badgeRef}
                  aria-hidden="true"
                  className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold-500 px-1 font-sans text-[0.6rem] font-bold text-emerald-950 tabular-nums"
                >
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </button>

            {/* --------------------------------------------- hamburger ----- */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              data-cursor="button"
              className={cx(
                'relative flex h-10 w-10 items-center justify-center rounded-full border transition-ui duration-400 sm:h-11 sm:w-11 lg:hidden',
                light
                  ? 'border-ivory-100/30 text-ivory-100'
                  : 'border-emerald-800/18 text-emerald-900',
              )}
            >
              <span className="relative block h-3 w-[18px]" aria-hidden="true">
                <span
                  className={cx(
                    'absolute left-0 block h-[1.5px] w-full bg-current transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]',
                    menuOpen ? 'top-[5px] rotate-45' : 'top-0',
                  )}
                />
                <span
                  className={cx(
                    'absolute left-0 block h-[1.5px] bg-current transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]',
                    menuOpen ? 'top-[5px] w-full -rotate-45' : 'top-[11px] w-3/5',
                  )}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* --------------------------------------------------- mobile panel -- */}
      <div
        id="mobile-menu"
        ref={panelRef}
        aria-hidden={!menuOpen}
        {...(menuOpen ? {} : { inert: true })}
        className={cx(
          'fixed inset-0 z-[78] flex flex-col bg-emerald-900 text-ivory-100 transition-[clip-path,opacity] duration-[700ms] ease-[cubic-bezier(0.76,0,0.24,1)] lg:hidden',
          menuOpen
            ? 'pointer-events-auto opacity-100 [clip-path:inset(0_0_0%_0)]'
            : 'pointer-events-none opacity-0 [clip-path:inset(0_0_100%_0)]',
        )}
      >
        <div className="flex flex-1 flex-col justify-center px-6 pt-24 pb-10 sm:px-10">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link, i) => (
              <li key={link.to} data-menu-item>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    cx(
                      'flex items-baseline gap-4 border-b border-ivory-100/10 py-4 font-display text-[2.6rem] leading-none font-medium transition-colors duration-300 sm:text-[3.4rem]',
                      isActive ? 'text-gold-300' : 'text-ivory-100',
                    )
                  }
                >
                  <span className="font-sans text-[0.6rem] tracking-[0.2em] text-ivory-100/40">
                    0{i + 1}
                  </span>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div data-menu-item className="mt-10 flex flex-col gap-3">
            <Link
              to="/cart"
              className="flex items-center justify-between rounded-full border border-ivory-100/25 px-6 py-4 font-sans text-[0.78rem] font-semibold tracking-[0.14em] uppercase"
            >
              View cart
              <span className="tabular-nums">
                {count} {count === 1 ? 'item' : 'items'}
              </span>
            </Link>
            <a
              href={`tel:${CONTACT.phoneDial}`}
              className="flex items-center justify-between rounded-full bg-ivory-100 px-6 py-4 font-sans text-[0.78rem] font-semibold tracking-[0.14em] text-emerald-900 uppercase"
            >
              Call the shop
              <span>{CONTACT.phoneDisplay}</span>
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
