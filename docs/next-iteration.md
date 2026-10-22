# Recommended next iteration

Before describing AccessLens as production-ready, consider implementing these enhancements:

1. Persist audit sessions and manual check outcomes.
2. Add a reproducible issue detail record with expected/actual behavior, steps, evidence, root cause, fix, and retest outcome.
3. Add a CI workflow that runs the Playwright tests.
4. Improve automated test coverage and manually test the app itself with keyboard and screen reader.
5. Add accessible contrast measurement utilities and documented limitations.
6. If adding arbitrary URL scanning, use a secure isolated browser service; validate URLs, block private/internal IP ranges and redirects to them, limit protocols and timeouts, and avoid exposing server credentials.
7. Add a proper modal focus trap and broader keyboard interaction tests for the dialog fixture before using it as a reference implementation.
8. Add persistent issue lifecycle tracking and audit comparison.
