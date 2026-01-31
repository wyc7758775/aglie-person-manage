#!/bin/bash
# 在 Mac 终端运行此脚本，收集 SSH 认证调试信息
# 用法：./debug-ssh-auth.sh

echo "=== SSH 认证调试（会尝试连接，若需密码请直接 Ctrl+C）==="
echo ""

ssh -vvv -o ConnectTimeout=15 company-windows "echo 连接成功" 2>&1 | tee /tmp/ssh-debug-company.log

echo ""
echo "=== 调试输出已保存到 /tmp/ssh-debug-company.log ==="
echo ""
echo "关键信息查找："
echo "- 若看到 'Offering public key' 但紧接着 'Next authentication method: password' → 公钥被拒"
echo "- 若看到 'Authentication succeeded (publickey)' → 公钥已成功"
echo "- 若没有 'Offering public key' → 客户端未尝试公钥"
