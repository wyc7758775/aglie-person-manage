'use client';

import { useState, useEffect, useCallback } from 'react';
import SectionContainer from '@/app/ui/dashboard/section-container';
import TaskCard from '@/app/ui/dashboard/task-card';
import TodoCreateDrawer from '@/app/ui/dashboard/todo-create-drawer';
import { Todo, TodoStatus } from '@/app/lib/definitions';

const STATUS_FILTERS = ['Active', 'Scheduled', 'Complete'] as const;
type StatusFilter = typeof STATUS_FILTERS[number];

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<StatusFilter>('Active');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      const statusMap: Record<StatusFilter, TodoStatus | undefined> = {
        'Active': 'todo',
        'Scheduled': undefined,
        'Complete': 'done',
      };
      
      const params = new URLSearchParams();
      if (statusMap[activeFilter]) {
        params.set('status', statusMap[activeFilter]!);
      }
      
      const response = await fetch(`/api/todos?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setTodos(data.todos);
      }
    } catch (error) {
      console.error('获取待办事项失败:', error);
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleAddTodo = async (data: any) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      
      if (result.success) {
        setIsDrawerOpen(false);
        fetchTodos();
      } else {
        alert(result.message || '创建失败');
      }
    } catch (error) {
      console.error('创建待办事项失败:', error);
      alert('创建失败');
    }
  };

  const handleToggleTodo = async (todo: Todo) => {
    try {
      const newStatus: TodoStatus = todo.status === 'done' ? 'todo' : 'done';
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await response.json();
      
      if (result.success) {
        fetchTodos();
      }
    } catch (error) {
      console.error('更新待办事项失败:', error);
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (activeFilter === 'Active') {
      return todo.status !== 'done' && todo.status !== 'cancelled';
    }
    if (activeFilter === 'Complete') {
      return todo.status === 'done';
    }
    if (activeFilter === 'Scheduled') {
      return todo.dueDate !== null;
    }
    return true;
  });

  const getPriorityColor = (priority: string): 'purple' | 'orange' | 'blue' | 'green' | 'yellow' => {
    const colors: Record<string, 'purple' | 'orange' | 'blue' | 'green' | 'yellow'> = {
      urgent: 'orange',
      high: 'yellow',
      medium: 'blue',
      low: 'green',
    };
    return colors[priority] || 'purple';
  };

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
          badge={filteredTodos.length}
          filters={[...STATUS_FILTERS]}
          activeFilter={activeFilter}
          onFilterChange={(filter) => setActiveFilter(filter as StatusFilter)}
          onAddClick={() => setIsDrawerOpen(true)}
          addButtonText="Add a To Do"
        >
          {loading ? (
            <div className="py-8 text-center text-gray-500">加载中...</div>
          ) : filteredTodos.length > 0 ? (
            <div className="space-y-3">
              {filteredTodos.map(todo => (
                <TaskCard
                  key={todo.id}
                  title={todo.title}
                  description={todo.description}
                  color={getPriorityColor(todo.priority)}
                  completed={todo.status === 'done'}
                  onClick={() => handleToggleTodo(todo)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-6">
              <div className="mx-auto mb-2 h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <p className="text-sm">
                {activeFilter === 'Complete' ? '还没有已完成的待办事项' : '暂无待办事项'}
              </p>
              <p className="text-xs text-gray-400">
                点击 "Add a To Do" 创建新的待办事项
              </p>
            </div>
          )}
        </SectionContainer>
      </div>

      <TodoCreateDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSubmit={handleAddTodo}
      />
    </div>
  );
}
