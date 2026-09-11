import { useEffect } from 'react'
import { SITE_URL } from '../config/site.js'

/** Set or create a `<meta>` tag by name or property. */
function setMeta(attr, key, content) {
  if (!content) return
  let tag = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

/**
 * Per-route title, description, canonical URL and Open Graph tags.
 * Kept deliberately small — a full head manager is more machinery than a
 * seven-page site needs.
 */
export function usePageMeta({ title, description, path, image } = {}) {
  useEffect(() => {
    if (title) document.title = title

    if (description) {
      setMeta('name', 'description', description)
      setMeta('property', 'og:description', description)
      setMeta('name', 'twitter:description', description)
    }

    if (title) {
      setMeta('property', 'og:title', title)
      setMeta('name', 'twitter:title', title)
    }

    if (path) {
      const url = `${SITE_URL}${path}`
      setMeta('property', 'og:url', url)

      let canonical = document.head.querySelector('link[rel="canonical"]')
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.setAttribute('rel', 'canonical')
        document.head.appendChild(canonical)
      }
      canonical.setAttribute('href', url)
    }

    if (image) {
      setMeta('property', 'og:image', image.startsWith('http') ? image : `${SITE_URL}${image}`)
    }
  }, [title, description, path, image])
}
