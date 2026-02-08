'use client';

import { useState } from 'react';
import { CROPS, Crop as CropType } from './types';

interface CropShopProps {
  selectedCrop: CropType | null;
  onSelectCrop: (crop: CropType | null) => void;
  sunEnergy: number;
}

export default function CropShop({ selectedCrop, onSelectCrop, sunEnergy }: CropShopProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div
        className={`
          transition-all duration-300
          ${isExpanded ? 'w-80' : 'w-20'}
        `}
      >
        {isExpanded ? (
          <div className="bg-amber-100 border-4 border-amber-600 rounded-lg p-4 pixel-panel">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-amber-800 pixel-font">作物商店</h2>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-amber-600 hover:text-amber-800 text-xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
              {CROPS.map((crop) => {
                const canAfford = sunEnergy >= crop.cost;
                const isSelected = selectedCrop?.id === crop.id;

                return (
                  <button
                    key={crop.id}
                    onClick={() => onSelectCrop(isSelected ? null : crop)}
                    disabled={!canAfford}
                    className={`
                      flex items-center gap-3 p-2 rounded
                      border-4 transition-all
                      pixel-button
                      ${
                        isSelected
                          ? 'border-yellow-400 bg-yellow-100'
                          : canAfford
                          ? 'border-amber-600 bg-amber-50 hover:bg-amber-100'
                          : 'border-gray-300 bg-gray-200 opacity-50'
                      }
                    `}
                  >
                    <div className="w-10 h-10 bg-green-200 rounded flex items-center justify-center">
                      {crop.id === 'wheat' && <span>🌾</span>}
                      {crop.id === 'sunflower' && <span>🌻</span>}
                      {crop.id === 'corn' && <span>🌽</span>}
                      {crop.id === 'carrot' && <span>🥕</span>}
                      {crop.id === 'watermelon' && <span>🍉</span>}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-bold text-amber-800 pixel-font text-xs">
                        {crop.name}
                      </div>
                      <div className="text-xs text-amber-600">
                        生长: {crop.totalGrowthTime}秒
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-amber-700">消耗</div>
                      <div className="font-bold text-amber-800 pixel-font text-sm">
                        {crop.cost} ☀️
                      </div>
                      <div className="text-xs text-green-600">+{crop.harvestReward}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedCrop && (
              <div className="mt-4 p-2 bg-amber-200 rounded border-2 border-amber-400">
                <p className="text-sm text-amber-800 pixel-font">
                  选择中: {selectedCrop.name}
                </p>
                <p className="text-xs text-amber-600">
                  点击地块种植（消耗 {selectedCrop.cost} 阳光）
                </p>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setIsExpanded(true)}
            className="w-16 h-16 bg-amber-100 border-4 border-amber-600 rounded-lg flex items-center justify-center shadow-lg hover:scale-105 transition-transform pixel-button"
          >
            <span className="text-3xl">🏪</span>
          </button>
        )}
      </div>
    </div>
  );
}
