---
name: end-session
description: Close a work session. Update NOTES-ai.md and the Known pitfalls list, propose skills for repeated corrections, and remind the user to export the session. Use when the user says the session is ending.
disable-model-invocation: true
---

1. **Summarise the session** in `NOTES-ai.md` under a new heading `## Session NN – <topic> (<date>)`:
   - what was built (with commit hashes)
   - every place where you were wrong, hallucinated, missed relevant code or took a shortcut, **and how it was caught** (by me, a test, a hook, or a check against a source)
   - decisions made, and whether `DECISIONS.md` needs a new entry (propose the text)
2. **Pitfalls:** for each mistake that could happen again, propose one short line for "Known pitfalls" in `CLAUDE.md`. Add it only after the user approves.
3. **Repeated corrections:** if the user had to correct the same kind of thing more than once, propose a skill or a hook. Give its name, 2–3 sentences on what it does and why, and wait for approval before creating it.
4. Run `/checks`. If there are uncommitted changes, show the changed files and a proposed Conventional Commit message, and commit only after the user approves. Never push.
5. Remind the user: run `/export` and save it as `ai-log/NN-<topic>.md` (proposed commit: `docs: add ai log NN`), then push the branch and open the PR themselves.
