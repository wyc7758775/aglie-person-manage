'use client';

import SectionContainer from '@/app/ui/dashboard/section-container';
import TaskCard from '@/app/ui/dashboard/task-card';

/**
 * Dailies页面组件
 * 用于显示和管理用户的每日任务
 */
export default function DailiesPage() {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dailies</h1>
        <p className="mt-2 text-gray-600">
          管理你的每日任务，保持规律的生活节奏
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <SectionContainer
          title="Daily Tasks"
          badge={3}
          filters={['All', 'Due', 'Completed']}
          activeFilter="All"
          onAddClick={() => console.log('Add daily')}
          addButtonText="Add a Daily"
        >
          <div className="space-y-3">
            <TaskCard
              title="Morning meditation"
              description="10 minutes of mindfulness"
              color="purple"
              score={12}
              onToggle={() => console.log('Toggle meditation')}
            />
            
            <TaskCard
              title="Check emails"
              description="Review and respond to important emails"
              color="blue"
              score={8}
              onToggle={() => console.log('Toggle emails')}
            />
            
            <TaskCard
              title="Plan tomorrow"
              description="Review schedule and prepare for next day"
              color="orange"
              score={10}
              onToggle={() => console.log('Toggle planning')}
            />
          </div>
          
          <div className="text-center text-gray-500 mt-6">
            <div className="mx-auto mb-2 h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center">
              <span className="text-2xl">📅</span>
            </div>
            <p className="text-sm">Stay on track with dailies</p>
            <p className="text-xs text-gray-400">
              Dailies are tasks that repeat on a schedule. Missing them will cause you to lose health!
            </p>
          </div>
        </SectionContainer>
      </div>
    </div>
  );
}