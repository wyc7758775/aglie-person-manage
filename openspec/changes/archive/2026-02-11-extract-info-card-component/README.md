# Extract Info Card Component

## Summary
Extracts the right-side information card component from the login page (`app/page.tsx`) into a reusable, controlled UI component at `app/ui/info-card.tsx`.

## Files Changed
- **Modified**: `app/page.tsx` - Remove embedded info card JSX, import new component
- **Added**: `app/ui/info-card.tsx` - New reusable component

## Impact
- **Scope**: Refactoring only, no functional changes
- **Breaking**: None - login page behavior remains identical
- **Risk**: Low - isolated component extraction with clear interfaces

## How to Apply
After approval, implementation should:
1. Create the new `InfoCard` component following the specification
2. Update the login page to use the new component
3. Verify all animations and functionality work correctly
4. Run production build to ensure no errors

## See Also
- [proposal.md](./proposal.md) - Motivation and success criteria
- [design.md](./design.md) - Component architecture and decisions
- [tasks.md](./tasks.md) - Step-by-step implementation tasks
- [specs/ui-components/spec.md](./specs/ui-components/spec.md) - Requirements and scenarios
