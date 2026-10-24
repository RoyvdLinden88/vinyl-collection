<script setup lang="ts">
import type { VinylRecord } from '~/types'

const { records, loaded, ensureLoaded } = useRecords()
const query = ref('')

interface ArtistEntry { name: string, records: VinylRecord[], cover?: string }

// Grouped by first letter, with "The" ignored as in the collection.
const sections = computed(() => {
  const byArtist = new Map<string, ArtistEntry>()
  for (const record of sortRecords(records.value, 'artist')) {
    const key = record.artist.toLocaleLowerCase('nl')
    if (!byArtist.has(key)) byArtist.set(key, { name: record.artist, records: [] })
    const entry = byArtist.get(key)!
    entry.records.push(record)
    entry.cover ??= record.cover_url ?? undefined
  }

  const q = query.value.trim().toLowerCase()
  const groups = new Map<string, ArtistEntry[]>()
  for (const entry of byArtist.values()) {
    if (q && !entry.name.toLowerCase().includes(q)) continue
    const first = sortName(entry.name).charAt(0).toLocaleUpperCase('nl')
    const letter = /[A-Z]/.test(first) ? first : '#'
    if (!groups.has(letter)) groups.set(letter, [])
    groups.get(letter)!.push(entry)
  }
  return [...groups.entries()]
})

onMounted(ensureLoaded)
</script>

<template>
  <main class="page">
    <div class="topbar" />
    <h1 class="large-title">Artiesten</h1>
    <p class="subtitle">&nbsp;</p>

    <label class="search">
      <AppIcon name="search" :size="18" />
      <input v-model="query" type="search" placeholder="Zoek artiest" enterkeyhint="search">
    </label>

    <p v-if="loaded && !sections.length" class="empty">Geen artiesten gevonden.</p>

    <section v-for="[letter, artists] in sections" :key="letter">
      <h2 class="letter">{{ letter }}</h2>
      <div class="card">
        <NuxtLink
          v-for="artist in artists"
          :key="artist.name"
          :to="`/artiest/${encodeURIComponent(artist.name)}`"
          class="list-row"
        >
          <img v-if="artist.cover" class="thumb" :src="artist.cover" alt="" loading="lazy">
          <div v-else class="thumb" />
          <div class="text">
            <div class="primary-text ellipsis">{{ artist.name }}</div>
            <div class="secondary-text">
              {{ artist.records.length }} {{ artist.records.length === 1 ? 'plaat' : 'platen' }}
            </div>
          </div>
          <AppIcon name="chevron" class="chevron" :size="18" />
        </NuxtLink>
      </div>
    </section>
  </main>
</template>

<style scoped>
.letter {
  margin: 20px 0 8px 4px;
  color: var(--text-2);
  font-size: 15px;
  font-weight: 700;
}
</style>
