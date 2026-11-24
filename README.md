# Clear Choice

README prose word count: 569 (excluding headings, code and setup commands; approximate whitespace count).

An A2 prototype extending the A1 literature review on personalised advertising in AI conversations. It separates recognition of sponsorship, explanation of information use, and effective user control.

## Status
- Implemented: rule-based request parsing, budget filtering, separate ordinary/sponsored ranking, metadata-derived explanations, opt-in purpose use for ads, hide ads, undo, reset, clarification and evidence export.
- Simulated: six headphone products, specifications, sponsor relationships and a limited conversational assistant.
- Planned: live LLM extraction, larger catalogue and a participant comprehension study. No model, real advertiser, purchase, external tracking or persistent profile is connected.
- Purpose-based ad personalisation starts off. The budget is always enforced. Reload clears app memory; exports already downloaded remain on the device. Static hosting may process normal request metadata; the app itself sends no shopping requests to a server.

## Run or inspect
Use Python 3 to serve the static files; no packages or API key required.

```sh
python3 -m http.server 8000 --directory dist
```

Open `http://localhost:8000`. A file opened directly may block JavaScript modules; use the server.

With Node 22 or later, run:

```sh
node --test tests/engine.test.mjs
```

## Walkthrough
1. Choose **My commute**. Aster Lite is the sponsored result; purpose use for ads is off.
2. Enable **Use my purpose for ads**. Metro Quiet replaces it. Open its explanation to inspect the actual inputs.
3. Choose **Stop using my purpose for ads**. Aster Lite returns and the purpose input disappears from ad explanations.
4. Disable **Show sponsored recommendations**. Ordinary picks stay unchanged. Use Undo to restore settings.
5. Choose **Nothing in budget** or type **Stop that** to inspect empty results and clarification.

## Technology and behavior
HTML/CSS, native JavaScript modules and browser memory only. The small parser recognises explicit budget/use-case phrases and listed control commands. Ranking and explanations share result metadata in `dist/engine.mjs`. Sponsorship determines eligibility for a separate placement; it never boosts ordinary products. The engine is inspectable and deterministic, not trained AI.

## Development record and assistance
See [development decisions and checks](docs/DEVELOPMENT.md), [verified course mapping](docs/COURSE_MAPPING.md), [response to A1 feedback](docs/FEEDBACK_RESPONSE.md), [browser verification](docs/BROWSER_TESTS.md), [actual exported session](docs/browser-session.json), [test output](docs/automated-test-output.txt), [trace excerpt](docs/trace_excerpt.md) and [handover](docs/HANDOVER.md).

The user supplied A1, Lab 4 and Lab 5 and accepted the advertising-transparency project direction. Codex generated the implementation, tests, figures, report draft and documentation. Codex inspected the lab source, checked literature, reviewed test failures and ran browser checks. The student has not yet independently reviewed this generated submission; no student testing or authorship of generated code is claimed. Student review and any subsequent changes should be recorded before submission.

Lab 4 informed provenance display, refusal and user-control patterns. Its Python server, model mocks, API code, image mocks and local booking files were not copied into this app. Lab 5 informed task boundaries, skills, verification, trace and handover methods; its separate starter is not part of this prototype. SVG product illustrations were generated as original code. All product facts are fictional.

## Submission material
Report, system diagram and storyboards are supplied alongside the source package. Screenshots and evidence are under `docs/`. Public source: https://github.com/nicegugu/clear-choice-a2 . The submitted source commit is recorded in the report and delivery note. README: https://github.com/nicegugu/clear-choice-a2/blob/main/README.md . Private demonstration: https://clear-choice-a2-zp3116705.neonfort17.chatgpt.site . Reviewers can run the public source locally without access to the private demonstration.

## Limits
Controls are verified within this small deterministic catalogue. They do not establish improved human comprehension, trust, or effectiveness in real ad networks. No participant study was conducted. Ambiguous or unsupported instructions ask for clarification. No automatic deletion of existing downloads is claimed. The reset button clears this app's in-memory session, not browser history or hosting logs.
