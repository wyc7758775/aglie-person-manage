#!/bin/bash
# 自动化工作流入口脚本（含 MCP UI 集成）
# 用法: ./start-workflow.sh <prd-file.md> [选项]

set -e

# 脚本目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PHASES_DIR="$SCRIPT_DIR/phases"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

# 颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# 日志函数
log_info() { echo -e "${BLUE}ℹ${NC} $1"; }
log_success() { echo -e "${GREEN}✓${NC} $1"; }
log_warning() { echo -e "${YELLOW}⚠${NC} $1"; }
log_error() { echo -e "${RED}✗${NC} $1"; }
log_header() {
    echo -e "${BLUE}────────────────────────────────────────────────────────────${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${BLUE}────────────────────────────────────────────────────────────${NC}"
}

# MCP 相关变量
MCP_MODE="auto"
WITH_UI="false"
MCP_COMPOSE_FILE="$ROOT_DIR/docker-compose.mcp.yml"
MCP_SERVICES_STARTED="false"

# 帮助信息
show_help() {
    cat << EOF
自动化开发工作流 - 一站式 PRD 到代码提交（含 UI 设计/验证）

用法: \$0 <prd-file.md> [选项]

选项:
    --with-ui           启用 UI 设计和验证阶段（调用 MCP Servers）
    --mcp-mode <mode>   MCP 模式: auto | stdio | docker | none (默认: auto)
    --auto-approve      自动批准提案（跳过人工确认）
    --skip-tests        跳过测试验证
    --skip-push         跳过推送到远程
    --skip-ui-validate  跳过 UI 验证阶段（仅当 --with-ui 时有效）
    --phase <n>         从指定阶段开始 (1-7)
    -h, --help          显示帮助

阶段说明:
    1.   解析 PRD 并生成 OpenSpec 提案
    2.   基于提案生成测试用例
    2.5  UI 设计同步（需 --with-ui）调用 Pencil MCP
    3.   等待/设置提案审批
    4.   根据提案实现代码
    5.   测试验证
    6.   智能提交
    6.5  UI 验证（需 --with-ui）调用 Chrome DevTools MCP
    7.   归档（可选）

MCP 模式说明:
    auto   - 自动检测（开发用 stdio，CI 用 docker）
    stdio  - 直接启动 MCP 进程（适合开发）
    docker - 使用 Docker Compose（适合 CI/稳定环境）
    none   - 跳过 MCP 阶段

示例:
    # 完整工作流（含 UI）
    \$0 packages/product-designs/product/feature-x.md --with-ui
    
    # 使用 Docker MCP
    \$0 feature.md --with-ui --mcp-mode=docker
    
    # 仅后端功能（跳过 UI）
    \$0 api-endpoint.md

环境变量:
    APP_URL                        应用 URL（用于 UI 验证，默认: http://localhost:3000）
    PENCIL_MCP_ENDPOINT            Pencil MCP SSE 端点
    CHROME_DEVTOOLS_MCP_ENDPOINT   Chrome DevTools MCP SSE 端点
EOF
}

# 清理函数
cleanup() {
    if [ "$MCP_SERVICES_STARTED" = "true" ] && [ "$MCP_MODE" = "docker" ]; then
        log_info "停止 MCP Docker 服务..."
        docker-compose -f "$MCP_COMPOSE_FILE" down 2>/dev/null || true
    fi
}
trap cleanup EXIT

# 检查依赖
check_dependencies() {
    log_info "检查依赖..."
    local deps=("node" "pnpm" "git")
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            log_error "缺少依赖: $dep"
            exit 1
        fi
    done
    
    if [ "$MCP_MODE" = "docker" ]; then
        if ! command -v docker &> /dev/null; then
            log_error "缺少 Docker（--mcp-mode=docker 需要 Docker）"
            exit 1
        fi
    fi
    
    log_success "依赖检查通过"
}

