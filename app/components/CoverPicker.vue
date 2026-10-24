<script setup lang="ts">
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import type { PickedCover } from '~/types'

const props = defineProps<{ currentUrl?: string | null }>()
const emit = defineEmits<{ picked: [cover: PickedCover] }>()

const OUTPUT_SIZE = 1200

const fileInput = ref<HTMLInputElement | null>(null)
const cropper = ref<InstanceType<typeof Cropper> | null>(null)
const sourceUrl = ref<string | null>(null)
const previewUrl = ref<string | null>(null)
const busy = ref(false)

const shownUrl = computed(() => previewUrl.value ?? props.currentUrl)

function choose() {
  fileInput.value?.click()
}

function onFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (sourceUrl.value) URL.revokeObjectURL(sourceUrl.value)
  sourceUrl.value = URL.createObjectURL(file)
  ;(e.target as HTMLInputElement).value = ''
}

function cancel() {
  if (sourceUrl.value) URL.revokeObjectURL(sourceUrl.value)
  sourceUrl.value = null
}

async function confirm() {
  const result = cropper.value?.getResult()
  if (!result?.canvas) return
  busy.value = true

  const out = document.createElement('canvas')
  out.width = out.height = Math.min(OUTPUT_SIZE, result.canvas.width)
  const ctx = out.getContext('2d')!
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(result.canvas, 0, 0, out.width, out.height)

  const blob = await new Promise<Blob | null>(resolve => out.toBlob(resolve, 'image/jpeg', 0.86))
  busy.value = false
  if (!blob) return

  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = URL.createObjectURL(blob)
  emit('picked', { blob, previewUrl: previewUrl.value, color: dominantColor(out) })
  cancel()
}

onBeforeUnmount(() => {
  if (sourceUrl.value) URL.revokeObjectURL(sourceUrl.value)
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
})
</script>

<template>
  <div>
    <button type="button" class="picker" @click="choose">
      <img v-if="shownUrl" :src="shownUrl" alt="Hoes">
      <span v-else class="empty-cover">
        <AppIcon name="image" :size="36" />
        Hoes kiezen
      </span>
      <span v-if="shownUrl" class="change glass">Wijzigen</span>
    </button>
    <input ref="fileInput" type="file" accept="image/*" hidden @change="onFile">

    <Teleport to="body">
      <div v-if="sourceUrl" class="crop-modal" data-no-swipe>
        <div class="crop-bar">
          <button type="button" class="btn" @click="cancel">Annuleren</button>
          <strong>Bijsnijden</strong>
          <button type="button" class="btn primary" :disabled="busy" @click="confirm">Gebruik</button>
        </div>
        <Cropper
          ref="cropper"
          class="cropper"
          :src="sourceUrl"
          :stencil-props="{ aspectRatio: 1 }"
          :canvas="{ maxWidth: 2400, maxHeight: 2400 }"
          image-restriction="stencil"
          background-class="crop-bg"
        />
        <p class="hint">Sleep en knijp om de hoes precies in het vierkant te passen.</p>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.picker {
  position: relative;
  display: block;
  width: min(220px, 60vw);
  aspect-ratio: 1;
  margin: 0 auto 22px;
  padding: 0;
  border: 0;
  border-radius: 10px;
  overflow: hidden;
  background: var(--surface);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  cursor: pointer;
}
.picker img { width: 100%; height: 100%; object-fit: cover; }
.empty-cover {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 100%;
  color: var(--text-2);
  font-size: 15px;
  font-weight: 600;
}
.change {
  position: absolute;
  right: 8px;
  bottom: 8px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
}

.crop-modal {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  background: #000;
  padding: calc(var(--safe-top) + 8px) 0 calc(var(--safe-bottom) + 12px);
}
.crop-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px 12px;
}
.crop-bar .btn { min-height: 40px; padding: 0 16px; font-size: 15px; }
.cropper { flex: 1; min-height: 0; }
.hint {
  margin: 12px 20px 0;
  color: var(--text-2);
  font-size: 14px;
  text-align: center;
}
:global(.crop-bg) { background: #000; }
</style>
