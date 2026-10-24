<script setup lang="ts">
const route = useRoute()
const { records, loaded, ensureLoaded } = useRecords()

const root = ref<HTMLElement | null>(null)
const goBack = useSwipeBack(root)

const artist = computed(() => String(route.params.name))
const artistRecords = computed(() =>
  records.value
    .filter(r => r.artist.localeCompare(artist.value, 'nl', { sensitivity: 'base' }) === 0)
    .sort((a, b) => (a.year ?? 9999) - (b.year ?? 9999) || a.title.localeCompare(b.title, 'nl'))
)
const featured = computed(() => artistRecords.value.find(r => r.cover_url))

useHead(() => ({ title: artist.value }))

onMounted(ensureLoaded)
</script>

<template>
  <div ref="root" class="swipe-page">
    <BlurBackdrop :src="featured?.cover_url" :color="featured?.cover_color" />

    <main class="page">
      <div class="topbar">
        <button type="button" class="icon-btn solo glass" aria-label="Terug" @click="goBack">
          <AppIcon name="back" />
        </button>
      </div>

      <h1 class="large-title">{{ artist }}</h1>
      <p class="subtitle">
        <template v-if="loaded">
          {{ artistRecords.length }} {{ artistRecords.length === 1 ? 'plaat' : 'platen' }}
        </template>
      </p>

      <p v-if="loaded && !artistRecords.length" class="empty">Geen platen van deze artiest.</p>
      <RecordGrid :records="artistRecords" hide-artist />
    </main>
  </div>
</template>
