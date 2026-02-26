---
description: 使用 Chrome DevTools MCP 和 Pencil MCP 自动化验证功能完成性
---

# 功能验证命令

你是一个自动化测试工程师。请根据用户的描述或参数，执行功能验证测试。

## 输入参数
$ARGUMENTS

## 参数解析

从 $ARGUMENTS 中提取以下参数：

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `--ui` | UI 视觉验证模式，使用 Chrome DevTools MCP + Pencil MCP | - |
| `--all` | 执行全量业务逻辑测试 | - |
| `--incremental` | 增量测试，基于 git diff 获取变更文件 | - |
| `--full` | 同时执行 UI 验证 + 业务逻辑测试 | - |
| `--perf` | 收集性能指标 | - |
| `--generate` | 生成测试用例 | - |
| `--list` | 列出可用测试用例 | - |
| `--url <url>` | 指定测试地址 | http://localhost:3000 |
| `--module <name>` | 指定测试模块 | - |
| `--file <path>` | 指定测试文件 | - |
| 其他文本 | 功能描述，用于智能匹配测试 | - |

## 执行模式

### 模式判断逻辑

```
如果包含 --ui 且不包含 --full → UI 视觉验证模式
如果包含 --full → 混合模式（UI + 业务逻辑）
如果包含 --generate → 生成测试用例模式
如果包含 --list → 列出测试用例模式
否则 → 业务逻辑测试模式
```

---

## 模式1: UI 视觉验证 (`--ui`)

### 执行步骤

#### 1. 环境准备
- 确认 Chrome 调试端口已启动（运行 `pnpm chrome:debug`）
- 确认开发服务器已启动（运行 `pnpm dev`）

#### 2. 获取设计稿
使用 Pencil MCP 工具：
- `pencil_get_editor_state` - 获取当前编辑器状态
- `pencil_batch_get` - 读取设计稿节点
- `pencil_get_screenshot` - 获取设计稿截图

#### 3. 页面操作与截图
使用 Chrome DevTools MCP：
- `chrome-devtools_navigate_page` - 导航到目标页面
- `chrome-devtools_take_snapshot` - 获取页面快照
- `chrome-devtools_take_screenshot` - 截取页面截图（JPEG 格式，质量 80）

#### 4. 对比验证
- 对比设计稿与实际截图
- 检查关键元素位置、颜色、字体
- 记录差异

#### 5. 生成报告
输出到 `.opencode/reports/verify-{YYYYMMDD-HHmmss}.md`

---

## 模式2: 业务逻辑测试（默认）

### 执行步骤

#### 1. 测试发现

**全量测试 (`--all`)**：
扫描以下目录的所有测试文件：
- `apps/e2e/tests/**/*.spec.ts`
- `apps/web/tests/e2e/**/*.spec.ts`
- `apps/web/tests/unit/**/*.test.tsx`
- `apps/web/tests/integration/**/*.test.ts`

**增量测试 (`--incremental`)**：
```bash
# 获取变更文件
git diff --name-only HEAD~1 HEAD
git diff --name-only --cached

# 根据变更文件推断相关测试
```

变更文件到测试的映射规则：
| 变更文件路径 | 对应测试路径 |
|-------------|-------------|
| `apps/web/app/dashboard/project/**/*.tsx` | `apps/e2e/tests/web/project*.spec.ts` |
| `apps/web/app/dashboard/habits/**/*.tsx` | `apps/e2e/tests/**/habit*.spec.ts` |
| `apps/web/components/**/*.tsx` | `apps/web/tests/unit/**/*.test.tsx` |
| `apps/web/app/api/**/*.ts` | `apps/web/tests/integration/**/*.test.ts` |

**按功能描述匹配**：
- 读取测试文件的 `test.describe` 和 `test` 描述
- 匹配用户提供的功能描述

#### 2. 环境准备
- 确认开发服务器已启动
- 确认数据库连接正常

#### 3. 执行测试

**方式A: 通过 Chrome DevTools MCP 执行**（适用于交互式验证）

使用工具：
- `chrome-devtools_navigate_page` - 导航
- `chrome-devtools_take_snapshot` - 获取快照
- `chrome-devtools_click` - 点击
- `chrome-devtools_fill` / `chrome-devtools_fill_form` - 填写表单
- `chrome-devtools_hover` - 悬停
- `chrome-devtools_press_key` - 按键
- `chrome-devtools_wait_for` - 等待
- `chrome-devtools_evaluate_script` - 执行 JS 验证
- `chrome-devtools_list_console_messages` - 检查控制台错误
- `chrome-devtools_list_network_requests` - 检查网络请求

**方式B: 调用 Playwright 运行现有测试**（适用于全量/增量测试）

```bash
# 运行指定测试文件
pnpm --filter e2e test -- --grep "测试名称"

# 运行指定项目
pnpm --filter e2e test --project=functional
```

#### 4. 性能指标收集（`--perf`）

使用 Chrome DevTools MCP 性能工具：
- `chrome-devtools_performance_start_trace` - 开始追踪
- `chrome-devtools_performance_stop_trace` - 停止追踪
- `chrome-devtools_performance_analyze_insight` - 分析洞察

收集指标及阈值（来自 `apps/e2e/tests/performance/contract.spec.ts`）：

| 指标 | 阈值 |
|------|------|
| 首页 LCP | < 2.5s |
| 项目页面加载 | < 2s |
| 仪表盘页面加载 | < 1.5s |
| API 项目列表响应 | < 500ms |
| API 任务列表响应 | < 300ms |
| API 认证接口响应 | < 800ms |

