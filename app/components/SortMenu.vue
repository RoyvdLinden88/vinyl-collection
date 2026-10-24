<script setup lang="ts">
import type { SortKey } from '~/types'

const model = defineModel<SortKey>({ required: true })
const open = ref(false)

const options: { key: SortKey, label: string }[] = [
  { key: 'artist', label: 'Artiest' },
  { key: 'title', label: 'Album' },
  { key: 'added', label: 'Laatst toegevoegd' }
]

function pick(key: SortKey) {
  model.value = key
  open.value = false
}
</script>

<template>
  <div class="sort">
    <button type="button" class="icon-btn" aria-label="Sorteren" @click="open = !open">
      <AppIcon name="sort" />
    </button>
    <template v-if="open">
      <div class="scrim" @click="open = false" />
      <div class="menu glass" role="menu">
        <div class="menu-title">Sorteer op</div>
        <button
          v-for="option in options"
          :key="option.key"
          type="button"
          class="menu-item"
          role="menuitemradio"
          :aria-checked="model === option.key"
          @click="pick(option.key)"
        >
          <span>{{ option.label }}</span>
          <AppIcon v-if="model === option.key" name="check" :size="18" />
        </button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.sort { position: relative; }
.menu { top: 50px; right: -46px; }
</style>
