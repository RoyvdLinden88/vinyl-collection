<script setup lang="ts">
const model = defineModel<string | null>({ required: true })
defineProps<{ genres: { name: string, count: number }[] }>()
const open = ref(false)

function pick(name: string | null) {
  model.value = name
  open.value = false
}
</script>

<template>
  <div class="genre">
    <button
      type="button"
      class="toggle"
      :class="{ active: model }"
      :aria-expanded="open"
      @click="open = !open"
    >
      {{ model ?? 'Alle genres' }}
      <AppIcon name="down" :size="16" />
    </button>
    <template v-if="open">
      <div class="scrim" @click="open = false" />
      <div class="menu glass" role="menu">
        <div class="menu-title">Filter op genre</div>
        <button
          type="button"
          class="menu-item"
          role="menuitemradio"
          :aria-checked="!model"
          @click="pick(null)"
        >
          <span>Alle genres</span>
          <AppIcon v-if="!model" name="check" :size="18" />
        </button>
        <button
          v-for="g in genres"
          :key="g.name"
          type="button"
          class="menu-item"
          role="menuitemradio"
          :aria-checked="model === g.name"
          @click="pick(g.name)"
        >
          <span class="ellipsis">{{ g.name }}</span>
          <AppIcon v-if="model === g.name" name="check" :size="18" />
          <span v-else class="count">{{ g.count }}</span>
        </button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.genre { position: relative; }
.toggle {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 32px;
  padding: 0 12px 0 14px;
  border: 0;
  border-radius: 999px;
  background: var(--surface);
  color: var(--text-2);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}
.toggle.active { background: #fff; color: #000; }
.menu { top: 40px; right: 0; }
.count { color: var(--text-3); font-size: 15px; }
</style>
