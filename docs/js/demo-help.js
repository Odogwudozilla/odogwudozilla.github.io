/* Hover, focus or tap explanations; Escape dismisses without moving focus. */
(() => {
  'use strict';
  document.querySelectorAll('.demo-help').forEach(help => {
    const icon = help.querySelector('.demo-help-icon');
    let hovered = false, focused = false, pinned = false, suppressed = false;
    function render() {
      const open = !suppressed && (hovered || focused || pinned);
      help.classList.toggle('is-open', open);
    }
    function dismiss() { pinned = false; suppressed = true; render(); }
    help.addEventListener('pointerenter', event => {
      if (event.pointerType === 'touch') return;
      hovered = true; suppressed = false; render();
    });
    help.addEventListener('pointerleave', () => { hovered = false; render(); });
    help.addEventListener('focusin', () => { focused = true; suppressed = false; render(); });
    help.addEventListener('focusout', event => {
      if (help.contains(event.relatedTarget)) return;
      focused = false; pinned = false; render();
    });
    icon.addEventListener('click', () => {
      pinned = !pinned; suppressed = !pinned; render();
    });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') dismiss(); });
    document.addEventListener('pointerdown', event => { if (!help.contains(event.target)) dismiss(); });
    help.closest('.lab-panel')?.addEventListener('lab:hidden', dismiss);
    help.hidden = false;
  });
})();
