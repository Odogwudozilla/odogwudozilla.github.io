import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
const source = await readFile(new URL('../docs/js/demo-help.js', import.meta.url), 'utf8');
function fixture() {
  const events = {}, panelEvents = {};
  const icon = { attrs: {}, setAttribute(k, v) { this.attrs[k] = v; }, addEventListener(k, v) { this[k] = v; } };
  const help = { hidden: true, open: false, querySelector: () => icon,
    classList: { toggle(_, value) { help.open = value; } },
    addEventListener(k, v) { this[k] = v; }, contains: target => target === icon || target === help,
    closest: () => ({ addEventListener(k, v) { panelEvents[k] = v; } }) };
  runInNewContext(source, { document: { querySelectorAll: () => [help], addEventListener(k, v) { events[k] = v; } } });
  return { help, icon, events, panelEvents };
}
test('demo explanations support hover, focus, Escape and moving onto the tooltip', () => {
  const { help, icon, events } = fixture();
  assert.equal(help.hidden, false);
  help.pointerenter({ pointerType: 'mouse' }); assert.equal(help.open, true);
  events.keydown({ key: 'Escape' }); assert.equal(help.open, false);
  help.pointerleave(); assert.equal(help.open, false);
  help.focusin(); assert.equal(help.open, true);
  help.focusout({ relatedTarget: help }); assert.equal(help.open, true);
  help.focusout({ relatedTarget: null }); assert.equal(help.open, false);
  assert.equal(icon.attrs['aria-expanded'], undefined, 'The informational icon is not an expandable action');
});
test('touch can pin and dismiss explanations; hiding a demo clears pinned help', () => {
  const { help, icon, events, panelEvents } = fixture();
  help.pointerenter({ pointerType: 'touch' }); assert.equal(help.open, false);
  help.focusin(); icon.click(); assert.equal(help.open, true);
  icon.click(); assert.equal(help.open, false);
  icon.click(); events.pointerdown({ target: null }); assert.equal(help.open, false);
  icon.click(); panelEvents['lab:hidden'](); assert.equal(help.open, false);
});
