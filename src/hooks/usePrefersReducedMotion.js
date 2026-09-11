import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

/** One MediaQueryList for the whole app — getSnapshot runs on every render. */
let mql = null
const getMql = () => {
  if (typeof window === 'undefined' || !window.matchMedia) return null
  if (!mql) mql = window.matchMedia(QUERY)
  return mql
}

function subscribe(callback) {
  const list = getMql()
  if (!list) return () => {}
  list.addEventListener('change', callback)
  return () => list.removeEventListener('change', callback)
}

const getSnapshot = () => getMql()?.matches ?? false

/** True when the visitor has asked their OS to reduce motion. */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
