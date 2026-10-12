import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { test } from 'node:test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../docs/', import.meta.url));
const html = await readFile(path.join(root, 'index.html'), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
const refs = [...html.matchAll(/\b(?:href|src)="([^"]+)"/g)]
  .map(match => match[1]);

test('the published HTML is complete before JavaScript runs', () => {
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(html, /<main id="main"/);
  assert.match(html, /<html lang="en"(?: class="theme-keylane")?>/);
  for (const id of [
    'home', 'portfolio', 'insurance-case', 'experience', 'skills',
    'about', 'education', 'contact',
  ]) {
    assert.ok(ids.includes(id), `Missing section: ${id}`);
  }
  assert.match(html, /Reliable software/);
  assert.match(html, /Fusion Almere FC/);
  assert.match(html, /HomeWizard Energy Intelligence/);
  assert.match(html, /Advent of Code, with a toolkit/);
  assert.match(html, /mailto:odogwu.naija@gmail.com/);
  assert.doesNotMatch(html, /\{\{|components-loader|container"><\/div>/);
  assert.doesNotMatch(html, /onclick=|alert\(|coming soon|style="width:/i);
  assert.doesNotMatch(html, /<script[^>]+src="https?:/);
});

test('all internal anchors resolve and IDs are unique', () => {
  assert.equal(new Set(ids).size, ids.length);
  for (const ref of refs.filter(value => value.startsWith('#'))) {
    assert.ok(ids.includes(ref.slice(1)), `Broken anchor: ${ref}`);
  }
});

test('local assets exist within the public folder', async () => {
  const local = refs.filter(ref => !/^(#|https?:|mailto:)/.test(ref));
  for (const ref of local) {
    const target = path.resolve(root, ref);
    assert.ok(!path.relative(root, target).startsWith('..'));
    await access(target);
  }
});

test('case studies use native disclosures with descriptive summaries', () => {
  const details = [...html.matchAll(/<details\b[\s\S]*?<\/details>/g)];
  assert.equal(details.length, 4);
  for (const [markup] of details) {
    assert.match(markup, /<summary>Explore [\s\S]+?<\/summary>/);
    assert.match(markup, /<h4>The challenge<\/h4>/);
    assert.match(markup, /<h4>My part<\/h4>/);
  }
});

test('curated projects have valid anchors and public-facing access labels', () => {
  for (const id of ['fusion-project', 'energy-project', 'aoc-project']) {
    assert.ok(ids.includes(id), `Missing project anchor: ${id}`);
  }
  assert.doesNotMatch(html, /href="https:\/\/github.com\/Odogwudozilla\/(homewizard|fusion-almere-fc)"/);
  assert.match(html, /href="https:\/\/github.com\/Odogwudozilla\/adventOfCode"/);
  assert.match(html, /Public test site · MVP in development/);
  assert.match(html, /Illustrative view · no household data/);
  assert.doesNotMatch(html, /id="portfolio"[\s\S]*?Field data, brought together/);
});

test('the legacy modular entry point renders the same complete site', async () => {
  assert.equal(await readFile(path.join(root, 'index-modular.html'), 'utf8'), html);
});

test('Keylane descriptions stay at the level of professional responsibilities', () => {
  const keylane = html.match(/<article[^>]+id="insurance-case">([\s\S]*?)<\/article>/)?.[1];
  assert.ok(keylane, 'Missing Keylane overview');
  assert.doesNotMatch(keylane, /\bQSD-\d+|@keylane\.com|\\\\|href="https?:|\d+(?:\.\d+)?%/i);
  assert.match(keylane, /requirements and acceptance criteria/);
  assert.match(keylane, /Authentication, authorisation/);
});

test('professional experience leads the portfolio and drafting context stays unpublished', () => {
  const work = html.match(/<div class="work-grid">([\s\S]*?)<div class="work-colophon">/)?.[1];
  assert.ok(work);
  assert.match(work, /^\s*<article[^>]+id="insurance-case">/);
  assert.match(html, /Sep 2019 — Present/);
  assert.doesNotMatch(html, /keylane-portfolio-public-safe-context\.md/);
});

test('the selected palette is default and the original comparison retains shared content', async () => {
  assert.match(html, /class="theme-keylane"/);
  assert.match(html, /href="css\/keylane-theme.css"/);
  assert.doesNotMatch(html, /name="robots" content="noindex"|Colour study/);
  assert.equal(await readFile(path.join(root, 'keylane.html'), 'utf8'), html);
  const alternate = await readFile(path.join(root, 'original.html'), 'utf8');
  assert.doesNotMatch(alternate, /class="theme-keylane"/);
  assert.match(alternate, /href="css\/keylane-theme.css"/);
  assert.match(alternate, /name="robots" content="noindex"/);
  assert.equal(alternate.match(/<main[\s\S]*?<\/main>/)?.[0], html.match(/<main[\s\S]*?<\/main>/)?.[0]);
  const alternateIds = [...alternate.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(alternateIds).size, alternateIds.length);
  for (const [, ref] of alternate.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    if (ref.startsWith('#')) assert.ok(alternateIds.includes(ref.slice(1)), `Broken alternate anchor: ${ref}`);
    else if (!/^(https?:|mailto:)/.test(ref)) await access(path.join(root, ref));
  }
});
