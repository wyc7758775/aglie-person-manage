# ui-components Specification

## Purpose
TBD - created by archiving change extract-info-card-component. Update Purpose after archive.
## Requirements
### Requirement: Info Card Component
A reusable, controlled UI component SHALL display location information, current date, and time with a glassmorphism design.

#### Scenario: Display location and time information
Given the InfoCard component is rendered with valid locationInfo, dateInfo, and timeInfo props
When the component loads
Then it SHALL display:
- City and region in top-left position
- Current weekday (e.g., "Sun", "Mon") in large bold text
- Current day with ordinal suffix (e.g., "1st", "2nd", "15th")
- Current time in format "HH:MM AM/PM"
- User's IP address
- User's country name
- Star icon with "Star" text

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

#### Scenario: Render with glassmorphism design
Given the InfoCard component is rendered
When the component mounts
Then it SHALL display:
- Layer 1: White background with orange gradient circle decoration
- Layer 2: Semi-transparent white backdrop with blur effect (`backdrop-blur-xl`)
- Orange circle: Gradient from orange-300 to orange-400
- Decorative circle: Small orange-200/40 circle inside main circle

### Requirement: Component Reusability
UI components in `app/ui/` folder SHALL follow consistent patterns for props, exports, and styling.

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

