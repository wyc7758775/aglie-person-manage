# Agile Person Manage

个人敏捷项目管理系统，基于《人人都是产品经理》理念，将生活中的所有事务产品化管理。支持任务追踪、项目管理、需求规划、缺陷记录，并通过积分、徽章、等级系统激励持续行动。

## 📁 项目结构

本仓库采用 **pnpm workspace** 管理的 monorepo 架构：

```
├── apps/
│   ├── web/              # Next.js 15 主应用（App Router）
│   │   ├── app/          # 业务代码（页面、API、组件）
│   │   ├── tests/        # Vitest 单元/集成测试
│   │   └── e2e/          # Playwright E2E 测试
│   ├── docs/             # VitePress 产品设计文档站
│   └── e2e/              # 独立 E2E 测试工作区
├── packages/
│   └── product-designs/  # PRD、i18n 等产品设计 Markdown 内容
├── openspec/             # 产品需求与变更管理（OpenSpec）
└── scripts/              # 构建与部署脚本
```

### 核心目录说明

- **`apps/web/app/`** - Next.js App Router 主应用
  - `dashboard/` - 仪表盘、项目、任务等业务页面
  - `api/` - RESTful API 路由（认证、项目、任务、需求、缺陷）
  - `components/` - 可复用 UI 组件（表单、弹窗、图标等）
  - `lib/` - 工具函数、数据库操作、类型定义
- **`apps/docs/`** - VitePress 产品设计文档站（PRD/i18n），消费 `packages/product-designs`
- **`packages/product-designs/`** - 产品设计 Markdown 内容，目录约定 `{需求名}-{YYYYMMDD}`

## 🛠️ 技术栈

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 3.4
- **Database**: PostgreSQL (via `postgres` driver)
- **Auth**: NextAuth.js v5 (beta) + bcrypt
- **Testing**: Vitest + Playwright
- **Package Manager**: pnpm (workspace)

## 🚀 快速开始 (Getting Started)

### 1. 环境准备 (Prerequisites)

在开始之前，请确保你的开发环境满足以下要求：

