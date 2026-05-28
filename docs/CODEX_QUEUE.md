# Codex Queue + Orchestration

This repository uses a minimal, least-privilege queue orchestration pattern for Codex issue work.

## Important constraint (honesty requirement)

GitHub Actions **cannot auto-start a Codex coding session** for issue implementation in this repo. The queue workflow only promotes one issue at a time and leaves a comment for humans to launch Codex manually.

## Labels

Create labels from `.github/labels.yml`:

- `codex-queued`: issue waiting in queue
- `codex-in-progress`: single active Codex issue
- `codex-done`: completed queue work
- `agent-review`, `safe-to-merge`, `human-needed`, `codex-fix-needed`: consumed/produced by existing PR safety workflow

## Workflows

### 1) Existing reviewer (`agent-manager-review.yml`)

- Runs lint/build/tests plus safety checks.
- Applies verdict labels (`safe-to-merge`, `human-needed`, `codex-fix-needed`).
- Blocks merge if rejected.

### 2) Queue orchestrator (`codex-issue-queue.yml`)

- Trigger: issue lifecycle events.
- Keeps at most one issue labeled `codex-in-progress`.
- Promotes oldest `codex-queued` issue when no active issue exists.
- Posts explicit manual-start comment when an issue is promoted.
- Permissions: `contents: read`, `issues: write`.

### 3) Auto-merge gate (`codex-auto-merge.yml`)

- Trigger: PR review submission + PR label/sync events.
- Enables GitHub auto-merge only when:
  1. PR has `safe-to-merge` label from existing review workflow, and
  2. PR has at least one current APPROVED review.
- Does not bypass required checks or branch protections.
- Permissions: `contents: write`, `pull-requests: write`.

## Operational flow

1. Label an issue `codex-queued`.
2. Queue workflow may promote it to `codex-in-progress`.
3. Human starts Codex manually for that issue.
4. PR opens and existing review workflow runs.
5. If review workflow marks `safe-to-merge` and human approval exists, auto-merge is enabled.
6. Merge occurs via normal GitHub merge queue/protection rules.
