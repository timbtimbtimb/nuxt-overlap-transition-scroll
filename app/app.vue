<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const nuxtApp = useNuxtApp()
const earlyScroll = useRuntimeConfig().public.earlyScroll

const scrollY = ref(0)
const timeline = ref<string[]>([])
let startedAt = 0
let reachedTop = false

function log (event: string) {
  timeline.value.push(`+${Math.round(performance.now() - startedAt)} ms  ${event}`)
}

router.beforeEach((to, from) => {
  if (import.meta.server || to.path === from.path) return
  startedAt = performance.now()
  reachedTop = false
  timeline.value = [`+0 ms  navigate from scrollY ${Math.round(window.scrollY)}`]
})
nuxtApp.hook('page:transition:finish', () => log('page transition finished'))

onMounted(() => {
  window.addEventListener('scroll', () => {
    scrollY.value = Math.round(window.scrollY)
    if (!reachedTop && startedAt && window.scrollY === 0) {
      reachedTop = true
      log('scrollY reached 0')
    }
  }, { passive: true })
})
</script>

<template>
  <div>
    <aside class="status">
      <div>mode: <b>{{ earlyScroll ? 'EARLY_SCROLL=1 (proposed fix)' : 'Nuxt default' }}</b></div>
      <div>route: <b>{{ route.fullPath }}</b></div>
      <div>scrollY: <b>{{ scrollY }}</b></div>
      <pre>{{ timeline.join('\n') }}</pre>
    </aside>
    <div class="pages">
      <NuxtPage />
    </div>
  </div>
</template>

<style>
body {
  margin: 0;
  font-family: system-ui, sans-serif;
}

.status {
  position: fixed;
  z-index: 1;
  top: 8px;
  right: 8px;
  padding: 8px 12px;
  background: #fff;
  border: 1px solid #ccc;
  font-size: 14px;
  line-height: 1.6;
}

.status pre {
  margin: 4px 0 0;
}

/* Both pages share this box during the cross-fade */
.pages {
  position: relative;
  isolation: isolate;
}

/* The entering page fades in over the leaving one, which is lifted out of the flow and stays put until then */
.cross-fade-enter-active {
  transition: opacity 1s;
}

.cross-fade-leave-active {
  position: absolute;
  inset: 0 0 auto;
  z-index: -1;
  transition: opacity 0s 1s;
}

.cross-fade-enter-from,
.cross-fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.links {
  padding: 16px;
  font-size: 18px;
}

.section {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50vh;
  font-size: 32px;
}
</style>
