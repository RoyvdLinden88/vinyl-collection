import type { RecordInput, SortKey, VinylRecord } from '~/types'

// Record-store convention: "The Beatles" is filed under B.
export const sortName = (name: string) => name.replace(/^the\s+/i, '').trim()

const compare = (a: string, b: string) => a.localeCompare(b, 'nl', { sensitivity: 'base', numeric: true })

export function sortRecords(records: VinylRecord[], key: SortKey) {
  return [...records].sort((a, b) => {
    if (key === 'added') return b.created_at.localeCompare(a.created_at)
    if (key === 'title') return compare(a.title, b.title) || compare(sortName(a.artist), sortName(b.artist))
    return compare(sortName(a.artist), sortName(b.artist))
      || (a.year ?? 9999) - (b.year ?? 9999)
      || compare(a.title, b.title)
  })
}

/**
 * The whole collection, loaded once and kept in memory so navigating back to
 * the overview is instant and keeps its scroll position.
 */
export function useRecords() {
  const { $supabase } = useNuxtApp()
  const records = useState<VinylRecord[]>('records', () => [])
  const loaded = useState('records-loaded', () => false)
  const error = useState<string | null>('records-error', () => null)

  const genres = computed(() =>
    [...new Set(records.value.flatMap(r => r.genres ?? []))].sort((a, b) => compare(a, b))
  )

  async function refresh() {
    const { data, error: err } = await $supabase.from('records').select('*')
    if (err) {
      error.value = err.message
      return
    }
    error.value = null
    records.value = data as VinylRecord[]
    loaded.value = true
  }

  async function ensureLoaded() {
    if (!loaded.value) await refresh()
  }

  async function save(input: RecordInput, id?: string) {
    const query = id
      ? $supabase.from('records').update(input).eq('id', id)
      : $supabase.from('records').insert(input)
    const { data, error: err } = await query.select().single()
    if (err) throw err
    const saved = data as VinylRecord
    records.value = id
      ? records.value.map(r => (r.id === id ? saved : r))
      : [...records.value, saved]
    return saved
  }

  async function remove(record: VinylRecord) {
    const { error: err } = await $supabase.from('records').delete().eq('id', record.id)
    if (err) throw err
    if (record.cover_path) await $supabase.storage.from('covers').remove([record.cover_path])
    records.value = records.value.filter(r => r.id !== record.id)
  }

  async function uploadCover(blob: Blob) {
    const path = `${crypto.randomUUID()}.jpg`
    const { error: err } = await $supabase.storage
      .from('covers')
      .upload(path, blob, { contentType: 'image/jpeg', cacheControl: '31536000' })
    if (err) throw err
    const { data } = $supabase.storage.from('covers').getPublicUrl(path)
    return { path, url: data.publicUrl }
  }

  async function removeCover(path: string) {
    await $supabase.storage.from('covers').remove([path])
  }

  return { records, genres, loaded, error, refresh, ensureLoaded, save, remove, uploadCover, removeCover }
}
