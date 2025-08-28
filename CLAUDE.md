# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server (opens automatically on port 3000)
- `npm run dev:host` - Start development server accessible on network
- `npm run build` - Production build with TypeScript compilation
- `npm run preview` - Preview production build locally
- `npm run preview:dist` - Preview build on port 4173
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
- `npm run vercel:verify` - Verify deployment configuration

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
- **Three.js + React Three Fiber** for 3D graphics
- **Swiper.js** for responsive carousels
- **Lucide React** for modern icons

### Complete Project Structure
```
dashboards/
├── src/
│   ├── components/
│   │   ├── ui/           # Shadcn/ui base components (Button, Card, Input, Badge)
│   │   ├── custom/       # Project-specific components
│   │   │   ├── Auth*.tsx # Authentication components (AuthProvider, LoginForm, etc.)
│   │   │   ├── *Dashboard.tsx # Specialized dashboards (Medical, Executive, 3D)
│   │   │   ├── *Form.tsx # Form components (FormField, ContactForm)
│   │   │   ├── Animated*.tsx # Animation components (PageTransition, etc.)
│   │   │   ├── Charts.tsx # Recharts visualization components
│   │   │   ├── Carousel*.tsx # Swiper.js carousel implementations
│   │   │   ├── ContratoNotificationOverlay.tsx # Video notification overlay
│   │   │   └── Simple*.tsx # Basic component examples
│   │   ├── layout/       # Layout components (AppLayout, Header, Footer, Sidebar)
│   │   └── examples/     # Library integration demos
│   ├── pages/            # Route page components
│   │   ├── HomePage.tsx  # Main homepage
│   │   ├── TVDashboard.tsx # TV-optimized dashboard
│   │   └── *Page.tsx     # Feature-specific pages
│   ├── routes/           # React Router v7 configuration
│   ├── hooks/            # Custom React hooks
│   │   ├── useAuth.ts    # Authentication hook
│   │   └── useFirestore.ts # Firestore operations hook
│   ├── lib/              # Core utilities and configurations
│   │   ├── firebase.ts       # Firebase app initialization
│   │   ├── firestore-*.ts    # Firestore models, collections, services
│   │   ├── types.ts          # Global TypeScript types
│   │   ├── validations.ts    # Zod validation schemas
│   │   └── utils.ts          # General utilities
│   ├── styles/           # Additional CSS
│   │   └── carousel.css  # Carousel-specific styles
│   └── main.tsx          # Application entry point
├── public/               # Public assets
│   ├── novo-contrato-video.mp4 # Contract notification video
│   ├── Logo-PlBrasilHealth.png # Primary logo
│   └── plbrasil-logo.png # Alternative logo
├── docs/                 # Comprehensive documentation
│   ├── README.md                # Documentation overview
│   ├── FIREBASE_SETUP.md        # Firebase configuration guide
│   ├── FIRESTORE_SETUP.md       # Firestore setup guide
│   ├── GOOGLE_AUTH_SETUP.md     # Google Auth configuration
│   ├── VIDEO_SETUP.md           # Video notification setup
│   ├── VERCEL_DEPLOYMENT.md     # Vercel deployment guide
│   ├── DEPLOYMENT_CHECKLIST.md  # Pre-deployment checklist
│   ├── DEVELOPMENT_WORKFLOW.md  # Complete development workflow
│   ├── COMPONENTS_GUIDE.md      # Comprehensive components guide
│   └── QUICK_START.md           # Quick start guide
├── scripts/              # Automation scripts
│   ├── setup-vercel-env.js     # Vercel environment setup
│   └── verify-deployment.js    # Deployment verification
└── .kiro/                # Kiro IDE configuration
```

### Component System Overview

#### UI Components (Shadcn/ui)
- **Button** - Primary action buttons with variants
- **Card** - Container component for content sections
- **Input** - Form input fields with validation
- **Badge** - Status indicators and labels

#### Authentication Components
- **AuthProvider** - Context provider for authentication state
- **AuthPage** - Combined login/register page
- **LoginForm** - User login form with validation
- **RegisterForm** - User registration form
- **ProtectedRoute** - Route wrapper for authenticated users
- **PublicRoute** - Route wrapper for public access
- **UserProfile** - User profile management component

#### Dashboard Components
- **SimpleDashboard3D** - 3D dashboard with Three.js integration
- **MedicalDashboard** - Specialized medical data dashboard
- **ExecutiveLayoutDashboard** - Executive-level analytics dashboard
- **DetailedSectorAnalysis** - Sector-specific analysis component

#### Notification System
- **ContratoNotificationOverlay** - Video notification overlay for new contracts
  - Plays `novo-contrato-video.mp4` from public directory
  - Two-phase display: video → contract information
  - Auto-progression and responsive design
  - Optimized for TV Dashboard integration
  - Video requirements: MP4/WebM, 1920x1080, H.264, 5-10 seconds

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
- Firebase emulators available for local development

### Build Configuration
- Vite with code splitting configured for optimal loading
- Manual chunks for React, Firebase, and UI libraries
- Path alias `@/` points to `src/` directory
- TypeScript with strict mode enabled
- ESLint configuration with React-specific rules
- SWC for fast compilation

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

## Development Workflow Guidelines

### Prerequisites
- Node.js 18+ installed
- npm package manager (enforced by preinstall script)
- Firebase account and project
- Git for version control

### Development Flow
1. Start Firebase emulators: `npm run firebase:emulators`
2. Start development server: `npm run dev`
3. Access Firebase emulator UI at http://localhost:4000
4. Application runs on http://localhost:3000

### Code Quality Standards
- Use strict TypeScript configuration
- Follow ESLint rules with React-specific configuration
- Use functional components with hooks
- Extract custom logic into hooks
- Proper prop typing with interfaces

### Naming Conventions
- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useAuth.ts`)
- **Utilities**: kebab-case (e.g., `firebase-utils.ts`)
- **Types**: PascalCase for interfaces, camelCase for types

### Asset Requirements
- Video notification file must be at `public/novo-contrato-video.mp4`
- Logo files: `public/Logo-PlBrasilHealth.png`, `public/plbrasil-logo.png`
- Video specs: MP4 format, 1920x1080, H.264 codec, 30fps, 5-10 seconds duration

### Deployment Checklist
Before deployment, ensure:
1. Run `npm run type-check` - no TypeScript errors
2. Run `npm run lint` - no linting errors
3. Test local build: `npm run build && npm run preview`
4. Verify all assets exist in `public/` directory
5. Deploy Firebase rules: `npm run firebase:deploy`
6. Configure Vercel environment variables: `npm run vercel:setup`
7. Deploy to Vercel: `npm run vercel:deploy`

### Important Notes
- No test framework is configured yet (`npm test` returns placeholder)
- Project uses `npm` exclusively (enforced by preinstall script)
- Portuguese documentation and UI text
- Vercel deployment with SPA routing, cache optimization, and security headers
- Firebase emulators available for local development
- Video notification system integrated with TV Dashboard
- Real-time Firestore updates with custom hooks
- 3D visualizations with Three.js and React Three Fiber
- Responsive design with Tailwind CSS and Shadcn/ui components