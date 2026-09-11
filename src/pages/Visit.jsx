import { ArrowUpRight, MessageCircle, Phone } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import VisitUs from '../sections/VisitUs.jsx'
import Button from '../components/Button.jsx'
import { Reveal } from '../components/Reveal.jsx'
import { usePageMeta } from '../hooks/usePageMeta.js'
import { ADDRESS, CONTACT } from '../config/site.js'
import { enquiryUrl } from '../utils/whatsapp.js'

export default function Visit() {
  usePageMeta({
    title: 'Visit Us | Laxmi Dairy, Bhesan Gam, Surat',
    description: `Find Laxmi Dairy at ${ADDRESS.oneLine}. Get directions, call the shop, or order on WhatsApp.`,
    path: '/visit-us',
  })

  const cards = [
    {
      title: 'Call the shop',
      body: 'The quickest way to ask about today’s rates, stock or a large order.',
      action: { label: CONTACT.phoneDisplay, href: `tel:${CONTACT.phoneDial}`, icon: Phone },
    },
    {
      title: 'Order on WhatsApp',
      body: 'Send us your order and we will confirm timing and any delivery charge.',
      action: { label: 'Open WhatsApp', href: enquiryUrl(), icon: MessageCircle },
    },
    {
      title: 'Get directions',
      body: 'We are inside Siddhivinayak Elements, Shop No. J-2, in Bhesan Gam.',
      action: { label: 'Open in Maps', href: ADDRESS.mapsUrl, icon: ArrowUpRight },
    },
  ]

  return (
    <>
      <PageHeader
        eyebrow="Visit us"
        titleLines={['Come to', 'the counter.']}
        intro="We are in Bhesan Gam, Dahin Nagar. Walk in for the day's trays, or send your order ahead and collect it ready-packed."
      />

      <section className="bg-ivory-100 pb-16 sm:pb-20" aria-label="Ways to reach us">
        <div className="container-x">
          <Reveal className="grid gap-px border hairline bg-emerald-800/10 sm:grid-cols-3" y={24} stagger={0.08}>
            {cards.map((card) => (
              <div data-reveal key={card.title} className="flex flex-col bg-ivory-50 p-6 sm:p-8">
                <h2 className="font-display text-[1.5rem] leading-tight font-medium text-emerald-950 sm:text-[1.7rem]">
                  {card.title}
                </h2>
                <p className="mt-3 flex-1 font-sans text-[0.86rem] leading-relaxed text-ink-muted">
                  {card.body}
                </p>
                <Button
                  href={card.action.href}
                  variant="outline"
                  size="sm"
                  icon={card.action.icon}
                  iconPosition="left"
                  className="mt-6 self-start"
                  magnetic={false}
                >
                  {card.action.label}
                </Button>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <VisitUs />
    </>
  )
}
