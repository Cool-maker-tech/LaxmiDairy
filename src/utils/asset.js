/**
 * A page opened straight off a disk (file://) has no site root, so an absolute
 * path like "/products/ghee.jpeg" resolves to the root of the filesystem and
 * never loads. Make such paths relative to the page instead, so dropping a
 * `products/` folder next to the HTML file simply works.
 *
 * On a real web host nothing changes — absolute paths are returned untouched.
 */
export function assetUrl(path) {
  if (!path || typeof path !== 'string') return path
  if (!path.startsWith('/')) return path
  if (typeof window === 'undefined') return path
  return window.location.protocol === 'file:' ? path.slice(1) : path
}
