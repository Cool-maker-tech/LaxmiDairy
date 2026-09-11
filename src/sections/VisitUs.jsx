import { ArrowUpRight, Clock, MapPin, MessageCircle, Phone } from 'lucide-react'
import Button from '../components/Button.jsx'
import { Eyebrow, Reveal, RevealText } from '../components/Reveal.jsx'
import { ADDRESS, CONTACT, HOURS } from '../config/site.js'
import { enquiryUrl } from '../utils/whatsapp.js'

/**
 * Visit Us — address, directions and the two ways to reach the shop.
 * The map is an embedded iframe, lazy-loaded so it costs nothing above the fold.
 */
export default function VisitUs({ withMap = true }) {
  const mapQuery = encodeURIComponent(
    `Laxmi Dairy, Siddhivinayak Elements, Bhesan Gam, ${ADDRESS.city}, ${ADDRESS.state} ${ADDRESS.pincode}`,
  )

  return (
    <section className="relative bg-emerald-950 py-20 text-ivory-100 sm:py-28 lg:py-32" aria-labelledby="visit-heading">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          {/* --------------------------------------------------- details --- */}
          <div className="lg:col-span-5">
            <Reveal y={16}>
              <span data-reveal className="block">
                <Eyebrow tone="light">Visit us</Eyebrow>
              </span>
            </Reveal>

            <RevealText
              as="h2"
              id="visit-heading"
              className="fluid-h2 mt-5 font-display font-medium"
              stagger={0.1}
            >
              <span>Come to</span>
              <span>
                the <em className="text-gold-300 not-italic">counter.</em>
              </span>
            </RevealText>

            <Reveal y={22} delay={0.1} stagger={0.08} className="mt-9">
              <address data-reveal className="not-italic">
                <p className="eyebrow flex items-center gap-2.5 text-gold-300/70">
                  <MapPin size={14} strokeWidth={1.5} aria-hidden="true" />
                  Address
                </p>
                <p className="mt-3 font-display text-[1.6rem] leading-[1.35] text-ivory-100 sm:text-[1.85rem]">
                  {ADDRESS.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                  <span className="block">
                    {ADDRESS.city}, {ADDRESS.state} – {ADDRESS.pincode}
                  </span>
                </p>
              </address>

              <div data-reveal className="mt-8 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="eyebrow flex items-center gap-2.5 text-gold-300/70">
                    <Phone size={14} strokeWidth={1.5} aria-hidden="true" />
                    Call
                  </p>
                  <a
                    href={`tel:${CONTACT.phoneDial}`}
                    data-cursor="link"
                    className="mt-2.5 block font-sans text-[1.05rem] text-ivory-100 transition-colors hover:text-gold-300"
                  >
                    {CONTACT.phoneDisplay}
                  </a>
                </div>

                <div>
                  <p className="eyebrow flex items-center gap-2.5 text-gold-300/70">
                    <Clock size={14} strokeWidth={1.5} aria-hidden="true" />
                    Hours
                  </p>
                  {HOURS.map((h) => (
                    <p key={h.days} className="mt-2.5 font-sans text-[0.92rem] text-ivory-200/70">
                      {h.days}
                      <span className="block text-ivory-200/45">{h.time}</span>
                    </p>
                  ))}
                  <p className="mt-1.5 font-sans text-[0.72rem] text-ivory-200/35">
                    Please call ahead for large or festival orders.
                  </p>
                </div>
              </div>

              <div data-reveal className="mt-9 flex flex-wrap gap-3">
                <Button href={ADDRESS.mapsUrl} variant="gold" size="md" icon={ArrowUpRight}>
                  Get directions
                </Button>
                <Button
                  href={enquiryUrl()}
                  variant="outlineLight"
                  size="md"
                  icon={MessageCircle}
                  iconPosition="left"
                >
                  Order on WhatsApp
                </Button>
              </div>
            </Reveal>
          </div>

          {/* ------------------------------------------------------- map ---- */}
          {withMap && (
            <Reveal className="lg:col-span-7" y={28} delay={0.1}>
              <div data-reveal className="relative">
                <div className="overflow-hidden border border-ivory-100/10 bg-emerald-900">
                  <iframe
                    title="Map showing Laxmi Dairy in Bhesan Gam, Surat"
                    src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-[320px] w-full border-0 grayscale-[0.35] contrast-[1.05] sm:h-[420px] lg:h-[540px]"
                  />
                </div>

                <a
                  href={ADDRESS.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="link"
                  className="group mt-4 inline-flex items-center gap-2.5 font-sans text-[0.74rem] tracking-[0.12em] text-ivory-200/50 uppercase transition-colors hover:text-gold-300"
                >
                  Open in Google Maps
                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.75}
                    className="transition-transform duration-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}
