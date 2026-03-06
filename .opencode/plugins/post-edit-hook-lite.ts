import type { Plugin } from "@opencode-ai/plugin";
import * as fs from "fs";
import * as path from "path";

/**
 * Post-Edit Hook Plugin - 轻量级版本
 * 
 * 针对本项目优化的文件修改后自动处理：
 * - 使用项目中已配置的 formatters
 * - 按需运行 lint 和 typecheck
 */
export const PostEditHookPlugin: Plugin = async ({ $, worktree }) => {
  // 需要处理的文件扩展名
  const supportedExtensions = [".ts", ".tsx", ".js", ".jsx", ".json", ".css", ".md"];

  // 排除的文件/目录模式
  const excludePatterns = [
    "node_modules",
    ".git",
    "dist",
    "build",
    ".next",
    "coverage",
  ];

  // 检查文件是否应该被处理
  const shouldProcess = (filePath: string): boolean => {
    // 检查是否在排除目录中
    if (excludePatterns.some((pattern) => filePath.includes(pattern))) {
      return false;
    }
    // 检查扩展名
    return supportedExtensions.some((ext) => filePath.endsWith(ext));
  };

  // 查找最近的包含 package.json 的目录
  const findPackageRoot = (filePath: string): string | null => {
    let currentDir = path.dirname(filePath);
    const root = path.parse(currentDir).root;

    while (currentDir !== root) {
      if (fs.existsSync(path.join(currentDir, "package.json"))) {
        return currentDir;
      }
      currentDir = path.dirname(currentDir);
    }
    return null;
  };

  return {
    "file.edited": async (input) => {
      const { filePath } = input;

      if (!shouldProcess(filePath)) {
        return;
      }

      const packageRoot = findPackageRoot(filePath);
      if (!packageRoot) {
        return;
      }

      console.log(`\n[PostEditHook] 📝 处理文件: ${path.relative(worktree, filePath)}`);

      try {
        // 1. 运行项目配置的 formatter
        await runFormatter($, packageRoot, filePath);

        // 2. 运行 lint（如果有配置）
        await runLint($, packageRoot, filePath);

        // 3. 运行类型检查（仅 TypeScript 文件）
        if (filePath.endsWith(".ts") || filePath.endsWith(".tsx")) {
          await runTypeCheck($, packageRoot, filePath);
        }

        console.log(`[PostEditHook] ✅ 完成\n`);
      } catch (error) {
        console.error(`[PostEditHook] ❌ 错误:`, error);
      }
    },
  };
};

// 运行代码格式化
async function runFormatter(
  $: any,
  packageRoot: string,
  filePath: string
): Promise<void> {
  try {
    // 检查是否有 prettier 配置
    const hasPrettier =
      fs.existsSync(path.join(packageRoot, ".prettierrc")) ||
      fs.existsSync(path.join(packageRoot, ".prettierrc.json")) ||
      fs.existsSync(path.join(packageRoot, ".prettierrc.js")) ||
      fs.existsSync(path.join(packageRoot, "prettier.config.js"));

    if (hasPrettier) {
      await $`cd ${packageRoot} && npx prettier --write ${filePath}`.quiet();
      console.log(`[PostEditHook] ✨ 已格式化`);
    } else {
      // 尝试使用 eslint --fix 作为备选
      await runEslintFix($, packageRoot, filePath);
    }
  } catch (e) {
    // 静默失败，不阻塞流程
  }
}

// 运行 ESLint --fix
async function runEslintFix(
  $: any,
  packageRoot: string,
  filePath: string
): Promise<void> {
  try {
    // 检查是否有 eslint 配置
    const hasEslint =
      fs.existsSync(path.join(packageRoot, ".eslintrc")) ||
      fs.existsSync(path.join(packageRoot, ".eslintrc.json")) ||
      fs.existsSync(path.join(packageRoot, ".eslintrc.js")) ||
      fs.existsSync(path.join(packageRoot, "eslint.config.js")) ||
      fs.existsSync(path.join(packageRoot, "eslint.config.mjs"));

    if (hasEslint) {
      await $`cd ${packageRoot} && npx eslint --fix ${filePath}`.quiet().nothrow();
      console.log(`[PostEditHook] 🔧 ESLint 已修复`);
    }
  } catch (e) {
    // 静默失败
  }
}

// 运行 Lint 检查
async function runLint(
  $: any,
  packageRoot: string,
  filePath: string
): Promise<void> {
  try {
    const packageJsonPath = path.join(packageRoot, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

    // 检查 package.json 中是否有 lint 脚本
    if (packageJson.scripts?.lint) {
      // 如果 lint 脚本是针对特定文件的，运行它
      // 否则跳过，避免全项目检查
      const lintScript = packageJson.scripts.lint;
      
      // 检查是否是文件级 lint（包含 $FILE 或类似变量）
      if (lintScript.includes("$FILE") || lintScript.includes("${FILE}")) {
        await $`cd ${packageRoot} && FILE=${filePath} pnpm lint`.quiet().nothrow();
        console.log(`[PostEditHook] 🔍 Lint 检查完成`);
      }
    }
  } catch (e) {
    // 静默失败
  }
}

// 运行 TypeScript 类型检查
async function runTypeCheck(
  $: any,
  packageRoot: string,
  filePath: string
): Promise<void> {
  try {
    const tsconfigPath = path.join(packageRoot, "tsconfig.json");
    
    if (!fs.existsSync(tsconfigPath)) {
      return;
    }

    // 检查 package.json 中是否有 typecheck 脚本
    const packageJsonPath = path.join(packageRoot, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

    if (packageJson.scripts?.typecheck) {
      // 如果有 typecheck 脚本，使用它
      await $`cd ${packageRoot} && pnpm typecheck`.quiet().nothrow();
      console.log(`[PostEditHook] 📐 类型检查完成`);
    } else {
      // 否则运行 tsc --noEmit
      const result = await $`cd ${packageRoot} && npx tsc --noEmit --skipLibCheck`
        .quiet()
        .nothrow();
      
      if (result.exitCode === 0) {
        console.log(`[PostEditHook] 📐 类型检查通过`);
      } else {
        console.log(`[PostEditHook] ⚠️ 类型检查发现问题`);
        // 输出错误但不阻塞
        console.log(result.stdout || result.stderr);
      }
    }
  } catch (e) {
    // 静默失败
  }
}
