'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import SectionContainer from '@/app/ui/dashboard/section-container';
import TaskCard from '@/app/ui/dashboard/task-card';

/**
 * Habits页面组件
 * 用于管理用户的习惯
 */
export default function HabitsPage() {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Habits</h1>
        <p className="mt-2 text-gray-600">
          管理你的日常习惯，建立积极的生活方式
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <SectionContainer
          title="My Habits"
          filters={['All', 'Weak', 'Strong']}
          activeFilter="All"
          onAddClick={() => console.log('Add habit')}
          addButtonText="Add a Habit"
        >
          <div className="space-y-3">
            <TaskCard
              title="Drink 8 glasses of water"
              description="Stay hydrated throughout the day"
              color="blue"
              score={15}
              onToggle={() => console.log('Toggle water habit')}
            />
            
            <TaskCard
              title="Exercise for 30 minutes"
              description="Daily physical activity"
              color="green"
              score={20}
              onToggle={() => console.log('Toggle exercise habit')}
            />
            
            <TaskCard
              title="Read for 20 minutes"
              description="Expand your knowledge"
              color="purple"
              score={10}
              onToggle={() => console.log('Toggle reading habit')}
            />
          </div>
          
          <div className="text-center text-gray-500 mt-6">
            <div className="mx-auto mb-2 h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
            <p className="text-sm">Build positive habits</p>
            <p className="text-xs text-gray-400">
              Habits are tasks you can do every day. Check them off to get experience and gold!
            </p>
          </div>
        </SectionContainer>
      </div>
    </div>
  );
}