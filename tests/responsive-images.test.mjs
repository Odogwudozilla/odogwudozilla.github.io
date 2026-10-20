import assert from 'node:assert/strict';
import { stat, mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { caseStudies } from '../scripts/case-studies.mjs';

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
  for (const page of ['index.html', 'index-modular.html', 'keylane.html', 'original.html', '404.html', ...caseStudies.map(project => project.file)]) {
    const html = await readFile(path.join(publicRoot, page), 'utf8');
    const checked = await checkResponsiveImages(html, publicRoot, page);
    if (['index.html','index-modular.html','keylane.html','original.html','case-fusion-almere-fc.html'].includes(page)) assert.ok(checked > 0, `${page}: expected responsive images`);
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

test('portraits offer compact WebP and JPEG candidates without delaying the above-fold image', async () => {
  const html = await readFile(path.join(publicRoot, 'index.html'), 'utf8');
  const picture = html.match(/<picture>([\s\S]*?)<\/picture>/)[1];
  const source = picture.match(/<source\b[^>]+>/)[0];
  const img = picture.match(/<img\b[^>]+>/)[0];
  assert.match(source, /type="image\/webp"/);
  assert.match(img, /fetchpriority="high"/);
  assert.doesNotMatch(img, /loading="lazy"/);
  assert.match(img, /width="512" height="550"/);
  assert.equal(source.match(/sizes="([^"]+)"/)[1], img.match(/sizes="([^"]+)"/)[1]);
  for (const format of ['webp', 'jpg']) {
    const element = format === 'webp' ? source : img;
    for (const width of [128, 256, 512, 768]) assert.ok(element.includes(`profile-professional-${width}.${format} ${width}w`));
    assert.ok((await stat(path.join(publicRoot, `assets/img/profile-professional-128.${format}`))).size < 6000);
    const medium = await stat(path.join(publicRoot, `assets/img/profile-professional-256.${format}`));
    const large = await stat(path.join(publicRoot, `assets/img/profile-professional-512.${format}`));
    assert.ok(medium.size < large.size / 2, 'The mobile candidate should save at least half the full-size transfer');
  }
});

test('the deferred club screenshot offers smaller candidates and keeps reserved dimensions', async () => {
  const html = await readFile(path.join(publicRoot, 'case-fusion-almere-fc.html'), 'utf8');
  const picture = html.match(/<picture>([\s\S]*?)<\/picture>/)[1];
  assert.match(picture, /sizes="/);
  assert.match(picture, /loading="lazy" decoding="async"/);
  assert.match(picture, /width="1265" height="712"/);
  const original = await stat(path.join(publicRoot, 'assets/img/fusion-platform-preview.webp'));
  for (const width of [440, 880]) {
    const name = `fusion-platform-preview-${width}.webp`;
    assert.ok(picture.includes(`${name} ${width}w`));
    assert.ok((await stat(path.join(publicRoot, `assets/img/${name}`))).size < original.size);
  }
});
