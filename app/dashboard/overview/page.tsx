'use client';

import { 
  MagnifyingGlassIcon, 
  TagIcon,
  PlusIcon 
} from '@heroicons/react/24/outline';
import SectionContainer from '@/app/ui/dashboard/section-container';
import TaskCard from '@/app/ui/dashboard/task-card';
import RewardCard from '@/app/ui/dashboard/reward-card';
import { useEffect, useRef, useState } from 'react';

// 定义任务类型
type TaskColor = 'purple' | 'orange' | 'blue' | 'green' | 'yellow';
type TaskType = 'habits' | 'dailies' | 'todos';

interface Task {
  id: string;
  title: string;
  description: string;
  color: TaskColor;
  score: number;
  completed: boolean;
}

/**
 * 生成假习惯数据
 * @param count 生成数量
 * @returns 习惯数据数组
 */
const generateFakeHabits = (count = 10): Task[] => {
  const habits: Task[] = [];
  const titles = ['早起锻炼', '喝水2L', '阅读30分钟', '冥想', '写日记', '学习编程', '拉伸运动', '整理工作区', '感恩记录', '限制社交媒体'];
  const colors: TaskColor[] = ['purple', 'blue', 'green', 'yellow', 'orange'];
  
  for (let i = 0; i < count; i++) {
    habits.push({
      id: `habit-${i}`,
      title: titles[i % titles.length] + (i >= titles.length ? ` ${Math.floor(i/titles.length) + 1}` : ''),
      description: `保持这个好习惯 ${i + 1} 天`,
      color: colors[i % colors.length],
      score: i % 10, // 使用固定值替代随机数
      completed: i % 2 === 0 // 使用固定模式替代随机值
    });
  }
  return habits;
};

/**
 * 生成假日常任务数据
 * @param count 生成数量
 * @returns 日常任务数据数组
 */
const generateFakeDailies = (count = 10): Task[] => {
  const dailies: Task[] = [];
  const titles = ['洗碗', '遛狗', '整理邮件', '团队会议', '健身', '购物', '做饭', '打扫卫生', '浇花', '检查任务清单'];
  const colors: TaskColor[] = ['orange', 'yellow', 'green', 'blue', 'purple'];
  
  for (let i = 0; i < count; i++) {
    dailies.push({
      id: `daily-${i}`,
      title: titles[i % titles.length] + (i >= titles.length ? ` ${Math.floor(i/titles.length) + 1}` : ''),
      description: `每天完成这项任务`,
      color: colors[i % colors.length],
      score: i % 10,
      completed: i % 2 === 0
    });
  }
  return dailies;
};

/**
 * 生成假待办事项数据
 * @param count 生成数量
 * @returns 待办事项数据数组
 */
const generateFakeTodos = (count = 10): Task[] => {
  const todos: Task[] = [];
  const titles = ['完成报告', '回复邮件', '准备演讲', '修复bug', '更新文档', '联系客户', '安排会议', '学习新技能', '整理文件', '计划下周工作'];
  const colors: TaskColor[] = ['blue', 'green', 'purple', 'orange', 'yellow'];
  
  for (let i = 0; i < count; i++) {
    todos.push({
      id: `todo-${i}`,
      title: titles[i % titles.length] + (i >= titles.length ? ` ${Math.floor(i/titles.length) + 1}` : ''),
      description: `需要在本周完成`,
      color: colors[i % colors.length],
      score: i % 10,
      completed: i % 3 === 0
    });
  }
  return todos;
};

// 定义奖励类型
interface Reward {
  id: string;
  title: string;
  cost: number;
  icon: string;
}

/**
 * 生成假奖励数据
 * @param count 生成数量
 * @returns 奖励数据数组
 */
const generateFakeRewards = (count = 10): Reward[] => {
  const rewards: Reward[] = [];
  const titles = ['看一集剧', '吃甜点', '休息15分钟', '玩游戏', '购物', '外出就餐', '看电影', '社交活动', '按摩', '小睡'];
  const costs = [10, 15, 20, 25, 30, 40, 50, 75, 100, 150];
  const icons = ['🍦', '🎮', '🎬', '☕', '🛍️', '🍕', '📱', '🎵', '📚', '🏖️', '💤', '🎁'];
  
  for (let i = 0; i < count; i++) {
    rewards.push({
      id: `reward-${i}`,
      title: titles[i % titles.length] + (i >= titles.length ? ` ${Math.floor(i/titles.length) + 1}` : ''),
      cost: costs[i % costs.length],
      icon: icons[i % icons.length]
    });
  }
  return rewards;
};

