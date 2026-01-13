# add-i18n-support 任务清单

## 阶段1：基础设施搭建

### 1.1 创建i18n核心结构
- [ ] 创建 `app/lib/i18n/` 目录结构
  - `index.ts` - 主入口，导出 Context 和 Hook
  - `context.tsx` - LanguageContext 定义
  - `types.ts` - 类型定义
  - `dictionary.ts` - 字典主文件
  - `dictionary.zh.ts` - 中文翻译
  - `dictionary.en.ts` - 英文翻译

**验证方式**：
- 运行 `ls -la app/lib/i18n/` 确认目录结构
- 运行 `pnpm build` 确保无类型错误

### 1.2 实现LanguageProvider
- [ ] 实现 `LanguageContext` 和 `LanguageProvider` 组件
- [ ] 实现 `useLanguage` Hook
- [ ] 实现翻译函数 `t()` 支持参数替换
- [ ] 实现 localStorage 读写
- [ ] 实现浏览器语言检测

**验证方式**：
- 编写测试用例验证翻译函数
- 手动测试 localStorage 读写

### 1.3 集成LanguageProvider
- [ ] 修改 `app/layout.tsx` 包裹 LanguageProvider
- [ ] 修改 `app/dashboard/layout.tsx` 确保正确嵌套

**验证方式**：
- 运行开发服务器确认无报错
- 在控制台检查 Context 是否正确初始化

---

## 阶段2：语言切换组件

### 2.1 创建LanguageSwitcher组件
- [ ] 创建 `app/ui/language-switcher.tsx`
- [ ] 实现中英文切换按钮
- [ ] 实现按钮样式（与现有UI风格一致）
- [ ] 集成到TopNav组件

**验证方式**：
- 访问Dashboard页面确认组件可见
- 点击切换按钮确认页面刷新
- 检查localStorage确认语言已保存

### 2.2 集成到导航栏
- [ ] 修改 `app/ui/dashboard/topnav.tsx` 添加语言切换器
- [ ] 调整布局确保视觉一致性

**验证方式**：
- 在所有Dashboard页面确认切换器可见
- 测试响应式布局

---

## 阶段3：翻译字典建设

### 3.1 通用翻译
- [ ] 翻译 common.buttons 按钮文本
- [ ] 翻译 common.errors 错误消息
- [ ] 翻译 common.messages 提示消息

**验证方式**：
- 检查所有按钮文本是否正确
- 触发错误场景验证错误消息

### 3.2 登录页面翻译
- [ ] 翻译 login.title 和 subtitle
- [ ] 翻译 login.nickname, password, confirmPassword
- [ ] 翻译 login.loginButton, registerButton
- [ ] 翻译 login.switchingToRegister/Login

**验证方式**：
- 在登录页面切换语言确认所有文本翻译正确

### 3.3 Dashboard导航翻译
- [ ] 翻译 dashboard.nav 所有导航项
- [ ] 翻译 dashboard.overview 页面文本
- [ ] 翻译 dashboard.project 页面文本
- [ ] 翻译 dashboard.requirement 页面文本
- [ ] 翻译 dashboard.task 页面文本
- [ ] 翻译 dashboard.defect 页面文本
- [ ] 翻译 dashboard.rewards 页面文本
- [ ] 翻译 dashboard.dailies 页面文本
- [ ] 翻译 dashboard.habits 页面文本
- [ ] 翻译 dashboard.todos 页面文本
- [ ] 翻译 dashboard.notifications 页面文本
- [ ] 翻译 dashboard.setting 页面文本

**验证方式**：
- 逐个访问各页面确认文本翻译正确
- 创建翻译检查清单并标记完成

---

## 阶段4：API消息国际化

### 4.1 创建API消息映射
- [ ] 创建 `app/lib/i18n/api-messages.ts`
- [ ] 添加所有API响应消息的中英文映射

**验证方式**：
- 检查消息映射完整性

### 4.2 修改认证API
- [ ] 修改 `/api/auth/login/route.ts` 支持国际化消息
- [ ] 修改 `/api/auth/register/route.ts` 支持国际化消息

**验证方式**：
- 测试登录/注册场景验证消息语言
- 分别使用中文和英文界面测试

