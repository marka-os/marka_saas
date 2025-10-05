# School Store Documentation

## Overview

The School Store is a production-ready, Zustand-based state management solution for managing a single school per tenant/admin. This implementation enforces the constraint that each account can only have one school.

## Architecture

### Core Components

1. **School Store** (`school-store.ts`) - Main Zustand store with middleware
2. **School Actions Hook** (`use-school-actions.ts`) - Custom hooks for actions
3. **School Provider** (`school-provider.tsx`) - App-level initialization
4. **Schools Page** (`schools.tsx`) - UI implementation

### Features

- ✅ **Single School Per Tenant**: Enforces one school per account
- ✅ **Optimistic Updates**: Instant UI updates with automatic rollback on errors
- ✅ **Comprehensive Validation**: Built-in data validation
- ✅ **Error Handling**: Robust error handling and recovery
- ✅ **Persistence**: LocalStorage persistence with Zustand persist middleware
- ✅ **DevTools Integration**: Redux DevTools support for debugging
- ✅ **TypeScript**: Full type safety
- ✅ **Testing**: Comprehensive test suite included
- ✅ **Auto-sync**: Optional automatic data synchronization
- ✅ **Loading States**: Detailed loading and sync status tracking

## Installation

```bash
npm install zustand immer
```

## File Structure

```
src/
├── stores/
│   └── school-store.ts          # Main Zustand store
├── hooks/
│   └── use-school-actions.ts    # Custom hooks for school actions
├── providers/
│   └── school-provider.tsx      # Provider component
├── pages/
│   └── schools.tsx              # Schools management page
├── components/
│   └── forms/
│       └── school-form.tsx      # Multi-step school form
└── __tests__/
    └── school-store.test.ts     # Comprehensive tests
```

## Usage

### 1. Setup the Provider

Wrap your app with the `SchoolProvider`:

```tsx
import { SchoolProvider } from '@marka/providers/school-provider';

function App() {
  return (
    <SchoolProvider
      autoFetch={true}
      refreshInterval={300000} // 5 minutes
      onSchoolLoaded={() => console.log('School loaded')}
      onSchoolError={(error) => console.error(error)}
    >
      <YourApp />
    </SchoolProvider>
  );
}
```

### 2. Access School Data

```tsx
import { useSchool, useSchoolLoading, useSchoolError } from '@marka/stores/school-store';

function MyComponent() {
  const school = useSchool();
  const isLoading = useSchoolLoading();
  const error = useSchoolError();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!school) return <NoSchoolState />;

  return <div>{school.name}</div>;
}
```

### 3. Perform Actions

```tsx
import { useSchoolActions } from '@marka/hooks/use-school-actions';

function SchoolSettings() {
  const { updateSchool } = useSchoolActions();

  const handleUpdate = async (data) => {
    await updateSchool(data, {
      onSuccess: () => toast.success('Updated!'),
      onError: (error) => toast.error(error.message),
    });
  };

  return <SchoolForm onSubmit={handleUpdate} />;
}
```

### 4. Check Capabilities

```tsx
import { useCanCreateSchool, useHasSchool } from '@marka/stores/school-store';

function CreateSchoolButton() {
  const canCreate = useCanCreateSchool();
  const hasSchool = useHasSchool();

  if (hasSchool) {
    return <p>You already have a school (limit: 1 per account)</p>;
  }

  return <Button disabled={!canCreate}>Create School</Button>;
}
```

## API Reference

### Store Selectors

```typescript
// Direct selectors
const school = useSchool();                 // Get school data
const isLoading = useSchoolLoading();       // Get loading state
const error = useSchoolError();             // Get error state
const hasSchool = useHasSchool();           // Check if school exists
const canCreate = useCanCreateSchool();     // Check if can create school

// Full store access
const store = useSchoolStore();
```

### Actions Hook

```typescript
const {
  createSchool,      // Create new school
  updateSchool,      // Update existing school
  deleteSchool,      // Delete school
  refreshSchool,     // Refresh data from server
  initializeSchool,  // Initialize on mount
} = useSchoolActions();
```

### Metadata Hook

```typescript
const {
  lastFetchedAt,        // Timestamp of last fetch
  lastModifiedAt,       // Timestamp of last modification
  syncStatus,           // 'synced' | 'pending' | 'error'
  isInitialized,        // Whether store is initialized
  operationInProgress,  // Current operation details
} = useSchoolMetadata();
```

### Validation Hook

```typescript
const { validate } = useSchoolValidation();

const result = validate({ name: 'My School' });
if (!result.isValid) {
  console.error(result.errors);
}
```

### Capabilities Hook

```typescript
const {
  hasSchool,        // Boolean: school exists
  canCreateSchool,  // Boolean: can create new school
  schoolId,         // String | null: current school ID
} = useSchoolCapabilities();
```

## Store Actions

### createSchool

Creates a new school. Only one school per account is allowed.

```typescript
await createSchool(
  {
    name: 'My School',
    code: 'SCH001',
    level: 'o_level',
    email: 'contact@school.ug',
  },
  {
    onSuccess: () => console.log('Created!'),
    onError: (error) => console.error(error),
  }
);
```

**Constraints:**
- School name is required (min 3 chars)
- Cannot create if school already exists
- Validates all input data

### updateSchool

Updates existing school with optimistic updates.

```typescript
await updateSchool(
  {
    name: 'Updated Name',
    phone: '+256700000000',
  },
  {
    onSuccess: () => console.log('Updated!'),
    onError: (error) => console.error(error),
  }
);
```

