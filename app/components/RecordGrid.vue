<script setup lang="ts">
import type { VinylRecord } from '~/types'

defineProps<{ records: VinylRecord[], hideArtist?: boolean }>()
</script>

<template>
  <ul class="grid">
    <li v-for="record in records" :key="record.id">
      <NuxtLink
        :to="`/plaat/${record.id}`"
        class="tile"
        :style="{ backgroundColor: record.cover_color ?? undefined }"
      >
        <!-- The cover again, blurred, as a soft glow behind the card. -->
        <img v-if="record.cover_url" class="glow" :src="record.cover_url" alt="" loading="lazy">

        <div class="cover">
          <img v-if="record.cover_url" :src="record.cover_url" :alt="record.title" loading="lazy">
          <AppIcon v-else name="disc" :size="48" class="placeholder" />
        </div>
        <div class="caption">
          <template v-if="hideArtist">
            <div class="line-1 ellipsis">{{ record.title }}</div>
            <div class="line-2 ellipsis">{{ record.year ?? '' }}</div>
          </template>
          <template v-else>
            <div class="line-1 ellipsis">{{ record.artist }}</div>
            <div class="line-2 ellipsis">{{ record.title }}</div>
          </template>
        </div>
      </NuxtLink>
    </li>
  </ul>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.grid > li {
  min-width: 0;
}

.tile {
  position: relative;
  isolation: isolate;
  display: block;
  padding: 10px 10px 12px;
  border: 0.5px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  overflow: hidden;
  background: var(--surface);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
  transition: transform 0.15s;
  /* Skip rendering (and blurring) cards that are off screen. */
  content-visibility: auto;
  contain-intrinsic-block-size: auto 300px;
}
.tile:active { transform: scale(0.98); }

.glow {
  position: absolute;
  z-index: -2;
  inset: -20%;
  width: 140%;
  height: 140%;
  object-fit: cover;
  filter: blur(30px) saturate(1.4);
  opacity: 0.85;
}
/* Darken the glow so the white text always reads. */
.tile::before {
  content: '';
  position: absolute;
  z-index: -1;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.6));
}

.cover {
  position: relative;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.25);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.45);
}
.cover img { width: 100%; height: 100%; object-fit: cover; }
.placeholder {
  position: absolute;
  inset: 0;
  margin: auto;
  color: var(--text-3);
}

.caption { padding: 10px 4px 0; }
.line-1 { font-size: 15px; font-weight: 600; }
.line-2 { font-size: 14px; color: rgba(255, 255, 255, 0.68); }

/* Phones: one full-width card per row. */
@media (max-width: 559px) {
  .grid { grid-template-columns: 1fr; gap: 18px; }
  .tile { padding: 12px 12px 14px; border-radius: 24px; contain-intrinsic-block-size: auto 440px; }
  .cover { border-radius: 14px; }
  .caption { padding: 12px 4px 0; }
  .line-1 { font-size: 18px; }
  .line-2 { font-size: 16px; }
}
</style>
