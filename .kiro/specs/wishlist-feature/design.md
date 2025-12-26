# Design Document: Wishlist Feature

## Overview

This design document outlines the implementation of an enhanced wishlist page that functions as a quote request/checkout experience for the Athenas e-commerce platform. The solution includes a centralized wishlist management system, a checkout-style page with product table, loading skeletons, a contact form modal, and an email service for quote requests.

## Architecture

The wishlist feature follows a layered architecture:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Presentation Layer                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐  │
│  │  WishlistPage   │  │ ContactFormModal│  │   LoadingSkeleton       │  │
│  │  (checkout UI)  │  │ (user info form)│  │   (placeholder UI)      │  │
│  └────────┬────────┘  └────────┬────────┘  └───────────┬─────────────┘  │
│           │                    │                       │                 │
│           └────────────────────┼───────────────────────┘                 │
│                                │                                         │
│                                ▼                                         │
│                    ┌───────────────────────┐                             │
│                    │   WishlistClient      │                             │
│                    │   (product table)     │                             │
│                    └───────────┬───────────┘                             │
│                                │                                         │
│                                ▼                                         │
│                    ┌───────────────────────┐                             │
│                    │   useWishlist Hook    │                             │
│                    └───────────┬───────────┘                             │
└────────────────────────────────┼────────────────────────────────────────┘
                                 │
┌────────────────────────────────┼────────────────────────────────────────┐
│                          API Layer                                       │
│                                ▼                                         │
│                    ┌───────────────────────┐                             │
│                    │  /api/quote-request   │                             │
│                    │  (email endpoint)     │                             │
│                    └───────────┬───────────┘                             │
│                                │                                         │
│                                ▼                                         │
│                    ┌───────────────────────┐                             │
│                    │    Email Service      │                             │
│                    │  (console → nodemailer)│                            │
│                    └───────────────────────┘                             │
└─────────────────────────────────────────────────────────────────────────┘
                                 │
┌────────────────────────────────┼────────────────────────────────────────┐
│                         Storage Layer                                    │
│                                ▼                                         │
│                    ┌───────────────────────┐                             │
│                    │    localStorage       │                             │
│                    └───────────────────────┘                             │
└─────────────────────────────────────────────────────────────────────────┘
```

### Key Design Decisions

1. **React Context + Hook Pattern**: Provides global state management without external dependencies.

2. **Table-Based Product Display**: Products shown in a clean table/list format for better checkout UX.

3. **Modal Form Pattern**: Contact form in a modal keeps the page clean and focused.

4. **Console Logging First**: Email service logs to console for development, structured for easy nodemailer integration.

5. **Suspense + Loading Skeleton**: React Suspense with skeleton components for smooth loading states.

## Components and Interfaces

### Loading Skeleton Component

```typescript
// components/wishlist/WishlistSkeleton.tsx

// Displays animated placeholder UI while page loads
// Matches the layout of the actual wishlist page
// Includes: header skeleton, table row skeletons, summary skeleton
```

### WishlistClient Component (Updated)

```typescript
// components/wishlist/WishlistClient.tsx

interface WishlistClientProps {
  products: ProductData[];
  locale: string;
}

// Displays products in a table format
// Includes: product image thumbnail, name, category, remove button
// Shows summary section with item count
// "Request Quote" button opens ContactFormModal
```

### Product Table Component

```typescript
// Embedded in WishlistClient

// Table columns:
// - Product (image + name)
// - Category
// - Actions (remove button)

// Responsive: collapses to list on mobile
```

### ContactFormModal Component

```typescript
// components/wishlist/ContactFormModal.tsx

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductData[];
  locale: string;
}

interface ContactFormData {
  fullName: string; // Required
  email: string; // Required, validated
  phone: string; // Required
  company: string; // Optional
  message: string; // Optional
}

// Modal with form fields
// Client-side validation
// Submits to /api/quote-request
// Shows loading, success, and error states
```

### Quote Request API Route

```typescript
// app/api/quote-request/route.ts

interface QuoteRequestBody {
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
    company?: string;
    message?: string;
  };
  products: Array<{
    id: string;
    name: string;
    category: string;
  }>;
  locale: string;
}

// POST handler
// Validates request body
// Calls email service
// Returns success/error response
```

### Email Service

```typescript
// lib/email.ts

interface EmailData {
  to: string;
  subject: string;
  customerInfo: ContactFormData;
  products: ProductInfo[];
}

