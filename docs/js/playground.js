/* A deterministic teaching example. No network, storage or real service calls. */
(() => {
  'use strict';
  const root = document.querySelector('.api-playground');
  if (!root) return;
  const find = selector => root.querySelector(selector);
  const controls = find('.flow-controls');
  const buttons = [...root.querySelectorAll('[data-scenario]')];
  const stages = [...root.querySelectorAll('[data-flow-stage]')];
  const run = find('.flow-run'), next = find('.flow-next'), reset = find('.flow-reset');
  const request = 'POST /demo/tasks\nContent-Type: application/json\n\n';
  const validBody = JSON.stringify({ title: 'Review API contract' }, null, 2);
  const examples = {
    valid: {
      body: validBody, status: '201 Created',
      response: 'HTTP/1.1 201 Created\nLocation: /demo/tasks/demo-1042\nContent-Type: application/json\n\n'
        + JSON.stringify({ id: 'demo-1042', title: 'Review API contract' }, null, 2),
      outcomes: ['Sent', 'Passed', 'Created', '201 Created'],
      titles: ['A request is ready.', 'The input is valid.', 'The service creates a task.', 'The task was created.'],
      explanations: [
        'A client asks to create a task. The JSON body contains a non-blank title. Next comes input validation.',
        'The title is present, is a string and contains text. The request can continue to the service.',
        'In this simulated success path, processing creates task demo-1042. The response is assembled next.',
        'The input passed validation and the service created a task. The response includes its identifier and a location for the new resource.',
      ],
    },
    invalid: {
      body: JSON.stringify({ title: '' }, null, 2), status: '400 Bad Request',
      response: 'HTTP/1.1 400 Bad Request\nContent-Type: application/json\n\n'
        + JSON.stringify({ error: 'VALIDATION_FAILED', field: 'title', message: 'Title must not be blank.' }, null, 2),
      outcomes: ['Sent', 'Rejected', 'Skipped', '400 Bad Request'],
      titles: ['This request has a blank title.', 'Validation catches the problem.', 'Processing is skipped.', 'The client gets a useful error.'],
      explanations: [
        'The JSON is syntactically valid, but the title is blank. This example treats that as a bad request.',
        'The title fails the non-blank rule. The failure is handled before the service is called.',
        'No task is created. The rejected input does not reach the service; the next step prepares a field-level error.',
        '400 identifies invalid input in this API. The field and message tell the client what to correct before resubmitting.',
      ],
    },
    unavailable: {
      body: validBody, status: '503 Service Unavailable',
      response: 'HTTP/1.1 503 Service Unavailable\nRetry-After: 30\nContent-Type: application/json\n\n'
        + JSON.stringify({ error: 'TEMPORARILY_UNAVAILABLE', message: 'Please try again later.' }, null, 2),
      outcomes: ['Sent', 'Passed', 'Unavailable', '503 Service Unavailable'],
      titles: ['The request is valid; the service may fail.', 'Validation passes.', 'The service is temporarily unavailable.', 'The failure has a clear response.'],
      explanations: [
        'The title is valid. This scenario shows why correct input alone cannot guarantee a successful response.',
        'The input passes the same checks as the successful request. Processing is attempted next.',
        'This simulated failure happens before a task is created. The service cannot complete the work right now.',
        '503 signals a temporary service failure. Retry-After suggests a 30-second wait. Real clients must consider idempotency before retrying a POST; this demo sends nothing.',
      ],
    },
  };
  let scenario = 'valid', step = 0, playing = false, timer;

  function stop() {
    clearTimeout(timer);
    timer = undefined;
    playing = false;
  }

  function render() {
    const example = examples[scenario];
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.scenario === scenario)));
    stages.forEach((stage, index) => {
      let state = index < step ? 'complete' : index === step ? 'current' : 'waiting';
      if (index <= step && scenario === 'invalid' && index === 1) state = 'failed';
      if (index <= step && scenario === 'invalid' && index === 2) state = 'skipped';
      if (index <= step && scenario === 'unavailable' && index === 2) state = 'failed';
      stage.dataset.state = state;
      if (index === step) stage.setAttribute('aria-current', 'step');
      else stage.removeAttribute('aria-current');
      stage.querySelector('.flow-state').textContent = index <= step ? example.outcomes[index] : 'Waiting';
    });
    find('.flow-progress').textContent = `Step ${step + 1} of 4 · ${example.outcomes[step]}`;
    find('.flow-title').textContent = example.titles[step];
    find('.flow-explanation').textContent = example.explanations[step];
    find('.flow-request').textContent = request + example.body;
    find('.flow-response-label').textContent = step === 3 ? example.status : 'Pending';
    find('.flow-response').textContent = step === 3 ? example.response
      : '// No response yet.\n// Follow the request to the final step.';
    run.textContent = playing ? 'Pause flow' : step === 3 ? 'Run again' : 'Run flow ▶';
    next.textContent = step === 3 ? 'Back to start' : 'Next step';
  }

  function schedule() {
    timer = setTimeout(() => {
      if (!playing) return;
      step++;
      if (step === 3) stop();
      render();
      if (playing) schedule();
    }, 1800);
  }

  buttons.forEach(button => button.addEventListener('click', () => {
    if (!examples[button.dataset.scenario] || button.dataset.scenario === scenario) return;
    stop();
    scenario = button.dataset.scenario;
    step = 0;
    render();
  }));
  next.addEventListener('click', () => {
    stop();
    step = (step + 1) % 4;
    render();
  });
  reset.addEventListener('click', () => { stop(); step = 0; render(); });
  run.addEventListener('click', () => {
    if (playing) { stop(); render(); return; }
    if (step === 3) step = 0;
    playing = true;
    render();
    schedule();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && playing) { stop(); render(); }
  });
  render();
  controls.hidden = false;
})();