- **Node.js**: >= 18.17.0 (推荐使用 LTS 版本)
- **Package Manager**: [pnpm](https://pnpm.io/) (推荐) 或 npm
- **Database**: PostgreSQL (本地安装或使用云数据库)

### 2. 安装依赖 (Installation)

```bash
# 克隆项目
git clone <repository-url>
cd agile-person-manage

# 在仓库根目录安装所有 workspace 依赖
pnpm install
```

### 3. 数据库配置 (Database Configuration)

项目使用 PostgreSQL 数据库。根据你的需求和环境，选择以下任意一种方案进行配置：

#### 方案 1：使用 Docker 启动 PostgreSQL（推荐）

最快速、最简单的方案，适合本地开发。

**使用 Docker 命令：**

```bash
docker run --name agile-postgres \
  -e POSTGRES_USER=agile_user \
  -e POSTGRES_PASSWORD=agile_password \
  -e POSTGRES_DB=agile_person_manage \
  -p 5432:5432 \
  -d postgres:16
```

**使用 Docker Compose（更方便）：**

项目提供了 `docker-compose.yml` 文件，可以直接运行：

```bash
docker-compose up -d postgres
```

然后配置 `.env` 文件：

```env
POSTGRES_URL="postgresql://agile_user:agile_password@localhost:5432/agile_person_manage"
```

#### 方案 2：使用云数据库（免安装）

无需本地安装数据库，使用免费的云 PostgreSQL 服务。

**推荐服务：**

- [Supabase](https://supabase.com) - 免费套餐，快速启动
- [Neon](https://neon.tech) - Serverless PostgreSQL，按需计费
- [Railway](https://railway.app) - 一键部署

**配置步骤：**

1. 注册账号并创建一个新的 PostgreSQL 项目
2. 复制数据库连接字符串（通常格式为 `postgres://user:password@host:port/dbname`）
3. 将连接字符串填入 `.env` 文件的 `POSTGRES_URL`

```env
POSTGRES_URL="postgres://your_user:your_password@your-host:5432/your_database"
```

#### 方案 3：本地安装 PostgreSQL

适合需要在本地进行数据库管理的开发者。

**安装方式：**

- **macOS**: `brew install postgresql@16` 或使用 [Postgres.app](https://postgresapp.com)
- **Windows**: 下载 [PostgreSQL 安装包](https://www.postgresql.org/download/windows/)
- **Linux**: `sudo apt install postgresql` (Ubuntu/Debian)

**配置步骤：**

1. 启动 PostgreSQL 服务
2. 创建数据库和用户：

```bash
# 连接到 PostgreSQL
psql -U postgres

# 创建数据库和用户
CREATE DATABASE agile_person_manage;
CREATE USER agile_user WITH PASSWORD 'agile_password';
GRANT ALL PRIVILEGES ON DATABASE agile_person_manage TO agile_user;

# 退出
\q
```

3. 配置 `.env` 文件：

```env
POSTGRES_URL="postgresql://agile_user:agile_password@localhost:5432/agile_person_manage"
```

#### 环境变量配置

复制环境变量示例文件：

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入你的数据库配置和 Auth 密钥：

```env
# Database Connection - 根据上述方案填入你的连接字符串
POSTGRES_URL="postgresql://your_user:your_password@localhost:5432/your_database"

# NextAuth Configuration
# 生成密钥命令: openssl rand -base64 32
AUTH_SECRET="your_generated_secret_key"
AUTH_URL="http://localhost:3000/api/auth"
```

**验证数据库连接：**

配置完成后，确保数据库服务正在运行：

```bash
# Docker
docker ps | grep agile-postgres

# 本地 PostgreSQL
pg_isready -h localhost -p 5432
```

### 4. 启动与初始化 (Run & Initialize)

1.  **启动开发服务器**（在仓库根目录）：

    ```bash
    pnpm dev
    ```
    根目录的 `pnpm dev` 会委托到主应用 `apps/web`。也可直接：`pnpm --filter web dev`。

2.  **初始化数据库 (仅首次运行)**：
    服务器启动后，打开浏览器访问 [http://localhost:3000/seed](http://localhost:3000/seed) 以创建表结构和初始数据。
    
    *如果看到 "Database seeded successfully" 消息，说明初始化成功。*
    
    **如果遇到连接错误：**
    - 检查数据库服务是否正在运行
    - 确认 `.env` 文件中的 `POSTGRES_URL` 配置正确
    - 查看终端日志中的详细错误信息

3.  **开始使用**：
    初始化完成后，直接访问 [http://localhost:3000](http://localhost:3000) 即可进入应用首页。

### 5. 产品设计文档站（可选）

- **本地开发**：`pnpm dev:docs` 或 `pnpm --filter docs dev`，访问 VitePress 文档站。
- **构建**：`pnpm build:docs`。
- **Docker 部署（如 NAS）**：从仓库根执行  
  `docker build -f apps/docs/Dockerfile -t agile-docs .`  
  运行：`docker run -p 8080:80 agile-docs`，通过 `http://<nas>:8080` 访问。  
  也可使用 `docker compose -f apps/docs/docker-compose.docs.yml up -d`。

### 6. 测试 (Testing)

项目使用 **Vitest** 进行单元测试和集成测试，**Playwright** 进行 E2E 测试。

```bash
# 运行所有测试（单元+集成）
pnpm --filter web test

# 单元测试
pnpm --filter web test:unit

# 集成测试
pnpm --filter web test:integration

# 监听模式运行测试
pnpm --filter web test:watch

# E2E 测试（独立工作区）
pnpm --filter e2e test          # 运行所有 E2E 测试
pnpm --filter e2e test:web      # 只测试 web 应用
pnpm --filter e2e test:docs     # 只测试 docs 应用
```

**E2E 浏览器安装（首次运行）**：
```bash
pnpm exec playwright install chromium
```

### 7. 主应用 Docker 构建

主应用镜像使用 `apps/web/Dockerfile`，在仓库根执行：

```bash
docker build -f apps/web/Dockerfile -t agile-web .
```

或使用项目提供的脚本（会构建并可选上传到 NAS）：`./plugins/docker-build.sh latest`。

---

## 📊 业务模块

| 模块 | 核心功能 | 关键特性 |
|:---|:---|:---|
| **🎯 概览 (Overview)** | 仪表盘数据看板 | 种田游戏化界面、今日任务、积分进度、连续打卡 |
| **📁 项目 (Project)** | 项目生命周期管理 | 支持 **life**（生活）/ **code**（代码）双类型，目标设定，标签分类 |
| **📋 需求管理 (Requirement)** | 需求规划与追踪 | 用户角色、优先级、时间规划、子需求拆分、Markdown 描述 |
| **✅ 任务管理 (Task)** | 任务执行与追踪 | 四种类型：**爱好/习惯/任务/欲望**，状态流转、优先级、预估工时 |
| **🐛 缺陷管理 (Defect)** | 代码项目 Bug 追踪 | 严重程度分级、状态管理、关联仓库信息 |
| **🏆 奖励机制 (Reward)** | 游戏化激励体系 | 积分、徽章、等级、兑换商店，通过种田游戏可视化呈现 |

### 任务类型说明

```
┌─────────┬─────────────┬─────────────────────────────────────┐
│ 类型    │ 英文名      │ 适用场景                            │
├─────────┼─────────────┼─────────────────────────────────────┤
│ 🎨 爱好 │ Hobby       │ 持续性兴趣活动（绘画、音乐、运动）  │
│ 🔄 习惯 │ Habit       │ 每日/周期性重复行为（阅读、早起）   │
│ 📌 任务 │ Task        │ 一次性待办事项                      │
│ 💎 欲望 │ Desire      │ 奖励性活动（游戏、追剧、美食）      │
└─────────┴─────────────┴─────────────────────────────────────┘
```

### 项目类型说明

- **`life`** — 生活项目：健身计划、学习计划、旅行规划、阅读清单等
- **`code`** — 代码项目：软件开发、开源贡献、技术调研等（支持缺陷管理）

## 🎮 积分与奖励系统

### 💡 设计原则

> **正向激励** · **轻量可见** · **节奏连续** · **个性可持续**

- 正向激励为主，奖励与个人长期目标一致
- 轻量、可见、可累积，避免复杂规则和计算负担
- 强化「节奏与连续性」，突出打卡与周完成率
- 奖励可自定义，保持个性化与可持续性

### 🏗️ 奖励结构

```
┌─────────────────────────────────────────────────────────────┐
│                    🏆 激励体系架构                           │
├──────────────┬──────────────────────────────────────────────┤
│ 💎 积分       │ 成长值 — 完成任务与番茄钟累计，核心货币       │
│ 🔥 连续打卡   │ Streak — 7/14/30 天关键节点触发加成与徽章     │
│ 🎖️ 徽章       │ 里程碑 — 周完成率、阻碍关闭、版本发布授予      │
│ ⭐ 等级       │ 段位 — 积分累积提升，解锁更高价值奖励          │
│ 🎁 兑换       │ 奖赏清单 — 用积分兑换自我奖赏，设周上限与冷却   │
└──────────────┴──────────────────────────────────────────────┘
```

### 📋 积分规则

| 行为 | 积分 | 上限/备注 |
|:---|:---:|:---|
| ✅ 完成日常任务 | +1 分/个 | 每日上限 6 分 |
| 🎯 当日完成 3 个任务 | +2 分（额外）| 叠加至任务积分 |
| 🍅 完成番茄钟 | +1 分/个 | 同一任务每日不超过 4 分 |
| 🔥 连续打卡 7 天 | +5 分 +「周稳进」徽章 | — |
| 🔥🔥 连续打卡 30 天 | +20 分 +「月恒心」徽章 | — |
| 📊 周完成率 ≥60% | +3 分 | 与下面档位叠加一次 |
| 📊 周完成率 ≥80% | +5 分 | — |
| 📊 周完成率 100% | +8 分 | — |
| 🚧 阻碍关闭 | +2 分/项 | 每周不超过 3 项 |
| 🔀 合并 PR | +2 分 | 代码项目专属 |
| 🚀 发布版本 | +5 分 | 代码项目专属 |
| 🐛 修复高优缺陷 | +3 分 | 代码项目专属 |
| 🧪 新增有效单测 | +1 分 | 代码项目专属 |

### 🎖️ 等级与徽章

**段位规则**：每累计 **100 分** 升 1 段

| 徽章名称 | 获得条件 |
|:---|:---|
| 🥉 周稳进 | 连续打卡 7 天 |
| 🥈 月恒心 | 连续打卡 30 天 |
| 🥇 四季常青 | 连续 4 周达标（完成率≥60%）|
| 🚀 首次发布 | 首次发布版本 |
| 🐛 Bug Hunter | 缺陷关闭率 ≥70% |
| ⭐ 段位徽章 | 每升 1 段自动解锁对应段位标识 |

### 🎁 兑换商店（示例）

| 奖励项 | 所需积分 | 冷却时间 |
|:---|:---:|:---|
| 🎬 看剧 1 集 | 10 分 | 24 小时 |
| ☕ 咖啡 1 杯 | 12 分 | 48 小时 |
| 🎮 游戏 30 分钟 | 8 分 | 24 小时 |
| 😴 半天休息 | 40 分 | 7 天 |

**兑换限制**：
- 周兑换上限：20–30 分
- 月兑换上限：100–150 分
- 兑换资格：当周完成率 ≥60%

### 📊 可视化展示

| 页面 | 展示内容 |
|:---|:---|
| 📍 今日页 | 积分进度条、当日上限提示、完成任务动效 |
| 📅 周期页 | 完成率环形图、连续打卡计数、当周积分统计 |
| 📝 复盘页 | 徽章授予动画、下周行动生成、奖励兑换按钮 |
| 🏛️ 里程碑墙 | 徽章陈列墙、段位成长曲线 |

### ⚖️ 反作弊与边界

- 📝 **证据轻量**：支持打卡截图 / 简短备注
- 🛡️ **上限保护**：每日/每周积分上限，防止过度堆叠
- ✅ **任务可验证**：每项任务需可完成、可验证
- 🎯 **自律优先**：奖励仅作辅助，核心仍是节奏和复盘
