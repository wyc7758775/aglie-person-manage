## Context

当前的任务详情抽屉 (`TaskDetailDrawer.tsx`) 是一个通用组件，用于展示所有任务类型的详情。然而，习惯（habit）作为一种特殊任务类型，需要更丰富的可视化展示（热力图、趋势图）和独特的交互模式（完成计数器、直接编辑备注）。

本次重构的目标是将习惯详情抽屉与通用任务详情抽屉分离，创建一个专门的习惯详情组件，严格遵循设计稿 OD72U 的规范。

## Goals

- 创建一个独立的 `HabitDetailDrawer` 组件，专门用于习惯类型
- 实现设计稿中的所有UI元素和交互
- 保持与现有数据模型的兼容性
- 确保良好的用户体验（流畅的动画、即时反馈）

## Non-Goals

- 不修改其他任务类型的详情展示
- 不改变数据库存储结构（除非必要）
- 不引入大型图表库（保持轻量级）

## Technical Decisions

### 1. 组件拆分策略

**方案A**: 在 TaskDetailDrawer 内增加条件渲染
- 优点：代码集中，易于维护
- 缺点：组件会变得臃肿，可读性差

**方案B**: 创建独立的 HabitDetailDrawer 组件
- 优点：职责单一，易于测试和迭代
- 缺点：可能有部分代码重复

**决策**: 采用方案B。习惯详情的特殊性（热力图、趋势图、计数器）值得独立组件。

### 2. 热力图实现方案

**方案A**: 使用现有图表库（如 recharts, chart.js）
- 优点：功能完善，开发快
- 缺点：增加 bundle 大小，可能过度设计

**方案B**: 纯 CSS/原生实现
- 优点：轻量，可控性高
- 缺点：开发工作量较大

**决策**: 采用方案B。热力图结构简单（7xN网格），原生实现足以满足需求。

### 3. 趋势图实现方案

**方案A**: 使用 SVG path 绘制折线
- 优点：精确控制，性能好
- 缺点：需要手动计算坐标

**方案B**: 使用 CSS border 技巧
- 优点：简单
- 缺点：不够灵活

**决策**: 采用方案A。SVG path 更适合动态数据展示。

### 4. 备注直接编辑的保存策略

**方案A**: onChange 实时保存
- 优点：数据不会丢失
- 缺点：API 请求频繁

**方案B**: onBlur 保存 + 防抖
- 优点：减少API请求
- 缺点：可能有短暂延迟

**决策**: 采用方案B。用户体验更好，且有保存状态提示。

## 数据需求

### 新增/修改的 Task 字段

```typescript
interface Task {
  // 现有字段...
  
  // 新增字段
  currentCount: number;      // 当前完成次数（今日）
  targetCount: number;       // 目标完成次数
  longestStreak: number;     // 最长连续天数
  
  // 频率改为支持：每日/每周/每月
  frequency: 'daily' | 'weekly' | 'monthly';
}

// 热力图数据API响应
interface HeatmapData {
  currentWeekCount: number;  // 本周完成
  completionRate: number;    // 完成率（百分比）
  longestStreak: number;     // 最长连击
  days: {
    date: string;            // 日期 YYYY-MM-DD
    count: number;           // 当日完成次数
  }[];                       // 最近90天数据
}

// 趋势数据API响应
interface TrendData {
  weeks: {
    week: number;            // 周编号（W1, W2...）
    completed: number;       // 该周完成次数
  }[];
}
```

### API 端点需求

**前端已存在端点复用：**
- `PUT /api/tasks/{id}` - 更新任务（复用：保存 description、difficulty、frequency、goldReward）

**后端需要新增的端点：**
1. `POST /api/tasks/{id}/increment` - 增加完成计数
   - 增加今日完成次数
   - 自动计算并发放金币奖励
   - 更新连续天数

2. `POST /api/tasks/{id}/decrement` - 减少完成计数
   - 减少今日完成次数（最低为0）
   - 扣减相应金币（如有）

3. `GET /api/tasks/{id}/heatmap` - 获取热力图数据
   - 返回最近90天的每日完成数据
   - 计算并返回：本周完成、完成率、最长连击

4. `GET /api/tasks/{id}/trends` - 获取趋势图数据
   - 返回最近N周的每周完成数据
   - N根据实际数据量决定（最少1周，自动缩放）

## UI 组件层次

