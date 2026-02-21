## MODIFIED Requirements

### Requirement: Info Card Component
A reusable, controlled UI component SHALL display location information, current date, and time with a glassmorphism design.

#### Scenario: Display location and time information
Given the InfoCard component is rendered with valid locationInfo, dateInfo, and timeInfo props
When the component loads
Then it SHALL display:
- City and region in top-left position (text-sm)
- Current weekday (e.g., "Sun", "Mon") in large bold text (text-xl)
- Current day with ordinal suffix (e.g., "1st", "2nd", "15th") (text-base)
- Current time in format "HH:MM AM/PM" (text-base)
- User's IP address (text-xs)
- User's country name (text-xs)
- Star icon with "Star" text (h-4 w-4)

#### Scenario: Apply conditional animations
Given the InfoCard component is rendered with `isSignUpMode={true}`
When the component renders
Then the outer container SHALL have CSS classes:
- `transform translate-x-[-130px] translate-y-[-70px] scale-53 rotate-[7deg] opacity-70`
- `z-index: 2`

Given the InfoCard component is rendered with `isSignUpMode={false}`
When the component renders
Then the outer container SHALL have CSS classes:
- `transform translate-x-0 translate-y-0 scale-100 rotate-0 opacity-100`
- `z-index: 20`

#### Scenario: Handle Join in button click
Given the InfoCard component is rendered with `onJoinInClick` callback
When the user clicks the "Join in" button
Then the `onJoinInClick` callback function SHALL be executed

#### Scenario: Render with compact glassmorphism design
Given the InfoCard component is rendered
When the component mounts
Then it SHALL display:
- Layer 1: White background with orange gradient circle decoration
- Layer 2: Semi-transparent white backdrop with blur effect (`backdrop-blur-xl`)
- Orange circle: Gradient from orange-300 to orange-400 (reduced size)
- Decorative circle: Small orange-200/40 circle inside main circle
- Container padding: p-4 (reduced from p-6)

### Requirement: Section Container Component
The SectionContainer component in `app/ui/dashboard/section-container.tsx` SHALL provide a compact header area with reduced vertical spacing.

#### Scenario: Render compact header
Given the SectionContainer is rendered with a title and optional badge
When the component loads
Then the header area SHALL have:
- Container padding: p-4 (16px, reduced from p-5)
- Header bottom margin: mb-3 pb-2 (reduced from mb-4 pb-3)
- Title text size: text-lg (18px, reduced from text-xl)
- Badge padding: px-2 py-0.5 (reduced from px-2.5)
- Badge text: text-xs font-semibold (unchanged)

#### Scenario: Render compact add button
Given the SectionContainer is rendered with onAddClick callback
When the component loads
Then the add button SHALL have:
- Button padding: px-3 py-1.5 (12/6px, reduced from px-4 py-2)
- Plus icon: h-3 w-3 (12px, reduced from h-3.5 w-3.5)
- Button text: text-xs font-semibold (unchanged)

#### Scenario: Render compact filter buttons
Given the SectionContainer is rendered with filters or filterGroups
When the component loads
Then filter buttons SHALL have:
- Button padding: px-2.5 py-1 (10/4px, reduced from px-3 py-1.5)
- Button text: text-xs font-medium (unchanged)
- Container gap: gap-1.5 (6px) or gap-1 (4px) between buttons

### Requirement: Top Navigation Component
The SideNav component in `app/ui/dashboard/topnav.tsx` SHALL provide a compact vertical navigation with reduced button sizes.

#### Scenario: Render compact navigation buttons
Given the SideNav is rendered
When the component loads
Then navigation buttons SHALL have:
- Button size: w-8 h-8 (32px, reduced from w-10 h-10)
- Icon size: w-4 h-4 (16px, reduced from w-5 h-5)
- Container spacing: space-y-2 (8px, reduced from space-y-3)

#### Scenario: Render compact logo area
Given the SideNav is rendered
When the component loads
Then the logo area SHALL have:
- Bottom margin: mb-4 (16px, reduced from mb-6)
- Logo size: w-10 h-10 (40px) or w-8 h-8 (32px)
- Brand text: text-[10px] font-bold (unchanged)

### Requirement: Breadcrumb Navigation Component
The BreadcrumbNav component in `app/ui/dashboard/breadcrumb-nav.tsx` SHALL provide a compact project selector with reduced button and menu item sizes.

