/* Fictional publishing policy. An explanation model, never an access-control boundary. */
((scope) => {
  'use strict';
  const roles = ['anonymous', 'reviewer', 'editor', 'admin'];
  const actions = ['read', 'publish'];
  function decide(context = {}) {
    const { role, workspace, action, state } = context || {};
    if (!roles.includes(role) || !actions.includes(action)
      || !['own', 'other'].includes(workspace) || !['draft', 'archived'].includes(state)) {
      return { allowed: false, status: '400 Bad Request', reason: 'Unknown or missing context: no operation is allowed.', checks: [] };
    }
    const rules = [
      { name: 'Identity', pass: role !== 'anonymous', status: '401 Unauthorized',
        yes: 'A fictional signed-in identity is present.', no: 'No signed-in identity: stop before checking access.' },
      { name: 'Workspace', pass: workspace === 'own', status: '403 Forbidden',
        yes: 'The record belongs to the assigned workspace.', no: 'This record belongs to another workspace, even for an administrator.' },
      { name: 'Permission', pass: action === 'read' || role === 'admin', status: '403 Forbidden',
        yes: action === 'read' ? 'Signed-in roles may read within their workspace.' : 'The administrator role may publish within its workspace.',
        no: 'Reviewer and editor roles cannot publish in this example.' },
      { name: 'Record state', pass: action === 'read' || state === 'draft', status: '409 Conflict',
        yes: action === 'read' ? 'Draft and archived records are both readable.' : 'A draft is eligible for publication.',
        no: 'An archived record cannot be published, despite sufficient permission.' },
    ];
    let blocked;
    const checks = rules.map(rule => {
      if (blocked) return { name: rule.name, outcome: 'NOT RUN', detail: 'An earlier check stopped the operation.' };
      if (!rule.pass) blocked = rule;
      return { name: rule.name, outcome: rule.pass ? 'PASS' : 'STOP', detail: rule.pass ? rule.yes : rule.no };
    });
    return { allowed: !blocked, status: blocked?.status || '200 OK',
      reason: blocked?.no || (action === 'read' ? 'Read permitted. No record changes.' : 'Publication permitted by this fictional policy.'), checks };
  }
  scope.PortfolioAccess = { decide };
})(typeof window === 'undefined' ? globalThis : window);
