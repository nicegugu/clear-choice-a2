# Browser verification

Observed by Codex in the in-app browser on 24 November 2026, using the local static server. This is functional QA, not a participant evaluation.

| Case | Observed result |
| --- | --- |
| My commute, £100 | Harbour Studio and Field Runner in ordinary results; Aster Lite sponsored; purpose-for-ads off. |
| Enable purpose for ads | Sponsored selection changed to Metro Quiet; ordinary results stayed Harbour Studio / Field Runner. |
| Explain Metro Quiet | Dialog named fictional sponsor, category, £100 cap, stated commute purpose and ranking effect; revision 2. |
| Withdraw from explanation | Dialog closed, purpose setting switched off, Aster Lite returned; revision 3. |
| Hide sponsored recommendations | Sponsored product removed, ordinary products unchanged; revision 4. |
| Undo | Sponsored placement restored with previous settings; revision 5. A separate follow-up sequence also restored £100 after a £20 request and kept commuting as the purpose. |
| £20 query | No ordinary/sponsored products; £20 remained visible; revision 6. |
| “Stop that” | Asked which control to change; no settings/revision change. |
| Export evidence | Browser downloaded JSON; inspected copy retained as `browser-session.json`. |
| Reset | Requests/settings cleared from page; purpose ad use off; events reset to zero. |
| Mobile viewport | At 390px, workspace stacked and document width was 390px; screenshot retained. |

Screenshots 01–06 are actual browser captures. `prototype-preview.jpg` is a later reset-and-query capture. Drawn storyboards in the report illustrate these observed states; they are not participant data.