### 4.3 修改其他API
- [ ] 修改任务相关API的消息
- [ ] 修改项目相关API的消息
- [ ] 修改奖励相关API的消息

**验证方式**：
- 测试各模块的增删改查操作

---

## 阶段5：用户偏好持久化

### 5.1 创建用户偏好API
- [ ] 创建 `/api/user/preference/route.ts`
- [ ] 实现 POST 方法保存偏好
- [ ] 实现 GET 方法获取偏好

**验证方式**：
- 测试API响应格式正确
- 测试错误处理

### 5.2 集成数据库
- [ ] 修改用户数据模型添加语言偏好字段
- [ ] 实现登录时从数据库读取语言偏好
- [ ] 实现保存时同步到数据库

**验证方式**：
- 创建新用户测试默认语言
- 修改语言偏好后刷新页面确认保持
- 退出登录后重新登录确认偏好保持

---

## 阶段6：现有页面国际化

### 6.1 登录页面重构
- [ ] 修改 `app/page.tsx` 使用翻译函数
- [ ] 替换所有硬编码文本为 `t()` 调用
- [ ] 处理动态文本（如用户名）

**验证方式**：
- 切换语言确认所有文本更新

### 6.2 Dashboard页面重构
- [ ] 逐个修改 `app/dashboard/*/page.tsx`
- [ ] 使用 `useLanguage` Hook
- [ ] 替换硬编码文本为翻译

**验证方式**：
- 完整遍历所有Dashboard页面
- 标记所有已完成的页面

### 6.3 组件国际化
- [ ] 修改 `app/ui/dashboard/nav-links.tsx`
- [ ] 修改 `app/ui/dashboard/topnav.tsx`
- [ ] 修改 `app/ui/ag-button.tsx`
- [ ] 修改其他公共组件

**验证方式**：
- 检查各组件在不同语言下的显示

---

## 阶段7：验证与清理

### 7.1 完整测试
- [ ] 测试语言切换流程（本地存储）
- [ ] 测试语言切换流程（数据库）
- [ ] 测试页面刷新后语言保持
- [ ] 测试游客用户场景
- [ ] 测试登录用户场景
- [ ] 测试所有API消息国际化

**验证方式**：
- 创建测试用例清单
- 手动执行所有测试场景

### 7.2 构建验证
- [ ] 运行 `pnpm build` 无错误
- [ ] 运行类型检查 `pnpm tsc --noEmit`
- [ ] 验证生产环境部署

**验证方式**：
- 执行构建命令确认成功

### 7.3 代码清理
- [ ] 移除临时测试代码
- [ ] 添加必要的注释
- [ ] 更新 AGENTS.md 国际化相关说明

**验证方式**：
- 代码审查确认无冗余代码

---

## 依赖关系

### 可并行任务
- 1.1 和 1.2 可部分并行
- 3.x 系列任务可按页面并行
- 6.x 系列任务可按页面并行

### 顺序依赖
- 1.3 依赖 1.1, 1.2
- 2.2 依赖 2.1
- 3.1 依赖 1.1
- 4.x 依赖 3.1
- 5.x 依赖 1.3, 2.1
- 6.x 依赖 1.2, 2.1, 3.x
- 7.1 依赖 6.x
- 7.2 依赖 7.1

---

## 验收检查清单

- [ ] 所有UI文本可翻译
- [ ] 语言切换实时刷新
- [ ] localStorage持久化正常
- [ ] 数据库持久化正常（登录用户）
- [ ] 浏览器语言检测正常
- [ ] API消息国际化正常
- [ ] 构建成功
- [ ] 无类型错误
- [ ] 性能无明显下降
- [ ] UI样式一致

---

## 预估工时

| 阶段 | 任务数 | 预估时间 |
|------|--------|----------|
| 阶段1 | 3 | 2-3小时 |
| 阶段2 | 2 | 1-2小时 |
| 阶段3 | 13 | 4-6小时 |
| 阶段4 | 3 | 2-3小时 |
| 阶段5 | 2 | 1-2小时 |
| 阶段6 | 13 | 6-8小时 |
| 阶段7 | 3 | 2-3小时 |
| **总计** | **39** | **18-27小时** |
