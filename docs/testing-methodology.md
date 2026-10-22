# Testing methodology

## Automated
The app uses axe-core against the selected fixture and includes WCAG-related and best-practice tags. The exact set of rules can change with the axe-core version. Review the output and linked rule documentation rather than treating a score as a certification.

## Manual
Use the checklist in the application to record observed results for:
- Keyboard-only operation and focus visibility.
- Dialog and menu behavior.
- Screen-reader output and accessible names.
- Alternative text and link purpose in context.
- Zoom, reflow, contrast, and content meaning.
- Dynamic status messages.

## Defect lab
Each scenario has a seeded-defect mode and a corrected-example mode. Some defects are intentionally chosen to illustrate issues that may not produce an axe-core violation. This is expected: use the fixture to discuss the limits of automation, not to promise that every seeded issue will be automatically detected.

## Results integrity
Only record results produced by the running application. Do not report example counts or detection rates until you have executed and documented a defined test set. A passing automated scan is not a conformance determination.
