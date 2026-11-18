import { fileURLToPath } from 'node:url'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  runtimeConfig: {
    public: { earlyScroll: process.env.EARLY_SCROLL === '1' },
  },
  hooks: {
    // EARLY_SCROLL=1 swaps in Nuxt's scrollBehavior with the proposed fix applied
    'pages:routerOptions' ({ files }) {
      if (process.env.EARLY_SCROLL === '1') {
        files.push({ path: fileURLToPath(new URL('./early-scroll/router.options.ts', import.meta.url)) })
      }
    },
  },
})
