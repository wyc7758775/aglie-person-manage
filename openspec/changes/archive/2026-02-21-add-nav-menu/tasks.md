# add-nav-menu 任务清单

## 任务1：创建导航菜单组件

### 1.1 创建 NavMenu.tsx
- [ ] 创建 `app/ui/dashboard/NavMenu.tsx`
- [ ] 导入图标组件
- [ ] 定义页面链接数据
- [ ] 实现菜单展开/收起状态
- [ ] 添加动画效果

### 1.2 组件结构
```tsx
// 组件结构
NavMenu
├── MenuButton (菜单按钮)
└── DropdownMenu (下拉菜单)
    ├── MenuItem (概览)
    ├── MenuItem (项目)
    ├── MenuItem (需求)
    ├── MenuItem (任务)
    ├── MenuItem (缺陷)
    ├── MenuItem (奖励)
    ├── MenuItem (习惯)
    ├── MenuItem (每日)
    └── MenuItem (设置)
```

### 1.3 样式要求
- 菜单按钮固定在页面右上角
- 下拉菜单向右展开
- 使用像素风格与现有 UI 保持一致
- 添加展开/收起动画

**验证方式**：
- [x] 组件可正确渲染
- [x] 展开/收起功能正常
- [x] 动画流畅

---

## 任务2：集成到 Farming 页面

### 2.1 修改 GameContainer.tsx
- [ ] 导入 NavMenu 组件
- [ ] 在页面右上角添加 NavMenu
- [ ] 确保菜单在游戏元素之上显示

**验证方式**：
- [x] 菜单正确显示在页面上
- [x] 点击菜单可以展开

---

## 任务3：构建验证

### 3.1 运行构建
- [ ] 运行 `pnpm build`
- [ ] 无编译错误
- [ ] 无类型错误

**验证方式**：
- [x] 构建成功

---

## 页面链接清单

| 页面 | 路径 | 图标 |
|-----|------|------|
| 概览 | /dashboard/overview | DashboardIcon |
| 项目 | /dashboard/project | ProjectIcon |
| 需求 | /dashboard/requirement | DatabaseIcon |
| 任务 | /dashboard/task | TaskIcon |
| 缺陷 | /dashboard/defect | DefectIcon |
| 奖励 | /dashboard/rewards | RewardIcon |
| 习惯 | /dashboard/habits | HabitIcon |
| 每日 | /dashboard/dailies | DailyIcon |
| 设置 | /dashboard/setting | SettingsIcon |

---

## 预估工时

| 任务 | 预估时间 |
|------|----------|
| 创建导航菜单组件 | 30分钟 |
| 集成到 Farming 页面 | 10分钟 |
| 构建验证 | 5分钟 |
| **总计** | **约 45 分钟** |

---

## 验收检查清单

- [ ] 页面右上角显示菜单按钮
- [ ] 点击按钮展开导航菜单
- [ ] 菜单显示所有 dashboard 子页面
- [ ] 点击菜单项跳转到对应页面
- [ ] 菜单支持收起/展开动画
- [ ] 与现有 UI 风格保持一致
- [ ] `pnpm build` 成功
