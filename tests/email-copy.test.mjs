import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';

const source = await readFile(new URL('../docs/js/scripts.js', import.meta.url), 'utf8');

function fixture(writeText) {
  const attributes = new Map();
  const status = { textContent: 'Previous result' };
  const button = {
    hidden: true, dataset: { email: 'public@example.com' },
    setAttribute: (name, value) => attributes.set(name, value),
    removeAttribute: name => attributes.delete(name),
    addEventListener(_, handler) { this.click = handler; },
    set disabled(value) { if (value) document.activeElement = null; },
  };
  const document = {
    activeElement: button,
    querySelector: selector => ({ '.copy-email': button, '.copy-status': status })[selector] || null,
    getElementById: () => null, addEventListener() {},
  };
  runInNewContext(source, {
    document, navigator: { clipboard: writeText ? { writeText } : undefined },
    window: { location: { hash: '' }, addEventListener() {} },
  });
  return { button, status, attributes, document };
}

test('email copying retains focus while pending and ignores duplicate activation', async () => {
  let finish;
  const copied = [];
  const f = fixture(value => { copied.push(value); return new Promise(resolve => { finish = resolve; }); });
  assert.equal(f.button.hidden, false);
  const pending = f.button.click();
  assert.equal(f.status.textContent, '');
  assert.equal(f.attributes.get('aria-busy'), 'true');
  assert.equal(f.document.activeElement, f.button);
  await f.button.click();
  assert.deepEqual(copied, ['public@example.com']);
  finish();
  await pending;
  assert.equal(f.status.textContent, 'Email address copied.');
  assert.equal(f.attributes.has('aria-busy'), false);
  assert.equal(f.document.activeElement, f.button);
});

test('email clipboard failure leaves a fallback and permits a focused retry', async () => {
  let attempts = 0;
  const f = fixture(async () => { if (++attempts === 1) throw Error('Denied'); });
  await f.button.click();
  assert.match(f.status.textContent, /Could not copy.*email link/);
  assert.equal(f.attributes.has('aria-busy'), false);
  assert.equal(f.document.activeElement, f.button);
  await f.button.click();
  assert.equal(f.status.textContent, 'Email address copied.');
  assert.equal(attempts, 2);
  assert.equal(f.document.activeElement, f.button);
});

test('email copy enhancement stays hidden without clipboard support', () => {
  assert.equal(fixture().button.hidden, true);
});