// sendQuoteRequestEmail function
// Currently: logs formatted email to console
// Future: integrates with nodemailer
// Returns: { success: boolean, error?: string }
```

## Data Models

### ContactFormData Interface

```typescript
interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  message?: string;
}
```

### QuoteRequestPayload Interface

```typescript
interface QuoteRequestPayload {
  customerInfo: ContactFormData;
  products: Array<{
    id: string;
    name: string;
    category: string;
  }>;
  locale: string;
  timestamp: string;
}
```

### ProductData Interface (Existing)

```typescript
export interface ProductData {
  _id: string;
  slug: string;
  locale: string;
  name: string;
  description: string;
  category: string;
  image: string;
  gallery: string[];
  weight: string;
  minOrder: string;
  grade: string;
  featured: boolean;
  new: boolean;
  active: boolean;
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Add then contains

_For any_ product ID and any initial wishlist state, adding that product ID to the wishlist should result in `isInWishlist(productId)` returning true.

**Validates: Requirements 1.1, 1.3**

### Property 2: Remove then not contains

_For any_ product ID that exists in the wishlist, removing that product ID should result in `isInWishlist(productId)` returning false.

**Validates: Requirements 1.2, 1.3**

### Property 3: Wishlist count consistency

_For any_ wishlist state, the `wishlistCount` value should equal the length of the `wishlist` array.

**Validates: Requirements 1.4, 1.5**

### Property 4: localStorage round-trip

_For any_ valid wishlist state (array of product IDs), persisting to localStorage and then loading should produce an equivalent wishlist array.

**Validates: Requirements 1.6, 1.7, 1.8**

### Property 5: Form validation blocks submission

_For any_ contact form state where any required field (fullName, email, phone) is empty or invalid, form submission should be prevented.

**Validates: Requirements 4.4**

### Property 6: Email content completeness

_For any_ valid quote request with customer info and products, the generated email content should contain all customer fields (name, email, phone, and optional company/message if provided) and all product names and categories.

**Validates: Requirements 5.1, 5.2, 5.3**

### Property 7: Product table row completeness

_For any_ product in the wishlist, the rendered table row should contain the product image, name, category, and a remove action.

**Validates: Requirements 2.3**

## Error Handling

### localStorage Unavailable

- **Detection**: Check for localStorage availability on initialization
- **Fallback**: Use in-memory state only; wishlist won't persist across sessions
- **User Impact**: Wishlist works during session but resets on page refresh

### Invalid localStorage Data

- **Detection**: JSON parse errors or invalid data structure
- **Recovery**: Clear corrupted data and initialize with empty wishlist
- **Logging**: Console warning for debugging purposes

### Form Validation Errors

- **Detection**: Client-side validation on blur and submit
- **Display**: Inline error messages below each invalid field
- **Recovery**: User corrects fields and resubmits

### API Request Failures

- **Detection**: Non-2xx response or network error
- **Display**: Error message in modal with retry option
- **Recovery**: User can retry submission or close modal

### Email Service Failures

- **Detection**: Exception during email processing
- **Response**: Return error status to client
- **Logging**: Log error details to console for debugging

## Testing Strategy

### Unit Tests

Unit tests will verify specific examples and edge cases:

1. **Wishlist Hook Tests**

   - Adding a product to empty wishlist
   - Removing a product from wishlist
   - Initial state from localStorage
   - Empty localStorage handling

2. **Component Tests**

   - WishlistClient renders product table correctly
   - Empty state displays when wishlist is empty
   - Loading skeleton renders placeholder elements
   - ContactFormModal opens and closes correctly
   - Form validation displays errors

3. **API Tests**
   - Quote request endpoint accepts valid data
   - Quote request endpoint rejects invalid data
   - Error responses formatted correctly

### Property-Based Tests

Property-based tests will verify universal properties across all inputs using fast-check:

1. **Property 1**: Add then contains
2. **Property 2**: Remove then not contains
3. **Property 3**: Count consistency
4. **Property 4**: localStorage round-trip
5. **Property 5**: Form validation blocks submission
6. **Property 6**: Email content completeness
7. **Property 7**: Product table row completeness

**Configuration**:

- Minimum 100 iterations per property test
- Use fast-check for TypeScript property-based testing
- Each test tagged with: **Feature: wishlist-feature, Property {number}: {property_text}**

### Integration Tests

1. **Full Quote Request Flow**: Add products → Open modal → Fill form → Submit → Verify email logged
2. **Persistence Test**: Add products → Refresh page → Verify products still in wishlist
3. **Empty State Flow**: Clear wishlist → Verify empty state → Click browse → Navigate to products