/**
 * Overview页面组件
 * 显示习惯管理应用的主要概览界面，包含无限滚动功能
 */
export default function Page() {
  // 状态管理
  const [habits, setHabits] = useState<Task[]>(generateFakeHabits(15));
  const [dailies, setDailies] = useState<Task[]>(generateFakeDailies(15));
  const [todos, setTodos] = useState<Task[]>(generateFakeTodos(15));
  const [rewards, setRewards] = useState<Reward[]>(generateFakeRewards(15));
  
  // 无限滚动相关
  const habitsEndRef = useRef<HTMLDivElement>(null);
  const dailiesEndRef = useRef<HTMLDivElement>(null);
  const todosEndRef = useRef<HTMLDivElement>(null);
  const rewardsEndRef = useRef<HTMLDivElement>(null);
  
  // 设置交叉观察器
  useEffect(() => {
    const habitsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHabits(prev => [...prev, ...generateFakeHabits(5)]);
        }
      },
      { threshold: 1.0 }
    );
    
    const dailiesObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setDailies(prev => [...prev, ...generateFakeDailies(5)]);
        }
      },
      { threshold: 1.0 }
    );
    
    const todosObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTodos(prev => [...prev, ...generateFakeTodos(5)]);
        }
      },
      { threshold: 1.0 }
    );
    
    const rewardsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setRewards(prev => [...prev, ...generateFakeRewards(5)]);
        }
      },
      { threshold: 1.0 }
    );
    
    // 观察各个区域的末尾元素
    if (habitsEndRef.current) habitsObserver.observe(habitsEndRef.current);
    if (dailiesEndRef.current) dailiesObserver.observe(dailiesEndRef.current);
    if (todosEndRef.current) todosObserver.observe(todosEndRef.current);
    if (rewardsEndRef.current) rewardsObserver.observe(rewardsEndRef.current);
    
    // 清理函数
    return () => {
      habitsObserver.disconnect();
      dailiesObserver.disconnect();
      todosObserver.disconnect();
      rewardsObserver.disconnect();
    };
  }, []);
  
  // 处理任务切换
  const handleToggleTask = (id: string, type: TaskType): void => {
    switch (type) {
      case 'habits':
        setHabits(prev => prev.map(h => h.id === id ? {...h, completed: !h.completed} : h));
        break;
      case 'dailies':
        setDailies(prev => prev.map(d => d.id === id ? {...d, completed: !d.completed} : d));
        break;
      case 'todos':
        setTodos(prev => prev.map(t => t.id === id ? {...t, completed: !t.completed} : t));
        break;
    }
  };
  
  return (
    <div className="w-full bg-gradient-to-br from-purple-50 to-indigo-50">
      {/* 顶部搜索和标签栏 */}
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="rounded-md border border-gray-300 py-1 pl-8 pr-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
          <button className="flex items-center space-x-1 rounded-md border border-gray-300 px-2 py-1 text-sm hover:bg-gray-50">
            <TagIcon className="h-3 w-3" />
            <span>Tags</span>
            <svg className="ml-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        <button className="flex items-center space-x-1 rounded-md bg-purple-600 px-3 py-1 text-sm font-medium text-white hover:bg-purple-700">
          <PlusIcon className="h-3 w-3" />
          <span>Add Task</span>
        </button>
      </div>

      {/* 主要内容区域 - 水平布局的四个部分 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 px-2 h-[calc(100vh-60px)] pb-4">
        {/* Habits 区域 */}
        <SectionContainer
          title="Habits"
          filters={['All', 'Strong', 'Weak']}
          activeFilter="Strong"
          onAddClick={() => {}}
          onFilterChange={() => {}}
          addButtonText="Add a Habit"
        >
          <div className="space-y-1 max-h-[calc(100vh-180px)] overflow-y-auto scrollbar scrollbar-w-1.5 scrollbar-thumb-rounded-full scrollbar-thumb-gradient-to-b from-purple-400 to-indigo-600 hover:scrollbar-thumb-gradient-to-b hover:from-purple-500 hover:to-indigo-700 scrollbar-track-transparent">
            {habits.length > 0 ? (
              habits.map((habit) => (
                <TaskCard
                  key={habit.id}
                  title={habit.title}
                  description={habit.description}
                  color={habit.color}
                  points={habit.score}
                  completed={habit.completed}
                  onClick={() => handleToggleTask(habit.id, 'habits')}
                />
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">No habits yet</div>
            )}
            <div ref={habitsEndRef} className="h-4" />
          </div>
        </SectionContainer>

        {/* Dailies 区域 */}
        <SectionContainer
          title="Dailies"
          filters={['All', 'Due', 'Not Due']}
          activeFilter="Due"
          onAddClick={() => {}}
          onFilterChange={() => {}}
          addButtonText="Add a Daily"
        >
          <div className="space-y-1 max-h-[calc(100vh-180px)] overflow-y-auto scrollbar scrollbar-w-1.5 scrollbar-thumb-rounded-full scrollbar-thumb-gradient-to-b from-purple-400 to-indigo-600 hover:scrollbar-thumb-gradient-to-b hover:from-purple-500 hover:to-indigo-700 scrollbar-track-transparent">
            {dailies.length > 0 ? (
              dailies.map((daily) => (
                <TaskCard
                  key={daily.id}
                  title={daily.title}
                  description={daily.description}
                  color={daily.color}
                  points={daily.score}
                  completed={daily.completed}
                  onClick={() => handleToggleTask(daily.id, 'dailies')}
                />
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">No dailies yet</div>
            )}
            <div ref={dailiesEndRef} className="h-4" />
          </div>
        </SectionContainer>

        {/* To Dos 区域 */}
        <SectionContainer
          title="To Dos"
          filters={['Active', 'Scheduled', 'Complete']}
          activeFilter="Active"
          onAddClick={() => {}}
          onFilterChange={() => {}}
          addButtonText="Add a To Do"
        >
          <div className="space-y-1 max-h-[calc(100vh-180px)] overflow-y-auto scrollbar scrollbar-w-1.5 scrollbar-thumb-rounded-full scrollbar-thumb-gradient-to-b from-purple-400 to-indigo-600 hover:scrollbar-thumb-gradient-to-b hover:from-purple-500 hover:to-indigo-700 scrollbar-track-transparent">
            {todos.length > 0 ? (
              todos.map((todo) => (
                <TaskCard
                  key={todo.id}
                  title={todo.title}
                  description={todo.description}
                  color={todo.color}
                  points={todo.score}
                  completed={todo.completed}
                  onClick={() => handleToggleTask(todo.id, 'todos')}
                />
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">No todos yet</div>
            )}
            <div ref={todosEndRef} className="h-4" />
          </div>
        </SectionContainer>

        {/* Rewards 区域 */}
        <SectionContainer
          title="Rewards"
          filters={['All', 'Custom', 'Wishlist']}
          activeFilter="All"
          onAddClick={() => {}}
          onFilterChange={() => {}}
          addButtonText="Add a Reward"
        >
          <div className="max-h-[calc(100vh-180px)] overflow-y-auto scrollbar scrollbar-w-1.5 scrollbar-thumb-rounded-full scrollbar-thumb-gradient-to-b from-purple-400 to-indigo-600 hover:scrollbar-thumb-gradient-to-b hover:from-purple-500 hover:to-indigo-700 scrollbar-track-transparent">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
              {rewards.length > 0 ? (
                rewards.map((reward) => (
                  <RewardCard
                    key={reward.id}
                    price={reward.cost}
                    icon={reward.icon}
                  />
                ))
              ) : (
                <div className="text-center py-4 text-gray-500 col-span-full">No rewards yet</div>
              )}
            </div>
            <div ref={rewardsEndRef} className="h-4" />
          </div>
        </SectionContainer>
      </div>
    </div>
  );
}