**Features:**
- Optimistic UI updates
- Automatic rollback on error
- Validates update data
- Preserves unchanged fields

### deleteSchool

Deletes the school from the system.

```typescript
await deleteSchool({
  onSuccess: () => console.log('Deleted!'),
  onError: (error) => console.error(error),
});
```

**Behavior:**
- Removes school from state
- Allows creating a new school after deletion
- Restores school on error

### refreshSchool

Fetches latest school data from server.

```typescript
await refreshSchool({
  onSuccess: () => console.log('Refreshed!'),
  onError: (error) => console.error(error),
});
```

## Validation Rules

The store includes comprehensive validation:

### School Name
- **Required**: Yes
- **Min Length**: 3 characters
- **Max Length**: 200 characters

### Email
- **Required**: No
- **Format**: Valid email format

### Website
- **Required**: No
- **Format**: Valid URL (http:// or https://)

### Logo URL
- **Required**: No
- **Format**: Valid URL (http:// or https://)

### Phone
- **Required**: No
- **Max Length**: 20 characters

## State Structure

```typescript
interface SchoolState {
  // Core data
  school: School | null;
  
  // Loading states
  isLoading: boolean;
  isInitialized: boolean;
  
  // Error handling
  error: Error | null;
  
  // Operation tracking
  operationInProgress: {
    type: 'create' | 'update' | 'delete' | null;
    startedAt: number | null;
  };
  
  // Optimistic updates
  optimisticUpdate: {
    previousSchool: School | null;
    isActive: boolean;
  };
  
  // Metadata
  lastFetchedAt: number | null;
  lastModifiedAt: number | null;
  syncStatus: 'synced' | 'pending' | 'error';
}
```

## Error Handling

All actions include comprehensive error handling:

```typescript
try {
  await createSchool(data);
} catch (error) {
  if (error.message.includes('already exists')) {
    // Handle duplicate school
  } else if (error.message.includes('Validation failed')) {
    // Handle validation errors
  } else {
    // Handle other errors
  }
}
```

## Optimistic Updates

The store automatically handles optimistic updates:

1. **Apply Update**: UI updates immediately
2. **API Call**: Request sent to server
3. **Success**: Commit the update
4. **Error**: Automatic rollback to previous state

```typescript
// Optimistic update happens automatically
await updateSchool({ name: 'New Name' });
// UI updates instantly, rolls back if API fails
```

## Testing

Comprehensive test suite included:

```bash
npm test school-store.test.ts
```

**Test Coverage:**
- ✅ Initial state
- ✅ Fetch operations
- ✅ Create with constraints
- ✅ Update with optimistic updates
- ✅ Delete with rollback
- ✅ Validation rules
- ✅ Error handling
- ✅ State management
- ✅ Capability checks

## Best Practices

### 1. Always Use Hooks

```typescript
// ✅ Good
const { createSchool } = useSchoolActions();

// ❌ Avoid direct store access
const store = useSchoolStore();
store.createSchool(data);
```

### 2. Handle Errors

```typescript
// ✅ Good
await createSchool(data, {
  onSuccess: () => toast.success('Created!'),
  onError: (error) => toast.error(error.message),
});

// ❌ Don't ignore errors
await createSchool(data);
```

### 3. Validate Before Submission

```typescript
// ✅ Good
const { validate } = useSchoolValidation();
const result = validate(formData);
if (!result.isValid) {
  showErrors(result.errors);
  return;
}
await createSchool(formData);
```

### 4. Check Capabilities

```typescript
// ✅ Good
const canCreate = useCanCreateSchool();
if (!canCreate) {
  return <AlreadyHasSchoolMessage />;
}

// ❌ Don't assume
return <CreateSchoolForm />;
```

### 5. Use Provider for Initialization

```typescript
// ✅ Good - handles initialization automatically
<SchoolProvider autoFetch>
  <App />
</SchoolProvider>

// ❌ Manual initialization in every component
useEffect(() => {
  fetchSchool();
}, []);
```

## Troubleshooting

### School Not Loading

```typescript
// Check initialization status
const { isInitialized, error } = useSchoolMetadata();

if (!isInitialized) {
  // Still loading
}

if (error) {
  // Error occurred
  console.error(error);
}
```

### Multiple Schools Error

```typescript
// The store enforces single school constraint
// If you see this error, check:
1. Backend is returning single school
2. Not calling createSchool when school exists
3. Check canCreateSchool() before showing create UI
```

### Sync Issues

```typescript
// Check sync status
const { syncStatus } = useSchoolMetadata();

if (syncStatus === 'error') {
  // Refresh manually
  const { refreshSchool } = useSchoolActions();
  await refreshSchool();
}
```

## Performance Considerations

1. **Persistence**: Data persists in localStorage
2. **Selective Re-renders**: Uses granular selectors
3. **Optimistic Updates**: Instant UI feedback
4. **Debounced Updates**: Consider debouncing rapid updates
5. **Auto-refresh**: Configure appropriate interval (default: disabled)

## Migration Guide

If migrating from React Query:

```typescript
// Before (React Query)
const { data, isLoading } = useQuery(['school'], getSchools);

// After (Zustand Store)
const school = useSchool();
const isLoading = useSchoolLoading();
```

## Contributing

When adding new features:

1. Add actions to the store
2. Create hooks in `use-school-actions.ts`
3. Add tests to `school-store.test.ts`
4. Update this README
5. Add TypeScript types

