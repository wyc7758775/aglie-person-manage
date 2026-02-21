'use client';

import SectionContainer from '@/app/ui/dashboard/section-container';
import TaskCard from '@/app/ui/dashboard/task-card';

/**
 * To Dos页面组件
 * 用于显示和管理用户的待办事项
 */
export default function TodosPage() {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">To Dos</h1>
        <p className="mt-2 text-gray-600">
          管理你的待办事项，完成一次性任务
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <SectionContainer
          title="My To Dos"
          badge={4}
          filters={['Active', 'Scheduled', 'Complete']}
          activeFilter="Active"
          onAddClick={() => console.log('Add todo')}
          addButtonText="Add a To Do"
        >
          <div className="space-y-3">
            <TaskCard
              title="Organize closet >> Organize clutter"
              description="Time to specify the cluttered area!"
              color="orange"
              onClick={() => console.log('Toggle organize closet')}
            />
            
            <TaskCard
              title="Join Habitica (Check me off!)"
              description="Time to either complete the To Do, edit it, or remove it."
              color="purple"
              onClick={() => console.log('Toggle join habitica')}
            />
            
            <TaskCard
              title="Prepare presentation"
              description="Create slides for next week's meeting"
              color="blue"
              onClick={() => console.log('Toggle presentation')}
            />
            
            <TaskCard
              title="Buy groceries"
              description="Weekly shopping for household items"
              color="green"
              onClick={() => console.log('Toggle groceries')}
            />
          </div>
          
          <div className="text-center text-gray-500 mt-6">
            <div className="mx-auto mb-2 h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
            <p className="text-sm">These are your To Dos</p>
            <p className="text-xs text-gray-400">
              To Dos need to be completed once. Add checklists to your To Dos to increase their value.
            </p>
          </div>
        </SectionContainer>
      </div>
    </div>
  );
}