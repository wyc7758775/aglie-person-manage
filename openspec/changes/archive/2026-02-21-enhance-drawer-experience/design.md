# Design: enhance-drawer-experience

## Architectural Decisions

### 1. Animation Implementation

**Decision:** Use Tailwind CSS transition classes with conditional rendering for animation state

**Rationale:**
- Tailwind's `transition-*` classes are already used throughout the codebase
- CSS transitions are more performant than keyframe animations for this use case
- Maintains consistency with existing animation patterns in `animations.css`

**Implementation Details:**
```jsx
// Before (problematic)
<div className={`... ${open ? 'drawer-enter-active' : 'drawer-exit-active'}`}>

// After
<div className={`... transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}>
```

**Trade-offs:**
- Pro: Simpler code, no custom CSS classes needed
- Pro: Tailwind handles vendor prefixes
- Con: Less control over complex animation sequences

### 2. Inline Editing Approach

**Decision:** Remove mode switching entirely, always show editable form

**Rationale:**
- Simplifies user experience - no cognitive load of understanding two modes
- Faster workflow - no clicks needed to start editing
- Matches modern UI patterns (e.g., Notion, Linear)

**Implementation Details:**
- Always render the edit form structure
- Display read-only fields (progress, timestamps) as special non-editable components
- Auto-save on blur or manual save button (keep manual for now)

**Trade-offs:**
- Pro: Cleaner, simpler code (fewer branches)
- Pro: Better UX
- Con: Users might accidentally change values (but they can cancel/reset)

### 3. Background Theme Strategy

**Decision:** Use CSS variables for dynamic theming based on project type

**Rationale:**
- Easy to extend with new project types
- Maintains design consistency
- Easy to customize via CSS

**Implementation:**
```css
.bg-theme-code {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 197, 253, 0.1));
}

.bg-theme-life {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(134, 239, 172, 0.1));
}
```

### 4. Frosted Glass Effect

**Decision:** Use Tailwind's `backdrop-blur` with `bg-black/50`

**Implementation:**
```jsx
<div className="fixed inset-0 bg-black/50 backdrop-blur-sm">
```

**Rationale:**
- Native Tailwind support
- Good browser compatibility
- Modern, elegant appearance

## Component Changes

### ProjectDrawer.tsx

**Before:** 483 lines with mode switching logic
**After:** ~350 lines, simplified, no mode state

**Key Changes:**
1. Remove `drawerMode` state entirely
2. Always render form fields
3. Add theme class based on `project?.type` or `formData?.type`
4. Simplify conditional rendering

### animations.css

**Before:** Custom keyframe animations
**After:** May be reduced or removed, using Tailwind transitions instead

## State Management

No new state needed - we simplify existing state by removing `drawerMode`.

## Accessibility Considerations

- Keep focus management when drawer opens
- Ensure keyboard navigation works through all fields
- Maintain ARIA labels for form fields
- Contrast ratios for themed backgrounds must pass WCAG AA

## Testing Strategy

1. Manual testing of open/close animations
2. Verify all form fields are editable
3. Check background themes for both project types
4. Verify frosted glass effect on different backgrounds
5. Test with keyboard navigation
