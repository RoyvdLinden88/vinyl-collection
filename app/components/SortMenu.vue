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
.scrim { position: fixed; inset: 0; z-index: 60; }
.menu {
  position: absolute;
  z-index: 61;
  top: 50px;
  right: -46px;
  width: 230px;
  padding: 6px 0;
  border-radius: 16px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.55);
}
.menu-title {
  padding: 6px 16px 4px;
  color: var(--text-2);
  font-size: 13px;
}
.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 11px 16px;
  border: 0;
  background: none;
  font-size: 17px;
  text-align: left;
  cursor: pointer;
}
.menu-item:active { background: rgba(255, 255, 255, 0.08); }
</style>
