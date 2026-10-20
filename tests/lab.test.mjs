import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
const source = await readFile(new URL('../docs/js/lab.js', import.meta.url), 'utf8');
function fixture(hash = '') {
  const events = new Map(), documentEvents = new Map(), history = [];
  const panels = ['playground', 'search-lab'].map(id => ({ id, hidden: false, paused: 0, aligned: 0,
    scrollIntoView() { this.aligned++; },
    contains(target) { return target?.panelId === id; }, dispatchEvent() { this.paused++; } }));
  const buttons = panels.map(panel => ({ dataset: { labSelect: panel.id },
    setAttribute(_, value) { this.pressed = value; }, addEventListener(_, callback) { this.click = callback; } }));
  const contract = { panelId: 'playground', aligned: 0, scrollIntoView() { this.aligned++; } };
  const makeControl = () => ({ hidden: true, open: false, aligned: 0, focus() { this.focused = true; },
    scrollIntoView() { this.aligned++; }, addEventListener(name, handler) { this[name] = handler; } });
  const switcher = makeControl(), shell = makeControl(), gateway = makeControl(), content = makeControl(), location = { hash };

  runInNewContext(source, {
    Event: class { constructor(type) { this.type = type; } },
    window: { location, history: { replaceState(_, __, value) { history.push(value); }, pushState(_, __, value) { history.push(value); } },
      addEventListener: (name, callback) => events.set(name, callback) },
    document: { querySelector: () => ({ querySelectorAll: selector => selector === '.lab-panel' ? panels : buttons,
      querySelector: selector => ({ '.lab-switch': switcher, '.lab-shell': shell, '.lab-gateway': gateway, '.lab-content': content })[selector] }),
      getElementById: id => panels.find(panel => panel.id === id) || (['compatibility-lab', 'access-lab', 'access-title'].includes(id) ? contract : null) || (id === 'search-title' ? { panelId: 'search-lab' } : null),
      addEventListener: (name, callback) => documentEvents.set(name, callback) },
  });
  return { shell, gateway, content, contract, events, documentEvents, panels, buttons, switcher, location, history };
}
test('the Lab shows one demo and respects existing direct and nested fragments', () => {
  const f = fixture();
  assert.deepEqual(f.panels.map(panel => panel.hidden), [false, true]);
  assert.equal(f.switcher.hidden, false);
  for (const hash of ['#search-lab', '#search-title']) {
    assert.deepEqual(fixture(hash).panels.map(panel => panel.hidden), [true, false]);
  }
  for (const hash of ['#compatibility-lab', '#access-lab', '#access-title']) {
    assert.deepEqual(fixture(hash).panels.map(panel => panel.hidden), [false, true]);
  }
});

test('direct demo links align after initial layout without overriding a later navigation', () => {
  const f = fixture('#compatibility-lab');
  f.events.get('load')();
  assert.equal(f.gateway.aligned, 1);
  assert.equal(f.shell.open, false);
  const moved = fixture('#compatibility-lab');
  moved.location.hash = '#portfolio';
  moved.events.get('load')();
  assert.equal(moved.gateway.aligned, 0);
  assert.equal(fixture().events.has('load'), false);
});
test('switching pauses hidden demos, keeps one selection and updates links without forcing a scroll', () => {
  const f = fixture();
  const pauses = f.panels[0].paused;
  f.buttons[1].click();
  assert.deepEqual(f.panels.map(panel => panel.hidden), [true, false]);
  assert.equal(f.panels[0].paused, pauses + 1);
  assert.deepEqual(f.buttons.map(button => button.pressed), ['false', 'true']);
  assert.deepEqual(f.history, ['#search-lab']);
  f.location.hash = '#playground'; f.events.get('hashchange')();
  assert.deepEqual(f.panels.map(panel => panel.hidden), [false, true]);
  f.documentEvents.get('click')({ button: 0, preventDefault() {}, target: { closest: () => ({ hash: '#search-lab', dataset: {} }) } });
  assert.deepEqual(f.panels.map(panel => panel.hidden), [true, false]);
  const previousPauses = f.panels[1].paused;
  f.buttons[0].click();
  assert.deepEqual(f.panels.map(panel => panel.hidden), [false, true]);
  assert.equal(f.panels[1].paused, previousPauses + 1);
});
test('printing reveals all demos and restores selection; static HTML retains trace, contracts and search', async () => {
  const f = fixture('#search-lab');
  f.events.get('beforeprint')();
  assert.ok(f.panels.every(panel => !panel.hidden));
  f.events.get('afterprint')();
  assert.deepEqual(f.panels.map(panel => panel.hidden), [true, false]);
  const html = await readFile(new URL('../docs/index.html', import.meta.url), 'utf8');
  assert.match(html, /<section class="lab-panel investigation-section" id="playground"/);
  assert.match(html, /<section class="lab-panel search-section" id="search-lab"/);
  assert.match(html, /<section class="investigation-view compatibility-section" id="compatibility-lab"/);
  assert.equal([...html.matchAll(/download="Chidozie-Nnachor-CV.pdf"/g)].length, 1);
  assert.doesNotMatch(html, /hero-facts|View CV \(PDF\)/);
});


test('the Lab stays collapsed on loading or changing fragments and only explicit actions open it', () => {
  const f = fixture('#access-lab');
  assert.equal(f.shell.open, false); assert.equal(f.content.hidden, true);
  f.shell.open = true; f.shell.toggle(); // Native fragment reveal must not override the choice.
  assert.equal(f.shell.open, false);
  f.gateway.click({ preventDefault() {} });
  assert.equal(f.shell.open, true); assert.equal(f.content.hidden, false);
  f.gateway.click({ preventDefault() {} });
  const pauses = f.panels[0].paused;
  f.documentEvents.get('click')({ button: 0, preventDefault() {}, target: { closest: () => ({ hash: '#playground', dataset: { labOpen: 'true' } }) } });
  assert.equal(f.shell.open, true);
  f.gateway.click({ preventDefault() {} });
  assert.ok(f.panels[0].paused > pauses); assert.equal(f.content.hidden, true);
  f.location.hash = '#search-lab'; f.events.get('hashchange')();
  assert.equal(f.shell.open, false);
  f.events.get('beforeprint')(); assert.equal(f.shell.open, true);
  f.events.get('afterprint')(); assert.equal(f.shell.open, false); assert.equal(f.content.hidden, true);
  f.gateway.click({ preventDefault() {} });
  f.events.get('beforeprint')(); f.events.get('afterprint')(); assert.equal(f.shell.open, true);
});
