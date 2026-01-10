# Extract Info Card Component

## Overview
Extract the right-side info card from the login page (`app/page.tsx`) into a reusable, controlled UI component in the `app/ui/` folder. This refactoring improves code maintainability and component reusability.

## Motivation
- **Maintainability**: The info card component contains ~80 lines of JSX mixed with the login page logic, making it hard to maintain
- **Reusability**: The info card displays location, date, and time information that could be reused in other dashboard pages
- **Testability**: Extracting the component into its own file makes it easier to unit test in isolation
- **Separation of Concerns**: The login page should focus on authentication logic, not UI component structure

## Current State
The info card is currently embedded directly in `app/page.tsx` (lines 554-634) with:
- Conditional styling based on `isSignUpMode` state
- Two-layer structure: white background base + glassmorphism overlay
- Location information display
- Date and time display
- "Join in" button with click handler

## Desired State
A new controlled component `app/ui/info-card.tsx` that:
- Accepts props for `locationInfo`, `dateInfo`, `timeInfo`, `isSignUpMode`, and click handlers
- Maintains all current styling and animation behavior
- Can be imported and reused across the application
- Follows existing UI component patterns (like `ag-button.tsx`)

## Scope
- Extract info card JSX into a new component file
- Define TypeScript interfaces for props
- Update `app/page.tsx` to import and use the new component
- No functional changes to the UI behavior
- No changes to API calls or data fetching logic

## Impact
- **Files Modified**: `app/page.tsx` (to use new component)
- **Files Added**: `app/ui/info-card.tsx`
- **No Breaking Changes**: The login page functionality remains identical
- **Build/Test Impact**: Must ensure build passes and dev server starts successfully

## Success Criteria
- Login page renders identically before and after refactoring
- All animations and hover effects work as expected
- TypeScript compilation succeeds with no errors
- Production build succeeds
- Code follows existing UI component patterns
