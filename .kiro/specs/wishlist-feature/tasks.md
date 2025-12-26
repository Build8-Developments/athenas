# Implementation Plan: Wishlist Feature Enhancement

## Overview

This implementation plan enhances the existing wishlist feature to include a checkout-style page with product table, loading skeleton, contact form modal, and email service for quote requests. The existing wishlist management system is already in place.

## Tasks

- [x] 1. Update Data Layer to Match Product Model

  - [x] 1.1 Update ProductData interface in lib/data.ts
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

- [x] 2. Implement Centralized Wishlist Management

  - [x] 2.1 Create useWishlist hook with WishlistContext and WishlistProvider
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9_

- [x] 3. Integrate WishlistProvider into Application

  - [x] 3.1 Add WishlistProvider to locale layout
    - _Requirements: 1.8_

- [x] 4. Create Loading Skeleton Component

  - [x] 4.1 Create WishlistSkeleton component
    - Create `components/wishlist/WishlistSkeleton.tsx`
    - Include animated pulse placeholders for page header
    - Include placeholder rows for product table (3-4 rows)
    - Include placeholder for summary section
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 5. Update Wishlist Page with Checkout-Style Layout

  - [x] 5.1 Add new wishlist translations to locale files

    - Add quote request related translations to `messages/en.json`
    - Add quote request related translations to `messages/ar.json`
    - Include: requestQuote, formLabels, successMessage, errorMessage
    - _Requirements: 2.7_

  - [x] 5.2 Redesign WishlistClient with product table

    - Replace grid/list card views with table layout
    - Table columns: Product (image + name), Category, Actions
    - Add summary section with item count
    - Add "Request Quote" button
    - Responsive design: table on desktop, stacked list on mobile
    - _Requirements: 2.1, 2.3, 2.4, 2.5, 2.6_

  - [x] 5.3 Update wishlist page to use Suspense with skeleton
    - Wrap WishlistClient with React Suspense
    - Use WishlistSkeleton as fallback
    - _Requirements: 3.5_

- [x] 6. Create Contact Form Modal

  - [x] 6.1 Create ContactFormModal component

    - Create `components/wishlist/ContactFormModal.tsx`
    - Implement modal overlay with close on outside click
    - Add form fields: fullName, email, phone (required), company, message (optional)
    - Implement client-side validation for required fields
    - Display inline validation errors
    - Add loading state during submission
    - Add success and error state displays
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9_

  - [x] 6.2 Integrate ContactFormModal into WishlistClient
    - Add modal state management
    - Connect "Request Quote" button to open modal
    - Pass products and locale to modal
    - _Requirements: 4.1_

- [x] 7. Create Email Service and API Route

  - [x] 7.1 Create email service utility

    - Create `lib/email.ts`
    - Implement `sendQuoteRequestEmail` function
    - Format email content with customer info and products
    - Log formatted email to console
    - Structure for future nodemailer integration
    - Return success/error response
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

  - [x] 7.2 Create quote request API route
    - Create `app/api/quote-request/route.ts`
    - Implement POST handler
    - Validate request body
    - Call email service
    - Return appropriate response
    - _Requirements: 5.1, 5.6_

- [ ] 8. Checkpoint - Verify Core Functionality

  - Ensure loading skeleton displays correctly
  - Ensure product table renders all wishlist items
  - Ensure contact form modal opens and validates
  - Ensure quote request logs to console
  - Ask the user if questions arise

- [x] 9. Migrate Existing Components to Use Centralized Wishlist

  - [x] 9.1 Update ProductsClient to use useWishlist hook

    - _Requirements: 7.1, 7.4_

  - [x] 9.2 Update ProductCard to use useWishlist hook

    - _Requirements: 7.2, 7.4_

  - [x] 9.3 Update ProductListCard to use useWishlist hook
    - _Requirements: 7.3, 7.4_

- [ ] 10. Final Checkpoint
  - Verify all components work with centralized wishlist
  - Verify wishlist page displays correctly with new design
  - Verify quote request flow works end-to-end
  - Ask the user if questions arise

## Notes

- Tasks 1-3 and 9 are already complete from previous implementation
- Focus is on new features: loading skeleton, table layout, contact form, email service
- Email service logs to console for now; nodemailer integration is future work
- Each task references specific requirements for traceability