# 检测 MCP 环境
detect_mcp_environment() {
    if [ "$MCP_MODE" != "auto" ]; then
        log_info "MCP 模式: $MCP_MODE"
        return
    fi
    
    if [ -n "$CI" ] || [ -n "$GITHUB_ACTIONS" ]; then
        MCP_MODE="docker"
        log_info "检测到 CI 环境，使用 Docker MCP 模式"
    elif command -v docker &> /dev/null && [ -f "$MCP_COMPOSE_FILE" ]; then
        if docker info &> /dev/null; then
            MCP_MODE="docker"
            log_info "检测到 Docker，使用 Docker MCP 模式"
        else
            MCP_MODE="stdio"
            log_info "Docker 不可用，使用 stdio MCP 模式"
        fi
    else
        MCP_MODE="stdio"
        log_info "使用 stdio MCP 模式"
    fi
}

# 启动 MCP Servers
start_mcp_servers() {
    if [ "$WITH_UI" != "true" ] || [ "$MCP_MODE" = "none" ]; then
        return 0
    fi
    
    log_header "启动 MCP Servers"
    
    if [ "$MCP_MODE" = "docker" ]; then
        log_info "使用 Docker Compose 启动 MCP 服务..."
        
        if [ ! -f "$MCP_COMPOSE_FILE" ]; then
            log_error "MCP Compose 文件不存在: $MCP_COMPOSE_FILE"
            exit 1
        fi
        
        docker-compose -f "$MCP_COMPOSE_FILE" up -d
        MCP_SERVICES_STARTED="true"
        
        log_info "等待 MCP 服务就绪..."
        local retries=30
        local pencil_ready=false
        local devtools_ready=false
        
        while [ $retries -gt 0 ]; do
            if ! $pencil_ready && curl -sf http://localhost:3001/sse > /dev/null 2>&1; then
                pencil_ready=true
                log_success "Pencil MCP 已就绪"
            fi
            
            if ! $devtools_ready && curl -sf http://localhost:3002/sse > /dev/null 2>&1; then
                devtools_ready=true
                log_success "Chrome DevTools MCP 已就绪"
            fi
            
            if $pencil_ready && $devtools_ready; then
                break
            fi
            
            sleep 2
            retries=$((retries - 1))
        done
        
        if ! $pencil_ready || ! $devtools_ready; then
            log_error "MCP 服务启动超时"
            exit 1
        fi
        
        export PENCIL_MCP_TRANSPORT="sse"
        export CHROME_DEVTOOLS_MCP_TRANSPORT="sse"
        export PENCIL_MCP_ENDPOINT="http://localhost:3001"
        export CHROME_DEVTOOLS_MCP_ENDPOINT="http://localhost:3002"
        
    elif [ "$MCP_MODE" = "stdio" ]; then
        log_info "使用 stdio 模式（MCP 进程将随工作流启动）"
        
        if [ ! -f "$ROOT_DIR/mcp-servers/pencil-mcp/server.js" ]; then
            log_warning "Pencil MCP Server 未找到，跳过 UI 阶段"
            WITH_UI="false"
            return 0
        fi
        
        export PENCIL_MCP_TRANSPORT="stdio"
        export CHROME_DEVTOOLS_MCP_TRANSPORT="stdio"
    fi
    
    log_success "MCP Servers 准备就绪"
}

# 测试 MCP 连接
test_mcp_connection() {
    if [ "$WITH_UI" != "true" ] || [ "$MCP_MODE" = "none" ]; then
        return 0
    fi
    
    log_info "测试 MCP 连接..."
    
    if ! node "$SCRIPT_DIR/test-mcp.js" --all > /dev/null 2>&1; then
        log_warning "MCP 连接测试失败，跳过 UI 阶段"
        log_info "提示: 可以使用 --mcp-mode=none 跳过 UI 阶段"
        WITH_UI="false"
    else
        log_success "MCP 连接测试通过"
    fi
}

# 阶段 1: 解析 PRD
run_phase_1() {
    local prd_file="$1"
    log_header "阶段 1: 解析 PRD 并生成提案"
    
    node "$PHASES_DIR/phase-1-parse-prd.js" "$prd_file"
    
    CHANGE_ID=$(grep '\[WORKFLOW_STATE\] change_id=' "$SCRIPT_DIR/../../logs/workflow-"*.log 2>/dev/null | tail -1 | sed 's/.*change_id=//' || echo "")
    
    if [ -z "$CHANGE_ID" ]; then
        local basename=$(basename "$prd_file" .md)
        CHANGE_ID="add-$(echo "$basename" | sed 's/[^a-zA-Z0-9]/-/g' | tr '[:upper:]' '[:lower:]')"
    fi
    
    log_success "Change ID: $CHANGE_ID"
}

