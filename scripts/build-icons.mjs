/** Optional asset maintenance: node scripts/build-icons.mjs /absolute/path/to/sharp
 * The static build needs no image package; it uses these checked-in outputs.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

const sharp = createRequire(import.meta.url)(process.argv[2] || 'sharp');
const root = new URL('../docs/', import.meta.url);
const svg = await readFile(new URL('favicon.svg', root));
const background = svg.toString().match(/<rect\b[^>]*fill="([^"]+)"/)[1];
const png = size => sharp(svg, { density: 768 }).resize(size, size)
  .flatten({ background }).png().toBuffer();

for (const [name, size] of [['favicon-32.png', 32], ['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]]) {
  await writeFile(new URL(name, root), await png(size));
}

const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map(png));
const directory = Buffer.alloc(6 + sizes.length * 16);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(sizes.length, 4);
let offset = directory.length;
for (const [index, bytes] of images.entries()) {
  const entry = 6 + index * 16;
  directory[entry] = sizes[index];
  directory[entry + 1] = sizes[index];
  directory.writeUInt16LE(1, entry + 4);
  directory.writeUInt16LE(32, entry + 6);
  directory.writeUInt32LE(bytes.length, entry + 8);
  directory.writeUInt32LE(offset, entry + 12);
  offset += bytes.length;
}
await writeFile(new URL('favicon.ico', root), Buffer.concat([directory, ...images]));
console.log('Generated opaque bookmark and home-screen icons from docs/favicon.svg.');
