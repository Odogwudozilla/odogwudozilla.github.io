/** Validate and report the repository-owned backlog. No network or dependencies. */
import { readFile, writeFile, access } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const backlog = JSON.parse(await readFile(new URL('design/backlog.json', root), 'utf8'));
const contract = JSON.parse(await readFile(new URL('design/contract.json', root), 'utf8'));
const statuses = ['done', 'ready', 'waiting_owner', 'blocked', 'planned', 'deferred'];
const ids = new Map();
const fail = message => { throw new Error(message); };
if (backlog.schemaVersion !== 1 || !/^\d{4}-\d{2}-\d{2}$/.test(backlog.reviewedOn)) fail('Invalid backlog version/date');
if (!Array.isArray(backlog.stories) || !backlog.stories.length) fail('Backlog must contain stories');
if (backlog.implementationGate !== 'closed' || !contract.implementationGate.startsWith('closed')) {
  fail('Gate state changed: reconcile the accepted contract and outlook rules explicitly');
}
for (const story of backlog.stories) {
  if (!/^[A-Z]+-\d{2}$/.test(story.id) || ids.has(story.id)) fail(`Invalid/duplicate ID: ${story.id}`);
  ids.set(story.id, story);
  if (!statuses.includes(story.status) || !/^P[0-3]$/.test(story.priority)) fail(`Invalid state: ${story.id}`);
  for (const key of ['title', 'phase', 'goal']) if (!story[key]?.trim()) fail(`Missing ${key}: ${story.id}`);
  if (!Array.isArray(story.acceptance) || story.acceptance.length < 2 || story.acceptance.some(item => !item.trim())) fail(`Missing acceptance criteria: ${story.id}`);
  if (!Array.isArray(story.dependsOn)) fail(`Missing dependencies: ${story.id}`);
  if (story.status === 'done' && !story.evidence?.length) fail(`Done without evidence: ${story.id}`);
  if (story.status === 'ready' && story.phase !== 'Planning and decisions') fail(`Implementation cannot be ready while the gate is closed: ${story.id}`);
  for (const ref of story.evidence || []) {
    if (!ref.startsWith('https://')) await access(new URL(ref, root));
  }
}
const visited = new Set(), visiting = new Set();
function visit(story) {
  if (visiting.has(story.id)) fail(`Dependency cycle: ${story.id}`);
  if (visited.has(story.id)) return;
  visiting.add(story.id);
  for (const dependency of story.dependsOn) {
    const item = ids.get(dependency);
    if (!item) fail(`Unknown dependency ${dependency} in ${story.id}`);
    if (['ready', 'done'].includes(story.status) && item.status !== 'done') fail(`Unmet dependency in ${story.id}`);
    visit(item);
  }
  visiting.delete(story.id); visited.add(story.id);
}
for (const story of backlog.stories) visit(story);

const count = status => backlog.stories.filter(story => story.status === status).length;
const lines = [
  '# Story backlog', '',
  '<!-- Generated from design/backlog.json by npm run outlook:update. Edit the JSON, not this file. -->', '',
  `Last reconciled: **${backlog.reviewedOn}**. Baseline: \`${backlog.baselineCommit}\`.`, '',
  'The static site is shipped. Dynamic planning has reopened at the owner’s request; application implementation remains gated. These stories describe intended work, not approval of proposed mechanisms.', '',
  `First useful milestone: **${backlog.firstMilestone}**.`, '',
  '| State | Stories | Meaning |', '| --- | ---: | --- |',
  ...statuses.map((status, index) => `| ${status} | ${count(status)} | ${[
    'Delivered with recorded evidence; grouped baseline items are not equal-sized units.',
    'Planning work can begin; no application install or provisioning is authorised.',
    'A specific owner decision is needed.', 'Direct dependencies or decisions prevent starting.',
    'Sequenced future work; requires dependencies and the relevant gate to open.',
    'Optional or unaccepted; excluded from committed delivery.',
  ][index]} |`), '',
  'Counts are inventory, not percentage complete or effort estimates. Baseline stories and optional umbrellas differ in size. No dynamic implementation story is done.', '',
  '## Immediate outlook', '',
  ...backlog.stories.filter(story => ['waiting_owner', 'ready', 'blocked'].includes(story.status))
    .map(story => `- **${story.id} — ${story.title}** (${story.status}). ${story.goal}`), '',
  `Backend evidence last checked **${backlog.providerEvidence.lastCheckedOn}**: ${backlog.providerEvidence.state}`, '',
  '## Stories', '',
];
for (const phase of new Set(backlog.stories.map(story => story.phase))) {
  lines.push(`### ${phase}`, '');
  for (const story of backlog.stories.filter(item => item.phase === phase)) {
    lines.push(`#### ${story.id} — ${story.title}`, '',
      `**${story.status} · ${story.priority}** | Depends on: ${story.dependsOn.join(', ') || 'none'}`, '',
      story.goal, '', ...story.acceptance.map(item => `- ${item}`));
    if (story.evidence) lines.push('', 'Evidence: ' + story.evidence.map(ref => `[${ref}](${ref.startsWith('https://') ? ref : '../' + ref})`).join(', '));
    lines.push('');
  }
}
lines.push('## Keep this outlook current', '',
  'After each completed bundle, update status, evidence and dependencies in design/backlog.json. Update reviewedOn only after reconciling shipped work, decisions and blockers; a generated report alone is not a review.', '',
  'Run `npm run outlook:update` to regenerate this page, `npm run outlook:check` to validate it, and `npm run outlook` for a concise status report. These local commands are available; they are not yet a required CI check or a scheduled automation.', '',
  'For a periodic review, ask: “Reconcile the roadmap and backlog against merged work and report what shipped, what is next, what is blocked, which decisions I owe, and what changed since the previous review.” Recheck provider/version evidence when its decision story is taken up. This request does not create a recurring schedule.', '',
  'A story is done only when its acceptance criteria pass and evidence is linked. Move reopened/changed stories back to an appropriate state. Never mark technical decisions accepted solely by changing this file. Preserve the ADR history and keep credentials/private account identifiers out of evidence.', '');
const markdown = lines.join('\n');
const target = new URL('docs/story-backlog.md', root);
if (process.argv.includes('--write')) await writeFile(target, markdown);
else if (process.argv.includes('--check')) {
  if ((await readFile(target, 'utf8')).replaceAll('\r\n', '\n') !== markdown) fail('Story backlog is stale. Run npm run outlook:update');
}
console.log(`Outlook reviewed ${backlog.reviewedOn}; dynamic implementation gate CLOSED.`);
console.log(statuses.map(status => `${status}: ${count(status)}`).join(' | '));
for (const story of backlog.stories.filter(item => ['waiting_owner', 'ready', 'blocked'].includes(item.status))) {
  console.log(`${story.id} [${story.status}] ${story.title}${story.dependsOn.length ? ' <- ' + story.dependsOn.join(', ') : ''}`);
}
console.log('Milestone: ' + backlog.firstMilestone);
