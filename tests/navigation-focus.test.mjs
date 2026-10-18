import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';

const source = await readFile(new URL('../docs/js/scripts.js', import.meta.url), 'utf8');

function navigationFixture() {
  const events = new Map();
  const classes = new Set();
  const body = {};
  const document = {
    activeElement: body,
    documentElement: { scrollHeight: 1000 },
    addEventListener() {},
    getElementById() { return null; },
  };
  const makeFocusable = () => ({ focus() { document.activeElement = this; } });
  const link = makeFocusable();
  const menu = {
    ...makeFocusable(), hidden: true, expanded: 'false',
    getAttribute() { return this.expanded; },
    setAttribute(name, value) { if (name === 'aria-expanded') this.expanded = value; },
    querySelector() { return {}; },
    addEventListener(name, callback) { events.set('menu:' + name, callback); },
  };
  const nav = {
    contains(element) { return element === link; },
    querySelector() { return link; },
    querySelectorAll() { return []; },
    classList: { toggle() {} },
    addEventListener() {},
  };
  const header = {
    classList: { add(name) { classes.add(name); }, remove(name) { classes.delete(name); } },
    getBoundingClientRect() { return { height: 76 }; },
  };
  const media = { matches: false, addEventListener(name, callback) { events.set('media:' + name, callback); } };
  document.querySelector = selector => ({
    '.site-header': header, '.menu-toggle': menu, '#primary-navigation': nav,
  })[selector] || null;
  runInNewContext(source, {
    document,
    window: { matchMedia: () => media, location: { hash: '' }, scrollY: 0, addEventListener() {} },
  });
  return { document, body, link, menu, media, classes, events };
}

test('navigation transfers keyboard focus before a responsive control disappears', () => {
  const f = navigationFixture();
  f.link.focus();
  f.media.matches = true;
  f.events.get('media:change')();
  assert.equal(f.document.activeElement, f.menu);
  assert.equal(f.menu.hidden, false);
  assert.ok(f.classes.has('menu-enhanced'));
  f.media.matches = false;
  f.events.get('media:change')();
  assert.equal(f.document.activeElement, f.link);
  assert.equal(f.menu.hidden, true);
  assert.ok(!f.classes.has('menu-enhanced'));
});

test('responsive navigation does not take focus from the rest of the page', () => {
  const f = navigationFixture();
  f.media.matches = true;
  f.events.get('media:change')();
  assert.equal(f.document.activeElement, f.body);
  f.media.matches = false;
  f.events.get('media:change')();
  assert.equal(f.document.activeElement, f.body);
});
