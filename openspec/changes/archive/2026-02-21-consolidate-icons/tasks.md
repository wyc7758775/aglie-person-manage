# consolidate-icons 任务清单

## 任务1：创建 form 图标（3个）

### 1.1 创建 LockIcon.tsx
- [ ] 创建 `app/ui/icons/form/LockIcon.tsx`
- [ ] 内联 SVG，无依赖

### 1.2 创建 EyeIcon.tsx
- [ ] 创建 `app/ui/icons/form/EyeIcon.tsx`
- [ ] 内联 SVG，无依赖

### 1.3 创建 EyeOffIcon.tsx
- [ ] 创建 `app/ui/icons/form/EyeOffIcon.tsx`
- [ ] 内联 SVG，无依赖

**验证方式**：
- 文件创建成功

---

## 任务2：创建 feedback 图标（4个）

### 2.1 创建 NotificationIcon.tsx
- [ ] 创建 `app/ui/icons/feedback/NotificationIcon.tsx`
- [ ] 内联 SVG，无依赖

### 2.2 创建 SettingsIcon.tsx
- [ ] 创建 `app/ui/icons/feedback/SettingsIcon.tsx`
- [ ] 内联 SVG，无依赖

### 2.3 创建 StarIcon.tsx
- [ ] 创建 `app/ui/icons/feedback/StarIcon.tsx`
- [ ] 内联 SVG，无依赖

### 2.4 创建 DefectIcon.tsx
- [ ] 创建 `app/ui/icons/feedback/DefectIcon.tsx`
- [ ] 内联 SVG，无依赖

**验证方式**：
- 文件创建成功

---

## 任务3：创建 heroicons 包装（10个）

### 3.1 创建 outline 包装
- [ ] 创建 `app/ui/icons/heroicons/CalendarIcon.tsx`
- [ ] 创建 `app/ui/icons/heroicons/ClockIcon.tsx`
- [ ] 创建 `app/ui/icons/heroicons/ArrowRightIcon.tsx`
- [ ] 创建 `app/ui/icons/heroicons/ArrowLeftIcon.tsx`
- [ ] 创建 `app/ui/icons/heroicons/ArrowPathIcon.tsx`
- [ ] 创建 `app/ui/icons/heroicons/XMarkIcon.tsx`
- [ ] 创建 `app/ui/icons/heroicons/PowerIcon.tsx`
- [ ] 创建 `app/ui/icons/heroicons/MagnifyingGlassIcon.tsx`

### 3.2 创建 solid 包装
- [ ] 创建 `app/ui/icons/heroicons/ArrowSolidIcon.tsx` (20/solid)

**验证方式**：
- 所有文件从 `@heroicons/react` 正确导入

---

## 任务4：创建统一导出 index.ts

### 4.1 创建导出文件
- [ ] 创建 `app/ui/icons/index.ts`
- [ ] 导出所有 39 个图标
- [ ] 创建 Icons 映射对象（向后兼容）
- [ ] 创建 IconName 类型

**验证方式**：
- TypeScript 无类型错误

---

## 任务5：修改组件导入路径（18个文件）

### 5.1 修改 dashboard 页面导入
- [ ] `dashboard/notifications/page.tsx`
- [ ] `dashboard/habits/page.tsx`
- [ ] `dashboard/overview/page.tsx`
- [ ] `dashboard/requirement/page.tsx`
- [ ] `dashboard/task/page.tsx`
- [ ] `dashboard/defect/page.tsx`
- [ ] `dashboard/setting/page.tsx`
- [ ] `dashboard/project/page.tsx`

### 5.2 修改 ui 组件导入
- [ ] `ui/login-form.tsx`
- [ ] `ui/search.tsx`
- [ ] `ui/invoices/status.tsx`
- [ ] `ui/invoices/edit-form.tsx`
- [ ] `ui/invoices/buttons.tsx`
- [ ] `ui/invoices/create-form.tsx`
- [ ] `ui/invoices/pagination.tsx`
- [ ] `ui/dashboard/sidenav.tsx`
- [ ] `ui/dashboard/revenue-chart.tsx`
- [ ] `ui/dashboard/latest-invoices.tsx`
- [ ] `ui/dashboard/section-container.tsx`
- [ ] `ui/dashboard/task-card.tsx`
- [ ] `ui/dashboard/nav-links.tsx`

### 5.3 保持 app/ui/icons 导入
- [ ] `app/page.tsx` 保持导入路径
- [ ] `app/dashboard/topnav.tsx` 保持导入路径
- [ ] `app/dashboard/task/page.tsx` 的 UserIcon
- [ ] `app/ui/info-card.tsx` 保持导入路径

**验证方式**：
- 无 `@heroicons/react` 直接导入
- 所有组件从 `@/app/ui/icons` 导入

---

## 任务6：删除旧文件

### 6.1 删除 icons.tsx
- [ ] 删除 `app/ui/icons.tsx`

**验证方式**：
- 文件不存在

---

## 任务7：构建验证

### 7.1 运行构建
- [ ] 运行 `pnpm build`
- [ ] 无编译错误

### 7.2 验证无 Heroicons 直接导入
- [ ] 运行 `rg "from '@heroicons/react'" app --type ts`
- [ ] 确认返回 0 结果

**验证方式**：
- 构建成功
- 无直接 Heroicons 导入

---

## 验收检查清单

- [ ] 所有 39 个图标在 `app/ui/icons/` 子目录中找到
- [ ] `app/ui/icons/index.ts` 存在并正确导出
- [ ] 无 `@heroicons/react` 直接导入
- [ ] `pnpm build` 成功
- [ ] 旧的 `app/ui/icons.tsx` 已删除

---

## 预估工时

| 任务 | 预估时间 |
|------|----------|
| 创建 form 图标 | 5分钟 |
| 创建 feedback 图标 | 10分钟 |
| 创建 heroicons 包装 | 15分钟 |
| 创建 index.ts | 10分钟 |
| 修改组件导入 | 15分钟 |
| 删除旧文件 | 2分钟 |
| 构建验证 | 5分钟 |
| **总计** | **60分钟** |
