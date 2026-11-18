<script setup lang="ts">
definePageMeta({ pageTransition: { name: 'fade', mode: 'out-in' } })
</script>

<template>
  <main>
    <div
      v-for="n in 8"
      :key="n"
      class="section"
      :style="{ background: n % 2 ? '#d6f5e6' : '#b5ebd0' }"
    >
      Control (mode: out-in) · section {{ n }}
    </div>
    <p class="links">
      <NuxtLink to="/">
        Back to page A
      </NuxtLink>
    </p>
  </main>
</template>
