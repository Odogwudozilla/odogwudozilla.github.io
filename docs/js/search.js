/* Browser controls for the local search demonstration. */
(() => {
  'use strict';
  const root = document.querySelector('.search-lab'), model = window.PortfolioSearch;
  if (!root || !model) return;
  const find = selector => root.querySelector(selector);
  const algorithm = find('.search-algorithm'), example = find('.search-example');
  const run = find('.search-run'), next = find('.search-next'), grid = find('.search-grid');
  const status = find('.search-status');
  const mobile = window.matchMedia('(max-width: 760px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let board, frames, index = 0, playing = false, timer, cells = [];
  function stop() { clearTimeout(timer); timer = undefined; playing = false; }
  const coordinate = id => `r${Math.floor(id / board.size) + 1}c${id % board.size + 1}`;
  function render() {
    const frame = frames[index];
    const visited = new Set(frame.visited), pending = new Set(frame.pending), route = new Set(frame.route);
    cells.forEach((cell, id) => {
      const state = board.walls.includes(id) ? 'wall' : route.has(id) ? 'route'
        : id === frame.current ? 'current' : visited.has(id) ? 'visited' : pending.has(id) ? 'pending' : 'empty';
      cell.dataset.state = state;
      cell.textContent = id === board.start ? 'S' : id === board.goal ? 'G'
        : ({ wall: '#', route: '+', current: '@', visited: '·', pending: '○', empty: '' })[state];
    });
    const moves = frame.route.length ? frame.route.length - 1 : null;
    const label = algorithm.value.toUpperCase();
    const message = frame.done ? moves === null ? `${label}: no route. Explored ${visited.size} cells.`
      : `${label}: goal found in ${moves} moves. Explored ${visited.size} cells.`
      : index === 0 ? `${label} ready. Start at ${coordinate(board.start)}; goal at ${coordinate(board.goal)}.`
        : `${label}: exploring ${coordinate(frame.current)}. ${visited.size} explored; ${pending.size} pending.`;
    status.setAttribute('aria-live', playing ? 'off' : 'polite');
    status.textContent = message;
    grid.setAttribute('aria-label', `Seven by seven search grid. S is the start; G is the goal; hash symbols are walls. ${message} Full coordinates are in the search trace below.`);
    find('.search-explored').textContent = String(visited.size);
    find('.search-pending').textContent = String(pending.size);
    find('.search-distance').textContent = moves === null ? '—' : String(moves);
    find('.search-strategy').textContent = algorithm.value === 'bfs'
      ? 'BFS uses a queue: explore the oldest pending cell first. With equally weighted moves, the first route found is a shortest route.'
      : 'DFS uses a stack: follow a branch before backtracking. It finds a route when one exists, but that route may be longer.';
    find('.search-trace').textContent = `Explored: ${frame.visited.map(coordinate).join(' → ') || 'none yet'}\n\nRoute: ${frame.route.map(coordinate).join(' → ') || (frame.done ? 'no route' : 'not found yet')}`;
    run.textContent = playing ? 'Pause' : frame.done ? 'Run again' : 'Run search';
    next.textContent = frame.done ? 'Restart' : 'Next step';
  }
  function reset() {
    stop();
    board = model.boards[example.value];
    frames = model.search(board, algorithm.value);
    for (const method of ['bfs', 'dfs']) {
      const result = (method === algorithm.value ? frames : model.search(board, method)).at(-1);
      find(`.search-${method}-moves`).textContent = result.route.length ? String(result.route.length - 1) : 'No route';
      find(`.search-${method}-count`).textContent = String(result.visited.length);
    }
    index = 0;
    grid.replaceChildren();
    cells = Array.from({ length: board.size ** 2 }, () => {
      const cell = document.createElement('span');
      cell.setAttribute('aria-hidden', 'true');
      grid.append(cell);
      return cell;
    });
    render();
  }
  function align() {
    if (!mobile.matches) return;
    const height = document.querySelector('.site-header')?.getBoundingClientRect().height || 72;
    window.scrollTo({ top: Math.max(0, window.scrollY + root.getBoundingClientRect().top - height - 12),
      behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  }
  function schedule() {
    timer = setTimeout(() => {
      if (!playing) return;
      index++;
      if (frames[index].done) stop();
      render();
      if (playing) schedule();
    }, 280);
  }
  algorithm.addEventListener('change', reset);
  example.addEventListener('change', reset);
  find('.search-reset').addEventListener('click', reset);
  next.addEventListener('click', () => {
    stop();
    index = frames[index].done ? 0 : index + 1;
    render(); align();
  });
  run.addEventListener('click', () => {
    if (playing) { stop(); render(); return; }
    if (frames[index].done) index = 0;
    playing = true; render(); align(); schedule();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && playing) { stop(); render(); }
  });
  root.closest?.('.lab-panel')?.addEventListener('lab:hidden', () => {
    if (playing) { stop(); render(); }
  });
  window.addEventListener('beforeprint', () => { if (playing) { stop(); render(); } });
  reset();
  grid.hidden = false;
  find('.search-map').hidden = true;
  find('.search-controls').hidden = false;
  find('.search-metrics').hidden = false;
})();
