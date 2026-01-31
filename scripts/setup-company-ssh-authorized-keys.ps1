# SSH keyless login setup - run on company Windows PC
# Usage: SSH to company PC, then run this script in PowerShell
#
# Admin account uses administrators_authorized_keys (not user's authorized_keys)
# This script only checks config. Run fix-sshd-pubkey.ps1 as Administrator to setup.

Write-Host "Step 1: Checking sshd config..." -ForegroundColor Cyan
Get-Content C:\ProgramData\ssh\sshd_config -ErrorAction SilentlyContinue | Select-String -Pattern "PubkeyAuthentication|AuthorizedKeysFile|Match"

Write-Host "`nStep 2: Run fix-sshd-pubkey.ps1 as Administrator (REQUIRED)" -ForegroundColor Yellow
Write-Host "  Start-Process powershell -Verb RunAs -ArgumentList '-ExecutionPolicy Bypass -File C:\Users\Admin\fix-sshd-pubkey.ps1'" -ForegroundColor White
Write-Host "`nOr: Right-click PowerShell -> Run as Administrator, then:" -ForegroundColor White
Write-Host "  cd C:\Users\Admin" -ForegroundColor White
Write-Host "  .\fix-sshd-pubkey.ps1" -ForegroundColor White
Write-Host "`nThen exit SSH and run: ssh company-windows" -ForegroundColor Green
