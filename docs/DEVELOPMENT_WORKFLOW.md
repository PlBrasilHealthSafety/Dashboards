# Development Workflow

This guide outlines the recommended development workflow for the React + Firebase dashboard application.

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm package manager
- Firebase account and project
- Git for version control

### Initial Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Copy environment variables: `cp .env.example .env`
4. Configure Firebase credentials in `.env`
5. Start Firebase emulators: `npm run firebase:emulators`
6. Start development server: `npm run dev`

## Development Environment

### Recommended Development Flow
1. **Start Firebase Emulators First**
   ```bash
   npm run firebase:emulators
   ```
   - Provides local Firebase services
   - Accessible at http://localhost:4000
   - Includes Auth and Firestore emulators

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   - Runs on http://localhost:3000
   - Hot module replacement enabled
   - TypeScript compilation in watch mode

### Key Development Commands
```bash
# Development
npm run dev              # Start dev server
npm run dev:host         # Start dev server accessible on network

# Code Quality
npm run lint             # Check for linting errors
npm run lint:fix         # Auto-fix linting errors
npm run type-check       # TypeScript type checking

# Building
npm run build            # Production build
npm run preview          # Preview production build

# Firebase
npm run firebase:emulators  # Start local emulators
npm run firebase:deploy     # Deploy rules and indexes
```

## Project Structure Guidelines

### File Organization
- **Components**: Organized by purpose (ui, custom, layout, examples)
- **Pages**: Top-level route components
- **Hooks**: Reusable logic extraction
- **Lib**: Utilities, services, and configurations
- **Types**: Centralized TypeScript definitions

### Naming Conventions
- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useAuth.ts`)
- **Utilities**: kebab-case (e.g., `firebase-utils.ts`)
- **Types**: PascalCase for interfaces, camelCase for types

### Import Conventions
```typescript
// External libraries first
import React from 'react'
import { useForm } from 'react-hook-form'

// Internal imports with @ alias
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import type { User } from '@/lib/types'
```

## Code Quality Standards

### TypeScript
- Use strict TypeScript configuration
- Define proper types for all props and functions
- Avoid `any` type usage
- Use type imports when possible

### ESLint Configuration
- React and TypeScript rules enabled
- Automatic formatting on save
- Import order enforcement
- Unused variable detection

### Component Best Practices
- Use functional components with hooks
- Extract custom logic into hooks
- Keep components focused and single-purpose
- Use proper prop typing with interfaces

## Testing Strategy

### Current Setup
- No testing framework configured yet
- Placeholder test script in package.json
- Firebase emulators for integration testing

### Recommended Testing Approach
1. **Unit Tests**: Component logic and utilities
2. **Integration Tests**: Firebase operations
3. **E2E Tests**: Critical user flows
4. **Visual Tests**: Component rendering

## Firebase Development

### Local Development
- Always use Firebase emulators for development
- Emulator data persists between sessions
- Use emulator UI for debugging at http://localhost:4000

### Firestore Rules Testing
- Test security rules in emulator environment
- Use Firebase CLI for rules deployment
- Validate rules before production deployment

### Authentication Flow
- Test with emulator auth users
- Verify protected routes functionality
- Test user profile management

### Video Notification Testing
- Ensure `novo-contrato-video.mp4` is in `public/` directory
- Test video playback in different browsers
- Verify overlay functionality in TV Dashboard
- Test video controls and accessibility features

## Build and Deployment

### Build Process
1. TypeScript compilation
2. Vite bundling with optimizations
3. Asset optimization and chunking
4. Source map generation (development only)

### Deployment Checklist
1. Run type checking: `npm run type-check`
2. Run linting: `npm run lint`
3. Test build locally: `npm run build && npm run preview`
4. Deploy Firebase rules: `npm run firebase:deploy`
5. Deploy to Vercel: `npm run vercel:deploy`

## Performance Optimization

### Bundle Optimization
- Manual chunks for vendor libraries
- Tree shaking enabled
- Dynamic imports for route-based code splitting
- Asset optimization with Vite

### Runtime Performance
- React 19 concurrent features
- Optimized re-renders with proper dependencies
- Lazy loading for non-critical components
- Efficient Firebase queries

## Troubleshooting

### Common Issues
1. **Firebase Connection**: Check emulator status and environment variables
2. **Build Errors**: Verify TypeScript types and imports
3. **Styling Issues**: Check Tailwind configuration and CSS variables
4. **Performance**: Use React DevTools and browser profiling
5. **Video Playback**: Check video file format, codec compatibility, and browser support
6. **Asset Loading**: Verify files exist in `public/` directory and are accessible

### Debug Tools
- React Developer Tools
- Firebase Emulator UI
- Vite dev server logs
- Browser developer tools