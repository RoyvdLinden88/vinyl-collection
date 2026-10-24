<script setup lang="ts">
// The album cover, enlarged and heavily blurred behind the page, tinted with its colour.
defineProps<{ src?: string | null, color?: string | null }>()
</script>

<template>
  <div class="backdrop" :style="{ backgroundColor: color ?? '#1c1c1e' }" aria-hidden="true">
    <img v-if="src" :src="src" alt="">
    <div class="shade" />
  </div>
</template>

<style scoped>
/* Sticky rather than fixed, so it keeps covering the screen while the page is
   translated by the swipe-back gesture. Place it as the first child of the page. */
.backdrop {
  position: sticky;
  top: 0;
  height: 100lvh;
  margin-bottom: -100lvh;
  overflow: hidden;
  pointer-events: none;
}
.backdrop img {
  position: absolute;
  /* Full width at the top rather than stretched to fill the height, so the
     cover stays recognisable; it fades out into its own colour below. */
  top: -6vw;
  left: -8%;
  width: 116%;
  aspect-ratio: 1;
  object-fit: cover;
  -webkit-mask-image: linear-gradient(180deg, #000 55%, transparent 100%);
  mask-image: linear-gradient(180deg, #000 55%, transparent 100%);
  filter: blur(24px) saturate(1.4);
  transform: translateZ(0);
}
.shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.58) 45%, rgba(0, 0, 0, 0.82) 100%);
}
</style>
