# Run as Administrator - fix SSH keyless login
# Right-click PowerShell -> Run as Administrator, then run this script
#
# Windows admin accounts use administrators_authorized_keys, not user's authorized_keys

$pubkey = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQChFl/6lPpxUe+CdPe6J0dU1PuL11053rjcXMSZ1pvUpwgCkdiZA1ODU0cbOWfiIneo5yBu2BDR/ryJphs/1dJTKEp0BV1c+EsMPdTLgb4lOQNG/+0UbGRppf5N/ie/pp/SwV2cRShtV0ECYSRz0wv6FARgcI+Je8rTkTcqqKhJdpr3+c7srpyLDxjNpJ1Sc3LGGf+VTybNCg/B5hErNiWzskW/VTQG4mC+Ew18NVfrJ08vtgY4fEHrwx9DnLt5JHFjupMdweQI3mg/4uj9vBj7uX1FvXl+zFVqe+crKzpQ4rXRNxfoPoAvRG229D+iaE8ufjVhKZUNkpyaA96I0V9wB6JCyqRQAw43yFKKMqJYaLXVSnnAxqyiQXRpPa6ZUjIlTRLYXBv1ELa7tYXKoCCsWifc59CWbOZ9v9eAhkjce/dXUmcyDtokQt7XUFclWhse8c6RmPVZxzn1MBh5tgj/0F8IwTq55OfRl5Kb+bP2RH05XWy/dVpdbdf1iZzRMXo1imeyLIE6yVU5rr2GJ2ktfP60T1b7fkLNDhvQLr1Scs4mi+mAPIW302LihFiAvT7fyuwdE9M6FeIESFzetEN6l3ZixE3bZvu1c9anYNuKqJRIJOwXEpnr3ojiu5xAZG/JjlcXgHrhsiJlIlLdO+iyAb+2lpbQQeThuCeQpE4DYQ== 295563358@qq.com"

$adminKeysPath = "C:\ProgramData\ssh\administrators_authorized_keys"

Write-Host "Step 1: Writing public key to administrators_authorized_keys..." -ForegroundColor Cyan
[System.IO.File]::WriteAllText($adminKeysPath, $pubkey + "`n")

Write-Host "Step 2: Setting administrators_authorized_keys permissions..." -ForegroundColor Cyan
icacls $adminKeysPath /inheritance:r /grant "SYSTEM:F" /grant "Administrators:F"

Write-Host "Step 3: Enabling PubkeyAuthentication in sshd..." -ForegroundColor Cyan
$configPath = "C:\ProgramData\ssh\sshd_config"
$content = Get-Content $configPath -Raw
$content = $content -replace 'PubkeyAuthentication no', 'PubkeyAuthentication yes'
$content = $content -replace '#PubkeyAuthentication yes', 'PubkeyAuthentication yes'
[System.IO.File]::WriteAllText($configPath, $content)

Write-Host "Step 4: Restarting sshd service..." -ForegroundColor Cyan
Restart-Service sshd

Write-Host "`nDone. Exit SSH and run: ssh company-windows" -ForegroundColor Green
