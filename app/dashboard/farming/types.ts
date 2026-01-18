export const PIXEL_SCALE = 4;
export const GRID_SIZE = 5;
export const INITIAL_SUN_ENERGY = 50;

export interface Crop {
  id: string;
  name: string;
  asset: string;
  growthStages: number;
  totalGrowthTime: number;
  harvestReward: number;
  cost: number;
}

export const CROPS: Crop[] = [
  {
    id: 'wheat',
    name: '小麦',
    asset: 'wheat',
    growthStages: 4,
    totalGrowthTime: 30,
    harvestReward: 5,
    cost: 2,
  },
  {
    id: 'sunflower',
    name: '向日葵',
    asset: 'sunflower',
    growthStages: 4,
    totalGrowthTime: 45,
    harvestReward: 8,
    cost: 3,
  },
  {
    id: 'corn',
    name: '玉米',
    asset: 'corn',
    growthStages: 4,
    totalGrowthTime: 60,
    harvestReward: 12,
    cost: 5,
  },
  {
    id: 'carrot',
    name: '胡萝卜',
    asset: 'carrot',
    growthStages: 4,
    totalGrowthTime: 90,
    harvestReward: 18,
    cost: 8,
  },
  {
    id: 'watermelon',
    name: '西瓜',
    asset: 'watermelon',
    growthStages: 4,
    totalGrowthTime: 120,
    harvestReward: 30,
    cost: 15,
  },
];

export interface FarmPlot {
  id: number;
  crop: Crop | null;
  growthProgress: number;
  status: 'empty' | 'growing' | 'ready' | 'harvested';
  plantedAt: number;
  isWatered: boolean;
}

export type WeatherType = 'sunny' | 'rainy' | 'snowy';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export interface GameState {
  sunEnergy: number;
  plots: FarmPlot[];
  selectedCrop: Crop | null;
  isLoading: boolean;
  loadingProgress: number;
  weather: WeatherType;
  season: Season;
}

export const INITIAL_PLOTS: FarmPlot[] = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => ({
  id: i,
  crop: null,
  growthProgress: 0,
  status: 'empty' as const,
  plantedAt: 0,
  isWatered: false,
}));

export const INITIAL_WEATHER: WeatherType = 'sunny';
export const INITIAL_SEASON: Season = 'spring';

export const SEASON_CROP_BONUS: Record<Season, string[]> = {
  spring: ['carrot', 'wheat'],
  summer: ['tomato', 'corn', 'watermelon'],
  autumn: ['pumpkin', 'corn'],
  winter: [],
};

export const ASSETS = {
  tiles: [
    '/assets/tiles/grass.png',
    '/assets/tiles/soil.png',
    '/assets/tiles/watered-soil.png',
  ],
  crops: CROPS.flatMap((crop) =>
    Array.from({ length: crop.growthStages }, (_, stage) =>
      `/assets/crops/${crop.asset}_stage_${stage + 1}.png`
    )
  ),
  ui: [
    '/assets/ui/button.png',
    '/assets/ui/panel.png',
  ],
  background: [
    '/assets/background/grass-tile.png',
    '/assets/background/sky.png',
  ],
};
