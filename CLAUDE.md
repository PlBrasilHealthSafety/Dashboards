# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server (opens automatically on port 3000)
- `npm run dev:host` - Start development server accessible on network
- `npm run build` - Production build with TypeScript compilation
- `npm run preview` - Preview production build locally
- `npm run type-check` - Run TypeScript type checking without emitting files

### Code Quality
- `npm run lint` - Run ESLint with max 0 warnings
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run clean` - Clean build artifacts and node_modules cache

### Firebase Development
- `npm run firebase:emulators` - Start Firebase emulators for local development
- `npm run firebase:deploy` - Deploy Firestore rules and indexes

### Deployment
- `npm run vercel:setup` - Configure Vercel environment variables
- `npm run vercel:deploy` - Deploy to production
- `npm run vercel:preview` - Create preview deployment

## Project Architecture

### Tech Stack
- **React 19** with TypeScript in strict mode
- **Vite** as build tool with SWC for fast compilation
- **Firebase** for authentication and Firestore database
- **Tailwind CSS** + **Shadcn/ui** for styling
- **React Router v7** for routing with lazy loading
- **React Hook Form** + **Zod** for form handling and validation
- **Recharts** for data visualization
- **Framer Motion** for animations

### Key Directories Structure
```
src/
├── components/
│   ├── ui/           # Shadcn/ui base components
│   ├── custom/       # Project-specific components including auth
│   ├── layout/       # App layout components
│   └── examples/     # Component usage examples
├── pages/            # Route page components
├── routes/           # React Router configuration
├── hooks/            # Custom React hooks (useAuth, useFirestore)
├── lib/              # Core utilities and configurations
│   ├── firebase.ts       # Firebase app initialization
│   ├── firestore-*.ts    # Firestore models, collections, services
│   ├── types.ts          # Global TypeScript types
│   └── validations.ts    # Zod schemas
└── styles/           # Global CSS and component-specific styles
```

### Authentication System
- Firebase Auth with Google Sign-in support
- `AuthProvider` context wraps the entire app
- `useAuth` hook provides authentication state and methods
- Route protection via `ProtectedRoute` and `PublicRoute` components
- Authentication state persisted across sessions

### Firestore Integration
- Type-safe Firestore operations in `lib/firestore-services.ts`
- Collection definitions in `lib/firestore-collections.ts`
- Data models in `lib/firestore-models.ts`
- `useFirestore` hook for CRUD operations with real-time updates

### Build Configuration
- Vite with code splitting configured for optimal loading
- Manual chunks for React, Firebase, and UI libraries
- Path alias `@/` points to `src/` directory
- TypeScript with strict mode enabled
- ESLint configuration with React-specific rules

### Environment Variables
Required Firebase environment variables (prefix with `VITE_`):
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## Color Palette (PLBrasil Health&Safety)
```css
:root.light {
  --primary: #00A298;   /* Verde PLBrasil - elementos principais */
  --secondary: #1D3C44; /* Verde Escuro - contraste e hierarquia */
  --accent: #AECECB;    /* Verde Água - destaques suaves */
  --text: #1D3C44;      /* Verde Escuro - legibilidade */
  --background: #FFFFFF; /* Branco - máximo contraste */
}
```

### Important Notes
- No test framework is configured yet (`npm test` returns placeholder)
- Project uses `npm` exclusively (enforced by preinstall script)
- Portuguese documentation and UI text
- Vercel deployment configured with environment setup scripts
- Firebase emulators available for local development