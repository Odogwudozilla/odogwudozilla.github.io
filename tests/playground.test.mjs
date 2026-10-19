import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';

const source = await readFile(new URL('../docs/js/playground.js', import.meta.url), 'utf8');
const html = await readFile(new URL('../docs/partials/playground-section.html', import.meta.url), 'utf8');

function fixture(mobile = false) {
  const node = () => ({ textContent: '', hidden: true, dataset: {}, attrs: {},
    setAttribute(key, value) { this.attrs[key] = value; },
    removeAttribute(key) { delete this.attrs[key]; },
    addEventListener(event, handler) { this[event] = handler; } });
  const nodes = Object.fromEntries(['controls', 'run', 'next', 'reset', 'progress', 'title',
    'explanation', 'request', 'response-label', 'response', 'payload-tabs'].map(name => [`.flow-${name}`, node()]));
  nodes['.flow-scenario-picker select'] = node();
  const payloadButtons = ['request', 'response'].map(payload => ({ ...node(), dataset: { payload } }));
  const buttons = ['valid', 'invalid', 'unavailable'].map(scenario => ({ ...node(), dataset: { scenario } }));
  const stages = Array.from({ length: 4 }, () => {
    const state = node();
    return { ...node(), state, querySelector: () => state };
  });
  const events = new Map(), timers = new Map();
  let id = 0;
  const root = { dataset: {}, classList: { add() {} }, scrolls: 0,
    getBoundingClientRect: () => ({ top: 400 }), querySelector: selector => nodes[selector],
    querySelectorAll: selector => ({ '[data-scenario]': buttons, '[data-flow-stage]': stages,
      '[data-payload]': payloadButtons, '.flow-payload pre': [] })[selector] };
  const document = { hidden: false,
    querySelector: selector => selector === '.site-header' ? { getBoundingClientRect: () => ({ height: 72 }) } : root,
    addEventListener: (name, handler) => events.set(name, handler) };
  runInNewContext(source, { document, window: { scrollY: 0, scrollTo(options) { root.scrolls++; root.scrollTop = options.top; },
    addEventListener: (name, callback) => events.set(name, callback),
    matchMedia: query => ({ matches: query.includes('max-width') && mobile }) },
    setTimeout(callback) { timers.set(++id, callback); return id; },
    clearTimeout(key) { timers.delete(key); } });
  const tick = () => {
    const entry = timers.entries().next().value;
    if (entry) { timers.delete(entry[0]); entry[1](); }
  };
  return { nodes, buttons, stages, timers, events, document, tick, root, payloadButtons,
    next: () => nodes['.flow-next'].click(),
    response: () => nodes['.flow-response'].textContent };
}

test('valid request shows a response only after validation and service processing', () => {
  const f = fixture();
  assert.equal(f.nodes['.flow-controls'].hidden, false);
  assert.match(f.response(), /No response yet/);
  f.next(); f.next();
  assert.match(f.response(), /No response yet/);
  f.next();
  assert.match(f.response(), /201 Created\nLocation: \/demo\/tasks\/demo-1042/);
  assert.equal(JSON.parse(f.response().split('\n\n')[1]).id, 'demo-1042');
  assert.deepEqual(f.stages.map(item => item.attrs['aria-current']), [undefined, undefined, undefined, 'step']);
  f.next();
  assert.match(f.nodes['.flow-progress'].textContent, /Step 1 of 4/);
});

test('mobile playback reveals the response, aligns the workspace and keeps scenario controls in sync', () => {
  const f = fixture(true);
  const picker = f.nodes['.flow-scenario-picker select'];
  picker.value = 'unavailable'; picker.change();
  assert.equal(f.buttons[2].attrs['aria-pressed'], 'true');
  assert.equal(f.root.dataset.payload, 'request');
  f.nodes['.flow-run'].click();
  assert.equal(f.root.dataset.payload, 'response');
  assert.equal(f.root.scrolls, 1);
  assert.equal(f.root.scrollTop, 316);
  f.tick(); f.tick(); f.tick();
  assert.match(f.response(), /503 Service Unavailable/);
  f.payloadButtons[0].click();
  assert.equal(f.root.dataset.payload, 'request');
  f.nodes['.flow-reset'].click();
  assert.equal(f.root.dataset.payload, 'request');
  f.next();
  assert.equal(f.root.dataset.payload, 'response');
  assert.equal(f.root.scrolls, 2);
});

test('invalid input skips processing and returns an actionable field error without a task ID', () => {
  const f = fixture();
  f.buttons[1].click();
  assert.match(f.nodes['.flow-request'].textContent, /"title": ""/);
  f.next(); f.next(); f.next();
  assert.equal(f.stages[1].dataset.state, 'failed');
  assert.equal(f.stages[2].dataset.state, 'skipped');
  assert.match(f.response(), /400 Bad Request/);
  const body = JSON.parse(f.response().split('\n\n')[1]);
  assert.equal(body.field, 'title');
  assert.equal(body.id, undefined);
  assert.equal(f.buttons.filter(button => button.attrs['aria-pressed'] === 'true').length, 1);
});

test('temporary failure returns retry guidance while keeping validation successful', () => {
  const f = fixture();
  f.buttons[2].click();
  f.next(); f.next(); f.next();
  assert.equal(f.stages[1].dataset.state, 'complete');
  assert.equal(f.stages[2].dataset.state, 'failed');
  assert.match(f.response(), /503 Service Unavailable\nRetry-After: 30/);
  assert.match(f.nodes['.flow-explanation'].textContent, /idempotency/);
  assert.equal(JSON.parse(f.response().split('\n\n')[1]).id, undefined);
});

test('playback pauses, resets and switches scenarios without stale callbacks or advancing hidden pages', () => {
  const f = fixture();
  const run = f.nodes['.flow-run'];
  run.click(); f.tick();
  assert.match(f.nodes['.flow-progress'].textContent, /Step 2/);
  run.click();
  assert.equal(f.timers.size, 0);
  run.click(); f.buttons[1].click(); f.tick();
  assert.match(f.nodes['.flow-progress'].textContent, /Step 1/);
  run.click(); f.nodes['.flow-reset'].click(); f.tick();
  assert.match(f.nodes['.flow-progress'].textContent, /Step 1/);
  run.click(); f.document.hidden = true; f.events.get('visibilitychange')();
  assert.equal(f.timers.size, 0);
  assert.match(run.textContent, /Run flow/);
  f.document.hidden = false;
  run.click(); f.tick(); f.tick(); f.tick();
  assert.equal(f.timers.size, 0);
  assert.match(f.response(), /400 Bad Request/);
  run.click(); f.events.get('beforeprint')();
  assert.equal(f.timers.size, 0);
});

test('no-script content explains all three outcomes and contains a complete success example', () => {
  assert.match(html, /class="flow-controls" hidden/);
  assert.match(html, /<details class="flow-notes">\s*<summary>Why these responses\?<\/summary>/);
  assert.match(html, /201 Created/);
  assert.match(html, /400 · Bad Request/);
  assert.match(html, /503 · Service Unavailable/);
  assert.match(html, /No requests are sent and no tasks are stored/);
  assert.doesNotMatch(source, /\bfetch\s*\(|XMLHttpRequest|localStorage|sessionStorage/);
});
