# Change: 项目管理新增项目类型筛选

## Why
当前项目管理页面只提供了项目状态筛选功能（全部/正常/有风险/失控），用户希望能够同时按项目类型（冲刺项目/慢燃项目）筛选项目列表，以便更灵活地查看和管理不同类型的项目。

## What Changes
- 在项目列表页面新增项目类型筛选器
- 项目类型筛选器与现有的状态筛选器同时存在
- 支持组合筛选：可以同时按状态和类型筛选
- UI 上两个筛选器独立显示，互不影响

## Impact
- Affected specs: project-management
- Affected code: 
  - `apps/web/app/dashboard/project/page.tsx` - 项目列表页面
  - `apps/web/app/dashboard/project/components/` - 可能需要新增筛选组件或修改现有筛选逻辑
