import { useEffect, useRef, useState } from 'react'
import { cx } from '../utils/format.js'
import { assetUrl } from '../utils/asset.js'

/**
 * Category-tinted fallback used until the shop's own photography is dropped
 * into `public/products/`. It renders a quiet tonal panel with the product's
 * initial rather than a broken-image icon, so an empty folder still looks
 * deliberate.
 */
const TONES = {
  shrikhand: ['#F3E7CE', '#E3CFA4'],
  peda: ['#EFE0C6', '#DCC194'],
  matho: ['#F2EADA', '#DDCDB2'],
  rabdi: ['#EDE6D4', '#D6C6A2'],
  mithai: ['#F4EAD3', '#E0CB9E'],
  dairy: ['#F1F4EE', '#D3DFD1'],
  counter: ['#F3EEE2', '#DACEB6'],
  default: ['#F2EDE1', '#DCD0B8'],
}

function Fallback({ label, category, className }) {
  const [from, to] = TONES[category] ?? TONES.default
  const initial = (label ?? '?').trim().charAt(0).toUpperCase()

  return (
    <div
      className={cx('flex h-full w-full items-center justify-center', className)}
      style={{ background: `radial-gradient(120% 100% at 30% 20%, ${from} 0%, ${to} 100%)` }}
      aria-hidden="true"
    >
      <span
        className="font-display select-none text-emerald-800/25"
        style={{ fontSize: 'clamp(3rem, 16cqw, 9rem)', lineHeight: 1 }}
      >
        {initial}
      </span>
    </div>
  )
}

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
  label,
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
      {status !== 'loaded' && (
        <div className="absolute inset-0">
          <Fallback label={label ?? alt} category={category} />
        </div>
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
