# COLON AI — Agent instructions

This repository follows an ECC-style engineering loop: **plan → test → implement → review → verify → document**.

## Product boundaries
- Build COLON AI as an original football analytics product. AL VE CAPITAL is a public product reference for feature discovery only.
- Never copy third-party source code, proprietary assets, logos, wording, private endpoints, authenticated content, or protected datasets.
- Do not claim that a prediction is certain or that a bet is safe. Label measured facts, estimates, assumptions, data gaps, and risk separately.
- Never invent odds, lineups, injuries, shots on target, corners, live scores, or statistics. The current OpenFootball source provides fixtures and some final scores only.
- Every football match shown must include the full competition name.
- Never place bets or interact with a bookmaker automatically.

## Stack and data
- Next.js App Router, TypeScript, React, Supabase, and Vercel.
- Supabase is the source of truth for user profiles, bankrolls, transactions, coupons, and user-owned records.
- Keep service-role keys and all provider secrets server-side. Never expose them through `NEXT_PUBLIC_*`.
- Respect Row Level Security. Every user-owned query must be scoped by the authenticated user and protected by RLS.
- Currency is XOF (FCFA); timezone is Africa/Lome.
- OpenFootball is a community dataset, not a live feed. Communicate its limitations in the UI.

## Required engineering workflow
1. Before changing code, inspect the affected files, schema, current deployment, and related tests.
2. State the user story and acceptance criteria. For bug fixes, reproduce the failure from logs or a failing test.
3. Make the smallest coherent change. Prefer typed helpers and clear error states over silent fallbacks.
4. Add or update tests for calculations, validation, authorization, and API response contracts.
5. Run lint, TypeScript checks, and production build. Do not suppress rules just to get a green build.
6. Review the diff for security, data leakage, accessibility, mobile layout, and regressions.
7. Verify the deployed flow from UI to API to Supabase/data source and back to the UI.
8. Report what passed, what failed, and what remains unverified. Never report a test as passed without evidence.

## Commands
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`

## Database safety
- Inspect the live schema and RLS policies before writing migrations.
- Prefer additive migrations. Do not drop or truncate user data.
- Verify schema changes with read-only SQL checks and Supabase security advisors.
- Never use a service-role key in browser code.

## Betting calculations
- Decimal combined odds = product of individual decimal odds.
- Implied probability = 1 / combined odds; explain that it is not a calibrated real-world probability and excludes bookmaker margin.
- Potential return is theoretical, not guaranteed. Keep staking decisions under user control.
