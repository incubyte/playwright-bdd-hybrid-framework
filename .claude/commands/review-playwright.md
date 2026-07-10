---
name: review-playwright
description: Review staged or modified Playwright BDD test files against framework standards and P0-P3 anti-pattern taxonomy
---

# Review Playwright Code

Review Playwright BDD changes against framework standards.

## Usage

```bash
/review-playwright              # Review staged changes (default)
/review-playwright --all        # Review all changes vs HEAD
/review-playwright --file path  # Review specific file
```

## Steps

1. Determine scope:
   - Default (no args): `git diff --staged`
   - `--all`: `git diff HEAD`
   - `--file <path>`: `git diff HEAD -- <path>`

2. If diff is empty, inform user: "No staged changes found. Use --all to review all changes."

3. Load the review skill:
   - Use `.claude/skills/playwright-review/SKILL.md`

4. Execute the 6-step review process from the skill.

5. At end of report, offer:
   - "Auto-fix P0 issues? (yes/no)"
   - If yes: apply exact before/after replacements for each P0 finding

## Arguments

- `$ARGUMENTS` — passed directly (e.g., `--all`, `--staged`, file path pattern)
