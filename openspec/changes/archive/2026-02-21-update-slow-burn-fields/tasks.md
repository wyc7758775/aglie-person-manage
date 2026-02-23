## 1. Database Schema Changes
- [x] 1.1 Update project type enum: `slow-project` → `slow-burn`
- [x] 1.2 Add `indicators` JSONB column to projects table
- [x] 1.3 Create migration to update existing slow-project records to slow-burn

## 2. Type Definitions Updates
- [x] 2.1 Update `ProjectType` in `app/lib/definitions.ts`: `'sprint-project' | 'slow-burn'`
- [x] 2.2 Add `ProjectIndicator` interface with fields: id, name, value, target, weight
- [x] 2.3 Update `Project` interface to include optional `indicators?: ProjectIndicator[]`

## 3. API Layer Updates
- [x] 3.1 Update `GET /api/projects` to return indicators for slow-burn projects
- [x] 3.2 Update `POST /api/projects` validation: accept slow-burn type, validate indicators array
- [x] 3.3 Update `PUT /api/projects/[id]` validation: handle indicators update
- [x] 3.4 Add progress calculation logic based on indicators weight
- [x] 3.5 Remove endDate validation for slow-burn projects in API

## 4. Frontend Components

### 4.1 Project Form Updates
- [x] 4.1.1 Update project type selector options: `sprint-project` / `slow-burn`
- [x] 4.1.2 Conditionally hide endDate field for slow-burn projects
- [x] 4.1.3 Add indicators management UI for slow-burn projects
- [x] 4.1.4 Implement indicators CRUD (add/edit/delete with weight validation)
- [x] 4.1.5 Add real-time progress preview based on indicators

### 4.2 Project Card Updates
- [x] 4.2.1 Update type badge display: "慢燃项目" / "Sprint Project"
- [x] 4.2.2 Update time display format to YYYY/MM/DD
- [x] 4.2.3 Show indicators progress for slow-burn projects

### 4.3 Project Detail Updates
- [x] 4.3.1 Update time display to YYYY/MM/DD format
- [x] 4.3.2 Show indicators list with progress bars
- [x] 4.3.3 Hide endDate for slow-burn projects

### 4.4 Drawer UX Improvements
- [x] 4.4.1 Fix scrollbar layout shift: add `scrollbar-gutter: stable` to Drawer content area to prevent content shifting left when scrollbar appears on type switch

## 5. Tiptap Rich Text Editor
- [ ] 5.1 Install Tiptap packages: @tiptap/react, @tiptap/starter-kit, @tiptap/extension-code-block-lowlight, @tiptap/extension-task-list, @tiptap/extension-table, @tiptap/extension-color, @tiptap/extension-link, @tiptap/extension-image, lowlight
- [ ] 5.2 Create `MarkdownEditor` component in `app/ui/markdown-editor.tsx`
- [ ] 5.3 Configure default 4 rows (minHeight: 120px)
- [ ] 5.4 Implement toolbar with: bold, italic, strikethrough, headings, lists, code blocks, tasks, tables, colors
- [ ] 5.5 Add Mermaid diagram support via custom Tiptap extension
- [ ] 5.6 Replace existing description inputs with MarkdownEditor

## 6. i18n Updates
- [x] 6.1 Update Chinese dictionary: change `slow-project` translations to `slow-burn`
- [x] 6.2 Update English dictionary: "Slow-burn Project" instead of "Long-term Project"
- [x] 6.3 Add new keys for indicators system
- [x] 6.4 Add new keys for Markdown editor
- [x] 6.5 Update Japanese dictionary (if exists)

## 7. Data Migration
- [ ] 7.1 Run SQL migration to update project types
- [ ] 7.2 Verify no slow-project records remain
- [ ] 7.3 Test backward compatibility (none needed, breaking change)

## 8. Testing
- [ ] 8.1 Test project creation with slow-burn type
- [ ] 8.2 Test indicators CRUD operations
- [ ] 8.3 Test progress calculation with various weight combinations
- [ ] 8.4 Test Tiptap editor in description fields
- [ ] 8.5 Test time format display across all pages
- [ ] 8.6 Test form validation (indicators weight sum must equal 100)

## 9. Documentation
- [ ] 9.1 Update API documentation
- [ ] 9.2 Update component documentation for MarkdownEditor
- [ ] 9.3 Update i18n key documentation
