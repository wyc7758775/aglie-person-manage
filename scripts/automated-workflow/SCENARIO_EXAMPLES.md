# 使用场景示例

## 场景 1：新功能开发（完整流程）

### 背景
需要开发一个"任务筛选器"功能，包含 PRD、UI 设计、实现和验证。

### 完整流程

```bash
# 1. 创建 PRD 文件
cat > packages/product-designs/product/task-filter.md << 'EOF'
# 任务筛选器

## 需求
用户需要能够按状态、优先级、截止日期筛选任务列表。

## UI 设计
- 筛选器面板位于页面顶部
- 包含下拉选择器和日期选择器
- 支持响应式布局
EOF

# 2. 启动完整工作流（含 UI 设计）
./scripts/automated-workflow/start-workflow.sh \
  packages/product-designs/product/task-filter.md \
  --with-ui \
  --auto-approve

# 或分阶段执行：

# 阶段 1-2.5: PRD → 提案 → UI 设计
node scripts/automated-workflow/phases/phase-1-parse-prd.js task-filter.md
node scripts/automated-workflow/phases/phase-2-generate-tests.js add-task-filter
node scripts/automated-workflow/phases/phase-2.5-ui-design-sync.js add-task-filter

# 查看生成的设计稿
ls openspec/changes/add-task-filter/design/
# 输出: design-tokens.json  components-spec.json  ui-mockups/  README.md

# 阶段 3-4: 审批 → 实现
node scripts/automated-workflow/phases/phase-3-approve.js add-task-filter
node scripts/automated-workflow/phases/phase-4-implement.js add-task-filter

# 阶段 5-6.5: 测试 → UI 验证
node scripts/automated-workflow/phases/phase-5-verify-and-commit.js add-task-filter
node scripts/automated-workflow/phases/phase-6.5-ui-validation.js add-task-filter
```

### 预期输出

```
openspec/changes/add-task-filter/
├── proposal.md              # 变更提案
├── tasks.md                 # 实现任务清单
├── design/                  # UI 设计输出 ⭐ NEW
│   ├── design-tokens.json   # 颜色、字体、间距
│   ├── components-spec.json # 组件规范
│   ├── ui-mockups/
│   │   ├── desktop.png      # 桌面端设计稿
│   │   ├── tablet.png       # 平板端设计稿
│   │   └── mobile.png       # 移动端设计稿
│   └── README.md            # 设计文档
└── specs/
    └── task-management/
        └── spec.md

reports/ui-validation/
└── add-task-filter/
    ├── screenshots/
    │   ├── actual/
    │   │   ├── desktop.png    # 实际截图
    │   │   └── mobile.png
    │   └── expected/          # 来自 design/ui-mockups/
    ├── diff/
    │   ├── desktop-diff.png   # 差异高亮
    │   └── mobile-diff.png
    ├── report.json            # 详细数据
    └── summary.md             # 人工可读报告
```

---

## 场景 2：仅后端功能（跳过 UI）

### 背景
添加一个纯后端 API，不需要 UI 设计。

```bash
# 跳过 UI 设计阶段
./scripts/automated-workflow/start-workflow.sh api-endpoint.md --skip-ui

# 或分阶段（跳过 2.5 和 6.5）
node scripts/automated-workflow/phases/phase-1-parse-prd.js api-endpoint.md
node scripts/automated-workflow/phases/phase-2-generate-tests.js add-api-endpoint
# 跳过: phase-2.5-ui-design-sync.js
node scripts/automated-workflow/phases/phase-3-approve.js add-api-endpoint
node scripts/automated-workflow/phases/phase-4-implement.js add-api-endpoint
node scripts/automated-workflow/phases/phase-5-verify-and-commit.js add-api-endpoint
# 跳过: phase-6.5-ui-validation.js
```

---

## 场景 3：修复 UI 差异

### 背景
UI 验证发现差异，需要自动修复。

```bash
# 1. 运行 UI 验证，显示差异
node scripts/automated-workflow/phases/phase-6.5-ui-validation.js add-task-filter
# 输出: ❌ 发现 3 处差异

# 2. 查看详细报告
cat reports/ui-validation/add-task-filter/summary.md

# 3. 尝试自动修复
node scripts/automated-workflow/phases/phase-6.5-ui-validation.js add-task-filter --auto-fix

# 4. 重新验证
node scripts/automated-workflow/phases/phase-6.5-ui-validation.js add-task-filter

# 5. 如果仍有问题，人工修复后再次验证
# ... 手动调整代码 ...
node scripts/automated-workflow/phases/phase-6.5-ui-validation.js add-task-filter
```

---

## 场景 4：批量验证所有活跃提案

```bash
#!/bin/bash
# validate-all.sh

for change_dir in openspec/changes/*/; do
  change_id=$(basename "$change_dir")
  
  # 跳过已归档
  if [ "$change_id" = "archive" ]; then continue; fi
  
  echo "验证: $change_id"
  
  # 检查是否有设计文件
  if [ -d "$change_dir/design" ]; then
    node scripts/automated-workflow/phases/phase-6.5-ui-validation.js "$change_id"
  fi
done
```

