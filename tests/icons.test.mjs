import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { caseStudies } from '../scripts/case-studies.mjs';

const root = new URL('../docs/', import.meta.url);
const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
function checkPng(bytes, size) {
  assert.deepEqual(bytes.subarray(0, 8), pngSignature);
  assert.equal(bytes.toString('ascii', 12, 16), 'IHDR');
  assert.equal(bytes.readUInt32BE(16), size);
  assert.equal(bytes.readUInt32BE(20), size);
  assert.equal(bytes[25], 2, 'Icons use opaque RGB pixels');
}

test('bookmark and home-screen icons have their advertised sizes and valid formats', async () => {
  for (const [name, size] of [['favicon-32.png', 32], ['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]]) {
    const bytes = await readFile(new URL(name, root));
    checkPng(bytes, size);
    assert.ok(bytes.length < 30_000, `${name} should remain small`);
  }
  const ico = await readFile(new URL('favicon.ico', root));
  assert.equal(ico.readUInt16LE(0), 0);
  assert.equal(ico.readUInt16LE(2), 1);
  assert.equal(ico.readUInt16LE(4), 3);
  for (const [index, size] of [16, 32, 48].entries()) {
    const entry = 6 + index * 16;
    assert.equal(ico[entry], size);
    assert.equal(ico[entry + 1], size);
    const length = ico.readUInt32LE(entry + 8);
    const offset = ico.readUInt32LE(entry + 12);
    assert.ok(offset + length <= ico.length);
    checkPng(ico.subarray(offset, offset + length), size);
  }
});

test('all generated pages advertise root-relative bookmark and home-screen assets', async () => {
  for (const name of ['index.html', 'index-modular.html', 'keylane.html', 'original.html', '404.html', ...caseStudies.map(project => project.file)]) {
    const html = await readFile(new URL(name, root), 'utf8');
    for (const declaration of [
      '<link rel="icon" type="image/x-icon" href="/favicon.ico" sizes="16x16 32x32 48x48">',
      '<link rel="icon" type="image/png" href="/favicon-32.png" sizes="32x32">',
      '<link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180">',
      '<link rel="manifest" href="/site.webmanifest">',
    ]) assert.ok(html.includes(declaration), `${name}: ${declaration}`);
    assert.match(html, /rel="icon" type="image\/svg\+xml" href="\/?favicon.svg" sizes="any"/);
  }
});

test('the home-screen manifest uses local icons and opens the public homepage in a browser', async () => {
  const manifest = JSON.parse(await readFile(new URL('site.webmanifest', root), 'utf8'));
  assert.equal(manifest.start_url, '/');
  assert.equal(manifest.id, '/');
  assert.equal(manifest.display, 'browser');
  assert.ok(manifest.name.includes('Chidozie Nnachor'));
  assert.deepEqual(manifest.icons.map(icon => icon.sizes), ['192x192', '512x512']);
  for (const icon of manifest.icons) {
    assert.equal(icon.type, 'image/png');
    assert.equal(icon.purpose, 'any');
    assert.ok(icon.src.startsWith('/') && !icon.src.startsWith('//'));
    checkPng(await readFile(new URL(icon.src.slice(1), root)), Number.parseInt(icon.sizes));
  }
});
