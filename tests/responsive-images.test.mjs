import assert from 'node:assert/strict';
import { stat, mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const publicRoot = fileURLToPath(new URL('../docs/', import.meta.url));

/** Check repository-owned image candidates, including ones a browser may not select. */
async function checkResponsiveImages(html, root, page) {
  let checked = 0;
  for (const [, value] of html.matchAll(/<(?:img|source)\b[^>]*\bsrcset="([^"]+)"[^>]*>/g)) {
    for (const candidate of value.split(',')) {
      const ref = candidate.trim().split(/\s+/)[0];
      assert.ok(ref, `${page}: empty responsive image candidate`);
      assert.ok(!/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(ref), `${page}: expected a local image: ${ref}`);
      const pathname = decodeURIComponent(ref.split(/[?#]/)[0]);
      const target = path.resolve(root, pathname.replace(/^\//, ''));
      assert.ok(!path.relative(root, target).startsWith('..') && !path.isAbsolute(path.relative(root, target)),
        `${page}: responsive image escapes public folder: ${ref}`);
      try {
        assert.ok((await stat(target)).isFile());
      } catch {
        assert.fail(`${page}: missing responsive image: ${ref}`);
      }
      checked++;
    }
  }
  return checked;
}

test('all generated pages contain reachable responsive image candidates', async () => {
  for (const page of ['index.html', 'index-modular.html', 'keylane.html', 'original.html', '404.html']) {
    const html = await readFile(path.join(publicRoot, page), 'utf8');
    const checked = await checkResponsiveImages(html, publicRoot, page);
    if (page !== '404.html') assert.ok(checked > 0, `${page}: expected responsive images`);
  }
});

test('responsive image checks cover every candidate, density descriptors and versioned root paths', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'portfolio-srcset-'));
  try {
    await mkdir(path.join(root, 'img'));
    await writeFile(path.join(root, 'img/small.webp'), 'fixture');
    await writeFile(path.join(root, 'img/large.webp'), 'fixture');
    const html = '<picture><source srcset="img/small.webp 128w,\n /img/large.webp?v=abc 256w">'
      + '<img srcset="img/small.webp 1x, img/large.webp 2x"></picture>';
    assert.equal(await checkResponsiveImages(html, root, 'fixture.html'), 4);
    await rm(path.join(root, 'img/large.webp'));
    await assert.rejects(checkResponsiveImages(html, root, 'fixture.html'),
      /fixture.html: missing responsive image: \/img\/large.webp\?v=abc/);
  } finally {
    assert.equal(path.dirname(path.resolve(root)), path.resolve(os.tmpdir()));
    assert.ok(path.basename(root).startsWith('portfolio-srcset-'));
    await rm(root, { recursive: true, force: true });
  }
});

test('responsive image checks reject paths outside the public folder', async () => {
  await assert.rejects(checkResponsiveImages('<img srcset="%2e%2e/private.webp 2x">', publicRoot, 'fixture.html'),
    /responsive image escapes public folder/);
});
