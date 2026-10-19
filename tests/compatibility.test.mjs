import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
const modelSource = await readFile(new URL('../docs/js/compatibility-model.js', import.meta.url), 'utf8');
const controller = await readFile(new URL('../docs/js/compatibility.js', import.meta.url), 'utf8');
const scope = {};
runInNewContext(modelSource, scope);
const model = scope.PortfolioCompatibility;

test('compatibility is checked against the old request and the exact fields the client reads', () => {
  const extra = model.check(model.scenarios.extra);
  assert.equal(extra.compatible, true);
  assert.equal(extra.payload.priority, 'normal');
  for (const change of ['rename', 'type']) {
    const result = model.check(model.scenarios[change]);
    assert.equal(result.compatible, false);
    assert.equal(result.status, '201 Created', 'A successful server response can still break decoding');
    assert.equal(result.stage, 'Client decoding');
  }
  const required = model.check(model.scenarios.required);
  assert.equal(required.compatible, false);
  assert.equal(required.status, '400 Bad Request');
  assert.equal(required.payload.fields.join(','), 'priority');
  assert.equal(required.stage, 'Request validation');
  assert.equal(model.check(model.scenarios.required, { ...model.request, priority: 'normal' }).compatible, true);
  assert.equal(model.check({ required: ['title'], response: { title: 'Task', id: '42', extra: {} } }).compatible, true);
  assert.equal(model.check({ required: ['title'], response: { title: 'Task', id: null } }).compatible, false);
});

test('scenario selection updates the visible verdict and payload without moving focus or starting playback', () => {
  let onChange;
  const elements = Object.fromEntries(['.compat-controls', '.compat-verdict', '.compat-explanation', '.compat-status', '.compat-payload', '.compat-required']
    .map(key => [key, { textContent: '', hidden: true, dataset: {} }]));
  const picker = { value: 'extra', addEventListener(name, fn) { assert.equal(name, 'change'); onChange = fn; } };
  const panel = { querySelector(selector) { return selector === 'select' ? picker : elements[selector]; } };
  runInNewContext(controller, { window: { PortfolioCompatibility: model }, document: { querySelector: () => panel } });
  assert.equal(elements['.compat-controls'].hidden, false);
  for (const [key, compatible] of [['rename', false], ['required', false], ['extra', true], ['type', false]]) {
    picker.value = key; onChange();
    const expected = model.check(model.scenarios[key]);
    assert.equal(elements['.compat-verdict'].dataset.compatible, String(compatible));
    assert.equal(elements['.compat-status'].textContent, expected.status);
    assert.equal(elements['.compat-payload'].textContent, JSON.stringify(expected.payload, null, 2));
    assert.ok(elements['.compat-verdict'].textContent.includes(expected.message));
  }
  picker.value = 'unknown'; onChange(); // Ignore an unrecognised value without corrupting the current result.
  assert.equal(elements['.compat-status'].textContent, '201 Created');
});

test('the static example explains its client assumptions and remains useful without scripts', async () => {
  const html = await readFile(new URL('../docs/index.html', import.meta.url), 'utf8');
  const section = html.match(/<section class="lab-panel compatibility-section"[\s\S]*?<\/section>/)[0];
  assert.match(section, /class="compat-controls" hidden/);
  assert.match(section, /role="status" aria-live="polite" aria-atomic="true"/);
  assert.match(section, /ignores extra response fields/);
  assert.match(section, /stricter client could reject extra fields/);
  assert.match(section, /validation returns 400/);
  assert.match(section, /"priority": "normal"/);
  assert.match(section, /href="case-keylane.html"/);
});
