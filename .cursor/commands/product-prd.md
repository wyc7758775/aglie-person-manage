---
name: /product-prd
id: product-prd
category: 产品设计
description: 交互式创建产品需求文档（PRD），遇不确定项向开发提问并提供可选项，开发可点击选择或输入完成全部文案。
---
<!-- PRODUCT-PRD:START -->
**交互原则**
- 遇不确定、有歧义或需开发决策的项，**不猜测**，向开发提问
- 每次提问提供 2–5 个可选项 +「其他（请直接输入）」
- 开发可回复数字（如 `1`）选择，或直接输入文案
- 待开发回复后再继续，避免一次问太多

**提问格式**
```
【问题】[简短说明]

请选择或输入：
1. [选项 A]
2. [选项 B]
3. [选项 C]
4. 其他（请直接输入你的答案）

回复数字或直接输入即可。
```

**步骤**
1. 读取 `.cursor/skills/product-requirements-guide/SKILL.md` 了解完整流程
2. 从需求名、背景、目标等开始，逐项提问（有疑必问，提供可选项）
3. 根据开发回复，按 `template.md` 结构生成 PRD
4. 创建 `product-designs/{需求名}-{YYYYMMDD}/prd.md`，日期为当天
5. 若涉及界面文案，询问是否生成 i18n 文档
6. 向开发说明文件路径，询问是否需要补充或修改

**参考**
- 技能：`.cursor/skills/product-requirements-guide/SKILL.md`
- 模板：`.cursor/skills/product-requirements-guide/template.md`
- 交互逻辑：`.cursor/skills/product-requirements-guide/interaction-logic-template.md`
- i18n：`.cursor/skills/product-requirements-guide/i18n-template.md`
<!-- PRODUCT-PRD:END -->
