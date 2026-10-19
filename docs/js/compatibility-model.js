/* A fixed synthetic client: tolerant of extra fields, strict about fields it reads. */
((scope) => {
  'use strict';
  const request = { title: 'Review API contract' };
  const original = { id: 'task-42', title: request.title };
  const scenarios = {
    extra: { title: 'Extra response field', required: ['title'], response: { ...original, priority: 'normal' },
      migration: 'Keep the added field optional for consumers; check stricter clients separately.',
      explanation: 'This client ignores fields it does not read, so adding priority leaves its existing behaviour intact.' },
    rename: { title: 'Rename a response field', required: ['title'], response: { id: original.id, name: original.title },
      migration: 'Keep title alongside name while existing clients migrate.',
      explanation: 'The existing client still reads title. Renaming it to name removes a field the client needs.' },
    type: { title: 'Change a response type', required: ['title'], response: { ...original, id: 42 },
      migration: 'Keep id as a string in this contract; use a new version if a numeric contract is needed.',
      explanation: 'This client expects a string identifier. A numeric id fails that expectation even though the JSON is valid.' },
    required: { title: 'Require a new request field', required: ['title', 'priority'], response: original,
      migration: 'Accept missing priority with a documented default while existing clients migrate.',
      explanation: 'The existing client sends only title. Making priority required rejects a request that previously worked.' },
  };
  function check({ required, response }, input = request) {
    const missing = required.filter(key => typeof input[key] !== 'string' || !input[key].trim());
    if (missing.length) return { compatible: false, stage: 'Request validation', status: '400 Bad Request',
      payload: { error: 'Missing required field', fields: missing }, message: `Request rejected: ${missing.join(', ')} is required.` };
    const invalid = ['id', 'title'].filter(key => typeof response[key] !== 'string');
    if (invalid.length) return { compatible: false, stage: 'Client decoding', status: '201 Created',
      payload: response, message: `Response received, but the client needs ${invalid.join(' and ')} as a string.` };
    return { compatible: true, stage: 'Client decoding', status: '201 Created', payload: response,
      message: `Client reads ${response.id}: ${response.title}.` };
  }
  scope.PortfolioCompatibility = { request, original, scenarios, check };
})(typeof window === 'undefined' ? globalThis : window);
