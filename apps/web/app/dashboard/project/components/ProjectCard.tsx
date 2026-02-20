'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EllipsisVerticalIcon, CalendarIcon, ArrowRightIcon } from '@/app/ui/icons';
import { Project, ProjectStatus, ProjectPriority } from '@/app/lib/definitions';
import { useLanguage } from '@/app/lib/i18n';
import clsx from 'clsx';

/** 即将截止阈值（天数） */
const DEADLINE_SOON_DAYS = 7;

export type DeadlineStatus = 'expired' | 'soon' | 'normal';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

/**
 * 获取日期的时间戳（当天零点）
 */
function getDateTimestamp(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

/**
 * 解析日期为时间戳（当天零点，使用本地时区）
 */
function parseDateToTimestamp(dateValue: string | Date | null): number | null {
  if (!dateValue) return null;
  
  let year: number, month: number, day: number;
  
  if (dateValue instanceof Date) {
    // 从 Date 对象提取本地日期
    year = dateValue.getFullYear();
    month = dateValue.getMonth();
    day = dateValue.getDate();
  } else if (typeof dateValue === 'string') {
    // 处理 YYYY-MM-DD 或 ISO 格式 (如: "2026-03-04" 或 "2026-03-04T00:00:00")
    if (/^\d{4}-\d{2}-\d{2}/.test(dateValue)) {
      const dateStr = dateValue.includes('T') ? dateValue.slice(0, 10) : dateValue;
      const parts = dateStr.split('-').map(Number);
      if (parts.length !== 3 || parts.some(p => isNaN(p) || p <= 0)) return null;
      year = parts[0];
      month = parts[1] - 1; // JavaScript month is 0-based
      day = parts[2];
    } else {
      // 尝试用 Date 构造函数解析其他格式 (如: "Wed Mar 04 2026 08:00:00 GMT+0800")
      const parsed = new Date(dateValue);
      if (isNaN(parsed.getTime())) return null;
      year = parsed.getFullYear();
      month = parsed.getMonth();
      day = parsed.getDate();
    }
  } else {
    return null;
  }
  
  // 使用本地时区创建日期（零点）
  const date = new Date(year, month, day);
  const timestamp = date.getTime();
  return isNaN(timestamp) ? null : timestamp;
}

/**
 * 根据 endDate 与当前日期计算截止时间状态
 */
function getDeadlineStatus(endDate: string | Date | null, today: Date = new Date()): DeadlineStatus {
  const endTimestamp = parseDateToTimestamp(endDate);
  if (endTimestamp === null) return 'normal';
  
  const todayTimestamp = getDateTimestamp(today);
  
  if (endTimestamp < todayTimestamp) return 'expired';
  
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysLeft = Math.ceil((endTimestamp - todayTimestamp) / msPerDay);
  
  if (daysLeft <= DEADLINE_SOON_DAYS) return 'soon';
  return 'normal';
}

/**
 * 剩余天数（仅当未过期时有效）
 */
function getDaysLeft(endDate: string | Date | null, today: Date = new Date()): number | null {
  const endTimestamp = parseDateToTimestamp(endDate);
  if (endTimestamp === null) return null;
  
  const todayTimestamp = getDateTimestamp(today);
  
  if (endTimestamp < todayTimestamp) return null;
  
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysLeft = Math.ceil((endTimestamp - todayTimestamp) / msPerDay);
  
  return daysLeft;
}

// 状态标签样式 - 使用圆点+文字形式
const getStatusStyle = (status: ProjectStatus) => {
  switch (status) {
    case 'normal':
      return {
        dot: 'bg-emerald-500',
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200'
      };
    case 'at_risk':
      return {
        dot: 'bg-amber-500',
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200'
      };
    case 'out_of_control':
      return {
        dot: 'bg-rose-500',
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200'
      };
    default:
      return {
        dot: 'bg-slate-400',
        bg: 'bg-slate-50',
        text: 'text-slate-600',
        border: 'border-slate-200'
      };
  }
};

// 优先级标签样式 - 使用图标+文字形式
const getPriorityIcon = (priority: ProjectPriority) => {
  switch (priority) {
    case 'high':
      return '🔥';
    case 'medium':
      return '⚡';
    case 'low':
      return '🌱';
    default:
      return '●';
  }
};

const getPriorityStyle = (priority: ProjectPriority) => {
  switch (priority) {
    case 'high':
      return {
        bg: 'bg-rose-50',
        text: 'text-rose-600',
        border: 'border-rose-200'
      };
    case 'medium':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-600',
        border: 'border-amber-200'
      };
    case 'low':
      return {
        bg: 'bg-slate-50',
        text: 'text-slate-500',
        border: 'border-slate-200'
      };
    default:
      return {
        bg: 'bg-slate-50',
        text: 'text-slate-500',
        border: 'border-slate-200'
      };
  }
};

