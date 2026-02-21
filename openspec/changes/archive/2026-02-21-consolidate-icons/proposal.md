# consolidate-icons 提案

## 项目概述

将分散在项目中的全局 icon 收集到 `app/ui/icons/` 文件夹中，实现统一管理和导出。

## 目标

- 创建 `app/ui/icons/` 目录结构
- 将所有图标（自定义和 Heroicons）按功能分类
- 创建统一的 `index.ts` 导出入口
- 修改所有组件使用新的图标路径
- 删除旧的 `app/ui/icons.tsx` 文件

## 当前状态

| 来源 | 数量 | 位置 | 问题 |
|------|------|------|------|
| 自定义图标 | 17 个 | `app/ui/icons.tsx` (419行） | 无分类，文件过大 |
| Heroicons | 约 10 种 | 18 处直接导入 | 分散管理，无统一 |

### 当前 Heroicons 使用统计

| 图标 | 使用次数 | 来源 |
|------|----------|------|
| CalendarIcon | 4 | notifications, task, revenue-chart |
| ClockIcon | 3 | notifications, defect, status |
| CheckIcon | 4 | notifications, task-card, status |
| XMarkIcon | 1 | notifications |
| PlusIcon | 4 | habits, section-container, buttons, create-form |
| PencilIcon | 2 | buttons, edit-form |
| TrashIcon | 1 | buttons |
| ArrowRightIcon | 2 | pagination |
| ArrowLeftIcon | 1 | pagination |
| ArrowPathIcon | 1 | latest-invoices |
| PowerIcon | 1 | sidenav |
| MagnifyingGlassIcon | 1 | search |
| ArrowSolidIcon | 1 | login-form (20/solid) |

## 实施范围

### 包含
- 创建完整图标目录结构
- 迁移所有自定义图标（39 个）
- 创建 Heroicons 包装模块（10 种图标）
- 创建统一的 `index.ts` 导出
- 修改 18 个组件的导入路径
- 删除旧的 `app/ui/icons.tsx`

### 不包含
- 新增图标（仅收集现有）
- 修改图标样式或行为
- 优化图标性能

## 成功标准

1. 所有图标可在 `app/ui/icons/` 的子目录中找到
2. `app/ui/icons/index.ts` 统一导出所有图标
3. 无 `@heroicons/react` 直接导入（全部通过包装模块）
4. `pnpm build` 成功

## 时间线

预估工时：1-1.5 小时

## 依赖关系

无外部依赖，仅内部重构
