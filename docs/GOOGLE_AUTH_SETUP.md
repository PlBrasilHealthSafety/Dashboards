# Configuração do Google Authentication

## Visão Geral
Este documento explica como configurar o Google Authentication no Firebase Console para permitir login com Google na aplicação.

## Pré-requisitos
- Projeto Firebase criado (dashboards-80eb1)
- Acesso ao Firebase Console
- Conta Google com permissões de administrador do projeto

## Configuração no Firebase Console

### 1. Acessar Authentication
1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto: `dashboards-80eb1`
3. No menu lateral, clique em "Authentication"
4. Vá para a aba "Sign-in method"

### 2. Habilitar Google Provider
1. Na lista de provedores, clique em "Google"
2. Clique no botão "Enable" (Habilitar)
3. Configure os seguintes campos:
   - **Project support email**: plhealthgithub@gmail.com
   - **Project public-facing name**: Dashboards App (ou nome desejado)
4. Clique em "Save" (Salvar)

### 3. Configuração de Domínios Autorizados
1. Na aba "Settings" do Authentication
2. Em "Authorized domains", adicione:
   - `localhost` (para desenvolvimento)
   - Seu domínio de produção (se aplicável)

### 4. Configuração da Aplicação Web
1. No Firebase Console, vá para "Project Settings" (ícone de engrenagem)
2. Na aba "General", role até "Your apps"
3. Se não tiver uma app web, clique em "Add app" e selecione "Web"
4. Configure o app com nickname: "dashboards-web"
5. Copie as configurações do Firebase para suas variáveis de ambiente

## Variáveis de Ambiente

Certifique-se de que seu arquivo `.env.local` contém:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=dashboards-80eb1.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=dashboards-80eb1
VITE_FIREBASE_STORAGE_BUCKET=dashboards-80eb1.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## Verificação da Configuração

Para verificar se a configuração está correta:

1. **Teste o Login por Email/Senha**: Deve funcionar normalmente
2. **Teste o Login com Google**: Deve abrir popup do Google para autenticação
3. **Verifique no Firebase Console**: Os usuários devem aparecer na aba "Users" do Authentication

## Troubleshooting

### Erro: "This domain is not authorized"
- Verifique se o domínio está listado em "Authorized domains"
- Para desenvolvimento local, certifique-se que `localhost` está autorizado

### Erro: "Invalid API key"
- Verifique se as variáveis de ambiente estão corretas
- Certifique-se de que a API key é válida no Firebase Console

### Popup não abre ou é bloqueado
- Verifique se o popup não está sendo bloqueado pelo navegador
- Teste em uma aba anônima/privada

## Funcionalidades Implementadas

✅ **Login por Email/Senha**: Implementado e funcional
✅ **Login com Google**: Implementado com popup
✅ **Interface de Login**: Componente responsivo com botões para ambos os métodos
✅ **Gerenciamento de Estado**: Context API para autenticação
✅ **Tratamento de Erros**: Feedback visual para erros de login
✅ **Loading States**: Indicadores visuais durante o processo de login

## Próximos Passos

1. Configure o Google Provider no Firebase Console seguindo os passos acima
2. Teste a funcionalidade de login
3. Configure domínios de produção quando necessário
4. Considere implementar logout e perfil do usuário
