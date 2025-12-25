# Design Document: Wishlist Feature

## Overview

This design document outlines the implementation of a centralized wishlist management system and dedicated wishlist page for the Athenas e-commerce platform. The solution uses a React Context with a custom hook pattern to provide consistent wishlist operations across all components, along with updates to the data layer to match the current Product model schema.

## Architecture

The wishlist feature follows a layered architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ WishlistPage│  │ ProductCard │  │ ProductsClient      │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
│         │                │                     │             │
│         └────────────────┼─────────────────────┘             │
│                          │                                   │
│                          ▼                                   │
│              ┌───────────────────────┐                       │
│              │   useWishlist Hook    │                       │
│              └───────────┬───────────┘                       │
│                          │                                   │
│                          ▼                                   │
│              ┌───────────────────────┐                       │
│              │  WishlistContext      │                       │
│              └───────────┬───────────┘                       │
└──────────────────────────┼──────────────────────────────────┘
                           │
┌──────────────────────────┼──────────────────────────────────┐
│                    Storage Layer                             │
│                          ▼                                   │
│              ┌───────────────────────┐                       │
│              │    localStorage       │                       │
│              └───────────────────────┘                       │
└─────────────────────────────────────────────────────────────┘
```

### Key Design Decisions

1. **React Context + Hook Pattern**: Provides global state management without external dependencies, keeping the solution lightweight and Next.js-friendly.

2. **localStorage for Persistence**: Simple client-side persistence that works without authentication. Wishlist data persists across browser sessions.

3. **Provider at Locale Layout Level**: The WishlistProvider wraps the application at the locale layout level, ensuring all pages have access to wishlist state.

4. **Optimistic Updates**: UI updates immediately on wishlist actions, with localStorage sync happening synchronously.

## Components and Interfaces

### WishlistContext and Provider

```typescript
// hooks/useWishlist.tsx

interface WishlistContextType {
  wishlist: string[]; // Array of product IDs
  addToWishlist: (productId: string) => void; // Add product to wishlist
  removeFromWishlist: (productId: string) => void; // Remove product from wishlist
  toggleWishlist: (productId: string) => void; // Toggle product in wishlist
  isInWishlist: (productId: string) => boolean; // Check if product is in wishlist
  wishlistCount: number; // Total items in wishlist
  clearWishlist: () => void; // Clear all items from wishlist
}
```

### WishlistProvider Component

```typescript
// Wraps children with wishlist context
// Handles localStorage initialization and persistence
// Provides all wishlist operations to descendants

interface WishlistProviderProps {
  children: React.ReactNode;
}
```

### Wishlist Page Component

```typescript
// app/[locale]/wishlist/page.tsx

// Server component that fetches product data for wishlist items
// Renders WishlistClient with product data

interface WishlistPageProps {
  params: Promise<{ locale: string }>;
}
```

### WishlistClient Component

```typescript
// components/wishlist/WishlistClient.tsx

// Client component that displays wishlist products
// Uses useWishlist hook for state management
// Handles empty state and product removal

interface WishlistClientProps {
  locale: string;
}
```

## Data Models

### Updated ProductData Interface

The ProductData interface must be updated to match the current Product model:

```typescript
// lib/data.ts

export interface ProductData {
  _id: string;
  slug: string;
  locale: string;
  name: string;
  description: string;
  category: string;
  image: string;
  gallery: string[];
  weight: string; // NEW: From Product model
  minOrder: string;
  grade: string; // NEW: From Product model
  featured: boolean;
  new: boolean;
  active: boolean;
}

// REMOVED fields:
// - price: number
// - priceUnit: string
// - specifications: { packaging, shelfLife, storage, origin }
// - certifications: string[]
```

### Wishlist Storage Format

```typescript
// localStorage key: "athenas-wishlist"
// Value: JSON stringified array of product IDs

type WishlistStorage = string[]; // e.g., ["product-id-1", "product-id-2"]
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Add then contains

_For any_ product ID and any initial wishlist state, adding that product ID to the wishlist should result in `isInWishlist(productId)` returning true.

**Validates: Requirements 1.1, 1.3**

### Property 2: Remove then not contains

_For any_ product ID that exists in the wishlist, removing that product ID should result in `isInWishlist(productId)` returning false.

**Validates: Requirements 1.2, 1.3**

### Property 3: Toggle idempotence (double toggle)

_For any_ product ID and any initial wishlist state, toggling the wishlist twice for the same product should return the wishlist to its original state with respect to that product.

**Validates: Requirements 1.1, 1.2**

### Property 4: Wishlist count consistency

_For any_ wishlist state, the `wishlistCount` value should equal the length of the `wishlist` array.

**Validates: Requirements 1.4, 1.5**

### Property 5: localStorage round-trip

_For any_ valid wishlist state (array of product IDs), persisting to localStorage and then loading should produce an equivalent wishlist array.

**Validates: Requirements 1.6, 1.7, 1.8**

### Property 6: Add uniqueness (no duplicates)

_For any_ product ID that already exists in the wishlist, adding it again should not change the wishlist length or create duplicates.

**Validates: Requirements 1.1, 1.4**

## Error Handling

### localStorage Unavailable

- **Detection**: Check for localStorage availability on initialization
- **Fallback**: Use in-memory state only; wishlist won't persist across sessions
- **User Impact**: Wishlist works during session but resets on page refresh

### Invalid localStorage Data

- **Detection**: JSON parse errors or invalid data structure
- **Recovery**: Clear corrupted data and initialize with empty wishlist
- **Logging**: Console warning for debugging purposes

### Product Not Found

- **Scenario**: Wishlist contains ID for deleted/inactive product
- **Handling**: Filter out invalid products when displaying wishlist page
- **User Feedback**: Show only valid products; no error message needed

## Testing Strategy

### Unit Tests

Unit tests will verify specific examples and edge cases:

1. **Wishlist Hook Tests**

   - Adding a product to empty wishlist
   - Removing a product from wishlist
   - Toggle behavior for products in/not in wishlist
   - Clear wishlist functionality
   - Initial state from localStorage

2. **Component Tests**
   - WishlistClient renders products correctly
   - Empty state displays when wishlist is empty
   - Remove button triggers correct callback

### Property-Based Tests

Property-based tests will verify universal properties across all inputs using a testing library like fast-check:

1. **Property 1**: Add then contains - verify adding any product ID results in it being in the wishlist
2. **Property 2**: Remove then not contains - verify removing any product ID results in it not being in the wishlist
3. **Property 3**: Toggle idempotence - verify double toggle returns to original state
4. **Property 4**: Count consistency - verify count always equals array length
5. **Property 5**: localStorage round-trip - verify persist/load cycle preserves data
6. **Property 6**: Add uniqueness - verify no duplicates are created

**Configuration**:

- Minimum 100 iterations per property test
- Use fast-check for TypeScript property-based testing
- Each test tagged with: **Feature: wishlist-feature, Property {number}: {property_text}**

### Integration Tests

1. **Full Flow Test**: Add product → Navigate to wishlist → Verify product appears → Remove → Verify empty state
2. **Persistence Test**: Add products → Refresh page → Verify products still in wishlist
3. **Cross-Component Test**: Add from ProductCard → Verify in ProductsClient → Verify on WishlistPage
