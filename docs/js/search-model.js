/* Pure, deterministic grid search, shared by the browser and verification tests. */
((scope) => {
  'use strict';
  const rows = ['.......', '.#####.', '.#####.', '...#...', '.#...#.', '.#####.', '.......'];
  const size = 7, start = 21, goal = 27;
  const walls = rows.flatMap((row, r) => [...row].flatMap((value, c) => value === '#' ? [r * size + c] : []));
  const boards = {
    routes: { size, start, goal, walls },
    open: { size, start, goal, walls: [] },
    blocked: { size, start, goal, walls: [...walls, 20, 26, 34] },
  };
  function search(board, algorithm) {
    if (!board || !['bfs', 'dfs'].includes(algorithm)) throw new Error('Unknown search configuration');
    const blocked = new Set(board.walls), discovered = new Set([board.start]);
    const parent = new Map(), pending = [board.start], visited = [];
    const frames = [{ visited: [], pending: [...pending], current: null, route: [], done: false }];
    while (pending.length) {
      const current = algorithm === 'bfs' ? pending.shift() : pending.pop();
      visited.push(current);
      if (current === board.goal) {
        const route = [current];
        while (route[0] !== board.start) route.unshift(parent.get(route[0]));
        frames.push({ visited: [...visited], pending: [...pending], current, route, done: true });
        return frames;
      }
      const r = Math.floor(current / board.size), c = current % board.size;
      const neighbours = [[r - 1, c], [r, c + 1], [r + 1, c], [r, c - 1]]
        .filter(([y, x]) => y >= 0 && x >= 0 && y < board.size && x < board.size)
        .map(([y, x]) => y * board.size + x);
      // Reverse the stack insertion order so up/right/down/left is visited first.
      if (algorithm === 'dfs') neighbours.reverse();
      for (const next of neighbours) {
        if (blocked.has(next) || discovered.has(next)) continue;
        discovered.add(next);
        parent.set(next, current);
        pending.push(next);
      }
      frames.push({ visited: [...visited], pending: [...pending], current, route: [], done: pending.length === 0 });
    }
    return frames;
  }
  scope.PortfolioSearch = Object.freeze({ boards, search });
})(typeof window === 'undefined' ? globalThis : window);
