# Guia Rápido - Dashboard React

## 🚀 Começando

### 1. Instalar e Rodar

```bash
# Clone o projeto
git clone <url-do-repositorio>
cd dashboards

# Instale as dependências
npm install

# Configure o ambiente
cp .env.example .env
# Edite .env com suas credenciais Firebase

# Inicie o desenvolvimento
npm run dev
```

### 2. Estrutura de Páginas

A aplicação está organizada em 5 páginas principais:

- **Home** (`/home`) - Página inicial com overview
- **Components** (`/components`) - Demonstração de componentes UI
- **Forms** (`/forms`) - Exemplos de formulários
- **Database** (`/database`) - Operações CRUD com Firestore
- **Auth** (`/auth`) - Login e registro

## 🎨 Usando Componentes

### Componentes Shadcn/ui

```tsx
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

// Use diretamente
<Button variant="outline">Click me</Button>
```

### Animações com Framer Motion

```tsx
import { AnimatedDiv, fadeInUp } from '@/components/custom'

<AnimatedDiv variant={fadeInUp}>
  Conteúdo animado
</AnimatedDiv>
```

### Carrosséis

```tsx
import { ImageCarousel } from '@/components/custom'

<ImageCarousel 
  images={[
    { id: 1, src: 'url', alt: 'descrição' }
  ]} 
/>
```

### Gráficos

```tsx
import { CustomLineChart } from '@/components/custom'

<CustomLineChart 
  data={data} 
  xKey="month" 
  yKey="value" 
/>
```

## 📝 Criando Formulários

### Com React Hook Form + Zod

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// 1. Defina o schema
const schema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  email: z.string().email('Email inválido')
})

// 2. Use no componente
function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  })
  
  const onSubmit = (data) => {
    console.log(data)
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SimpleFormField label="Nome" error={errors.name}>
        <Input {...register('name')} />
      </SimpleFormField>
      
      <Button type="submit">Enviar</Button>
    </form>
  )
}
```

## 🔥 Usando Firebase

### Autenticação

```tsx
import { useAuth } from '@/hooks/useAuth'

function MyComponent() {
  const { user, signIn, signUp, signOut } = useAuth()
  
  // Login
  await signIn(email, password)
  
  // Registro
  await signUp(email, password)
  
  // Logout
  await signOut()
}
```

### Firestore CRUD

```tsx
import { useFirestoreCRUD } from '@/hooks/useFirestore'

function MyComponent() {
  const { create, update, remove, loading } = useFirestoreCRUD('posts')
  
  // Criar
  const id = await create({
    title: 'Meu Post',
    content: 'Conteúdo'
  })
  
  // Atualizar
  await update(id, { title: 'Título Atualizado' })
  
  // Deletar
  await remove(id)
}
```

### Real-time Data

```tsx
import { useCollection } from '@/hooks/useFirestore'

function MyComponent() {
  const { data, loading } = useCollection('posts')
  
  // Data atualiza automaticamente
  return (
    <div>
      {data.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}
```

## 🎯 Dicas Importantes

### 1. Path Aliases

Use `@/` para imports absolutos:
```tsx
import { Button } from '@/components/ui/button'  // ✅
import { Button } from '../../../components/ui/button'  // ❌
```

### 2. Lazy Loading

Todas as páginas já usam lazy loading automático:
```tsx
// Já configurado em src/routes/index.tsx
const HomePage = lazy(() => import('@/pages/HomePage'))
```

### 3. Variáveis de Ambiente

Sempre prefixe com `VITE_`:
```env
VITE_API_KEY=sua_chave  # ✅
API_KEY=sua_chave       # ❌ Não será lida
```

### 4. Type Safety

Aproveite o TypeScript:
```tsx
// Defina tipos para seus dados
interface Post {
  id: string
  title: string
  content: string
}

// Use com hooks
const { data } = useCollection<Post>('posts')
```

## 🐛 Troubleshooting

### Erro de Build

```bash
npm run clean
npm install
npm run build
```

### Firebase não conecta

1. Verifique as credenciais em `.env`
2. Confirme que o projeto Firebase existe
3. Verifique as regras de segurança

### Tipos não reconhecidos

```bash
npm run type-check
```

## 📚 Próximos Passos

1. **Personalize o tema** em `tailwind.config.js`
2. **Adicione suas páginas** em `src/pages/`
3. **Crie componentes** reutilizáveis
4. **Configure testes** com Vitest
5. **Otimize SEO** com meta tags

---

Precisa de ajuda? Consulte a [documentação completa](../README.md) ou abra uma issue!
