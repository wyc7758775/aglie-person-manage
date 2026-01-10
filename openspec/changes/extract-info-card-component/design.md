# Info Card Component Design

## Component Architecture

### Component Structure
```
InfoCard (controlled component)
├── Props
│   ├── locationInfo: LocationInfo
│   ├── dateInfo: DateInfo
│   ├── timeInfo: TimeInfo
│   ├── isSignUpMode: boolean
│   ├── onJoinInClick: () => void
│   └── className?: string (optional)
└── Render
    ├── Outer container (conditional animation based on isSignUpMode)
    ├── Layer 1: White background with orange circle decoration
    └── Layer 2: Glassmorphism overlay
        ├── Location display (top-left)
        ├── Date display (top-center)
        ├── Spacer (middle)
        └── Bottom section
            ├── Time display
            ├── IP and country info
            └── "Join in" button
```

### TypeScript Interfaces

```typescript
interface LocationInfo {
  city: string;
  region: string;
  country: string;
  ip: string;
  timezone: string;
}

interface DateInfo {
  weekday: string;
  dayWithSuffix: string;
}

interface TimeInfo {
  time: string;
  period: string;
  displayTime: string;
}

interface InfoCardProps {
  locationInfo: LocationInfo;
  dateInfo: DateInfo;
  timeInfo: TimeInfo;
  isSignUpMode: boolean;
  onJoinInClick: () => void;
  className?: string;
}
```

## Design Decisions

### 1. Controlled Component Pattern
**Decision**: Use a controlled component with props rather than managing state internally
**Rationale**: 
- Parent component (login page) manages all data state
- Makes component predictable and easier to test
- Follows React best practices for presentational components
- Aligns with existing `ag-button.tsx` pattern

### 2. Animation Logic
**Decision**: Keep animation logic in component using `isSignUpMode` prop
**Rationale**:
- Animation is tightly coupled to component visual state
- Component controls its own CSS classes and transforms
- Prevents layout shifts in parent component
- Maintains encapsulation

### 3. Styling Approach
**Decision**: Keep Tailwind utility classes inline, no CSS modules
**Rationale**:
- Consistent with existing UI components
- No additional build steps required
- Aligns with project's Tailwind-first approach
- Maintains glassmorphism design language

### 4. Import Strategy
**Decision**: Use named export, default export from `app/ui/info-card.tsx`
**Rationale**:
- Follows existing `app/ui/` component patterns
- Prevents accidental default imports
- Clearer tree-shaking for production builds

## Reuse Considerations

### Future Use Cases
1. **Dashboard Sidebar**: Could display user's current location/time
2. **Profile Page**: Show user's timezone information
3. **Settings Page**: Display location for timezone configuration
4. **Global Status Bar**: Floating widget showing current location/time

### Extensibility Points
1. **Optional Prop**: `className` for custom container styling
2. **Theme Support**: Future addition of dark mode variant
3. **Compact Mode**: Smaller version for mobile/dashboard use
4. **Click Events**: Separate props for different interactive elements

## Testing Strategy

### Unit Tests (Future)
- Renders correctly with all props provided
- Applies correct animation classes based on `isSignUpMode`
- Calls `onJoinInClick` when button is clicked
- Displays location, date, and time information correctly

### Integration Tests
- Works within login page context
- Maintains smooth animations during mode transitions
- Responsive behavior on different screen sizes

## Migration Path

1. Create `app/ui/info-card.tsx` with extracted code
2. Import `InfoCard` in `app/page.tsx`
3. Replace embedded JSX with `<InfoCard />` component
4. Pass all required props from parent state
5. Verify identical visual output
6. Remove old embedded code
7. Test all interactions and animations

## Technical Constraints

- Must be a client component (`"use client"` directive)
- Uses existing icons from `@/app/ui/icons`
- Uses existing `AgButton` component
- No external dependencies beyond existing ones
- TypeScript strict mode compatible
