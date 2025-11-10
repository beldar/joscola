#!/usr/bin/env node

/**
 * Auto-increment Service Worker cache version
 *
 * This script automatically bumps the patch version of the service worker
 * cache whenever code changes are committed. This ensures users always
 * get the latest version of the app.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SW_PATH = path.join(__dirname, '../apps/game/public/service-worker.js');

// Check if there are any staged changes in src/ directory
function hasSrcChanges() {
  try {
    const stagedFiles = execSync('git diff --cached --name-only', { encoding: 'utf-8' });
    const srcChanged = stagedFiles.split('\n').some(file =>
      file.startsWith('apps/game/src/') ||
      file.includes('components/') ||
      file.includes('app/')
    );
    return srcChanged;
  } catch (error) {
    console.warn('Warning: Could not check git status');
    return false;
  }
}

// Only bump version if there are relevant changes
if (!hasSrcChanges()) {
  console.log('ℹ️  No src/ changes detected, skipping cache version bump');
  process.exit(0);
}

// Read the service worker file
let content = fs.readFileSync(SW_PATH, 'utf-8');

// Find current versions
const cacheNameMatch = content.match(/const CACHE_NAME = 'joscola-v([\d.]+)'/);
const runtimeCacheMatch = content.match(/const RUNTIME_CACHE = 'joscola-runtime-v([\d.]+)'/);

if (!cacheNameMatch || !runtimeCacheMatch) {
  console.error('❌ Could not find cache version in service-worker.js');
  process.exit(1);
}

const currentVersion = cacheNameMatch[1];
const [major, minor, patch] = currentVersion.split('.').map(Number);

// Bump patch version
const newVersion = `${major}.${minor}.${patch + 1}`;

console.log(`📦 Bumping service worker cache version: v${currentVersion} → v${newVersion}`);

// Get commit message hint if available
let changeDescription = '';
try {
  // Try to get the commit message from git
  const commitMsg = execSync('git log -1 --pretty=%B 2>/dev/null || echo ""', { encoding: 'utf-8' }).trim();
  if (commitMsg) {
    changeDescription = ` - ${commitMsg.split('\n')[0].substring(0, 60)}`;
  }
} catch (e) {
  // No commit message available (this is a new commit)
}

// Update the content
const versionComment = `// Version ${newVersion}${changeDescription}`;
content = content.replace(
  /\/\/ Service Worker for Joscola PWA\n\/\/ Version .*/,
  `// Service Worker for Joscola PWA\n${versionComment}`
);

content = content.replace(
  /const CACHE_NAME = 'joscola-v[\d.]+'/,
  `const CACHE_NAME = 'joscola-v${newVersion}'`
);

content = content.replace(
  /const RUNTIME_CACHE = 'joscola-runtime-v[\d.]+'/,
  `const RUNTIME_CACHE = 'joscola-runtime-v${newVersion}'`
);

// Write back
fs.writeFileSync(SW_PATH, content, 'utf-8');

console.log('✅ Service worker cache version updated successfully');
console.log(`   New version: v${newVersion}`);
console.log('   File: apps/game/public/service-worker.js');

process.exit(0);
