'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  GameState,
  FarmPlot,
  Crop as CropType,
  INITIAL_PLOTS,
  INITIAL_SUN_ENERGY,
  CROPS,
  PIXEL_SCALE,
  GRID_SIZE,
  WeatherType,
  Season,
  INITIAL_WEATHER,
  INITIAL_SEASON,
} from './types';
import LoadingScreen from './LoadingScreen';
import SunEnergy from './SunEnergy';
import FarmPlotComponent from './FarmPlot';
import CropShop from './CropShop';
import Weather from './Weather';
import SeasonDisplay from './SeasonDisplay';
import NavMenu from '@/app/ui/dashboard/NavMenu';

const GROWTH_TICK_MS = 100;
const ACCELERATION_COST = 1;
const ACCELERATION_AMOUNT = 5;

const WEATHER_GROWTH_MODIFIERS: Record<WeatherType, number> = {
  sunny: 1.0,
  rainy: 1.5,
  snowy: 0.5,
};

const getSeasonBackground = (season: Season, weather: WeatherType) => {
  const weatherOverlays: Record<WeatherType, string> = {
    sunny: '',
    rainy: 'bg-blue-900/20',
    snowy: 'bg-blue-200/30',
  };

  const seasonGradients: Record<Season, string> = {
    spring: 'from-pink-200 via-green-200 to-green-300',
    summer: 'from-yellow-200 via-green-300 to-green-400',
    autumn: 'from-orange-200 via-orange-100 to-yellow-900/20',
    winter: 'from-blue-200 via-gray-100 to-white',
  };

  return `bg-gradient-to-b ${seasonGradients[season]} ${weatherOverlays[weather]}`;
};

