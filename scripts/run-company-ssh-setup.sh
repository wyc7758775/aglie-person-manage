#!/bin/bash
# 在 Mac 上运行此脚本，将配置脚本复制到公司电脑并执行
# 会提示输入 SSH 密码（两次：scp 和 ssh）

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "步骤 1: 复制配置脚本到公司电脑..."
scp "$SCRIPT_DIR/setup-company-ssh-authorized-keys.ps1" "$SCRIPT_DIR/fix-sshd-pubkey.ps1" company-windows:

echo ""
echo "步骤 2: 在公司电脑上执行用户目录配置..."
ssh -t company-windows "powershell -ExecutionPolicy Bypass -File setup-company-ssh-authorized-keys.ps1"

echo ""
echo "步骤 3: 以管理员身份执行 administrators_authorized_keys 配置（关键！）"
echo "在公司电脑 PowerShell 中执行："
echo "  Start-Process powershell -Verb RunAs -ArgumentList '-ExecutionPolicy Bypass -File C:\Users\Admin\fix-sshd-pubkey.ps1'"
echo ""
echo "或：右键 PowerShell -> 以管理员身份运行，然后执行："
echo "  cd C:\Users\Admin"
echo "  .\fix-sshd-pubkey.ps1"
echo ""
echo "完成后在 Mac 上测试: ssh company-windows"
