import { ArrowRight } from 'lucide-react'
import Button from '../components/Button.jsx'
import { usePageMeta } from '../hooks/usePageMeta.js'

export default function NotFound() {
  usePageMeta({ title: 'Page not found | Laxmi Dairy', description: 'This page does not exist.' })

  return (
    <div className="flex min-h-[100svh] items-center bg-ivory-100 pt-28 pb-20">
      <div className="container-x text-center">
        <p className="eyebrow text-gold-700">Error 404</p>
        <h1 className="fluid-display mt-5 font-display font-medium text-emerald-950">
          Not on the menu.
        </h1>
        <p className="mx-auto mt-6 max-w-md font-sans text-[0.95rem] leading-relaxed text-ink-soft">
          The page you were looking for is not here. The counter, however, is exactly where you
          left it.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button to="/menu" variant="primary" size="lg" icon={ArrowRight}>
            Go to the menu
          </Button>
          <Button to="/" variant="outline" size="lg">
            Back home
          </Button>
        </div>
      </div>
    </div>
  )
}
