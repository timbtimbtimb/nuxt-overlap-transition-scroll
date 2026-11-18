// Nuxt 4.6.4's default scrollBehavior (dist/pages/runtime/router.options.js), with the proposed fix marked "FIX".
// Loaded only with EARLY_SCROLL=1, see nuxt.config.ts.
import type { RouteLocationNormalized } from 'vue-router'
import { START_LOCATION } from 'vue-router'
import type { RouterConfig } from 'nuxt/schema'
import { isChangingPage } from '#app/components/utils'
import { useRouter } from '#app/composables/router'
import { useNuxtApp } from '#app/nuxt'

export default <RouterConfig>{
  scrollBehavior (to, from, savedPosition) {
    const nuxtApp = useNuxtApp()
    const router = useRouter()
    const hashScrollBehaviour = router.options?.scrollBehaviorType ?? 'auto'
    if (to.path.replace(/\/$/, '') === from.path.replace(/\/$/, '')) {
      if (from.hash && !to.hash) return savedPosition ?? { left: 0, top: 0 }
      if (to.hash) return { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior: hashScrollBehaviour }
      return false
    }
    if ((typeof to.meta.scrollToTop === 'function' ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop) === false) return false
    if (from === START_LOCATION) return _calculatePosition(to, from, savedPosition, hashScrollBehaviour)
    return new Promise((resolve) => {
      const doScroll = (position?: ScrollToOptions) => {
        requestAnimationFrame(() => {
          if (router.currentRoute.value.fullPath !== to.fullPath) {
            resolve(false)
            return
          }
          resolve(position ?? _calculatePosition(to, from, savedPosition, hashScrollBehaviour))
        })
      }
      nuxtApp.hooks.hookOnce('page:loading:end', () => {
        const transitionPromise = (nuxtApp as unknown as { '~transitionPromise'?: Promise<void> })['~transitionPromise']
        // FIX: with overlapping pages, scroll as the transition starts rather than after it ends
        if (transitionPromise && !savedPosition && !to.hash && _overlapsPages(to)) {
          doScroll({
            left: 0,
            top: 0,
            behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
          })
        }
        else if (transitionPromise) transitionPromise.then(() => doScroll())
        else doScroll()
      })
    })
  },
}

// FIX
function _overlapsPages (to: RouteLocationNormalized) {
  const transition = to.meta.pageTransition
  return typeof transition === 'object' && (!transition.mode || transition.mode === 'default')
}

function _getHashElementScrollMarginTop (hash: string) {
  const elem = document.getElementById(hash.slice(1))
  if (!elem) return 0
  return (Number.parseFloat(getComputedStyle(elem).scrollMarginTop) || 0)
    + (Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0)
}

function _calculatePosition (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  savedPosition: { left: number, top: number } | null,
  defaultHashScrollBehaviour: ScrollBehavior,
) {
  if (savedPosition) return savedPosition
  if (to.hash) {
    return {
      el: to.hash,
      top: _getHashElementScrollMarginTop(to.hash),
      behavior: isChangingPage(to, from) ? defaultHashScrollBehaviour : 'instant' as const,
    }
  }
  return { left: 0, top: 0 }
}
