interface RewardCardProps {
  icon: string;
  price: number;
  available?: boolean;
  onClick?: () => void;
}

/**
 * 奖励卡片组件
 * 用于显示奖励系统中的物品
 */
export default function RewardCard({ icon, price, available = true, onClick }: RewardCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={!available}
      className={`rounded-lg p-3 text-center transition-all duration-200 ${
        available
          ? 'bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:shadow-sm hover:border-gray-300'
          : 'bg-gray-100 border border-gray-200 opacity-50 cursor-not-allowed'
      }`}
    >
      <div className="text-2xl mb-2">{icon}</div>
      <div className="flex items-center justify-center space-x-1">
        <span className={`text-xs font-medium ${
          available ? 'text-yellow-600' : 'text-gray-400'
        }`}>
          {price} GP
        </span>
      </div>
    </button>
  );
}