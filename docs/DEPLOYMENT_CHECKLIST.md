# Checklist de Deploy - Vercel

## ✅ Configuração Completa

### 1. Vercel CLI Instalado
- [x] `npm install -g vercel`
- [x] CLI disponível globalmente

### 2. Configuração do Projeto
- [x] `vercel.json` criado com:
  - [x] Build command configurado
  - [x] Output directory definido
  - [x] Framework Vite configurado
  - [x] Redirecionamentos SPA
  - [x] Headers de cache para assets
  - [x] Headers de segurança

### 3. Scripts NPM Adicionados
- [x] `vercel:setup` - Guia de configuração de variáveis
- [x] `vercel:preview` - Deploy de preview
- [x] `vercel:deploy` - Deploy de produção
- [x] `vercel:verify` - Verificação de configuração

### 4. Documentação Criada
- [x] `docs/VERCEL_DEPLOYMENT.md` - Guia completo de deploy
- [x] `docs/DEPLOYMENT_CHECKLIST.md` - Este checklist
- [x] `scripts/setup-vercel-env.js` - Helper para variáveis de ambiente
- [x] `scripts/verify-deployment.js` - Verificação automática

### 5. Testes Realizados
- [x] Build local: `npm run build` ✅
- [x] Preview local: `npm run preview` ✅
- [x] Verificação de configuração: `npm run vercel:verify` ✅

## 🚀 Próximos Passos para Deploy

### Para o Usuário:

1. **Login no Vercel**
   ```bash
   vercel login
   ```

2. **Configurar Variáveis de Ambiente**
   ```bash
   npm run vercel:setup
   ```
   Seguir as instruções para adicionar cada variável.

3. **Deploy de Preview**
   ```bash
   npm run vercel:preview
   ```

4. **Deploy de Produção**
   ```bash
   npm run vercel:deploy
   ```

## 📋 Variáveis de Ambiente Necessárias

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## 🔧 Comandos Úteis

```bash
# Verificar configuração
npm run vercel:verify

# Ver guia de variáveis
npm run vercel:setup

# Build e preview local
npm run build && npm run preview

# Deploy preview
npm run vercel:preview

# Deploy produção
npm run vercel:deploy
```

## ✨ Recursos Configurados

- **SPA Routing**: Todas as rotas redirecionam para index.html
- **Cache Otimizado**: Assets com cache de 1 ano
- **Security Headers**: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection
- **Build Otimizado**: Vite com tree-shaking e minificação
- **Environment Variables**: Suporte completo para variáveis do Firebase