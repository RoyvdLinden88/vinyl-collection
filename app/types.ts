export interface Track {
  title: string
  duration?: string
}

export interface Side {
  name: string
  tracks: Track[]
}

export interface VinylRecord {
  id: string
  created_at: string
  artist: string
  title: string
  year: number | null
  genres: string[]
  sides: Side[]
  purchased_at: string | null
  notes: string | null
  cover_url: string | null
  cover_path: string | null
  cover_color: string | null
}

export type RecordInput = Omit<VinylRecord, 'id' | 'created_at'>

/** A cropped cover chosen in the form, not yet uploaded. */
export interface PickedCover {
  blob: Blob
  previewUrl: string
  color: string
}

export type SortKey = 'artist' | 'title' | 'added'
