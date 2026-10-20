/* Deterministic synthetic traces. Times are model inputs, never production measurements. */
((scope) => {
  'use strict';
  const scenarios = {
    valid: { title: 'Healthy request', lesson: 'Validation, a committed write and a readable response are separate operations.' },
    invalid: { title: 'Invalid input', lesson: 'Reject invalid input before it reaches the service or creates a record.' },
    unavailable: { title: 'Service unavailable', lesson: 'This failure happens before a write. Retrying still needs an explicit safety policy.' },
    slow: { title: 'Slow dependency', lesson: 'The client times out, but the server later commits. A timeout alone cannot tell you whether a write happened.' },
    duplicate: { title: 'Lost reply + retry', lesson: 'The first write commits before its reply is lost. Compare retrying with and without an idempotency key.' },
  };
  const task = { id: 'task-42', title: 'Review API contract' };
  function simulate(kind, protectedRetry = true) {
    if (!scenarios[kind]) throw new Error('Unknown investigation scenario');
    const events = [];
    const add = (node, start, end, title, detail, extra = {}) => events.push({ node, start, end, title, detail, ...extra });
    add('client', 0, 10, 'Send request', 'POST /demo/tasks. The client asks the API to create a task.', { attempt: true,
      payload: { title: kind === 'invalid' ? '' : task.title, ...(kind === 'duplicate' && protectedRetry ? { idempotencyKey: 'op-42' } : {}) } });
    if (kind === 'invalid') {
      add('api', 10, 25, 'Reject blank title', 'Validation stops this request. No service or storage work runs.', { failed: true, payload: { field: 'title', error: 'Required' } });
      add('client', 25, 35, 'Read validation error', 'The client receives a field-level error; repeating the same invalid body will not fix it.', { failed: true, status: '400 Bad Request', payload: { field: 'title', error: 'Required' } });
    } else {
      add('api', 10, 25, 'Validate contract', 'The request contains a non-blank title.');
      if (kind === 'unavailable') {
        add('service', 25, 60, 'Service unavailable', 'The simulated dependency fails before a write.', { failed: true, payload: { error: 'Temporarily unavailable' } });
        add('client', 60, 75, 'Read service error', 'The client receives a temporary error and a suggested wait. No automatic retry occurs.', { failed: true, status: '503 Service Unavailable', payload: { error: 'Temporarily unavailable', retryAfterSeconds: 30 } });
      } else {
        const slow = kind === 'slow';
        if (slow) add('client', 25, 120, 'Client deadline expires', 'The client stops waiting. Work already in progress has not been cancelled.', { failed: true, status: 'Client timed out' });
        add('service', 25, slow ? 325 : 60, slow ? 'Dependency finishes late' : 'Prepare task', 'The service prepares a task to save.');
        const end = slow ? 355 : 90;
        add('store', slow ? 325 : 60, end, 'Commit task', 'The task is saved here, whether or not the client receives the reply.', { write: true, key: protectedRetry ? 'op-42' : null, payload: task });
        if (kind === 'duplicate') {
          const retryResult = protectedRetry ? task : { ...task, id: 'task-43' };
          add('client', 90, 120, 'Reply lost', 'The task exists, but the client never receives the success response.', { failed: true, status: 'Client timed out' });
          add('client', 120, 130, 'Retry same operation', protectedRetry ? 'Reuse op-42, the same key and the same request body.' : 'No key connects this request to the already committed operation.', { attempt: true });
          add('api', 130, 145, 'Validate retry', 'The repeated request is valid. Validation alone cannot prevent duplicate effects.');
          add('store', 145, 175, protectedRetry ? 'Resolve operation key' : 'Commit another task', protectedRetry ? 'Look up op-42 and reuse its saved result instead of creating another task.' : 'Without deduplication, another valid request creates another task.', { write: true, key: protectedRetry ? 'op-42' : null, payload: retryResult });
          add('client', 175, 190, 'Receive retry result', 'The client can read the response. Inspect Records saved to see whether the retry created a duplicate.', { status: '201 Created', payload: retryResult });
        } else {
          add('client', end, end + 15, slow ? 'Late reply ignored' : 'Read response', slow ? 'The response is too late for the client, although storage has committed.' : 'The client reads string id and title fields.', { ...(slow ? {} : { status: '201 Created' }), payload: task });
        }
      }
    }
    return { kind, protectedRetry, events, duration: events.at(-1).end, ...scenarios[kind] };
  }
  function frame(trace, count) {
    const visible = trace.events.slice(0, Math.max(0, count));
    const seen = new Set();
    let records = 0, attempts = 0, status = 'Ready';
    for (const event of visible) {
      if (event.attempt) attempts++;
      if (event.write && (!event.key || !seen.has(event.key))) { records++; if (event.key) seen.add(event.key); }
      if (event.status) status = event.status;
    }
    return { records, attempts, status, elapsed: visible.at(-1)?.end || 0, current: visible.at(-1) || null,
      complete: count >= trace.events.length };
  }
  scope.PortfolioInvestigation = { scenarios, simulate, frame };
})(typeof window === 'undefined' ? globalThis : window);
