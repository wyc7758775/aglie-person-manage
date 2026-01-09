# Agile Person Manage

个人敏捷管理系统，帮助你管理生活、代码项目、任务与习惯。

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

# 安装依赖
pnpm install
# 或者
npm install
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

1.  **启动开发服务器**：

    ```bash
    pnpm dev
    # 或者
    npm run dev
    ```

2.  **初始化数据库 (仅首次运行)**：
    服务器启动后，打开浏览器访问 [http://localhost:3000/seed](http://localhost:3000/seed) 以创建表结构和初始数据。
    
    *如果看到 "Database seeded successfully" 消息，说明初始化成功。*
    
    **如果遇到连接错误：**
    - 检查数据库服务是否正在运行
    - 确认 `.env` 文件中的 `POSTGRES_URL` 配置正确
    - 查看终端日志中的详细错误信息

3.  **开始使用**：
    初始化完成后，直接访问 [http://localhost:3000](http://localhost:3000) 即可进入应用首页。

---

# 项目模块定义

- 概览 (Overview): 三种任务类型：爱好、习惯、任务、欲望。
- 项目（Project）：类型 life | code ，含目标与标签。
- 需求（Requirement）：描述功能、用户角色、优先级、截止时间。
- 任务（Task）：标题、说明、状态、优先级、预计时长、截止时间。
- 缺陷（Defect，代码项目）：标题、严重程度、状态、关联仓库信息（非必填）。
- 奖励 (Reward）： 欲望池水,展示用户完成任务的奖励，如积分、徽章、兑换项等。

# 积分

设计原则

- 正向激励为主，奖励与个人长期目标一致。
- 轻量、可见、可累积，避免复杂规则和计算负担。
- 强化“节奏与连续性”，突出打卡与周完成率。
- 奖励可自定义，保持个性化与可持续性。
奖励结构

- 积分（成长值）：完成任务与番茄钟累计，作为核心货币。
- 连续打卡（Streak）：7/14/30 天等关键节点触发加成与徽章。
- 徽章（里程碑）：周完成率、阻碍关闭、版本发布、长期里程碑授予。
- 等级（段位）：积分累积提升段位，解锁更高价值的奖励。
- 兑换（奖赏清单）：用积分兑换你的自我奖赏，设定每周上限与冷却。
积分规则（建议初版）

- 日常任务：完成 1 个 +1 分，3 个当日 +2 额外分（每日上限 6 分）。
- 番茄钟：每 1 个 +1 分；同一任务累计不超过 4 分/日。
- 连续打卡：满 7 天 +5 分与“周稳进”徽章；满 30 天 +20 分与“月恒心”徽章。
- 周完成率：≥60% +3 分，≥80% +5 分，100% +8 分（叠加一次）。
- 阻碍关闭：每项 +2 分，每周计分不超过 3 项。
- 代码项目加成：合并 PR +2 分；发布版本 +5 分；修复高优缺陷 +3 分；新增有效单测 +1 分。
等级与徽章

- 段位：每累计 100 分升 1 段，解锁更高价兑换项或专属徽章。
- 徽章示例：7 天稳进、30 天恒心、连续 4 周达标、首次版本发布、缺陷关闭率≥70%。
- 展示：个人档案页汇总徽章与段位，形成长期成就感。
兑换与奖赏

- 奖励库示例：看剧 1 集（10 分）、咖啡 1 杯（12 分）、游戏 30 分钟（8 分）、半天休息（40 分）。
- 周兑换上限：建议 20–30 分；月上限：建议 100–150 分，避免过度“刷分”。
- 透明规则：兑换需当周完成率≥60%；重复兑换设冷却（如咖啡 48 小时）。
- 申领流程：在复盘页“领取奖励”，记录兑换项与积分扣除，形成仪式感。
可视化与仪式

- 今日页：积分进度条与当日上限提示，完成任务触发轻微动效。
- 周期页：完成率环形图、连续打卡计数、当周积分统计卡片。
- 复盘页：徽章授予、下周行动生成、奖励兑换按钮与小型庆祝动画。
- 里程碑墙：徽章陈列与段位成长曲线，强化长期激励。
反作弊与边界

- 证据轻量：支持打卡截图/简短备注（写作完成、跑步里程等）。
- 上限保护：每日/每周积分上限与任务分上限，防止过度堆叠。
- 任务定义清晰：每项任务可完成、可验证，避免“虚积分”。
- 自律优先：奖励仅作为辅助，核心仍是节奏和复盘。
MVP 范围（奖励机制，两周内）

- 今日积分与上限提示、番茄钟计分、任务完成计分。
- 连续打卡计数与 7/30 天徽章授予。
- 周完成率积分与阻碍关闭积分。
- 奖励库（静态列表）、兑换记录、复盘页“领取奖励”流程。
- 段位与积分总览卡片，徽章墙基础展示。