```
HabitDetailDrawer
├── PanelHeader
│   ├── TypeBadge (习惯)
│   ├── TaskId (可复制)
│   └── CloseButton
├── ScrollableContent
│   ├── TitleRow
│   │   ├── TaskTitle
│   │   └── CompletionCounter (+/-)
│   ├── StatsCard (深色)
│   │   ├── StreakBox (连续天数)
│   │   ├── GoldBox (金币)
│   │   └── CountBox (完成次数)
│   ├── InfoGrid (浅色)
│   │   ├── DifficultyInfo (难度: 简单/中等/困难) [hover编辑]
│   │   ├── FrequencyInfo (频率: 每日/每周/每月) [hover编辑]
│   │   └── GoldRewardInfo (金币奖励: +X G/次) [hover编辑]
│   ├── DescSection
│   │   ├── DescHeader
│   │   ├── RichTextEditor (可编辑)
│   │   └── DescHint
│   ├── HeatmapSection
│   │   ├── HeatHeader
│   │   ├── HeatCard
│   │   │   ├── KpiRow
│   │   │   │   ├── 本周完成 (绿色)
│   │   │   │   ├── 完成率 (橙色)
│   │   │   │   └── 最长连击 (蓝色)
│   │   │   ├── MonthRow
│   │   │   ├── BodyRow (WeekLabels + HeatGrid)
│   │   │   └── LegendRow
│   │   └── ScrollHint
│   └── TrendSection
│       ├── TrendTitle
│       ├── TrendChart (SVG, 自动缩放)
│       └── XAxisLabels
├── UnsavedChangesDialog (关闭前确认)
```

## 设计还原工作流程（使用 pencil mcp）

### 开发前
1. **获取设计稿根节点数据**：使用 `pencil_batch_get` 获取 Node ID: OD72U 的完整属性
2. **递归获取子节点**：遍历所有子节点（PanelHeader, titleRow, statsCard, infoGrid, descSection, heatmapSection, trendSection）
3. **建立样式对照表**：提取并记录所有关键属性：
   - 颜色值：fill, textColor, stroke.fill
   - 尺寸值：width, height, padding, gap, cornerRadius
   - 字体属性：fontFamily, fontSize, fontWeight, lineHeight
   - 布局属性：layout, alignItems, justifyContent

### 开发中
1. **边开发边对照**：每完成一个组件，对照设计稿节点数据检查
2. **使用精确值**：不允许目测估算，必须使用设计稿中的精确数值
3. **颜色提取示例**：
   ```typescript
   // 从设计稿读取的值
   const statsCardBg = '#1A1D2E';  // 来自 eCm6l.fill
   const accentColor = '#E8944A';  // 来自 MU0Bq.fill
   const successColor = '#2E7D32'; // 来自 H8fyr.fill
   ```

### 开发后验证
1. **截图对比**：使用浏览器截图工具捕获实现效果
2. **数值核对**：对比实际实现的 CSS 值与设计稿属性值
3. **像素级检查**：确保误差在允许范围内（颜色：完全匹配，尺寸：±1px）

## 样式规范

### 颜色系统

- 主背景: `#FFFFFF`
- 深色卡片: `#1A1D2E`
- 浅色卡片: `#F5F0F0`
- 习惯强调色: `#E8944A`
- 成功色: `#4CAF50`
- 文字主色: `#1A1D2E`
- 文字次要: `rgba(26, 29, 46, 0.5)`
- 边框色: `rgba(26, 29, 46, 0.08)`

### 尺寸规范

- 抽屉宽度: 561px
- 头部高度: 60px
- 内容内边距: 24px
- 卡片圆角: 16px (大), 12px (中), 10px (小)
- 间距: 遵循 4px 网格系统

## 风险评估

| 风险 | 可能性 | 影响 | 缓解措施 |
|------|--------|------|----------|
| API 数据格式不匹配 | 中 | 高 | 先确认后端接口 |
| 热力图性能问题 | 低 | 中 | 虚拟滚动或分页 |
| 与现有编辑抽屉冲突 | 中 | 中 | 保留现有编辑逻辑 |

## Open Questions

所有问题已确认：

1. ✅ 热力图数据：最近90天
2. ✅ 趋势图：自动适应，有多少周显示多少周，最少1周，自动缩放折线
3. ✅ 统计卡片第三项：完成次数（不是生命值）
4. ✅ 完成逻辑：完全用计数器替代"标记完成"按钮
5. ✅ 后端数据：需要新增API端点（heatmap, trends, increment, decrement）
6. ✅ 可编辑项：难度、频率、金币奖励三个方块，hover显示编辑按钮
7. ✅ 备注编辑：使用现有富文本编辑器
8. ✅ 关闭抽屉：有未保存更改时弹出确认对话框
