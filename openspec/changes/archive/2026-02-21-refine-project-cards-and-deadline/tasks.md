# Tasks: refine-project-cards-and-deadline

## 1. 卡片容器内滚动（不撑长整页）

- [x] 1.1 确保列表内容区在容器内滚动
  - 在 `app/dashboard/project/page.tsx` 或 `app/ui/dashboard/section-container.tsx` 中，使卡片列表所在区域具有固定或最大高度，并设置 `overflow-y: auto`（或等价 Tailwind：如 `overflow-y-auto`、`min-h-0`、`flex-1` 等），保证超出部分在容器内出现垂直滚动条，整页不随内容撑长
  - 头部（SectionContainer 的标题、筛选、添加按钮）保持不随内容滚动
  - 验证：项目数量较多时，仅卡片区域可滚动，整页不滚动

- [x] 1.2 确认其他使用 SectionContainer 的页面
  - 若在 SectionContainer 上做了通用可滚动改动，检查其他调用方布局是否仍符合预期；否则仅在项目页对 children 包一层可滚动容器
  - 验证：仅项目列表页或所有使用该容器的页面行为符合设计

## 2. 项目卡片尺寸缩小

- [x] 2.1 缩小项目卡片整体尺寸
  - 在 `app/dashboard/project/page.tsx` 的 ProjectCard 中调整：内边距（如 `p-4` → `p-3`）、标题/描述字号、头像或类型图标尺寸（如 `text-3xl` → `text-2xl`）、进度条高度、标签与间距等，使单卡更紧凑、一屏可展示更多卡片
  - 可选：微调 grid 的 `gap` 与列数（如 `lg:grid-cols-3` → `lg:grid-cols-4`）以配合小卡片
  - 验证：列表页一屏可见卡片数量增加，卡片仍清晰可读、可点击

## 3. 截止时间状态展示（过期/临近/中性）

- [x] 3.1 实现截止时间状态计算
  - 在 `app/dashboard/project/page.tsx`（或抽成工具函数）中，根据项目 `endDate` 与当前日期计算：是否已过期、是否「即将截止」（如 7 天内或 3 天内，阈值可配置或写死），以及可选「紧急程度」（结合剩余天数与 `progress` 用于颜色深浅）
  - 验证：给定不同 endDate 与 progress 的 mock 数据，状态判断正确

- [x] 3.2 截止时间展示样式与表情
  - **已过期**：截止时间文字使用红色系（如 `text-red-600` 或更深），并在时间前显示过期相关表情（如 ⏰ 或约定表情）；可根据过期天数适当加深颜色
  - **即将截止**：使用黄色/琥珀色警告样式（如 `text-amber-600` / `text-yellow-600`）；可根据「距截止日剩余时间」与「当前进度」使颜色逐渐加深（进度越低、时间越近则越深）
  - **未临近**：使用中性样式（如 `text-gray-600` 或与卡片其他次要文字一致）
  - 无 endDate 时继续显示「-」或占位，不显示表情
  - 验证：过期、临近、未临近、无日期四种情况在列表中显示正确

- [ ] 3.3 可选：i18n 与无障碍
  - 若需「已过期」「即将截止」等提示文案，在 i18n 字典中新增键并在卡片上按需显示（如 tooltip 或 sr-only）
  - 验证：中英文切换与读屏场景下信息完整

## 4. 验证与收尾

- [x] 4.1 功能与视觉验证
  - 手动检查：列表在容器内滚动、卡片尺寸缩小、截止时间三种状态样式与表情正确
  - 验证：行为符合本变更 spec 中的 ADDED Requirements

- [x] 4.2 构建与校验
  - 运行 `pnpm build` 确保无 TypeScript 与构建错误
  - 运行 `openspec validate refine-project-cards-and-deadline --strict` 确保提案与 delta 格式正确
