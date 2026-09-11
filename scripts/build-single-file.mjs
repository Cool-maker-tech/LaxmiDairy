/**
 * Folds a production build into ONE self-contained .html file.
 *
 * Run via `npm run build:single`. The result needs no web server, no build
 * step and no network: open it off a disk, email it, or drop it on any host.
 *
 * What gets inlined:
 *   • the JavaScript bundle (built with inlineDynamicImports, so no chunks)
 *   • the stylesheet
 *   • both variable fonts, as base64 data URIs inside that stylesheet
 *
 * What changes compared to the normal build:
 *   • routing moves to the URL hash (#/menu), because clean paths need a host
 *     that rewrites unknown URLs — see src/main.jsx
 *   • it is one large file rather than cacheable chunks, so the normal build
 *     in dist/ is still the better thing to deploy to a real host
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const DIST = join(ROOT, 'dist')
const OUT = join(ROOT, 'laxmi-dairy.html')

const kb = (n) => `${(n / 1024).toFixed(1)} kB`

if (!existsSync(join(DIST, 'index.html'))) {
  console.error('No build found. Run the build first (npm run build:single does both).')
  process.exit(1)
}

let html = readFileSync(join(DIST, 'index.html'), 'utf8')

/* ---------------------------------------------------------------- fonts -- */
/** Replace url('/fonts/x.woff2') with a base64 data URI. */
function inlineFonts(css) {
  return css.replace(/url\(["']?\/fonts\/([^"')]+)["']?\)/g, (match, file) => {
    const path = join(ROOT, 'public', 'fonts', file)
    if (!existsSync(path)) {
      console.warn(`  ! font not found, left as a URL: ${file}`)
      return match
    }
    const b64 = readFileSync(path).toString('base64')
    return `url(data:font/woff2;base64,${b64}) format('woff2')`
  })
}

/* ------------------------------------------------------------ stylesheet -- */
let cssBytes = 0
html = html.replace(
  /<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/g,
  (match, href) => {
    const path = join(DIST, href.replace(/^\//, ''))
    if (!existsSync(path)) return match
    const css = inlineFonts(readFileSync(path, 'utf8'))
    cssBytes += Buffer.byteLength(css)
    return `<style>\n${css}\n</style>`
  },
)

/* ------------------------------------------------------------------ js --- */
let jsBytes = 0
html = html.replace(
  /<script[^>]*type=["']module["'][^>]*src=["']([^"']+)["'][^>]*><\/script>/g,
  (match, src) => {
    const path = join(DIST, src.replace(/^\//, ''))
    if (!existsSync(path)) return match
    const js = readFileSync(path, 'utf8')
    jsBytes += Buffer.byteLength(js)
    // </script> inside a string literal would end the tag early.
    return `<script type="module">\n${js.replace(/<\/script>/gi, '<\\/script>')}\n</script>`
  },
)

/* --------------------------------------------------------------- tidy up -- */
// Preloads and prefetches point at files that no longer exist separately.
html = html
  .replace(/<link[^>]*rel=["'](?:modulepreload|preload|prefetch)["'][^>]*>\s*/g, '')
  .replace(/<link[^>]*rel=["']manifest["'][^>]*>\s*/g, '')

// The favicon is a small SVG; inline it so the tab icon works offline too.
const faviconPath = join(ROOT, 'public', 'favicon.svg')
if (existsSync(faviconPath)) {
  const b64 = readFileSync(faviconPath).toString('base64')
  html = html.replace(
    /href=["']\/favicon\.svg["']/g,
    `href="data:image/svg+xml;base64,${b64}"`,
  )
}

// The brand mark falls back to an inline SVG component when logo.png is
// absent, but the apple-touch-icon would still 404 from a file:// page.
html = html.replace(/<link[^>]*rel=["']apple-touch-icon["'][^>]*>\s*/g, '')

const banner = `<!--
  Laxmi Dairy — single-file build.

  Everything (JavaScript, styles, both fonts) is inlined here, so this file
  works with no server and no internet connection. Open it in any browser.

  Routing uses the URL hash (#/menu, #/cart) for the same reason.

  This file is GENERATED — do not edit it by hand. Change the source and run
  \`npm run build:single\` again. For a real web host, deploy dist/ instead:
  it splits into cacheable chunks and uses clean URLs.
-->
`
html = html.replace('<!doctype html>', `<!doctype html>\n${banner}`)

writeFileSync(OUT, html)

const total = Buffer.byteLength(html)
console.log('\nSingle-file build written to laxmi-dairy.html')
console.log(`  JavaScript  ${kb(jsBytes)}`)
console.log(`  CSS + fonts ${kb(cssBytes)}`)
console.log(`  TOTAL       ${kb(total)}`)
console.log('\nOpen it directly in a browser — no server needed.\n')
