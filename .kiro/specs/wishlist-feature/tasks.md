# Implementation Plan: Wishlist Feature

## Overview

This implementation plan breaks down the wishlist feature into discrete coding tasks. The approach starts with updating the data layer, then implements the centralized wishlist management system, followed by the wishlist page, and finally migrates existing components.

## Tasks

- [ ] 1. Update Data Layer to Match Product Model

  - [ ] 1.1 Update ProductData interface in lib/data.ts
    - Add `weight: string` field
    - Add `grade: string` field
    - Remove `price`, `priceUnit`, `specifications`, `certifications` fields
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

- [ ] 2. Implement Centralized Wishlist Management

  - [ ] 2.1 Create useWishlist hook with WishlistContext and WishlistProvider

    - Create `hooks/useWishlist.tsx` with context, provider, and hook
    - Implement `addToWishlist`, `removeFromWishlist`, `toggleWishlist`, `isInWishlist`, `clearWishlist` functions
    - Implement `wishlistCount` computed value
    - Handle localStorage persistence on add/remove operations
    - Handle localStorage loading on initialization
    - Handle edge case when localStorage is unavailable or empty
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9_

  - [ ]\* 2.2 Write property test for add then contains

    - **Property 1: Add then contains**
    - **Validates: Requirements 1.1, 1.3**

  - [ ]\* 2.3 Write property test for remove then not contains

    - **Property 2: Remove then not contains**
    - **Validates: Requirements 1.2, 1.3**

  - [ ]\* 2.4 Write property test for toggle idempotence

    - **Property 3: Toggle idempotence (double toggle)**
    - **Validates: Requirements 1.1, 1.2**

  - [ ]\* 2.5 Write property test for wishlist count consistency

    - **Property 4: Wishlist count consistency**
    - **Validates: Requirements 1.4, 1.5**

  - [ ]\* 2.6 Write property test for localStorage round-trip

    - **Property 5: localStorage round-trip**
    - **Validates: Requirements 1.6, 1.7, 1.8**

  - [ ]\* 2.7 Write property test for add uniqueness
    - **Property 6: Add uniqueness (no duplicates)**
    - **Validates: Requirements 1.1, 1.4**

- [ ] 3. Integrate WishlistProvider into Application

  - [ ] 3.1 Add WishlistProvider to locale layout
    - Wrap application content with WishlistProvider in `app/[locale]/layout.tsx`
    - _Requirements: 1.8_

- [ ] 4. Checkpoint - Verify Wishlist Hook Works

  - Ensure all property tests pass
  - Ask the user if questions arise

- [ ] 5. Create Wishlist Page

  - [ ] 5.1 Add wishlist translations to locale files

    - Add wishlist page translations to `messages/en.json`
    - Add wishlist page translations to `messages/ar.json`
    - _Requirements: 2.6_

  - [ ] 5.2 Create WishlistClient component

    - Create `components/wishlist/WishlistClient.tsx`
    - Display products from wishlist using useWishlist hook
    - Implement empty state with link to products page
    - Implement remove button for each product
    - Support grid/list view modes
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [ ] 5.3 Create wishlist page route
    - Create `app/[locale]/wishlist/page.tsx`
    - Fetch product data for wishlist items
    - Render WishlistClient component
    - _Requirements: 2.7_

- [ ] 6. Migrate Existing Components to Use Centralized Wishlist

  - [ ] 6.1 Update ProductsClient to use useWishlist hook

    - Remove local wishlist state and localStorage logic
    - Use useWishlist hook for all wishlist operations
    - _Requirements: 4.1, 4.4_

  - [ ] 6.2 Update ProductCard to use useWishlist hook

    - Remove wishlist props
    - Use useWishlist hook directly for wishlist status and toggle
    - _Requirements: 4.2, 4.4_

  - [ ] 6.3 Update ProductListCard to use useWishlist hook
    - Remove wishlist props
    - Use useWishlist hook directly for wishlist status and toggle
    - Remove unused formatPrice function
    - Update to use new ProductData fields (remove specifications/certifications references)
    - _Requirements: 4.3, 4.4_

- [ ] 7. Final Checkpoint - Verify Full Integration
  - Ensure all components work with centralized wishlist
  - Verify wishlist page displays correctly
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional property-based tests that can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties using fast-check
- The data layer update is done first to prevent type errors during implementation
