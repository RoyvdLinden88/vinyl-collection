<script setup lang="ts">
import type { PickedCover, RecordInput } from '~/types'

definePageMeta({ hideTabs: true })

const route = useRoute()
const { records, genres, loaded, ensureLoaded, save, remove, uploadCover, removeCover } = useRecords()

const root = ref<HTMLElement | null>(null)
const goBack = useSwipeBack(root, '/beheer')

const isNew = computed(() => route.params.id === 'nieuw')
const existing = computed(() => records.value.find(r => r.id === route.params.id))

const form = reactive({
  artist: '',
  title: '',
  year: '',
  genres: [] as string[],
  purchased_at: '',
  notes: '',
  sides: [{ name: 'A', text: '' }, { name: 'B', text: '' }]
})
const cover = ref<PickedCover | null>(null)
const saving = ref(false)
const error = ref<string | null>(null)

// Fill the form once the record is available (it may still be loading).
let filled = false
watch(existing, (record) => {
  if (!record || isNew.value || filled) return
  filled = true
  form.artist = record.artist
  form.title = record.title
  form.year = record.year ? String(record.year) : ''
  form.genres = [...(record.genres ?? [])]
  form.purchased_at = record.purchased_at ?? ''
  form.notes = record.notes ?? ''
  form.sides = record.sides.length
    ? record.sides.map(s => ({ name: s.name, text: formatTracks(s.tracks) }))
    : [{ name: 'A', text: '' }]
}, { immediate: true })

const uniqueSorted = (values: (string | null)[]) =>
  [...new Set(values.filter((v): v is string => !!v))].sort((a, b) => a.localeCompare(b, 'nl'))
const artistOptions = computed(() => uniqueSorted(records.value.map(r => r.artist)))
const shopOptions = computed(() => uniqueSorted(records.value.map(r => r.purchased_at)))

// Existing genres plus any just typed in this form, so they can be toggled.
const genreOptions = computed(() => [...new Set([...genres.value, ...form.genres])])
const newGenre = ref('')

function toggleGenre(name: string) {
  const i = form.genres.indexOf(name)
  if (i === -1) form.genres.push(name)
  else form.genres.splice(i, 1)
}

function addGenre() {
  const name = newGenre.value.trim()
  newGenre.value = ''
  if (!name) return
  const known = genreOptions.value.find(g => g.toLowerCase() === name.toLowerCase())
  if (!form.genres.includes(known ?? name)) form.genres.push(known ?? name)
}

function addSide() {
  form.sides.push({ name: nextSideName(form.sides), text: '' })
}

function removeSide(index: number) {
  form.sides.splice(index, 1)
}

async function submit() {
  error.value = null
  const year = form.year.trim() ? Number.parseInt(form.year, 10) : null
  if (year !== null && (Number.isNaN(year) || year < 1900 || year > 2100)) {
    error.value = 'Vul een geldig jaartal in.'
    return
  }

  saving.value = true
  try {
    const old = existing.value
    let coverFields = {
      cover_url: old?.cover_url ?? null,
      cover_path: old?.cover_path ?? null,
      cover_color: old?.cover_color ?? null
    }
    if (cover.value) {
      const uploaded = await uploadCover(cover.value.blob)
      coverFields = { cover_url: uploaded.url, cover_path: uploaded.path, cover_color: cover.value.color }
    }

    const input: RecordInput = {
      artist: form.artist.trim(),
      title: form.title.trim(),
      year,
      genres: form.genres,
      purchased_at: form.purchased_at.trim() || null,
      notes: form.notes.trim() || null,
      sides: form.sides
        .map(s => ({ name: s.name.trim() || '?', tracks: parseTracks(s.text) }))
        .filter(s => s.tracks.length),
      ...coverFields
    }

    const saved = await save(input, isNew.value ? undefined : old?.id)
    if (cover.value && old?.cover_path) await removeCover(old.cover_path)
    await navigateTo(`/plaat/${saved.id}`, { replace: true })
  } catch (e) {
    error.value = `Opslaan mislukt: ${(e as Error).message}`
  } finally {
    saving.value = false
  }
}

async function destroy() {
  const record = existing.value
  if (!record || !window.confirm(`“${record.title}” van ${record.artist} verwijderen?`)) return
  try {
    await remove(record)
    await navigateTo('/beheer', { replace: true })
  } catch (e) {
    error.value = `Verwijderen mislukt: ${(e as Error).message}`
  }
}

onMounted(ensureLoaded)
</script>

