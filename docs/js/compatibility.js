/* Selection runs a local contract check; no requests, animation or background work. */
(() => {
  'use strict';
  const panel = document.querySelector('#compatibility-lab');
  const model = window.PortfolioCompatibility;
  if (!panel || !model) return;
  const picker = panel.querySelector('select');
  const rollout = panel.querySelector('.compat-rollout input');
  const verdict = panel.querySelector('.compat-verdict');
  function render() {
    const scenario = model.scenarios[picker.value];
    if (!scenario) return;
    const active = rollout.checked ? model.rollout(picker.value) : scenario;
    const result = model.check(active);
    const stage = result.stage === 'Client decoding' ? 'Reading the API response' : result.stage;
    verdict.textContent = `${result.compatible ? 'Compatible with this client' : 'Breaks this client'} · ${stage}. ${result.message}`;
    verdict.dataset.compatible = String(result.compatible);
    panel.querySelector('.compat-explanation').textContent = active.explanation;
    panel.querySelector('.compat-migration span').textContent = scenario.migration;
    panel.querySelector('.compat-status').textContent = result.status;
    const originalLines = JSON.stringify(model.original, null, 2).split('\n');
    panel.querySelector('.compat-payload').replaceChildren(...JSON.stringify(result.payload, null, 2).split('\n').map((text, index, lines) => {
      const line = document.createElement(originalLines.includes(text) ? 'span' : 'mark');
      line.textContent = text + (index < lines.length - 1 ? '\n' : ''); return line;
    }));
    panel.querySelector('.compat-required').textContent = active.required.join(', ');
    panel.querySelector('.compat-tests').replaceChildren(...model.checks(active).map(check => {
      const item = document.createElement('li'); item.textContent = `${check.outcome} · ${check.label}`; item.dataset.outcome = check.outcome; return item;
    }));
  }
  picker.addEventListener('change', () => { rollout.checked = false; render(); });
  rollout.addEventListener('change', render);
  render();
  panel.querySelector('.compat-controls').hidden = false;
})();
