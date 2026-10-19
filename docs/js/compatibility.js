/* Selection runs a local contract check; no requests, animation or background work. */
(() => {
  'use strict';
  const panel = document.querySelector('#compatibility-lab');
  const model = window.PortfolioCompatibility;
  if (!panel || !model) return;
  const picker = panel.querySelector('select');
  const verdict = panel.querySelector('.compat-verdict');
  function render() {
    const scenario = model.scenarios[picker.value];
    if (!scenario) return;
    const result = model.check(scenario);
    verdict.textContent = `${result.compatible ? 'Compatible with this client' : 'Breaks this client'} · ${result.stage}. ${result.message}`;
    verdict.dataset.compatible = String(result.compatible);
    panel.querySelector('.compat-explanation').textContent = scenario.explanation;
    panel.querySelector('.compat-migration span').textContent = scenario.migration;
    panel.querySelector('.compat-status').textContent = result.status;
    panel.querySelector('.compat-payload').textContent = JSON.stringify(result.payload, null, 2);
    panel.querySelector('.compat-required').textContent = scenario.required.join(', ');
  }
  picker.addEventListener('change', render);
  render();
  panel.querySelector('.compat-controls').hidden = false;
})();
