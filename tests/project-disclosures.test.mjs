import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';

const source = await readFile(new URL('../docs/js/scripts.js', import.meta.url), 'utf8');
const html = await readFile(new URL('../docs/index.html', import.meta.url), 'utf8');

function fixture(hash = '') {
  const events = new Map();
  const makeDetails = open => ({ open, addEventListener(_, handler) { this.toggle = handler; } });
  const cases = [false, false, false, false].map(makeDetails);
  const experience = makeDetails(false);
  const status = { textContent: '' };
  const attributes = new Map();
  const button = { textContent: '', setAttribute: (name, value) => attributes.set(name, value),
    addEventListener(_, handler) { this.click = handler; } };
  const controls = { hidden: true, querySelector: selector =>
    selector === '[data-case-toggle]' ? button : status };
  const portfolio = { querySelectorAll: () => cases };
  const project = { matches: () => true, querySelector: () => cases[0] };
  const location = { hash };
  runInNewContext(source, {
    window: { location, addEventListener: (event, handler) => events.set(event, handler) },
    document: {
      querySelector: selector => ({ '#portfolio': portfolio, '.case-controls': controls })[selector] || null,
      getElementById: id => id === 'insurance-case' ? project : null,
      addEventListener() {},
      querySelectorAll: () => [...cases, experience].filter(details => !details.open),
    },
  });
  return { cases, experience, status, button, attributes, controls, events, location };
}

test('bulk project controls are progressive enhancements with a labelled target and live count', () => {
  assert.match(html, /class="case-controls" hidden role="group" aria-label="Project case studies"/);
  assert.equal([...html.matchAll(/aria-controls="project-cases"/g)].length, 1);
  assert.match(html, /class="work-grid" id="project-cases"/);
  assert.match(html, /class="case-controls-status" role="status" aria-live="polite" aria-atomic="true"/);
  const f = fixture();
  assert.equal(f.controls.hidden, false);
  assert.equal(f.button.textContent, 'Expand All');
  assert.equal(f.attributes.get('aria-expanded'), 'false');
  assert.equal(f.status.textContent, '0 of 4 case studies expanded.');
});

test('expand and collapse affect only projects, including a mixed manual state', () => {
  const f = fixture();
  f.cases[0].open = true;
  f.cases[0].toggle();
  assert.equal(f.status.textContent, '1 of 4 case studies expanded.');
  f.button.click();
  assert.ok(f.cases.every(details => details.open));
  assert.equal(f.experience.open, false);
  assert.equal(f.status.textContent, '4 of 4 case studies expanded.');
  assert.equal(f.button.textContent, 'Collapse All');
  assert.equal(f.attributes.get('aria-expanded'), 'true');
  f.experience.open = true;
  f.button.click();
  assert.ok(f.cases.every(details => !details.open));
  assert.equal(f.experience.open, true);
  assert.equal(f.status.textContent, '0 of 4 case studies expanded.');
});

test('fresh and subsequent project deep links remain reflected in the count', () => {
  const f = fixture('#insurance-case');
  assert.equal(f.status.textContent, '1 of 4 case studies expanded.');
  f.button.click();
  f.button.click();
  f.events.get('hashchange')();
  f.cases[0].toggle();
  assert.equal(f.cases[0].open, true);
  assert.equal(f.status.textContent, '1 of 4 case studies expanded.');
});

test('printing preserves mixed choices without announcing temporary expansion', () => {
  const f = fixture('#insurance-case');
  f.events.get('beforeprint')();
  for (const details of f.cases) details.toggle();
  assert.equal(f.status.textContent, '1 of 4 case studies expanded.');
  f.events.get('afterprint')();
  for (const details of f.cases) details.toggle();
  assert.deepEqual(f.cases.map(details => details.open), [true, false, false, false]);
  assert.equal(f.status.textContent, '1 of 4 case studies expanded.');
});

test('the single action follows manual changes and repeated activation', () => {
  const f = fixture();
  f.button.click();
  f.cases[2].open = false;
  f.cases[2].toggle();
  assert.equal(f.button.textContent, 'Expand All');
  assert.equal(f.attributes.get('aria-expanded'), 'false');
  f.button.click();
  assert.ok(f.cases.every(details => details.open));
  assert.equal(f.button.textContent, 'Collapse All');
  f.button.click();
  assert.ok(f.cases.every(details => !details.open));
  assert.equal(f.button.textContent, 'Expand All');
  assert.equal(f.attributes.get('aria-expanded'), 'false');
});
