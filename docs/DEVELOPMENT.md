# Development record

Date: 24 November 2026. This records agent work observed in the current session, not an invented student diary.

| Decision or change | Reason and author | Verification |
| --- | --- | --- |
| Continue A1 with sponsorship recognition, data-use explanations and control | User accepted the project direction after A1 was inspected. | A1 scope explicitly separates these issues. |
| Use six fictional headphones and deterministic ranking instead of a live LLM | Codex implementation choice: isolate known targeting inputs and produce verifiable controls. No model capability is claimed. | UI and About dialog disclose the simulation; engine contains no API/network call. |
| Default purpose use for ads to off; retain a budget cap | Codex design choice: separate shopping assistance from optional ad personalisation. Budget is an explicit always-applied constraint. | Off/on/off tests and browser sequence; hard-cap loop checks budgets 1–1000. |
| Derive explanations from ranking metadata | Codex choice to prevent a fluent explanation from inventing data use. | Every result's explanation inputs equal its `usedFields` metadata. |
| Separate ordinary and sponsored lists | Codex choice to make commercial influence visible and control effects testable. | Ad settings and campaign priority do not alter ordinary results. |
| Fix an initially incorrect test fixture | First run: 14/15 passed. The fixture added a campaign priority field to ordinary products too, making object equality fail even though ranking was unchanged. Codex restricted the fixture mutation to sponsored products; assertion retained. | Second run and saved final output: 15/15 passed. No production change was needed for this failure. |
| Add clarification, undo and empty-state handling | Codex choice: retain correct constraints and make recoverability visible. | Browser observed no revision change for “Stop that”; £20 returned no products; undo restored ads. |
| Keep shopping session local and export only on request | Codex scope choice: no persistent profile or ad service is needed for this demonstration. | Browser reload reset state; download produced inspectable JSON; no app network calls beyond static asset loading. |

## Verification boundaries
Engine checks and browser observations establish behavior in this prototype. They do not constitute a user study, a security audit, or evidence that people understand the explanations. Mobile QA at a 390px layout showed a stacked interface with document width equal to viewport width. Formal accessibility testing has not been performed.

## Course and reference status
A2 assignment text and A1 were read. Only prior discussion of lecture concepts was available; the full Weeks 1–4 slide set and tutor feedback were not supplied. Exact lecture titles, slide numbers and the student's own understanding must be checked before submission. The report does not invent slide citations or tutor feedback.

## Remaining student contribution
Run the prototype personally, inspect the controls and explain the algorithm. Review the report's claims and references, record any changes made, verify the lecture mapping, and publish a public GitHub snapshot. These actions have not been represented as already completed.
