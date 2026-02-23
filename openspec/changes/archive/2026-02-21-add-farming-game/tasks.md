# add-farming-game 任务清单

## 任务0：准备像素资源

### 0.1 下载 Kenney.nl 免费像素资源
- [x] 访问 kenney.nl 下载 Pixel Platformer 或 Pixel Farm 资源包
- [x] 下载 UI Pack 用于按钮和面板
- [x] 资源要求：16x16 或 32x32 像素尺寸，PNG 格式

### 0.2 创建资源目录
- [x] 创建 `public/assets/tiles/` 目录
- [x] 创建 `public/assets/crops/` 目录
- [x] 创建 `public/assets/ui/` 目录
- [x] 创建 `public/assets/background/` 目录

### 0.3 组织资源文件
- [x] 放置地块纹理（grass.svg, soil.svg, wet-soil.svg）
- [x] 放置作物精灵图（包含所有生长阶段）
- [ ] 放置 UI 元素（button.png, panel.png）
- [ ] 放置背景纹理（grass-tile.png, sky.png）

**验证方式**：
- [x] 所有资源文件存在且可访问
- [x] 图片可正常加载

---

## 任务1：创建游戏类型定义

### 1.1 创建 types.ts
- [x] 创建 `app/dashboard/farming/types.ts`
- [x] 定义 `Crop` 接口
- [x] 定义 `FarmPlot` 接口
- [x] 定义 `GameState` 接口
- [x] 定义 `Crops` 常量（5种作物配置）
- [x] 定义 `PIXEL_SIZE` 常量

**验证方式**：
- [x] 运行 `pnpm build` 无类型错误

---

## 任务2：创建加载界面组件

### 2.1 创建 LoadingScreen.tsx
- [x] 创建 `app/dashboard/farming/LoadingScreen.tsx`
- [x] 创建像素风格进度条
- [x] 添加加载状态文本
- [x] 实现进度更新逻辑
- [x] 添加像素加载动画

**样式要求**：
```css
.loading-bar {
  border: 4px solid #5c4033;
  background: #8b4513;
}

.loading-progress {
  background: #6abe30;
  height: 16px;
}
```

**验证方式**：
- [x] 加载界面正确显示
- [x] 进度条正常更新

---

## 任务3：创建太阳光能量组件

### 3.1 创建 SunEnergy.tsx
- [x] 创建 `app/dashboard/farming/SunEnergy.tsx`
- [x] 显示像素风格太阳图标
- [x] 显示当前阳光数值
- [x] 像素化字体显示
- [x] 添加像素太阳动画

**视觉设计**：
- 太阳图标使用像素精灵图
- 脉动动画效果（每2秒一次）
- 像素边框面板

**验证方式**：
- [x] 组件可正确渲染
- [x] 阳光值正确显示

---

## 任务4：创建作物组件

### 4.1 创建 Crop.tsx
- [x] 创建 `app/dashboard/farming/Crop.tsx`
- [x] 根据生长阶段显示不同像素图
- [x] Canvas 渲染作物精灵
- [x] 添加像素生长动画
- [x] 支持"已成熟"状态高亮

**生长阶段显示**：
- 阶段1（0-33%）：小幼苗像素图
- 阶段2（33-66%）：中等植株像素图
- 阶段3（66-99%）：大植株像素图
- 阶段4（100%）：成熟作物像素图

**验证方式**：
- [x] 作物根据进度正确显示不同阶段
- [x] Canvas 渲染清晰无模糊

---

## 任务5：创建农田地块组件

### 5.1 创建 FarmPlot.tsx
- [x] 创建 `app/dashboard/farming/FarmPlot.tsx`
- [x] 显示像素地块纹理
- [x] 空地状态显示像素 + 号
- [x] 种植后显示 Crop 组件
- [x] 支持点击事件（种植/加速/收获）
- [x] 添加像素边框效果

**地块状态样式**：
- empty: 干土壤纹理
- growing: 浇水后土壤 + 作物
- ready: 发光效果 + 收获提示

**验证方式**：
- [x] 地块状态正确切换
- [x] 点击事件正确响应
- [x] 像素纹理清晰

---

## 任务6：创建作物商店组件

### 6.1 创建 CropShop.tsx
- [x] 创建 `app/dashboard/farming/CropShop.tsx`
- [x] 网格布局显示作物列表
- [x] 每个作物显示：像素预览、名称、生长时间、收获奖励
- [x] 显示作物消耗的阳光
- [x] 支持选择/取消选择作物
- [x] 选中状态像素边框高亮

**验证方式**：
- [x] 作物列表正确显示
- [x] 选择逻辑正确工作
- [x] 像素风格统一

---

## 任务7：创建游戏主容器

### 7.1 创建 GameContainer.tsx
- [x] 创建 `app/dashboard/farming/GameContainer.tsx`
- [x] 实现资源预加载
- [x] 使用 useState 管理游戏状态
- [x] 实现种植逻辑
- [x] 实现生长游戏循环（requestAnimationFrame）
- [x] 实现加速逻辑
- [x] 实现收获逻辑
- [x] 渲染所有子组件
- [x] 设置 Canvas 像素化渲染
- [x] 实现天气系统
- [x] 实现季节系统

