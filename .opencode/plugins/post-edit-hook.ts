import type { Plugin } from "@opencode-ai/plugin";

/**
 * Post-Edit Hook Plugin
 * 
 * 在每次文件修改后自动执行：
 * 1. 代码格式化 (Prettier)
 * 2. Lint 检查 (ESLint)
 * 3. TypeScript 类型检查
 */
export const PostEditHookPlugin: Plugin = async ({ $, worktree }) => {
  // 支持的文件扩展名
  const supportedExtensions = [
    '.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.scss', '.md'
  ];

  // 检查文件是否应该被处理
  const shouldProcess = (filePath: string): boolean => {
    return supportedExtensions.some(ext => filePath.endsWith(ext));
  };

  // 获取项目根目录
  const getProjectRoot = (filePath: string): string | null => {
    // 检查文件路径是否在某个 app 目录下
    if (filePath.includes('/apps/')) {
      const match = filePath.match(/(.+?\/apps\/[^/]+)/);
      return match ? match[1] : worktree;
    }
    return worktree;
  };

  return {
    "file.edited": async (input, output) => {
      const { filePath } = input;
      
      // 只处理支持的文件类型
      if (!shouldProcess(filePath)) {
        return;
      }

      const projectRoot = getProjectRoot(filePath);
      if (!projectRoot) {
        console.log(`[PostEditHook] 无法确定项目根目录: ${filePath}`);
        return;
      }

      console.log(`[PostEditHook] 处理文件: ${filePath}`);

      try {
        // 1. 运行 Prettier 格式化
        console.log(`[PostEditHook] 正在格式化...`);
        try {
          await $`cd ${projectRoot} && npx prettier --write ${filePath}`.quiet();
          console.log(`[PostEditHook] ✓ 格式化完成`);
        } catch (e) {
          // Prettier 可能未安装，静默失败
          console.log(`[PostEditHook] ⚠ 格式化跳过 (Prettier 可能未安装)`);
        }

        // 2. 运行 ESLint 自动修复
        console.log(`[PostEditHook] 正在运行 ESLint...`);
        try {
          const eslintResult = await $`cd ${projectRoot} && npx eslint --fix ${filePath}`.quiet().nothrow();
          if (eslintResult.exitCode === 0) {
            console.log(`[PostEditHook] ✓ ESLint 检查通过`);
          } else {
            console.log(`[PostEditHook] ⚠ ESLint 发现一些问题`);
          }
        } catch (e) {
          // ESLint 可能未安装，静默失败
          console.log(`[PostEditHook] ⚠ ESLint 跳过 (ESLint 可能未安装)`);
        }

        // 3. 运行 TypeScript 类型检查（仅对 ts/tsx 文件）
        if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
          console.log(`[PostEditHook] 正在运行 TypeScript 类型检查...`);
          try {
            // 检查是否有 tsconfig.json
            const tsconfigPath = `${projectRoot}/tsconfig.json`;
            const fs = await import('fs');
            
            if (fs.existsSync(tsconfigPath)) {
              // 只检查修改的文件，避免全项目检查太慢
              const tscResult = await $`cd ${projectRoot} && npx tsc --noEmit --skipLibCheck ${filePath}`.quiet().nothrow();
              if (tscResult.exitCode === 0) {
                console.log(`[PostEditHook] ✓ TypeScript 类型检查通过`);
              } else {
                console.log(`[PostEditHook] ✗ TypeScript 类型错误:\n${tscResult.stdout}`);
              }
            } else {
              console.log(`[PostEditHook] ⚠ 未找到 tsconfig.json，跳过类型检查`);
            }
          } catch (e) {
            console.log(`[PostEditHook] ⚠ TypeScript 检查跳过`);
          }
        }

        console.log(`[PostEditHook] 处理完成: ${filePath}`);
      } catch (error) {
        console.error(`[PostEditHook] 错误:`, error);
      }
    },
  };
};
