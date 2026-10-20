import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
const source = await readFile(new URL('../docs/js/investigation-model.js', import.meta.url), 'utf8');
const controller = await readFile(new URL('../docs/js/investigation.js', import.meta.url), 'utf8');
const scope = {}; runInNewContext(source, scope);
const model = scope.PortfolioInvestigation;
const complete = trace => model.frame(trace, trace.events.length);

test('a committed operation survives a lost reply; a reused operation key avoids another effect', () => {
  const safe = model.simulate('duplicate'), unsafe = model.simulate('duplicate', false);
  const committed = safe.events.findIndex(event => event.write) + 1;
  assert.equal(model.frame(safe, committed).records, 1);
  assert.equal(model.frame(safe, committed + 1).status, 'Client timed out');
  assert.equal(complete(safe).records, 1);
  assert.equal(complete(unsafe).records, 2);
  assert.equal(complete(safe).attempts, 2);
  assert.equal(complete(unsafe).attempts, 2);
  assert.equal(safe.events.at(-1).payload.id, 'task-42');
  assert.equal(unsafe.events.at(-1).payload.id, 'task-43');
});
test('timeout, validation and service failure have distinct observable storage outcomes', () => {
  const slow = model.simulate('slow');
  const deadline = slow.events.findIndex(event => event.status === 'Client timed out') + 1;
  assert.equal(model.frame(slow, deadline).records, 0);
  assert.equal(complete(slow).records, 1);
  assert.equal(complete(slow).status, 'Client timed out');
  for (const [kind, status] of [['invalid', '400 Bad Request'], ['unavailable', '503 Service Unavailable']]) {
    const trace = model.simulate(kind);
    assert.equal(complete(trace).records, 0); assert.equal(complete(trace).status, status);
    assert.ok(!trace.events.some(event => event.write));
  }
  assert.equal(complete(model.simulate('valid')).status, '201 Created');
  assert.equal(complete(model.simulate('valid')).records, 1);
  for (const kind of Object.keys(model.scenarios)) {
    const trace = model.simulate(kind);
    let end = 0;
    for (const event of trace.events) { assert.ok(event.end >= event.start && event.end >= end); end = event.end; }
    assert.equal(trace.duration, end);
  }
  assert.throws(() => model.simulate('unknown'));
});

