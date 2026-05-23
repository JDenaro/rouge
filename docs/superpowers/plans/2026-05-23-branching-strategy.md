# Branching Strategy Migration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the repo from the current non-standard state (`feature/init` as production, orphan `main`) to a Gitflow-lite model with three permanent environments on Vercel.

**Architecture:** Rename `feature/init` to `develop` (preserving all history). Leave the existing orphan `main` in place — it's already the right shape. Reconfigure Vercel: switch the Production Branch from `feature/init` to `main`, add a permanent domain alias to keep the `develop` branch publicly accessible. Document the new flow in `CLAUDE.md` for future contributors / agents.

**Tech Stack:** Git CLI · GitHub remote · Vercel dashboard.

**Spec:** `docs/superpowers/specs/2026-05-23-branching-strategy-design.md`

---

## File Structure

| File | Responsibility | Action |
|---|---|---|
| `CLAUDE.md` | Add a short `Branching` section under `Project` explaining the three permanent branches and their Vercel mapping | Modify |

Git-level work (rename, push, delete) doesn't change any file in the repo. Vercel work is dashboard-only — no file changes.

---

## Pre-flight checks

Before starting any task, verify the starting state:

```bash
cd /Users/juldenarocur/Repositorios/rouge-web
git status                              # → "On branch feature/init, working tree clean"
git branch -a                           # → feature/init, main, remotes/origin/feature/init, remotes/origin/main
git log --oneline main | wc -l          # → 1 (just the empty initial commit)
```

If `git status` shows uncommitted changes, **stop and commit them first** — the rename in Task 1 requires a clean working tree.

If the user is already on `develop` (because someone ran the rename out of band), skip to Task 2.

---

## Task 1: Rename `feature/init` to `develop` locally

**Files:**
- None (git operation only)

- [ ] **Step 1.1: Verify clean working tree**

Run: `cd /Users/juldenarocur/Repositorios/rouge-web && git status`
Expected: "On branch feature/init", "nothing to commit, working tree clean".

If not clean: commit or stash changes before proceeding.

- [ ] **Step 1.2: Rename the current branch**

Run: `git branch -m develop`

This renames the **current** branch in-place. After this, `git branch --show-current` returns `develop`. No commits are lost; the SHA history is identical.

- [ ] **Step 1.3: Verify the rename**

Run: `git branch -a`

Expected output includes `* develop` (local, current) and still shows `remotes/origin/feature/init` (the remote isn't renamed yet, that's Task 2).

Also run: `git log --oneline -3` — confirm the recent commits (FAQ work, etc.) are intact on `develop`.

---

## Task 2: Push `develop` and delete the old remote `feature/init`

**Files:**
- None (git operation only)

- [ ] **Step 2.1: Push the renamed branch to origin**

Run: `git push -u origin develop`

This creates `develop` on the remote and sets it as the upstream for the local branch.

Expected output ends with: `* [new branch] develop -> develop` and `Branch 'develop' set up to track 'origin/develop'`.

- [ ] **Step 2.2: Delete the old `feature/init` from the remote**

Run: `git push origin --delete feature/init`

Expected output: ` - [deleted]         feature/init`.

⚠️ **Before running:** confirm in the Vercel dashboard (Settings → Git) that the Production Branch is not yet pointing at `feature/init`-only — if Vercel still has it as the Production Branch and you delete it remotely, Vercel may show a deploy error until you switch the setting in Task 3. **Task 3 will switch it; deletion here is sequenced before the Vercel switch on purpose so that the new branch name is available when you go to pick it.**

- [ ] **Step 2.3: Verify remote state**

Run: `git branch -r`

Expected: `origin/develop` and `origin/main` are present; `origin/feature/init` is gone.

---

## Task 3: Reconfigure Vercel — Production Branch

**Files:**
- None (Vercel dashboard only)

- [ ] **Step 3.1: Open the project's Git settings on Vercel**

In a browser, go to https://vercel.com/dashboard. Select the `rouge` (or whichever project name) project. Click **Settings** → **Git** in the left nav.

- [ ] **Step 3.2: Change the Production Branch**

In the "Production Branch" field, change the value from `feature/init` to `main`. Click **Save**.

Note: after this change, no further automatic production deploys will fire until someone pushes to `main`. The current state of `main` is a single empty commit, so the production URL (`<project>.vercel.app`) will reflect that empty state until either:
- A first `develop → main` merge happens (the official launch), or
- A domain alias for `develop` is added in Task 4 (recommended path).

