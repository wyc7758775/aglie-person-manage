# Spec: Inline Edit Drawer

## ADDED Requirements

### Requirement: Bidirectional Drawer Animation

The drawer SHALL animate smoothly both when opening and when closing.

**Acceptance Criteria:**
- Drawer slides in from right with 300ms duration when opening
- Drawer slides out to right with 300ms duration when closing
- Animation uses easing function for natural motion
- Mask/overlay fades in/out with drawer

**Implementation:**
- Use Tailwind `transition-transform duration-300 ease-out`
- Use `translate-x-0` for open state
- Use `translate-x-full` for closed state

#### Scenario: Opening drawer
**Given** the drawer is closed  
**When** the user clicks a project card or "Add Project" button  
**Then** the drawer slides in from the right with animation  
**And** the overlay fades in simultaneously  

#### Scenario: Closing drawer  
**Given** the drawer is open  
**When** the user clicks the close button or overlay  
**Then** the drawer slides out to the right with animation  
**And** the overlay fades out simultaneously  

---

### Requirement: Unified Inline Edit Interface

All project fields SHALL be directly editable without needing to switch between view and edit modes.

**Acceptance Criteria:**
- No toggle button between view and edit modes
- All form fields (name, description, type, priority, status, dates, goals, tags) are always visible and editable
- Read-only fields (progress bar, timestamps) display in non-editable format
- Save and Delete buttons are always visible

**Implementation:**
- Remove `drawerMode` state variable
- Always render the form layout
- Display project info and progress in read-only sections within the same form

#### Scenario: Editing project details
**Given** the drawer is open for an existing project  
**When** the user clicks on any field (text input, select, etc.)  
**Then** the field is immediately ready for editing  
**And** changes are saved when clicking the Save button  

#### Scenario: Creating new project  
**Given** the user clicks "Add Project" button  
**When** the drawer opens  
**Then** empty form fields are displayed  
**And** all fields are ready for input  

---

### Requirement: Project Type Background Theme

The drawer background SHALL reflect the project type with appropriate color theming.

**Acceptance Criteria:**
- Code type projects show blue-themed gradient background
- Life type projects show green-themed gradient background
- New projects default to code type with blue theme
- Theme is visible but doesn't interfere with content readability

**Implementation:**
- Apply CSS class based on `project?.type` or `formData?.type`
- Use subtle gradients with Tailwind colors

#### Scenario: Viewing code project  
**Given** a project with type "code"  
**When** the drawer opens  
**Then** the background shows a subtle blue gradient  

#### Scenario: Viewing life project  
**Given** a project with type "life"  
**When** the drawer opens  
**Then** the background shows a subtle green gradient  

---

### Requirement: Frosted Glass Modal Background

The overlay behind the drawer SHALL use a frosted glass effect.

**Acceptance Criteria:**
- Modal overlay uses backdrop blur effect
- Background content is blurred but visible underneath
- Maintains good contrast for the drawer content

**Implementation:**
- Use Tailwind `backdrop-blur-sm` or `backdrop-blur-md`
- Use `bg-black/50` for semi-transparent black

#### Scenario: Opening drawer with frosted glass
**Given** the drawer is closed  
**When** the drawer opens  
**Then** the background behind the overlay is blurred  
**And** the drawer content remains fully readable  

---

## MODIFIED Requirements

### Requirement: ProjectDrawer Interface

The `ProjectDrawerProps` interface SHALL be modified to remove the `mode` property.

**Before:**
```typescript
interface ProjectDrawerProps {
  open: boolean;
  onClose: () => void;
  project?: Project;
  mode?: 'view' | 'edit';
  onSave?: (project: Project) => void;
  onDelete?: (id: string) => void;
}
```

**After:**
```typescript
interface ProjectDrawerProps {
  open: boolean;
  onClose: () => void;
  project?: Project;
  onSave?: (project: Project) => void;
  onDelete?: (id: string) => void;
}
```

#### Scenario: Updating drawer props interface
**Given** the ProjectDrawer component is being updated  
**When** removing the mode property  
**Then** the interface no longer includes the mode property  
**And** existing code that passes mode is updated  

---

### Requirement: Page Component Integration

The `ProjectPage` component SHALL remove the `drawerMode` state.

**Before:**
```typescript
const [drawerMode, setDrawerMode] = useState<'view' | 'edit'>('view');
const [selectedProject, setSelectedProject] = useState<Project | undefined>(undefined);
const [drawerOpen, setDrawerOpen] = useState(false);
```

**After:**
```typescript
const [selectedProject, setSelectedProject] = useState<Project | undefined>(undefined);
const [drawerOpen, setDrawerOpen] = useState(false);
```

#### Scenario: Removing mode state from project page
**Given** the ProjectPage component  
**When** refactoring to remove drawerMode state  
**Then** the component only manages selectedProject and drawerOpen  
**And** handleOpenEdit no longer sets drawerMode  

---

## REMOVED Requirements

### Requirement: View/Edit Toggle Button

The toggle button and associated mode switching logic SHALL be removed.

**Before:**
- `drawerMode` state
- `switchToEdit` button in header
- Conditional rendering based on `drawerMode`
- Separate view and edit content sections

**After:**
- Single unified form layout
- All fields always editable
- Read-only sections for progress and timestamps

#### Removed Items:
- drawerMode state variable
- switchToEdit button and translation keys
- Conditional view/edit rendering logic
- Separate form and display sections

---

## Related Capabilities

This spec supersedes parts of `improve-project-ui` change proposal  
Related to: `auth` (user preferences for animations could be added later)
