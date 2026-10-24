<script setup lang="ts">
const { records, loaded, ensureLoaded } = useRecords()
const { user, signOut } = useAuth()
const query = ref('')

const visible = computed(() => {
  const q = query.value.trim().toLowerCase()
  const sorted = sortRecords(records.value, 'added')
  return q ? sorted.filter(r => `${r.artist} ${r.title}`.toLowerCase().includes(q)) : sorted
})

onMounted(ensureLoaded)
</script>

<template>
  <main class="page">
    <AuthGate>
      <div class="topbar">
        <span class="account ellipsis">{{ user?.email }}</span>
        <div class="pill-group glass">
          <button type="button" class="icon-btn" aria-label="Uitloggen" @click="signOut">
            <AppIcon name="logout" :size="20" />
          </button>
          <NuxtLink to="/beheer/nieuw" class="icon-btn" aria-label="Plaat toevoegen">
            <AppIcon name="plus" />
          </NuxtLink>
        </div>
      </div>

      <h1 class="large-title">Beheer</h1>
      <p class="subtitle">Tik op een plaat om hem te bewerken.</p>

      <NuxtLink to="/beheer/nieuw" class="btn primary block add">
        <AppIcon name="plus" :size="20" /> Nieuwe plaat
      </NuxtLink>

      <label class="search">
        <AppIcon name="search" :size="18" />
        <input v-model="query" type="search" placeholder="Zoeken" enterkeyhint="search">
      </label>

      <p v-if="loaded && !visible.length" class="empty">Geen platen.</p>
      <div v-else class="card">
        <NuxtLink v-for="record in visible" :key="record.id" :to="`/beheer/${record.id}`" class="list-row">
          <img v-if="record.cover_url" class="thumb" :src="record.cover_url" alt="" loading="lazy">
          <div v-else class="thumb" />
          <div class="text">
            <div class="primary-text ellipsis">{{ record.title }}</div>
            <div class="secondary-text ellipsis">{{ record.artist }}<template v-if="record.year"> · {{ record.year }}</template></div>
          </div>
          <AppIcon name="pencil" class="chevron" :size="18" />
        </NuxtLink>
      </div>
    </AuthGate>
  </main>
</template>

<style scoped>
.account { color: var(--text-2); font-size: 14px; }
.add { margin-bottom: 16px; }
</style>