- [ ] **Step 3.3: Verify the change takes effect**

Vercel does not automatically redeploy when you change the Production Branch — it just changes which branch future pushes will deploy from. To confirm the change persisted, refresh the Settings → Git page; the "Production Branch" field should show `main`.

---

## Task 4: Add the staging domain alias for `develop`

**Files:**
- None (Vercel dashboard only)

- [ ] **Step 4.1: Pick the staging URL**

Decide on a subdomain. The spec recommends `staging-rougeintime.vercel.app`. Alternatives: `staging.rougeintime.vercel.app` (Vercel may require domain verification for nested subdomains; the dash form avoids that). For now, pick the dash form unless the user explicitly prefers otherwise.

- [ ] **Step 4.2: Add the domain in Vercel**

In the project's Vercel Settings → **Domains** → click **Add Domain**. Enter `staging-rougeintime.vercel.app`. Vercel will provision it under the `*.vercel.app` zone automatically (no DNS work needed for `*.vercel.app` subdomains).

- [ ] **Step 4.3: Assign the alias to the `develop` branch**

After adding the domain, find it in the list. Click its settings / "Edit" button. Set "Git Branch" (or equivalent field) to `develop`. Save.

Vercel will now redeploy `develop` (or use the latest existing build) and point `staging-rougeintime.vercel.app` at it. Subsequent pushes to `develop` will update this URL automatically.

- [ ] **Step 4.4: Decide what to do with `rougeintime.vercel.app`**

This is the **user's choice** from the spec. Two paths:

- **Path A (recommended for visible-but-not-launched projects):** Add a second domain alias `rougeintime.vercel.app` also pointing at `develop`. Both URLs serve the staging branch. When the project launches, this alias gets moved to `main`.
- **Path B (cleaner mental model):** Leave `rougeintime.vercel.app` mapped to the Production Branch (`main`). Accept that the URL will show an empty page until launch. Share `staging-rougeintime.vercel.app` while pre-launch.

The plan does not force one path — ask the user which they want during execution. The dashboard click is identical (Add Domain → set Git Branch).

- [ ] **Step 4.5: Smoke test**

Open the chosen staging URL in a browser. Expected: the current state of `develop` renders (the FAQ-complete site we just shipped).

If Vercel hasn't built `develop` yet for the alias, trigger it manually:

```bash
git commit --allow-empty -m "chore: trigger Vercel build for staging alias"
git push
```

Wait ~1-2 minutes, retry the URL.

---

## Task 5: Document the new model in `CLAUDE.md`

**Files:**
- Modify: `CLAUDE.md` — add a "Branching" subsection under the existing `## Project` section

- [ ] **Step 5.1: Add the Branching subsection**

Open `CLAUDE.md`. Locate the `## Project` section. After its existing prose (the description of Next.js / React / Tailwind / Supabase), add:

