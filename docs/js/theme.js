/* Apply a saved colour choice before rendering, then enhance the chooser. */
(() => {
  'use strict';
  const root = document.documentElement;
  const storageKey = 'portfolio-colour-theme';
  let theme = root.classList.contains('theme-keylane') ? 'navy' : 'teal';
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === 'navy' || saved === 'teal') theme = saved;
  } catch {
    // Colour switching still works when browser storage is unavailable.
  }

  function applyTheme(choice) {
    theme = choice;
    root.classList.toggle('theme-keylane', choice === 'navy');
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content', choice === 'navy' ? '#274263' : '#153f38',
    );
    document.querySelectorAll('[data-colour-theme]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.colourTheme === choice));
    });
  }

  applyTheme(theme);
  document.addEventListener('DOMContentLoaded', () => {
    const chooser = document.querySelector('.colour-switch');
    if (!chooser) return;
    applyTheme(theme);
    chooser.hidden = false;
    chooser.addEventListener('click', event => {
      const button = event.target.closest('button[data-colour-theme]');
      if (!button || !chooser.contains(button)) return;
      const choice = button.dataset.colourTheme;
      if (choice !== 'navy' && choice !== 'teal') return;
      applyTheme(choice);
      try { localStorage.setItem(storageKey, choice); } catch { /* Session only. */ }
    });
  });
})();
