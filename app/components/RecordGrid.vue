<script setup lang="ts">
import type { VinylRecord } from '~/types'

defineProps<{ records: VinylRecord[], hideArtist?: boolean }>()
</script>

<template>
  <ul class="grid">
    <li v-for="record in records" :key="record.id">
      <NuxtLink :to="`/plaat/${record.id}`" class="tile">
        <div class="cover" :style="{ backgroundColor: record.cover_color ?? undefined }">
          <img v-if="record.cover_url" :src="record.cover_url" :alt="record.title" loading="lazy">
          <AppIcon v-else name="disc" :size="48" class="placeholder" />
        </div>
        <template v-if="hideArtist">
          <div class="line-1 ellipsis">{{ record.title }}</div>
          <div class="line-2 ellipsis">{{ record.year ?? '' }}</div>
        </template>
        <template v-else>
          <div class="line-1 ellipsis">{{ record.artist }}</div>
          <div class="line-2 ellipsis">{{ record.title }}</div>
        </template>
      </NuxtLink>
    </li>
  </ul>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 22px 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.tile { display: block; }
.tile:active .cover { transform: scale(0.97); }
.cover {
  position: relative;
  aspect-ratio: 1;
  margin-bottom: 8px;
  border-radius: 8px;
  overflow: hidden;
  background: var(--surface);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.5);
  transition: transform 0.15s;
}
.cover img { width: 100%; height: 100%; object-fit: cover; }
.placeholder {
  position: absolute;
  inset: 0;
  margin: auto;
  color: var(--text-3);
}
.line-1 { font-size: 15px; font-weight: 600; }
.line-2 { font-size: 14px; color: var(--text-2); }

/* Phones: one full-width cover per row. */
@media (max-width: 559px) {
  .grid { grid-template-columns: 1fr; gap: 28px; }
  .cover { border-radius: 10px; }
  .line-1 { font-size: 17px; }
  .line-2 { font-size: 16px; }
}
</style>
