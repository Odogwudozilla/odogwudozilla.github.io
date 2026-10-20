/* Re-evaluate local fictional context on selection; no requests or persistence. */
(() => {
  'use strict';
  const panel = document.querySelector('#access-lab');
  const model = window.PortfolioAccess;
  if (!panel || !model) return;
  const controls = [...panel.querySelectorAll('[data-access-context]')];
  function render() {
    const input = Object.fromEntries(controls.map(control => [control.dataset.accessContext, control.value]));
    const result = model.decide(input);
    const verdict = panel.querySelector('.access-verdict');
    verdict.textContent = `${result.allowed ? 'ALLOW' : 'BLOCK'} · ${result.status}. ${result.reason}`;
    verdict.dataset.allowed = String(result.allowed);
    panel.querySelector('.access-checks').replaceChildren(...result.checks.map(check => {
      const item = document.createElement('li'), name = document.createElement('strong'), detail = document.createElement('span');
      item.dataset.outcome = check.outcome;
      name.textContent = `${check.outcome} · ${check.name}`; detail.textContent = check.detail;
      item.append(name, detail); return item;
    }));
    panel.querySelector('.access-effect').textContent = result.allowed
      ? input.action === 'publish' ? 'Would publish one draft.' : 'Would read one record without changing it.'
      : 'Action blocked. The record is neither read nor changed.';
  }
  controls.forEach(control => control.addEventListener('change', render));
  render(); panel.querySelector('.access-controls').hidden = false;
})();
