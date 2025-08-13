# Vercel Deployment Guide

Este guia explica como fazer deploy da aplicação no Vercel.

## Pré-requisitos

1. Conta no Vercel (https://vercel.com)
2. Vercel CLI instalado globalmente
3. Projeto configurado com Firebase

## Configuração Inicial

### 1. Login no Vercel CLI

```bash
vercel login
```

Escolha uma das opções de login (GitHub, GitLab, Bitbucket, ou Email).

### 2. Inicializar Projeto Vercel

```bash
vercel
```

Durante a configuração inicial, responda:
- **Set up and deploy?** → Yes
- **Which scope?** → Sua conta pessoal ou organização
- **Link to existing project?** → No (para novo projeto)
- **What's your project's name?** → dashboards (ou nome desejado)
- **In which directory is your code located?** → ./
- **Want to modify settings?** → No (as configurações já estão no vercel.json)

### 3. Configurar Variáveis de Ambiente

Execute o script helper para ver as variáveis necessárias:

```bash
npm run vercel:setup
```

Adicione cada variável de ambiente no Vercel:

```bash
vercel env add VITE_FIREBASE_API_KEY
vercel env add VITE_FIREBASE_AUTH_DOMAIN
vercel env add VITE_FIREBASE_PROJECT_ID
vercel env add VITE_FIREBASE_STORAGE_BUCKET
vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID
vercel env add VITE_FIREBASE_APP_ID
```

**Alternativa:** Configure via Dashboard do Vercel:
1. Acesse https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em Settings → Environment Variables
4. Adicione cada variável manualmente

## Deploy

### Deploy de Preview (Branch)

```bash
npm run vercel:preview
# ou
vercel
```

### Deploy de Produção

```bash
npm run vercel:deploy
# ou
vercel --prod
```

## Configurações do Projeto

### vercel.json

O arquivo `vercel.json` já está configurado com:

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Framework**: `vite`
- **SPA Redirects**: Todas as rotas redirecionam para `index.html`
- **Cache Headers**: Assets com cache de 1 ano
- **Security Headers**: Headers de segurança básicos

### Scripts NPM

- `npm run vercel:setup` - Mostra guia de configuração de variáveis
- `npm run vercel:preview` - Deploy de preview
- `npm run vercel:deploy` - Deploy de produção

## Verificação do Deploy

1. **Build Local**: `npm run build && npm run preview`
2. **Deploy Preview**: `vercel`
3. **Deploy Produção**: `vercel --prod`

## Troubleshooting

### Erro de Build

Se o build falhar no Vercel:

1. Verifique se todas as variáveis de ambiente estão configuradas
2. Teste o build local: `npm run build`
3. Verifique os logs no dashboard do Vercel

### Problemas de Roteamento SPA

Se as rotas não funcionarem:

1. Verifique se o `vercel.json` tem a configuração de rewrites
2. Confirme que o `outputDirectory` está correto

### Variáveis de Ambiente

Se o Firebase não conectar:

1. Verifique se todas as variáveis `VITE_FIREBASE_*` estão configuradas
2. Confirme que os valores estão corretos (sem aspas extras)
3. Redeploy após adicionar variáveis: `vercel --prod`

## Domínio Personalizado

Para configurar domínio personalizado:

1. Acesse o dashboard do Vercel
2. Vá em Settings → Domains
3. Adicione seu domínio
4. Configure DNS conforme instruções

## Monitoramento

- **Analytics**: Habilitado automaticamente no Vercel
- **Logs**: Disponíveis no dashboard do Vercel
- **Performance**: Web Vitals automáticos

## Comandos Úteis

```bash
# Ver deployments
vercel ls

# Ver logs do último deploy
vercel logs

# Remover projeto
vercel remove

# Ver informações do projeto
vercel inspect
```