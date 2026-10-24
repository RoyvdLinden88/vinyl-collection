import type { Side, Track } from '~/types'

const DURATION = /^(.*?)[\s\-–—]*\(?(\d{1,2}:\d{2})\)?$/
// "A1 ", "B2 ", "1. ", "3) " — but not a title like "1999".
const POSITION = /^(?:[A-Za-z]\d{1,2}|\d{1,2}[.)])\s+/

/** One track per line, optionally ending in a duration: "Song Title 3:45". */
export function parseTracks(text: string): Track[] {
  return text
    .split('\n')
    .map(line => line.trim().replace(POSITION, ''))
    .filter(Boolean)
    .map((line) => {
      const match = line.match(DURATION)
      return match && match[1] ? { title: match[1].trim(), duration: match[2] } : { title: line }
    })
}

export function formatTracks(tracks: Track[]): string {
  return tracks.map(t => (t.duration ? `${t.title}  ${t.duration}` : t.title)).join('\n')
}

export function nextSideName(sides: Pick<Side, 'name'>[]): string {
  const last = sides.at(-1)?.name
  if (!last || !/^[A-Y]$/.test(last)) return 'A'
  return String.fromCharCode(last.charCodeAt(0) + 1)
}
