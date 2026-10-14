# Static dependency cleanup

On 14 October 2026 the owner requested fixes for the source-map-js and braces
alerts reported by GitHub. Both were transitive dependencies of the unfinished
Next.js toolchain; the published static site and its Node scripts do not use it.

The previous lockfile contained source-map-js 1.2.1 and braces 3.0.3.
GitHub's reviewed source-map-js advisory identifies 1.2.2 as the patched
release. The current braces advisory lists no patched upstream release.
[Source-map-js advisory](https://github.com/advisories/GHSA-68fv-2mgg-jv7q),
[Braces advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm).

Remove the unused Next/React/Tailwind/ESLint scaffold dependencies from the
active package manifest rather than introduce an unofficial braces fork or
suppress the alert. Regenerate the lockfile and retain the existing scaffold
source as a dormant reference. The earlier manifest remains in Git history.
This does not install Angular or accept its pending technical design.

Root build/dev/start/test scripts now run the dependency-free static workflow.
The unused Next lint/type/Jest commands are removed. A clean npm ci with scripts
disabled completes; npm ls lists no third-party dependencies. The regenerated
lockfile contains only the root package, and npm audit reports zero vulnerabilities.

Future Angular dependencies need supported versions, public registry origins,
reviewed lockfiles and fresh security checks under the accepted design.
Reintroducing the legacy dependency tree is not an approved way to resume it.

GitHub can reassess remote alerts only after these manifest changes reach
the monitored branch. Local verification does not close remote alerts.
