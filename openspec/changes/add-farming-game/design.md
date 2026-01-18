# add-farming-game 设计文档

## 架构设计

### 页面结构

```
app/dashboard/
├── page.tsx              # 游戏主页面
├── layout.tsx            # Dashboard 布局（已有）
└── farming/              # 种田游戏组件
    ├── types.ts           # 游戏类型定义
    ├── GameContainer.tsx  # 游戏主容器
    ├── LoadingScreen.tsx  # 加载进度界面
    ├── SunEnergy.tsx      # 太阳光能量显示
    ├── FarmPlot.tsx       # 农田地块组件
    ├── Crop.tsx           # 作物组件
    └── CropShop.tsx       # 作物商店/选择

public/assets/
├── tiles/                # 像素地块纹理
│   ├── grass.png         # 草地
│   ├── soil.png          # 土壤
│   └── watered-soil.png  # 浇水后的土壤
├── crops/                # 像素作物图
│   ├── wheat.png         # 小麦
│   ├── wheat-harvest.png # 成熟小麦
│   ├── carrot.png        # 胡萝卜
│   └── etc.
├── ui/                   # UI 元素
│   ├── button.png        # 按钮
│   └── panel.png         # 面板
└── background/           # 背景纹理
    ├── grass-tile.png    # 草地平铺
    └── sky.png           # 天空背景
```

### 游戏状态管理

```typescript
// app/dashboard/farming/types.ts

// 作物类型
interface Crop {
  id: string;
  name: string;
  asset: string;           // 资源文件名
  growthStages: number;    // 生长阶段数
  totalGrowthTime: number; // 总生长时间（秒）
  harvestReward: number;   // 收获奖励的阳光
  cost: number;            // 种植消耗的阳光
}

// 地块状态
interface FarmPlot {
  id: number;
  crop: Crop | null;
  growthProgress: number; // 0-100
  status: 'empty' | 'growing' | 'ready' | 'harvested';
  plantedAt: number;      // 种植时间戳
  isWatered: boolean;     // 是否已浇水
}

// 游戏状态
interface GameState {
  sunEnergy: number;       // 当前阳光值
  plots: FarmPlot[];       // 地块列表
  selectedCrop: Crop | null;
  isLoading: boolean;      // 加载状态
  loadingProgress: number; // 加载进度 0-100
}
```

### 像素艺术渲染

#### Canvas 设置
```typescript
const canvas = canvasRef.current;
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false; // 禁用抗锯齿
canvas.style.imageRendering = 'pixelated'; // CSS 像素化
```

#### 像素资源加载
```typescript
const loadSprite = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
  });
};
```

### 组件设计

#### 1. LoadingScreen (加载界面)
- 显示加载进度条
- 显示当前加载的资源
- 像素风格加载动画

```tsx
// 视觉设计
<div className="pixel-font">
  <div className="loading-bar">
    <div className="loading-progress" style={{ width: `${progress}%` }} />
  </div>
  <p>Loading... {progress}%</p>
</div>
```

#### 2. SunEnergy (太阳光能量显示)
- 显示当前阳光值
- 像素风格太阳图标
- 像素化数字显示

```tsx
// 视觉设计
<div className="pixel-panel bg-yellow-100">
  <img src="/assets/ui/sun-icon.png" className="pixelated" />
  <span className="pixel-text">{sunEnergy}</span>
</div>
```

#### 3. FarmPlot (农田地块)
- 每个地块可种植一棵作物
- 显示作物当前生长状态
- 支持点击加速生长（消耗阳光）
- 支持点击收获
- 像素边界和纹理

```tsx
// 视觉设计
<div className="pixel-plot" onClick={handleClick}>
  {/* 地块背景 */}
  <img src="/assets/tiles/soil.png" className="pixelated" />
  {/* 作物显示 */}
  {crop && <CropRenderer crop={crop} progress={growthProgress} />}
  {/* 状态指示器 */}
  {status === 'ready' && <div className="ready-indicator" />}
</div>
```

#### 4. CropShop (作物商店)
- 显示可种植的作物列表
- 像素风格作物预览
- 显示作物属性
- 选择作物后点击地块种植

#### 5. GameContainer (游戏主容器)
- 协调所有子组件
- 管理游戏状态
- 处理游戏逻辑
- Canvas 渲染游戏世界

### 游戏逻辑

