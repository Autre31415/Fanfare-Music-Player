#!/usr/bin/env node

// this script only needs to run in linux
if (process.platform !== 'linux') {
  process.exit(0)
}

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')
const electronPath = path.join(__dirname, 'node_modules', 'electron')
const sandboxPath = path.join(electronPath, 'dist', 'chrome-sandbox')

// check if electron and chrome-sandbox exist
if (!fs.existsSync(electronPath) || !fs.existsSync(sandboxPath)) {
  console.error('electron not found, cannot run postinstall script')
  process.exit(0)
}

try {
  // check current permissions
  const stat = fs.statSync(sandboxPath)
  const currentMode = stat.mode & 0o7777

  // check if SUID bit is already set (0o4000)
  if ((currentMode & 0o4000) !== 0) {
    // chrome-sandbox already has correct permissions
    process.exit(0)
  }

  try {
    execSync('chown root:root "' + sandboxPath + '"')
    execSync('chmod 4755 "' + sandboxPath + '"')
  } catch (err) {
    console.log('Enter your sudo password to set chrome-sandbox permissions:')
    execSync('sudo chown root:root "' + sandboxPath + '"', { stdio: 'inherit' })
    execSync('sudo chmod 4755 "' + sandboxPath + '"', { stdio: 'inherit' })
  }

  console.log('✅ chrome-sandbox permissions set successfully')
} catch (error) {
  console.error('❌ Failed to set chrome-sandbox permissions:')
  console.error(error.message)
  console.error('\nYou may need to run these commands manually:')
  console.error('sudo chown root:root node_modules/electron/dist/chrome-sandbox')
  console.error('sudo chmod 4755 node_modules/electron/dist/chrome-sandbox')
  process.exit(1)
}
