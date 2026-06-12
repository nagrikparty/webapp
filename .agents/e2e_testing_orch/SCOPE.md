# Scope: E2E Test Suite Creation

## Architecture
- Directory: `tests/e2e/`
- Runner: Playwright

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Tier 1 Tests | 30 tests (5 per feature) covering F1-F6 happy paths | none | PLANNED |
| 2 | Tier 2 Tests | 30 tests (5 per feature) covering boundary & error cases | none | PLANNED |
| 3 | Tier 3 Tests | 6+ pairwise combination tests | none | PLANNED |
| 4 | Tier 4 Tests | 5 real-world scenarios | none | PLANNED |

## Interface Contracts
- Tests must be executable via `npx playwright test`.
- We assume UI endpoints based on common conventions (e.g. `/register`, `/admin/queue`, `/admin/proposer`). Tests should use `data-testid` or standard accessibility locators.
