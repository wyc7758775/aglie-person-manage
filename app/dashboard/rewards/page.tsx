'use client';

import SectionContainer from '@/app/ui/dashboard/section-container';
import RewardCard from '@/app/ui/dashboard/reward-card';

/**
 * Rewards页面组件
 * 用于显示和管理用户的奖励系统
 */
export default function RewardsPage() {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Rewards</h1>
        <p className="mt-2 text-gray-600">
          用你赚取的金币购买奖励，激励自己完成任务
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <SectionContainer
          title="My Rewards"
          filters={['All', 'Custom', 'Wishlist']}
          activeFilter="All"
          onAddClick={() => console.log('Add reward')}
          addButtonText="Add a Reward"
        >
          {/* 奖励网格 */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <RewardCard key="reward-apple" icon="🍎" price={10} />
            <RewardCard key="reward-chocolate" icon="🍫" price={15} />
            <RewardCard key="reward-cookie" icon="🍪" price={20} />
            <RewardCard key="reward-wine" icon="🍷" price={25} />
            <RewardCard key="reward-game" icon="🎮" price={30} />
            <RewardCard key="reward-cake" icon="🍰" price={35} />
            <RewardCard key="reward-target" icon="🎯" price={40} />
            <RewardCard key="reward-coffee" icon="☕" price={45} />
            <RewardCard key="reward-circus" icon="🎪" price={50} />
            <RewardCard key="reward-movie" icon="🎬" price={60} />
            <RewardCard key="reward-music" icon="🎵" price={70} />
            <RewardCard key="reward-art" icon="🎨" price={80} />
          </div>
          
          {/* 特殊奖励 */}
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Special Rewards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <RewardCard key="reward-gift" icon="🎁" price={100} />
              <RewardCard key="reward-trophy" icon="🏆" price={150} />
              <RewardCard key="reward-diamond" icon="💎" price={200} />
            </div>
          </div>
          
          <div className="text-center text-gray-500 mt-6">
            <p className="text-sm">Reward yourself</p>
            <p className="text-xs text-gray-400">
              Buy rewards with the gold you earn from completing tasks!
            </p>
          </div>
        </SectionContainer>
      </div>
    </div>
  );
}