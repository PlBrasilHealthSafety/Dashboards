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
│   │   ├── ui/           # Componentes Shadcn/ui
│   │   ├── custom/       # Componentes customizados
│   │   ├── layout/       # Layout (Header, Footer, etc)
│   │   └── examples/     # Exemplos de uso
│   ├── pages/            # Páginas da aplicação
│   ├── routes/           # Configuração de rotas
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utilitários e configurações
│   │   ├── firebase.ts   # Configuração Firebase
│   │   ├── types.ts      # Types globais
│   │   └── validations.ts # Schemas de validação
│   ├── styles/           # Estilos globais
│   └── main.tsx          # Entry point
├── public/               # Assets públicos
├── docs/                 # Documentação adicional
└── scripts/              # Scripts de automação
```

## 🎯 Features Implementadas

### 🔐 Autenticação
- Login/Registro com Firebase Auth
- Proteção de rotas
- Gerenciamento de sessão
- Perfil de usuário

### 🎨 Componentes UI
- Sistema de design consistente
- Componentes reutilizáveis
- Dark/Light mode ready
- Totalmente responsivo

### 📊 Visualizações
- Gráficos interativos (linha, barra, pizza)
- Carrosséis customizáveis
- Animações suaves
- Transições de página

### 📝 Formulários
- Validação em tempo real
- Mensagens de erro claras
- Suporte a múltiplos tipos
- Integração com backend

### 🗄️ Database
- CRUD completo com Firestore
- Real-time updates
- Queries otimizadas
- Type-safe operations

### ⚡ Performance
- Code splitting automático
- Lazy loading de rotas
- Otimização de bundles
- Cache inteligente

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

- [Configuração do Firebase](./docs/FIREBASE_SETUP.md)
- [Setup do Firestore](./docs/FIRESTORE_SETUP.md)
- [Deploy no Vercel](./docs/VERCEL_DEPLOYMENT.md)
- [Checklist de Deploy](./docs/DEPLOYMENT_CHECKLIST.md)

## 🧪 Exemplos de Uso

### Autenticação
```typescript
import { useAuth } from '@/hooks/useAuth'

function MyComponent() {
  const { user, signIn, signOut } = useAuth()
  
  // Use o usuário autenticado
  if (user) {
    return <div>Olá, {user.email}!</div>
  }
}
```

### Firestore CRUD
```typescript
import { useFirestoreCRUD } from '@/hooks/useFirestore'

function MyComponent() {
  const { create, update, remove } = useFirestoreCRUD('posts')
  
  // Criar documento
  await create({ title: 'Novo Post', content: '...' })
}
```

### Formulários com Validação
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

function MyForm() {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(schema)
  })
  
  // Use o formulário validado
}
```

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