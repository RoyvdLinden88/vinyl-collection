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
    <div class="summary">
      <span>
        <template v-if="loaded">
          <template v-if="visible.length !== records.length">{{ visible.length }} van </template>{{ records.length }}
          {{ records.length === 1 ? 'plaat' : 'platen' }}
        </template>
      </span>
      <div class="actions">
        <GenreMenu v-if="genreCounts.length" v-model="genre" :genres="genreCounts" />
        <div class="pill-group glass">
          <SortMenu v-model="sort" />
          <NuxtLink to="/beheer/nieuw" class="icon-btn" aria-label="Plaat toevoegen">
            <AppIcon name="plus" />
          </NuxtLink>
        </div>
      </div>
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
  margin: 4px 0 16px;
  color: var(--text-2);
  font-size: 15px;
}
.actions {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 8px;
}
/* On the black page a backdrop blur adds nothing, and it would trap the
   pop-up menus beneath the content below. */
.actions .pill-group,
.actions :deep(.toggle:not(.active)) {
  -webkit-backdrop-filter: none;
  backdrop-filter: none;
  background: var(--surface);
}

/* Everything in this row is 40px tall, matching the genre button. */
.pill-group { height: 40px; padding: 0 2px; }
.pill-group :deep(.icon-btn) { width: 40px; height: 38px; }
</style>
