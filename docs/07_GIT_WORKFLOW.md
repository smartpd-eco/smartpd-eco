# 07 Git Workflow

Version: v2.2

## Branch Strategy

Required branches:

```text
main
develop
feature/*
hotfix/*
release/*
```

Current repository branch observed:

```text
main
```

Recommended feature branches:

```text
feature/kpi-dashboard
feature/ai-invoice
feature/barcode-camera
feature/pwa
feature/mobile-ui
feature/realtime
```

## Branch Rules

### main

- Production-ready branch.
- Must build successfully.
- Must not receive unverified changes.

### develop

- Integration branch for Phase 2 work.
- Feature branches should merge here before release.

### feature/*

- One feature per branch.
- Branch from latest `develop`, or from `main` until `develop` exists.
- Keep changes scoped.

### hotfix/*

- Critical production fixes.
- Branch from `main`.
- Merge back to `main` and `develop`.

### release/*

- Stabilization branch before versioned release.
- Only fixes, docs, and release preparation.

## Commit Convention

Allowed prefixes:

```text
feat:
fix:
docs:
style:
refactor:
test:
chore:
```

Examples:

```text
feat: add camera barcode scanner
fix: prevent negative inventory adjustment
docs: add ERP database schema guide
style: align dashboard button spacing
refactor: extract inventory status helpers
test: add invoice proxy validation checks
chore: update build workflow
```

## Pull Request Process

1. Pull latest base branch.
2. Create or update feature branch.
3. Implement scoped change.
4. Run syntax check.
5. Run build check.
6. Update docs and changelog.
7. Open PR with summary, screenshots if UI changed, and test results.
8. Request review from project owner or lead engineer.

## Merge Rules

- No merge with failing build.
- No merge with unresolved conflict.
- No merge if ERP workflow regression is known.
- No force-push to shared branches unless explicitly approved.
- Prefer squash merge for feature branches.
- Preserve auditability for hotfixes and releases.

## Required Local Commands

Before work:

```text
git status
git pull
```

After work:

```text
git status
git add <modified files>
git commit -m "<type>: <summary>"
git push
```

## Conflict Report

- Current repository is working directly on `main`.
- `develop` and feature branches are not confirmed locally.
- Future feature work should move to the appropriate branch before coding.