<template>
  <div ref="root" class="swipe-page">
    <main class="page form-page">
      <AuthGate>
        <div class="topbar">
          <button type="button" class="icon-btn solo glass" aria-label="Terug" @click="goBack">
            <AppIcon name="back" />
          </button>
          <button type="submit" form="record-form" class="btn primary save" :disabled="saving">
            {{ saving ? 'Opslaan…' : 'Opslaan' }}
          </button>
        </div>

        <h1 class="large-title">{{ isNew ? 'Nieuwe plaat' : 'Bewerken' }}</h1>

        <p v-if="!isNew && loaded && !existing" class="empty">Deze plaat bestaat niet (meer).</p>

        <form v-else id="record-form" @submit.prevent="submit">
          <CoverPicker :current-url="existing?.cover_url" @picked="cover = $event" />

          <label class="field">
            <span>Artiest</span>
            <input v-model="form.artist" class="input" list="artist-options" required autocapitalize="words">
          </label>
          <label class="field">
            <span>Album</span>
            <input v-model="form.title" class="input" required autocapitalize="words">
          </label>
          <label class="field">
            <span>Jaar van uitbrengen</span>
            <input v-model="form.year" class="input" inputmode="numeric" pattern="[0-9]*" maxlength="4">
          </label>
          <div class="field">
            <span>Genres</span>
            <div v-if="genreOptions.length" class="genre-chips">
              <button
                v-for="g in genreOptions"
                :key="g"
                type="button"
                class="chip"
                :class="{ active: form.genres.includes(g) }"
                @click="toggleGenre(g)"
              >
                {{ g }}
              </button>
            </div>
            <div class="genre-add">
              <input
                v-model="newGenre"
                class="input"
                placeholder="Nieuw genre"
                autocapitalize="words"
                enterkeyhint="done"
                @keydown.enter.prevent="addGenre"
              >
              <button type="button" class="btn" :disabled="!newGenre.trim()" @click="addGenre">
                <AppIcon name="plus" :size="20" />
              </button>
            </div>
          </div>
          <label class="field">
            <span>Gekocht bij</span>
            <input v-model="form.purchased_at" class="input" list="shop-options">
          </label>
          <label class="field">
            <span>Bijzonderheden</span>
            <textarea v-model="form.notes" class="input" rows="3" placeholder="Bijv. transparant rood vinyl, gelimiteerde oplage" />
          </label>

          <datalist id="artist-options">
            <option v-for="name in artistOptions" :key="name" :value="name" />
          </datalist>
          <datalist id="shop-options">
            <option v-for="name in shopOptions" :key="name" :value="name" />
          </datalist>

          <h2 class="section-title">Nummers</h2>
          <p class="help">Eén nummer per regel. Zet de duur er eventueel achter, bijv. <code>Wish You Were Here 5:34</code>.</p>

          <div v-for="(side, i) in form.sides" :key="i" class="side-editor">
            <div class="side-head">
              <label class="side-name">
                Kant
                <input v-model="side.name" class="input" maxlength="3" autocapitalize="characters">
              </label>
              <button
                v-if="form.sides.length > 1"
                type="button"
                class="icon-btn"
                :aria-label="`Kant ${side.name} verwijderen`"
                @click="removeSide(i)"
              >
                <AppIcon name="close" :size="18" />
              </button>
            </div>
            <textarea v-model="side.text" class="input" rows="5" :placeholder="`Nummers op kant ${side.name}`" />
          </div>

          <button type="button" class="btn block" @click="addSide">
            <AppIcon name="plus" :size="20" /> Kant {{ nextSideName(form.sides) }} toevoegen
          </button>

          <p v-if="error" class="error-text">{{ error }}</p>

          <button class="btn primary block submit" :disabled="saving">
            {{ saving ? 'Opslaan…' : 'Opslaan' }}
          </button>
          <button v-if="!isNew && existing" type="button" class="btn danger block" @click="destroy">
            <AppIcon name="trash" :size="20" /> Plaat verwijderen
          </button>
        </form>
      </AuthGate>
    </main>
  </div>
</template>

<style scoped>
.form-page { max-width: 640px; padding-bottom: calc(var(--safe-bottom) + 32px); }
.save { min-height: 40px; padding: 0 18px; font-size: 15px; }
.genre-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }
.genre-add { display: flex; gap: 8px; }
.genre-add .btn { flex: none; padding: 0 14px; }
.section-title { margin: 28px 0 4px; font-size: 22px; font-weight: 700; }
.help { margin: 0 0 14px; color: var(--text-2); font-size: 14px; }
.help code { font-family: var(--mono); font-size: 13px; color: var(--text); }
.side-editor { margin-bottom: 14px; }
.side-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}
.side-name {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-2);
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.side-name .input {
  width: 56px;
  min-height: 36px;
  padding: 6px 10px;
  text-align: center;
  text-transform: uppercase;
}
.submit { margin: 24px 0 12px; }
</style>
