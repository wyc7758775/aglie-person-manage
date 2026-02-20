# 重构产品需求文档 Skill

## 用途

将 packages/product-designs 中的产品需求文档从时间维度重构为业务功能模块维度，生成结构化的业务文档供 apps/docs 消费。

## 功能模块映射

根据当前 PRD 内容，划分为以下业务模块：

### 1. 项目管理模块
包含所有与项目相关的功能需求：
- 项目 CRUD 操作
- 项目类型（sprint-project / slow-burn）
- 项目状态（正常/有风险/失控）
- 项目详情与弹窗
- 项目描述编辑器
- 项目指标系统（slow-burn 特有）

### 2. 用户与认证模块
- 用户注册/登录
- 用户-项目关联
- 数据持久化
- 会话管理

### 3. 导航与架构模块
- 侧边栏导航结构
- 项目详情页布局
- 路由设计
- Tab 切换逻辑

### 4. 任务管理模块
- 任务 CRUD
- 任务类型（爱好/习惯/任务/欲望）
- 任务状态流转

### 5. 需求管理模块
- 需求 CRUD
- 需求看板
- 需求与项目关联

### 6. 缺陷管理模块
- 缺陷 CRUD
- 缺陷严重程度
- 缺陷状态
- 代码项目特有

### 7. 积分与奖励模块
- 积分计算逻辑
- 积分基数调整
- 徽章系统
- 等级系统
- 积分兑换

### 8. UI/设计系统模块
- 色彩系统
- 字体系统
- 组件规范
- Logo 与品牌
- 动效规范
- 玻璃态设计

## 输出结构

```
apps/docs/product/
├── index.md              # 产品文档总览
├── 00-index.md           # 模块索引
├── 01-project/           # 项目管理模块
│   ├── index.md          # 模块概览
│   └── module.md         # 详细功能
├── 02-auth/              # 用户认证模块
│   ├── index.md
│   └── module.md
├── 03-navigation/        # 导航架构模块
│   ├── index.md
│   └── module.md
├── 04-task/              # 任务管理模块
│   ├── index.md
│   └── module.md
├── 05-requirement/       # 需求管理模块
│   ├── index.md
│   └── module.md
├── 06-defect/            # 缺陷管理模块
│   ├── index.md
│   └── module.md
├── 07-rewards/           # 积分奖励模块
│   ├── index.md
│   └── module.md
└── 08-design/            # 设计系统模块
    ├── index.md
    └── module.md
```

## 使用方法

### 方式一：使用 skill 命令（推荐）

在对话中直接调用：

```
/skill reorganize-prd
```

### 方式二：直接运行脚本

```bash
# 在项目根目录执行
node .opencode/skills/reorganize-prd/reorganize.js

# 或
make reorganize-prd
```

### 方式三：通过 pnpm 脚本

```bash
pnpm reorganize:prd
```

## 前置条件

运行前请确保：
1. packages/product-designs 目录存在且包含 PRD 文件
2. apps/docs 目录存在（VitePress 文档站）
3. 有写入 apps/docs/product/ 目录的权限

## 工作流程

此 skill 将：
1. 扫描 packages/product-designs 下所有 prd.md 文件
2. 根据内容特征自动分类到各业务模块
3. 按模块合并生成新的文档
4. 更新 apps/docs/product/ 目录结构
5. 自动更新 VitePress 配置（如需要）

## 查看生成的文档

```bash
# 启动文档站
pnpm dev:docs

# 访问 http://localhost:5173/product/ 查看重构后的文档
```

## 文档结构说明

### 总览页 (index.md)
- 显示所有功能模块的统计信息
- 快速导航到各模块
- 最近更新的需求列表

### 模块概览页 (*/index.md)
每个模块包含：
- 模块概述和核心概念
- 相关需求文档列表（按时间倒序）
- 功能清单（合并所有相关 PRD）
- 快速链接到详细文档

### 详细功能页 (*/module.md)
- 按时间倒序列出所有相关 PRD
- 保留原始需求的完整内容
- 标注来源和实现状态

## 维护说明

### 当新增 PRD 文件时：
1. 将新 PRD 放入 packages/product-designs/{需求名}-{日期}/
2. 运行此 skill 重新生成业务模块文档
3. 新增的 PRD 内容会自动合并到对应模块

### 当需要更新分类规则时：
编辑 `.opencode/skills/reorganize-prd/reorganize.js` 中的 `MODULE_RULES` 对象。

## 当前 PRD 映射关系

| PRD 文件 | 主要模块 | 次要模块 |
|----------|----------|----------|
| 项目管理增强-20260201 | 项目管理 | - |
| 用户与项目数据持久化-20260204 | 用户认证 | 项目管理 |
| 导航架构调整-20260202 | 项目管理 | 导航架构 |
| 项目弹窗优化-20260211 | 项目管理 | 积分奖励、UI设计 |
| slow-burn项目优化-20260216 | 项目管理 | UI设计 |
| UI设计规范-20260219 | 设计系统 | - |
| 品牌视觉系统升级-20260219 | 设计系统 | - |

## 变更日志

- **2026-02-19**: 初始版本，支持 7 个现有 PRD 文件的重构
  - 自动生成 8 个功能模块文档
  - 支持自动分类和去重
  - 集成 VitePress 侧边栏配置

## 注意事项

1. **保留历史信息**：每个功能点标注来源 PRD 和日期
2. **冲突处理**：若多个 PRD 对同一功能有不同定义，以最新 PRD 为准
3. **增量更新**：重新生成时会保留已有的内容结构
4. **备份建议**：首次运行前建议备份 apps/docs/product/ 目录
