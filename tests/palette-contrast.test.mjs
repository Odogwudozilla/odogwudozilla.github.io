import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const base = await readFile(new URL('../docs/css/base.css', import.meta.url), 'utf8');
const navy = await readFile(new URL('../docs/css/keylane-theme.css', import.meta.url), 'utf8');
const tokens = css => Object.fromEntries([...css.matchAll(/--([\w-]+):\s*(#[\da-f]{6});/gi)]
  .map(([, name, value]) => [name, value]));
const tealTokens = tokens(base);
const themes = { Teal: tealTokens, Navy: { ...tealTokens, ...tokens(navy) } };

function luminance(hex) {
  const linear = hex.slice(1).match(/../g).map(channel => {
    const value = Number.parseInt(channel, 16) / 255;
    return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4;
  });
  return linear[0] * .2126 + linear[1] * .7152 + linear[2] * .0722;
}
function contrast(a, b) {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + .05) / (values[1] + .05);
}

for (const [theme, palette] of Object.entries(themes)) {
  test(`${theme} text, filled controls and footer retain minimum contrast`, () => {
    const pairs = ['paper', 'surface', 'section-soft'].flatMap(background =>
      ['ink', 'muted', 'teal'].map(foreground => [foreground, background]));
    pairs.push(['action-ink', 'action'], ['hover-ink', 'hover-bg'],
      ['on-dark', 'teal'], ['muted-dark', 'teal']);
    for (const [foreground, background] of pairs) {
      const ratio = contrast(palette[foreground], palette[background]);
      assert.ok(ratio >= 4.5, `${theme} ${foreground}/${background}: ${ratio.toFixed(2)}:1`);
    }
  });
  test(`${theme} light-surface focus, navigation and dark-footer focus exceed 3:1`, () => {
    for (const background of ['paper', 'surface', 'section-soft']) {
      assert.ok(contrast(palette.teal, palette[background]) >= 3);
    }
    assert.ok(contrast(palette['on-dark'], palette.teal) >= 3);
  });
}
