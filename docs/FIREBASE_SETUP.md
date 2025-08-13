# Firebase Setup Guide

This comprehensive guide walks you through setting up Firebase Authentication and Firestore Database for this React application.

## Prerequisites

- Node.js and npm installed
- A Google account
- Firebase CLI installed globally: `npm install -g firebase-tools`

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name (e.g., "my-react-app")
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Save changes

## Step 3: Enable Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (we'll configure rules later)
4. Select a location for your database
5. Click "Done"

## Step 4: Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Web" icon (</>) to add a web app
4. Register your app with a nickname
5. Copy the Firebase configuration object

## Step 5: Configure Environment Variables

1. Copy the `.env.example` file to `.env` (if it exists):
   ```bash
   cp .env.example .env
   ```

2. Create a `.env` file in your project root with your Firebase config:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

**Important**: Never commit your `.env` file to version control!

## Step 6: Initialize Firebase in Your Project

1. Login to Firebase CLI: `firebase login`
2. Initialize Firebase: `firebase init`
3. Select "Firestore" and "Emulators"
4. Choose your existing project
5. Accept default files for Firestore rules and indexes
6. Configure emulators (Authentication: port 9099, Firestore: port 8080)

## Step 7: Deploy Security Rules

Deploy the Firestore security rules:
```bash
firebase deploy --only firestore:rules,firestore:indexes
```

## Step 8: Test Your Setup

1. Start the development server: `npm run dev`
2. Try registering a new user
3. Test Firestore operations in the example component

## Development Workflow

### Using Emulators (Recommended for Development)
```bash
# Start Firebase emulators
npm run firebase:emulators

# In another terminal, start your app
npm run dev
```

### Production Testing
Make sure to test with the actual Firebase services before deploying to production.

## Security Rules Overview

The included `firestore.rules` file provides:
- User data isolation (users can only access their own data)
- Authentication requirements for all operations
- Proper access control for posts, comments, and categories

## Troubleshooting

### Common Issues:

1. **"Firebase: Error (auth/configuration-not-found)"**
   - Check your `.env` file has all required variables
   - Ensure variable names start with `VITE_`

2. **"Missing or insufficient permissions"**
   - Deploy your Firestore security rules
   - Check that user is authenticated

3. **"Failed to get document because the client is offline"**
   - Check internet connection
   - Verify Firebase project is active

4. **Emulator connection issues**
   - Ensure emulators are running on correct ports
   - Check firewall settings

### Debug Tips:

- Check browser console for detailed error messages
- Use Firebase Console to monitor authentication and database activity
- Enable Firebase debug logging in development

## Next Steps

- Customize Firestore security rules for your specific needs
- Set up additional Firebase services (Storage, Functions, etc.)
- Configure production environment variables
- Set up CI/CD pipeline for automated deployments

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
##
 Available Firebase Services

This project is configured with:
- **Firebase Authentication**: User authentication and management
- **Cloud Firestore**: NoSQL document database for real-time data
- **Firebase SDK**: JavaScript SDK for web applications

## Utility Functions

The project includes utility functions in `src/lib/firebase-utils.ts` for common Firebase operations:
- User authentication (sign up, sign in, sign out)
- Firestore CRUD operations
- Query helpers and real-time listeners

## TypeScript Support

TypeScript types for Firebase are defined throughout the project for better development experience and type safety:
- `src/lib/types.ts` - General types
- `src/lib/firestore-models.ts` - Firestore data models
- Custom hooks with proper typing in `src/hooks/`

## Project Structure

```
├── src/
│   ├── lib/
│   │   ├── firebase.ts              # Firebase initialization
│   │   ├── firebase-utils.ts        # Authentication utilities
│   │   ├── firestore-services.ts    # Generic CRUD service
│   │   ├── firestore-collections.ts # Collection-specific services
│   │   └── firestore-models.ts      # TypeScript interfaces
│   ├── hooks/
│   │   ├── useAuth.ts              # Authentication hooks
│   │   └── useFirestore.ts         # Firestore data hooks
│   └── components/
│       ├── custom/                 # Authentication components
│       └── examples/               # Example components
├── tests/
│   └── firestore-test.ts          # Firestore testing utilities
├── docs/                          # Documentation
├── firestore.rules                # Security rules
├── firestore.indexes.json         # Database indexes
└── firebase.json                  # Firebase configuration
```