# Proposal: enhance-drawer-experience

## Summary
Enhance the ProjectDrawer component with smooth open/close animations, inline editing capabilities, project-type-themed backgrounds, and frosted glass effects.

## Problem Statement
Current ProjectDrawer implementation has several UX issues:
1. Drawer opens without animation (only closing has animation)
2. View and Edit modes are separate with a toggle button, requiring mode switching
3. Edit form lacks visual connection to the project type
4. Background uses simple opacity instead of modern frosted glass effect

## Proposed Solution

### 1. Bidirectional Drawer Animation
- Add smooth slide-in animation when drawer opens
- Keep existing slide-out animation for closing
- Use CSS transitions with cubic-bezier easing for natural motion

### 2. Unified Inline Edit Interface
- Remove the view/edit mode toggle
- Display all fields as editable inputs from the start
- Show project information in read-only format only for non-editable fields (progress bar, timestamps)
- Keep "Save" and "Delete" buttons always visible

### 3. Project Type Background Theme
- Apply different background gradients based on project type
- Code projects: Blue-themed gradient backgrounds
- Life projects: Green-themed gradient backgrounds
- Subtle gradients to maintain readability

### 4. Frosted Glass Background
- Replace simple `bg-opacity-50` with backdrop-blur
- Use Tailwind's `backdrop-blur-sm` or `backdrop-blur-md`
- Maintain accessibility with proper contrast ratios

## Scope
- **In Scope:**
  - ProjectDrawer component (`app/dashboard/project/components/ProjectDrawer.tsx`)
  - Animation CSS (`app/dashboard/project/components/animations.css`)
  - i18n updates for removed/changed labels

- **Out of Scope:**
  - Other dashboard drawers (requirements, defects, etc.)
  - Database schema changes
  - API changes

## Success Criteria
1. Drawer opens with smooth slide-in animation matching the close animation
2. All form fields are directly editable without mode switching
3. Edit form background reflects project type (blue for code, green for life)
4. Modal background uses frosted glass effect
5. No regression in existing functionality

## Dependencies
- None (uses existing Tailwind CSS and React)

## Risks
- Low risk: Only affects UI presentation, no data changes
- Animation may need fine-tuning for different screen sizes
