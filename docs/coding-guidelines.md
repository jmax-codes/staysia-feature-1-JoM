# Coding Guidelines

## Core Principles

### 1. 200-Line Rule
**Every file MUST be ≤ 200 lines of code.**

If a file exceeds 200 lines:
- Split by responsibility into multiple files
- Keep public API unchanged using barrel exports (index.ts)
- Co-locate related files in the same folder

**Example:**
```typescript
// Before: PropertyManagementModals.tsx (886 lines)
// After:
// - components/modals/AddPropertyModal.tsx (150 lines)
// - components/modals/EditPropertyModal.tsx (140 lines)
// - components/modals/DeletePropertyModal.tsx (80 lines)
// - components/modals/index.ts (barrel export)
```

### 2. Documentation First
All exported functions, components, and hooks MUST have JSDoc/TSDoc documentation.

**Required elements:**
- One-sentence summary
- `@param` for each parameter with type and description
- `@returns` describing return value
- `@throws` for error conditions (if applicable)
- `@example` for complex functions

**Example:**
```typescript
/**
 * Formats a price amount with the selected currency.
 * 
 * @param amount - The price amount in IDR (base currency)
 * @param options - Formatting options
 * @returns Formatted price string with currency symbol
 * 
 * @example
 * formatPrice(1500000) // Returns "$95" if USD selected
 */
export const formatPrice = (amount: number, options?: FormatOptions): string => {
  // implementation
}
```

### 3. Type Safety
- Use TypeScript strict mode
- No `any` types (use `unknown` if necessary)
- Define interfaces for all props and data structures
- Export types alongside implementations

## File Organization

### Naming Conventions

**Files:**
- Components: `PascalCase.tsx` (e.g., `PropertyCard.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatPrice.ts`)
- Constants: `UPPER_SNAKE_CASE.ts` (e.g., `API_ENDPOINTS.ts`)
- Types: `PascalCase.types.ts` (e.g., `Property.types.ts`)

