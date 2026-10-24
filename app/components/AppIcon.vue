<script setup lang="ts">
const props = withDefaults(defineProps<{ name: string, size?: number }>(), { size: 22 })

const paths: Record<string, string> = {
  'back': 'M15 5l-7 7 7 7',
  'chevron': 'M9 6l6 6-6 6',
  'plus': 'M12 5v14M5 12h14',
  'sort': 'M4 7h16M7 12h10M10 17h4',
  'search': 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM16.5 16.5L21 21',
  'disc': 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  'person': 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5',
  'sliders': 'M4 7h9M17 7h3M4 17h3M11 17h9M15 4.5v5M9 14.5v5',
  'pencil': 'M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4',
  'trash': 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13',
  'check': 'M5 12.5l4.5 4.5L19 7',
  'image': 'M4 5h16v14H4zM4 16l5-5 4 4 2-2 5 5M15.5 9.5a1 1 0 1 0 0-.01',
  'close': 'M6 6l12 12M18 6L6 18',
  'logout': 'M10 5H5v14h5M14 8l4 4-4 4M18 12H9',
  'rotate': 'M4 12a8 8 0 1 0 2.5-5.8M4 4v4h4'
}
</script>

<template>
  <svg
    :width="props.size"
    :height="props.size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path :d="paths[props.name]" />
  </svg>
</template>
