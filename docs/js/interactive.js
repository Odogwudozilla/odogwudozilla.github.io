/* Local-only enhancements; every project stays readable and linkable. */
(() => {
  'use strict';

  const explorer = document.querySelector('.project-explorer');
  if (!explorer) return;
  const evidence = {
    'product-watch-project': {
      apis: 'Offer-checking workflows and email alerts in a TypeScript application.',
      frontend: 'A public interactive demo with fictional watches and email previews.',
      data: 'D1 storage for watch criteria, observations and checking state.',
    },
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
  buttons.forEach(button => button.addEventListener('click', () => {
    const focus = button.dataset.focus;
    if (button.getAttribute('aria-pressed') === 'true') return;
    buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    let count = 0;
    for (const project of projects) {
      const match = focus !== 'all' && Boolean(project.skills[focus]);
      project.article.classList.toggle('explorer-match', match);
      project.note.hidden = !match;
      project.note.textContent = match ? `${button.textContent}: ${project.skills[focus]}` : '';
      if (match) {
        count++;
      }
    }
    status.textContent = focus === 'all' ? 'All four projects are shown.'
      : `${count} projects connect to ${button.textContent}. All projects remain available below.`;
  }));
  explorer.hidden = false;
})();
