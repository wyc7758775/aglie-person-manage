# 公司电脑 SSH 免密登录配置

## 重要说明

**Windows 管理员账户**（如 Admin）使用 `C:\ProgramData\ssh\administrators_authorized_keys`，而非用户目录下的 `authorized_keys`。若 Admin 是管理员，必须将公钥写入 `administrators_authorized_keys`。

## 方式一：使用 Mac 脚本（推荐）

在 Mac 终端执行：

```bash
cd /Users/wuyucun/programmer/agile-person-manage/scripts
chmod +x run-company-ssh-setup.sh
./run-company-ssh-setup.sh
```

按提示输入 SSH 密码。完成后**必须**在公司电脑上以管理员身份运行 `fix-sshd-pubkey.ps1`。

## 方式二：手动执行

### 1. SSH 连接公司电脑

```bash
ssh company-windows
# 或：ssh -t company-windows powershell
```

输入密码登录。

### 2. 在公司电脑 PowerShell 中执行

复制并粘贴以下命令（整段）：

```powershell
$pubkey = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQChFl/6lPpxUe+CdPe6J0dU1PuL11053rjcXMSZ1pvUpwgCkdiZA1ODU0cbOWfiIneo5yBu2BDR/ryJphs/1dJTKEp0BV1c+EsMPdTLgb4lOQNG/+0UbGRppf5N/ie/pp/SwV2cRShtV0ECYSRz0wv6FARgcI+Je8rTkTcqqKhJdpr3+c7srpyLDxjNpJ1Sc3LGGf+VTybNCg/B5hErNiWzskW/VTQG4mC+Ew18NVfrJ08vtgY4fEHrwx9DnLt5JHFjupMdweQI3mg/4uj9vBj7uX1FvXl+zFVqe+crKzpQ4rXRNxfoPoAvRG229D+iaE8ufjVhKZUNkpyaA96I0V9wB6JCyqRQAw43yFKKMqJYaLXVSnnAxqyiQXRpPa6ZUjIlTRLYXBv1ELa7tYXKoCCsWifc59CWbOZ9v9eAhkjce/dXUmcyDtokQt7XUFclWhse8c6RmPVZxzn1MBh5tgj/0F8IwTq55OfRl5Kb+bP2RH05XWy/dVpdbdf1iZzRMXo1imeyLIE6yVU5rr2GJ2ktfP60T1b7fkLNDhvQLr1Scs4mi+mAPIW302LihFiAvT7fyuwdE9M6FeIESFzetEN6l3ZixE3bZvu1c9anYNuKqJRIJOwXEpnr3ojiu5xAZG/JjlcXgHrhsiJlIlLdO+iyAb+2lpbQQeThuCeQpE4DYQ== 295563358@qq.com"
[System.IO.File]::WriteAllText("C:\Users\Admin\.ssh\authorized_keys", $pubkey + "`n")
icacls C:\Users\Admin\.ssh\authorized_keys /inheritance:r /grant:r "Admin:R"
icacls C:\Users\Admin\.ssh /inheritance:r /grant:r "Admin:F"
Get-Content C:\Users\Admin\.ssh\authorized_keys
```

### 3. 管理员账户：写入 administrators_authorized_keys（关键！）

若 Admin 是管理员账户，需以**管理员身份**打开 PowerShell，执行 `fix-sshd-pubkey.ps1`，或手动执行：

```powershell
$pubkey = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQChFl/6lPpxUe+CdPe6J0dU1PuL11053rjcXMSZ1pvUpwgCkdiZA1ODU0cbOWfiIneo5yBu2BDR/ryJphs/1dJTKEp0BV1c+EsMPdTLgb4lOQNG/+0UbGRppf5N/ie/pp/SwV2cRShtV0ECYSRz0wv6FARgcI+Je8rTkTcqqKhJdpr3+c7srpyLDxjNpJ1Sc3LGGf+VTybNCg/B5hErNiWzskW/VTQG4mC+Ew18NVfrJ08vtgY4fEHrwx9DnLt5JHFjupMdweQI3mg/4uj9vBj7uX1FvXl+zFVqe+crKzpQ4rXRNxfoPoAvRG229D+iaE8ufjVhKZUNkpyaA96I0V9wB6JCyqRQAw43yFKKMqJYaLXVSnnAxqyiQXRpPa6ZUjIlTRLYXBv1ELa7tYXKoCCsWifc59CWbOZ9v9eAhkjce/dXUmcyDtokQt7XUFclWhse8c6RmPVZxzn1MBh5tgj/0F8IwTq55OfRl5Kb+bP2RH05XWy/dVpdbdf1iZzRMXo1imeyLIE6yVU5rr2GJ2ktfP60T1b7fkLNDhvQLr1Scs4mi+mAPIW302LihFiAvT7fyuwdE9M6FeIESFzetEN6l3ZixE3bZvu1c9anYNuKqJRIJOwXEpnr3ojiu5xAZG/JjlcXgHrhsiJlIlLdO+iyAb+2lpbQQeThuCeQpE4DYQ== 295563358@qq.com"
[System.IO.File]::WriteAllText("C:\ProgramData\ssh\administrators_authorized_keys", $pubkey + "`n")
icacls C:\ProgramData\ssh\administrators_authorized_keys /inheritance:r /grant "SYSTEM:F" /grant "Administrators:F"
(Get-Content C:\ProgramData\ssh\sshd_config) -replace 'PubkeyAuthentication no', 'PubkeyAuthentication yes' -replace '#PubkeyAuthentication yes', 'PubkeyAuthentication yes' | Set-Content C:\ProgramData\ssh\sshd_config
Restart-Service sshd
```

### 4. 退出并测试

```powershell
exit
```

在 Mac 上执行：

```bash
ssh company-windows
```

## 调试

若仍需要密码，在 Mac 上执行：

```bash
ssh -vvv company-windows
```

关注输出中的 `Offering public key`、`Authentication succeeded (publickey)`、`Next authentication method: password`。
