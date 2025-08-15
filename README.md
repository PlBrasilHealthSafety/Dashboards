# React + TypeScript + Vite Dashboard

Um projeto completo e moderno de dashboard com React, TypeScript, Vite e integração com Firebase. Este projeto inclui todas as ferramentas essenciais para desenvolvimento de aplicações web modernas.

## 🚀 Stack Tecnológica

### Core
- **React 19** - Biblioteca UI
- **TypeScript** - Type safety
- **Vite** - Build tool ultra-rápida
- **React Router v7** - Roteamento com lazy loading

### Estilização
- **Tailwind CSS** - Utility-first CSS
- **Shadcn/ui** - Componentes UI acessíveis
- **Class Variance Authority** - Variantes de componentes
- **Tailwind Merge** - Merge inteligente de classes

### Formulários e Validação
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Schema validation
- **@hookform/resolvers** - Integração RHF + Zod

### Animações e UI
- **Framer Motion** - Animações declarativas
- **Swiper.js** - Carrosséis responsivos
- **Recharts** - Gráficos e visualizações
- **Three.js + React Three Fiber** - Gráficos 3D
- **@react-three/drei** - Utilitários para Three.js
- **Lucide React** - Ícones modernos

### Backend e Database
- **Firebase Auth** - Autenticação
- **Firestore** - Database NoSQL
- **Firebase Hosting** (opcional)

### Deploy
- **Vercel** - Deploy otimizado
- **Vercel CLI** - Deploy via terminal

## 📦 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/dashboards.git
cd dashboards
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Adicione suas credenciais do Firebase no arquivo `.env`:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 🛠️ Scripts Disponíveis

### Desenvolvimento
```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run dev:host     # Inicia servidor acessível na rede
```

### Build e Preview
```bash
npm run build        # Build de produção
npm run preview      # Preview do build local
npm run preview:dist # Preview na porta 4173
```

### Linting e Type Checking
```bash
npm run lint         # Verifica erros de lint
npm run lint:fix     # Corrige erros automaticamente
npm run type-check   # Verifica tipos TypeScript
```

### Firebase
```bash
npm run firebase:emulators  # Inicia emuladores locais
npm run firebase:deploy     # Deploy de regras e índices
```

### Vercel Deploy
```bash
npm run vercel:setup   # Configura variáveis de ambiente
npm run vercel:deploy  # Deploy em produção
npm run vercel:preview # Deploy de preview
```

### Utilitários
```bash
npm run clean        # Limpa arquivos de build
npm test            # Executa testes (não configurado ainda)
```

## 📁 Estrutura do Projeto

```
dashboards/
├── src/
│   ├── components/
│   │   ├── ui/           # Componentes Shadcn/ui base
│   │   ├── custom/       # Componentes customizados
│   │   │   ├── Auth*.tsx # Componentes de autenticação
│   │   │   ├── *Dashboard.tsx # Dashboards especializados
│   │   │   ├── *Form.tsx # Formulários customizados
│   │   │   └── Animated*.tsx # Componentes animados
│   │   ├── layout/       # Layout (Header, Footer, Sidebar)
│   │   └── examples/     # Exemplos de uso e demos
│   ├── pages/            # Páginas da aplicação
│   │   ├── HomePage.tsx  # Página inicial
│   │   ├── *Page.tsx     # Páginas específicas
│   │   └── TVDashboard.tsx # Dashboard para TV
│   ├── routes/           # Configuração de rotas
│   ├── hooks/            # Custom hooks
│   │   ├── useAuth.ts    # Hook de autenticação
│   │   └── useFirestore.ts # Hook do Firestore
│   ├── lib/              # Utilitários e configurações
│   │   ├── firebase*.ts  # Configuração Firebase
│   │   ├── firestore-*.ts # Serviços Firestore
│   │   ├── types.ts      # Types globais
│   │   ├── validations.ts # Schemas Zod
│   │   └── utils.ts      # Utilitários gerais
│   ├── styles/           # Estilos adicionais
│   │   └── carousel.css  # Estilos do carrossel
│   └── main.tsx          # Entry point
├── public/               # Assets públicos e logos
├── docs/                 # Documentação detalhada
├── scripts/              # Scripts de automação
│   ├── setup-vercel-env.js # Setup Vercel
│   └── verify-deployment.js # Verificação deploy
└── .kiro/                # Configuração Kiro IDE
    ├── hooks/            # Hooks do agente
    ├── specs/            # Especificações
    └── steering/         # Regras de direcionamento
```

## 🎯 Features Implementadas

### 🔐 Autenticação
- Login/Registro com Firebase Auth
- Proteção de rotas (ProtectedRoute/PublicRoute)
- Gerenciamento de sessão com AuthProvider
- Perfil de usuário completo
- Hooks customizados (useAuth)

### 🎨 Componentes UI
- Sistema de design Shadcn/ui (New York style)
- Componentes reutilizáveis e acessíveis
- Dark/Light mode ready com CSS variables
- Layout responsivo com AppLayout
- Header, Footer e Sidebar modulares

