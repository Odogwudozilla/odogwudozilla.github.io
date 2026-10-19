/* Local-only enhancements; every project stays readable and linkable. */
(() => {
  'use strict';

  const clock = document.querySelector('.local-clock');
  if (clock) {
    let formatter;
    try {
      formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Amsterdam', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
      });
    } catch { /* Keep the location caption if time-zone support is unavailable. */ }
    if (formatter) {
      const update = () => {
        const now = new Date();
        const parts = Object.fromEntries(formatter.formatToParts(now).map(p => [p.type, p.value]));
        const hour = Number(parts.hour), minute = Number(parts.minute);
        const time = clock.querySelector('time');
        time.textContent = `${parts.hour}:${parts.minute}`;
        time.dateTime = now.toISOString();
        clock.style.setProperty('--hour-angle', `${(hour % 12) * 30 + minute / 2}deg`);
        clock.style.setProperty('--minute-angle', `${minute * 6}deg`);
        clock.hidden = false;
      };
      update();
      // No frame loop or announcements: refresh only while the page is visible.
      let timer;
      const sync = () => {
        clearInterval(timer);
        timer = undefined;
        if (!document.hidden) { update(); timer = setInterval(update, 30000); }
      };
      document.addEventListener('visibilitychange', sync);
      sync();
    }
  }

  const explorer = document.querySelector('.project-explorer');
  if (!explorer) return;
  const evidence = {
    'insurance-case': {
      java: 'Java services for insurance policy management.',
      apis: 'SOAP-to-REST changes, OpenAPI contracts and integration compatibility.',
      data: 'SQL and application data used in defect investigation.',
    },
    'fusion-project': {
      java: 'Java 21 and a Spring Boot REST API.',
      apis: 'A Spring Boot API for player registration and administration.',
      frontend: 'An Angular interface for players and administrators.',
      data: 'PostgreSQL and Supabase for club member records.',
    },
    'energy-project': {
      java: 'A Java collector for smart-meter readings.',
      apis: 'HomeWizard API collection with upload retries and replay.',
      frontend: 'A React and TypeScript interface for energy history.',
      data: 'SQLite storage, Supabase uploads and data-coverage checks.',
    },
    'aoc-project': {
      java: 'Java puzzle solutions with Gradle and reusable test utilities.',
    },
  };
  const projects = Object.entries(evidence).map(([id, skills]) => {
    const article = document.getElementById(id);
    if (!article) return null;
    const note = document.createElement('p');
    note.className = 'project-match-note';
    note.hidden = true;
    article.querySelector('.case-intro').append(note);
    return { id, article, skills, note, title: article.querySelector('h3').textContent };
  }).filter(Boolean);
  const buttons = [...explorer.querySelectorAll('[data-focus]')];
  const status = explorer.querySelector('.explorer-status');
  const results = explorer.querySelector('.explorer-results');
  const index = document.querySelector('.work-index');
  buttons.forEach(button => button.addEventListener('click', () => {
    const focus = button.dataset.focus;
    if (button.getAttribute('aria-pressed') === 'true') return;
    buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    results.replaceChildren();
    let count = 0;
    for (const project of projects) {
      const match = focus !== 'all' && Boolean(project.skills[focus]);
      project.article.classList.toggle('explorer-match', match);
      project.note.hidden = !match;
      project.note.textContent = match ? `${button.textContent}: ${project.skills[focus]}` : '';
      if (match) {
        count++;
        const link = document.createElement('a');
        link.href = `#${project.id}`;
        link.textContent = `${project.title} →`;
        results.append(link);
      }
    }
    results.hidden = focus === 'all';
    if (index) index.hidden = focus !== 'all';
    status.textContent = focus === 'all' ? 'All four projects are shown.'
      : `${count} projects connect to ${button.textContent}. All projects remain available below.`;
  }));
  explorer.hidden = false;
})();
