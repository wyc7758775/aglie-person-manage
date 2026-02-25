#!/bin/bash

# 习惯详情抽屉测试执行脚本

echo "=========================================="
echo "  Habit Detail Drawer Test Suite"
echo "=========================================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 测试函数
run_unit_tests() {
    echo -e "${BLUE}Running Unit Tests...${NC}"
    echo "----------------------------------------"
    
    # 运行习惯组件的单元测试
    pnpm vitest run tests/unit/habits --reporter=verbose 2>&1 | tee /tmp/unit-test-results.txt
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Unit Tests Passed${NC}"
        return 0
    else
        echo -e "${RED}✗ Unit Tests Failed${NC}"
        return 1
    fi
}

run_integration_tests() {
    echo -e "${BLUE}Running Integration Tests...${NC}"
    echo "----------------------------------------"
    
    # 运行API集成测试
    pnpm vitest run tests/integration/habits --reporter=verbose 2>&1 | tee /tmp/integration-test-results.txt
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Integration Tests Passed${NC}"
        return 0
    else
        echo -e "${RED}✗ Integration Tests Failed${NC}"
        return 1
    fi
}

run_e2e_tests() {
    echo -e "${BLUE}Running E2E Tests...${NC}"
    echo "----------------------------------------"
    
    # 首先确保应用正在运行
    echo "Checking if app is running..."
    if ! curl -s http://localhost:3000 > /dev/null; then
        echo -e "${YELLOW}⚠ App is not running on localhost:3000${NC}"
        echo "Please start the app first with: pnpm dev"
        return 1
    fi
    
    # 运行E2E测试
    pnpm playwright test tests/e2e/habits --reporter=line 2>&1 | tee /tmp/e2e-test-results.txt
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ E2E Tests Passed${NC}"
        return 0
    else
        echo -e "${RED}✗ E2E Tests Failed${NC}"
        return 1
    fi
}

run_coverage() {
    echo -e "${BLUE}Running Tests with Coverage...${NC}"
    echo "----------------------------------------"
    
    pnpm vitest run tests/unit/habits --coverage 2>&1 | tee /tmp/coverage-results.txt
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Coverage Report Generated${NC}"
        echo "View report at: apps/web/coverage/index.html"
        return 0
    else
        echo -e "${RED}✗ Coverage Check Failed${NC}"
        return 1
    fi
}

# 显示帮助
show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --unit, -u       Run unit tests only"
    echo "  --integration, -i  Run integration tests only"
    echo "  --e2e, -e        Run E2E tests only"
    echo "  --coverage, -c   Run tests with coverage report"
    echo "  --all, -a        Run all tests (default)"
    echo "  --help, -h       Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                    # Run all tests"
    echo "  $0 --unit             # Run unit tests only"
    echo "  $0 --e2e              # Run E2E tests only"
    echo "  $0 --coverage         # Generate coverage report"
}

# 主逻辑
main() {
    local run_unit=false
    local run_integration=false
    local run_e2e=false
    local run_coverage=false
    local run_all=true

    # 解析参数
    while [[ $# -gt 0 ]]; do
        case $1 in
            --unit|-u)
                run_unit=true
                run_all=false
                shift
                ;;
            --integration|-i)
                run_integration=true
                run_all=false
                shift
                ;;
            --e2e|-e)
                run_e2e=true
                run_all=false
                shift
                ;;
            --coverage|-c)
                run_coverage=true
                run_all=false
                shift
                ;;
            --all|-a)
                run_all=true
                shift
                ;;
            --help|-h)
                show_help
                exit 0
                ;;
            *)
                echo "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done

    # 执行测试
    local exit_code=0

    if [ "$run_all" = true ] || [ "$run_coverage" = true ]; then
        run_coverage
        exit_code=$((exit_code + $?))
    fi

    if [ "$run_all" = true ] || [ "$run_unit" = true ]; then
        echo ""
        run_unit_tests
        exit_code=$((exit_code + $?))
    fi

    if [ "$run_all" = true ] || [ "$run_integration" = true ]; then
        echo ""
        run_integration_tests
        exit_code=$((exit_code + $?))
    fi

    if [ "$run_all" = true ] || [ "$run_e2e" = true ]; then
        echo ""
        run_e2e_tests
        exit_code=$((exit_code + $?))
    fi

    # 总结
    echo ""
    echo "=========================================="
    if [ $exit_code -eq 0 ]; then
        echo -e "${GREEN}All Tests Passed! ✓${NC}"
    else
        echo -e "${RED}Some Tests Failed! ✗${NC}"
    fi
    echo "=========================================="

    exit $exit_code
}

# 运行主函数
main "$@"
