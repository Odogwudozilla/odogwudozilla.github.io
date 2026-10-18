/* Progressive enhancements. All content and case details work without JS. */
(() => {
  'use strict';

  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#primary-navigation');

  if (header && menuButton && nav) {
    const mobile = window.matchMedia('(max-width: 760px)');

    /** Keep the disclosure state and its accessible label in sync. */
    function setMenuOpen(open, restoreFocus = false) {
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.querySelector('.menu-label').textContent = open
        ? 'Close' : 'Menu';
      nav.classList.toggle('is-open', open);
      if (restoreFocus) menuButton.focus();
    }

    /** Desktop navigation stays visible; unenhanced mobile links do too. */
    function syncMenu() {
      if (mobile.matches) {
        menuButton.hidden = false;
        // Move focus before adding the class that hides collapsed links.
        if (nav.contains(document.activeElement)
          && menuButton.getAttribute('aria-expanded') !== 'true') menuButton.focus();
        header.classList.add('menu-enhanced');
      } else {
        header.classList.remove('menu-enhanced');
        // The desktop links replace the mobile trigger in the tab order.
        if (document.activeElement === menuButton) nav.querySelector('a[href]')?.focus();
        menuButton.hidden = true;
        setMenuOpen(false);
      }
    }

    syncMenu();
    mobile.addEventListener('change', syncMenu);
    menuButton.addEventListener('click', () => {
      setMenuOpen(menuButton.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', event => {
      const link = event.target.closest('a[href^="#"]');
      if (!link || event.defaultPrevented || event.button !== 0
        || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const destination = document.getElementById(link.hash.slice(1));
      if (mobile.matches && destination) {
        // Keep keyboard focus out of the navigation that is about to close.
        destination.setAttribute('tabindex', '-1');
        destination.focus({ preventScroll: true });
      }
      setMenuOpen(false);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape'
        && menuButton.getAttribute('aria-expanded') === 'true') {
        setMenuOpen(false, true);
      }
    });
    document.addEventListener('click', event => {
      if (!header.contains(event.target)) setMenuOpen(false);
    });

    const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
    const sections = navLinks.map(link =>
      document.getElementById(link.hash.slice(1)),
    ).filter(Boolean);
    let scheduled = false;

    /** Highlight the last navigation section above the sticky header. */
    function updateActiveSection() {
      const offset = header.getBoundingClientRect().height + 80;
      let current = '';
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= offset) {
          current = `#${section.id}`;
        }
      }
      // The final section can be too short to reach the header naturally.
      if (window.scrollY > 0 && window.innerHeight + window.scrollY
        >= document.documentElement.scrollHeight - 4) {
        current = '#contact';
      }
      for (const link of navLinks) {
        if (link.hash === current) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
      scheduled = false;
    }

    window.addEventListener('scroll', () => {
      if (!scheduled) {
        scheduled = true;
        window.requestAnimationFrame(updateActiveSection);
      }
    }, { passive: true });
    window.addEventListener('resize', updateActiveSection);
    window.addEventListener('hashchange', updateActiveSection);
    updateActiveSection();
  }

  /** A project URL should reveal its case study, including on a fresh visit. */
  function revealLinkedProject(fragment = window.location.hash) {
    let id;
    try {
      id = decodeURIComponent(fragment.slice(1));
    } catch {
      return;
    }
    const project = document.getElementById(id);
    if (!project?.matches('.project-card')) return;
    const details = project.querySelector('details.case-details');
    if (details) details.open = true;
  }

  window.addEventListener('hashchange', () => revealLinkedProject());
  // Clicking the same fragment again does not dispatch hashchange.
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (link && !event.defaultPrevented
      && event.button === 0 && !event.metaKey && !event.ctrlKey
      && !event.shiftKey && !event.altKey) revealLinkedProject(link.hash);
  });
  revealLinkedProject();

  // Print every case study, then restore the reader's disclosure choices.
  let printClosedDetails;
  window.addEventListener('beforeprint', () => {
    if (printClosedDetails) return;
    printClosedDetails = [...document.querySelectorAll('details:not([open])')];
    for (const details of printClosedDetails) details.open = true;
  });
  window.addEventListener('afterprint', () => {
    if (!printClosedDetails) return;
    for (const details of printClosedDetails) details.open = false;
    printClosedDetails = undefined;
  });

  const copyButton = document.querySelector('.copy-email');
  const copyStatus = document.querySelector('.copy-status');
  if (copyButton && copyStatus && navigator.clipboard?.writeText) {
    copyButton.hidden = false;
    copyButton.addEventListener('click', async () => {
      copyButton.disabled = true;
      try {
        await navigator.clipboard.writeText(copyButton.dataset.email);
        copyStatus.textContent = 'Email address copied.';
      } catch {
        copyStatus.textContent = 'Could not copy. Select the address or use the email link.';
      } finally {
        copyButton.disabled = false;
      }
    });
  }
})();
