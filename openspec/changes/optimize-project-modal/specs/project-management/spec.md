## MODIFIED Requirements

### Requirement: 项目类型定义
系统 SHALL 支持简化的项目类型，包括冲刺项目和长期项目两种。

#### Scenario: 项目类型值定义
- **WHEN** 系统定义项目类型枚举
- **THEN** 类型值包括 `'sprint-project'` 和 `'slow-project'`
- **AND** 不再使用 `'life'` 和 `'code'` 作为项目类型值

#### Scenario: 项目类型显示格式
- **WHEN** 系统显示项目类型
- **THEN** sprint-project 显示为 ⚡ 冲刺项目（Sprint Project）
- **AND** slow-project 显示为 🌱 长期项目（Long-term Project）

#### Scenario: 历史数据类型映射
- **GIVEN** 数据库中存在类型为 `'life'` 的项目
- **WHEN** 系统读取该项目
- **THEN** 显示为 🌱 长期项目
- **AND** 类型值在内部处理时映射为 `'slow-project'`

#### Scenario: 历史数据类型映射 - code 类型
- **GIVEN** 数据库中存在类型为 `'code'` 的项目
- **WHEN** 系统读取该项目
- **THEN** 显示为 ⚡ 冲刺项目
- **AND** 类型值在内部处理时映射为 `'sprint-project'`

---

### Requirement: 项目创建与编辑弹窗
系统 SHALL 提供优化的项目创建/编辑弹窗，支持 ESC 关闭、二次确认和更好的视觉层次。

#### Scenario: ESC 关闭弹窗
- **GIVEN** 项目弹窗处于打开状态
- **WHEN** 用户按下 ESC 键
- **AND** 表单处于非编辑态（无未保存修改）
- **THEN** 弹窗直接关闭

#### Scenario: ESC 关闭二次确认
- **GIVEN** 项目弹窗处于打开状态
- **AND** 用户已修改表单字段（编辑态）
- **WHEN** 用户按下 ESC 键
- **THEN** 显示确认对话框询问「有未保存的修改，确定要关闭吗？」
- **AND** 用户选择「确定」后关闭弹窗并丢弃修改
- **AND** 用户选择「取消」后保持弹窗打开并保留修改

#### Scenario: 编辑态判定
- **GIVEN** 弹窗已加载初始表单值
- **WHEN** 任意表单字段值与初始值不同
- **THEN** 表单标记为编辑态

#### Scenario: 积分设置区域布局
- **WHEN** 用户查看积分设置区域
- **THEN** 「积分」label 与「根据优先级自动计算」单选框在同一行显示
- **AND** 单选框默认处于选中状态

#### Scenario: 积分自动计算启用
- **GIVEN** 「根据优先级自动计算」单选框处于选中状态
- **WHEN** 用户查看积分输入框
- **THEN** 积分输入框处于禁用状态或隐藏
- **AND** 积分值根据项目优先级自动计算

#### Scenario: 积分手动输入
- **GIVEN** 「根据优先级自动计算」单选框处于未选中状态
- **WHEN** 用户查看积分设置区域
- **THEN** 积分输入框处于启用状态
- **AND** 用户可手动输入积分值

#### Scenario: 弹窗视觉层次
- **WHEN** 用户查看弹窗表单
- **THEN** 表单 label 使用较淡的颜色（如 gray-400）
- **AND** 表单值/输入使用较深的颜色（如 gray-900）
- **AND** label 与 value 形成清晰的视觉层次

#### Scenario: 创建/保存按钮位置
- **WHEN** 用户查看弹窗底部操作区域
- **THEN** 「创建项目」或「保存」按钮位于右下角
- **AND** 按钮采用右对齐布局

---

### Requirement: 积分计算规则
系统 SHALL 提供调整后的积分计算规则，基数乘以 10 以提升价值感知。