**资源加载器**：
```typescript
const loadAssets = async () => {
  const assets = [
    '/assets/tiles/grass.png',
    '/assets/tiles/soil.png',
    '/assets/crops/wheat.png',
    // ... more assets
  ];

  for (let i = 0; i < assets.length; i++) {
    await loadSprite(assets[i]);
    setLoadingProgress(((i + 1) / assets.length) * 100);
  }

  setIsLoading(false);
};
```

**游戏循环**：
```typescript
useGameLoop(() => {
  setPlots(plots =>
    plots.map(plot => {
      if (plot.status === 'growing') {
        const newProgress = plot.growthProgress + DELTA;
        if (newProgress >= 100) {
          return { ...plot, status: 'ready', growthProgress: 100 };
        }
        return { ...plot, growthProgress: newProgress };
      }
      return plot;
    })
  );
});
```

**验证方式**：
- [x] 游戏可正常运行
- [x] 作物可正常生长
- [x] 可种植、加速、收获
- [x] 加载进度条正常工作

---

## 任务8：修改 Dashboard 首页

### 8.1 修改 page.tsx
- [x] 修改 `app/dashboard/page.tsx`
- [x] 导入 GameContainer
- [x] 添加页面标题和描述
- [x] 设置全屏布局

**布局结构**：
```tsx
export default function Page() {
  return (
    <main className="min-h-screen pixel-bg">
      <h1 className="pixel-title">我的农场</h1>
      <GameContainer />
    </main>
  );
}
```

**验证方式**：
- [x] 访问 `/dashboard` 显示游戏界面

---

## 任务9：添加全局像素样式

### 9.1 修改 globals.css
- [x] 添加像素字体引用
- [x] 添加 `.pixelated` 类
- [x] 添加 `.pixel-panel` 类
- [x] 添加 `.pixel-button` 类

**样式定义**：
```css
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

.pixelated {
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}

.pixel-font {
  font-family: 'Press Start 2P', cursive;
}

.pixel-panel {
  border: 4px solid #5c4033;
  background: #8b6914;
  box-shadow:
    inset -4px -4px 0px #3d2914,
    inset 4px 4px 0px #c9a227;
}
```

**验证方式**：
- [x] 像素样式正确应用

---

## 任务10：构建验证

### 10.1 运行构建
- [x] 运行 `pnpm build`
- [x] 无编译错误
- [x] 无类型错误

**验证方式**：
- [x] 构建成功
- [x] 所有路由正常工作

---

## 验收检查清单

- [x] 页面加载显示加载进度条
- [x] 加载完成后显示像素风格的农田
- [x] 太阳光能量正确显示
- [x] 可从商店选择作物
- [x] 点击空地种植作物
- [x] 作物随时间自动生长
- [x] 点击作物可消耗阳光加速
- [x] 作物成熟后点击可收获
- [x] 收获后阳光增加
- [x] 页面全屏布局正确
- [x] 像素纹理清晰无模糊
- [x] `pnpm build` 成功
- [x] 天气系统正常工作（晴天/雨天/雪天）
- [x] 季节系统正常工作（春/夏/秋/冬）
- [x] 天气影响作物生长速度

---

## 作物配置数据

| ID | 名称 | 资源文件 | 生长时间 | 消耗阳光 | 收获奖励 |
|----|------|---------|----------|----------|----------|
| wheat | 小麦 | wheat.png | 30秒 | 2 | 5 |
| sunflower | 向日葵 | sunflower.png | 45秒 | 3 | 8 |
| corn | 玉米 | corn.png | 60秒 | 5 | 12 |
| carrot | 胡萝卜 | carrot.png | 90秒 | 8 | 18 |
| watermelon | 西瓜 | watermelon.png | 120秒 | 15 | 30 |

---

## 资源加载清单

| 资源类型 | 文件 | 用途 |
|---------|------|------|
| 背景 | grass-tile.png | 农田背景平铺 |
| 背景 | sky.png | 天空背景 |
| 地块 | soil.png | 干旱土壤 |
| 地块 | watered-soil.png | 浇水后土壤 |
| 作物 | wheat_*.png | 小麦4个生长阶段 |
| 作物 | carrot_*.png | 胡萝卜4个生长阶段 |
| UI | panel.png | 商店面板背景 |
| UI | button.png | 按钮背景 |

---

## 预估工时

| 任务 | 预估时间 |
|------|----------|
| 准备像素资源 | 30分钟 |
| 创建游戏类型定义 | 15分钟 |
| 创建加载界面组件 | 20分钟 |
| 创建太阳光能量组件 | 20分钟 |
| 创建作物组件 | 25分钟 |
| 创建农田地块组件 | 30分钟 |
| 创建作物商店组件 | 25分钟 |
| 创建游戏主容器 | 60分钟 |
| 修改 Dashboard 首页 | 10分钟 |
| 添加全局像素样式 | 15分钟 |
| 构建验证 | 10分钟 |
| **总计** | **约 4 小时** |

---

## 技术要点

### 像素渲染关键代码

```typescript
// Canvas 上下文设置
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

// 绘制像素精灵
const drawSprite = (
  ctx: CanvasRenderingContext2D,
  sprite: HTMLImageElement,
  x: number,
  y: number,
  scale: number = 4
) => {
  ctx.drawImage(
    sprite,
    x, y,
    sprite.width * scale,
    sprite.height * scale
  );
};
```

### 响应式 Canvas

```typescript
const resizeCanvas = () => {
  const container = containerRef.current;
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  ctx.imageSmoothingEnabled = false;
};
```
