import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
const source = await readFile(new URL('../docs/js/access-model.js', import.meta.url), 'utf8');
const controller = await readFile(new URL('../docs/js/access.js', import.meta.url), 'utf8');
const scope = {}; runInNewContext(source, scope);
const { decide } = scope.PortfolioAccess;

test('access policy covers every role, workspace, action and record state without administrator scope bypass', () => {
  for (const role of ['anonymous', 'reviewer', 'editor', 'admin']) {
    for (const workspace of ['own', 'other']) for (const action of ['read', 'publish']) for (const state of ['draft', 'archived']) {
      const result = decide({ role, workspace, action, state });
      const expected = role !== 'anonymous' && workspace === 'own' && (action === 'read' || (role === 'admin' && state === 'draft'));
      assert.equal(result.allowed, expected, JSON.stringify({ role, workspace, action, state }));
      assert.equal(result.status.slice(0, 3), expected ? '200' : role === 'anonymous' ? '401' : workspace === 'other' || role !== 'admin' ? '403' : '409');
      const stopped = result.checks.findIndex(check => check.outcome === 'STOP');
      assert.equal(stopped >= 0, !expected);
      if (stopped >= 0) assert.ok(result.checks.slice(stopped + 1).every(check => check.outcome === 'NOT RUN'));
    }
  }
});

test('unknown and missing context permits no operation and does not reuse a previous grant', () => {
  const valid = { role: 'admin', workspace: 'own', action: 'publish', state: 'draft' };
  assert.equal(decide(valid).allowed, true);
  for (const context of [undefined, null, {}, ...Object.keys(valid).flatMap(key => [{ ...valid, [key]: undefined }, { ...valid, [key]: 'unknown' }])]) {
    assert.equal(decide(context).allowed, false);
    assert.equal(decide(context).status, '400 Bad Request');
  }
  assert.equal(decide(valid).allowed, true);
});

test('changing context replaces a prior allow result and explains the blocked effect', () => {
  const controls = Object.entries({ role: 'admin', workspace: 'own', action: 'publish', state: 'draft' })
    .map(([key, value]) => ({ dataset: { accessContext: key }, value, addEventListener(_, callback) { this.change = callback; } }));
  const node = () => ({ textContent: '', dataset: {}, children: [], append(...items) { this.children.push(...items); }, replaceChildren(...items) { this.children = items; } });
  const verdict = node(), checks = node(), effect = node(), form = { hidden: true };
  runInNewContext(controller, {
    window: { PortfolioAccess: scope.PortfolioAccess },
    document: { createElement: node, querySelector: () => ({ querySelectorAll: () => controls,
      querySelector: selector => ({ '.access-verdict': verdict, '.access-checks': checks, '.access-effect': effect, '.access-controls': form })[selector] }) },
  });
  assert.equal(form.hidden, false);
  assert.match(verdict.textContent, /^ALLOW/); assert.match(effect.textContent, /Would publish/);
  controls[1].value = 'other'; controls[1].change();
  assert.match(verdict.textContent, /^BLOCK/); assert.equal(verdict.dataset.allowed, 'false');
  assert.match(effect.textContent, /The record is neither read nor changed/);
  assert.deepEqual(checks.children.map(item => item.dataset.outcome), ['PASS', 'STOP', 'NOT RUN', 'NOT RUN']);
  controls[1].value = 'own'; controls[3].value = 'archived'; controls[3].change();
  assert.match(verdict.textContent, /409 Conflict/);
  controls[2].value = 'read'; controls[2].change();
  assert.match(verdict.textContent, /^ALLOW/); assert.match(effect.textContent, /without changing it/);
});


test('script-free access example agrees with the model and distinguishes illustration from enforcement', async () => {
  const html = await readFile(new URL('../docs/partials/access-section.html', import.meta.url), 'utf8');
  const example = decide({ role: 'editor', workspace: 'own', action: 'publish', state: 'draft' });
  assert.ok(html.includes(`BLOCK · ${example.status}. ${example.reason}`));
  assert.deepEqual([...html.matchAll(/data-outcome="([^"]+)"/g)].map(match => match[1]), Array.from(example.checks, check => check.outcome));
  assert.match(html, /class="access-controls" hidden/);
  assert.match(html, /no real accounts, network requests or saved changes/);
  assert.match(html, /check permissions on the server for every request/);
});
