# Tasks: enhance-drawer-experience

## Phase 1: Animation Improvements

- [ ] 1.1 Update ProjectDrawer.tsx to add slide-in animation using Tailwind transitions
  - Replace conditional CSS classes with Tailwind `transition-transform` classes
  - Test animation timing and easing
  - Validation: Open drawer shows smooth slide-in animation

- [ ] 1.2 Update overlay to use proper fade animation
  - Add `transition-opacity` to overlay div
  - Ensure both open and close states have smooth transitions
  - Validation: Overlay fades in/out smoothly with drawer

- [ ] 1.3 Remove unused animation CSS classes from animations.css
  - Clean up `.drawer-enter`, `.drawer-enter-active`, `.drawer-exit`, `.drawer-exit-active`
  - Keep other animation classes (card, dialog) for future use
  - Validation: Build passes, no console errors

## Phase 2: Unified Inline Edit Interface

- [ ] 2.1 Remove drawerMode state from ProjectDrawer component
  - Delete `useState` for `drawerMode`
  - Remove `externalMode` prop from interface
  - Validation: No TypeScript errors

- [ ] 2.2 Remove view/edit toggle button from header
  - Delete conditional rendering of switchToEdit button
  - Update header to show single title
  - Validation: Toggle button no longer appears

- [ ] 2.3 Merge view and edit content sections into single form
  - Remove conditional rendering `drawerMode === 'view'`
  - Remove conditional rendering `drawerMode === 'edit'`
  - Always render form fields directly
  - Validation: All fields visible and editable

- [ ] 2.4 Add read-only sections for progress and timestamps
  - Display progress bar in non-editable format
  - Show createdAt/updatedAt timestamps
  - These remain visually distinct from editable fields
  - Validation: Read-only sections display correctly

- [ ] 2.5 Update Save button visibility logic
  - Remove `drawerMode === 'edit'` condition
  - Save button always visible for existing projects
  - Validation: Save button always visible when project selected

- [ ] 2.6 Update handleOpenEdit in ProjectPage
  - Remove `setDrawerMode('edit')` call
  - Just set selectedProject and open drawer
  - Validation: Creating/editing project works without mode switching

## Phase 3: Project Type Background Theme

- [ ] 3.1 Create CSS classes for project type backgrounds
  - Add `.bg-theme-code` with blue gradient
  - Add `.bg-theme-life` with green gradient
  - Use subtle colors for readability
  - Validation: Classes defined and ready to use

- [ ] 3.2 Apply theme class to drawer content area
  - Determine project type from `project?.type` or `formData?.type`
  - Apply appropriate CSS class to form container
  - Validation: Blue background for code, green for life projects

- [ ] 3.3 Handle new project default theme
  - When creating new project, default to code (blue theme)
  - Validation: New project drawer shows blue background

## Phase 4: Frosted Glass Effect

- [ ] 4.1 Update overlay to use backdrop blur
  - Replace `bg-opacity-50` with `backdrop-blur-sm`
  - Use `bg-black/50` for transparency
  - Validation: Frosted glass effect visible on overlay

- [ ] 4.2 Test contrast and readability
  - Verify drawer content is readable
  - Check contrast ratios meet accessibility standards
  - Validation: Content readable, background visibly blurred

## Phase 5: Cleanup and Validation

- [ ] 5.1 Remove unused imports and code
  - Clean up ProjectDrawer.tsx
  - Remove unused `ProjectStatus` import if no longer needed
  - Validation: No unused imports

- [ ] 5.2 Update i18n dictionary if needed
  - Remove unused translation keys (drawer.viewMode, drawer.editMode, drawer.switchToEdit)
  - Validation: No missing translations, no console warnings

- [ ] 5.3 Run full build validation
  - Execute `pnpm build`
  - Fix any TypeScript or lint errors
  - Validation: Build passes without errors

- [ ] 5.4 Manual testing checklist
  - [ ] Open animation works smoothly
  - [ ] Close animation works smoothly
  - [ ] All fields are directly editable
  - [ ] Project type background displays correctly
  - [ ] Frosted glass overlay works
  - [ ] Save functionality works
  - [ ] Delete functionality works
  - [ ] New project creation works
  - [ ] Keyboard navigation works

## Dependencies

- Phase 2 tasks depend on Phase 1 completion
- Phase 3 and 4 can run in parallel after Phase 2
- Phase 5 is sequential after all previous phases

## Parallelizable Work

- Phase 3 (background theme) can be done while 2.x tasks are in progress
- Phase 4 (frosted glass) can be done in parallel with Phase 3
