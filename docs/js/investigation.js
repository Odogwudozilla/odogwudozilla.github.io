/* One trace/contract workspace, with explicit playback and no background traffic. */
(() => {
  'use strict';
  const model = window.PortfolioInvestigation;
  const panel = document.querySelector('#playground');
  if (!panel || !model) return;
  const find = selector => panel.querySelector(selector);
  const picker = find('.trace-scenario'), protection = find('.trace-protection input');
  const run = find('.trace-run'), next = find('.trace-next');
  const views = [...panel.querySelectorAll('.investigation-view')];
  const viewButtons = [...panel.querySelectorAll('[data-investigation-view]')];
  const nodes = [...panel.querySelectorAll('[data-trace-node]')];
  const timeline = find('.trace-events');
  const mobile = window.matchMedia('(max-width: 760px)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let trace, count = 0, timer, selectedView = 'request-trace', printedView;
  function pause() { clearTimeout(timer); timer = undefined; run.textContent = 'Run trace'; run.setAttribute('aria-pressed', 'false'); find('.trace-status').setAttribute('aria-live', 'polite'); }
  function chooseView(id) {
    if (!views.some(view => view.id === id)) return;
    pause(); selectedView = id;
    views.forEach(view => { view.hidden = view.id !== id; });
    viewButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.investigationView === id)));
  }
  function fromHash() {
    const hash = window.location.hash;
    if (hash === '#compatibility-lab' || hash === '#compatibility-title') chooseView('compatibility-lab');
    else if (hash === '#access-lab' || hash === '#access-title') chooseView('access-lab');
    else if (['#playground', '#playground-title', '#request-trace'].includes(hash)) chooseView('request-trace');
  }
  function render() {
    const state = model.frame(trace, count), event = state.current;
    find('.trace-attempts').textContent = state.attempts;
    find('.trace-records').textContent = state.records;
    find('.trace-elapsed').textContent = state.elapsed;
    find('.trace-status').textContent = count ? `${state.complete ? 'Complete' : `Event ${count} of ${trace.events.length}`} · ${state.status === 'Ready' ? 'In progress' : state.status}` : `Ready · ${trace.title}`;
    find('.trace-operation').textContent = event?.title || trace.title;
    find('.trace-detail').textContent = event?.detail || 'Run the trace or inspect it one event at a time. Select a timeline row to examine that operation.';
    find('.trace-payload').textContent = event ? JSON.stringify(event.payload || { component: event.node, startMs: event.start, endMs: event.end }, null, 2) : '{ "state": "ready" }';
    find('.trace-lesson').textContent = trace.lesson;
    const positions = { client: 125, api: 375, service: 625, store: 875 };
    const packet = find('.trace-packet');
    packet.style.setProperty('--from', `${positions[trace.events[Math.max(0, count - 2)].node]}px`);
    packet.style.setProperty('--to', `${positions[event?.node || 'client']}px`);
    packet.classList.remove('is-moving');
    if (event && !reduced.matches) { packet.getBoundingClientRect(); packet.classList.add('is-moving'); }
    nodes.forEach(node => {
      const last = trace.events.slice(0, count).filter(item => item.node === node.dataset.traceNode).at(-1);
      node.dataset.active = String(event?.node === node.dataset.traceNode);
      node.dataset.failed = String(Boolean(last?.failed));
      const description = { client: state.status === 'Client timed out' ? 'Timed out' : last?.failed ? 'Error reply' : last?.attempt ? 'Sent' : 'Received', api: last?.failed ? 'Rejected' : 'Validated', service: last?.failed ? 'Failed' : 'Prepared' };
      node.querySelector('.trace-node-state').textContent = node.dataset.traceNode === 'store' ? `${state.records} saved` : last ? description[node.dataset.traceNode] : 'Waiting';
    });
    [...timeline.querySelectorAll('button')].forEach((button, index) => {
      button.setAttribute('aria-current', index === count - 1 ? 'step' : 'false');
      button.dataset.visited = String(index < count);
    });
    next.disabled = state.complete;
    if (state.complete) pause();
  }
  function reset() {
    pause(); count = 0; trace = model.simulate(picker.value, protection.checked);
    find('.trace-protection').hidden = picker.value !== 'duplicate';
    timeline.replaceChildren();
    trace.events.forEach((event, index) => {
      const row = document.createElement('li'), button = document.createElement('button');
      button.type = 'button';
      const stage = document.createElement('span'), label = document.createElement('span');
      const time = document.createElement('span'), track = document.createElement('span'), bar = document.createElement('span');
      stage.className = 'trace-event-node'; stage.textContent = event.node;
      label.className = 'trace-event-label'; label.textContent = event.title;
      time.className = 'trace-event-time'; time.textContent = `${event.start}–${event.end}`;
      track.className = 'trace-track'; track.setAttribute('aria-hidden', 'true'); bar.className = 'trace-bar';
      bar.style.setProperty('--offset', `${100 * event.start / trace.duration}%`);
      bar.style.setProperty('--duration', `${100 * (event.end - event.start) / trace.duration}%`);
      track.append(bar); button.append(stage, label, time, track);
      button.addEventListener('click', () => { pause(); count = index + 1; render(); });
      row.append(button); timeline.append(row);
    });
    render();
  }
  function alignMobile() {
    if (!mobile.matches) return;
    const header = document.querySelector('.site-header')?.getBoundingClientRect().height || 72;
    window.scrollTo({ top: Math.max(0, window.scrollY + find('.trace-controls').getBoundingClientRect().top - header - 12), behavior: reduced.matches ? 'instant' : 'smooth' });
  }
  function tick() {
    if (document.hidden || panel.hidden || selectedView !== 'request-trace') { pause(); return; }
    count++; render();
    if (count < trace.events.length) timer = setTimeout(tick, 850);
  }
  run.addEventListener('click', () => {
    if (timer) { pause(); return; }
    if (count === trace.events.length) { count = 0; render(); }
    alignMobile(); run.textContent = 'Pause trace'; run.setAttribute('aria-pressed', 'true');
    find('.trace-status').setAttribute('aria-live', 'off');
    timer = setTimeout(tick, 250);
  });
  next.addEventListener('click', () => { pause(); if (count < trace.events.length) count++; render(); alignMobile(); });
  find('.trace-reset').addEventListener('click', reset);
  picker.addEventListener('change', reset); protection.addEventListener('change', reset);
  viewButtons.forEach(button => button.addEventListener('click', () => {
    chooseView(button.dataset.investigationView);
    window.history.replaceState(null, '', `#${selectedView === 'request-trace' ? 'playground' : selectedView}`);
  }));
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (['#compatibility-lab', '#access-lab'].includes(link.hash)) chooseView(link.hash.slice(1));
    if (link.dataset.investigationScenario) { picker.value = link.dataset.investigationScenario; protection.checked = true; reset(); chooseView('request-trace'); }
  });
  window.addEventListener('hashchange', fromHash);
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
  panel.addEventListener('lab:hidden', pause);
  window.addEventListener('beforeprint', () => { pause(); printedView = selectedView; views.forEach(view => { view.hidden = false; }); });
  window.addEventListener('afterprint', () => { if (printedView) chooseView(printedView); });
  reset(); chooseView(selectedView); fromHash();
  find('.trace-controls').hidden = false; find('.investigation-switch').hidden = false;
  if (mobile.matches) find('.trace-timeline').open = false;
})();
