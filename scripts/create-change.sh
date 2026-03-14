#!/bin/bash

# OpenSpec Change 创建脚本
# 用法: ./scripts/create-change.sh <change-id> [--with-verify]

set -e

CHANGE_ID=$1
WITH_VERIFY=false

if [ -z "$CHANGE_ID" ]; then
  echo "❌ 请提供 change-id"
  echo "用法: ./scripts/create-change.sh <change-id> [--with-verify]"
  echo "示例: ./scripts/create-change.sh add-user-profile --with-verify"
  exit 1
fi

if [ "$2" = "--with-verify" ]; then
  WITH_VERIFY=true
fi

CHANGE_DIR="openspec/changes/$CHANGE_ID"

# 检查是否已存在
if [ -d "$CHANGE_DIR" ]; then
  echo "❌ Change '$CHANGE_ID' 已存在"
  exit 1
fi

echo "📝 创建 OpenSpec Change: $CHANGE_ID"

# 创建目录
mkdir -p "$CHANGE_DIR"

# 创建 proposal.md
cat > "$CHANGE_DIR/proposal.md" << 'EOF'
# Change: [简要描述]

## Why
[1-2 句话说明问题/机会]

## What Changes
- [变更列表]
- [用 **BREAKING** 标记破坏性变更]

## Impact
- Affected specs: [受影响的能力]
- Affected code: [关键文件/系统]
EOF

# 创建 tasks.md
cat > "$CHANGE_DIR/tasks.md" << EOF
# Tasks: $CHANGE_ID

## 1. Implementation
- [ ] 1.1 [任务描述]

EOF

# 如果需要验证脚本
if [ "$WITH_VERIFY" = true ]; then
  echo "🔍 添加 Playwriter 验证脚本..."

  # 添加验证相关任务
  cat >> "$CHANGE_DIR/tasks.md" << 'EOF'

## 2. Verification
- [ ] 2.1 运行 Playwriter 验证
- [ ] 2.2 所有场景通过
EOF

  # 复制验证模板
  cp openspec/templates/verify.mjs "$CHANGE_DIR/verify.mjs"

  # 替换 change-id
  sed -i.bak "s/<change-id>/$CHANGE_ID/g" "$CHANGE_DIR/verify.mjs"
  rm -f "$CHANGE_DIR/verify.mjs.bak"

  echo "✅ 已创建 verify.mjs"
fi

echo ""
echo "✅ Change 创建成功！"
echo ""
echo "📁 文件位置: $CHANGE_DIR"
echo ""
echo "下一步："
echo "  1. 编辑 proposal.md 定义变更"
echo "  2. 编辑 tasks.md 列出任务"
if [ "$WITH_VERIFY" = true ]; then
  echo "  3. 编辑 verify.mjs 定义验证场景"
fi
echo ""
echo "验证命令："
echo "  openspec validate $CHANGE_ID --strict"
