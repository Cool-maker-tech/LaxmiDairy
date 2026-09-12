import { useEffect, useRef, useState } from 'react'
import { cx } from '../utils/format.js'
import { assetUrl } from '../utils/asset.js'
import ProductArt from './ProductArt.jsx'

/**
 * Image with a graceful fallback, native lazy-loading and async decoding.
 *
 * @param {string} src      e.g. '/products/ghee.jpeg'
 * @param {string} alt      required for accessibility
 * @param {string} ratio    Tailwind aspect class, e.g. 'aspect-[4/5]'
 */
export default function SmartImage({
  src,
  alt,
  category,
  art,
  seed,
  tint,
  ratio = 'aspect-[4/5]',
  className,
  imgClassName,
  priority = false,
  sizes,
}) {
  const [status, setStatus] = useState('loading')
  const imgRef = useRef(null)
  const resolved = assetUrl(src)

  useEffect(() => {
    setStatus(src ? 'loading' : 'error')
  }, [src])

  // A cached image can finish before React attaches onLoad.
  useEffect(() => {
    const node = imgRef.current
    if (node?.complete && node.naturalWidth > 0) setStatus('loaded')
  }, [src])

  return (
    <div
      className={cx('relative overflow-hidden bg-ivory-200', ratio, className)}
      style={{ containerType: 'inline-size' }}
    >
      {/* Shown until the shop's own photograph loads — and left in place for
          good if there isn't one yet. See ProductArt for why it is drawn
          rather than left as a blank tile. */}
      {status !== 'loaded' && (
        <ProductArt
          kind={art}
          category={category}
          seed={seed}
          tint={tint}
          className="absolute inset-0 h-full w-full"
        />
      )}

      {resolved && status !== 'error' && (
        <img
          ref={imgRef}
          src={resolved}
          alt={alt}
          sizes={sizes}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={cx(
            'absolute inset-0 h-full w-full object-cover transition-opacity duration-700',
            status === 'loaded' ? 'opacity-100' : 'opacity-0',
            imgClassName,
          )}
        />
      )}
    </div>
  )
}
