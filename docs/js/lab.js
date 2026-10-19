/* One workspace at a time, retaining the original public fragment links. */
(() => {
  'use strict';
  const lab = document.querySelector('.engineering-lab');
  if (!lab) return;
  const panels = [...lab.querySelectorAll('.lab-panel')];
  const buttons = [...lab.querySelectorAll('[data-lab-select]')];
  let selected = panels[0];
  function choose(panel) {
    if (!panel) return;
    selected = panel;
    panels.forEach(item => {
      if (item !== panel && !item.hidden) item.dispatchEvent(new Event('lab:hidden'));
      item.hidden = item !== panel;
    });
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.labSelect === panel.id)));
  }
  function fromHash(hash = window.location.hash) {
    let id;
    try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    const panel = panels.find(panel => panel === target || panel.contains(target));
    choose(panel);
    return panel ? target : null;
  }
  buttons.forEach(button => button.addEventListener('click', () => {
    const panel = panels.find(item => item.id === button.dataset.labSelect);
    choose(panel);
    window.history.replaceState(null, '', `#${panel.id}`);
  }));
  window.addEventListener('hashchange', () => fromHash());
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (link && !event.defaultPrevented && !event.metaKey && !event.ctrlKey
      && !event.shiftKey && !event.altKey && event.button === 0) fromHash(link.hash);
  });
  window.addEventListener('beforeprint', () => panels.forEach(panel => { panel.hidden = false; }));
  window.addEventListener('afterprint', () => choose(selected));
  choose(selected);
  const initialHash = window.location.hash;
  const initialTarget = fromHash();
  // Native fragment scrolling can precede the enhanced layout. Align once it settles.
  if (initialTarget) window.addEventListener('load', () => {
    if (window.location.hash === initialHash) initialTarget.scrollIntoView({ block: 'start', behavior: 'instant' });
  }, { once: true });
  lab.querySelector('.lab-switch').hidden = false;
})();
