import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';

const source = await readFile(new URL('../docs/js/scripts.js', import.meta.url), 'utf8');
const html = await readFile(new URL('../docs/index.html', import.meta.url), 'utf8');
function fixture(hash = '') {
  const events = new Map(), documentEvents = new Map(), details = { open: false };
  const project = { matches: () => true, querySelector: () => details };
  const location = { hash };
  runInNewContext(source, {
    window: { location, addEventListener: (name, callback) => events.set(name, callback) },
    document: {
      querySelector: () => null, querySelectorAll: () => [],
      getElementById: id => id === 'fusion-project' ? project : null,
      addEventListener: (name, callback) => documentEvents.set(name, callback),
    },
  });
  return { details, events, documentEvents, location };
}
test('project shortcuts and bulk expansion are removed while native case disclosures remain', () => {
  assert.doesNotMatch(html, /class="work-index"|class="case-controls"|data-case-toggle|explorer-results/);
  assert.equal([...html.matchAll(/<details class="case-details/g)].length, 4);
});
test('fresh and changed project fragments still reveal their native disclosure', () => {
  assert.equal(fixture('#fusion-project').details.open, true);
  const f = fixture();
  f.location.hash = '#fusion-project'; f.events.get('hashchange')();
  assert.equal(f.details.open, true);
  f.location.hash = '#%ZZ'; f.events.get('hashchange')();
  assert.equal(f.details.open, true);
});
test('same-fragment clicks still reveal a case after a reader closes it', () => {
  const f = fixture('#fusion-project');
  f.details.open = false;
  f.documentEvents.get('click')({ target: { closest: () => ({ hash: '#fusion-project' }) },
    button: 0, defaultPrevented: false });
  assert.equal(f.details.open, true);
});
