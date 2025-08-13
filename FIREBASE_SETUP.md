# Firebase Setup Guide

This guide will help you set up Firebase for this project.

## Prerequisites

- A Google account
- Node.js and npm installed

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project console, click on "Authentication" in the left sidebar
2. Click on "Get started"
3. Go to the "Sign-in method" tab
4. Enable the sign-in providers you want to use (e.g., Email/Password)

## Step 3: Create Firestore Database

1. In your Firebase project console, click on "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" for development (you can change security rules later)
4. Select a location for your database
5. Click "Done"

## Step 4: Get Firebase Configuration

1. In your Firebase project console, click on the gear icon (Project settings)
2. Scroll down to "Your apps" section
3. Click on the web icon (`</>`) to add a web app
4. Enter an app nickname
5. Click "Register app"
6. Copy the Firebase configuration object

## Step 5: Configure Environment Variables

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Replace the placeholder values in `.env` with your actual Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_actual_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_actual_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_actual_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_actual_app_id
   ```

## Step 6: Test the Configuration

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Check the browser console for any Firebase connection errors
3. The Firebase services should now be available in your application

## Security Notes

- Never commit your `.env` file to version control
- Use Firebase Security Rules to protect your Firestore database in production
- Consider using Firebase App Check for additional security

## Available Firebase Services

This project is configured with:
- **Firebase Authentication**: User authentication and management
- **Cloud Firestore**: NoSQL document database
- **Firebase SDK**: JavaScript SDK for web applications

## Utility Functions

The project includes utility functions in `src/lib/firebase-utils.ts` for common Firebase operations:
- User authentication (sign up, sign in, sign out)
- Firestore CRUD operations
- Query helpers

## TypeScript Support

TypeScript types for Firebase are defined in `src/lib/types.ts` for better development experience and type safety.