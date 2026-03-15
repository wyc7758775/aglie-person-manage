# 登录表单回车键提交支持

## Why

当前登录界面填写完账号和密码后，按回车键无法触发登录操作，用户体验不佳。用户需要手动点击登录按钮，增加了操作成本。

## What Changes

### 问题分析

1. 登录表单已有 `<form onSubmit={...}>` 结构
2. 但提交按钮 `AgButton` 默认 `type="button"`，未设置为 `type="submit"`
3. 在某些浏览器中，表单没有 `type="submit"` 的按钮时，回车键可能无法触发表单提交

### 修改内容

1. **登录页面 (`apps/web/app/page.tsx`)**
   - 为登录/注册按钮添加 `type="submit"` 属性
   - 移除按钮的 `onClick` 处理（由 form onSubmit 统一处理）
   - 确保 form 内的 input 支持回车触发提交

2. **可选优化**
   - 为输入框添加 `onKeyDown` 处理作为备选方案（兼容性更好）

## Impact

- **用户体验**: 提升，用户可通过回车键快速提交表单
- **兼容性**: 无影响，纯功能增强
- **风险**: 低，仅修改表单提交逻辑

## Related Spec

- `auth/spec.md` - "带校验的回车键提交" Requirement (100-123行)
