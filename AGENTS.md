# Clear Choice project instructions

This is a dependency-free browser prototype for transparent sponsored headphone recommendations. The simulated conversation uses explicit rules; there is no live LLM or ad network.

## Run and verify
- Serve: `python3 -m http.server 8000 --directory dist`
- Verify engine behavior: `node --test tests/engine.test.mjs` (Node 22 or later recommended).
- Browser QA is separate from engine tests. Check explain, withdraw, hide, undo, empty results, ambiguous commands and mobile layout.

## Conventions
- Derive explanations from the exact result metadata. Keep budget as a hard cap.
- Ordinary ranking must not depend on sponsorship or ad settings.
- Purpose is excluded from ad ranking unless explicitly enabled.
- Label fictional commercial data and the absence of a live model accurately.

## Boundaries
- Do not copy Lab 5 starter over this app, include API keys, or add analytics.
- Do not weaken behavioral assertions to make checks pass.
- Keep user study proposals separate from observations; never invent participant results or student review.
- Ask when a request changes data-use scope or conflicts with existing user controls.
