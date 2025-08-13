// Simple test to verify Firebase configuration
import { auth, db } from './firebase';

export const testFirebaseConnection = () => {
  console.log('Testing Firebase connection...');
  
  // Test Firebase Auth
  if (auth) {
    console.log('✅ Firebase Auth initialized successfully');
    console.log('Auth instance:', auth);
  } else {
    console.error('❌ Firebase Auth initialization failed');
  }
  
  // Test Firestore
  if (db) {
    console.log('✅ Firestore initialized successfully');
    console.log('Firestore instance:', db);
  } else {
    console.error('❌ Firestore initialization failed');
  }
  
  // Check environment variables
  const requiredEnvVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);
  
  if (missingVars.length === 0) {
    console.log('✅ All required environment variables are set');
  } else {
    console.warn('⚠️ Missing environment variables:', missingVars);
    console.warn('Please check your .env file and ensure all Firebase configuration variables are set');
  }
};