# Technology Stack

## Core Technologies
- **React 19** - Latest React with modern hooks and concurrent features
- **TypeScript** - Full type safety throughout the application
- **Vite** - Lightning fast build tool with HMR and SWC for Fast Refresh
- **Firebase v12** - Backend services (Auth, Firestore)

## UI & Styling
- **Tailwind CSS** - Utility-first CSS framework with custom design system
- **Shadcn/ui** - Accessible component library (New York style)
- **Radix UI** - Headless UI primitives for complex components
- **Lucide React** - Icon library
- **CSS Variables** - Design tokens for theming

## Development Tools
- **ESLint** - Code linting with TypeScript and React rules
- **PostCSS** - CSS processing with Autoprefixer
- **Firebase Emulators** - Local development environment

## Build System
- **Module Type**: ESM (ES Modules)
- **Path Aliases**: `@/*` maps to `./src/*`
- **Build Target**: Modern browsers with Vite optimization

## Common Commands

### Development
```bash
npm run dev                    # Start development server
npm run firebase:emulators     # Start Firebase emulators (recommended for local dev)
```

### Building & Testing
```bash
npm run build                  # TypeScript compilation + Vite build
npm run preview                # Preview production build locally
npm run lint                   # Run ESLint checks
```

### Firebase Operations
```bash
npm run firebase:deploy        # Deploy Firestore rules and indexes
```

## Development Workflow
1. Start Firebase emulators first: `npm run firebase:emulators`
2. In separate terminal, start dev server: `npm run dev`
3. Use emulator UI at http://localhost:4000 for Firebase debugging