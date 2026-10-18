import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';

const source = await readFile(new URL('../docs/js/scripts.js', import.meta.url), 'utf8');
const html = await readFile(new URL('../docs/index.html', import.meta.url), 'utf8');
const projects = ['insurance-case', 'fusion-project', 'energy-project', 'aoc-project'];

function fixture(writeText) {
  const controls = projects.map(id => {
    const attributes = new Map();
    const button = { hidden: true, setAttribute: (k, v) => attributes.set(k, v),
      removeAttribute: k => attributes.delete(k),
      addEventListener: (_, handler) => { button.click = handler; } };
    const status = { textContent: '' };
    return { id, button, status, attributes,
      querySelector: selector => selector === '.copy-project-link' ? button : status };
  });
  const portfolio = { querySelectorAll: () => controls };
  runInNewContext(source, {
    URL, navigator: { clipboard: writeText ? { writeText } : undefined },
    window: { location: { hash: '' }, addEventListener() {} },
    document: {
      querySelector: selector => selector === '#portfolio' ? portfolio
        : selector === 'link[rel="canonical"]' ? { href: 'https://odogwudozilla.com/' } : null,
      getElementById: () => null, addEventListener() {},
    },
  });
  return controls;
}

test('every project retains a native direct link and initially hidden copy control', () => {
  for (const id of projects) {
    const card = html.match(new RegExp(`<article[^>]*id="${id}"[\\s\\S]*?</article>`))?.[0];
    assert.match(card, new RegExp(`class="text-link" href="#${id}" aria-label="Direct link to `));
    assert.match(card, /class="button copy-project-link" type="button" hidden aria-label="Copy link to /);
    assert.match(card, /class="project-share-status" role="status" aria-live="polite"/);
  }
  assert.ok(fixture().every(({ button }) => button.hidden));
});

test('copying uses each public canonical project URL and announces completion', async () => {
  const copied = [];
  const controls = fixture(async value => copied.push(value));
  for (const control of controls) {
    assert.equal(control.button.hidden, false);
    await control.button.click();
    assert.equal(control.status.textContent, 'Project link copied.');
    assert.equal(control.attributes.has('aria-busy'), false);
  }
  assert.deepEqual(copied, projects.map(id => `https://odogwudozilla.com/#${id}`));
});

test('clipboard rejection gives a usable fallback and permits retry', async () => {
  let attempts = 0;
  const [control] = fixture(async () => { if (++attempts === 1) throw Error('Denied'); });
  await control.button.click();
  assert.match(control.status.textContent, /Could not copy.*direct link/);
  await control.button.click();
  assert.equal(control.status.textContent, 'Project link copied.');
});

test('repeated clicks during a pending write do not start duplicate requests', async () => {
  let finish, calls = 0;
  const [control] = fixture(() => { calls++; return new Promise(resolve => { finish = resolve; }); });
  const pending = control.button.click();
  await control.button.click();
  assert.equal(calls, 1);
  assert.equal(control.attributes.get('aria-busy'), 'true');
  finish();
  await pending;
  assert.equal(control.attributes.has('aria-busy'), false);
});
