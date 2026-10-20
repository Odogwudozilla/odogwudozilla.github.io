/* A compact invitation to the same synthetic models used by the Lab. */
(() => {
  'use strict';
  const card = document.querySelector('.engineering-decision');
  if (!card || !window.PortfolioInvestigation || !window.PortfolioCompatibility) return;
  const picker = card.querySelector('select'), link = card.querySelector('a');
  function render() {
    const kind = picker.value;
    let heading, conclusion, route;
    if (kind === 'rename') {
      const result = window.PortfolioCompatibility.check(window.PortfolioCompatibility.scenarios.rename);
      heading = 'A field changes name.'; route = ['Client', 'v2 API', 'Decode'];
      conclusion = result.compatible ? 'The client accepts the change.' : 'Valid JSON. Broken client.';
      link.href = '#compatibility-lab'; delete link.dataset.investigationScenario;
    } else {
      const trace = window.PortfolioInvestigation.simulate(kind);
      const state = window.PortfolioInvestigation.frame(trace, trace.events.length);
      heading = kind === 'duplicate' ? 'The reply never arrived.' : 'The client stopped waiting.';
      route = ['Request', kind === 'duplicate' ? 'Retry' : 'Timeout', 'Store'];
      conclusion = kind === 'duplicate' ? `${state.attempts} attempts. ${state.records} saved record.` : `Timed out. ${state.records} record still saved.`;
      link.href = '#playground'; link.dataset.investigationScenario = kind;
    }
    card.querySelector('.decision-question').textContent = heading;
    card.querySelector('.decision-outcome').textContent = conclusion;
    [...card.querySelectorAll('.decision-route span')].forEach((node, index) => { node.textContent = route[index]; });
  }
  picker.addEventListener('change', render); render(); card.querySelector('label').hidden = false;
})();