export default function GameContainer() {
  const [gameState, setGameState] = useState<GameState>({
    sunEnergy: INITIAL_SUN_ENERGY,
    plots: INITIAL_PLOTS,
    selectedCrop: null,
    isLoading: true,
    loadingProgress: 0,
    weather: INITIAL_WEATHER,
    season: INITIAL_SEASON,
  });

  const lastUpdateRef = useRef<number>(Date.now());

  const loadAssets = useCallback(async () => {
    const totalAssets = 10;
    const steps = [
      '加载地块纹理...',
      '加载作物素材...',
      '加载背景...',
      '初始化游戏...',
    ];

    for (let i = 0; i < totalAssets; i++) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setGameState((prev) => ({
        ...prev,
        loadingProgress: ((i + 1) / totalAssets) * 100,
      }));
    }

    setGameState((prev) => ({ ...prev, isLoading: false }));
  }, []);

  useEffect(() => {
    loadAssets();
  }, [loadAssets]);

  useEffect(() => {
    if (gameState.isLoading) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const delta = (now - lastUpdateRef.current) / 1000;
      lastUpdateRef.current = now;

      const weatherModifier = WEATHER_GROWTH_MODIFIERS[gameState.weather];

      setGameState((prev) => ({
        ...prev,
        plots: prev.plots.map((plot) => {
          if (plot.status !== 'growing') return plot;

          const growthPerSecond = 100 / (plot.crop!.totalGrowthTime || 1);
          const newProgress = Math.min(
            plot.growthProgress + growthPerSecond * delta * 10 * weatherModifier,
            100
          );

          if (newProgress >= 100) {
            return { ...plot, status: 'ready', growthProgress: 100 };
          }

          return { ...plot, growthProgress: newProgress };
        }),
      }));
    }, GROWTH_TICK_MS);

    return () => clearInterval(interval);
  }, [gameState.isLoading, gameState.weather]);

  const handlePlotClick = (plotId: number) => {
    const plot = gameState.plots.find((p) => p.id === plotId);
    if (!plot) return;

    if (plot.status === 'empty' && gameState.selectedCrop) {
      if (gameState.sunEnergy >= gameState.selectedCrop.cost) {
        setGameState((prev) => ({
          ...prev,
          sunEnergy: prev.sunEnergy - prev.selectedCrop!.cost,
          plots: prev.plots.map((p) =>
            p.id === plotId
              ? {
                  ...p,
                  crop: prev.selectedCrop!,
                  status: 'growing' as const,
                  growthProgress: 0,
                  plantedAt: Date.now(),
                  isWatered: true,
                }
              : p
          ),
          selectedCrop: null,
        }));
      }
    } else if (plot.status === 'growing') {
      if (gameState.sunEnergy >= ACCELERATION_COST) {
        setGameState((prev) => ({
          ...prev,
          sunEnergy: prev.sunEnergy - ACCELERATION_COST,
          plots: prev.plots.map((p) =>
            p.id === plotId
              ? {
                  ...p,
                  growthProgress: Math.min(p.growthProgress + ACCELERATION_AMOUNT, 100),
                }
              : p
          ),
        }));
      }
    } else if (plot.status === 'ready' && plot.crop) {
      const reward = plot.crop.harvestReward;
      setGameState((prev) => ({
        ...prev,
        sunEnergy: prev.sunEnergy + reward,
        plots: prev.plots.map((p) =>
          p.id === plotId
            ? {
                ...p,
                crop: null,
                status: 'empty' as const,
                growthProgress: 0,
                plantedAt: 0,
                isWatered: false,
              }
            : p
        ),
      }));
    }
  };

  const handleSelectCrop = (crop: CropType | null) => {
    setGameState((prev) => ({ ...prev, selectedCrop: crop }));
  };

  const handleWeatherChange = (weather: WeatherType) => {
    setGameState((prev) => ({ ...prev, weather }));
  };

  const handleSeasonChange = (season: Season) => {
    setGameState((prev) => ({ ...prev, season }));
  };

  if (gameState.isLoading) {
    return <LoadingScreen progress={gameState.loadingProgress} />;
  }

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className={`absolute inset-0 ${getSeasonBackground(gameState.season, gameState.weather)}`} />

      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
        }}
      />

      <Weather weather={gameState.weather} />

      <SeasonDisplay
        season={gameState.season}
        onSeasonChange={handleSeasonChange}
      />

      <NavMenu />

      <div className="fixed top-4 right-20 z-50">
        <div className="bg-blue-100 border-4 border-blue-400 rounded-lg p-2 pixel-panel">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-blue-700 pixel-font">天气</span>
            <select
              value={gameState.weather}
              onChange={(e) => handleWeatherChange(e.target.value as WeatherType)}
              className="text-xs bg-white border-2 border-blue-300 rounded px-2 py-1"
            >
              <option value="sunny">☀️ 晴天</option>
              <option value="rainy">🌧️ 下雨</option>
              <option value="snowy">❄️ 下雪</option>
            </select>
          </div>
          <p className="text-xs text-blue-600 mt-1">
            生长速度: {WEATHER_GROWTH_MODIFIERS[gameState.weather] * 100}%
          </p>
        </div>
      </div>

      <div className="absolute top-20 left-1/2 -translate-x-1/2">
        <div className="flex flex-wrap justify-center gap-3 max-w-2xl">
          {gameState.plots.map((plot) => (
            <FarmPlotComponent
              key={plot.id}
              plot={plot}
              onPlotClick={handlePlotClick}
              selectedCrop={gameState.selectedCrop}
              season={gameState.season}
            />
          ))}
        </div>
      </div>

      <SunEnergy sunEnergy={gameState.sunEnergy} />

      <CropShop
        selectedCrop={gameState.selectedCrop}
        onSelectCrop={handleSelectCrop}
        sunEnergy={gameState.sunEnergy}
      />

      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-amber-100 border-4 border-amber-600 rounded-lg p-3 pixel-panel">
          <p className="text-xs text-amber-700 pixel-font mb-1">操作提示</p>
          <p className="text-xs text-amber-600">点击空地种植</p>
          <p className="text-xs text-amber-600">点击作物加速生长</p>
          <p className="text-xs text-amber-600">成熟后点击收获</p>
          <p className="text-xs text-amber-600 mt-2">雨天作物生长x1.5</p>
          <p className="text-xs text-amber-600">雪天作物生长x0.5</p>
        </div>
      </div>
    </div>
  );
}