# 阶段 2: 生成测试
run_phase_2() {
    log_header "阶段 2: 生成测试用例"
    node "$PHASES_DIR/phase-2-generate-tests.js" "$CHANGE_ID"
}

# 阶段 2.5: UI 设计同步
run_phase_2_5() {
    if [ "$WITH_UI" != "true" ]; then
        return 0
    fi
    
    log_header "阶段 2.5: UI 设计同步"
    log_info "调用 Pencil MCP 生成设计稿..."
    
    if ! node "$PHASES_DIR/phase-2.5-ui-design-sync.js" "$CHANGE_ID"; then
        log_warning "UI 设计同步失败，继续执行后续阶段"
    fi
}

# 阶段 3: 审批提案
run_phase_3() {
    local auto_approve="$1"
    log_header "阶段 3: 提案审批"
    
    if [ "$auto_approve" = "true" ]; then
        node "$PHASES_DIR/phase-3-approve.js" "$CHANGE_ID" --auto
    else
        node "$PHASES_DIR/phase-3-approve.js" "$CHANGE_ID"
    fi
}

# 阶段 4: 实现代码
run_phase_4() {
    log_header "阶段 4: 代码实现"
    log_warning "此阶段需要 AI 或人工实现代码"
    log_info "请根据 tasks.md 中的任务清单实现代码"
    
    local design_dir="$ROOT_DIR/openspec/changes/$CHANGE_ID/design"
    if [ -d "$design_dir" ]; then
        log_info "设计稿位置: openspec/changes/$CHANGE_ID/design/"
        log_info "请确保实现符合设计规范"
    fi
    
    log_info "完成后按 Enter 继续..."
    read -r
    
    node "$PHASES_DIR/phase-4-implement.js" "$CHANGE_ID" --dry-run
}

# 阶段 5: 测试验证
run_phase_5() {
    local skip_tests="$1"
    log_header "阶段 5: 测试验证"
    
    if [ "$skip_tests" != "true" ]; then
        log_info "运行单元测试..."
        if ! pnpm --filter web test:unit; then
            log_error "单元测试失败"
            exit 1
        fi
        log_success "单元测试通过"
    else
        log_warning "跳过单元测试"
    fi
}

# 阶段 6: 智能提交
run_phase_6() {
    local skip_push="$1"
    log_header "阶段 6: 智能提交"
    
    local args=("$CHANGE_ID")
    [ "$skip_push" = "true" ] && args+=("--skip-push")
    
    node "$PHASES_DIR/phase-5-verify-and-commit.js" "${args[@]}"
}

# 阶段 6.5: UI 验证
run_phase_6_5() {
    local skip_ui_validate="$1"
    
    if [ "$WITH_UI" != "true" ]; then
        return 0
    fi
    
    if [ "$skip_ui_validate" = "true" ]; then
        log_warning "跳过 UI 验证阶段"
        return 0
    fi
    
    log_header "阶段 6.5: UI 实现验证"
    log_info "调用 Chrome DevTools MCP 验证 UI..."
    
    local app_url="${APP_URL:-http://localhost:3000}"
    log_info "目标应用: $app_url"
    
    if ! curl -sf "$app_url" > /dev/null 2>&1; then
        log_warning "应用似乎没有在 $app_url 运行"
        log_info "是否继续? [y/N]"
        read -r response
        if [ "$response" != "y" ] && [ "$response" != "Y" ]; then
            return 0
        fi
    fi
    
    if ! node "$PHASES_DIR/phase-6.5-ui-validation.js" "$CHANGE_ID"; then
        local exit_code=$?
        if [ $exit_code -eq 2 ]; then
            log_warning "UI 验证发现问题，请查看报告后决定是否继续"
            log_info "报告位置: reports/ui-validation/$CHANGE_ID/"
            log_info "按 Enter 继续，或 Ctrl+C 退出..."
            read -r
        else
            log_error "UI 验证失败"
            exit 1
        fi
    fi
}

