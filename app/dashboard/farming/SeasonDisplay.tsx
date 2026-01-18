'use client';

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

interface SeasonDisplayProps {
  season: Season;
  onSeasonChange: (season: Season) => void;
}

const seasonConfig = {
  spring: {
    name: '春季',
    color: 'text-green-600',
    bgColor: 'bg-green-100 border-green-400',
    icon: '🌸',
    description: '万物复苏',
  },
  summer: {
    name: '夏季',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100 border-yellow-400',
    icon: '☀️',
    description: '阳光充沛',
  },
  autumn: {
    name: '秋季',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100 border-orange-400',
    icon: '🍂',
    description: '收获季节',
  },
  winter: {
    name: '冬季',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 border-blue-400',
    icon: '❄️',
    description: '白雪皑皑',
  },
};

export default function SeasonDisplay({ season, onSeasonChange }: SeasonDisplayProps) {
  const config = seasonConfig[season];

  return (
    <div className="fixed top-4 left-4 z-50">
      <div className={`${config.bgColor} border-4 rounded-lg p-3 pixel-panel`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{config.icon}</span>
          <div>
            <p className={`text-sm font-bold ${config.color} pixel-font`}>{config.name}</p>
            <p className="text-xs text-gray-500">{config.description}</p>
          </div>
        </div>
        <div className="flex gap-1">
          {(Object.keys(seasonConfig) as Season[]).map((s) => (
            <button
              key={s}
              onClick={() => onSeasonChange(s)}
              className={`w-6 h-6 rounded text-xs transition-transform ${
                s === season
                  ? `${seasonConfig[s].bgColor} scale-110`
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
              title={seasonConfig[s].name}
            >
              {seasonConfig[s].icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