**Variables/Functions:**
- Variables: `camelCase` (e.g., `userData`, `isLoading`)
- Functions: `camelCase` (e.g., `fetchProperties`, `handleSubmit`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_UPLOAD_SIZE`)
- Types/Interfaces: `PascalCase` (e.g., `Property`, `User`)

### Folder Structure

```
src/
├── app/                    # Pages (default exports)
│   ├── api/               # API routes
│   └── [feature]/         # Feature pages
├── components/            # Components (named exports)
│   ├── ui/               # Shadcn UI components
│   ├── [feature]/        # Feature-specific components
│   └── shared/           # Shared components
├── lib/                   # Utilities (named exports)
│   ├── utils/            # Helper functions
│   ├── hooks/            # Custom hooks
│   └── services/         # API services
├── contexts/             # React contexts
├── types/                # Shared TypeScript types
└── constants/            # App-wide constants
```

## Component Guidelines

### Component Structure
```typescript
/**
 * Component description.
 * 
 * @component
 * @param props - Component props
 * @returns Rendered component
 */
export const ComponentName = ({ prop1, prop2 }: ComponentProps) => {
  // 1. Hooks (in order: Context, State, Effects, Custom)
  const { t } = useTranslation();
  const [state, setState] = useState();
  useEffect(() => {}, []);
  
  // 2. Event handlers
  const handleClick = () => {};
  
  // 3. Computed values
  const computedValue = useMemo(() => {}, []);
  
  // 4. Early returns (loading, error states)
  if (isLoading) return <Spinner />;
  
  // 5. Main render
  return <div>...</div>;
};
```

### Export Conventions
- **Pages:** Default export
- **Components:** Named export
- **Utilities:** Named export
- **Types:** Named export

```typescript
// ✅ Correct - Component (named export)
export const PropertyCard = () => { ... }

// ✅ Correct - Page (default export)
export default function PropertyDetailPage() { ... }

// ❌ Wrong - Page with named export
export const PropertyDetailPage = () => { ... }
```

### Props Interface
Always define props as an interface:
```typescript
interface PropertyCardProps {
  property: Property;
  onFavorite?: (id: number) => void;
  showActions?: boolean;
}

export const PropertyCard = ({ property, onFavorite, showActions = true }: PropertyCardProps) => {
  // implementation
}
```

## Function Guidelines

### Pure Functions
Prefer pure functions for utilities:
```typescript
// ✅ Pure function
export const calculateTotal = (items: Item[]): number => {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ❌ Impure function (side effects)
export const calculateTotal = (items: Item[]): number => {
  console.log(items); // Side effect
  apiCall(); // Side effect
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

### Async/Await
Use async/await instead of .then():
```typescript
// ✅ Async/await
const fetchData = async () => {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// ❌ Promise chains
const fetchData = () => {
  return fetch('/api/data')
    .then(res => res.json())
    .catch(err => console.error(err));
}
```

### Error Handling
Always handle errors explicitly:
```typescript
try {
  const result = await riskyOperation();
  return { success: true, data: result };
} catch (error) {
  console.error('Operation failed:', error);
  return { success: false, error: error.message };
}
```

## API Route Guidelines

### Structure
```typescript
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET handler description.
 * 
 * @param request - Next.js request object
 * @returns JSON response with data or error
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Authentication check (if needed)
    const token = request.headers.get('authorization');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // 2. Parse query params
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    // 3. Validate inputs
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }
    
    // 4. Business logic
    const data = await fetchDataFromDB(id);
    
    // 5. Return response
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Response Format
Consistent JSON structure:
```typescript
// Success
{ data: T, meta?: { total, page, limit } }

// Error
{ error: string, details?: any }
```

## State Management

### Context Pattern
```typescript
interface ContextValue {
  state: State;
  actions: {
    action1: () => void;
    action2: (param: string) => void;
  };
}

const Context = createContext<ContextValue | undefined>(undefined);

export const Provider = ({ children }) => {
  const [state, setState] = useState<State>(initialState);
  
  const actions = {
    action1: () => { /* ... */ },
    action2: (param) => { /* ... */ },
  };
  
  return (
    <Context.Provider value={{ state, actions }}>
      {children}
    </Context.Provider>
  );
};

export const useContext = () => {
  const context = useContext(Context);
  if (!context) throw new Error('useContext must be used within Provider');
  return context;
};
```

## Testing Guidelines

### Unit Tests
Test pure functions and utilities:
```typescript
import { describe, it, expect } from 'vitest';
import { calculateTotal } from './pricing';

describe('calculateTotal', () => {
  it('should calculate sum of item prices', () => {
    const items = [
      { price: 100 },
      { price: 200 },
    ];
    expect(calculateTotal(items)).toBe(300);
  });
  
  it('should return 0 for empty array', () => {
    expect(calculateTotal([])).toBe(0);
  });
});
```

### Component Tests
Test user interactions and rendering:
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { PropertyCard } from './PropertyCard';

describe('PropertyCard', () => {
  it('should render property name', () => {
    const property = { id: 1, name: 'Test Property' };
    render(<PropertyCard property={property} />);
    expect(screen.getByText('Test Property')).toBeInTheDocument();
  });
  
  it('should call onFavorite when clicked', () => {
    const onFavorite = vi.fn();
    const property = { id: 1, name: 'Test' };
    render(<PropertyCard property={property} onFavorite={onFavorite} />);
    
    fireEvent.click(screen.getByRole('button', { name: /favorite/i }));
    expect(onFavorite).toHaveBeenCalledWith(1);
  });
});
```

## Best Practices

### 1. Avoid Magic Numbers
```typescript
// ❌ Magic number
if (users.length > 10) { ... }

// ✅ Named constant
const MAX_USERS_PER_PAGE = 10;
if (users.length > MAX_USERS_PER_PAGE) { ... }
```

### 2. Early Returns
```typescript
// ✅ Early return
const processUser = (user?: User) => {
  if (!user) return null;
  if (!user.isActive) return null;
  
  return user.name.toUpperCase();
}

// ❌ Nested conditions
const processUser = (user?: User) => {
  if (user) {
    if (user.isActive) {
      return user.name.toUpperCase();
    }
  }
  return null;
}
```

### 3. Meaningful Names
```typescript
// ✅ Meaningful names
const activeUsers = users.filter(u => u.isActive);
const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

// ❌ Unclear names
const temp = users.filter(u => u.isActive);
const data1 = orders.reduce((sum, order) => sum + order.total, 0);
```

### 4. Single Responsibility
Each function should do ONE thing:
```typescript
// ✅ Single responsibility
const validateEmail = (email: string): boolean => { ... }
const sendEmail = (to: string, subject: string, body: string): Promise<void> => { ... }

// ❌ Multiple responsibilities
const validateAndSendEmail = (email: string, subject: string, body: string) => {
  if (!isValidEmail(email)) return false;
  sendEmail(email, subject, body);
  logEmailSent(email);
  updateUserStats(email);
}
```

### 5. Immutability
Prefer immutable operations:
```typescript
// ✅ Immutable
const updatedUsers = users.map(u => u.id === id ? { ...u, name: newName } : u);

// ❌ Mutation
users.forEach(u => {
  if (u.id === id) u.name = newName;
});
```

## Code Review Checklist

Before submitting code:
- [ ] All files ≤ 200 lines
- [ ] All exports have JSDoc documentation
- [ ] No `any` types used
- [ ] Tests added for new features
- [ ] Error handling implemented
- [ ] TypeScript strict mode passes
- [ ] ESLint passes with no warnings
- [ ] Code formatted with Prettier
- [ ] No console.logs in production code
- [ ] Meaningful variable/function names
- [ ] Early returns for guard clauses

## Performance Guidelines

### 1. Memoization
Use React.memo, useMemo, useCallback appropriately:
```typescript
// Expensive component
export const ExpensiveComponent = React.memo(({ data }) => {
  // Only re-renders when data changes
});

// Expensive calculation
const sortedData = useMemo(() => {
  return data.sort((a, b) => a.value - b.value);
}, [data]);

// Callback for child component
const handleClick = useCallback(() => {
  doSomething();
}, [dependencies]);
```

### 2. Lazy Loading
Load components on demand:
```typescript
const HeavyComponent = lazy(() => import('./HeavyComponent'));

<Suspense fallback={<Spinner />}>
  <HeavyComponent />
</Suspense>
```

### 3. Image Optimization
Always use Next.js Image component:
```typescript
import Image from 'next/image';

<Image
  src="/property.jpg"
  alt="Property"
  width={800}
  height={600}
  placeholder="blur"
/>
```

## Accessibility

### 1. Semantic HTML
```typescript
// ✅ Semantic
<button onClick={handleClick}>Submit</button>

// ❌ Non-semantic
<div onClick={handleClick}>Submit</div>
```

### 2. ARIA Labels
```typescript
<button aria-label="Add to favorites">
  <HeartIcon />
</button>
```

### 3. Keyboard Navigation
Ensure all interactive elements are keyboard accessible.

## Security

### 1. Input Validation
Always validate and sanitize inputs:
```typescript
const sanitizeInput = (input: string): string => {
  return input.trim().replace(/<script>/gi, '');
}
```

### 2. Environment Variables
Never expose secrets in client code:
```typescript
// ✅ Server-side only
const apiKey = process.env.EXCHANGE_RATE_API_KEY;

// ❌ Client-exposed
const publicKey = process.env.NEXT_PUBLIC_API_KEY; // Only for public keys
```

### 3. SQL Injection Prevention
Use Prisma or parameterized queries, never string concatenation.

---

**Remember:** Clean code is not just about working code—it's about maintainable, readable, and scalable code that other developers (including future you) can understand and modify easily.