#### 生长机制
- 作物随时间自动生长
- 使用 `requestAnimationFrame` 更新游戏循环
- 生长进度 = (当前时间 - 种植时间) / 总生长时间

#### 阳光加速
- 点击正在生长的作物可消耗阳光加速
- 加速比例：消耗 1 阳光 = 加速 5% 生长进度

#### 收获机制
- 作物成熟后点击收获
- 收获后增加阳光值
- 地块恢复为空闲状态

### 像素样式配置

#### CSS 样式
```css
.pixelated {
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}

.pixel-font {
  font-family: 'Press Start 2P', monospace;
  font-size: 12px;
  text-transform: uppercase;
}

.pixel-panel {
  border: 4px solid #5c4033;
  background-color: #8b6914;
  box-shadow:
    inset -4px -4px 0px #3d2914,
    inset 4px 4px 0px #c9a227;
}
```

#### 像素调色板
```css
/* Stardew Valley 风格调色板 */
--color-soil-dark: #5c4033
--color-soil-light: #8b6914
--color-grass: #6abe30
--color-grass-dark: #4b9528
--color-sun: #fcd34d
--color-sun-border: #d97706
--color-wood: #a0522d
--color-wood-light: #cd853f
```

### 作物配置

| 作物 | 资源文件 | 生长时间 | 消耗阳光 | 收获奖励 |
|------|---------|----------|----------|----------|
| 小麦 | wheat.png | 30秒 | 2 | 5 |
| 向日葵 | sunflower.png | 45秒 | 3 | 8 |
| 玉米 | corn.png | 60秒 | 5 | 12 |
| 胡萝卜 | carrot.png | 90秒 | 8 | 18 |
| 西瓜 | watermelon.png | 120秒 | 15 | 30 |

### 全屏布局

```tsx
// app/dashboard/farming/GameContainer.tsx
<div className="fixed inset-0 overflow-hidden">
  {/* 平铺背景 */}
  <div className="absolute inset-0 bg-[url('/assets/background/grass-tile.png')] bg-repeat" />

  {/* 游戏内容 */}
  <div className="relative z-10">
    <SunEnergy />
    <GameCanvas />
    <CropShop />
  </div>
</div>
```

## 文件变更清单

### 新建文件

| 文件 | 说明 |
|------|------|
| `app/dashboard/farming/types.ts` | 游戏类型定义 |
| `app/dashboard/farming/GameContainer.tsx` | 游戏主容器 |
| `app/dashboard/farming/LoadingScreen.tsx` | 加载界面 |
| `app/dashboard/farming/SunEnergy.tsx` | 阳光能量显示 |
| `app/dashboard/farming/FarmPlot.tsx` | 农田地块 |
| `app/dashboard/farming/Crop.tsx` | 作物组件 |
| `app/dashboard/farming/CropShop.tsx` | 作物商店 |

### 修改文件

| 文件 | 改动 |
|------|------|
| `app/dashboard/page.tsx` | 导入并使用 GameContainer |
| `app/globals.css` | 添加像素样式 |

## 资源获取

### Kenney.nl 建议资源
- Pixel Platformer (Tiles)
- Pixel Farm (Crops)
- UI Pack (Buttons, Panels)

### OpenGameArt 建议资源
- Pixel Art Assets (various)
- Farming Pixel Art

## 风险与缓解

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| 资源加载慢 | 游戏启动延迟 | 使用加载进度条 + 资源预加载 |
| Canvas 性能 | 页面卡顿 | 使用 requestAnimationFrame 优化 |
| 响应式设计 | 移动端显示问题 | 响应式 Canvas 尺寸调整 |
| 像素模糊 | 视觉效果差 | 严格使用 image-rendering: pixelated |

## 扩展性考虑

### 未来功能（数据层完善后）
1. 任务完成自动获得阳光
2. 农田扩建（增加地块数量）
3. 作物升级系统
4. 成就和徽章
5. 每日签到奖励

### 扩展接口设计

```typescript
// 阳光获取接口（未来）
interface SunEnergyAPI {
  getDailyBonus(): Promise<number>;
  getTaskReward(taskId: string): Promise<number>;
}

// 农田存档接口（未来）
interface FarmSaveAPI {
  saveFarm(state: GameState): Promise<void>;
  loadFarm(): Promise<GameState>;
}
```
