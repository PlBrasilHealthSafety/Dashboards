#!/usr/bin/env node

/**
 * Script to verify deployment readiness
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Verificando Configuração de Deploy');
console.log('====================================\n');

const checks = [];

// Check 1: vercel.json exists
const vercelJsonPath = path.join(path.dirname(__dirname), 'vercel.json');
if (fs.existsSync(vercelJsonPath)) {
  checks.push({ name: 'vercel.json', status: '✅', message: 'Arquivo de configuração encontrado' });
  
  // Validate vercel.json content
  try {
    const vercelConfig = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));
    if (vercelConfig.rewrites && vercelConfig.rewrites.length > 0) {
      checks.push({ name: 'SPA Redirects', status: '✅', message: 'Redirecionamentos configurados' });
    } else {
      checks.push({ name: 'SPA Redirects', status: '⚠️', message: 'Redirecionamentos não encontrados' });
    }
    
    if (vercelConfig.headers && vercelConfig.headers.length > 0) {
      checks.push({ name: 'Security Headers', status: '✅', message: 'Headers de segurança configurados' });
    } else {
      checks.push({ name: 'Security Headers', status: '⚠️', message: 'Headers de segurança não configurados' });
    }
  } catch (error) {
    checks.push({ name: 'vercel.json', status: '❌', message: 'Arquivo inválido: ' + error.message });
  }
} else {
  checks.push({ name: 'vercel.json', status: '❌', message: 'Arquivo não encontrado' });
}

// Check 2: Build directory exists after build
const distPath = path.join(path.dirname(__dirname), 'dist');
if (fs.existsSync(distPath)) {
  checks.push({ name: 'Build Output', status: '✅', message: 'Diretório dist/ encontrado' });
  
  // Check for index.html
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    checks.push({ name: 'index.html', status: '✅', message: 'Arquivo principal encontrado' });
  } else {
    checks.push({ name: 'index.html', status: '❌', message: 'index.html não encontrado em dist/' });
  }
} else {
  checks.push({ name: 'Build Output', status: '⚠️', message: 'Execute npm run build primeiro' });
}

// Check 3: Environment variables template
const envExamplePath = path.join(path.dirname(__dirname), '.env.example');
if (fs.existsSync(envExamplePath)) {
  checks.push({ name: '.env.example', status: '✅', message: 'Template de variáveis encontrado' });
} else {
  checks.push({ name: '.env.example', status: '❌', message: 'Template de variáveis não encontrado' });
}

// Check 4: Package.json scripts
const packageJsonPath = path.join(path.dirname(__dirname), 'package.json');
if (fs.existsSync(packageJsonPath)) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const scripts = packageJson.scripts || {};
    
    if (scripts.build) {
      checks.push({ name: 'Build Script', status: '✅', message: 'Script de build configurado' });
    } else {
      checks.push({ name: 'Build Script', status: '❌', message: 'Script de build não encontrado' });
    }
    
    if (scripts['vercel:deploy'] || scripts['vercel:preview']) {
      checks.push({ name: 'Vercel Scripts', status: '✅', message: 'Scripts do Vercel configurados' });
    } else {
      checks.push({ name: 'Vercel Scripts', status: '⚠️', message: 'Scripts do Vercel não encontrados' });
    }
  } catch (error) {
    checks.push({ name: 'package.json', status: '❌', message: 'Erro ao ler package.json' });
  }
}

// Display results
console.log('📋 Resultados da Verificação:');
console.log('=============================\n');

checks.forEach(check => {
  console.log(`${check.status} ${check.name}: ${check.message}`);
});

// Summary
const passed = checks.filter(c => c.status === '✅').length;
const warnings = checks.filter(c => c.status === '⚠️').length;
const failed = checks.filter(c => c.status === '❌').length;

console.log('\n📊 Resumo:');
console.log('==========');
console.log(`✅ Passou: ${passed}`);
console.log(`⚠️  Avisos: ${warnings}`);
console.log(`❌ Falhou: ${failed}`);

if (failed === 0 && warnings === 0) {
  console.log('\n🎉 Tudo pronto para deploy!');
  console.log('Execute: vercel --prod');
} else if (failed === 0) {
  console.log('\n⚠️  Pronto para deploy com avisos');
  console.log('Execute: vercel --prod');
} else {
  console.log('\n❌ Corrija os erros antes do deploy');
}

console.log('\n📖 Para mais informações, consulte:');
console.log('docs/VERCEL_DEPLOYMENT.md');