---
name: verify-data-controls
description: Use when changing recommendation ranking, explanations, or controls governing how session information is used.
---

# Verify data controls

1. Read `AGENTS.md`, `dist/engine.mjs` and the affected engine tests.
2. State the expected invariant before editing: input exclusion, budget limit or independence of ordinary ranking.
3. Reproduce the current behavior using `node --test tests/engine.test.mjs`.
4. Change the relevant code and add a behavioral check where the existing suite does not cover the invariant.
5. Run `node --test tests/engine.test.mjs` and inspect the diff.
6. In the browser, use a £100 commuting request; compare ads with purpose use off/on/off; inspect the explanation after each change.
7. Record observed outcomes and verification limits in `docs/DEVELOPMENT.md`.

## Completion
All engine tests pass; metadata and explanation exclude disabled inputs; browser selection reflects the current settings; ordinary results remain unchanged when ads are hidden.

## Do not
Do not infer correct execution from a reassuring message or from a changed product alone. Inspect the input metadata and explanation too.
