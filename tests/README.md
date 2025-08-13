# Tests Directory

This directory contains test utilities and test files for the application.

## Files

### `firestore-test.ts`
Utility functions for testing Firestore operations:
- `testFirestoreOperations()` - Comprehensive test suite for CRUD operations
- `initializeSampleData()` - Creates sample data for development/testing

## Usage

### Running Firestore Tests

The Firestore tests can be run through the UI component `FirestoreExample.tsx` or programmatically:

```typescript
import { testFirestoreOperations } from '../tests/firestore-test';

// Test with authenticated user
const success = await testFirestoreOperations(user.uid, user.email);
```

### Initializing Sample Data

```typescript
import { initializeSampleData } from '../tests/firestore-test';

// Create sample categories for development
await initializeSampleData();
```

## Test Coverage

The current test suite covers:
- ✅ Creating documents (categories, posts)
- ✅ Reading documents by ID
- ✅ Updating documents
- ✅ Querying documents with constraints
- ✅ Helper function operations (increment views/likes)
- ✅ Deleting documents
- ✅ Cleanup procedures

## Development Workflow

1. **Local Testing**: Use Firebase emulators for safe testing
   ```bash
   npm run firebase:emulators
   ```

2. **UI Testing**: Use the FirestoreExample component in the app

3. **Programmatic Testing**: Import test functions directly

## Future Enhancements

- [ ] Add unit tests with Jest/Vitest
- [ ] Add integration tests for authentication flow
- [ ] Add performance tests for large datasets
- [ ] Add error handling tests
- [ ] Add real-time listener tests