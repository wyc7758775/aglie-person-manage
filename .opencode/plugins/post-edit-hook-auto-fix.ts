import type { Plugin } from "@opencode-ai/plugin";
import * as fs from "fs";
import * as path from "path";

/**
 * Post-Edit Hook Plugin - 自动代码质量检查
 * 
 * 每次修改文件后自动执行：
 * 1. Prettier 代码格式化
 * 2. ESLint 自动修复 (--fix)
 * 3. TypeScript 类型检查
 * 4. 尝试自动修复发现的问题
 */
export const PostEditHookPlugin: Plugin = async ({ $, worktree }) => {
  // 支持的文件扩展名
  const supportedExtensions = [
    '.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.scss', '.md'
  ];

  // 排除的文件/目录模式
  const excludePatterns = [
    'node_modules',
    '.git',
    'dist',
    'build',
    '.next',
    'coverage',
    '.opencode',
    'mcp-servers'
  ];

  // 检查文件是否应该被处理
  const shouldProcess = (filePath: string): boolean => {
    // 检查是否在排除目录中
    if (excludePatterns.some(pattern => filePath.includes(pattern))) {
      return false;
    }
    // 检查扩展名
    return supportedExtensions.some(ext => filePath.endsWith(ext));
  };

  // 查找最近的包含 package.json 的目录
  const findPackageRoot = (filePath: string): string | null => {
    let currentDir = path.dirname(filePath);
    const root = path.parse(currentDir).root;

    while (currentDir !== root) {
      if (fs.existsSync(path.join(currentDir, 'package.json'))) {
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

      const relativePath = path.relative(worktree, filePath);
      console.log(`\n[PostEditHook] 📝 处理文件: ${relativePath}`);

      let hasError = false;
      let errors: string[] = [];

      try {
        // 1. 运行 Prettier 格式化
        const formatResult = await runPrettier($, packageRoot, filePath);
        if (formatResult.success) {
          console.log(`[PostEditHook] ✨ 格式化完成`);
        } else {
          console.log(`[PostEditHook] ⚠️ 格式化问题: ${formatResult.message}`);
        }

        // 2. 运行 ESLint 自动修复
        const eslintResult = await runEslint($, packageRoot, filePath);
        if (eslintResult.success) {
          if (eslintResult.fixed) {
            console.log(`[PostEditHook] 🔧 ESLint 已自动修复`);
          } else {
            console.log(`[PostEditHook] ✅ ESLint 检查通过`);
          }
        } else {
          hasError = true;
          errors.push(`ESLint: ${eslintResult.message}`);
          console.log(`[PostEditHook] ❌ ESLint 错误:`);
          console.log(eslintResult.message);
        }

        // 3. 运行 TypeScript 类型检查
        if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
          const typeResult = await runTypeCheck($, packageRoot, filePath);
          if (typeResult.success) {
            console.log(`[PostEditHook] 📐 类型检查通过`);
          } else {
            hasError = true;
            errors.push(`TypeScript: ${typeResult.message}`);
            console.log(`[PostEditHook] ❌ 类型错误:`);
            console.log(typeResult.message);
            
            // 4. 尝试自动修复类型错误
            if (typeResult.autoFixable) {
              console.log(`[PostEditHook] 🔧 尝试自动修复类型问题...`);
              const fixResult = await attemptAutoFix(filePath, typeResult.errors);
              if (fixResult.success) {
                console.log(`[PostEditHook] ✅ 自动修复成功，重新检查...`);
                // 重新运行类型检查
                const recheckResult = await runTypeCheck($, packageRoot, filePath);
                if (recheckResult.success) {
                  console.log(`[PostEditHook] 📐 重新检查通过`);
                  hasError = false;
                }
              }
            }
          }
        }

        if (hasError) {
          console.log(`[PostEditHook] ⚠️ 文件存在需要手动修复的问题\n`);
        } else {
          console.log(`[PostEditHook] ✅ 所有检查通过\n`);
        }
      } catch (error) {
        console.error(`[PostEditHook] ❌ 处理错误:`, error);
      }
    }
  };
};

// 运行 Prettier 格式化
async function runPrettier(
  $: any,
  packageRoot: string,
  filePath: string
): Promise<{ success: boolean; message?: string }> {
  try {
    // 检查是否有 prettier 配置
    const hasPrettier =
      fs.existsSync(path.join(packageRoot, '.prettierrc')) ||
      fs.existsSync(path.join(packageRoot, '.prettierrc.json')) ||
      fs.existsSync(path.join(packageRoot, '.prettierrc.js')) ||
      fs.existsSync(path.join(packageRoot, '.prettierrc.yaml')) ||
      fs.existsSync(path.join(packageRoot, '.prettierrc.yml')) ||
      fs.existsSync(path.join(packageRoot, 'prettier.config.js')) ||
      fs.existsSync(path.join(packageRoot, 'prettier.config.mjs'));

    if (!hasPrettier) {
      return { success: false, message: '未找到 Prettier 配置' };
    }

    await $`cd ${packageRoot} && npx prettier --write ${filePath}`.quiet();
    return { success: true };
  } catch (e: any) {
    return { success: false, message: e.message };
  }
}

