---
name: playwright-review
description: Use when reviewing Playwright BDD test files for quality issues — locally staged/modified files or PR diffs. Triggers on: "review playwright code", "check test quality", "review before commit", staged test changes.
---

# Playwright BDD Code Review

## Overview

Structured review process for Playwright BDD test code in this repository. Classifies findings P0–P3, applies framework-specific standards, and produces actionable reports.

## When to Use

- Before committing test changes
- During PR review of test files
- After fixing test failures to verify fix quality
- When onboarding to understand what "good" looks like

## Review Process

### Step 1 — Categorize Files

Classify each changed file:
- **spec** — `.feature` files
- **page-object** — `src/pages/*.ts`
- **step-definition** — `src/steps/*.ts`
- **support** — `src/utils/*.ts`, `src/services/**/*.ts`, config files

### Step 2 — Load Standards

Read both reference files before applying checks:
- `.claude/references/standards.md` — framework architecture standards
- `.claude/references/anti-patterns.md` — full P0–P3 taxonomy with examples

These replace any external documentation. Always read both files fresh — do not rely on memory.

### Step 3 — Apply Anti-Pattern Checks

Apply all P0–P3 checks from `.claude/references/anti-patterns.md`.

Regex patterns to scan for:
```
P0: waitForTimeout|page\.\$\(|page\.\$\$\(|innerHTML|mock-token|authenticated.*true.*catch
P1: networkidle|module-level.*let.*Page|process\.env\.\w+!
P2: isPageLoaded|LOG_LEVEL_MAP\[.*\];$|apiResponse\?.*unknown
P3: log\.debug.*initialized|Before\(async.*log\.debug|@Sample
```

### Step 4 — Keyword Elevation

Auto-escalate any finding to **P0** if the affected code touches:
`auth`, `login`, `password`, `credentials`, `token`, `secret`, `payment`, `pii`, `phi`, `hipaa`, `security`

Example: A P2 misleading return type in an auth step → P0.

### Step 5 — Generate Report

```markdown
## Playwright BDD Code Review Report

**Files reviewed:** N  
**Critical (P0):** N | **High (P1):** N | **Medium (P2):** N | **Low (P3):** N

---

### 🔴 Critical Issues (P0) — Block Merge

#### [File:Line] Issue Title
**Pattern:** what was found  
**Risk:** why it matters  
**Fix:**
\```typescript
// Before
...
// After
...
\```

---

### 🟠 High Priority (P1) — Should Fix

...

### 🟡 Medium Priority (P2)

...

### 🔵 Low Priority (P3) — Suggestions

...

### ✅ Passed Checks

- [list what was done correctly]
```

### Step 6 — Auto-Fix Guidance

For each P0 finding, provide exact before/after replacement. Reference the auto-fix table in `.claude/references/anti-patterns.md`.

## Quick Reference: Priority Rules

| Priority | Action | Blocks Merge? |
|----------|--------|---------------|
| P0 | Must fix | Yes |
| P1 | Should fix (document if deferred) | Recommended |
| P2 | Fix when touching the area | No |
| P3 | Suggestion only | No |

## Common Mistakes

| Mistake | Correct behaviour |
|---------|------------------|
| Treating P3 as blocking | P3 = suggestion only, never block |
| Skipping standards files | Always read both reference files fresh |
| Omitting ✅ Passed Checks section | Always list what passed — builds trust |
| Reporting issues in untouched code | Only report on changed lines unless P0 |
| Not applying keyword elevation | Auth/payment/PII findings always P0 |

## Integration

- **Local review**: `git diff --staged` → apply this skill → report in conversation
- **Full diff review**: `git diff HEAD` → apply this skill
- **PR review**: Get PR diff → apply this skill → post as PR comment
