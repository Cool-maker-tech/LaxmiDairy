import Hero from '../sections/Hero.jsx'
import Freshness from '../sections/Freshness.jsx'
import ProductShowcase from '../sections/ProductShowcase.jsx'
import Signatures from '../sections/Signatures.jsx'
import Story from '../sections/Story.jsx'
import VisitUs from '../sections/VisitUs.jsx'
import Marquee from '../components/Marquee.jsx'
import { usePageMeta } from '../hooks/usePageMeta.js'

const MARQUEE_ITEMS = [
  'Shrikhand',
  'Peda',
  'Matho',
  'Rabdi',
  'Kaju Katli',
  'Paneer',
  'Ghee',
  'Buttermilk',
]

export default function Home() {
  usePageMeta({
    title: 'Laxmi Dairy | Fresh Dairy & Sweets in Surat',
    description:
      'Laxmi Dairy in Surat offers fresh dairy products, traditional Indian sweets, shrikhand, peda, matho, rabdi, milk, paneer and more.',
    path: '/',
  })

  return (
    <>
      <Hero />
      <Marquee items={MARQUEE_ITEMS} />
      <Freshness />
      <ProductShowcase />
      <Signatures />
      <Story />
      <VisitUs />
    </>
  )
}
