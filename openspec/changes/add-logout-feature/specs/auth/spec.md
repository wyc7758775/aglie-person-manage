# auth Specification

## Purpose
TBD - created by archiving change add-superadmin-account. Update Purpose after archive.

## ADDED Requirements

### Requirement: 用户退出登录
系统 SHALL 提供退出登录功能，用户可以安全退出系统。

#### Scenario: 点击退出图标执行退出
- **GIVEN** 用户已登录并访问Dashboard页面
- **WHEN** 用户点击导航栏底部的退出图标
- **THEN** 系统清除localStorage中的认证信息（`lastLoginNickname` 和 `lastLoginPassword`）
- **AND** 系统重定向用户到登录页面

#### Scenario: 退出后访问受保护页面
- **GIVEN** 用户已执行退出登录
- **WHEN** 用户尝试直接访问 `/dashboard/overview`
- **THEN** 系统将用户重定向到登录页面

#### Scenario: 退出API响应
- **WHEN** 调用 `/api/auth/logout` 接口
- **THEN** 接口返回 `{ success: true, message: "退出成功" }`

---

## MODIFIED Requirements

### Requirement: 登录界面默认填充
系统 SHALL 在登录界面默认填充超级管理员的账号和密码。

#### Scenario: 登录页面初始状态
- **WHEN** 用户访问登录页面
- **THEN** 账号输入框默认值为 `wuyucun`
- **AND** 密码输入框默认值为 `wyc7758775`

---

## Cross-Reference

- **Navigation**: 退出图标位于 `topnav.tsx` 底部
- **Storage**: 使用localStorage存储认证凭据