#### Scenario: 积分基数调整
- **WHEN** 系统根据优先级自动计算积分
- **THEN** 使用新的积分基数（原基数 × 10）
- **AND** 低优先级项目默认积分为 100 分（原 10 分）
- **AND** 中优先级项目默认积分为 200 分（原 20 分）
- **AND** 高优先级项目默认积分为 300 分（原 30 分）

#### Scenario: 前端显示倍数
- **GIVEN** 后端保持原积分值存储
- **WHEN** 前端显示积分值时
- **THEN** 显示值 = 存储值 × 10
- **AND** 前端提交时提交值 = 显示值 ÷ 10

---

### Requirement: UI 组件库
系统 SHALL 提供可复用的 UI 组件库，供项目弹窗及其他模块使用。

#### Scenario: Modal 组件
- **WHEN** 开发者需要使用弹窗容器
- **THEN** 可从 `components/ui/modal` 导入 Modal 组件
- **AND** 组件支持 title、onClose、children 等 props
- **AND** 组件支持 ESC 键关闭

#### Scenario: FormInput 组件
- **WHEN** 开发者需要使用文本输入框
- **THEN** 可从 `components/ui/form-input` 导入 FormInput 组件
- **AND** 组件支持 label、placeholder、value、onChange 等 props

#### Scenario: FormSelect 组件
- **WHEN** 开发者需要使用下拉选择器
- **THEN** 可从 `components/ui/form-select` 导入 FormSelect 组件
- **AND** 组件支持 options、value、onChange、placeholder 等 props

#### Scenario: FormRadio 组件
- **WHEN** 开发者需要使用单选框
- **THEN** 可从 `components/ui/form-radio` 导入 FormRadio 组件
- **AND** 组件支持 label、checked、onChange 等 props

#### Scenario: FormDatePicker 组件
- **WHEN** 开发者需要使用日期选择器
- **THEN** 可从 `components/ui/form-date-picker` 导入 FormDatePicker 组件
- **AND** 组件支持 value、onChange、min、max 等 props

#### Scenario: FormLabel 组件
- **WHEN** 开发者需要使用表单标签
- **THEN** 可从 `components/ui/form-label` 导入 FormLabel 组件
- **AND** 组件支持 children、required、htmlFor 等 props
- **AND** 组件自动应用视觉层次样式

#### Scenario: ConfirmDialog 组件
- **WHEN** 开发者需要使用确认对话框
- **THEN** 可从 `components/ui/confirm-dialog` 导入 ConfirmDialog 组件
- **AND** 组件支持 title、message、onConfirm、onCancel 等 props

---

### Requirement: 动态主题色
系统 SHALL 支持动态主题色配置，所有 UI 组件根据主题配置渲染。

#### Scenario: 主题配置结构
- **WHEN** 系统初始化主题
- **THEN** 主题配置对象包含 primary、primaryLight、primaryDark 等颜色
- **AND** 默认主色与登录页主色保持一致

#### Scenario: 主题上下文
- **WHEN** 应用启动
- **THEN** ThemeProvider 提供主题配置
- **AND** 子组件可通过 ThemeContext 获取主题配置

#### Scenario: 组件主题应用
- **GIVEN** 主题配置已设置
- **WHEN** UI 组件渲染
- **THEN** 组件使用主题配置中的颜色值
- **AND** 支持通过 CSS 变量动态更新主题色

---

### Requirement: 编辑态动画移除
系统 SHALL 移除项目详情中编辑态到文本态的过渡动画。

#### Scenario: 编辑态切换无动画
- **GIVEN** 用户在项目详情中点击编辑按钮
- **WHEN** 界面从文本态切换到编辑态
- **THEN** 切换过程无 CSS transition 或 animation
- **AND** 界面立即显示编辑态

#### Scenario: 保存/取消无动画
- **GIVEN** 用户在编辑态点击保存或取消
- **WHEN** 界面从编辑态切换回文本态
- **THEN** 切换过程无 CSS transition 或 animation
- **AND** 界面立即显示文本态

#### Scenario: 保留弹窗动画
- **WHEN** 弹窗出现或消失
- **THEN** 保持现有的进入/退出动画
- **AND** 不影响用户体验
