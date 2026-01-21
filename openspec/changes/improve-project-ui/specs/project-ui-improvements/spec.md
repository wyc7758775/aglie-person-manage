# project-ui-improvements Specification

## Purpose
改进项目管理页面的用户体验，统一编辑和查看功能，优化弹窗交互，添加动画效果，增强项目卡片的视觉效果。

## ADDED Requirements

### Requirement: 统一右侧抽屉弹窗
系统 SHALL 提供统一的右侧抽屉弹窗，支持查看和编辑两种模式。

#### Scenario: 打开查看模式抽屉
- **WHEN** 用户点击项目卡片
- **THEN** 系统从右侧滑出抽屉
- **AND** 抽屉显示项目详情（只读）
- **AND** 抽屉顶部显示"编辑"按钮

#### Scenario: 打开编辑模式抽屉
- **WHEN** 用户点击编辑按钮
- **THEN** 系统从右侧滑出抽屉
- **AND** 抽屉显示项目表单（可编辑）
- **AND** 抽屉顶部显示"查看"按钮

#### Scenario: 切换抽屉模式
- **WHEN** 用户在抽屉中点击"编辑"按钮
- **THEN** 抽屉内容切换为编辑模式
- **AND** 不关闭抽屉
- **WHEN** 用户在抽屉中点击"查看"按钮
- **THEN** 抽屉内容切换为查看模式
- **AND** 不关闭抽屉

#### Scenario: 关闭抽屉
- **WHEN** 用户点击抽屉的关闭按钮
- **OR** 用户点击抽屉外的遮罩层
- **OR** 用户按 ESC 键
- **THEN** 抽屉向右侧滑出并关闭
- **AND** 动画流畅且自然

#### Scenario: 抽屉响应式布局
- **GIVEN** 用户使用桌面设备（>= 1024px）
- **WHEN** 抽屉打开
- **THEN** 抽屉宽度为 600px
- **GIVEN** 用户使用平板设备（768px - 1023px）
- **WHEN** 抽屉打开
- **THEN** 抽屉宽度为屏幕宽度的 80%
- **GIVEN** 用户使用移动设备（< 768px）
- **WHEN** 抽屉打开
- **THEN** 抽屉宽度为 100% 屏幕

---

### Requirement: 抽屉动画效果
系统 SHALL 为抽屉添加流畅的滑入/滑出动画效果。

#### Scenario: 抽屉滑入动画
- **WHEN** 抽屉打开
- **THEN** 抽屉从右侧滑入（transform: translateX）
- **AND** 动画时长为 300ms
- **AND** 使用缓动曲线（cubic-bezier）

#### Scenario: 抽屉滑出动画
- **WHEN** 抽屉关闭
- **THEN** 抽屉向右侧滑出
- **AND** 动画时长为 300ms
- **AND** 动画流畅且自然

#### Scenario: 遮罩层淡入淡出
- **WHEN** 抽屉打开
- **THEN** 遮罩层淡入（opacity: 0 → 1）
- **WHEN** 抽屉关闭
- **THEN** 遮罩层淡出（opacity: 1 → 0）

---

### Requirement: 二次确认删除对话框
系统 SHALL 提供专门的二次确认删除对话框，替代浏览器原生 confirm。

#### Scenario: 显示删除确认对话框
- **WHEN** 用户点击抽屉中的删除按钮
- **THEN** 系统显示居中的确认对话框
- **AND** 对话框显示项目名称
- **AND** 对话框显示警告图标或红色主题
- **AND** 对话框包含确认和取消按钮

#### Scenario: 确认删除项目
- **WHEN** 用户在确认对话框中点击"确认删除"按钮
- **THEN** 系统调用删除 API
- **AND** 删除成功后关闭抽屉和确认对话框
- **AND** 刷新项目列表

#### Scenario: 取消删除项目
- **WHEN** 用户在确认对话框中点击"取消"按钮
- **THEN** 系统关闭确认对话框
- **AND** 不执行删除操作
- **AND** 抽屉保持打开状态

#### Scenario: 关闭确认对话框
- **WHEN** 用户点击确认对话框外的遮罩层
- **OR** 用户按 ESC 键
- **THEN** 确认对话框关闭
- **AND** 不执行删除操作

---

### Requirement: 进度条里程碑显示
系统 SHALL 在进度条上显示里程碑标记。

#### Scenario: 显示进度条
- **WHEN** 项目卡片或详情页渲染
- **THEN** 系统显示进度条
- **AND** 进度条显示当前完成百分比
- **AND** 进度条使用平滑动画（value 变化时）

#### Scenario: 显示里程碑标记
- **GIVEN** 项目有里程碑数据
- **WHEN** 进度条渲染
- **THEN** 系统在进度条对应位置显示里程碑标记
- **AND** 里程碑使用三角形（▲）或圆点（●）标记
- **AND** 里程碑位置根据 progress 值计算（left: ${value}%）
- **AND** 里程碑标记居中在进度条上

#### Scenario: 悬停显示里程碑标签
- **WHEN** 用户悬停在里程碑标记上
- **THEN** 系统显示里程碑标签
- **AND** 标签显示在标记上方
- **AND** 标签样式美观且易读

---

### Requirement: 里程碑编辑功能
系统 SHALL 支持在编辑模式下编辑项目里程碑。

