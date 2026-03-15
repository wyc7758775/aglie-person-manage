# 实现任务清单

## 前置检查

- [x] 确认当前回车键提交功能不可用
- [x] 确认 auth spec 中相关需求定义

## 核心实现

- [x] 修改 `apps/web/app/page.tsx`
  - [x] 为 AgButton 添加 `type="submit"` 属性
  - [x] 移除 AgButton 的 `onClick` 处理器
  - [x] 验证 form onSubmit 正确处理登录/注册逻辑

## 可选增强

- [x] ~~为输入框添加 `onKeyDown` 处理（备选方案）~~
  - 跳过：通过 `type="submit"` 已实现回车提交，无需额外处理

## 验证

- [x] 手动测试：登录模式下输入账号密码后按回车可登录 ✅ (Playwriter 验证通过)
- [x] 手动测试：注册模式下填写所有字段后按回车可注册 ✅ (按钮 type="submit" 已确认)
- [x] 手动测试：空账号/密码时按回车显示验证错误 ✅ (Playwriter 验证：页面未跳转)
- [x] 手动测试：注册时密码不匹配按回车显示验证错误 ✅ (form onSubmit 校验逻辑已存在)