---

## 场景 5：CI/CD 集成

### GitHub Actions

```yaml
name: Automated Workflow with UI

on:
  workflow_dispatch:
    inputs:
      prd_file:
        description: 'PRD file path'
        required: true
      run_ui_validation:
        description: 'Run UI validation'
        default: true
        type: boolean

jobs:
  workflow:
    runs-on: ubuntu-latest
    
    services:
      app:
        image: myapp:latest
        ports:
          - 3000:3000
      
      pencil-mcp:
        image: pencil-mcp:latest
        ports:
          - 3001:3001
      
      chrome-devtools-mcp:
        image: chrome-devtools-mcp:latest
        ports:
          - 3002:3002
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Wait for services
        run: |
          sleep 10
          curl -f http://localhost:3000/health
          curl -f http://localhost:3001/sse
          curl -f http://localhost:3002/sse
      
      - name: Run Phase 1-2.5
        run: |
          node scripts/automated-workflow/phases/phase-1-parse-prd.js ${{ inputs.prd_file }}
          CHANGE_ID=$(grep -oP 'change_id=\K.+' logs/workflow-*.log | tail -1)
          node scripts/automated-workflow/phases/phase-2.5-ui-design-sync.js $CHANGE_ID
      
      - name: Upload Design Artifacts
        uses: actions/upload-artifact@v4
        with:
          name: ui-designs
          path: openspec/changes/*/design/
      
      - name: Run UI Validation
        if: ${{ inputs.run_ui_validation }}
        run: |
          CHANGE_ID=$(grep -oP 'change_id=\K.+' logs/workflow-*.log | tail -1)
          node scripts/automated-workflow/phases/phase-6.5-ui-validation.js $CHANGE_ID
      
      - name: Upload Validation Reports
        if: ${{ inputs.run_ui_validation }}
        uses: actions/upload-artifact@v4
        with:
          name: ui-validation-reports
          path: reports/ui-validation/
```

---

## 场景 6：设计驱动的开发

### 背景
设计团队已经完成设计稿，需要同步到开发流程。

```bash
# 1. 手动创建设计目录
mkdir -p openspec/changes/add-feature/design/ui-mockups

# 2. 复制设计稿
cp /path/to/designs/*.png openspec/changes/add-feature/design/ui-mockups/

# 3. 创建设计 token 文件
cat > openspec/changes/add-feature/design/design-tokens.json << 'EOF'
{
  "colors": {
    "primary": "#4F46E5",
    "secondary": "#10B981",
    "background": "#FFFFFF"
  },
  "typography": {
    "fontFamily": "Inter",
    "headingSize": "1.5rem",
    "bodySize": "1rem"
  }
}
EOF

# 4. 跳过设计生成，直接运行验证
node scripts/automated-workflow/phases/phase-6.5-ui-validation.js add-feature --skip-mcp
```

---

## 场景 7：对比三种 MCP 方案

### 方案 A: stdio（开发）

```bash
# 快速开始，无需 Docker
node scripts/automated-workflow/phases/phase-2.5-ui-design-sync.js my-feature

# 优点: 简单快速
# 缺点: 进程重启后状态丢失
```

### 方案 B: Docker（CI）

```bash
# 启动服务
docker-compose -f docker-compose.mcp.yml up -d

# 配置环境
export PENCIL_MCP_TRANSPORT=sse
export PENCIL_MCP_ENDPOINT=http://localhost:3001

# 运行工作流
node scripts/automated-workflow/phases/phase-2.5-ui-design-sync.js my-feature

# 优点: 稳定、可扩展
# 缺点: 需要 Docker
```

### 方案 C: 混合（推荐）

```bash
# 开发: 自动检测，优先使用 stdio
# CI: 使用 Docker

./scripts/automated-workflow/start-workflow.sh feature.md --env=auto
```

---

## 故障排除速查

| 问题 | 解决方案 |
|------|---------|
| MCP 连接失败 | 检查 `.mcp-config.json` 或使用 `--skip-mcp` |
| UI 验证差异大 | 使用 `--auto-fix` 或调整设计稿 |
| 设计生成慢 | 减少视口数量或启用缓存 |
| 内存不足 | 使用 Docker 并限制资源 |
| 端口冲突 | 修改 `docker-compose.mcp.yml` 中的端口映射 |

---

## 最佳实践

1. **版本控制设计稿**: 将 `openspec/changes/*/design/` 提交到 git
2. **定期更新基线**: 当 UI 有意的变更时，重新生成设计稿
3. **设置阈值**: 允许 < 5% 的视觉差异（字体渲染差异等）
4. **分层验证**: 先验证设计 token，再验证完整截图
5. **CI 集成**: 每次 PR 自动运行 UI 验证