#### Scenario: Render compact project selector
Given the BreadcrumbNav is rendered with currentProject
When the component loads
Then the project selector button SHALL have:
- Button padding: px-3 py-1.5 (12/6px, reduced from px-4 py-2)
- Project name: text-sm font-semibold (unchanged)
- Chevron icon: w-4 h-4 (unchanged)

#### Scenario: Render compact dropdown menu
Given the BreadcrumbNav dropdown is opened
When the menu displays
Then menu items SHALL have:
- Container padding: py-1.5 (6px, reduced from py-2)
- Menu item padding: px-3 py-1.5 (reduced from px-4 py-2)
- Text size: text-sm (unchanged)

### Requirement: Project Tab Menu Component
The ProjectTabMenu component in `app/ui/dashboard/project-tab-menu.tsx` SHALL provide a compact tab switcher with reduced button sizes.

#### Scenario: Render compact tab container
Given the ProjectTabMenu is rendered
When the component loads
Then the container SHALL have:
- Container padding: p-1 (4px, reduced from p-1.5)
- Background: bg-gray-100/80 backdrop-blur-sm (unchanged)

#### Scenario: Render compact tab buttons
Given the ProjectTabMenu is rendered with tabs
When the component loads
Then tab buttons SHALL have:
- Button padding: px-4 py-1.5 (16/6px, reduced from px-5 py-2)
- Button text: text-sm font-medium (unchanged)
- Active text color: text-white (unchanged)
- Inactive text color: text-gray-600 (unchanged)

#### Scenario: Render compact sliding indicator
Given the ProjectTabMenu has an active tab
When the indicator renders
Then it SHALL have:
- Height: h-[calc(100%-8px)] (reduced from h-[calc(100%-12px)])
- Border radius: rounded-full (unchanged)
- Gradient: from-pink-400 via-purple-400 to-blue-400 (unchanged)

### Requirement: Project Card Component
The ProjectCard component in `app/dashboard/project/components/ProjectCard.tsx` SHALL provide a compact project card with reduced padding, icon size, and text sizes.

#### Scenario: Render compact card container
Given the ProjectCard is rendered
When the component loads
Then the card SHALL have:
- Card padding: p-3 (12px, reduced from p-4)
- Border radius: rounded-2xl (unchanged)
- Shadow and hover effects (unchanged)

#### Scenario: Render compact project icon
Given the ProjectCard is rendered with a project
When the component loads
Then the project icon container SHALL have:
- Container size: w-10 h-10 (40px, reduced from w-12 h-12)
- Icon text size: text-xl (20px, reduced from text-2xl)
- Border radius: rounded-xl (unchanged)

#### Scenario: Render compact action buttons
Given the ProjectCard is rendered
When the component loads
Then action buttons SHALL have:
- Arrow icon container: p-1.5 (6px) with w-3.5 h-3.5 icon
- Menu icon: w-4 h-4 (16px, reduced from w-5 h-5)
- Button padding: p-1.5 (unchanged for hover area)

#### Scenario: Render compact project name area
Given the ProjectCard is rendered with a project name
When the component loads
Then the name area SHALL have:
- Container height: h-[44px] (reduced from h-[48px])
- Project name: text-base font-bold (16px, reduced from text-lg)
- Points badge: px-2.5 py-1 (reduced from px-3 py-1.5)

#### Scenario: Render compact description area
Given the ProjectCard is rendered with a description
When the component loads
Then the description area SHALL have:
- Container height: h-[36px] (reduced from h-[40px])
- Text size: text-sm line-clamp-2 (unchanged)
- Line height: leading-relaxed (unchanged)

#### Scenario: Render compact tags area
Given the ProjectCard is rendered with status and priority
When the component loads
Then the tags area SHALL have:
- Container height: h-[24px] (reduced from h-[26px])
- Tag padding: px-2.5 py-1 (unchanged)
- Tag text: text-xs font-medium (unchanged)

#### Scenario: Render compact progress section
Given the ProjectCard is rendered with progress
When the component loads
Then the progress section SHALL have:
- Bottom margin: mb-2 (8px, reduced from mb-3)
- Progress bar height: h-2.5 (unchanged)
- Label text: text-sm font-medium (unchanged)