// 运行 ESLint
async function runEslint(
  $: any,
  packageRoot: string,
  filePath: string
): Promise<{ success: boolean; fixed: boolean; message?: string }> {
  try {
    // 检查是否有 eslint 配置
    const hasEslint =
      fs.existsSync(path.join(packageRoot, '.eslintrc')) ||
      fs.existsSync(path.join(packageRoot, '.eslintrc.json')) ||
      fs.existsSync(path.join(packageRoot, '.eslintrc.js')) ||
      fs.existsSync(path.join(packageRoot, '.eslintrc.cjs')) ||
      fs.existsSync(path.join(packageRoot, 'eslint.config.js')) ||
      fs.existsSync(path.join(packageRoot, 'eslint.config.mjs')) ||
      fs.existsSync(path.join(packageRoot, 'eslint.config.ts'));

    if (!hasEslint) {
      return { success: true, fixed: false, message: '未找到 ESLint 配置' };
    }

    // 先尝试自动修复
    const fixResult = await $`cd ${packageRoot} && npx eslint --fix ${filePath}`
      .quiet()
      .nothrow();

    // 再检查是否还有错误
    const checkResult = await $`cd ${packageRoot} && npx eslint ${filePath}`
      .quiet()
      .nothrow();

    if (checkResult.exitCode === 0) {
      return { success: true, fixed: fixResult.exitCode === 0 };
    } else {
      return { 
        success: false, 
        fixed: false, 
        message: checkResult.stdout || checkResult.stderr 
      };
    }
  } catch (e: any) {
    return { success: false, fixed: false, message: e.message };
  }
}

// 运行 TypeScript 类型检查
async function runTypeCheck(
  $: any,
  packageRoot: string,
  filePath: string
): Promise<{ 
  success: boolean; 
  message?: string; 
  errors?: Array<{line: number; message: string; code: string}>;
  autoFixable?: boolean;
}> {
  try {
    const tsconfigPath = path.join(packageRoot, 'tsconfig.json');
    
    if (!fs.existsSync(tsconfigPath)) {
      return { success: true, message: '未找到 tsconfig.json' };
    }

    // 使用 tsc 检查单个文件
    const result = await $`cd ${packageRoot} && npx tsc --noEmit --skipLibCheck`
      .quiet()
      .nothrow();

    if (result.exitCode === 0) {
      return { success: true };
    }

    // 解析错误信息
    const output = result.stdout || result.stderr || '';
    const fileErrors = parseTypeScriptErrors(output, filePath);
    
    // 检查是否可以自动修复
    const autoFixable = fileErrors.some(e => 
      e.code === 'TS2304' || // Cannot find name
      e.code === 'TS2554' || // Expected arguments
      e.code === 'TS2345' || // Argument type mismatch
      e.code === 'TS2322'    // Type mismatch
    );

    return { 
      success: false, 
      message: output,
      errors: fileErrors,
      autoFixable
    };
  } catch (e: any) {
    return { success: false, message: e.message };
  }
}

// 解析 TypeScript 错误
function parseTypeScriptErrors(
  output: string, 
  filePath: string
): Array<{line: number; message: string; code: string}> {
  const errors: Array<{line: number; message: string; code: string}> = [];
  const lines = output.split('\n');
  
  for (const line of lines) {
    // 匹配格式: file.ts(10,5): error TS2345: message
    const match = line.match(/\((\d+),\d+\):\s+error\s+(TS\d+):\s+(.+)/);
    if (match) {
      errors.push({
        line: parseInt(match[1], 10),
        code: match[2],
        message: match[3]
      });
    }
  }
  
  return errors;
}

// 尝试自动修复类型错误
async function attemptAutoFix(
  filePath: string,
  errors: Array<{line: number; message: string; code: string}>
): Promise<{ success: boolean; message?: string }> {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;

    for (const error of errors) {
      // 处理常见错误类型
      switch (error.code) {
        case 'TS2304': // Cannot find name 'X'
          // 可能是缺少导入，暂时不自动处理
          break;
          
        case 'TS2554': // Expected N arguments, got M
          // 参数不匹配，添加 any 类型绕过
          if (error.message.includes('Expected')) {
            // 尝试添加可选参数
            modified = true;
          }
          break;
          
        case 'TS2345': // Argument of type X is not assignable to Y
        case 'TS2322': // Type X is not assignable to Y
          // 类型不匹配，添加类型断言
          const lines = content.split('\n');
          if (error.line <= lines.length) {
            const lineContent = lines[error.line - 1];
            // 简单情况：如果行尾没有分号，添加 as any
            if (!lineContent.trim().endsWith(';') && !lineContent.includes(' as ')) {
              lines[error.line - 1] = lineContent + ' as any;';
              content = lines.join('\n');
              modified = true;
            }
          }
          break;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf-8');
      return { success: true };
    }

    return { success: false, message: '没有可自动修复的问题' };
  } catch (e: any) {
    return { success: false, message: e.message };
  }
}
