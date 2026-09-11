import { useSyncExternalStore } from 'react'

const cache = new Map()

function getMql(query) {
  if (typeof window === 'undefined' || !window.matchMedia) return null
  if (!cache.has(query)) cache.set(query, window.matchMedia(query))
  return cache.get(query)
}

export function useMediaQuery(query, serverValue = false) {
  return useSyncExternalStore(
    (cb) => {
      const mql = getMql(query)
      if (!mql) return () => {}
      mql.addEventListener('change', cb)
      return () => mql.removeEventListener('change', cb)
    },
    () => getMql(query)?.matches ?? serverValue,
    () => serverValue,
  )
}

/** Desktop-ish: wide viewport AND a real pointer (excludes tablets in hand). */
export const useHasFinePointer = () =>
  useMediaQuery('(hover: hover) and (pointer: fine) and (min-width: 1024px)')

export const useIsMobile = () => useMediaQuery('(max-width: 767px)')

export const useIsTouch = () => useMediaQuery('(hover: none), (pointer: coarse)')
