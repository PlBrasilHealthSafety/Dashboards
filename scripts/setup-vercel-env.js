#!/usr/bin/env node

/**
 * Script to help configure Vercel environment variables
 * Run this after setting up your Vercel project
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Vercel Environment Variables Setup Guide');
console.log('==========================================\n');

// Read .env.example to get required variables
const envExamplePath = path.join(path.dirname(__dirname), '.env.example');
if (!fs.existsSync(envExamplePath)) {
  console.error('❌ .env.example file not found');
  process.exit(1);
}

const envExample = fs.readFileSync(envExamplePath, 'utf8');
const envVars = envExample
  .split('\n')
  .filter(line => line.startsWith('VITE_') && !line.startsWith('#'))
  .map(line => line.split('=')[0]);

console.log('📋 Required Environment Variables for Vercel:');
console.log('==============================================\n');

envVars.forEach(varName => {
  console.log(`${varName}=your_value_here`);
});

console.log('\n📝 To set these variables in Vercel:');
console.log('=====================================');
console.log('1. Run: vercel env add [VARIABLE_NAME]');
console.log('2. Or use Vercel Dashboard: https://vercel.com/dashboard');
console.log('3. Go to your project > Settings > Environment Variables');
console.log('\n💡 Example commands:');
envVars.forEach(varName => {
  console.log(`vercel env add ${varName}`);
});

console.log('\n🔧 Alternative: Bulk import from .env file');
console.log('===========================================');
console.log('vercel env pull .env.vercel');
console.log('# Then manually add your production values\n');