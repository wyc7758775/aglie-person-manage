# 代码质量检查工具

本项目配置了自动代码质量检查工具，每次修改文件后会自动运行检查并尝试修复问题。

## 功能特性

✅ **自动格式化** - Prettier 自动格式化代码  
✅ **自动修复** - ESLint 自动修复可修复的问题  
✅ **类型检查** - TypeScript 类型检查  
✅ **错误提示** - 无法自动修复的问题会显示在终端  

## 文件修改后自动执行

当你修改任何 `.ts`, `.tsx`, `.js`, `.jsx`, `.json`, `.css`, `.md` 文件后，hook 会自动：

1. 运行 `prettier --write` 格式化代码
2. 运行 `eslint --fix` 自动修复代码风格问题
3. 运行 `tsc --noEmit` 检查 TypeScript 类型错误
4. 尝试自动修复一些类型错误（如添加 `as any`）

## 可用命令

### 根目录命令
```bash
pnpm lint           # ESLint 检查
pnpm lint:fix       # ESLint 自动修复
pnpm format         # Prettier 格式化
pnpm format:check   # Prettier 格式检查（不写入）
pnpm typecheck      # TypeScript 类型检查
pnpm check          # 运行所有检查（typecheck + lint + format:check）
```

### apps/web 目录命令
```bash
pnpm --filter web lint
pnpm --filter web lint:fix
pnpm --filter web format
pnpm --filter web typecheck
pnpm --filter web check
```

## 配置文件

- **ESLint**: `apps/web/.eslintrc.json`
- **Prettier**: `apps/web/.prettierrc`
- **Post-Edit Hook**: `.opencode/plugins/post-edit-hook-auto-fix.ts`

## ESLint 规则

当前启用的规则：
- `@typescript-eslint/no-unused-vars` - 未使用变量警告
- `@typescript-eslint/no-explicit-any` - 避免使用 `any` 类型警告
- `prefer-const` - 推荐使用 const
- `no-var` - 禁止使用 var

## 预配置检查脚本

package.json 中已添加的脚本：

```json
{
  "scripts": {
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "typecheck": "tsc --noEmit --skipLibCheck",
    "check": "pnpm typecheck && pnpm lint && pnpm format:check"
  }
}
```

## 问题处理

如果自动检查后发现问题：

1. **ESLint 警告** - 通常是未使用的变量，可以删除或添加 `_` 前缀忽略
2. **类型错误** - 需要手动修复类型定义
3. **格式化问题** - 运行 `pnpm format` 自动修复

## 禁用自动检查

如果需要临时禁用某个文件的自动检查，可以：

1. 在文件顶部添加 ESLint 禁用注释：
   ```typescript
   /* eslint-disable @typescript-eslint/no-unused-vars */
   ```

2. 或者在特定行禁用：
   ```typescript
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const data: any = fetchData();
   ```

## 更新配置

要修改 ESLint 或 Prettier 配置，编辑以下文件：
- `apps/web/.eslintrc.json` - ESLint 规则
- `apps/web/.prettierrc` - Prettier 格式化选项
