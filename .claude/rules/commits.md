# Git workflow and commit rules

## Branches

- Every new feature or fix gets its **own branch, created from `master`**: first `git checkout master && git pull`, then `git checkout -b <type>/<short-name>` (e.g. `feat/picker`, `fix/price-parsing`, `docs/readme`).
- Never work or commit directly on `master`.
- One branch = one feature. Don't mix unrelated changes in one branch.

## Commits need my approval

- **Never commit automatically.** When a step is finished and `/checks` passes, stop and show me:
  - the list of changed files with a 1-line summary each
  - the proposed commit message (Conventional Commits, see below)
- Commit only after I say so. If I change the message, use mine.

## No pushing, no pull requests

- **Never run `git push`** and never create, edit or merge pull requests (`gh pr ...` or anything else). I push and open PRs myself.
- When a branch is ready, say so and remind me to push it. Vercel creates a preview URL for every pushed branch.

## Commit messages

Use **Conventional Commits** for every commit message, e.g. `feat: add picker question 2`, `fix: parse Alpha Vantage price strings`, `docs: update README conversion section`. This keeps the commit history clear and consistent; the reviewer reads it.

- Summary line **under 50 characters**, imperative mood, lowercase after the type, no trailing period.
- Put details (what and why) in the body, separated by a blank line, wrapped at ~72 characters.
- One logical change per commit. Commit after each finished step, not at the end of the session.
- Never commit secrets, `.env*` files or generated build output.

## Types

- **feat**: a new feature for the user.
- **fix**: a bug fix for the user.
- **docs**: documentation changes (README or other markdown files).
- **style**: changes that don't affect the meaning of the code (white-space, formatting, missing semicolons, etc.).
- **refactor**: a code change that neither fixes a bug nor adds a feature, but improves structure or readability.
- **perf**: a code change that improves performance.
- **test**: adding missing tests or correcting existing tests.
- **build**: changes to the build system or external dependencies (e.g. npm packages).
- **ci**: changes to CI configuration files and scripts.
- **chore**: other changes that don't modify src or test files (e.g. tooling, config, updating dependencies).
- **revert**: reverts a previous commit.
