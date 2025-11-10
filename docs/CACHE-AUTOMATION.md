# Service Worker Cache Automation

## Overview

This project includes **automatic cache version bumping** to ensure users always receive the latest updates. The cache version increments automatically on every commit that includes changes to the `apps/game/src/` directory.

## 🎯 Problem Solved

**Before automation:**
- Developers had to manually update cache version in service-worker.js
- Easy to forget, causing users to see stale/cached content
- Manual process prone to errors

**After automation:**
- Cache version updates automatically on every commit
- Zero manual intervention required
- Users always get fresh content after updates

## 📦 How It Works

### The Flow

```
1. Developer edits files in apps/game/src/
   └─> git add apps/game/src/components/ProfilePage.tsx

2. Developer commits changes
   └─> git commit -m "Add profile page"

3. Pre-commit hook triggers
   └─> .husky/pre-commit runs

4. Bump script executes
   └─> scripts/bump-sw-version.js

5. Script checks for src/ changes
   └─> Found changes? Yes!

6. Version increments automatically
   └─> v1.1.0 → v1.1.1

7. Updated file is staged
   └─> service-worker.js added to commit

8. Commit completes with new version
   └─> ✅ Done!
```

### Smart Detection

The script only bumps the version when:
- Changes are staged in `apps/game/src/`
- Changes include components, pages, or app files
- The commit is not a revert or merge

It skips bumping when:
- Only documentation changes
- Only config file changes
- Changes outside the src/ directory

## 🚀 Setup Instructions

### Initial Setup (One-Time)

```bash
# 1. Install dependencies
pnpm install

# This automatically:
# - Installs Husky
# - Initializes git hooks
# - Sets up pre-commit hook
```

That's it! The automation is now active.

### Verify Installation

```bash
# Check if Husky is installed
ls -la .husky/

# You should see:
# .husky/
# ├── _/
# └── pre-commit

# Check if the script exists
ls scripts/bump-sw-version.js
```

## 📝 Usage Examples

### Example 1: Normal Workflow

```bash
# 1. Edit a component
vim apps/game/src/components/ProfilePage.tsx

# 2. Stage your changes
git add apps/game/src/components/ProfilePage.tsx

# 3. Commit (version bumps automatically!)
git commit -m "feat: add profile page"

# Output:
# 📦 Bumping service worker cache version: v1.1.0 → v1.1.1
# ✅ Service worker cache version updated successfully
#    New version: v1.1.1
#    File: apps/game/public/service-worker.js
# [main abc1234] feat: add profile page
#  2 files changed, 100 insertions(+)
```

### Example 2: Multiple Files

```bash
# Edit multiple files
vim apps/game/src/components/Header.tsx
vim apps/game/src/components/Footer.tsx
vim apps/game/src/app/page.tsx

# Stage all changes
git add .

# Commit once (bumps version once)
git commit -m "feat: update header and footer"

# Version: v1.1.1 → v1.1.2
```

### Example 3: Documentation Only (No Bump)

```bash
# Edit documentation
vim README.md

# Stage and commit
git add README.md
git commit -m "docs: update README"

# Output:
# ℹ️  No src/ changes detected, skipping cache version bump
# [main def5678] docs: update README
#  1 file changed, 10 insertions(+)
```

## 🔧 Configuration

### Files Involved

| File | Purpose |
|------|---------|
| `.husky/pre-commit` | Git hook that triggers on commit |
| `scripts/bump-sw-version.js` | Script that increments version |
| `apps/game/public/service-worker.js` | File that gets updated |
| `package.json` | Contains Husky setup script |

### Customizing Detection

Edit `scripts/bump-sw-version.js` to change what triggers a version bump:

