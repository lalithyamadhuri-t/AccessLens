# Architecture

AccessLens is a client-side React/Vite application. It runs axe-core against the active local fixture, displays findings, records manual checklist states in the current session, and exports JSON reports.

## Main areas
- `src/App.jsx`: navigation, audit orchestration, results, exports, and checklist state.
- `src/components/DefectLab.jsx`: six controlled test fixtures, each with seeded and corrected modes.
- `src/data/testCases.js`: manual evaluation checklist and WCAG references.
- `tests/accesslens.spec.js`: Playwright smoke and workflow tests.

## Data and privacy
- The initial version does not send scan data to a server.
- Results live in browser memory and are lost on refresh.
- Exports are generated locally in the browser.
- The app audits only its selected fixture; it does not fetch or scan arbitrary external websites.

## Future extension ideas
1. Persist reports in a database with explicit consent and retention controls.
2. Add authenticated team workspaces.
3. Add URL scanning through an isolated server-side browser with SSRF protections.
4. Add report comparison and issue lifecycle management.
5. Add CI integration and signed test artifacts.
