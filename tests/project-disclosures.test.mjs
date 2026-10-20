import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
const html = await readFile(new URL('../docs/index.html', import.meta.url), 'utf8');

test('project overviews are concise native links rather than nested disclosures', () => {
  assert.doesNotMatch(html, /class="work-index"|class="case-controls"|data-case-toggle|explorer-results|<details class="case-details/);
  assert.equal([...html.matchAll(/class="project-case-link text-link"/g)].length, 4);
});
test('existing project and skills fragments remain reachable in server-rendered HTML', () => {
  for (const id of ['insurance-case', 'fusion-project', 'energy-project', 'product-watch-project']) {
    assert.ok(html.includes(`id="${id}"`));
  }
  assert.match(html, /<span class="fragment-alias" id="skills" aria-hidden="true"><\/span>/);
  assert.doesNotMatch(html, /id="skills-title"|Skills &amp; tools|capabilities-section/);
});
test('all former skill groups have visible evidence within Work and Projects', () => {
  const work = html.match(/<section[^>]*id="portfolio"[\s\S]*?<\/section>/)[0];
  for (const skill of ['Java', 'SQL', 'Spring Boot', 'REST APIs', 'SOAP', 'OpenAPI',
    'Angular', 'React', 'TypeScript', 'PostgreSQL', 'Supabase', 'Playwright', 'Git', 'IntelliJ IDEA', 'CI/CD']) {
    assert.ok(work.includes(skill), `Lost skill: ${skill}`);
  }
  assert.match(work, /authorisation, database migrations and automated testing/);
  assert.match(work, /Story refinement, code review, technical notes and release documentation/);
});
