import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';

const source = await readFile(new URL('../docs/js/interactive.js', import.meta.url), 'utf8');
const html = await readFile(new URL('../docs/index.html', import.meta.url), 'utf8');

function fixture(instant = '2026-10-19T12:26:00Z', intl = Intl) {
  const makeNode = () => ({ hidden: true, textContent: '', children: [],
    append(node) { this.children.push(node); }, replaceChildren() { this.children = []; } });
  const projects = ['insurance-case', 'fusion-project', 'energy-project', 'aoc-project'].map(id => {
    const intro = makeNode();
    return { id, intro, matched: false,
      classList: { toggle(_, value) { projects.find(item => item.id === id).matched = value; } },
      querySelector: selector => selector === 'h3' ? { textContent: id } : intro };
  });
  const buttons = ['all', 'java', 'apis', 'frontend', 'data'].map(focus => ({
    dataset: { focus }, textContent: focus, pressed: String(focus === 'all'),
    setAttribute(_, value) { this.pressed = value; }, getAttribute() { return this.pressed; },
    addEventListener(_, handler) { this.click = handler; },
  }));
  const status = makeNode(), results = makeNode(), time = makeNode(), index = makeNode();
  const angles = {};
  const clock = { hidden: true, querySelector: () => time,
    style: { setProperty: (key, value) => { angles[key] = value; } } };
  const explorer = { hidden: true, querySelectorAll: () => buttons,
    querySelector: selector => selector === '.explorer-status' ? status : results };
  const events = new Map();
  let activeTimers = 0;
  const document = { hidden: false, createElement: makeNode,
    getElementById: id => projects.find(item => item.id === id),
    querySelector: selector => ({ '.local-clock': clock, '.project-explorer': explorer, '.work-index': index })[selector],
    addEventListener: (event, handler) => events.set(event, handler) };
  class FixedDate extends Date { constructor() { super(instant); } }
  runInNewContext(source, { document, Intl: intl, Date: FixedDate,
    setInterval() { activeTimers++; return true; },
    clearInterval(timer) { if (timer) activeTimers--; } });
  return { projects, buttons, status, results, clock, time, angles, events, document, explorer, index,
    timers: () => activeTimers };
}

test('project focus highlights evidence without hiding projects or changing disclosures', () => {
  assert.match(html, /class="project-explorer" hidden/);
  const f = fixture();
  assert.equal(f.explorer.hidden, false);
  f.buttons[3].click();
  assert.deepEqual(f.projects.map(item => item.matched), [false, true, true, false]);
  assert.match(f.status.textContent, /^2 projects/);
  assert.equal(f.buttons.filter(item => item.pressed === 'true').length, 1);
  f.buttons[3].click();
  assert.equal(f.projects.filter(item => item.matched).length, 2);
  f.buttons[1].click();
  assert.equal(f.projects.filter(item => item.matched).length, 4);
  f.buttons[0].click();
  assert.ok(f.projects.every(item => !item.matched && item.intro.children[0].hidden));
  assert.equal(f.status.textContent, 'All four projects are shown.');
});

test('Netherlands clock follows daylight-saving time and suspends updates in hidden pages', () => {
  const summer = fixture();
  assert.equal(summer.time.textContent, '14:26');
  assert.equal(summer.angles['--minute-angle'], '156deg');
  assert.equal(fixture('2026-12-19T12:26:00Z').time.textContent, '13:26');
  assert.equal(summer.timers(), 1);
  summer.document.hidden = true;
  summer.events.get('visibilitychange')();
  assert.equal(summer.timers(), 0);
  summer.document.hidden = false;
  summer.events.get('visibilitychange')();
  assert.equal(summer.timers(), 1);
});

test('unsupported time-zone formatting leaves clock hidden while explorer still works', () => {
  const f = fixture(undefined, { DateTimeFormat() { throw new Error('Unsupported'); } });
  assert.equal(f.clock.hidden, true);
  assert.equal(f.explorer.hidden, false);
  f.buttons[2].click();
  assert.equal(f.projects.filter(item => item.matched).length, 3);
});
