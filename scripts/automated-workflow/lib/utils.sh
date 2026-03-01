#!/bin/bash
# 通用工具函数

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

# 加载 logger
source "$SCRIPT_DIR/logger.sh"

# 检查依赖
check_dependencies() {
    local deps=("node" "pnpm" "openspec" "git")
    local missing=()
    
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            missing+=("$dep")
        fi
    done
    
    if [ ${#missing[@]} -ne 0 ]; then
        log_error "缺少依赖: ${missing[*]}"
        exit 1
    fi
    
    log_success "依赖检查通过"
}

# 生成唯一工作流 ID
generate_workflow_id() {
    echo "$(date +%Y%m%d-%H%M%S)-$(openssl rand -hex 4)"
}

# 从 PRD 文件生成 change-id
generate_change_id() {
    local prd_file="$1"
    local basename=$(basename "$prd_file" .md)
    # 转换为 kebab-case，以动词开头
    echo "$basename" | sed 's/[^a-zA-Z0-9]/-/g' | tr '[:upper:]' '[:lower:]' | sed 's/^/add-/'
}

# 读取工作流配置
read_config() {
    local config_file="$ROOT_DIR/.workflow-config.json"
    if [ -f "$config_file" ]; then
        cat "$config_file"
    else
        echo '{"auto_approve_proposal":false,"max_test_retries":3,"auto_fix_on_failure":true,"push_on_success":true}'
    fi
}

# 保存工作流状态
save_state() {
    local workflow_id="$1"
    local key="$2"
    local value="$3"
    local state_file="$ROOT_DIR/.workflow-state/${workflow_id}.json"
    
    mkdir -p "$ROOT_DIR/.workflow-state"
    
    if [ -f "$state_file" ]; then
        node -e "
            const fs = require('fs');
            const state = JSON.parse(fs.readFileSync('$state_file', 'utf8'));
            state['$key'] = '$value';
            fs.writeFileSync('$state_file', JSON.stringify(state, null, 2));
        "
    else
        echo "{\"$key\": \"$value\", \"workflow_id\": \"$workflow_id\"}" > "$state_file"
    fi
}

# 读取工作流状态
read_state() {
    local workflow_id="$1"
    local key="$2"
    local state_file="$ROOT_DIR/.workflow-state/${workflow_id}.json"
    
    if [ -f "$state_file" ]; then
        node -e "
            const fs = require('fs');
            const state = JSON.parse(fs.readFileSync('$state_file', 'utf8'));
            console.log(state['$key'] || '');
        "
    fi
}

# 检查提案是否存在
proposal_exists() {
    local change_id="$1"
    [ -d "$ROOT_DIR/openspec/changes/$change_id" ]
}

# 检查提案是否已批准
is_proposal_approved() {
    local change_id="$1"
    local proposal_file="$ROOT_DIR/openspec/changes/$change_id/proposal.md"
    
    if [ -f "$proposal_file" ]; then
        grep -q "Status: APPROVED" "$proposal_file" 2>/dev/null
        return $?
    fi
    return 1
}

# 标记提案为已批准
approve_proposal() {
    local change_id="$1"
    local proposal_file="$ROOT_DIR/openspec/changes/$change_id/proposal.md"
    
    if [ -f "$proposal_file" ]; then
        echo "" >> "$proposal_file"
        echo "<!-- WORKFLOW METADATA -->" >> "$proposal_file"
        echo "Status: APPROVED" >> "$proposal_file"
        echo "Approved At: $(date -Iseconds)" >> "$proposal_file"
        echo "Approved By: $(git config user.name)" >> "$proposal_file"
    fi
}

# 等待用户确认
wait_for_confirmation() {
    local message="$1"
    local timeout="${2:-300}"  # 默认 5 分钟超时
    
    log_warning "$message"
    log_info "按 [Enter] 继续 或 按 [Ctrl+C] 取消 (超时: ${timeout}s)"
    
    read -t "$timeout" -r
    if [ $? -ne 0 ]; then
        log_error "操作超时"
        return 1
    fi
    return 0
}

# 发送通知（可扩展到 Slack、邮件等）
send_notification() {
    local level="$1"
    local message="$2"
    
    # 控制台通知
    case "$level" in
        success) log_success "$message" ;;
        error) log_error "$message" ;;
        warning) log_warning "$message" ;;
        *) log_info "$message" ;;
    esac
    
    # TODO: 可以扩展支持 Slack、邮件、企业微信等
}
