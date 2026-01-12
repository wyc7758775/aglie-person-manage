# 变更：添加超级管理员账号

## 为什么
当前系统只有一个普通管理员账号 `admin/123456`，缺乏最高权限的管理员账户。为了满足开发阶段的管理需求，需要添加一个超级管理员账号 `wuyucun/wyc7758775`，拥有所有功能的访问权限。

## 变更内容
- 在用户数据中新增 `role` 字段，区分普通用户和超级管理员
- 添加超级管理员账号 `wuyucun/wyc7758775`
- 登录成功后返回 `isAdmin` 标记
- 登录界面默认填充超级管理员账号密码
- 后续可根据角色实现权限控制

## 影响
- 受影响的规范：`specs/auth/spec.md`（用户认证规范）
- 受影响的代码文件：
  - `app/lib/definitions.ts` - User 类型定义
  - `app/lib/placeholder-data.ts` - 用户数据
  - `app/lib/auth.ts` - 认证工具函数
  - `app/api/auth/login/route.ts` - 登录接口
  - `app/ui/login-form.tsx` - 登录表单组件