function fixture(hash = '#playground') {
  function node() {
    return { hidden: false, checked: true, value: '', textContent: '', attrs: {}, dataset: {}, children: [],
      style: { setProperty() {} }, setAttribute(k, v) { this.attrs[k] = v; },
      classList: { add() {}, remove() {} }, getBoundingClientRect() { return { top: 200, height: 72 }; },
      addEventListener(k, v) { this[k] = v; }, append(...items) { this.children.push(...items); },
      replaceChildren(...items) { this.children = items; }, scrollIntoView() { this.aligned = true; },
      querySelectorAll(selector) { return this.children.flatMap(child => [...(selector === 'button' && child.type === 'button' ? [child] : []), ...child.querySelectorAll(selector)]); } };
  }
  const names = ['scenario', 'protection', 'protection input', 'run', 'next', 'reset', 'events', 'attempts', 'records', 'elapsed', 'status', 'operation', 'detail', 'payload', 'lesson', 'controls', 'timeline', 'packet'];
  const nodes = Object.fromEntries(names.map(name => [`.trace-${name}`, node()]));
  nodes['.trace-scenario'].value = 'duplicate';
  nodes['.investigation-switch'] = node();
  const views = ['request-trace', 'compatibility-lab', 'access-lab'].map(id => ({ ...node(), id }));
  const buttons = views.map(view => ({ ...node(), dataset: { investigationView: view.id } }));
  const graph = ['client', 'api', 'service', 'store'].map(id => ({ ...node(), dataset: { traceNode: id }, querySelector: () => node() }));
  const panel = { ...node(), querySelector: selector => nodes[selector],
    querySelectorAll: selector => ({ '.investigation-view': views, '[data-investigation-view]': buttons, '[data-trace-node]': graph })[selector] };
  const events = new Map(), documentEvents = new Map(), timers = new Map(); let nextId = 0;
  const document = { hidden: false, createElement: node, querySelector: () => panel, addEventListener: (k, v) => documentEvents.set(k, v) };
  const window = { PortfolioInvestigation: model, location: { hash }, scrollY: 0, scrollTo() {}, matchMedia: () => ({ matches: true }),
    history: { replaceState() {} }, addEventListener: (k, v) => events.set(k, v) };
  runInNewContext(controller, { window, document, setTimeout(fn) { timers.set(++nextId, fn); return nextId; }, clearTimeout(id) { timers.delete(id); } });
  return { nodes, views, buttons, panel, events, documentEvents, document, timers,
    tick() { const entry = timers.entries().next().value; if (entry) { timers.delete(entry[0]); entry[1](); } } };
}
test('trace controls step, inspect and reset deterministic state; hidden views stop playback', () => {
  const f = fixture(), n = f.nodes;
  assert.equal(n['.trace-controls'].hidden, false);
  n['.trace-next'].click(); assert.equal(n['.trace-attempts'].textContent, 1);
  n['.trace-run'].click(); assert.equal(n['.trace-status'].attrs['aria-live'], 'off');
  f.tick(); f.buttons[1].click(); assert.equal(f.timers.size, 0);
  assert.equal(f.views[1].hidden, false);
  f.buttons[0].click(); n['.trace-reset'].click();
  n['.trace-protection input'].checked = false; n['.trace-protection input'].change();
  n['.trace-run'].click(); for (let i = 0; i < 12; i++) f.tick();
  assert.equal(n['.trace-records'].textContent, 2); assert.equal(n['.trace-next'].disabled, true);
  assert.equal(n['.trace-status'].attrs['aria-live'], 'polite');
  n['.trace-events'].children[0].children[0].click();
  assert.equal(n['.trace-records'].textContent, 0); assert.equal(n['.trace-operation'].textContent, 'Send request');
  n['.trace-scenario'].value = 'slow'; n['.trace-scenario'].change();
  assert.equal(n['.trace-records'].textContent, 0);
  n['.trace-run'].click(); f.document.hidden = true; f.documentEvents.get('visibilitychange')();
  assert.equal(f.timers.size, 0);
  f.document.hidden = false; n['.trace-run'].click(); f.panel['lab:hidden'](); assert.equal(f.timers.size, 0);
});
test('legacy contract links select the nested view, printing reveals both and restores without playback', () => {
  const f = fixture('#compatibility-lab');
  assert.deepEqual(f.views.map(view => view.hidden), [true, false, true]);
  f.events.get('beforeprint')(); assert.ok(f.views.every(view => !view.hidden));
  f.events.get('afterprint')(); assert.deepEqual(f.views.map(view => view.hidden), [true, false, true]);
  f.documentEvents.get('click')({ button: 0, target: { closest: () => ({ hash: '#playground', dataset: { investigationScenario: 'slow' } }) } });
  assert.equal(f.nodes['.trace-scenario'].value, 'slow');
  assert.deepEqual(f.views.map(view => view.hidden), [false, true, true]);
  assert.equal(f.timers.size, 0);
});
test('the server-rendered example includes the lost-reply explanation and complete trace without scripts', async () => {
  const html = await readFile(new URL('../docs/index.html', import.meta.url), 'utf8');
  assert.match(html, /Trace complete · 2 attempts · 1 record · 201 Created/);
  assert.match(html, /Store reuses the original result/);
  assert.match(html, /not a production benchmark/);
  assert.doesNotMatch(html, /local-clock|clock-time/);
});


test('access links select their nested view and stop trace playback', () => {
  const f = fixture('#access-lab');
  assert.deepEqual(f.views.map(view => view.hidden), [true, true, false]);
  f.buttons[0].click(); f.nodes['.trace-run'].click();
  f.documentEvents.get('click')({ button: 0, target: { closest: () => ({ hash: '#access-lab', dataset: {} }) } });
  assert.equal(f.timers.size, 0);
  assert.deepEqual(f.views.map(view => view.hidden), [true, true, false]);
  f.events.get('beforeprint')(); assert.ok(f.views.every(view => !view.hidden));
  f.events.get('afterprint')(); assert.deepEqual(f.views.map(view => view.hidden), [true, true, false]);
});
