# 习惯详情抽屉修复总结

## 修复内容

### 1. 修复增加/减少按钮无反应

**问题**: 增加和减少按钮点击后没有反应

**原因**: 
- API返回的数据格式是 `{ success: true, data: { currentCount: ... } }`，但前端代码直接访问了 `data.currentCount`
- 缺少 `current_count` 和 `target_count` 数据库字段

**修复**:
- 更新了 `HabitDetailDrawer.tsx` 正确处理API响应格式：`result.data.currentCount`
- 在 `db.ts` 中添加了数据库字段初始化
- 创建了 `init-habit-db` API端点用于手动初始化

### 2. 修复热力图假数据问题

**问题**: 热力图显示的都是假数据，不是真实的历史记录

**修复**:
- 完全重写了 `HeatmapSection.tsx` 组件
- 实现了 GitHub 风格的贡献热力图
- 颜色层次：#ebedf0 (0次) → #9be9a8 (1-2次) → #40c463 (3-5次) → #30a14e (6-8次) → #216e39 (9+次)
- 从数据库的 `task_history` 表读取真实数据

### 3. 修复热力图 tooltip 闪烁问题

**问题**: 鼠标移动上去 tooltip 一闪一闪的

**原因**: 
- tooltip 组件在 DOM 中频繁创建和销毁
- mouseEnter/mouseLeave 事件处理不当

**修复**:
- 使用 React state 管理 tooltip 显示状态
- 使用 `useCallback` 缓存事件处理函数
- 将 tooltip 渲染为固定定位的 DOM 元素，避免重渲染
- 添加了平滑的显示/隐藏过渡

### 4. 修复趋势图假数据问题

**问题**: 周完成趋势图显示的是示例数据，不是真实数据

**修复**:
- 更新了 `TrendSection.tsx` 组件
- 在没有数据时显示"暂无趋势数据"提示，而不是假数据
- 添加了渐变填充和数值标签

### 5. 数据库表结构

**新增表**:
```sql
CREATE TABLE task_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL,
  description TEXT DEFAULT '',
  user_id UUID,
  user_nickname VARCHAR(255),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**新增字段到 tasks 表**:
```sql
ALTER TABLE tasks ADD COLUMN current_count INT NOT NULL DEFAULT 0;
ALTER TABLE tasks ADD COLUMN target_count INT NOT NULL DEFAULT 12;
```

## API 端点

### 1. POST /api/tasks/[id]/increment
增加习惯完成计数

**响应**:
```json
{
  "success": true,
  "data": {
    "currentCount": 8,
    "totalCount": 46,
    "streak": 8,
    "earnedGold": 3.5
  }
}
```

### 2. POST /api/tasks/[id]/decrement
减少习惯完成计数

**响应**:
```json
{
  "success": true,
  "data": {
    "currentCount": 6,
    "totalCount": 44,
    "deductedGold": 3.5
  }
}
```

### 3. GET /api/tasks/[id]/heatmap
获取热力图数据（最近90天）

**响应**:
```json
{
  "success": true,
  "data": {
    "currentWeekCount": 12,
    "completionRate": 78,
    "longestStreak": 7,
    "days": [
      { "date": "2024-01-01", "count": 3 },
      ...
    ]
  }
}
```

### 4. GET /api/tasks/[id]/trends
获取周完成趋势数据

**响应**:
```json
{
  "success": true,
  "data": {
    "weeks": [
      { "week": 1, "completed": 5 },
      { "week": 2, "completed": 8 },
      ...
    ]
  }
}
```

### 5. POST /api/init-habit-db
初始化习惯相关的数据库表和字段

## 使用方法

### 1. 初始化数据库

访问以下端点初始化数据库：
```
POST /api/init-habit-db
```

或在应用启动时自动初始化（访问登录或注册页面）。

### 2. 运行测试

```bash
# 运行所有测试
cd apps/web
bash tests/run-habit-tests.sh

# 只运行单元测试
bash tests/run-habit-tests.sh --unit

# 只运行集成测试
bash tests/run-habit-tests.sh --integration

# 只运行E2E测试
bash tests/run-habit-tests.sh --e2e

# 生成覆盖率报告
bash tests/run-habit-tests.sh --coverage
```

### 3. 手动测试步骤

1. 打开应用并登录
2. 进入习惯列表页面
3. 点击任意习惯打开详情抽屉
4. 测试增加/减少计数按钮
5. 验证热力图显示真实数据
6. 验证趋势图显示真实数据
7. 测试未保存更改提示
8. 测试关闭抽屉功能

## GitHub 风格热力图特点

1. **颜色层次**: 
   - 浅灰 (#ebedf0): 无完成
   - 浅绿 (#9be9a8): 1-2次
   - 中绿 (#40c463): 3-5次
   - 深绿 (#30a14e): 6-8次
   - 最深绿 (#216e39): 9+次

2. **布局**: 横向显示52周，纵向显示周一到周日

3. **交互**: 
   - 鼠标悬停显示日期和完成次数
   - Tooltip 不闪烁，稳定显示
   - 点击格子可查看详情

4. **KPI指标**:
   - 本周完成：本周一至今的完成次数
   - 完成率：最近90天有完成的天数比例
   - 最长连击：连续有完成的最长天数

## 注意事项

1. **首次使用**: 需要先运行数据库初始化
2. **数据积累**: 热力图和趋势图需要至少几天的历史数据才能显示有意义的内容
3. **性能**: 热力图最多显示90天数据，趋势图最多显示12周数据
4. **兼容性**: 使用了现代CSS特性，建议在Chrome/Firefox/Safari最新版使用

## 故障排除

### 问题: 增加/减少按钮点击无反应
**解决**: 
- 检查浏览器控制台是否有错误
- 确认数据库已初始化（访问 `/api/init-habit-db`）
- 确认 task_history 表已创建

### 问题: 热力图为空
**解决**:
- 确认已完成过该习惯（增加计数）
- 检查数据库中 task_history 表是否有记录
- 等待API响应（可能需要几秒）

### 问题: Tooltip 仍然闪烁
**解决**:
- 清除浏览器缓存
- 刷新页面
- 检查是否有其他CSS冲突
