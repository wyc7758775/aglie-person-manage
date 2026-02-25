## ADDED Requirements

### Requirement: Habit Detail Drawer Component
The system SHALL provide a dedicated drawer component for viewing and editing habit details, strictly following the design specification OD72U.

#### Scenario: Opening habit detail drawer
- **GIVEN** a user is viewing a habit in the task list
- **WHEN** the user clicks on the habit row
- **THEN** the habit detail drawer SHALL slide in from the right
- **AND** the drawer SHALL display all habit information as per the design

#### Scenario: Drawer header display
- **GIVEN** the habit detail drawer is open
- **WHEN** viewing the header section
- **THEN** the header SHALL display:
  - A type badge labeled "习惯" with orange (#E8944A) styling
  - The task ID in format "任务 ID: HB-001" with copy functionality
  - A close button (X icon) on the right

#### Scenario: Task ID copy functionality
- **GIVEN** the habit detail drawer is open
- **WHEN** the user clicks on the task ID area
- **THEN** the task ID SHALL be copied to the clipboard
- **AND** a visual feedback SHALL indicate successful copy

### Requirement: Completion Counter
The system SHALL provide a counter component showing current/target completion with increment/decrement buttons.

#### Scenario: Display completion progress
- **GIVEN** a habit has currentCount = 7 and targetCount = 12
- **WHEN** viewing the title row
- **THEN** a counter SHALL display "完成" label with "7/12" in green (#2E7D32)
- **AND** minus (-) and plus (+) buttons SHALL be available

#### Scenario: Increment completion count
- **GIVEN** the completion counter is visible
- **WHEN** the user clicks the plus (+) button
- **THEN** the current count SHALL increase by 1
- **AND** the display SHALL update to show the new count
- **AND** the change SHALL be persisted to the server

#### Scenario: Decrement completion count
- **GIVEN** the completion counter is visible with currentCount > 0
- **WHEN** the user clicks the minus (-) button
- **THEN** the current count SHALL decrease by 1
- **AND** the display SHALL update to show the new count
- **AND** the change SHALL be persisted to the server

#### Scenario: Prevent negative count
- **GIVEN** the current count is 0
- **WHEN** the user clicks the minus (-) button
- **THEN** the count SHALL remain at 0
- **AND** no API call SHALL be made

### Requirement: Stats Card Section
The system SHALL display a dark-themed card (#1A1D2E) showing three key statistics.

#### Scenario: Display habit statistics
- **GIVEN** the habit detail drawer is open
- **WHEN** viewing the stats section
- **THEN** a dark card SHALL display three metrics:
  - **连续天数** (Streak): showing the current streak value with a fire icon
  - **金币** (Gold): showing total gold earned with a coin icon
  - **完成次数** (Total Count): showing total completion count with a checkmark icon

#### Scenario: Stats card styling
- **GIVEN** the stats card is rendered
- **THEN** each stat box SHALL have:
  - Rounded corners (12px)
  - Semi-transparent background (rgba(255, 255, 255, 0.1))
  - White text for values (24px, bold)
  - Light text for labels

### Requirement: Info Grid Section
The system SHALL display a light-themed card (#F5F0F0) showing three editable habit configuration items.

#### Scenario: Display habit information
- **GIVEN** the habit detail drawer is open
- **WHEN** viewing the info section
- **THEN** a light card SHALL display three info boxes:
  - **难度** (difficulty): showing current difficulty (简单/中等/困难)
  - **频率** (frequency): showing current frequency (每日/每周/每月)
  - **金币奖励** (goldReward): showing gold reward per completion, e.g., "+3.5 G / 次" in orange (#E8944A)

#### Scenario: Hover to show edit button
- **GIVEN** the user hovers over any of the three info boxes (难度, 频率, or 金币奖励)
- **THEN** an edit (pencil) icon SHALL appear in the top-right corner of that box
- **AND** the cursor SHALL change to pointer

#### Scenario: Click to edit info item
- **GIVEN** the edit icon is visible on hover
- **WHEN** the user clicks the edit icon
- **THEN** the info box SHALL switch to edit mode:
  - **难度**: Dropdown with options (简单, 中等, 困难)
  - **频率**: Dropdown with options (每日, 每周, 每月)
  - **金币奖励**: Number input field for the gold value

#### Scenario: Save edited info
- **GIVEN** an info item is in edit mode
- **WHEN** the user changes the value and clicks outside (onBlur) or presses Enter
- **THEN** the new value SHALL be saved automatically
- **AND** the box SHALL return to display mode with the updated value

#### Scenario: Display editing hint
- **GIVEN** the info grid is displayed
- **THEN** a hint text SHALL appear below:
  - "编辑规则：今日预计 = 频率 × 单次奖励（自动换算）"
  - Gray color (#1A1D2E66)
  - Small font size (11px)

### Requirement: Editable Description Section
The system SHALL provide an inline-editable description area without entering edit mode.

#### Scenario: Display description section
- **GIVEN** the habit detail drawer is open
- **WHEN** viewing the description section
- **THEN** the section SHALL display:
  - A header with file-text icon and "备注说明（可直接编辑）" title
  - An editable text area with current description
  - A hint "备注可直接编辑，无需切换编辑状态"

#### Scenario: Edit description inline
- **GIVEN** the description area is visible
- **WHEN** the user clicks into the rich text editor and modifies the content
- **AND** the user clicks outside (onBlur) or presses Ctrl+Enter
- **THEN** the new description SHALL be saved automatically
- **AND** a saving indicator SHALL be shown during the API call

#### Scenario: Rich text formatting
- **GIVEN** the rich text editor is active
- **WHEN** the user formats text (bold, italic, lists, etc.)
- **THEN** the formatting SHALL be preserved when saved
- **AND** the formatted content SHALL be displayed correctly when viewing

#### Scenario: Description save feedback
- **GIVEN** the user has edited the description
- **WHEN** the save is successful
- **THEN** a brief success indicator SHALL be shown
- **AND** the drawer SHALL remain open

### Requirement: Habit Heatmap Component
The system SHALL display a heatmap visualizing daily completion history.

#### Scenario: Display heatmap section
- **GIVEN** the habit detail drawer is open
- **WHEN** viewing the heatmap section
- **THEN** the section SHALL contain:
  - A header with calendar-days icon and "习惯热力图" title
  - Subtitle: "每格代表当天完成次数，颜色越深表示完成越高"
  - A white card with the heatmap visualization

#### Scenario: Display heatmap KPI row
- **GIVEN** the heatmap card is rendered
- **THEN** three KPI boxes SHALL be displayed at the top:
  - **本周完成** (Green background #F3FAF4, text color #2E7D32): showing this week's completion count
  - **完成率** (Orange background #FFF7EE, text color #E8944A): showing completion rate percentage
  - **最长连击** (Blue background #EEF5FF, text color #1E6FD9): showing longest streak in days

#### Scenario: Display month labels
- **GIVEN** the heatmap is rendered
- **THEN** month labels (Jan, Feb, Mar, Apr, etc.) SHALL be displayed
- **AND** they SHALL be aligned with the corresponding grid columns

#### Scenario: Display heatmap grid
- **GIVEN** the heatmap data is available
- **THEN** a 7-row grid SHALL be displayed representing days of week
- **AND** each cell SHALL represent one day with color intensity based on completion count
- **AND** the grid SHALL show approximately 3-4 months of history

#### Scenario: Heatmap cell interaction
- **GIVEN** the user hovers over a heatmap cell
- **THEN** a tooltip SHALL show the date and completion count for that day

#### Scenario: Display heatmap legend
- **GIVEN** the heatmap is rendered
- **THEN** a legend SHALL be displayed showing:
  - "今日已高亮，可点击格子看记录"
  - Color scale from light to dark indicating completion levels

### Requirement: Weekly Trend Chart
The system SHALL display a trend chart showing weekly completion patterns.

#### Scenario: Display trend section
- **GIVEN** the habit detail drawer is open and user scrolls down
- **WHEN** viewing the trend section
- **THEN** the section SHALL contain:
  - Title: "周完成趋势线"
  - An SVG line chart showing 6 weeks of data
  - X-axis labels: W1, W2, W3, W4, W5, W6

#### Scenario: Render trend line
- **GIVEN** the trend data is available
- **THEN** the chart SHALL display:
  - A green (#4CAF50) line connecting 6 data points
  - Circular markers at each data point
  - Light background (#F7FAFF) with border

### Requirement: Responsive Layout
The system SHALL ensure the drawer layout is responsive and scrollable.

#### Scenario: Handle long content
- **GIVEN** the habit has extensive description or history
- **WHEN** the content exceeds viewport height
- **THEN** the content area SHALL become scrollable
- **AND** the header SHALL remain fixed at the top

#### Scenario: Mobile adaptation
- **GIVEN** the user is on a mobile device or narrow viewport
- **WHEN** the drawer is opened
- **THEN** the drawer SHALL occupy full width or appropriate percentage
- **AND** all content SHALL be readable without horizontal scrolling

### Requirement: Close Drawer with Unsaved Changes Confirmation
The system SHALL prompt for confirmation when closing the drawer with unsaved changes.

#### Scenario: Close with unsaved changes via overlay click
- **GIVEN** the user has modified any editable field (description, difficulty, frequency, or gold reward)
- **AND** the changes have not been saved yet
- **WHEN** the user clicks on the overlay to close the drawer
- **THEN** a confirmation dialog SHALL appear asking "有未保存的更改，确定要关闭吗？"
- **AND** the user SHALL have options to "取消" (stay in drawer) or "确认关闭" (discard changes)

#### Scenario: Close with unsaved changes via ESC key
- **GIVEN** the user has modified any editable field
- **WHEN** the user presses the ESC key
- **THEN** the same confirmation dialog SHALL appear

#### Scenario: Close with unsaved changes via close button
- **GIVEN** the user has modified any editable field
- **WHEN** the user clicks the X close button
- **THEN** the same confirmation dialog SHALL appear

#### Scenario: Close without unsaved changes
- **GIVEN** all changes have been saved or no changes were made
- **WHEN** the user attempts to close the drawer (overlay, ESC, or close button)
- **THEN** the drawer SHALL close immediately without confirmation

## MODIFIED Requirements

### Requirement: Task Detail Drawer Switching
The system SHALL distinguish between habit and non-habit task types for detail display.

#### Scenario: Open habit detail
- **GIVEN** a task with type = "habit" is clicked
- **WHEN** opening the detail drawer
- **THEN** the HabitDetailDrawer component SHALL be rendered
- **AND** it SHALL show habit-specific UI elements

#### Scenario: Open non-habit detail
- **GIVEN** a task with type != "habit" is clicked
- **WHEN** opening the detail drawer
- **THEN** the existing TaskDetailDrawer SHALL be rendered
- **AND** it SHALL maintain current behavior

## REMOVED Requirements

None - This change is purely additive and refactoring.
