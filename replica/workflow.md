# Replica workflow — COLON AI

## Goal
Rebuild useful public-facing functionality patterns observed in AL VE CAPITAL as an original product called COLON AI. The reference is for product research, not for copying implementation or protected content.

## Clean-room rules
- Use only publicly accessible pages and information the project owner is authorized to access.
- Do not bypass logins, paywalls, anti-bot controls, or terms of service.
- Do not copy source code, private APIs, database contents, brand assets, logos, wording, or paid datasets.
- Recreate the underlying user problem and interaction patterns with original UI, copy, architecture, and data.
- Record the source and confidence of every factual product observation. Mark unknowns as unknown.

## Workflow
1. **Recon:** list public screens, user journeys, visible features, and unanswered questions in `recon.md`.
2. **Feature inventory:** maintain `features.csv` with priority, evidence, implementation status, and acceptance criteria.
3. **Architecture:** document original routes, components, data flow, and integrations in `architecture.md`.
4. **Data model:** review `schema.sql` against the live Supabase schema and RLS policies before changing it.
5. **Design:** use original COLON AI tokens and components in `design/`; verify contrast and responsive layouts.
6. **Build:** implement one user journey at a time with typed code and explicit loading, empty, success, and error states.
7. **Backend:** verify authentication, ownership checks, RLS, validation, and secret handling.
8. **Test:** update `test-plan.md`; test calculations, API contracts, database writes, and complete user flows.
9. **Parity review:** compare required user outcomes, not pixels or protected expression. Record missing features honestly.
10. **Brand review:** keep COLON AI identity distinct from the reference brand.
11. **Launch review:** run lint, type-check, build, security checks, and deployment smoke tests before release.

## Current implementation status
- Implemented: French dashboard shell, Supabase email/password auth screens, OpenFootball fixture route and match center, bankroll ledger UI, coupon draft builder.
- Data source limitation: OpenFootball does not provide live scores, bookmaker odds, confirmed lineups, absences, shots on target, or corners.
- Pending verification: production build after lint fixes; signup/login with a real user-approved account; real RLS-protected bankroll and coupon writes; mobile and desktop smoke tests.
- Not implemented yet: calibrated AI predictions, live odds comparison, arbitrage feed, premium billing, admin workflows, and ticket OCR.

## Release gate
Do not call COLON AI production-ready until the production deployment is READY and authentication, user-owned database writes, fixture rendering, and error handling have been verified end to end.
