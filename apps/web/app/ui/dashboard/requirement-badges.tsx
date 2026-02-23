'use client';

import clsx from 'clsx';

export type RequirementStatus = 'todo' | 'in_progress' | 'done' | 'cancelled' | 'accepted' | 'closed';
export type RequirementPriority = 'p0' | 'p1' | 'p2' | 'p3' | 'p4';

interface StatusBadgeProps {
  status: RequirementStatus;
  size?: 'sm' | 'md';
  className?: string;
}

const statusConfig: Record<RequirementStatus, { label: string; dot: string; bg: string; text: string; border: string }> = {
  todo: {
    label: '待办',
    dot: 'bg-slate-400',
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    border: 'border-slate-200'
  },
  in_progress: {
    label: '进行中',
    dot: 'bg-blue-500',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200'
  },
  done: {
    label: '已完成',
    dot: 'bg-emerald-500',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200'
  },
  cancelled: {
    label: '已取消',
    dot: 'bg-rose-500',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200'
  },
  accepted: {
    label: '已验收',
    dot: 'bg-purple-500',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200'
  },
  closed: {
    label: '已关闭',
    dot: 'bg-slate-600',
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-300'
  }
};

export function StatusBadge({ status, size = 'sm', className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span className={clsx(
      'inline-flex items-center gap-1.5 rounded-full font-medium border',
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm',
      config.bg,
      config.text,
      config.border,
      className
    )}>
      <span className={clsx('rounded-full', size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2', config.dot)} />
      {config.label}
    </span>
  );
}

interface PriorityBadgeProps {
  priority: RequirementPriority;
  size?: 'sm' | 'md';
  className?: string;
}

const priorityConfig: Record<RequirementPriority, { label: string; icon: string; bg: string; text: string; border: string }> = {
  p0: {
    label: 'P0',
    icon: '🔴',
    bg: 'bg-rose-50',
    text: 'text-rose-600',
    border: 'border-rose-200'
  },
  p1: {
    label: 'P1',
    icon: '🟠',
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    border: 'border-orange-200'
  },
  p2: {
    label: 'P2',
    icon: '🟡',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'border-amber-200'
  },
  p3: {
    label: 'P3',
    icon: '🔵',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-200'
  },
  p4: {
    label: 'P4',
    icon: '⚪',
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    border: 'border-slate-200'
  }
};

export function PriorityBadge({ priority, size = 'sm', className }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  
  return (
    <span className={clsx(
      'inline-flex items-center gap-1 rounded-full font-medium border',
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm',
      config.bg,
      config.text,
      config.border,
      className
    )}>
      <span className="text-[10px]">{config.icon}</span>
      {config.label}
    </span>
  );
}

export function getStatusLabel(status: RequirementStatus): string {
  return statusConfig[status]?.label || status;
}

export function getPriorityLabel(priority: RequirementPriority): string {
  return priorityConfig[priority]?.label || priority;
}
