# React + Vite + Firebase Stack

A modern React application built with Vite, TypeScript, Tailwind CSS, Shadcn/ui components, and Firebase backend services.

## Features

- ⚡ **Vite** - Lightning fast build tool with HMR
- ⚛️ **React 19** - Latest React with modern hooks
- 🔷 **TypeScript** - Full type safety
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🧩 **Shadcn/ui** - Beautiful, accessible UI components
- 🔥 **Firebase Auth** - User authentication system
- 📊 **Firestore** - Real-time NoSQL database
- 🪝 **Custom Hooks** - Reusable logic for Firebase operations

## Quick Start

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Firebase:**
   - Follow the [Firebase Setup Guide](./docs/FIREBASE_SETUP.md)
   - Configure your `.env` file with Firebase credentials

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Optional - Start Firebase emulators:**
   ```bash
   npm run firebase:emulators
   ```

## Documentation

- 📚 **[Setup Guides](./docs/)** - Complete setup documentation
- 🔥 **[Firebase Setup](./docs/FIREBASE_SETUP.md)** - Firebase project configuration
- 📊 **[Firestore Setup](./docs/FIRESTORE_SETUP.md)** - Database setup and usage
- 🧪 **[Testing](./tests/)** - Test utilities and examples

## Project Structure

```
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Shadcn/ui components
│   │   ├── custom/         # Custom components
│   │   └── examples/       # Example/demo components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities and services
│   └── App.tsx             # Main application
├── docs/                   # Documentation
├── tests/                  # Test utilities
├── firestore.rules         # Firestore security rules
├── firebase.json           # Firebase configuration
└── .env                    # Environment variables (create this)
```

## Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
npm run firebase:emulators    # Start Firebase emulators
npm run firebase:deploy       # Deploy Firestore rules and indexes
```

## Key Technologies

- **[@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc)** - Uses SWC for Fast Refresh
- **[Firebase v10](https://firebase.google.com/)** - Backend services
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling
- **[Shadcn/ui](https://ui.shadcn.com/)** - Component library

## Development Workflow

### 1. Local Development with Emulators (Recommended)
```bash
# Terminal 1: Start Firebase emulators
npm run firebase:emulators

# Terminal 2: Start development server
npm run dev
```

### 2. Production Testing
Test with actual Firebase services before deploying.

### 3. Deployment
```bash
# Build the application
npm run build

# Deploy Firestore rules and indexes
npm run firebase:deploy
```

## Authentication Flow

The app includes a complete authentication system:
- User registration and login
- Protected routes
- User profile management
- Automatic authentication state management

## Firestore Database

Pre-configured with:
- Security rules for data protection
- Real-time data synchronization
- CRUD operations with TypeScript
- Custom hooks for easy data management

## Contributing

1. Follow the setup guides in the `docs/` directory
2. Use the provided TypeScript types
3. Test with Firebase emulators during development
4. Update documentation when adding new features

## License

This project is open source and available under the [MIT License](LICENSE).
