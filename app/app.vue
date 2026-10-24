<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <NuxtPage />
  <TabBar v-if="!route.meta.hideTabs" />
</template>
