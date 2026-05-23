# Design: Rouge Intime — Git branching strategy with Vercel

**Date:** 2026-05-23
**Scope:** Adopt a Gitflow-lite branching model with three environments (production, staging, ephemeral previews) and migrate the current non-standard state (`feature/init` deploys to production, `main` is an empty orphan) to the new model.

---

## Context

The repo currently has two long-lived branches:

- `feature/init` — holds all real history (~30 commits across the FAQ feature, homepage, catalog, checkout, admin). This is the branch Vercel is configured to deploy as Production, so `rougeintime.vercel.app` reflects whatever is on `feature/init`.
- `main` — an empty orphan branch with a single root commit (`chore: initial main commit`). It has no shared history with `feature/init`. Created during an earlier experiment.

The site is not yet ready for an official public launch. The user wants what is currently published at `rougeintime.vercel.app` to be reclassified as **staging** rather than **production**, and to reserve a real production environment for when the site is launch-ready. The team is a single developer.

The intended outcomes:

- A clean 3-tier branching model that signals intent (production / staging / in-flight features).
- Vercel preview URLs for every feature branch, automatic.
- A permanent staging URL that always reflects the head of the development trunk.
- No production deploys until the developer explicitly merges to `main`.
- A standard naming convention (`main`, `develop`, `feature/*`) so an outsider (future self, a freelance dev, an AI agent) can read the repo without needing a glossary.

---

## Branch model

Three categories:

| Branch | Lifetime | Role | Deploys to |
|---|---|---|---|
| `main` | permanent | Production trunk. Only receives `develop` merges (or `hotfix/*`) when the developer decides to release. | Vercel Production environment (the real domain when configured). |
| `develop` | permanent | Active development trunk. Every feature merges here first. | Vercel staging alias: `staging-rougeintime.vercel.app`. |
| `feature/<name>` | short-lived | One unit of work (a feature, a bugfix, a doc pass). Branched from `develop`, merged back to `develop`, then deleted. | Auto-generated Vercel preview URL per push. |
| `hotfix/<name>` | short-lived | Urgent prod fix. Branched from `main`, merged into both `main` and `develop`. | Auto-preview while live; merges trigger prod + staging deploys. |

Rationale for the three permanent branches:

- `develop` lets the deployed staging URL evolve continuously without affecting production. This is what the project actually needs today: continuous public iteration without committing to "launched".
- `main` stays empty (or near-empty) until the first explicit release. That moment is meaningful — it's "we're live now."
- `feature/*` branches inherit Vercel's preview deployment for free.

---

## Vercel configuration

One Vercel project covers all three environments.

1. **Production Branch**: change from `feature/init` to `main`. After migration, no production deploy fires until the developer merges `develop → main`.
2. **Staging alias**: add a permanent domain alias `staging-rougeintime.vercel.app` (or similar) pinned to the `develop` branch. Every push to `develop` updates this alias atomically.
3. **Preview deployments**: leave enabled for all branches (Vercel default). Each push to `feature/*` produces a unique preview URL Vercel surfaces in the GitHub PR comment.

No second Vercel project, no environment-specific env vars yet. The project already uses a single `.env.local` for Supabase keys; Vercel's per-environment env-var support is available later if needed (e.g., separate Supabase project for staging).

---

## Daily workflow

### Starting a feature

```bash
git checkout develop
git pull
git checkout -b feature/<descriptive-name>
```

### Working

Commit atomically. Push as often as desired — Vercel deploys a preview URL on each push. Share the preview URL for review.

### Merging to develop

Prefer a PR `feature/* → develop` even as a solo dev. The PR adds:

- The Vercel preview URL surfaced in the PR comment.
- A summary of *why* the change exists, captured separately from the commit history.
- A reviewable diff in one place.

Self-approve and merge. For trivial changes (typo, copy fix, version bump) it's acceptable to merge directly without a PR.

After merge:

```bash
git checkout develop
git pull
git branch -d feature/<name>
git push origin --delete feature/<name>   # if not auto-deleted by GitHub setting
```

