# Build Scripts

## bump-sw-version.js

Automatically increments the service worker cache version when code changes are committed.

### Purpose

Joscola is a PWA with aggressive caching. To ensure users receive updates, the service worker cache version must be incremented with every code change. This script automates that process.

### How It Works

1. **Triggered by**: Git pre-commit hook (`.husky/pre-commit`)
2. **Checks**: If there are staged changes in `apps/game/src/`
3. **Action**: Increments the patch version in `service-worker.js`
4. **Updates**: Both `CACHE_NAME` and `RUNTIME_CACHE` constants
5. **Stages**: Automatically adds the updated file to the commit

### Example

```bash
# Before commit
const CACHE_NAME = 'joscola-v1.1.0';
const RUNTIME_CACHE = 'joscola-runtime-v1.1.0';

# After commit (automatic)
const CACHE_NAME = 'joscola-v1.1.1';
const RUNTIME_CACHE = 'joscola-runtime-v1.1.1';
```

### Manual Execution

You can also run this script manually:

```bash
node scripts/bump-sw-version.js
```

### Skip Auto-Bump

If you need to skip the automatic version bump (not recommended):

```bash
git commit --no-verify -m "Your message"
```

### Debugging

The script outputs helpful messages:

```
📦 Bumping service worker cache version: v1.1.0 → v1.1.1
✅ Service worker cache version updated successfully
   New version: v1.1.1
   File: apps/game/public/service-worker.js
```

### Configuration

The script looks for version patterns in:
- **File**: `apps/game/public/service-worker.js`
- **Pattern**: `const CACHE_NAME = 'joscola-vX.Y.Z'`

### Requirements

- Node.js >= 18
- Git (for detecting staged changes)
- Husky (for pre-commit hooks)

### Installation

Automatically set up when running:

```bash
pnpm install
```

The `prepare` script in `package.json` initializes Husky and the git hooks.
