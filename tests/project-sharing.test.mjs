import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { caseStudies } from '../scripts/case-studies.mjs';
const html = await readFile(new URL('../docs/index.html', import.meta.url), 'utf8');

test('each overview offers one descriptive native case-study link without duplicate copy controls', () => {
  for (const project of caseStudies) {
    const card = html.match(new RegExp(`<article[^>]*id="${project.id}"[\\s\\S]*?</article>`))?.[0];
    assert.ok(card);
    assert.equal([...card.matchAll(/<a /g)].length, 1);
    assert.ok(card.includes(`href="${project.file}" aria-label="Read case study: `));
    assert.doesNotMatch(card, /<details|copy-project-link|project-share-status/);
  }
});
test('overview links lead to the canonical case pages and every page links back to its overview', async () => {
  for (const project of caseStudies) {
    const page = await readFile(new URL('../docs/' + project.file, import.meta.url), 'utf8');
    assert.ok(page.includes(`href="https://odogwudozilla.com/${project.file}"`));
    assert.ok(page.includes(`href="/#${project.id}"`));
  }
});
