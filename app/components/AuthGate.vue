<script setup lang="ts">
// Renders its slot for signed-in users, and a sign-in form for everyone else.
const { user, ready, init, signIn } = useAuth()

const email = ref('')
const password = ref('')
const error = ref<string | null>(null)
const busy = ref(false)

onMounted(init)

async function submit() {
  busy.value = true
  error.value = null
  try {
    await signIn(email.value.trim(), password.value)
  } catch {
    error.value = 'Inloggen mislukt. Controleer je e-mailadres en wachtwoord.'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <slot v-if="user" />
  <form v-else-if="ready" class="login" @submit.prevent="submit">
    <h1 class="large-title">Inloggen</h1>
    <p class="subtitle">Log in om je collectie te beheren.</p>
    <label class="field">
      <span>E-mail</span>
      <input v-model="email" class="input" type="email" autocomplete="username" required>
    </label>
    <label class="field">
      <span>Wachtwoord</span>
      <input v-model="password" class="input" type="password" autocomplete="current-password" required>
    </label>
    <p v-if="error" class="error-text">{{ error }}</p>
    <button class="btn primary block" :disabled="busy">Inloggen</button>
  </form>
</template>

<style scoped>
.login { max-width: 420px; padding-top: 24px; }
</style>