# 阶段 7: 归档
run_phase_7() {
    log_header "阶段 7: 归档变更"
    
    log_info "是否归档此变更? [y/N]"
    read -r response
    
    if [ "$response" = "y" ] || [ "$response" = "Y" ]; then
        if command -v openspec &> /dev/null; then
            openspec archive "$CHANGE_ID" --yes
            log_success "变更已归档"
        else
            log_warning "openspec CLI 未安装，跳过归档"
        fi
    else
        log_info "跳过归档"
    fi
}

# 显示总结
show_summary() {
    log_header "工作流全部完成!"
    log_success "Change ID: $CHANGE_ID"
    
    echo ""
    echo "生成的文件:"
    echo "  openspec/changes/$CHANGE_ID/"
    
    if [ "$WITH_UI" = "true" ]; then
        echo "  openspec/changes/$CHANGE_ID/design/"
        echo "  reports/ui-validation/$CHANGE_ID/"
    fi
    
    echo ""
    echo "后续操作:"
    echo "  查看状态: pnpm workflow:status"
    if [ "$WITH_UI" = "true" ]; then
        echo "  查看报告: cat reports/ui-validation/$CHANGE_ID/summary.md"
    fi
}

# 主函数
main() {
    local prd_file=""
    local auto_approve="false"
    local skip_tests="false"
    local skip_push="false"
    local skip_ui_validate="false"
    local start_phase=1
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --with-ui)
                WITH_UI="true"
                shift
                ;;
            --mcp-mode)
                MCP_MODE="$2"
                shift 2
                ;;
            --auto-approve)
                auto_approve="true"
                shift
                ;;
            --skip-tests)
                skip_tests="true"
                shift
                ;;
            --skip-push)
                skip_push="true"
                shift
                ;;
            --skip-ui-validate)
                skip_ui_validate="true"
                shift
                ;;
            --phase)
                start_phase="$2"
                shift 2
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
            -*)
                log_error "未知选项: $1"
                show_help
                exit 1
                ;;
            *)
                prd_file="$1"
                shift
                ;;
        esac
    done
    
    if [ "$start_phase" -le 1 ]; then
        if [ -z "$prd_file" ]; then
            log_error "请提供 PRD 文件路径"
            show_help
            exit 1
        fi
        
        if [ ! -f "$prd_file" ]; then
            log_error "文件不存在: $prd_file"
            exit 1
        fi
    fi
    
    check_dependencies
    detect_mcp_environment
    
    if [ "$WITH_UI" = "true" ] && [ "$start_phase" -le 2 ]; then
        start_mcp_servers
        test_mcp_connection
    fi
    
    mkdir -p "$SCRIPT_DIR/../../logs"
    
    log_header "自动化工作流启动"
    [ -n "$prd_file" ] && log_info "PRD 文件: $prd_file"
    log_info "起始阶段: $start_phase"
    [ "$WITH_UI" = "true" ] && log_info "UI 模式: 启用 (MCP: $MCP_MODE)"
    [ "$auto_approve" = "true" ] && log_warning "自动批准模式"
    
    if [ "$start_phase" -le 1 ]; then
        run_phase_1 "$prd_file"
    else
        read -p "请输入 Change ID: " CHANGE_ID
    fi
    
    if [ "$start_phase" -le 2 ]; then
        run_phase_2
    fi
    
    if [ "$start_phase" -le 2 ]; then
        run_phase_2_5
    fi
    
    if [ "$start_phase" -le 3 ]; then
        run_phase_3 "$auto_approve"
    fi
    
    if [ "$start_phase" -le 4 ]; then
        run_phase_4
    fi
    
    if [ "$start_phase" -le 5 ]; then
        run_phase_5 "$skip_tests"
    fi
    
    if [ "$start_phase" -le 6 ]; then
        run_phase_6 "$skip_push"
    fi
    
    if [ "$start_phase" -le 6 ]; then
        run_phase_6_5 "$skip_ui_validate"
    fi
    
    if [ "$start_phase" -le 7 ]; then
        run_phase_7
    fi
    
    show_summary
}

main "$@"
