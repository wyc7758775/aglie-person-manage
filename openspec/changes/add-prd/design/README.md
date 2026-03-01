# 登录界面 UI 设计规范

## 概述

本设计规范为 Be.run 登录界面产品需求文档的配套设计输出，由 Pencil MCP 自动生成并人工优化。

**关联文档:**
- PRD: `product-designs/login-interface-20260301/prd.md`
- 设计规范: `login-interface-design.md`
- HTML 参考: `login-reference.html` (可直接在浏览器打开预览)

---

## 设计稿清单

### 已生成视口

| 视口 | 尺寸 | 文件 | 状态 |
|------|------|------|------|
| Desktop | 1440x900 | add-prd-desktop.png | ✅ 占位 |
| Tablet | 768x1024 | add-prd-tablet.png | ✅ 占位 |
| Mobile | 375x667 | add-prd-mobile.png | ✅ 占位 |

> **注意:** 当前为占位文件，实际设计稿需要使用 Puppeteer 渲染生成

---

## 设计系统

### 颜色体系

```json
{
  "primary": {
    "base": "#4F46E5",
    "hover": "#4338CA",
    "active": "#3730A3",
    "light": "#EEF2FF",
    "border": "#C7D2FE"
  },
  "neutral": {
    "bg": "#F9FAFB",
    "surface": "#FFFFFF",
    "text-primary": "#111827",
    "text-secondary": "#6B7280",
    "text-muted": "#9CA3AF",
    "border": "#E5E7EB",
    "border-hover": "#D1D5DB"
  },
  "semantic": {
    "error": "#EF4444",
    "error-bg": "#FEF2F2",
    "error-border": "#FECACA",
    "success": "#10B981",
    "warning": "#F59E0B"
  }
}
```

### 字体规范

- **字体族:** Inter, -apple-system, BlinkMacSystemFont, sans-serif
- **标题:** 24px, font-weight 700
- **标签:** 14px, font-weight 500
- **输入文字:** 16px, font-weight 400
- **按钮:** 16px, font-weight 600
- **错误提示:** 14px, font-weight 400

### 间距系统

| Token | 值 | 用途 |
|-------|-------|------|
| xs | 4px | 图标与文字间距 |
| sm | 8px | 紧凑元素间距 |
| md | 16px | 标准间距 |
| lg | 24px | 组件间距 |
| xl | 32px | 区块间距 |
| 2xl | 40px | 卡片内边距 |

---

## 组件规范

### 1. 登录卡片

```
容器:
- 宽度: 420px (桌面), 380px (平板), calc(100% - 32px) (移动)
- 内边距: 40px
- 圆角: 16px
- 背景: #FFFFFF (或毛玻璃效果 rgba(255,255,255,0.95))
- 阴影: 0 25px 50px -12px rgba(0, 0, 0, 0.25)
```

### 2. Logo 区域

```
图标容器:
- 尺寸: 64x64px
- 圆角: 12px
- 背景: 主色 (#4F46E5)
- 图标: 闪电图标, 32px, 白色

标题:
- 字号: 24px
- 字重: 700
- 颜色: #111827
- 上边距: 16px
```

### 3. 标签页切换

```
容器:
- 下边框: 1px solid #E5E7EB
- 布局: flex, 等分

标签项:
- 内边距: 12px 20px
- 字号: 14px
- 选中: 主色文字 + 2px 主色下边框
- 未选中: 灰色文字, 无边框
```

### 4. 输入框

```
基础样式:
- 高度: 44px
- 内边距: 12px 16px
- 圆角: 8px
- 边框: 1px solid #E5E7EB
- 聚焦: 主色边框 + 3px 主色光晕

验证码输入:
- 宽度: flex-1
- 按钮间距: 12px

获取验证码按钮:
- 高度: 44px
- 内边距: 8px 16px
- 圆角: 8px
- 默认: 灰色背景 + 主色文字
- 倒计时: 绿色背景 + 白色文字
```

### 5. 登录按钮

```
基础样式:
- 高度: 44px
- 宽度: 100%
- 圆角: 8px
- 背景: 主色渐变
- 文字: 白色, 16px, 600

状态:
- 悬停: 加深背景色
- 按下: 更深背景色
- Loading: 显示 spinner + "登录中..."
- 禁用: 浅主色背景
```

### 6. 错误提示

```
容器:
- 内边距: 12px
- 圆角: 8px
- 背景: #FEF2F2
- 边框: 1px solid #FECACA

内容:
- 图标: 警告图标, 16px, 红色
- 文字: 14px, 红色
- 图标与文字间距: 8px
```

---

## 交互规范

### 登录方式切换

1. 点击标签时切换表单内容
2. 使用淡入淡出动画 (200ms ease-in-out)
3. 已输入的邮箱地址保留
4. 验证码/密码清空

### 获取验证码

1. 点击按钮进入倒计时 (60s)
2. 按钮禁用并显示倒计时
3. 倒计时结束恢复可点击状态
4. 连续点击需防重复提交

### 表单验证

1. 邮箱失焦时验证格式
2. 验证码实时限制数字输入
3. 提交时验证所有必填项
4. 错误时高亮对应输入框

### Loading 状态

1. 按钮显示 spinner
2. 输入框禁用
3. 防止重复提交

---

## 响应式设计

### 断点

| 设备 | 宽度范围 | 卡片宽度 |
|------|----------|----------|
| Desktop | >= 1024px | 420px |
| Tablet | 768-1023px | 380px |
| Mobile | < 768px | 100% - 32px |

### 移动端适配

- Logo 缩小 20% (51x51px)
- 卡片内边距: 24px
- 字号保持相对单位
- 触摸目标 >= 44px

---

## 无障碍设计

- ✅ 支持键盘导航 (Tab, Enter)
- ✅ 焦点状态清晰可见
- ✅ 错误提示使用 role="alert"
- ✅ 输入框有 aria-label
- ✅ 对比度 >= 4.5:1

---

## 文件结构

```
design/
├── README.md                      # 本文档
├── login-interface-design.md      # 详细设计规范
├── login-reference.html           # HTML 参考实现
├── design-tokens.json            # 设计令牌
├── components-spec.json          # 组件规范
└── ui-mockups/                   # 设计稿占位文件
    ├── desktop.png
    ├── tablet.png
    └── mobile.png
```

---

## 实现检查清单

- [ ] 桌面端布局实现
- [ ] 移动端适配
- [ ] 标签切换动画
- [ ] 验证码倒计时
- [ ] 表单验证逻辑
- [ ] Loading 状态
- [ ] 错误提示样式
- [ ] 无障碍支持
- [ ] 响应式测试
- [ ] UI 验证通过

---

## 参考资源

- [项目 UI 规范](../../apps/web/UI_DESIGN_SPEC.md)
- [Tailwind CSS](https://tailwindcss.com/)
- [Inter 字体](https://rsms.me/inter/)
