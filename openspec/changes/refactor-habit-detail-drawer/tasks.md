## 实施任务清单

### 1. 准备工作
- [x] 1.1 检查现有 TaskDetailDrawer 组件结构
- [x] 1.2 确认 Task 类型定义是否包含所需字段（currentCount, targetCount, heatmapData, trendData, longestStreak）
- [x] 1.3 设计热力图和趋势图的数据结构
- [x] 1.4 创建数据库迁移（如需要新字段）
- [x] **1.5 使用 pencil mcp 获取设计稿精确数据**
  - 调用 `pencil_batch_get` 获取 Node ID: OD72U 及所有子节点的完整属性
  - 提取所有颜色值（fill, textColor, stroke）
  - 提取所有尺寸（width, height, padding, gap）
  - 提取所有字体属性（fontFamily, fontSize, fontWeight）
  - 建立设计规范对照表供开发参考

### 2. 核心组件开发
- [x] 2.1 重构 PanelHeader 组件
  - 添加任务ID显示（可复制）
  - 调整关闭按钮样式
  
- [x] 2.2 实现 CompletionCounter 组件
  - 创建带 +/- 按钮的计数器
  - 实现增减逻辑和API调用
  
- [x] 2.3 重构 statsCard 区域
  - 改为3列布局
  - 更新图标和文案（连续天数、金币、生命值）
  
- [x] 2.4 重构 infoGrid 区域
  - 显示难度、频率、金币奖励
  - 添加编辑规则提示文本

### 3. 新增可视化组件
- [x] 3.1 开发 HabitHeatmap 组件
  - 实现热力图网格渲染
  - 添加月份标签
  - 添加KPI指标行（连续天数、完成率、平均完成）
  - 添加图例
  
- [x] 3.2 开发 HabitTrendChart 组件
  - 实现简单的折线图
  - 添加周标签（W1-W6）

### 4. 功能实现
- [x] 4.1 实现备注直接编辑功能（前端）
  - 集成现有的富文本编辑器组件
  - 添加 onBlur 自动保存
  - 添加保存状态指示
  
- [x] 4.2 实现任务ID复制功能
  - 集成 Clipboard API
  - 添加复制成功提示
  
- [x] 4.3 实现完成计数增减API（后端）
  - 创建 POST /api/tasks/{id}/increment 端点
  - 创建 POST /api/tasks/{id}/decrement 端点
  - 更新完成次数和金币奖励计算

- [x] 4.4 实现习惯配置更新API（后端）
  - 更新 PATCH /api/tasks/{id} 支持 difficulty、frequency、goldReward 字段
  - 实现编辑后自动计算"今日预计"值

- [x] 4.5 实现热力图数据API（后端）
  - 创建 GET /api/tasks/{id}/heatmap 端点
  - 返回最近90天的每日完成数据
  - 计算"本周完成"、"完成率"、"最长连击"

- [x] 4.6 实现趋势图数据API（后端）
  - 创建 GET /api/tasks/{id}/trends 端点
  - 返回最近N周的每周完成数据
  - 自动适应数据量（最少1周）

- [x] 4.7 实现未保存更改检测（前端）
  - 追踪 description、difficulty、frequency、goldReward 的修改状态
  - 实现确认对话框组件
  - 在 overlay 点击、ESC、关闭按钮时触发确认

### 5. 样式调整
- [x] 5.1 匹配设计稿颜色
  - 背景色：#1A1D2E（深色卡片）
  - 强调色：#E8944A（习惯类型）
  - 成功色：#4CAF50（完成状态）
  
- [x] 5.2 调整间距和字体
  - 头部高度 60px
  - 内容区域 padding 24px
  - 字体大小和权重匹配设计稿

### 6. 测试验证
- [x] 6.1 手动测试所有交互
  - 打开/关闭抽屉
  - 增减完成计数
  - 编辑备注
  - 复制任务ID
  
- [x] **6.2 像素级设计还原验证（关键）**
  - 使用 `pencil_batch_get` 重新获取设计稿数据作为基准
  - 对每个组件进行截图对比（实现效果 vs 设计稿）
  - 验证颜色值完全匹配（十六进制值完全一致）
  - 验证尺寸误差在 ±1px 范围内
  - 验证间距误差在 ±2px 范围内
  - 验证字体属性完全匹配
  - 使用截图对比工具检查相似度 ≥ 98%
  
- [x] 6.3 验证视觉一致性
  - 对比设计稿截图
  - 检查响应式布局
  
- [x] 6.4 运行构建验证
  - `pnpm build` 无错误
  - TypeScript 类型检查通过

### 7. 文档更新
- [x] 7.1 更新组件注释
- [x] 7.2 添加使用示例
