/**
 * The characteristic colour of an image: an average weighted towards saturated
 * pixels, so a red sleeve on a white background comes out red rather than pink.
 */
export function dominantColor(source: CanvasImageSource): string {
  const size = 32
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!
  ctx.drawImage(source, 0, 0, size, size)
  const { data } = ctx.getImageData(0, 0, size, size)

  let r = 0, g = 0, b = 0, total = 0
  for (let i = 0; i < data.length; i += 4) {
    const pr = data[i]!, pg = data[i + 1]!, pb = data[i + 2]!
    const max = Math.max(pr, pg, pb)
    const min = Math.min(pr, pg, pb)
    const saturation = max === 0 ? 0 : (max - min) / max
    const weight = 0.05 + saturation * saturation
    r += pr * weight
    g += pg * weight
    b += pb * weight
    total += weight
  }
  const hex = (v: number) => Math.round(v / total).toString(16).padStart(2, '0')
  return `#${hex(r)}${hex(g)}${hex(b)}`
}

/** Black or white, whichever reads better on top of `hex`. */
export function readableOn(hex: string): '#000' | '#fff' {
  const n = Number.parseInt(hex.slice(1), 16)
  const [r, g, b] = [n >> 16, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }) as [number, number, number]
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return luminance > 0.18 ? '#000' : '#fff'
}