```markdown
## Branching

Three permanent branches, mapped to Vercel environments:

| Branch | Role | Deploys to |
|---|---|---|
| `main` | Production trunk. Receives `develop` (or `hotfix/*`) merges only at release time. | Vercel Production environment. |
| `develop` | Active development trunk. All `feature/*` branches merge here first. | `staging-rougeintime.vercel.app` (permanent alias). |
| `feature/<name>` | Short-lived. Branched from `develop`, merged back via PR, then deleted. | Auto-generated Vercel preview URL per push. |

**Workflow:** branch from `develop` → push → review the preview → merge PR → delete branch. Promote to production by merging `develop → main` and tagging `v<x.y.z>`.

**Hotfix:** branch from `main` → fix → merge to both `main` and `develop`.

Full design: `docs/superpowers/specs/2026-05-23-branching-strategy-design.md`.
```

- [ ] **Step 5.2: Verify TypeScript is unaffected**

Run: `npx tsc --noEmit`
Expected: no output (only docs changed).

- [ ] **Step 5.3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs(claude): document Gitflow-lite branching model"
```

- [ ] **Step 5.4: Push**

Run: `git push`
Expected: develop is updated on the remote.

---

## Task 6: Optional GitHub safeguards

**Files:**
- None (GitHub repo settings only)

This task is **optional** but the spec lists two cheap safeguards. Skip this entire task if the user doesn't want it; ask before doing it.

- [ ] **Step 6.1: Enable auto-delete head branches**

On GitHub → repo → Settings → General → scroll to "Pull Requests" → enable **"Automatically delete head branches"**.

This deletes the `feature/*` branch on the remote once its PR is merged. Local branches still need `git branch -d` manually.

- [ ] **Step 6.2: Add a light branch protection rule on `main`**

GitHub → repo → Settings → Branches → **Add branch ruleset** (or "Add classic branch protection rule" in older UIs).

- Branch name pattern: `main`
- Enable: **Restrict deletions**
- Enable: **Block force pushes**
- (Optional, more strict) Require a pull request before merging: yes. Since you're solo, leave "Required approvals" at 0 — you can self-merge.

Save the rule.

Do NOT add protection to `develop` — solo dev means you'll occasionally want to force-push to clean up history.

- [ ] **Step 6.3: Test the protection**

From the command line, try:

```bash
git checkout main
git commit --allow-empty -m "test: should be blocked"
git push
```

Expected: GitHub rejects the push with a message about the protection rule (if you enabled "Require PR"). Roll back:

```bash
git reset --hard HEAD~1
git checkout develop
```

If the push succeeded, the protection isn't doing what you wanted — revisit Step 6.2.

---

## Task 7: Final verification

**Files:**
- None (verification only)

- [ ] **Step 7.1: Confirm git state**

```bash
git branch -a
```

Expected: exactly four refs — `develop` (local current), `main` (local), `remotes/origin/develop`, `remotes/origin/main`. No `feature/init` anywhere.

- [ ] **Step 7.2: Confirm `develop` history is intact**

```bash
git log --oneline develop | head -5
```

Expected: the most recent commits include the CLAUDE.md doc commit from Task 5, plus all the FAQ-feature commits (`feat(faq):` series), plus everything before.

- [ ] **Step 7.3: Confirm `main` is still empty**

```bash
git log --oneline main
```

Expected: exactly one line — `<sha> chore: initial main commit` (or similar).

- [ ] **Step 7.4: Confirm Vercel dashboard reads `main` as the Production Branch**

In the browser, refresh Settings → Git. The Production Branch should read `main`.

- [ ] **Step 7.5: Confirm the staging URL serves `develop`**

Open `staging-rougeintime.vercel.app` (or whatever URL was picked in Task 4.1). Expected: the FAQ-complete site, including `/faq` page and the home page FAQ section.

- [ ] **Step 7.6: Smoke-test a `feature/*` preview**

Create a throwaway feature branch:

```bash
git checkout develop
git checkout -b feature/test-preview-deploy
git commit --allow-empty -m "test: trigger preview"
git push -u origin feature/test-preview-deploy
```

Wait ~1-2 minutes. In the GitHub repo, navigate to the branch — Vercel should have posted a comment with a preview URL. Open it; it should serve the FAQ-complete site (same content as `develop` since this branch has no changes).

Then clean up:

```bash
git checkout develop
git branch -D feature/test-preview-deploy
git push origin --delete feature/test-preview-deploy
```

- [ ] **Step 7.7: No additional commit needed**

If all checks passed, end here. No code changed in Task 7. If any check failed, address the specific failure (revisit the originating task) rather than treating this as a separate fix.

---

## Self-Review Notes

**Spec coverage check** (against `2026-05-23-branching-strategy-design.md`):
- ✓ Branch model (main / develop / feature/*) — Tasks 1, 2, 5 (rename + push + docs)
- ✓ Vercel configuration (Production Branch + staging alias + previews) — Tasks 3, 4
- ✓ Daily workflow (documented) — Task 5 (`CLAUDE.md`)
- ✓ Migration from current state — Tasks 1, 2, 3, 4
- ✓ Optional GitHub safeguards — Task 6
- ✓ Verification — Task 7
- ✓ Decision left to user about `rougeintime.vercel.app` — Step 4.4 explicitly asks

**Placeholder scan:** No "TBD", "TODO", "implement later". Each step has exact commands and expected output. Step 4.4 deliberately defers a user decision rather than picking blindly — that's an input request, not a placeholder.

**Type consistency:** N/A — no code being written, only git operations and Vercel config.

**Out-of-scope reminders for the executor:** The spec lists per-environment env vars, CI checks, conventional-commit hooks, and semver automation as **out of scope** — do not add them.