const getTypeIcon = (type: string) => {
  return type === 'sprint-project' ? '⚡' : '🌱';
};

const getTypeBgGradient = (type: string) => {
  return type === 'sprint-project' 
    ? 'from-orange-50 via-orange-100/50 to-amber-50' 
    : 'from-emerald-50 via-emerald-100/50 to-teal-50';
};

const getTypeAccentColor = (type: string) => {
  return type === 'sprint-project' ? 'text-orange-500' : 'text-emerald-500';
};

const stripHtml = (html: string) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
};

const formatDate = (dateValue: string | Date | null): string => {
  if (!dateValue) return '-';
  try {
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    if (isNaN(date.getTime())) return typeof dateValue === 'string' ? dateValue : '-';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return typeof dateValue === 'string' ? dateValue : '-';
  }
};

export default function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [showMenu, setShowMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hasCover = !!project.coverImageUrl;
  const isSprintProject = project.type === 'sprint-project';

  // 只有 sprint-project 才显示截止时间
  const deadlineStatus = isSprintProject ? getDeadlineStatus(project.endDate) : 'normal';
  const daysLeft = isSprintProject ? getDaysLeft(project.endDate) : null;
  const isUrgentSoon = deadlineStatus === 'soon' && daysLeft !== null && daysLeft <= 2 && project.progress < 50;

  let deadlineLabel = isSprintProject ? formatDate(project.endDate) : '-';
  let deadlineClass = 'text-slate-500';
  let deadlineBgClass = 'bg-slate-50';
  let deadlineEmoji = '';

  if (isSprintProject) {
    if (deadlineStatus === 'expired') {
      deadlineClass = 'text-rose-600';
      deadlineBgClass = 'bg-rose-50';
      deadlineEmoji = '⏰ ';
    } else if (deadlineStatus === 'soon') {
      deadlineClass = isUrgentSoon ? 'text-amber-700' : 'text-amber-600';
      deadlineBgClass = isUrgentSoon ? 'bg-amber-100' : 'bg-amber-50';
    }
  }

  const handleCardClick = () => {
    router.push(`/dashboard/project/${project.id}`);
  };

  const handleEnterProject = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/dashboard/project/${project.id}`);
  };

  return (
    <div
      className={clsx(
        'group relative rounded-2xl overflow-hidden cursor-pointer',
        'transition-all duration-500 ease-out',
        'hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-1',
        'border border-white/60',
        'flex flex-col'
      )}
      style={hasCover ? { 
        backgroundImage: `url(${project.coverImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      } : undefined}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 背景图片遮罩层 - 当有背景图时增强文字可读性 */}
      {hasCover && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      )}
      
      {/* 玻璃态叠加层 - 无背景图时显示 */}
      {!hasCover && (
        <>
          <div className={clsx(
            'absolute inset-0 bg-gradient-to-br',
            getTypeBgGradient(project.type)
          )} />
          <div className="absolute inset-0 bg-white/30 backdrop-blur-sm" />
        </>
      )}
      
      {/* 顶部装饰条 */}
      <div className={clsx(
        'absolute top-0 left-0 right-0 h-1 z-10',
        isSprintProject
          ? 'bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400' 
          : 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400'
      )} />

      {/* 悬停光效 */}
      <div className={clsx(
        'absolute -inset-px rounded-2xl bg-gradient-to-br from-white/40 to-transparent',
        'opacity-0 transition-opacity duration-500',
        isHovered && 'opacity-100'
      )} />

      <div className="relative z-10 p-4 flex flex-col h-full">
        {/* 头部：图标和菜单 */}
        <div className="flex items-start justify-between mb-2 flex-shrink-0">
          <div className={clsx(
            'w-12 h-12 rounded-xl flex items-center justify-center text-2xl',
            'backdrop-blur-sm shadow-lg shadow-black/5',
            'border transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3',
            hasCover 
              ? 'bg-white/90 border-white/70' 
              : 'bg-white/80 border-white/50'
          )}>
            {project.avatar || getTypeIcon(project.type)}
          </div>

          {/* 更多菜单 */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className={clsx(
                'p-2 rounded-xl transition-all duration-200 backdrop-blur-sm',
                hasCover 
                  ? 'text-white/80 hover:text-white hover:bg-white/20'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-white/60',
                'hover:shadow-md',
                showMenu && (hasCover ? 'bg-white/20 text-white shadow-md' : 'bg-white/80 text-slate-600 shadow-md')
              )}
            >
              <EllipsisVerticalIcon className="w-5 h-5" />
            </button>
            
            {showMenu && (
              <div 
                className={clsx(
                  'absolute right-0 top-10 z-50 w-36',
                  'bg-white/95 backdrop-blur-xl rounded-xl',
                  'shadow-2xl shadow-black/10',
                  'border border-white/60',
                  'overflow-hidden',
                  'animate-in fade-in zoom-in-95 duration-200'
                )}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(project);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 transition-all duration-200"
                >
                  {t('project.edit')}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(project.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-rose-600 hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 transition-all duration-200"
                >
                  {t('project.delete')}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 项目名称和积分 - 固定两行高度 */}
        <div className="mb-2 h-[48px] flex-shrink-0">
          <div className="flex items-start justify-between gap-3">
            <h3 className={clsx(
              'text-lg font-bold leading-tight line-clamp-2 flex-1',
              hasCover ? 'text-white drop-shadow-md' : 'text-slate-800'
            )}>
              {project.name}
            </h3>
            <span className={clsx(
              'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold',
              'bg-gradient-to-r from-amber-400 to-orange-400',
              'text-white shadow-lg shadow-orange-500/30',
              'border border-white/40'
            )}>
              {project.points || 0} 分
            </span>
          </div>
        </div>

        {/* 描述 - 固定两行高度 */}
        <div className="h-[40px] mb-3 flex-shrink-0">
          {stripHtml(project.description) ? (
            <p className={clsx(
              'text-sm line-clamp-2 leading-relaxed',
              hasCover ? 'text-white/80 drop-shadow-sm' : 'text-slate-500'
            )}>
              {stripHtml(project.description)}
            </p>
          ) : (
            <p className={clsx(
              'text-sm line-clamp-2 leading-relaxed italic',
              hasCover ? 'text-white/50' : 'text-slate-400'
            )}>
              暂无描述
            </p>
          )}
        </div>

        {/* 标签区域 - 统一使用图标+文字格式 */}
        <div className="flex flex-wrap gap-2 mb-3 h-[26px] flex-shrink-0">
          {/* 状态标签 */}
          {(() => {
            const statusStyle = getStatusStyle(project.status);
            return (
              <span className={clsx(
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border h-fit',
                statusStyle.bg,
                statusStyle.text,
                statusStyle.border
              )}>
                <span className={clsx('w-1.5 h-1.5 rounded-full', statusStyle.dot)} />
                {t(`project.status.${project.status}`)}
              </span>
            );
          })()}
          {/* 优先级标签 */}
          {(() => {
            const priorityStyle = getPriorityStyle(project.priority);
            const priorityIcon = getPriorityIcon(project.priority);
            return (
              <span className={clsx(
                'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border h-fit',
                priorityStyle.bg,
                priorityStyle.text,
                priorityStyle.border
              )}>
                <span className="text-[10px]">{priorityIcon}</span>
                {t(`project.priority.${project.priority}`)}
              </span>
            );
          })()}
        </div>

        {/* 进度条 - 增强视觉效果 */}
        <div className="mb-3 flex-shrink-0">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className={clsx(
              'font-medium',
              hasCover ? 'text-white/80' : 'text-slate-500'
            )}>{t('project.progress')}</span>
            <span className={clsx(
              'font-bold',
              hasCover ? 'text-white' : getTypeAccentColor(project.type)
            )}>
              {project.progress === 0 ? '未开始' : `${project.progress}%`}
            </span>
          </div>
          <div className={clsx(
            'h-2.5 rounded-full overflow-hidden shadow-inner relative',
            hasCover ? 'bg-white/20' : 'bg-slate-100'
          )}>
            {/* 进度条背景动画效果 */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" 
                 style={{ 
                   backgroundSize: '200% 100%',
                   animation: 'shimmer 2s infinite'
                 }} 
            />
            <div
              className={clsx(
                'h-full rounded-full transition-all duration-700 ease-out relative',
                isSprintProject
                  ? 'bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400'
                  : 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400',
                project.progress === 0 && 'opacity-0'
              )}
              style={{ width: `${project.progress}%` }}
            >
              {/* 进度条光泽效果 */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent rounded-full" />
            </div>
          </div>
          {project.progress === 0 && (
            <p className={clsx(
              'text-xs mt-1.5 text-center',
              hasCover ? 'text-white/50' : 'text-slate-400'
            )}>
              点击卡片开始规划项目
            </p>
          )}
        </div>

        {/* 截止日期区域 - 保持高度一致 */}
        <div className="flex-shrink-0 h-[36px]">
          {isSprintProject ? (
            <div className={clsx(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg h-full',
              hasCover ? 'bg-white/10 backdrop-blur-sm' : deadlineBgClass
            )}>
              <CalendarIcon className={clsx('w-4 h-4 flex-shrink-0', hasCover ? 'text-white/80' : deadlineClass)} />
              <span className={clsx('text-sm font-medium', hasCover ? 'text-white/90' : deadlineClass)}>
                {deadlineEmoji}{deadlineLabel}
              </span>
              {daysLeft !== null && deadlineStatus !== 'expired' && (
                <span className={clsx('text-xs ml-auto flex-shrink-0', hasCover ? 'text-white/60' : 'text-slate-400')}>
                  剩 {daysLeft} 天
                </span>
              )}
            </div>
          ) : (
            /* slow-burn 项目显示持续进行中占位 */
            <div className={clsx(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg h-full',
              hasCover ? 'bg-white/10 backdrop-blur-sm' : 'bg-slate-50/50'
            )}>
              <span className={clsx('text-sm font-medium', hasCover ? 'text-white/60' : 'text-slate-400')}>
                🌱 持续进行中
              </span>
            </div>
          )}
        </div>

        {/* 进入项目按钮 - 统一使用蓝色主色调 */}
        <div className="mt-auto pt-3">
          <button
            onClick={handleEnterProject}
            className={clsx(
              'w-full flex items-center justify-center gap-2',
              'px-4 py-2.5 rounded-xl',
              'text-sm font-semibold',
              'transition-all duration-300 ease-out',
              'group/btn',
              // 统一使用蓝色主色调
              'bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white',
              'shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50',
              'hover:-translate-y-0.5 hover:scale-[1.02]',
              'active:scale-[0.98] active:translate-y-0'
            )}
          >
            <span>进入项目</span>
            <ArrowRightIcon className={clsx(
              'w-4 h-4 transition-transform duration-300',
              'group-hover/btn:translate-x-1'
            )} />
          </button>
        </div>
      </div>

      {/* 底部装饰 */}
      <div className={clsx(
        'absolute bottom-0 left-0 right-0 h-px',
        'bg-gradient-to-r from-transparent via-current to-transparent',
        isSprintProject ? 'text-orange-300/30' : 'text-emerald-300/30'
      )} />
    </div>
  );
}
