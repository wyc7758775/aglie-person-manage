# 测试编写指南

## 概述
本项目使用 Vitest 进行单元测试和集成测试，Playwright 进行 E2E 测试。

## 快速开始

### 运行测试
```bash
# 运行所有测试
pnpm test

# 只运行单元测试
pnpm test:unit

# 只运行集成测试
pnpm test:integration

# 只运行 E2E 测试
pnpm test:e2e

# 监听模式运行单元测试
pnpm test:watch
```

## 单元测试

### 文件命名
- 测试文件放在 `tests/unit/` 目录
- 文件命名规则：`{文件名}.test.ts` 或 `{文件名}.test.tsx`

### 示例
```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from '@/app/lib/my-module';

describe('my-module.ts', () => {
  describe('myFunction', () => {
    it('should return expected result', () => {
      expect(myFunction(input)).toBe(expected);
    });
  });
});
```

## 组件测试

### 使用 @testing-library/react
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MyComponent } from '@/app/ui/my-component';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent prop="value" />);
    expect(screen.getByText('value')).toBeInTheDocument();
  });
});
```

## 测试工具函数

项目提供了测试工具函数，位于 `tests/utils.tsx`：
- `simulateInput` - 模拟输入
- `simulateClick` - 模拟点击
- `simulateKeyPress` - 模拟按键
- `waitForLoadingToFinish` - 等待加载完成
- `mockApiResponse` - Mock API 成功响应
- `mockApiError` - Mock API 错误响应

## 最佳实践

1. **测试隔离**：每个测试独立运行
2. **描述清晰**：使用中文描述测试场景
3. **覆盖分支**：条件分支都要测试
4. **Mock 外部依赖**：API、数据库等使用 mock
5. **快速反馈**：单元测试应毫秒级完成

## 注意事项

- E2E 测试需要先安装浏览器：`pnpm exec playwright install`
- 测试配置在 `vitest.config.ts`
- 测试初始化在 `tests/vitest-setup.ts`
