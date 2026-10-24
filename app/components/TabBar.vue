<script setup lang="ts">
const route = useRoute()

const tabs = [
  { to: '/', label: 'LP-Collectie', icon: 'disc', match: (p: string) => p === '/' || p.startsWith('/plaat') },
  { to: '/artiesten', label: 'Artiesten', icon: 'person', match: (p: string) => p.startsWith('/artiest') },
  { to: '/beheer', label: 'Beheer', icon: 'sliders', match: (p: string) => p.startsWith('/beheer') }
]
</script>

<template>
  <nav class="tabbar glass">
    <NuxtLink
      v-for="tab in tabs"
      :key="tab.to"
      :to="tab.to"
      class="tab"
      :class="{ active: tab.match(route.path) }"
    >
      <AppIcon :name="tab.icon" :size="24" />
      <span>{{ tab.label }}</span>
    </NuxtLink>
  </nav>
</template>

<style scoped>
.tabbar {
  position: fixed;
  z-index: 50;
  left: 50%;
  bottom: calc(var(--safe-bottom) + 12px);
  transform: translateX(-50%);
  display: flex;
  gap: 2px;
  padding: 5px;
  border-radius: 999px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
}
.tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-width: 88px;
  padding: 7px 12px 6px;
  border-radius: 999px;
  color: var(--text-2);
  font-size: 11px;
  font-weight: 600;
}
.tab.active {
  color: var(--text);
  background: rgba(255, 255, 255, 0.12);
}
</style>
