import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';

const modelSource = await readFile(new URL('../docs/js/search-model.js', import.meta.url), 'utf8');
const controller = await readFile(new URL('../docs/js/search.js', import.meta.url), 'utf8');
const context = { window: {} };
runInNewContext(modelSource, context);
const { boards, search } = context.window.PortfolioSearch;

test('the two-route example demonstrates shortest-path BFS and branch-first DFS honestly', () => {
  const before = JSON.stringify(boards);
  assert.equal(search(boards.routes, 'bfs').at(-1).route.length - 1, 8);
  assert.equal(search(boards.routes, 'dfs').at(-1).route.length - 1, 12);
  assert.equal(search(boards.open, 'bfs').at(-1).route.length - 1, 6);
  assert.equal(search(boards.blocked, 'bfs').at(-1).route.length, 0);
  assert.equal(search(boards.blocked, 'dfs').at(-1).route.length, 0);
  assert.equal(JSON.stringify(boards), before);
});

test('search frames never revisit cells, cross walls or produce disconnected routes', () => {
  for (const board of Object.values(boards)) for (const algorithm of ['bfs', 'dfs']) {
    const frames = search(board, algorithm);
    assert.equal(frames.at(-1).done, true);
    for (const frame of frames) {
      assert.equal(new Set(frame.visited).size, frame.visited.length);
      assert.equal(new Set(frame.pending).size, frame.pending.length);
      assert.ok(frame.visited.every(cell => !board.walls.includes(cell)));
      assert.ok(frame.pending.every(cell => !frame.visited.includes(cell) && !board.walls.includes(cell)));
      frame.route.forEach((cell, index) => {
        assert.ok(!board.walls.includes(cell));
        if (index) {
          const previous = frame.route[index - 1];
          assert.equal(Math.abs(Math.floor(cell / board.size) - Math.floor(previous / board.size))
            + Math.abs(cell % board.size - previous % board.size), 1);
        }
      });
      if (frame.route.length) {
        assert.equal(frame.route[0], board.start);
        assert.equal(frame.route.at(-1), board.goal);
      }
    }
  }
});

test('BFS matches exhaustive shortest simple paths for every three-by-three wall configuration', () => {
  for (let mask = 0; mask < 128; mask++) {
    const board = { size: 3, start: 0, goal: 8, walls: Array.from({ length: 7 }, (_, i) => i + 1).filter((_, i) => mask & (1 << i)) };
    let shortest = Infinity;
    function walk(cell, path) {
      if (path.length - 1 >= shortest) return;
      if (cell === 8) { shortest = path.length - 1; return; }
      for (let next = 0; next < 9; next++) {
        if (board.walls.includes(next) || path.includes(next)) continue;
        const adjacent = Math.abs(Math.floor(cell / 3) - Math.floor(next / 3)) + Math.abs(cell % 3 - next % 3) === 1;
        if (adjacent) walk(next, [...path, next]);
      }
    }
    walk(0, [0]);
    const bfs = search(board, 'bfs').at(-1), dfs = search(board, 'dfs').at(-1);
    assert.equal(bfs.route.length ? bfs.route.length - 1 : Infinity, shortest);
    assert.equal(Boolean(dfs.route.length), shortest !== Infinity);
  }
});

function fixture() {
  const node = () => ({ hidden: true, value: '', textContent: '', attrs: {}, dataset: {}, children: [],
    setAttribute(key, value) { this.attrs[key] = value; },
    addEventListener(event, callback) { this[event] = callback; },
    replaceChildren() { this.children = []; }, append(cell) { this.children.push(cell); } });
  const names = ['algorithm', 'example', 'run', 'next', 'reset', 'grid', 'status', 'explored', 'pending',
    'distance', 'strategy', 'trace', 'map', 'controls', 'metrics', 'bfs-moves', 'bfs-count', 'dfs-moves', 'dfs-count'];
  const nodes = Object.fromEntries(names.map(name => [`.search-${name}`, node()]));
  nodes['.search-algorithm'].value = 'bfs'; nodes['.search-example'].value = 'routes';
  const events = new Map(), timers = new Map(); let id = 0, scrolls = 0;
  const document = { hidden: false, createElement: node,
    querySelector: selector => selector === '.search-lab' ? {
      querySelector: key => nodes[key], getBoundingClientRect: () => ({ top: 300 }),
    } : { getBoundingClientRect: () => ({ height: 72 }) },
    addEventListener: (event, callback) => events.set(event, callback) };
  const window = { PortfolioSearch: { boards, search }, scrollY: 0, scrollTo() { scrolls++; },
    matchMedia: query => ({ matches: query.includes('max-width') }),
    addEventListener: (event, callback) => events.set(event, callback) };
  runInNewContext(controller, { document, window,
    setTimeout(callback) { timers.set(++id, callback); return id; }, clearTimeout(key) { timers.delete(key); } });
  function tick() { const entry = timers.entries().next().value; if (entry) { timers.delete(entry[0]); entry[1](); } }
  return { nodes, timers, events, document, tick, scrolls: () => scrolls };
}

test('search playback resets on option changes, pauses when hidden and completes with an accessible trace', () => {
  const f = fixture(), n = f.nodes;
  assert.equal(n['.search-controls'].hidden, false);
  assert.equal(n['.search-grid'].children.length, 49);
  assert.equal(n['.search-bfs-moves'].textContent, '8');
  assert.equal(n['.search-dfs-moves'].textContent, '12');
  n['.search-next'].click(); assert.equal(n['.search-explored'].textContent, '1');
  n['.search-run'].click(); assert.equal(n['.search-status'].attrs['aria-live'], 'off');
  n['.search-algorithm'].value = 'dfs'; n['.search-algorithm'].change();
  assert.equal(f.timers.size, 0); assert.equal(n['.search-explored'].textContent, '0');
  n['.search-run'].click(); f.tick(); n['.search-run'].click(); assert.equal(f.timers.size, 0);
  n['.search-run'].click(); f.document.hidden = true; f.events.get('visibilitychange')();
  assert.equal(f.timers.size, 0);
  f.document.hidden = false; n['.search-run'].click();
  for (let step = 0; step < 60; step++) f.tick();
  assert.equal(f.timers.size, 0); assert.equal(n['.search-distance'].textContent, '12');
  assert.equal(n['.search-status'].attrs['aria-live'], 'polite');
  assert.match(n['.search-trace'].textContent, /Route: r4c1.*r4c7/);
  assert.ok(f.scrolls() > 0);
  n['.search-reset'].click(); assert.equal(n['.search-explored'].textContent, '0');
  n['.search-example'].value = 'blocked'; n['.search-example'].change();
  assert.equal(n['.search-bfs-moves'].textContent, 'No route');
  assert.equal(n['.search-dfs-count'].textContent, '27');
});

test('the static fallback explains the same board and does not expose inert controls', async () => {
  const html = await readFile(new URL('../docs/partials/search-section.html', import.meta.url), 'utf8');
  assert.match(html, /class="search-controls" hidden/);
  assert.match(html, /S\.\.#\.\.G/);
  assert.match(html, /shortest route takes 8 moves/);
  assert.match(html, /upper branch takes 12 moves/);
});
