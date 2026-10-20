import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
const source = await readFile(new URL('../docs/js/demo-help.js', import.meta.url), 'utf8');
function fixture() {
  const events = {}, panelEvents = {};
  const button = { attrs: {}, setAttribute(k, v) { this.attrs[k] = v; }, addEventListener(k, v) { this[k] = v; } };
  const help = { hidden: true, open: false, querySelector: () => button,
    classList: { toggle(_, value) { help.open = value; } },
    addEventListener(k, v) { this[k] = v; }, contains: target => target === button || target === help,
    closest: () => ({ addEventListener(k, v) { panelEvents[k] = v; } }) };
  runInNewContext(source, { document: { querySelectorAll: () => [help], addEventListener(k, v) { events[k] = v; } } });
  return { help, button, events, panelEvents };
}
test('demo explanations support hover, focus, Escape and moving onto the tooltip', () => {
  const { help, button, events } = fixture();
  assert.equal(help.hidden, false);
  help.pointerenter({ pointerType: 'mouse' }); assert.equal(help.open, true);
  events.keydown({ key: 'Escape' }); assert.equal(help.open, false);
  help.pointerleave(); assert.equal(help.open, false);
  help.focusin(); assert.equal(help.open, true);
  help.focusout({ relatedTarget: help }); assert.equal(help.open, true);
  help.focusout({ relatedTarget: null }); assert.equal(help.open, false);
  assert.equal(button.attrs['aria-expanded'], 'false');
});
test('touch can pin and dismiss explanations; hiding a demo clears pinned help', () => {
  const { help, button, events, panelEvents } = fixture();
  help.pointerenter({ pointerType: 'touch' }); assert.equal(help.open, false);
  help.focusin(); button.click(); assert.equal(help.open, true);
  button.click(); assert.equal(help.open, false);
  button.click(); events.pointerdown({ target: null }); assert.equal(help.open, false);
  button.click(); panelEvents['lab:hidden'](); assert.equal(help.open, false);
});