#### Scenario: 显示里程碑列表
- **GIVEN** 抽屉处于编辑模式
- **WHEN** 进度条组件渲染
- **THEN** 系统显示里程碑编辑列表
- **AND** 列表显示所有里程碑
- **AND** 每个里程碑显示进度值和标签
- **AND** 提供删除按钮

#### Scenario: 添加里程碑
- **WHEN** 用户点击"添加里程碑"按钮
- **THEN** 系统在列表中添加新里程碑
- **AND** 默认值为 50%，默认标签为"新里程碑"
- **AND** 自动聚焦到新里程碑的输入框

#### Scenario: 编辑里程碑
- **WHEN** 用户修改里程碑的进度值或标签
- **THEN** 系统实时更新里程碑数据
- **AND** 验证进度值在 0-100 范围内

#### Scenario: 删除里程碑
- **WHEN** 用户点击里程碑的删除按钮
- **THEN** 系统从列表中移除该里程碑
- **AND** 更新进度条显示

#### Scenario: 验证里程碑值
- **WHEN** 用户输入里程碑进度值
- **AND** 值不在 0-100 范围内
- **THEN** 系统显示错误提示
- **AND** 不允许保存

---

### Requirement: 项目头像选择
系统 SHALL 支持从预设表情包中选择项目头像。

#### Scenario: 显示头像选择器
- **WHEN** 用户在编辑模式下打开抽屉
- **THEN** 系统在表单中显示头像选择器
- **AND** 显示标题"选择头像"
- **AND** 网格布局显示所有可用表情（20个）
- **AND** 当前选中的头像高亮显示

#### Scenario: 选择头像
- **WHEN** 用户点击某个表情
- **THEN** 系统将该表情选为项目头像
- **AND** 更新表单中的头像显示
- **AND** 选中状态高亮（蓝色边框）

#### Scenario: 头像悬停预览
- **WHEN** 用户悬停在某个表情上
- **THEN** 表情放大显示（scale: 1.2）
- **AND** 提供视觉反馈

#### Scenario: 默认头像
- **GIVEN** 项目类型为 'code'
- **WHEN** 创建新项目
- **THEN** 默认头像为 💻
- **GIVEN** 项目类型为 'life'
- **WHEN** 创建新项目
- **THEN** 默认头像为 🏠

---

### Requirement: 项目卡片背景优化
系统 SHALL 根据项目类型使用不同的半透明纯色背景。

#### Scenario: Code 项目背景色
- **GIVEN** 项目类型为 'code'
- **WHEN** 项目卡片渲染
- **THEN** 卡片背景色为蓝色半透明（rgba(59, 130, 246, 0.1)）

#### Scenario: Life 项目背景色
- **GIVEN** 项目类型为 'life'
- **WHEN** 项目卡片渲染
- **THEN** 卡片背景色为绿色半透明（rgba(16, 185, 129, 0.1)）

#### Scenario: 显示项目头像
- **WHEN** 项目卡片渲染
- **THEN** 卡片左上角显示选定的项目头像
- **AND** 头像尺寸为 32px
- **AND** 头像有轻微阴影和圆角

---

### Requirement: 项目卡片动画
系统 SHALL 为项目卡片添加悬停和进入动画效果。

#### Scenario: 卡片进入动画
- **WHEN** 项目列表渲染或筛选切换
- **THEN** 每个卡片淡入并从下方滑入
- **AND** 使用 staggered 延迟（每个卡片延迟 50ms）
- **AND** 动画时长为 300ms

#### Scenario: 卡片悬停动画
- **WHEN** 用户将鼠标悬停在项目卡片上
- **THEN** 卡片轻微上移（translateY(-2px)）
- **AND** 卡片阴影加深
- **AND** 动画时长为 200ms

#### Scenario: 卡片移出动画
- **WHEN** 筛选条件改变
- **THEN** 旧卡片淡出
- **AND** 动画时长为 200ms

---

### Requirement: 项目筛选动画
系统 SHALL 在筛选条件切换时添加动画效果。

#### Scenario: 筛选切换动画
- **WHEN** 用户点击筛选器按钮
- **THEN** 旧项目卡片淡出（opacity: 1 → 0）
- **AND** 新项目卡片淡入（opacity: 0 → 1）
- **AND** 动画时长为 300ms
- **AND** 新卡片从下方滑入

#### Scenario: 保持动画流畅
- **WHEN** 筛选切换动画执行中
- **THEN** 动画流畅不卡顿
- **AND** 使用 CSS transform 而非 layout 属性

---

## MODIFIED Requirements

### Requirement: 项目类型定义
系统 SHALL 扩展 Project 类型以支持头像和里程碑字段。

#### Scenario: Project 类型包含 avatar 字段
- **WHEN** 查看 Project 类型定义
- **THEN** Project 类型包含 avatar 字段（string）
- **AND** avatar 字段为可选（?）

#### Scenario: Project 类型包含 milestones 字段
- **WHEN** 查看 Project 类型定义
- **THEN** Project 类型包含 milestones 字段（Milestone[]）
- **AND** milestones 字段为可选（?）

#### Scenario: Milestone 类型定义
- **WHEN** 查看 Milestone 类型定义
- **THEN** Milestone 类型包含 value 字段（number, 0-100）
- **AND** Milestone 类型包含 label 字段（string）
