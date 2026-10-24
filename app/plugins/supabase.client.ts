import { createClient } from '@supabase/supabase-js'

export default defineNuxtPlugin(() => {
  const { supabaseUrl, supabaseKey } = useRuntimeConfig().public
  const supabase = createClient(supabaseUrl as string, supabaseKey as string)
  return { provide: { supabase } }
})