```javascript
function hasSrcChanges() {
  const stagedFiles = execSync('git diff --cached --name-only', { encoding: 'utf-8' });
  const srcChanged = stagedFiles.split('\n').some(file =>
    file.startsWith('apps/game/src/') ||  // Main trigger
    file.includes('components/') ||       // Add more patterns
    file.includes('app/')                 // as needed
  );
  return srcChanged;
}
```

## 🛠️ Manual Operations

### Manual Version Bump

If you need to bump the version without committing:

```bash
node scripts/bump-sw-version.js
```

### Skip Auto-Bump (Not Recommended)

If you absolutely must skip the auto-bump:

```bash
git commit --no-verify -m "Your message"
```

⚠️ **Warning:** Only skip if you're committing non-code changes that don't affect the app.

### Major/Minor Version Bumps

For major or minor version changes, manually edit the service worker:

```javascript
// For major version (breaking changes)
const CACHE_NAME = 'joscola-v2.0.0';
const RUNTIME_CACHE = 'joscola-runtime-v2.0.0';

// For minor version (new features)
const CACHE_NAME = 'joscola-v1.2.0';
const RUNTIME_CACHE = 'joscola-runtime-v1.2.0';
```

Then commit normally. The script will start auto-incrementing from the new base version.

## 🐛 Troubleshooting

### Hook Not Running

**Problem:** Commits don't trigger version bump

**Solutions:**
```bash
# 1. Reinstall Husky
pnpm install

# 2. Make sure hook is executable
chmod +x .husky/pre-commit

# 3. Verify git hooks path
git config core.hooksPath
# Should output: .husky
```

### Script Errors

**Problem:** Script fails with error

**Debug steps:**
```bash
# 1. Run script manually to see error
node scripts/bump-sw-version.js

# 2. Check Node.js version
node --version
# Should be >= 18

# 3. Verify git is working
git status

# 4. Check service worker file exists
ls apps/game/public/service-worker.js
```

### Version Not Incrementing

**Problem:** Version stays the same

**Cause:** No changes detected in `src/` directory

**Solution:** Make sure you're editing files in `apps/game/src/`

## 📊 Version History Tracking

You can see all version bumps in your git history:

```bash
# View commits that bumped versions
git log --grep="Bumping service worker" --oneline

# View service worker version history
git log --oneline -p apps/game/public/service-worker.js | grep "CACHE_NAME"
```

## 🎓 Best Practices

### DO ✅

- Let the automation handle patch versions
- Commit frequently with descriptive messages
- Manually bump major/minor for significant releases
- Keep service-worker.js in source control

### DON'T ❌

- Don't skip the auto-bump with `--no-verify` unless absolutely necessary
- Don't manually edit patch versions (let automation handle it)
- Don't delete the `.husky/` directory
- Don't modify the version format in service-worker.js

## 🔄 CI/CD Integration

The automation works seamlessly in CI/CD:

```yaml
# Example GitHub Actions workflow
- name: Install dependencies
  run: pnpm install

- name: Commit changes
  run: |
    git config user.name "CI Bot"
    git config user.email "ci@example.com"
    git add .
    git commit -m "chore: automated update"
    # Version bumps automatically!
```

## 📚 Related Documentation

- [DEVELOPMENT.md](DEVELOPMENT.md) - Full development guide
- [scripts/README.md](scripts/README.md) - Build scripts documentation
- Service Worker API: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API

## ❓ FAQ

**Q: What if I forget to bump the version manually for a major release?**
A: The script will continue incrementing from wherever you are. Just manually set the major version when needed.

**Q: Can I disable this feature?**
A: Yes, delete `.husky/pre-commit` but this is NOT recommended.

**Q: Does this work on Windows?**
A: Yes! Husky and the Node.js script work cross-platform.

**Q: What about staging vs production?**
A: The version increments on every commit, regardless of branch. Consider using branches for staging.

**Q: Can I see what version users have?**
A: Check browser DevTools > Application > Service Workers to see the active version.

---

**Remember:** With this automation in place, you never have to worry about cache invalidation again! 🎉