### 📊 Visualizações e Dashboards
- Gráficos interativos com Recharts (linha, barra, pizza)
- Dashboard 3D com Three.js e React Three Fiber
- Dashboard médico especializado
- Dashboard executivo com análise setorial
- Carrosséis customizáveis com Swiper.js
- Slides para TV Dashboard

### 🎬 Animações
- Framer Motion para animações declarativas
- Componentes animados de entrada/saída
- Transições de página suaves
- Animações interativas
- PageTransition wrapper

### 📝 Formulários
- React Hook Form + Zod validation
- Formulários de contato e autenticação
- Campos customizados (FormField, SimpleFormField)
- Validação em tempo real
- Mensagens de erro claras

### 🗄️ Database e Backend
- Firebase v12 com Firestore
- CRUD completo com hooks customizados
- Real-time updates com useFirestore
- Modelos de dados tipados
- Serviços organizados por coleção
- Regras de segurança configuradas

### 🏗️ Arquitetura
- Estrutura modular bem organizada
- Separação clara de responsabilidades
- Hooks customizados reutilizáveis
- Tipos TypeScript centralizados
- Utilitários e validações separados

### ⚡ Performance
- Code splitting automático por vendor
- Lazy loading de rotas
- Otimização de bundles com Vite
- Cache inteligente
- Chunks manuais otimizados

## 🚀 Deploy

### Vercel (Recomendado)

1. Configure o projeto no Vercel:
```bash
npm run vercel:setup
```

2. Deploy em produção:
```bash
npm run vercel:deploy
```

### Deploy Manual

1. Build o projeto:
```bash
npm run build
```

2. O diretório `dist/` contém os arquivos prontos para deploy.

## 📚 Documentação Adicional

### Configuração e Setup
- [Configuração do Firebase](./docs/FIREBASE_SETUP.md)
- [Setup do Firestore](./docs/FIRESTORE_SETUP.md)
- [Configuração Google Auth](./docs/GOOGLE_AUTH_SETUP.md)
- [Guia de Início Rápido](./docs/QUICK_START.md)

### Desenvolvimento
- [Workflow de Desenvolvimento](./docs/DEVELOPMENT_WORKFLOW.md)
- [Guia de Componentes](./docs/COMPONENTS_GUIDE.md)

### Deploy e Produção
- [Deploy no Vercel](./docs/VERCEL_DEPLOYMENT.md)
- [Checklist de Deploy](./docs/DEPLOYMENT_CHECKLIST.md)

## 🧪 Exemplos de Uso

### Autenticação
```typescript
import { useAuth } from '@/hooks/useAuth'
import { AuthProvider } from '@/components/custom/AuthProvider'
import { ProtectedRoute } from '@/components/custom/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    </AuthProvider>
  )
}

function MyComponent() {
  const { user, signIn, signOut, loading } = useAuth()
  
  if (loading) return <div>Carregando...</div>
  if (user) return <div>Olá, {user.email}!</div>
  
  return <LoginForm onSubmit={signIn} />
}
```

### Firestore com Hooks
```typescript
import { useFirestore } from '@/hooks/useFirestore'

function PostsList() {
  const { 
    documents: posts, 
    loading, 
    error,
    addDocument,
    updateDocument,
    deleteDocument 
  } = useFirestore('posts')
  
  const handleCreate = async (data) => {
    await addDocument({ ...data, createdAt: new Date() })
  }
  
  if (loading) return <div>Carregando posts...</div>
  if (error) return <div>Erro: {error.message}</div>
  
  return (
    <div>
      {posts.map(post => (
        <Card key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
        </Card>
      ))}
    </div>
  )
}
```

### Formulários com Validação
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactFormSchema } from '@/lib/validations'
import { FormField } from '@/components/custom/FormField'

function ContactForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(contactFormSchema)
  })
  
  const onSubmit = async (data) => {
    // Processar dados do formulário
    console.log(data)
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
      />
      <FormField
        label="Mensagem"
        type="textarea"
        {...register('message')}
        error={errors.message?.message}
      />
      <Button type="submit">Enviar</Button>
    </form>
  )
}
```

### Dashboard 3D
```typescript
import { SimpleDashboard3D } from '@/components/custom/SimpleDashboard3D'

function Dashboard() {
  return (
    <div className="h-screen">
      <SimpleDashboard3D />
    </div>
  )
}
```

### Animações com Framer Motion
```typescript
import { motion } from 'framer-motion'
import { PageTransition } from '@/components/custom/PageTransition'

function AnimatedPage() {
  return (
    <PageTransition>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Página Animada</h1>
      </motion.div>
    </PageTransition>
  )
}

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 Agradecimentos

- [Shadcn/ui](https://ui.shadcn.com/) pelos componentes incríveis
- [Vite](https://vitejs.dev/) pela ferramenta de build rápida
- [Firebase](https://firebase.google.com/) pela infraestrutura backend
- [Vercel](https://vercel.com/) pela plataforma de deploy

---

Feito com ❤️ usando React + TypeScript + Vite