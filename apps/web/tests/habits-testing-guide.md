# Habit Detail Drawer 测试指南

## 测试文件结构

```
apps/web/tests/
├── unit/
│   └── habits/
│       ├── PanelHeader.test.tsx
│       ├── TitleRow.test.tsx
│       ├── StatsCard.test.tsx
│       ├── InfoGrid.test.tsx
│       ├── DescSection.test.tsx
│       ├── HeatmapSection.test.tsx
│       ├── TrendSection.test.tsx
│       ├── UnsavedChangesDialog.test.tsx
│       └── index.ts
├── integration/
│   └── habits/
│       └── api.test.ts
└── e2e/
    └── habits/
        └── habit-detail-drawer.spec.ts
```

## 运行测试

### 单元测试
```bash
# 运行所有单元测试
pnpm test:unit

# 运行习惯组件测试
pnpm test:unit habits

# 带覆盖率报告
pnpm test:unit --coverage
```

### 集成测试
```bash
# 运行API集成测试
pnpm test:integration
```

### E2E测试
```bash
# 运行E2E测试
pnpm test:e2e

# 运行特定E2E测试文件
pnpm test:e2e habits/habit-detail-drawer.spec.ts

# 带UI模式
pnpm test:e2e --ui
```

## 测试覆盖范围

### 单元测试 (Unit Tests)

1. **PanelHeader**
   - ✓ 渲染任务ID
   - ✓ 显示习惯类型标签
   - ✓ 点击关闭按钮触发onClose
   - ✓ 点击任务ID复制到剪贴板
   - ✓ 头部高度60px
   - ✓ 习惯标签颜色正确

2. **TitleRow**
   - ✓ 渲染任务标题
   - ✓ 显示完成计数
   - ✓ 点击增加按钮触发onIncrement
   - ✓ 点击减少按钮触发onDecrement
   - ✓ 计数为0时减少按钮禁用
   - ✓ 计数器使用绿色样式

3. **StatsCard**
   - ✓ 渲染三个统计项
   - ✓ 深色卡片背景色
   - ✓ 统计框半透明白色背景
   - ✓ 数值白色大号字体
   - ✓ 显示金币图标
   - ✓ 显示连击图标
   - ✓ 显示完成图标

4. **InfoGrid**
   - ✓ 渲染三个信息项
   - ✓ 显示编辑规则提示
   - ✓ hover显示编辑按钮
   - ✓ 点击编辑显示选择器
   - ✓ 金币奖励橙色显示
   - ✓ 浅色卡片背景
   - ✓ 更改难度触发onDifficultyChange

5. **DescSection**
   - ✓ 渲染标题
   - ✓ 显示描述内容
   - ✓ 无描述时显示占位符
   - ✓ 点击进入编辑模式
   - ✓ 失去焦点保存内容
   - ✓ 显示提示文本
   - ✓ 编辑框边框样式
   - ✓ 保存时显示保存中状态

6. **HeatmapSection**
   - ✓ 渲染标题
   - ✓ 显示KPI指标
   - ✓ KPI指标颜色正确
   - ✓ 显示热力图网格
   - ✓ 显示星期标签
   - ✓ 显示图例
   - ✓ 显示滚动提示
   - ✓ 无数据时使用模拟数据
   - ✓ hover显示tooltip

7. **TrendSection**
   - ✓ 渲染标题
   - ✓ 显示周标签
   - ✓ 渲染SVG图表
   - ✓ 渲染折线
   - ✓ 渲染数据点
   - ✓ 图表容器样式正确
   - ✓ 无数据时使用模拟数据
   - ✓ 渲染基线

8. **UnsavedChangesDialog**
   - ✓ isOpen为false时不渲染
   - ✓ isOpen为true时渲染
   - ✓ 显示警告图标
   - ✓ 显示取消和确认按钮
   - ✓ 点击取消触发onCancel
   - ✓ 点击确认触发onConfirm
   - ✓ 确认按钮橙色背景
   - ✓ 点击遮罩层触发onCancel
   - ✓ 正确的z-index

### 集成测试 (Integration Tests)

**API Routes**
1. POST /api/tasks/[id]/increment
   - ✓ 增加计数并返回新值
   - ✓ 不存在任务返回404
   - ✓ 添加历史记录

2. POST /api/tasks/[id]/decrement
   - ✓ 减少计数并返回新值
   - ✓ 计数为0返回400
   - ✓ 防止负数

3. GET /api/tasks/[id]/heatmap
   - ✓ 返回热力图数据
   - ✓ 每天包含count字段

4. GET /api/tasks/[id]/trends
   - ✓ 返回趋势数据
   - ✓ 每周包含week和completed字段
   - ✓ 无历史数据返回示例数据

### E2E测试 (Chrome DevTools MCP)

1. **导航和基础**
   - ✓ 导航到习惯页面
   - ✓ 显示习惯列表
   - ✓ 点击习惯打开详情抽屉

2. **功能测试**
   - ✓ 抽屉样式正确
   - ✓ 显示习惯标题
   - ✓ 显示完成计数器
   - ✓ 点击增加按钮增加计数
   - ✓ 显示统计卡片
   - ✓ 显示热力图
   - ✓ 显示趋势图
   - ✓ 点击关闭按钮关闭抽屉
   - ✓ 未保存更改显示确认对话框
   - ✓ ESC键关闭抽屉

3. **像素级设计验证**
   - ✓ 抽屉颜色白色
   - ✓ 统计卡片深色
   - ✓ 截图对比

## 测试数据准备

### 数据库准备
确保测试数据库有以下表：
- tasks
- task_history

### 测试任务数据
```sql
INSERT INTO tasks (
  id, title, description, type, status, difficulty,
  project_id, points, gold_reward, current_count, target_count
) VALUES (
  'test-habit-001', '测试习惯', '测试描述', 'habit', 'todo', 'medium',
  'test-project', 10, 3.5, 5, 10
);
```

## Chrome DevTools MCP 使用说明

E2E测试使用 Chrome DevTools MCP 进行自动化测试，主要功能包括：

1. **页面导航**
   ```typescript
   await page.goto('http://localhost:3000/dashboard/habits');
   ```

2. **元素选择**
   ```typescript
   const element = await page.$('[data-testid="habit-item"]');
   ```

3. **元素交互**
   ```typescript
   await element.click();
   await element.fill('text');
   ```

4. **样式验证**
   ```typescript
   const styles = await element.evaluate((el) => {
     return window.getComputedStyle(el).backgroundColor;
   });
   ```

5. **截图对比**
   ```typescript
   const screenshot = await element.screenshot();
   ```

## 持续集成

建议在CI/CD流程中添加以下步骤：

```yaml
- name: Run Unit Tests
  run: pnpm test:unit --coverage

- name: Run Integration Tests
  run: pnpm test:integration

- name: Run E2E Tests
  run: pnpm test:e2e
```

## 覆盖率目标

- 单元测试覆盖率：≥ 80%
- 集成测试覆盖率：≥ 70%
- E2E测试：关键用户流程全覆盖

## 故障排除

### 常见问题

1. **单元测试失败**
   - 检查组件是否正确导出
   - 确认测试数据格式正确
   - 检查mock函数是否正确设置

2. **集成测试失败**
   - 确认数据库连接正常
   - 检查API端点URL正确
   - 验证测试数据已清理

3. **E2E测试失败**
   - 确认应用已启动
   - 检查选择器是否正确
   - 增加等待时间

## 更新测试

当组件更新时，请同步更新对应的测试：
1. 修改测试文件
2. 运行测试验证
3. 更新测试文档