#### Scenario: Render compact deadline section
Given the ProjectCard is rendered with deadline
When the component loads
Then the deadline section SHALL have:
- Container height: h-[32px] (reduced from h-[36px])
- Icon size: w-4 h-4 (unchanged)
- Text size: text-sm font-medium (unchanged)

### Requirement: Project Drawer Component
The ProjectDrawer component in `app/dashboard/project/components/ProjectDrawer.tsx` SHALL provide a compact drawer form with reduced header, content padding, and spacing.

#### Scenario: Render compact drawer header
Given the ProjectDrawer is rendered
When the component loads
Then the header SHALL have:
- Container padding: px-5 py-3 (20/12px, reduced from px-6 py-4)
- Title size: text-lg font-semibold (18px, reduced from text-xl)
- Close button: text-xl (reduced from text-2xl)

#### Scenario: Render compact drawer content
Given the ProjectDrawer is rendered with form fields
When the component loads
Then the content area SHALL have:
- Container padding: p-5 (20px, reduced from p-6)
- Section spacing: space-y-5 (20px, reduced from space-y-6)

#### Scenario: Render compact action bar
Given the ProjectDrawer is in create mode
When the component loads
Then the action bar SHALL have:
- Container padding: px-5 py-3 (reduced from px-6 py-4)
- Button padding: px-5 py-2 or px-6 py-2 (unchanged)

### Requirement: Component Reusability
UI components in `app/ui/` folder SHALL follow consistent patterns for props, exports, and styling with compact sizing defaults.

#### Scenario: Import and use InfoCard
Given the InfoCard component exists in `app/ui/info-card.tsx`
When another file imports it
Then it MUST be importable using:
`import InfoCard from '@/app/ui/info-card';`
And MUST be usable as `<InfoCard {...props} />`

#### Scenario: TypeScript type safety
Given the InfoCard component has defined props interface
When the component is used
Then TypeScript SHALL provide:
- Type checking for all required props
- Intellisense for prop names and types
- Compile-time errors if required props are missing

#### Scenario: Compact sizing consistency
Given any UI component in `app/ui/`
When the component renders
Then it SHALL use these compact sizing defaults:
- Icons: h-4 w-4 (16px)
- Buttons: px-3 py-1.5 (horizontal 12px, vertical 6px)
- Card padding: p-4 (16px) or p-3 (12px) for dense layouts
- Internal gaps: gap-2 or gap-3 (8-12px)
- Text headings: text-lg (18px) or text-xl (20px)
- Body text: text-sm (14px)

### Requirement: Controlled Component Pattern
Presentational components SHALL receive all data and callbacks through props rather than managing internal state.

#### Scenario: Props-driven rendering
Given the InfoCard component receives all data via props
When the parent component state changes
Then the InfoCard SHALL re-render with new prop values
Without managing any internal state

#### Scenario: No side effects in render
Given the InfoCard component is a presentational component
When it renders
Then it MUST NOT:
- Call APIs directly
- Access browser storage
- Manage its own state
- Have side effects beyond rendering

## ADDED Requirements

### Requirement: Compact UI Design System
The system SHALL provide a standardized compact sizing system for all UI components to ensure visual consistency.

#### Scenario: Apply compact button styles
Given a button component is rendered
When it uses the compact design system
Then it SHALL have these size variants:
- **Small**: px-2.5 py-1.5 text-xs (for icon buttons, toolbars)
- **Medium** (default): px-3 py-1.5 text-sm (for regular actions)
- **Large**: px-4 py-2 text-base (for primary CTAs)

#### Scenario: Apply compact icon sizing
Given an icon component is rendered
When it follows the compact design system
Then it SHALL default to h-4 w-4 (16px) with these exceptions:
- Navigation icons: h-5 w-5 (20px) for better visibility
- Empty state icons: h-12 w-12 (48px) or larger for visual emphasis
- Action icons: h-4 w-4 (16px) for toolbars and buttons

#### Scenario: Apply compact spacing
Given a container component is rendered
When it follows the compact design system
Then it SHALL use these spacing defaults:
- Card padding: p-4 (16px, reduced from p-6 24px)
- Section gaps: gap-4 (16px, reduced from gap-6 24px)
- Element gaps: gap-2 or gap-3 (8-12px, reduced from gap-4 16px)
- Grid gaps: gap-3 (12px) for standard grids
