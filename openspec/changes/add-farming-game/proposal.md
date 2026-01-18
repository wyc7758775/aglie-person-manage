# add-farming-game 提案

## 项目概述

在 Dashboard 首页 (`/dashboard`) 创建沉浸式像素风格的种田游戏，致敬《星露谷物语》体验。游戏采用全屏像素渲染，支持天气系统、季节变化，并通过数据库存档实现进度持久化。

## 目标

- 创建全屏沉浸式像素风格种田游戏
- 实现星露谷物语风格的视觉效果（像素精灵、平铺背景）
- 添加全屏加载进度条（解决资源加载问题）
- 建立太阳光作为游戏核心资源
- 实现完整的种植、生长、加速、收获机制
- 支持天气系统（晴/雨/雪）和季节变化
- 农田扩建系统（解锁更多地块）
- 为未来任务-阳光兑换奠定基础

## 背景

根据 `project.md` 规划：
> 奖励展示：通过种田游戏来展示自己通过完成任务或者需求得到的能量，可以日渐扩大自己的农田和农庄

当前状态：
- `app/dashboard/page.tsx` 仅为占位页面
- 奖励系统 (`reward/` 页面) 尚未实现
- 用户积分数据已有基础结构

## 实施范围

### 包含

**第一阶段（核心）：**
- 全屏像素风格游戏界面（Canvas 渲染）
- 像素素材资源（Kenney.nl 免费素材）
- 全屏加载进度条组件
- 太阳光资源系统（显示、积累、加速）
- 基础作物种植和生长机制（精灵动画）
- 6 个初始农田地块

**第二阶段（数据）：**
- 数据库存档对接
- 用户游戏进度持久化

**第三阶段（扩展）：**
- 天气系统（晴/雨/雪 + 粒子效果）
- 季节变化效果（春夏秋冬视觉变化）
- 农田扩建系统（解锁更多地块）

### 不包含
- 任务-阳光兑换逻辑（数据层，未来）
- 多人互动
- 成就系统（未来）
- 作物升级进化（未来）

## 视觉风格

### 星露谷物语像素风格
- **像素精灵**：使用 16x16 或 32x32 像素的 Sprite 图
- **平铺背景**：草地、土壤纹理全屏平铺
- **像素化渲染**：CSS `image-rendering: pixelated`
- **流畅动画**：帧动画系统（Sprite 切换）

### 素材来源
- **Kenney.nl** - 高质量免费游戏素材
- **OpenGameArt.org** - 社区像素素材

### 素材清单

| 文件 | 用途 | 来源 |
|------|------|------|
| `grass.png` | 草地背景（平铺） | Kenney Pixelart TopDown |
| `soil.png` | 耕地背景 | Kenney Pixelart TopDown |
| `crops.png` | 作物 Sprite（多帧） | Kenney RPG Pack |
| `sun.png` | 太阳 Sprite | Kenney UI Pack |
| `weather/rain.png` | 雨滴粒子 | Kenney Particles |
| `weather/snow.png` | 雪花粒子 | Kenney Particles |
| `weather/clouds.png` | 云朵背景 | Kenney Sky |

## 技术实现

### 渲染方式
- React + Canvas API 进行像素渲染
- CSS `image-rendering: pixelated` 保持像素风格
- `requestAnimationFrame` 进行游戏循环

### 资源加载
- 全屏进度条显示资源加载状态
- 所有资源预加载完成后显示游戏
- 支持断网重试

### 文件结构

```
app/dashboard/farming/
├── types.ts           # 游戏类型定义
├── GameContainer.tsx  # 游戏主容器
├── SunEnergy.tsx      # 太阳光能量显示
├── FarmPlot.tsx       # 农田地块组件
├── Crop.tsx           # 作物组件
├── CropShop.tsx       # 作物商店/选择
├── LoadingScreen.tsx  # 加载界面
├── WeatherSystem.tsx  # 天气系统
└── SeasonManager.tsx  # 季节管理

public/assets/
├── tiles/             # 地块纹理
│   ├── grass.png
│   ├── soil.png
│   ├── wet_soil.png
│   └── path.png
├── crops/             # 作物像素图
│   ├── wheat.png
│   ├── carrot.png
│   └── tomato.png
├── weather/           # 天气粒子
│   ├── rain.png
│   ├── snow.png
│   └── clouds.png
├── ui/                # UI 元素
│   ├── panel.png
│   └── button.png
└── background/        # 背景纹理
    ├── spring.png
    ├── summer.png
    ├── autumn.png
    └── winter.png
```

## 成功标准

1. 访问 `/dashboard` 显示全屏像素风格农田
2. 加载时显示进度条，无白屏等待
3. 太阳光资源可显示、积累、消耗
4. 作物有像素精灵动画效果
5. 支持晴/雨/雪天气切换
6. 季节变化影响游戏视觉
7. 可解锁扩建农田
8. 构建无错误

## 时间线

| 阶段 | 内容 | 预估时间 |
|------|------|----------|
| **准备阶段** | 下载素材、设置项目结构 | 1小时 |
| **第一阶段** | Canvas 渲染 + 像素化 + 进度条 | 4-5小时 |
| **第二阶段** | 数据库存档对接 | 4小时 |
| **第三阶段** | 天气系统 + 季节变化 | 3-4小时 |
| **测试优化** | 性能优化、bug修复 | 2小时 |

**总计：14-16 小时**

## 依赖关系

- 依赖 `add-logout-feature` 的 `useAuth` Hook
- 依赖 `consolidate-icons` 的图标库（UI 部分）
- 需要 `public/assets/` 目录存储像素素材
- 需要数据库表存储游戏进度（未来）
