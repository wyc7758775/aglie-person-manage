#!/bin/bash
# 日志工具库

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 日志文件
LOG_FILE=""

# 初始化日志
init_logger() {
    local workflow_id="$1"
    LOG_FILE="logs/workflow-${workflow_id}.log"
    mkdir -p logs
    touch "$LOG_FILE"
}

# 输出到控制台和日志文件
log_output() {
    local level="$1"
    local message="$2"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    echo -e "${timestamp} [${level}] ${message}" >> "$LOG_FILE"
}

log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
    log_output "INFO" "$1"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
    log_output "SUCCESS" "$1"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
    log_output "WARNING" "$1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
    log_output "ERROR" "$1"
}

log_step() {
    echo -e "\n${CYAN}▶ STEP $1:${NC} $2"
    log_output "STEP" "STEP $1: $2"
}

log_divider() {
    echo -e "${BLUE}────────────────────────────────────────────────────────────${NC}"
}

log_header() {
    log_divider
    echo -e "${CYAN}$1${NC}"
    log_divider
    log_output "HEADER" "$1"
}