### Promoting develop to production

When the site is ready for an official version (could be weeks or months from now):

```bash
git checkout main
git pull
git merge develop --no-ff
git tag v<major.minor.patch>
git push --tags
git push
```

Vercel detects the push to `main` and deploys to production.

### Hotfix

For a critical issue already in production:

```bash
git checkout main
git pull
git checkout -b hotfix/<name>
# fix + commit
git checkout main && git merge hotfix/<name> --no-ff && git push
git checkout develop && git merge hotfix/<name> --no-ff && git push
git branch -d hotfix/<name>
```

The double-merge prevents the hotfix from being lost when `develop` later merges back to `main`.

---

## Migration from current state

The existing orphan `main` (single empty commit) is already in the right shape — no need to recreate it. Just rename `feature/init` and reconfigure Vercel.

### Git steps

```bash
# Currently on feature/init
git branch -m develop                      # rename current branch
git push -u origin develop                 # push the renamed branch
git push origin --delete feature/init      # remove old remote name
```

Result: local has `main` (existing orphan, untouched) and `develop` (was `feature/init`). Remote mirrors that.

### Vercel steps

1. **Production Branch**: Settings → Git → change from `feature/init` to `main`.
2. **Staging alias**: Settings → Domains → add `staging-rougeintime.vercel.app` (or any chosen subdomain) → assign to the `develop` branch.
3. **What happens to `rougeintime.vercel.app`?** It follows the Production Branch — after the switch it serves `main`, which is empty. Two options the user decides between:

   - **Keep the public URL alive**: in Vercel Domains, also alias `rougeintime.vercel.app` to `develop`. Then both `rougeintime.vercel.app` and `staging-rougeintime.vercel.app` show develop. When the site is ready for launch, the first `rougeintime.vercel.app` alias gets moved back to `main` and `staging-...` keeps pointing at `develop`. **Recommended for visible-but-not-launched projects.**
   - **Let the prod URL go empty**: accept that `rougeintime.vercel.app` shows an empty placeholder until launch. Share `staging-rougeintime.vercel.app` instead while pre-launch. Cleaner mental model, less convenient for sharing.

---

## Optional GitHub safeguards

Solo dev means most protections are overkill, but two are cheap and useful:

- **Auto-delete head branches**: GitHub Settings → General → Pull Requests → "Automatically delete head branches" on. Keeps the branch list clean after PR merges.
- **Branch protection on `main`** (very light): disallow force-push and direct commits, require a PR (even self-approved) for any change. Prevents accidental `git push --force` on production.

`develop` stays unprotected — direct commits and force-pushes allowed (occasional history cleanup).

---

## Out of scope

- **Per-environment env vars** — not needed yet. Single `.env.local`. Revisit when Supabase splits into a staging instance.
- **CI checks on PRs** — Vercel build itself acts as the smoke check today. A formal GitHub Actions test workflow can be added later if the codebase test count grows.
- **Conventional commits enforcement** — already practiced informally; not enforcing via commit hook.
- **Semantic versioning automation** — manual tagging on `main` merge is fine at this stage.

---

## Verification

After migration the following must all be true:

- `git branch -a` shows exactly `develop`, `main`, `remotes/origin/develop`, `remotes/origin/main` (plus current HEAD marker).
- `git log main` shows one commit (the empty initial).
- `git log develop` shows the full historical commit log from `feature/init` intact (every commit preserved).
- Vercel dashboard "Production Branch" reads `main`.
- A test push to `develop` updates `staging-rougeintime.vercel.app` within a few minutes.
- A test branch `feature/test-preview` pushed produces a preview URL that Vercel posts as a GitHub comment.
- The old `feature/init` and orphan `main` references are gone from the remote.

---

## Documentation

Update `CLAUDE.md` to reflect the new model. Add a short section under `## Project` headed `Branching` listing the three permanent branches and where they deploy. One paragraph; no need to duplicate this spec.
