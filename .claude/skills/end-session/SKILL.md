---
name: end-session
description: Close a work session. Update NOTES-ai.md and the Known pitfalls list, propose skills for repeated corrections, and remind the user to export the session. Use when the user says the session is ending.
disable-model-invocation: true
---

1. **Rewrite `docs/STATUS.md`** so the next session can start without this conversation. Keep it under ~40 lines and overwrite it, don't append:
   - current state: what works on production, what works only locally
   - branch in progress and uncommitted/unpushed work
   - next steps in order
   - open questions and decisions waiting for the user
   - anything half-done or known broken
   Base it on `git status`, `git log` and what was verified this session, not on what was planned.
2. **Summarise the session** in `NOTES-ai.md` under a new heading `## Session NN – <topic> (<date>)`:
   - what was built (with commit hashes)
   - every place where you were wrong, hallucinated, missed relevant code or took a shortcut, **and how it was caught** (by me, a test, a hook, or a check against a source)
   - decisions made, and whether `DECISIONS.md` needs a new entry (propose the text)
3. **Pitfalls:** for each mistake that could happen again, propose one short line for "Known pitfalls" in `CLAUDE.md`. Add it only after the user approves.
4. **Repeated corrections:** if the user had to correct the same kind of thing more than once, propose a skill or a hook. Give its name, 2–3 sentences on what it does and why, and wait for approval before creating it.
5. Run `/checks`. If there are uncommitted changes, show the changed files and a proposed Conventional Commit message, and commit only after the user approves. Never push.
6. Remind the user: run `/export` and save it as `ai-log/NN-<topic>.md` (proposed commit: `docs: add ai log NN`), then push the branch and open the PR themselves.
