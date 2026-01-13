# i18n-support Specification

## Purpose
为系统提供完整的国际化支持，支持中英文切换，包括UI文本和API消息的本地化。

## ADDED Requirements

### Requirement: 国际化框架基础设施
系统 SHALL 提供React Context基础的i18n框架，支持多语言切换。

#### Scenario: LanguageProvider初始化
- **WHEN** 应用启动
- **THEN** LanguageProvider SHALL 自动检测浏览器语言设置
- **AND** 如果localStorage中有保存的语言偏好，优先使用保存的值
- **AND** 默认语言为中文(zh-CN)

#### Scenario: useLanguage Hook使用
- **WHEN** 组件调用 `useLanguage()` Hook
- **THEN** 返回 `{ locale, setLocale, t }` 对象
- **AND** `locale` 为当前语言代码
- **AND** `setLocale` 为切换语言函数
- **AND** `t` 为翻译函数

#### Scenario: 翻译函数调用
- **WHEN** 调用 `t('common.buttons.save')`
- **THEN** 返回当前语言对应的翻译文本
- **AND** 如果键不存在，返回原始键名

---

### Requirement: 语言切换功能
系统 SHALL 提供用户可操作的语言切换界面。

#### Scenario: 语言切换组件显示
- **WHEN** 用户访问Dashboard页面
- **THEN** 页面右上角显示语言切换器
- **AND** 切换器显示当前语言标识（中文或EN）

#### Scenario: 执行语言切换
- **WHEN** 用户点击语言切换按钮
- **THEN** 系统保存用户选择到localStorage
- **AND** 系统触发完整页面刷新
- **AND** 刷新后页面以新语言显示

#### Scenario: 语言偏好持久化（未登录用户）
- **WHEN** 未登录用户切换语言
- **THEN** 语言偏好保存至localStorage的`user-locale`键
- **AND** 下次访问时自动读取并应用

#### Scenario: 语言偏好持久化（已登录用户）
- **WHEN** 已登录用户切换语言
- **THEN** 语言偏好保存至localStorage
- **AND** 语言偏好同步保存至用户数据库记录
- **AND** 下次登录时从数据库读取偏好设置

---

### Requirement: 登录页面国际化
系统 SHALL 提供登录页面的中英文翻译。

#### Scenario: 登录页面中文显示
- **GIVEN** 当前语言为中文
- **WHEN** 用户访问登录页面
- **THEN** 显示中文文本："登录"、"让每天都充实且有意义"等

#### Scenario: 登录页面英文显示
- **GIVEN** 当前语言为英文
- **WHEN** 用户访问登录页面
- **THEN** 显示英文文本："Log in"、"Make every day fulfilling and rewarding"等

#### Scenario: 登录表单字段翻译
- **WHEN** 登录页面加载
- **THEN** 昵称输入框占位符为对应语言文本
- **AND** 密码输入框占位符为对应语言文本
- **AND** 确认密码输入框占位符为对应语言文本

---

### Requirement: Dashboard页面国际化
系统 SHALL 提供所有Dashboard页面的中英文翻译。

#### Scenario: 导航菜单翻译
- **WHEN** Dashboard页面加载
- **THEN** 左侧导航菜单项显示为对应语言
- **AND** 包含：概览/Overview、项目/Project、需求/Requirement、任务/Task等

#### Scenario: 概览页面翻译
- **WHEN** 用户访问概览页面
- **THEN** 所有页面标题、按钮、提示文本显示为对应语言

#### Scenario: 各功能页面翻译
- **WHEN** 用户访问任意功能页面（项目、需求、任务、缺陷等）
- **THEN** 页面内所有UI文本显示为对应语言
- **AND** 包括表单标签、按钮、表格头、提示信息等

---

### Requirement: API响应消息国际化
系统 SHALL 提供API响应消息的多语言支持。

#### Scenario: 认证API消息翻译
- **WHEN** 用户注册失败（昵称已存在）
- **THEN** 响应消息根据用户语言偏好返回对应文本
- **AND** 中文返回"用户已存在"
- **AND** 英文返回"User already exists"

#### Scenario: 登录错误消息翻译
- **WHEN** 用户登录失败（密码错误）
- **THEN** 响应消息根据用户语言偏好返回对应文本
- **AND** 中文返回"密码错误"
- **AND** 英文返回"Incorrect password"

#### Scenario: 通用错误消息翻译
- **WHEN** 系统返回通用错误
- **THEN** 错误消息根据语言设置显示对应翻译
- **AND** 包括网络错误、未授权、服务器错误等

---

### Requirement: 翻译字典结构规范
系统 SHALL 采用统一的翻译字典结构组织翻译文本。

#### Scenario: 字典命名规范
- **WHEN** 创建新的翻译条目
- **THEN** 使用点分隔的层级命名（如：`module.section.key`）
- **AND** 键名应语义化表达用途
- **AND** 保持中英文字典结构一致

#### Scenario: 通用翻译分类
- **WHEN** 添加通用UI元素翻译
- **THEN** 使用`common`命名空间
- **AND** 按类型细分为`buttons`、`errors`、`messages`等

#### Scenario: 页面翻译分类
- **WHEN** 添加页面特定翻译
- **THEN** 使用页面名称作为命名空间
- **AND** 如`login`、`dashboard.nav`、`dashboard.overview`等

---

### Requirement: 浏览器语言自动检测
系统 SHALL 在首次访问时自动检测并应用浏览器语言偏好。

#### Scenario: 中文浏览器环境
- **GIVEN** 用户浏览器语言设置为中文
- **WHEN** 用户首次访问应用
- **THEN** 系统默认显示中文界面

#### Scenario: 英文浏览器环境
- **GIVEN** 用户浏览器语言设置为英文
- **WHEN** 用户首次访问应用
- **THEN** 系统默认显示英文界面

#### Scenario: 其他语言浏览器环境
- **GIVEN** 用户浏览器语言既非中文也非英文
- **WHEN** 用户首次访问应用
- **THEN** 系统默认显示中文界面（作为fallback）

---

## Cross-Reference

- **Authentication**: 语言偏好存储与用户认证系统集成
- **User Preferences**: 用户偏好API需要支持语言设置读写
- **UI Components**: 语言切换器组件与现有UI组件风格一致
