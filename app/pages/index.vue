<script setup lang="ts">
definePageMeta({ pageTransition: { name: 'cross-fade' } })
</script>

<template>
  <main>
    <div
      v-for="n in 8"
      :key="n"
      class="section"
      :style="{ background: n % 2 ? '#dbe8ff' : '#c2d6fb' }"
    >
      Page A · section {{ n }}
    </div>
    <p class="links">
      <NuxtLink to="/b">
        Go to page B (cross-fade)
      </NuxtLink>
      ·
      <NuxtLink to="/out-in">
        Go to the out-in control page
      </NuxtLink>
    </p>
  </main>
</template>
