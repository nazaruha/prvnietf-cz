---
name: checks
description: Run all project checks (typecheck, lint, tests, production build) and report the result. Use before every commit of a finished step and before saying a task is done.
---

Run these from the project root, in this order, and stop at the first failure:

1. `npm run typecheck`
2. `npm run lint`
3. `npm test`
4. `npm run build`

Then report in a short list: which commands passed, and for any failure the exact error and the file it points to.

If something fails:
- Read the failing file and the files it imports before fixing it.
- Fix the cause; never silence it (no `@ts-ignore`, no `eslint-disable`, no skipped tests, no `any`).
- Run `/checks` again after the fix.
