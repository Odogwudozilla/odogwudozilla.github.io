import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';

const source = await readFile(new URL('../docs/js/interactive.js', import.meta.url), 'utf8');
const html = await readFile(new URL('../docs/index.html', import.meta.url), 'utf8');

function fixture() {
  const makeNode = () => ({ hidden: true, textContent: '', children: [],
    append(node) { this.children.push(node); }, replaceChildren() { this.children = []; } });
  const projects = ['product-watch-project', 'insurance-case', 'fusion-project', 'energy-project'].map(id => {
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
  const status = makeNode(), results = makeNode(), index = makeNode();
  const explorer = { hidden: true, querySelectorAll: () => buttons,
    querySelector: selector => selector === '.explorer-status' ? status : results };
  const events = new Map();
  const document = { hidden: false, createElement: makeNode,
    getElementById: id => projects.find(item => item.id === id),
    querySelector: selector => ({ '.project-explorer': explorer, '.work-index': index })[selector],
    addEventListener: (event, handler) => events.set(event, handler) };
  runInNewContext(source, { document });
  return { projects, buttons, status, explorer };
}

test('project focus highlights evidence without hiding projects or changing disclosures', () => {
  assert.match(html, /class="project-explorer" hidden/);
  const f = fixture();
  assert.equal(f.explorer.hidden, false);
  f.buttons[3].click();
  assert.deepEqual(f.projects.map(item => item.matched), [true, false, true, true]);
  assert.match(f.status.textContent, /^3 projects/);
  assert.equal(f.buttons.filter(item => item.pressed === 'true').length, 1);
  f.buttons[3].click();
  assert.equal(f.projects.filter(item => item.matched).length, 3);
  f.buttons[1].click();
  assert.equal(f.projects.filter(item => item.matched).length, 3);
  f.buttons[0].click();
  assert.ok(f.projects.every(item => !item.matched && item.intro.children[0].hidden));
  assert.equal(f.status.textContent, 'All four projects are shown.');
});
