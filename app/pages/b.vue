<script setup lang="ts">
definePageMeta({ pageTransition: { name: 'cross-fade' } })
</script>

<template>
  <main>
    <div
      v-for="n in 8"
      :key="n"
      class="section"
      :style="{ background: n % 2 ? '#ffe9a8' : '#ffd87a' }"
    >
      Page B · section {{ n }}
    </div>
    <p class="links">
      <NuxtLink to="/">
        Back to page A (cross-fade)
      </NuxtLink>
    </p>
  </main>
</template>