#### 5. 生成报告

---

## 模式3: 混合验证 (`--full`)

同时执行 UI 视觉验证和业务逻辑测试，合并报告。

---

## 模式4: 生成测试用例 (`--generate`)

### 执行步骤

#### 1. 分析功能描述
理解用户描述的功能点

#### 2. 参考现有测试风格
读取以下文件作为模板：
- `apps/e2e/tests/web/project-list.spec.ts` - E2E 测试风格
- `apps/web/tests/unit/habits/*.test.tsx` - 单元测试风格

#### 3. 生成测试文件

**命名规范**：
- E2E: `apps/e2e/tests/web/{module}/{feature}.spec.ts`
- 单元: `apps/web/tests/unit/{module}/{component}.test.tsx`
- 集成: `apps/web/tests/integration/{module}/{feature}.test.ts`

**代码规范**：
- 使用 `data-testid` 选择器
- 复用现有辅助函数（如 `waitForListLoaded`）
- 遵循项目 TypeScript 规范

---

## 模式5: 列出测试用例 (`--list`)

扫描测试目录，输出所有可用的测试用例：

```
可用测试用例：

E2E 测试:
  - apps/e2e/tests/web/project-list.spec.ts
    · 项目列表交互优化 - 局部刷新功能
    · 项目列表交互优化 - 缓存和加载体验
    · 项目列表交互优化 - 未保存确认功能
  
  - apps/e2e/tests/performance/contract.spec.ts
    · API 性能契约
    · 页面加载性能契约
    · 并发性能契约

单元测试:
  - apps/web/tests/unit/habits/HabitDetailDrawer.test.tsx
    · HabitDetailDrawer 组件测试
  ...

使用方式:
  opencode /verify --file <路径> [描述]
  opencode /verify --module <模块名> [描述]
```

---

## 报告格式

输出路径: `.opencode/reports/verify-{YYYYMMDD-HHmmss}.md`
截图路径: `.opencode/reports/screenshots/`

```markdown
# 功能验证报告

## 概述
- 测试时间: {YYYY-MM-DD HH:mm:ss}
- 目标地址: {url}
- 测试模式: {UI | 业务逻辑 | 混合}
- 测试范围: {全量 | 增量 | 指定模块}
- 执行结果: UI {passed}/{total} 通过 | 业务逻辑 {passed}/{total} 通过

## 一、UI 视觉验证（如有）

### 1.1 设计稿对比

| 页面 | 设计稿 | 实际截图 | 差异描述 | 状态 |
|------|--------|----------|----------|------|
| {页面名} | {pen文件} | {截图文件} | {差异} | ✅/⚠️/❌ |

### 1.2 截图证据
- [{页面名}对比](./screenshots/{filename}.jpg)

## 二、业务逻辑测试

### 2.1 测试用例执行结果

| 用例 | 描述 | 状态 | 耗时 |
|------|------|------|------|
| {用例名} | {描述} | ✅/❌ | {ms}ms |

### 2.2 测试步骤详情（交互式验证）

| 步骤 | 操作 | 预期结果 | 实际结果 | 状态 |
|------|------|----------|----------|------|
| 1 | {操作} | {预期} | {实际} | ✅/❌ |
| 2 | ... | ... | ... | ... |

## 三、性能指标（如有 --perf）

| 指标 | 值 | 阈值 | 状态 |
|------|-----|------|------|
| LCP | {value}s | <{threshold}s | ✅/❌ |
| 页面加载 | {value}s | <{threshold}s | ✅/❌ |
| API 响应 | {value}ms | <{threshold}ms | ✅/❌ |

## 四、控制台和网络检查

### 4.1 控制台错误
```
{错误日志，如无则为空}
```

### 4.2 失败的网络请求
```
{失败请求列表，如无则为空}
```

## 五、问题列表

| 序号 | 类型 | 问题描述 | 严重程度 | 位置 |
|------|------|----------|----------|------|
| 1 | {UI/功能/性能} | {描述} | {高/中/低} | {位置} |

## 六、结论

- **通过率**: {percentage}%
- **总体评价**: {通过/不通过}
- **建议**: {后续行动建议}

---
报告生成时间: {timestamp}
```

---

## 使用示例

```bash
# UI 视觉验证
opencode /verify --ui 项目列表页面
opencode /verify --ui --url http://staging.example.com 登录页面

# 业务逻辑测试
opencode /verify 项目列表功能
opencode /verify --all                                    # 全量测试
opencode /verify --incremental                            # 增量测试（git diff）
opencode /verify --file apps/e2e/tests/web/project-list.spec.ts
opencode /verify --module project --perf                  # 带性能指标

# 混合模式
opencode /verify --full 项目列表                          # UI + 业务逻辑

# 生成测试用例
opencode /verify --generate 用户登录流程
opencode /verify --generate --file apps/e2e/tests/web/new-feature.spec.ts

# 列出测试用例
opencode /verify --list
opencode /verify --list --module project
```

---

## 注意事项

1. **Chrome 调试模式**: 测试前确保已运行 `pnpm chrome:debug`
2. **开发服务器**: 确保 `pnpm dev` 已启动
3. **截图格式**: JPEG，质量 80
4. **报告保留**: 不自动清理，按时间戳命名
5. **增量测试**: 基于 git diff 获取变更文件
6. **设计稿**: 通过 Pencil MCP 动态获取，无固定目录
