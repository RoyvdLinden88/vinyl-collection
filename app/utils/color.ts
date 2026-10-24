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
