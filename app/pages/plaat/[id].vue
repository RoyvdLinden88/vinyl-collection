<script setup lang="ts">
const route = useRoute()
const { records, loaded, ensureLoaded } = useRecords()
const { user, init } = useAuth()

const root = ref<HTMLElement | null>(null)
const goBack = useSwipeBack(root)

const record = computed(() => records.value.find(r => r.id === route.params.id))
const trackCount = computed(() => record.value?.sides.reduce((n, s) => n + s.tracks.length, 0) ?? 0)

const meta = computed(() => {
  const r = record.value
  if (!r) return ''
  const parts: string[] = []
  if (r.year) parts.push(String(r.year))
  if (r.genres?.length) parts.push(r.genres.join(', '))
  if (r.sides.length) parts.push(`${r.sides.length} ${r.sides.length === 1 ? 'kant' : 'kanten'}`)
  if (trackCount.value) parts.push(`${trackCount.value} nummers`)
  return parts.join(' · ')
})

useHead(() => ({ title: record.value ? `${record.value.title} – ${record.value.artist}` : 'Platenkast' }))

onMounted(() => {
  ensureLoaded()
  init()
})
</script>

<template>
  <div ref="root" class="swipe-page">
    <BlurBackdrop :src="record?.cover_url" :color="record?.cover_color" />

    <main class="page">
      <div class="topbar">
        <button type="button" class="icon-btn solo glass" aria-label="Terug" @click="goBack">
          <AppIcon name="back" />
        </button>
        <NuxtLink
          v-if="record && user"
          :to="`/beheer/${record.id}`"
          class="icon-btn solo glass"
          aria-label="Bewerken"
        >
          <AppIcon name="pencil" :size="20" />
        </NuxtLink>
      </div>

      <p v-if="loaded && !record" class="empty">Deze plaat bestaat niet (meer).</p>

      <template v-if="record">
        <div class="hero">
          <div class="disc" :style="{ '--label': record.cover_color ?? '#e8452c' }" aria-hidden="true">
            <div class="label" />
          </div>
          <div class="sleeve" :style="{ backgroundColor: record.cover_color ?? undefined }">
            <img v-if="record.cover_url" :src="record.cover_url" :alt="`Hoes van ${record.title}`">
          </div>
        </div>

        <NuxtLink :to="`/artiest/${encodeURIComponent(record.artist)}`" class="artist">
          {{ record.artist }}
          <AppIcon name="chevron" :size="14" />
        </NuxtLink>
        <h1 class="title">{{ record.title }}</h1>
        <p v-if="meta" class="meta">{{ meta }}</p>

        <section v-for="side in record.sides" :key="side.name" class="side glass">
          <h2>Kant {{ side.name }}</h2>
          <ol>
            <li v-for="(track, i) in side.tracks" :key="i">
              <span class="pos">{{ side.name }}{{ i + 1 }}</span>
              <span class="track-title">{{ track.title }}</span>
              <span v-if="track.duration" class="duration">{{ track.duration }}</span>
            </li>
          </ol>
        </section>

        <section v-if="record.notes || record.purchased_at" class="info glass">
          <div v-if="record.notes" class="info-row">
            <div class="info-label">Bijzonderheden</div>
            <div class="notes">{{ record.notes }}</div>
          </div>
          <div v-if="record.purchased_at" class="info-row">
            <div class="info-label">Gekocht bij</div>
            <div>{{ record.purchased_at }}</div>
          </div>
        </section>
      </template>
    </main>
  </div>
</template>

<style scoped>
.hero {
  position: relative;
  width: min(72vw, 330px);
  aspect-ratio: 1;
  margin: 12px 0 22px;
}
.sleeve {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  overflow: hidden;
  background: var(--surface);
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.55);
}
.sleeve img { width: 100%; height: 100%; object-fit: cover; }

/* The record sliding out of the sleeve. */
.disc {
  position: absolute;
  top: 3%;
  left: 22%;
  width: 94%;
  aspect-ratio: 1;
  border-radius: 50%;
  background:
    repeating-radial-gradient(circle, rgba(255, 255, 255, 0.045) 0 1px, transparent 1px 4px),
    radial-gradient(circle, #222 0%, #0b0b0b 70%);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5);
  animation: slide-out 0.7s 0.1s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
.disc::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, transparent 40%, rgba(255, 255, 255, 0.09) 50%, transparent 60%);
}
.label {
  position: absolute;
  inset: 34%;
  border-radius: 50%;
  background: var(--label);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2);
}
.label::after {
  content: '';
  position: absolute;
  inset: 45%;
  border-radius: 50%;
  background: #000;
}
@keyframes slide-out {
  from { left: 0; }
}
.page { overflow-x: clip; }

.artist {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  color: rgba(255, 255, 255, 0.82);
  font-size: 17px;
  font-weight: 600;
}
.title {
  margin: 2px 0 6px;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.12;
}
.meta {
  margin: 0 0 20px;
  color: rgba(255, 255, 255, 0.62);
  font-family: var(--mono);
  font-size: 13px;
}

.info, .side {
  margin-bottom: 14px;
  border-radius: var(--radius);
  background: rgba(255, 255, 255, 0.08);
}
.info-row { padding: 14px 16px; }
.info-row + .info-row { border-top: 0.5px solid rgba(255, 255, 255, 0.12); }
.info-label {
  margin-bottom: 3px;
  color: rgba(255, 255, 255, 0.55);
  font-size: 13px;
  font-weight: 600;
}
.notes { white-space: pre-wrap; }

.side h2 {
  margin: 0;
  padding: 14px 16px 6px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
}
.side ol { margin: 0; padding: 0 0 6px; list-style: none; }
.side li {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 10px 16px;
}
.side li + li { border-top: 0.5px solid rgba(255, 255, 255, 0.08); }
.pos {
  width: 26px;
  flex: none;
  color: rgba(255, 255, 255, 0.45);
  font-family: var(--mono);
  font-size: 13px;
}
.track-title { flex: 1; min-width: 0; }
.duration {
  color: rgba(255, 255, 255, 0.55);
  font-family: var(--mono);
  font-size: 13px;
  font-variant-numeric: tabular-nums;
}
</style>
