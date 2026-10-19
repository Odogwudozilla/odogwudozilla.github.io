/* Progressive enhancements. All content and case details work without JS. */
(() => {
  'use strict';

  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#primary-navigation');
  const colourSwitch = document.querySelector('#colour-scheme-controls');

  if (header && menuButton && nav) {
    const mobile = window.matchMedia('(max-width: 760px)');

    /** Keep the disclosure state and its accessible label in sync. */
    function setMenuOpen(open, restoreFocus = false) {
      if (!open && mobile.matches && (nav.contains(document.activeElement)
        || colourSwitch?.contains(document.activeElement))) restoreFocus = true;
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
        if ((nav.contains(document.activeElement) || colourSwitch?.contains(document.activeElement))
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

  // Copy the public canonical URL, even from a preview or a legacy alias.
  const portfolio = document.querySelector('#portfolio');
  const canonical = document.querySelector('link[rel="canonical"]');
  if (portfolio && canonical && navigator.clipboard?.writeText) {
    for (const project of portfolio.querySelectorAll('.project-card')) {
      const button = project.querySelector('.copy-project-link');
      const status = project.querySelector('.project-share-status');
      if (!button || !status) continue;
      const link = new URL(button.dataset.projectUrl || `#${project.id}`, canonical.href);
      button.hidden = false;
      let copying = false;
      button.addEventListener('click', async () => {
        if (copying) return;
        copying = true;
        button.setAttribute('aria-busy', 'true');
        status.textContent = '';
        try {
          await navigator.clipboard.writeText(link.href);
          status.textContent = 'Project link copied.';
        } catch {
          status.textContent = 'Could not copy. Open the case study and copy its address.';
        } finally {
          copying = false;
          button.removeAttribute('aria-busy');
        }
      });
    }
  }

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

  const caseControls = document.querySelector('.case-controls');
  if (caseControls && portfolio) {
    const cases = [...portfolio.querySelectorAll('details.case-details')];
    const status = caseControls.querySelector('.case-controls-status');
    const button = caseControls.querySelector('[data-case-toggle]');
    function updateCaseControls() {
      // Printing opens disclosures temporarily; do not announce that as a choice.
      if (printClosedDetails) return;
      const expanded = cases.filter(details => details.open).length;
      const allExpanded = expanded === cases.length;
      button.textContent = allExpanded ? 'Collapse All' : 'Expand All';
      button.setAttribute('aria-expanded', String(allExpanded));
      const message = `${expanded} of ${cases.length} case studies expanded.`;
      if (status.textContent !== message) status.textContent = message;
    }
    button.addEventListener('click', () => {
      const expand = cases.some(details => !details.open);
      for (const details of cases) details.open = expand;
      updateCaseControls();
    });
    for (const details of cases) details.addEventListener('toggle', updateCaseControls);
    updateCaseControls();
    caseControls.hidden = false;
  }

  const copyButton = document.querySelector('.copy-email');
  const copyStatus = document.querySelector('.copy-status');
  if (copyButton && copyStatus && navigator.clipboard?.writeText) {
    copyButton.hidden = false;
    let copying = false;
    copyButton.addEventListener('click', async () => {
      if (copying) return;
      copying = true;
      copyButton.setAttribute('aria-busy', 'true');
      copyStatus.textContent = '';
      try {
        await navigator.clipboard.writeText(copyButton.dataset.email);
        copyStatus.textContent = 'Email address copied.';
      } catch {
        copyStatus.textContent = 'Could not copy. Select the address or use the email link.';
      } finally {
        copying = false;
        copyButton.removeAttribute('aria-busy');
      }
    });
  }
})();
