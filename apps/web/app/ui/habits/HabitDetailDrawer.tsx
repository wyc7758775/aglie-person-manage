'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task, TaskDifficulty, TaskDirection } from '@/app/lib/definitions';
import { PanelHeader } from './PanelHeader';
import { TitleRow } from './TitleRow';
import { StatsCard } from './StatsCard';
import { InfoGrid } from './InfoGrid';
import { DescSection } from './DescSection';
import { HeatmapSection } from './HeatmapSection';
import { TrendSection } from './TrendSection';
import { UnsavedChangesDialog } from './UnsavedChangesDialog';

interface HabitDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  projectId: string;
  onTaskUpdated?: () => void;
}

// 热力图数据类型
interface HeatmapDay {
  date: string;
  count: number;
}

interface HeatmapData {
  currentWeekCount: number;
  completionRate: number;
  longestStreak: number;
  days: HeatmapDay[];
}

// 趋势数据类型
interface TrendWeek {
  week: number;
  completed: number;
}

export default function HabitDetailDrawer({ 
  isOpen, 
  onClose, 
  task, 
  projectId,
  onTaskUpdated 
}: HabitDetailDrawerProps) {
  // 本地状态
  const [currentCount, setCurrentCount] = useState(0);
  const [targetCount, setTargetCount] = useState(12);
  const [direction, setDirection] = useState<TaskDirection>('positive');
  const [totalCount, setTotalCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<TaskDifficulty>('medium');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [goldReward, setGoldReward] = useState(3.5);
  const [heatmapData, setHeatmapData] = useState<HeatmapData | null>(null);
  const [trendData, setTrendData] = useState<TrendWeek[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  
  // 追踪修改状态
  const [hasChanges, setHasChanges] = useState(false);
  const [originalValues, setOriginalValues] = useState({
    description: '',
    difficulty: 'medium' as TaskDifficulty,
    frequency: 'daily' as 'daily' | 'weekly' | 'monthly',
    goldReward: 3.5,
  });

  // 加载任务数据
  useEffect(() => {
    if (task && isOpen) {
      setCurrentCount(task.currentCount || 0);
      setTargetCount(task.targetCount || 12);
      setDirection(task.direction || 'positive');
      setTotalCount(task.totalCount || 0);
      setStreak(task.streak || 0);
      setDescription(task.description || '');
      setDifficulty(task.difficulty);
      setFrequency(task.frequency as 'daily' | 'weekly' | 'monthly' || 'daily');
      setGoldReward(task.goldReward || 3.5);
      
      // 保存原始值用于比较
      setOriginalValues({
        description: task.description || '',
        difficulty: task.difficulty,
        frequency: task.frequency as 'daily' | 'weekly' | 'monthly' || 'daily',
        goldReward: task.goldReward || 3.5,
      });
      
      setHasChanges(false);
      
      // 加载热力图和趋势数据
      loadHabitData(task.id);
    }
  }, [task, isOpen]);

  // 检查是否有未保存的更改
  useEffect(() => {
    if (task) {
      const changed = 
        description !== originalValues.description ||
        difficulty !== originalValues.difficulty ||
        frequency !== originalValues.frequency ||
        goldReward !== originalValues.goldReward;
      setHasChanges(changed);
    }
  }, [description, difficulty, frequency, goldReward, originalValues, task]);

  // 加载习惯数据（热力图和趋势）
  const loadHabitData = async (taskId: string) => {
    setIsLoading(true);
    try {
      // 并行加载热力图和趋势数据
      const [heatmapRes, trendRes] = await Promise.all([
        fetch(`/api/tasks/${taskId}/heatmap`),
        fetch(`/api/tasks/${taskId}/trends`),
      ]);
      
      if (heatmapRes.ok) {
        const heatmapResult = await heatmapRes.json();
        if (heatmapResult.success && heatmapResult.data) {
          setHeatmapData(heatmapResult.data);
        }
      } else {
        console.error('热力图API错误:', await heatmapRes.text());
      }
      
      if (trendRes.ok) {
        const trendResult = await trendRes.json();
        if (trendResult.success && trendResult.data) {
          setTrendData(trendResult.data.weeks || []);
        }
      } else {
        console.error('趋势图API错误:', await trendRes.text());
      }
    } catch (error) {
      console.error('加载习惯数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 增加完成计数
  const handleIncrement = async () => {
    if (!task) return;
    
    try {
      const response = await fetch(`/api/tasks/${task.id}/increment`, {
        method: 'POST',
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setCurrentCount(result.data.currentCount);
          setTotalCount(result.data.totalCount);
          setStreak(result.data.streak);
          // 重新加载热力图和趋势数据
          await loadHabitData(task.id);
          onTaskUpdated?.();
        }
      } else {
        const error = await response.json();
        console.error('增加计数失败:', error.message);
      }
    } catch (error) {
      console.error('增加计数失败:', error);
    }
  };

  // 减少完成计数
  const handleDecrement = async () => {
    if (!task || currentCount <= 0) return;
    
    try {
      const response = await fetch(`/api/tasks/${task.id}/decrement`, {
        method: 'POST',
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setCurrentCount(result.data.currentCount);
          setTotalCount(result.data.totalCount);
          // 重新加载热力图和趋势数据
          await loadHabitData(task.id);
          onTaskUpdated?.();
        }
      } else {
        const error = await response.json();
        console.error('减少计数失败:', error.message);
      }
    } catch (error) {
      console.error('减少计数失败:', error);
    }
  };

  // 保存描述
  const handleDescriptionChange = async (newDescription: string) => {
    if (!task) return;
    
    setDescription(newDescription);
    
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: newDescription }),
      });
      
      if (response.ok) {
        setOriginalValues(prev => ({ ...prev, description: newDescription }));
        onTaskUpdated?.();
      }
    } catch (error) {
      console.error('保存描述失败:', error);
    }
  };

  // 保存习惯配置
  const handleConfigChange = async (field: 'difficulty' | 'frequency' | 'goldReward', value: any) => {
    if (!task) return;
    
    // 更新本地状态
    if (field === 'difficulty') setDifficulty(value);
    if (field === 'frequency') setFrequency(value);
    if (field === 'goldReward') setGoldReward(value);
    
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });
      
      if (response.ok) {
        setOriginalValues(prev => ({ ...prev, [field]: value }));
        onTaskUpdated?.();
      }
    } catch (error) {
      console.error('保存配置失败:', error);
    }
  };

  // 处理关闭
  const handleClose = useCallback(() => {
    if (hasChanges) {
      setShowUnsavedDialog(true);
    } else {
      onClose();
    }
  }, [hasChanges, onClose]);

  // 确认关闭（放弃更改）
  const handleConfirmClose = () => {
    setShowUnsavedDialog(false);
    onClose();
  };

  // 取消关闭
  const handleCancelClose = () => {
    setShowUnsavedDialog(false);
  };

  // ESC 键处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen || !task) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-50 flex justify-end"
        style={{ backgroundColor: 'rgba(26, 29, 46, 0.27)' }}
        onClick={handleClose}
      >
        <div 
          className="h-full bg-white flex flex-col overflow-hidden"
          style={{ 
            width: '561px',
            boxShadow: '-8px 0 40px rgba(26, 29, 46, 0.18)',
          }}
          onClick={(e) => e.stopPropagation()}
          data-testid="habit-detail-drawer"
        >
          {/* Header */}
          <PanelHeader 
            taskId={task.id}
            onClose={handleClose}
          />

          {/* Content */}
          <div 
            className="flex-1 overflow-y-auto"
            style={{ padding: '24px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Title & Completion Counter */}
              <TitleRow 
                title={task.title}
                currentCount={currentCount}
                targetCount={targetCount}
                direction={direction}
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
              />

              {/* Stats Card */}
              <StatsCard 
                streak={streak}
                totalGold={totalCount * goldReward}
                totalCount={totalCount}
              />

              {/* Info Grid */}
              <InfoGrid 
                difficulty={difficulty}
                frequency={frequency}
                goldReward={goldReward}
                onDifficultyChange={(value) => handleConfigChange('difficulty', value)}
                onFrequencyChange={(value) => handleConfigChange('frequency', value)}
                onGoldRewardChange={(value) => handleConfigChange('goldReward', value)}
              />

              {/* Divider */}
              <div style={{ height: '1px', backgroundColor: '#1A1D2E10' }} />

              {/* Description Section */}
              <DescSection 
                description={description}
                onChange={handleDescriptionChange}
              />

              {/* Heatmap Section */}
              <HeatmapSection 
                data={heatmapData}
                isLoading={isLoading}
              />

              {/* Trend Section */}
              <TrendSection 
                data={trendData}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Unsaved Changes Dialog */}
      <UnsavedChangesDialog 
        isOpen={showUnsavedDialog}
        onConfirm={handleConfirmClose}
        onCancel={handleCancelClose}
      />
    </>
  );
}
