# Requirements Document

## Introduction

This feature enhances the wishlist page to function as a quote request/checkout-like experience for the Athenas e-commerce platform. Users can view their saved products in a table format, fill out a contact form, and submit their wishlist along with their information to the business via email. The page includes loading states, a professional checkout-style layout, and a modal form for collecting user details.

## Glossary

- **Wishlist_Manager**: The centralized system (React hook/context) responsible for all wishlist operations including adding, removing, and persisting wishlist items
- **Wishlist_Page**: The dedicated page component that displays all products a user has added to their wishlist in a checkout-style layout
- **Product_Table**: A table/list component displaying wishlist products with image, name, category, quantity, and actions
- **Contact_Form_Modal**: A modal dialog that collects user information (name, email, phone, company, message) for quote requests
- **Email_Service**: The service responsible for sending wishlist and user information to the business
- **Loading_Skeleton**: Placeholder UI components displayed while data is being fetched
- **Product_Data**: The data interface representing product information retrieved from the database
- **Local_Storage**: Browser storage mechanism used to persist wishlist data across sessions
- **Data_Layer**: The `lib/data.ts` module that provides data access functions for products and categories

## Requirements

### Requirement 1: Centralized Wishlist Management

**User Story:** As a developer, I want a centralized wishlist management system, so that wishlist operations are consistent across all components and easy to maintain.

#### Acceptance Criteria

1. THE Wishlist_Manager SHALL provide a function to add a product to the wishlist by product ID
2. THE Wishlist_Manager SHALL provide a function to remove a product from the wishlist by product ID
3. THE Wishlist_Manager SHALL provide a function to check if a product is in the wishlist
4. THE Wishlist_Manager SHALL provide access to the current list of wishlist product IDs
5. THE Wishlist_Manager SHALL provide the total count of items in the wishlist
6. WHEN a product is added to the wishlist, THE Wishlist_Manager SHALL persist the updated list to Local_Storage immediately
7. WHEN a product is removed from the wishlist, THE Wishlist_Manager SHALL persist the updated list to Local_Storage immediately
8. WHEN the application initializes, THE Wishlist_Manager SHALL load the wishlist from Local_Storage
9. IF Local_Storage is unavailable or empty, THEN THE Wishlist_Manager SHALL initialize with an empty wishlist

### Requirement 2: Wishlist Page with Checkout-Style Layout

**User Story:** As a user, I want to view my wishlist products in a professional checkout-style page, so that I can review my selections and request a quote from the business.

#### Acceptance Criteria

1. WHEN a user navigates to the wishlist page, THE Wishlist_Page SHALL display a checkout-style layout with a product table and summary section
2. WHEN the wishlist is empty, THE Wishlist_Page SHALL display a friendly empty state message with a link to browse products
3. THE Product_Table SHALL display each product as a row with image thumbnail, name, category, and remove action
4. THE Wishlist_Page SHALL display a summary section showing total items count
5. THE Wishlist_Page SHALL provide a prominent "Request Quote" button to open the contact form modal
6. WHEN a user removes a product from the wishlist page, THE Wishlist_Page SHALL update immediately without page refresh
7. THE Wishlist_Page SHALL support the existing locale system for internationalization
8. THE Wishlist_Page SHALL be accessible via a consistent URL pattern matching the existing routing structure

### Requirement 3: Loading Skeleton

**User Story:** As a user, I want to see loading placeholders while the wishlist page loads, so that I have visual feedback that content is being fetched.

#### Acceptance Criteria

1. WHEN the wishlist page is loading, THE Loading_Skeleton SHALL display placeholder elements matching the page layout
2. THE Loading_Skeleton SHALL include animated pulse effects to indicate loading state
3. THE Loading_Skeleton SHALL display placeholder rows for the product table
4. THE Loading_Skeleton SHALL display placeholder elements for the summary section
5. WHEN data loading completes, THE Loading_Skeleton SHALL be replaced with actual content

### Requirement 4: Contact Form Modal

**User Story:** As a user, I want to fill out my contact information in a modal form, so that I can submit my wishlist as a quote request to the business.

#### Acceptance Criteria

1. WHEN a user clicks the "Request Quote" button, THE Contact_Form_Modal SHALL open and display the form
2. THE Contact_Form_Modal SHALL collect the following required fields: full name, email address, phone number
3. THE Contact_Form_Modal SHALL collect the following optional fields: company name, additional message
4. THE Contact_Form_Modal SHALL validate all required fields before submission
5. THE Contact_Form_Modal SHALL display validation errors for invalid or missing required fields
6. WHEN a user clicks outside the modal or the close button, THE Contact_Form_Modal SHALL close without submitting
7. THE Contact_Form_Modal SHALL display a loading state during form submission
8. WHEN form submission succeeds, THE Contact_Form_Modal SHALL display a success message and close
9. IF form submission fails, THEN THE Contact_Form_Modal SHALL display an error message and allow retry

### Requirement 5: Email Service for Quote Requests

**User Story:** As a business owner, I want to receive email notifications with customer wishlist and contact information, so that I can follow up on quote requests.

#### Acceptance Criteria

1. WHEN a user submits the contact form, THE Email_Service SHALL send an email containing the user's information and wishlist products
2. THE Email_Service SHALL include in the email: customer name, email, phone, company (if provided), message (if provided)
3. THE Email_Service SHALL include in the email: list of all wishlist products with names and categories
4. THE Email_Service SHALL log the email content to the terminal/console for development purposes
5. THE Email_Service SHALL be structured to easily integrate with nodemailer in the future
6. IF email sending fails, THEN THE Email_Service SHALL return an error response to the client

### Requirement 6: Update Data Layer to Match Product Model

**User Story:** As a developer, I want the data layer interfaces to match the updated Product model, so that there are no type mismatches between the database and application code.

#### Acceptance Criteria

1. THE Product_Data interface SHALL include the `weight` field as a string
2. THE Product_Data interface SHALL include the `grade` field as a string
3. THE Product_Data interface SHALL NOT include the deprecated `price` field
4. THE Product_Data interface SHALL NOT include the deprecated `priceUnit` field
5. THE Product_Data interface SHALL NOT include the deprecated `specifications` object
6. THE Product_Data interface SHALL NOT include the deprecated `certifications` array
7. THE Data_Layer functions SHALL return data matching the updated Product_Data interface

### Requirement 7: Component Integration

**User Story:** As a developer, I want existing components to use the centralized wishlist system, so that wishlist behavior is consistent throughout the application.

#### Acceptance Criteria

1. WHEN ProductsClient component mounts, THE component SHALL use the Wishlist_Manager instead of local state for wishlist operations
2. WHEN ProductCard component renders, THE component SHALL use the Wishlist_Manager to check wishlist status
3. WHEN ProductListCard component renders, THE component SHALL use the Wishlist_Manager to check wishlist status
4. THE existing wishlist toggle functionality SHALL continue to work as before after migration
