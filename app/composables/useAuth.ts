import type { User } from '@supabase/supabase-js'

export function useAuth() {
  const { $supabase } = useNuxtApp()
  const user = useState<User | null>('auth-user', () => null)
  const ready = useState('auth-ready', () => false)

  async function init() {
    if (ready.value) return
    const { data } = await $supabase.auth.getSession()
    user.value = data.session?.user ?? null
    $supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null
    })
    ready.value = true
  }

  async function signIn(email: string, password: string) {
    const { error } = await $supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  async function signOut() {
    await $supabase.auth.signOut()
  }

  return { user, ready, init, signIn, signOut }
}
