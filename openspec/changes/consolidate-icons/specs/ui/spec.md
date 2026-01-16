# UI Specification

## ADDED Requirements

### Requirement: 图标统一管理
系统 SHALL 提供统一的图标库，所有图标通过 `app/ui/icons/` 目录管理和导出。

#### Scenario: 按功能分类的图标目录
- **WHEN** 查看 `app/ui/icons/` 目录
- **THEN** 图标按功能分组：navigation/、action/、form/、feedback/、heroicons/

#### Scenario: 统一的图标导出
- **WHEN** 组件需要导入图标
- **THEN** 可从 `@/app/ui/icons` 统一导入所有图标

#### Scenario: Heroicons 统一导入
- **WHEN** 组件需要使用 Heroicons
- **THEN** 从 `@/app/ui/icons/heroicons` 导入，而非直接从 `@heroicons/react`

#### Scenario: 图标向后兼容
- **GIVEN** 现有组件使用 Icons 映射对象
- **WHEN** 图标库重构后
- **THEN** Icons 对象继续可用，不破坏现有代码

---

### Requirement: 图标组件接口一致性
系统 SHALL 为所有图标组件提供一致的 Props 接口。

#### Scenario: IconProps 接口
- **WHEN** 查看任意图标组件
- **THEN** 使用 `interface IconProps { className?: string; color?: string }`

#### Scenario: 默认样式值
- **WHEN** 图标组件未传递 className 或 color
- **THEN** className 默认为 `"w-5 h-5"` 或 `"w-4 h-4"`
- **AND** color 默认为 `"currentColor"`

---

### Requirement: 无直接外部图标依赖
系统 SHALL 移除所有对 `@heroicons/react` 的直接导入，通过包装模块使用。

#### Scenario: 构建验证
- **WHEN** 运行 `rg "from '@heroicons/react'" app --type ts`
- **THEN** 返回 0 个结果

#### Scenario: Heroicons 包装模式
- **WHEN** 查看 heroicons/ 目录下的文件
- **THEN** 每个文件包装对应的 Heroicons 组件
- **AND** 使用 `export const IconName: React.FC<...> = (props) => (<HeroIcon {...props} />);`

---

## MODIFIED Requirements

### Requirement: 图标组件导出方式变更
系统图标组件导出路径从单个文件改为目录结构。

#### Scenario: 旧导出方式
- **GIVEN** 导出前使用 `from '@/app/ui/icons'`
- **WHEN** 导入图标
- **THEN** 所有图标从 `app/ui/icons.tsx` 导入

#### Scenario: 新导出方式
- **GIVEN** 导出后使用 `from '@/app/ui/icons'`
- **WHEN** 导入图标
- **THEN** 图标按路径分类导入：
  - navigation 图标：`from '@/app/ui/icons/navigation'`
  - action 图标：`from '@/app/ui/icons/action'`
  - form 图标：`from '@/app/ui/icons/form'`
  - feedback 图标：`from '@/app/ui/icons/feedback'`
  - heroicons：`from '@/app/ui/icons/heroicons'`

---

## REMOVED Requirements

### Requirement: 删除旧的图标文件
系统 SHALL 删除 `app/ui/icons.tsx` 单一文件，迁移到目录结构。

#### Scenario: 文件删除
- **WHEN** 图标迁移完成
- **THEN** `app/ui/icons.tsx` 文件不存在

#### Scenario: 构建验证
- **GIVEN** 迁移后的图标结构
- **WHEN** 运行 `pnpm build`
- **THEN** 构建成功，无关于 icons.tsx 的错误
