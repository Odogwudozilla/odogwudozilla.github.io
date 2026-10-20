import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';

test('the engineering decision card uses model outcomes and links to the matching investigation', async () => {
  const scope = {};
  for (const file of ['investigation-model', 'compatibility-model']) {
    runInNewContext(await readFile(new URL(`../docs/js/${file}.js`, import.meta.url), 'utf8'), scope);
  }
  const nodes = Object.fromEntries(['select', 'a', '.decision-question', '.decision-outcome', 'label'].map(key => [key, { dataset: {}, hidden: true, textContent: '', value: 'duplicate', addEventListener(_, fn) { this.change = fn; } }]));
  const route = Array.from({ length: 3 }, () => ({ textContent: '' }));
  const card = { querySelector: key => nodes[key], querySelectorAll: () => route };
  runInNewContext(await readFile(new URL('../docs/js/engineering-decision.js', import.meta.url), 'utf8'), {
    window: scope, document: { querySelector: () => card },
  });
  assert.equal(nodes.label.hidden, false);
  assert.equal(nodes['.decision-outcome'].textContent, '2 attempts. 1 saved record.');
  assert.equal(nodes.a.dataset.investigationScenario, 'duplicate');
  nodes.select.value = 'rename'; nodes.select.change();
  assert.equal(nodes.a.href, '#compatibility-lab');
  assert.equal(nodes.a.dataset.investigationScenario, undefined);
  assert.equal(nodes['.decision-outcome'].textContent, 'Valid JSON. Broken client.');
  nodes.select.value = 'slow'; nodes.select.change();
  assert.equal(nodes.a.href, '#playground');
  assert.equal(nodes.a.dataset.investigationScenario, 'slow');
  assert.equal(nodes['.decision-outcome'].textContent, 'Timed out. 1 record still saved.');
});
