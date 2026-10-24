<script setup lang="ts">
import type { SortKey } from '~/types'

const { records, genres, loaded, error, ensureLoaded } = useRecords()

const SORT_STORAGE_KEY = 'platenkast-sort'
const sort = useState<SortKey>('sort', () => {
  try {
    const saved = localStorage.getItem(SORT_STORAGE_KEY)
    if (saved === 'artist' || saved === 'title' || saved === 'added') return saved
  } catch {}
  return 'artist'
})
watch(sort, (value) => {
  try { localStorage.setItem(SORT_STORAGE_KEY, value) } catch {}
})

const query = ref('')
const genre = useState<string | null>('genre-filter', () => null)

const genreCounts = computed(() =>
  genres.value.map(name => ({ name, count: records.value.filter(r => r.genres?.includes(name)).length }))
)

const visible = computed(() => {
  const q = query.value.trim().toLowerCase()
  const filtered = records.value.filter(r =>
    (!genre.value || r.genres?.includes(genre.value))
    && (!q || `${r.artist} ${r.title} ${r.genres?.join(' ') ?? ''}`.toLowerCase().includes(q))
  )
  return sortRecords(filtered, sort.value)
})

onMounted(ensureLoaded)
</script>

<template>
  <main class="page">
    <div class="topbar">
      <span />
      <div class="pill-group glass">
        <SortMenu v-model="sort" />
        <NuxtLink to="/beheer/nieuw" class="icon-btn" aria-label="Plaat toevoegen">
          <AppIcon name="plus" />
        </NuxtLink>
      </div>
    </div>

    <div class="summary">
      <span>
        <template v-if="loaded">
          <template v-if="visible.length !== records.length">{{ visible.length }} van </template>{{ records.length }}
          {{ records.length === 1 ? 'plaat' : 'platen' }}
        </template>
      </span>
      <GenreMenu v-if="genreCounts.length" v-model="genre" :genres="genreCounts" />
    </div>

    <label class="search">
      <AppIcon name="search" :size="18" />
      <input v-model="query" type="search" placeholder="Artiest, album of genre" enterkeyhint="search">
    </label>

    <p v-if="error" class="empty error-text">
      Kon de collectie niet laden: {{ error }}
    </p>
    <div v-else-if="loaded && !records.length" class="empty">
      <p>Je platenkast is nog leeg.</p>
      <NuxtLink to="/beheer/nieuw" class="btn primary">Eerste plaat toevoegen</NuxtLink>
    </div>
    <p v-else-if="loaded && !visible.length" class="empty">Geen platen gevonden.</p>
    <RecordGrid v-else :records="visible" />
  </main>
</template>

<style scoped>
.summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 32px;
  margin: 12px 0 14px;
  color: var(--text-2);
  font-size: 15px;
}
</style>
