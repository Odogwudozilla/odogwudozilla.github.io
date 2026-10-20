/* One workspace at a time, retaining the original public fragment links. */
(() => {
  'use strict';
  const lab = document.querySelector('.engineering-lab');
  if (!lab) return;
  const panels = [...lab.querySelectorAll('.lab-panel')];
  const buttons = [...lab.querySelectorAll('[data-lab-select]')];
  const shell = lab.querySelector('.lab-shell');
  const gateway = lab.querySelector('.lab-gateway');
  const content = lab.querySelector('.lab-content');
  if (window.IntersectionObserver) {
    const observer = new window.IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle('is-visible', entry.isIntersecting));
    }, { threshold: .2 });
    observer.observe(shell);
  }
  let expanded = false, printing = false;
  let selected = panels[0];
  function applyExpansion() {
    shell.open = expanded;
    content.hidden = !expanded;
    if (!expanded) panels.forEach(panel => panel.dispatchEvent(new Event('lab:hidden')));
  }
  gateway.addEventListener('click', event => {
    event.preventDefault(); expanded = !expanded; applyExpansion();
  });
  // Fragment navigation can natively reveal <details>. Opening is an explicit choice here.
  shell.addEventListener('toggle', () => {
    if (!printing && shell.open !== expanded) applyExpansion();
  });
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
  window.addEventListener('hashchange', () => {
    const target = fromHash();
    applyExpansion();
    if (target && !expanded) gateway.scrollIntoView({ block: 'start', behavior: 'instant' });
  });
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const target = fromHash(link.hash);
    if (link.dataset.labOpen === 'true') { expanded = true; applyExpansion(); }
    if (target && !expanded) {
      event.preventDefault();
      window.history.pushState(null, '', link.hash);
      gateway.scrollIntoView({ block: 'start', behavior: 'instant' });
      gateway.focus({ preventScroll: true });
    }
  });
  window.addEventListener('beforeprint', () => {
    printing = true; shell.open = true; content.hidden = false;
    panels.forEach(panel => { panel.hidden = false; });
  });
  window.addEventListener('afterprint', () => { printing = false; choose(selected); applyExpansion(); });
  choose(selected);
  applyExpansion();
  const initialHash = window.location.hash;
  const initialTarget = fromHash();
  // Native fragment scrolling can precede the enhanced layout. Align once it settles.
  if (initialTarget) window.addEventListener('load', () => {
    if (window.location.hash === initialHash) {
      applyExpansion();
      (expanded ? initialTarget : gateway).scrollIntoView({ block: 'start', behavior: 'instant' });
    }
  }, { once: true });
  lab.querySelector('.lab-switch').hidden = false;
})();
