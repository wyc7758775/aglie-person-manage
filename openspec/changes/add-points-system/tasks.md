## 1. 数据模型更新

- [ ] 1.1 在 `app/lib/definitions.ts` 中更新类型定义
  - 在 `Project` 类型中添加 `points: number` 字段
  - 在 `Requirement` 类型中添加 `points: number` 字段
  - 在 `User` 类型中添加 `totalPoints: number` 字段
  - 更新 `ProjectCreateRequest` 和 `ProjectUpdateRequest` 类型
  - 更新 `RequirementCreateRequest` 和 `RequirementUpdateRequest` 类型

- [ ] 1.2 在 `app/lib/placeholder-data.ts` 中更新示例数据
  - 为所有现有项目添加 `points: 0` 默认值
  - 为所有现有需求添加 `points: 0` 默认值
  - 为所有现有用户添加 `totalPoints: 0` 默认值

## 2. 项目积分功能实现

- [ ] 2.1 更新 `app/lib/projects.ts`
  - 在 `createProject` 函数中添加积分字段处理（默认 0）
  - 在 `updateProject` 函数中添加积分字段处理
  - 添加 `calculateProjectPoints` 函数（根据优先级自动计算）
  - 添加 `addPointsToUser` 函数（项目完成时累加积分）

- [ ] 2.2 更新 `app/api/projects/route.ts`
  - 在 POST 方法中添加积分字段验证（非负数）
  - 支持自动计算积分（如果未提供积分值）

- [ ] 2.3 更新 `app/api/projects/[id]/route.ts`
  - 在 PUT 方法中添加积分字段验证
  - 当状态从非 `completed` 变为 `completed` 时，自动累加积分到用户总积分
  - 确保不会重复累加积分

## 3. 需求积分功能实现

- [ ] 3.1 更新 `app/lib/requirements.ts`
  - 在 `createRequirement` 函数中添加积分字段处理（默认 0）
  - 在 `updateRequirement` 函数中添加积分字段处理
  - 添加 `calculateRequirementPoints` 函数（根据优先级自动计算）
  - 添加 `addPointsToUser` 函数（需求完成时累加积分）

- [ ] 3.2 更新 `app/api/requirements/route.ts`
  - 在 POST 方法中添加积分字段验证（非负数）
  - 支持自动计算积分（如果未提供积分值）

- [ ] 3.3 更新 `app/api/requirements/[id]/route.ts`
  - 在 PUT 方法中添加积分字段验证
  - 当状态从非 `completed` 变为 `completed` 时，自动累加积分到用户总积分
  - 确保不会重复累加积分

## 4. 用户积分功能实现

- [ ] 4.1 更新用户相关函数
  - 在 `app/lib/placeholder-data.ts` 中添加 `getUserTotalPoints` 函数
  - 在 `app/lib/placeholder-data.ts` 中添加 `updateUserTotalPoints` 函数
  - 确保积分累加操作的原子性

- [ ] 4.2 创建用户积分 API（可选）
  - 创建 `app/api/users/[id]/points/route.ts`
  - 实现 GET 方法：获取用户总积分
  - 实现 PUT 方法：更新用户总积分（仅内部使用）

## 5. UI 组件更新

- [ ] 5.1 更新项目表单组件
  - 在 `app/ui/dashboard/project-form.tsx` 或相关组件中添加积分输入字段
  - 添加"自动计算"选项，根据优先级自动填充积分
  - 添加积分输入验证（非负数）

- [ ] 5.2 更新需求表单组件
  - 在 `app/ui/dashboard/requirement-form.tsx` 中添加积分输入字段
  - 添加"自动计算"选项，根据优先级自动填充积分
  - 添加积分输入验证（非负数）

- [ ] 5.3 更新项目列表/详情展示
  - 在项目卡片或详情中显示积分值
  - 显示用户总积分（在用户信息区域）

- [ ] 5.4 更新需求列表/详情展示
  - 在需求卡片或详情中显示积分值

## 6. 测试与验证

- [ ] 6.1 测试项目积分功能
  - 创建项目时设置积分
  - 创建项目时使用自动计算
  - 更新项目状态为 completed 时积分累加
  - 验证不会重复累加积分

- [ ] 6.2 测试需求积分功能
  - 创建需求时设置积分
  - 创建需求时使用自动计算
  - 更新需求状态为 completed 时积分累加
  - 验证不会重复累加积分

- [ ] 6.3 测试用户总积分
  - 验证多个工作项完成时积分正确累加
  - 验证用户总积分查询正确

- [ ] 6.4 运行 `pnpm build` 验证构建成功
