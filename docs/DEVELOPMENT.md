# Joscola Development Guide

## Table of Contents
- [Service Worker Cache Management](#service-worker-cache-management)
- [Development Workflow](#development-workflow)
- [Profile Page Implementation](#profile-page-implementation)

---

## Service Worker Cache Management

### ⚠️ CRITICAL: Cache Invalidation

Joscola is a Progressive Web App (PWA) with aggressive caching for offline functionality. The service worker cache version is **automatically updated** on every commit using a pre-commit hook.

### ✨ Automatic Cache Version Bumping (Recommended)

The project uses a git pre-commit hook to automatically increment the cache version whenever you commit changes to the `apps/game/src/` directory.

**Setup (One-time):**
```bash
# Install dependencies (includes Husky)
pnpm install

# Husky will be initialized automatically via the "prepare" script
```

**How it works:**
1. You make changes to components, pages, or other source files
2. You commit your changes: `git commit -m "Add profile page"`
3. Pre-commit hook runs `scripts/bump-sw-version.js`
4. Cache version is automatically incremented (e.g., v1.1.0 → v1.1.1)
5. Updated service-worker.js is automatically staged and included in your commit

**Files involved:**
- `.husky/pre-commit` - Git hook that triggers version bump
- `scripts/bump-sw-version.js` - Script that increments version numbers

**What gets auto-bumped:**
- Patch version (MAJOR.MINOR.PATCH)
- Only when changes are detected in `apps/game/src/` directory
- Updates both `CACHE_NAME` and `RUNTIME_CACHE` constants

### Manual Cache Version Update (If Needed)

If you need to manually update the cache version (e.g., for major releases):

**File:** `apps/game/public/service-worker.js`

Update these two constants at the top of the file:

```javascript
// Change version number (use semantic versioning)
const CACHE_NAME = 'joscola-v2.0.0';        // For major version bumps
const RUNTIME_CACHE = 'joscola-runtime-v2.0.0';  // Keep in sync
```

### Version Numbering Convention

Use semantic versioning (MAJOR.MINOR.PATCH):

- **MAJOR**: Breaking changes or major features (e.g., v1.0.0 → v2.0.0)
- **MINOR**: New features, significant updates (e.g., v1.0.0 → v1.1.0)
- **PATCH**: Bug fixes, small tweaks (e.g., v1.0.0 → v1.0.1)

### When to Update Cache Version

Update the cache version **EVERY TIME** you:
- Add new features
- Modify components
- Fix bugs
- Change styles
- Update any file in the `src/` directory

### Example Workflow

1. **Make your code changes**
   ```bash
   # Edit your component files
   vim apps/game/src/components/ProfilePage.tsx
   ```

2. **Update service worker version**
   ```javascript
   // Before
   const CACHE_NAME = 'joscola-v1.0.0';

   // After
   const CACHE_NAME = 'joscola-v1.1.0';
   ```

3. **Add version note** (optional but recommended)
   ```javascript
   // Version 1.1.0 - Added profile page with avatar selection
   ```

4. **Test the update**
   - Clear browser cache (or use incognito mode)
   - Reload the application
   - Check browser DevTools > Application > Service Workers
   - Verify new version is active

### Clearing Cache During Development

If you're testing and want to force a cache clear:

**Chrome/Edge DevTools:**
1. Open DevTools (F12)
2. Go to Application > Storage
3. Click "Clear site data"
4. Reload

**Firefox DevTools:**
1. Open DevTools (F12)
2. Go to Storage > Cache Storage
3. Right-click and delete all caches

**Programmatically (for testing):**
```javascript
// In browser console
caches.keys().then(names => {
  names.forEach(name => caches.delete(name));
});
```

### Cache Strategy

The service worker uses two caching strategies:

1. **Static Assets** (Cache Name: `joscola-v1.x.x`)
   - Strategy: Cache-first
   - Includes: JS, CSS, images, fonts
   - Updated when cache version changes

2. **Runtime Data** (Cache Name: `joscola-runtime-v1.x.x`)
   - Strategy: Network-first with cache fallback
   - Includes: API responses, dynamic content
   - Updated automatically but respects cache version

---

## Development Workflow

### Starting Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Open http://localhost:3000
```

### Making Changes

1. **Edit code** in `apps/game/src/`
2. **Update cache version** in `apps/game/public/service-worker.js`
3. **Test changes** (hard refresh or incognito)
4. **Commit changes** including service worker update

### Common Issues

#### "My changes aren't showing up!"
- **Cause:** Service worker is serving old cached version
- **Solution:** Update cache version in service-worker.js

#### "Service worker won't update"
- **Cause:** Browser hasn't detected changes
- **Solution:**
  1. Update cache version
  2. Close all tabs with the app
  3. Reopen in new tab/window

#### "App works in dev but not in production"
- **Cause:** Cache version not updated before deploy
- **Solution:** Always update cache version before deploying

---

## Profile Page Implementation

### Overview

The profile page allows users to:
- Select avatar from 32 emoji options
- Edit name and age
- View usage statistics (time, exercises, coins, medals)
- Clear all data and start fresh

### Files Modified

**Store** (`apps/game/src/lib/store.ts`)
- Added avatar, time tracking, and statistics
- Added `updateUser()`, `clearAllData()`, session tracking

**Components:**
- `apps/game/src/components/ProfilePage.tsx` - Profile UI (NEW)
- `apps/game/src/components/GameHeader.tsx` - Clickable user button
- `apps/game/src/components/Onboarding.tsx` - Avatar selection on signup
- `apps/game/src/components/ExerciseSetGrid.tsx` - Profile navigation
- `apps/game/src/app/page.tsx` - Session time tracking

### Data Storage

All data is stored locally using Zustand with localStorage persistence:

**Key:** `joscola-storage`

**Structure:**
```javascript
{
  user: {
    name: string,
    age: number,
    avatar: string,
    totalTimeSpent: number, // seconds
    createdAt: Date,
    lastActiveAt: Date
  },
  coins: number,
  medals: Medal[],
  progress: ExerciseProgress[],
  // ...
}
```

### Avatar Options

32 emojis organized in 4 categories:
- **Faces:** 😀 😊 🙂 😎 🤓 🥳 🤩 👤
- **Animals:** 🐶 🐱 🐭 🐹 🐰 🦊 🐻 🐼 🦁 🐯 🐸 🐵 🐔 🐧 🦉 🦄
- **Symbols:** 🚀 ⭐ 🌟 ✨ 🎨 🎭 🎪 🎯

Default: 👤

### Time Tracking

Session time is automatically tracked:
- Starts when app loads
- Pauses when tab is hidden
- Ends when tab closes
- Accumulated across sessions

**Implementation:** `apps/game/src/app/page.tsx`

---

## Deployment Checklist

Before deploying to production:

- [ ] Update service worker cache version
- [ ] Test in incognito/private window
- [ ] Clear cache and verify updates work
- [ ] Test on mobile device
- [ ] Verify offline functionality
- [ ] Check localStorage persistence
- [ ] Test avatar selection
- [ ] Test profile editing
- [ ] Test data clearing

---

## Tips & Best Practices

### 1. Always Version Your Service Worker
Never skip updating the cache version. It's better to increment too often than not enough.

### 2. Test in Incognito Mode
This ensures you're seeing fresh content without cache interference.

### 3. Document Major Changes
Add a comment in service-worker.js describing what changed:
```javascript
// Version 1.2.0 - Added new math exercises and scoring system
```

### 4. Use Browser DevTools
Monitor the service worker lifecycle in DevTools > Application.

### 5. Consider Semantic Versioning
Keep your version numbers meaningful and consistent.

---

## Troubleshooting

### Service Worker Not Updating

**Problem:** New version won't activate
**Solution:**
```javascript
// In service-worker.js, ensure skipWaiting is called
self.skipWaiting();
```

### Old Cache Persists

**Problem:** Old cache isn't being cleaned up
**Solution:** Check the activate event properly filters and deletes old caches:
```javascript
cacheNames.filter((cacheName) => {
  return cacheName.startsWith('joscola-') && cacheName !== CACHE_NAME;
})
```

### Changes Not Reflecting

**Problem:** Made changes but they don't appear
**Checklist:**
1. Updated cache version? ✓
2. Hard refreshed (Ctrl+Shift+R)? ✓
3. Checked DevTools for errors? ✓
4. Service worker installed? ✓

---

## Additional Resources

- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [PWA Best Practices](https://web.dev/pwa/)
- [Workbox (Advanced SW)](https://developers.google.com/web/tools/workbox)
- [Zustand Documentation](https://docs.pmnd.rs/zustand/getting-started/introduction)

---

**Remember: Cache version updates are NOT optional. They are REQUIRED for every deployment.**
