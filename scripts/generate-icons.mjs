// Renders public/favicon.svg into the PNG icons iOS, Android and browsers need.
// Usage: npm run icons
import sharp from 'sharp'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const svg = await readFile(new URL('../public/favicon.svg', import.meta.url))

const icons = [
  ['apple-touch-icon.png', 180],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
  ['favicon-32.png', 32]
]

for (const [name, size] of icons) {
  await sharp(svg, { density: 300 })
    .resize(size, size)
    .png()
    .toFile(fileURLToPath(new URL(`../public/${name}`, import.meta.url)))
  console.log(`public/${name}`)
}
