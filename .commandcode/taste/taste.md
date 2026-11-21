# Taste

## Editing Code

- When fixing a compile/type error in code they wrote themselves, wants only the error fixed — no refactors, reformatting, or other changes to their code ("solve those problems otherwise dont change my code"). Confidence: 0.95
- Does not want the assistant to over-reach: no unsolicited scaffolding of extra files, routes, or components beyond the minimal fix (stopped a fix that created a whole dashboard sidebar + placeholder route pages). Confidence: 0.85
- When asked to "check" or diagnose a problem, wants the analysis only — root cause plus an explanation — with no code changes; they apply the fix themselves ("dont implement anything just check that is the error happening from here, then why"). Confidence: 0.8
- Prefers the simplest implementation that meets the need: plain controlled React state over heavier abstractions/libraries (explicitly said "do not complicate the form data and overall logic" when asked for a form, rejecting react-hook-form + zod in favor of shadcn primitives). Confidence: 0.7

## Workflow

- Keeps project requirements in a `docs/` folder and expects the assistant to read those specs up front, before implementing any feature, so it has the full picture. Confidence: 0.7
