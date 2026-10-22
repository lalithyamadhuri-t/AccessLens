# AccessLens — Accessibility Engineering & Verification Platform

AccessLens is a portfolio project for investigating web accessibility barriers through automated checks, controlled defect fixtures, manual evaluation workflows, and remediation verification.

## Current features
- React dashboard with keyboard-accessible navigation and responsive layout.
- Six defect-lab scenarios: forms, keyboard, images and links, dialogs and menus, dynamic content, and responsive/zoom behavior.
- Seeded-defect and corrected-example modes.
- Real axe-core evaluation of the active local fixture.
- Findings view with rule identifiers, impact, affected HTML, and linked rule guidance.
- 26 manual testing cases with category filtering and result tracking.
- Local JSON exports for audit reports and manual checklists.
- Playwright tests for core workflows.
- Documentation of architecture, test methodology, WCAG mapping, and limitations.

## Important scope
This version audits only the selected fixture inside the application. It does **not** scan arbitrary public URLs, does not persist results after refresh, and does not certify WCAG conformance. Automated testing cannot determine every accessibility issue; manual testing is required.

## Requirements
- Node.js 20 or later recommended
- npm
- Chromium browser installed by Playwright for end-to-end tests

## Run locally
1. Extract the ZIP.
2. Open a terminal in the extracted `AccessLens` folder.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL printed by Vite (usually `http://127.0.0.1:5173`).

## Run end-to-end tests
Install the Playwright browser once:

```bash
npx playwright install chromium
npm run test:e2e
```

If browser installation is blocked by your network, you can still run the app and build it with `npm run build`.

## Suggested evaluation workflow
1. Open **Defect Lab**.
2. Select a scenario.
3. Keep **Seeded defects** selected and run the audit.
4. Review findings and linked rule guidance.
5. Switch to **Corrected example** and rerun.
6. Record real keyboard and screen-reader observations in **Manual checks**.
7. Export the report and document what the automated scanner did and did not detect.

## Manual testing
Use keyboard-only navigation, browser developer tools and accessibility tree, zoom/reflow, and a screen reader such as NVDA on Windows. Record only tests you actually perform. See `docs/testing-methodology.md`.

## Technology
React, JavaScript, Vite, axe-core, Playwright, Lucide icons.

## References
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [W3C WAI: Test and Evaluate](https://www.w3.org/WAI/test-evaluate/)
- [axe-core](https://github.com/dequelabs/axe-core)
- [Playwright](https://playwright.dev/docs/intro)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)

## License
This project source is provided under the MIT License. Third-party dependencies retain their own licenses.
