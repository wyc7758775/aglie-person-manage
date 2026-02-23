'use client';

import { useState, useMemo, useCallback } from 'react';
import clsx from 'clsx';
import { ChevronRightIcon, ChevronDownIcon } from '@/app/ui/icons';
import { StatusBadge, PriorityBadge, RequirementStatus, RequirementPriority } from './requirement-badges';
import DropdownOptions from '@/app/ui/dropdown-options';
import EmptyRequirementState from './empty-requirement-state';
import { useLanguage } from '@/app/lib/i18n';

export const STATUS_OPTIONS: { value: RequirementStatus; label: string }[] = [
  { value: 'todo', label: '待办' },
  { value: 'in_progress', label: '进行中' },
  { value: 'done', label: '已完成' },
  { value: 'accepted', label: '已验收' },
  { value: 'cancelled', label: '已取消' },
  { value: 'closed', label: '已关闭' },
];

export const PRIORITY_OPTIONS: { value: RequirementPriority; label: string }[] = [
  { value: 'p0', label: 'P0' },
  { value: 'p1', label: 'P1' },
  { value: 'p2', label: 'P2' },
  { value: 'p3', label: 'P3' },
  { value: 'p4', label: 'P4' },
];

// Toast 提示组件
function Toast({ message, visible, onClose }: { message: string; visible: boolean; onClose: () => void }) {
  if (!visible) return null;
  return (
    <div 
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg text-sm text-white animate-in fade-in slide-in-from-top-2"
      style={{ backgroundColor: '#22C55E' }}
    >
      {message}
    </div>
  );
}

// 复制到剪贴板
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    return false;
  }
}

// 需求数据类型
export interface Requirement {
  id: string;
  workItemId: string;
  name: string;
  status: RequirementStatus;
  priority: RequirementPriority;
  assignee?: {
    nickname: string;
    avatar?: string;
  };
  deadline?: string;
  points: number;
  parentId?: string | null;
  subRequirements?: string[];
  description?: string;
}

interface RequirementTableProps {
  requirements: Requirement[];
  onRequirementClick: (requirement: Requirement) => void;
  onAddClick: () => void;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, data: Partial<Requirement>) => void;
}

// 构建树形结构
function buildTree(requirements: Requirement[]): Requirement[] {
  const map = new Map<string, Requirement & { children?: Requirement[] }>();
  const roots: Requirement[] = [];

  requirements.forEach(req => {
    map.set(req.id, { ...req, children: [] });
  });

  requirements.forEach(req => {
    const node = map.get(req.id)!;
    if (req.parentId && map.has(req.parentId)) {
      const parent = map.get(req.parentId)!;
      if (!parent.children) parent.children = [];
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

// 面包屑导航组件
// 状态选择器
function StatusSelect({ 
  value, 
  onChange 
}: { 
  value: RequirementStatus; 
  onChange: (value: RequirementStatus) => void;
}) {
  return (
    <DropdownOptions
      options={STATUS_OPTIONS}
      value={value}
      onChange={onChange}
      minWidth={100}
      renderTrigger={(selectedOption) => <StatusBadge status={value} />}
      renderOption={(option) => <StatusBadge status={option.value} />}
    />
  );
}

function PrioritySelect({ 
  value, 
  onChange 
}: { 
  value: RequirementPriority; 
  onChange: (value: RequirementPriority) => void;
}) {
  return (
    <DropdownOptions
      options={PRIORITY_OPTIONS}
      value={value}
      onChange={onChange}
      minWidth={80}
      renderTrigger={(selectedOption) => <PriorityBadge priority={value} />}
      renderOption={(option) => <PriorityBadge priority={option.value} />}
    />
  );
}

// 日期选择器
function DateSelect({ 
  value, 
  onChange 
}: { 
  value?: string; 
  onChange: (value: string) => void;
}) {
  return (
    <input
      type="date"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="text-xs bg-transparent border-0 p-0 focus:ring-0 cursor-pointer"
      style={{ color: 'rgba(26, 29, 46, 0.7)' }}
    />
  );
}

// 表格行组件
interface TableRowProps {
  requirement: Requirement & { children?: Requirement[] };
  level: number;
  isExpanded: boolean;
  onToggle: () => void;
  onNameClick: () => void;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, data: Partial<Requirement>) => void;
  showToast: (message: string) => void;
  onRequirementClick?: (requirement: Requirement) => void;
}

function TableRow({ 
  requirement, 
  level, 
  isExpanded, 
  onToggle, 
  onNameClick,
  isSelected,
  onSelect,
  onDelete,
  onUpdate,
  showToast,
  onRequirementClick
}: TableRowProps) {
  const hasChildren = requirement.children && requirement.children.length > 0;
  const isChild = level > 0;

  const handleWorkItemIdClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await copyToClipboard(requirement.workItemId);
    if (success) {
      showToast(`已复制: ${requirement.workItemId}`);
    }
  };

  const handleStatusChange = (status: RequirementStatus) => {
    onUpdate?.(requirement.id, { status });
  };

  const handlePriorityChange = (priority: RequirementPriority) => {
    onUpdate?.(requirement.id, { priority });
  };

  const handleDeadlineChange = (deadline: string) => {
    onUpdate?.(requirement.id, { deadline });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('确定要删除这个需求吗？')) {
      onDelete?.(requirement.id);
    }
  };

  return (
    <>
      <tr 
        className={clsx(
          'group border-b transition-colors',
          isSelected ? 'bg-indigo-50/50' : isChild ? '' : 'bg-white',
          isChild 
            ? 'border-[rgba(26,29,46,0.06)]' 
            : 'border-[rgba(26,29,46,0.06)] hover:bg-gray-50/50'
        )}
        style={isChild ? { backgroundColor: '#F5F0F0' } : {}}
      >
        {/* 选择框 */}
        <td className="py-3 px-2 w-9 text-center">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onSelect(e.target.checked);
            }}
            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
        </td>

        {/* 展开图标 + 需求名称 */}
        <td className="py-3 px-2">
          <div className="flex items-center gap-2">
            {/* 缩进 */}
            <div style={{ width: `${level * 24}px` }} className="flex-shrink-0" />
            
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle();
                }}
                className="w-5 h-5 flex items-center justify-center rounded hover:bg-slate-200 transition-colors flex-shrink-0"
              >
                {isExpanded ? (
                  <ChevronDownIcon className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronRightIcon className="w-4 h-4 text-slate-500" />
                )}
              </button>
            )}
            <span 
              onClick={onNameClick}
              className="font-medium text-sm truncate group-hover:text-indigo-600 transition-colors cursor-pointer"
              style={{ color: isChild ? 'rgba(26, 29, 46, 0.8)' : '#1A1D2E' }}
            >
              {requirement.name}
            </span>
          </div>
        </td>

        {/* 工作项 ID - 点击复制 */}
        <td className="py-3 px-2 w-[100px]">
          <span 
            onClick={handleWorkItemIdClick}
            className="text-xs font-mono px-2 py-0.5 rounded cursor-pointer hover:opacity-80 transition-opacity"
            style={{ backgroundColor: 'rgba(26, 29, 46, 0.06)', color: 'rgba(26, 29, 46, 0.6)' }}
            title="点击复制"
          >
            {requirement.workItemId}
          </span>
        </td>

        {/* 状态 */}
        <td className="py-3 px-2 w-[90px]">
          <StatusSelect 
            value={requirement.status} 
            onChange={handleStatusChange}
          />
        </td>

        {/* 负责人 */}
        <td className="py-3 px-2 w-[100px]">
          {requirement.assignee ? (
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0"
                style={{ 
                  background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
                }}
              >
                {requirement.assignee.nickname.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs truncate max-w-[60px]" style={{ color: '#1A1D2E' }}>
                {requirement.assignee.nickname}
              </span>
            </div>
          ) : (
            <span className="text-xs" style={{ color: 'rgba(26, 29, 46, 0.4)' }}>-</span>
          )}
        </td>

        {/* 优先级 - 可编辑 */}
        <td className="py-3 px-2 w-[80px]">
          <PrioritySelect 
            value={requirement.priority} 
            onChange={handlePriorityChange}
          />
        </td>

        {/* 截止时间 - 可编辑 */}
        <td className="py-3 px-2 w-[100px]">
          <DateSelect 
            value={requirement.deadline}
            onChange={handleDeadlineChange}
          />
        </td>

        {/* 可获得积分 */}
        <td className="py-3 px-2 w-[70px]">
          <span 
            className="text-xs font-medium"
            style={{ color: '#E8944A' }}
          >
            {requirement.points}
          </span>
        </td>
        
        {/* 操作 - 仅删除 */}
        <td className="py-3 px-2 w-[60px] text-center">
          <button
            className="p-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            style={{ color: 'rgba(26, 29, 46, 0.3)' }}
            onClick={handleDelete}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#EF4444';
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(26, 29, 46, 0.3)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title="删除"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </td>
      </tr>

      {/* 递归渲染子需求 */}
      {hasChildren && isExpanded && requirement.children?.map((child) => (
        <TableRow
          key={child.id}
          requirement={child}
          level={level + 1}
          isExpanded={false}
          onToggle={() => {}}
          onNameClick={() => onRequirementClick?.(child)}
          isSelected={isSelected}
          onSelect={onSelect}
          onDelete={onDelete}
          onUpdate={onUpdate}
          showToast={showToast}
          onRequirementClick={onRequirementClick}
        />
      ))}
    </>
  );
}



export default function RequirementTable({ 
  requirements, 
  onRequirementClick, 
  onAddClick,
  selectedIds = [],
  onSelectionChange,
  onDelete,
  onUpdate,
}: RequirementTableProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState({ message: '', visible: false });
  const { t } = useLanguage();

  const treeData = useMemo(() => buildTree(requirements), [requirements]);

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => {
      setToast({ message: '', visible: false });
    }, 2000);
  }, []);

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const handleSelect = (id: string, checked: boolean) => {
    if (!onSelectionChange) return;
    
    if (checked) {
      onSelectionChange([...selectedIds, id]);
    } else {
      onSelectionChange(selectedIds.filter(sid => sid !== id));
    }
  };

  return (
    <>
      <Toast message={toast.message} visible={toast.visible} onClose={() => setToast({ ...toast, visible: false })} />
      
      {/* 筛选器和新建按钮栏 */}
        <div 
          className="flex items-center justify-between px-6 py-3 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(26, 29, 46, 0.06)' }}
        >
          {/* 左侧：筛选器 */}
          <div className="flex items-center gap-3">
            {/* 状态筛选 */}
            <div 
              className="flex items-center gap-1 p-1 rounded-xl"
              style={{ backgroundColor: 'rgba(26, 29, 46, 0.04)' }}
            >
              {['全部', '待办', '进行中', '已完成'].map((filter, index) => (
                <button
                  key={filter}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
                  style={{
                    backgroundColor: index === 0 ? 'white' : 'transparent',
                    color: index === 0 ? '#E8944A' : 'rgba(26, 29, 46, 0.6)',
                    boxShadow: index === 0 ? '0 1px 3px rgba(26, 29, 46, 0.1)' : 'none',
                  }}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* 优先级筛选 */}
            <div 
              className="flex items-center gap-1 p-1 rounded-xl"
              style={{ backgroundColor: 'rgba(26, 29, 46, 0.04)' }}
            >
              {['全部优先级', 'P0', 'P1', 'P2'].map((filter, index) => (
                <button
                  key={filter}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
                  style={{
                    backgroundColor: index === 0 ? 'white' : 'transparent',
                    color: index === 0 ? '#E8944A' : 'rgba(26, 29, 46, 0.6)',
                    boxShadow: index === 0 ? '0 1px 3px rgba(26, 29, 46, 0.1)' : 'none',
                  }}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* 右侧：新建按钮 */}
          <button
            onClick={onAddClick}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white transition-all"
            style={{ 
              backgroundColor: '#E8944A',
              boxShadow: '0 2px 8px rgba(232, 148, 74, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#D4843A';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#E8944A';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            新建需求
          </button>
        </div>

        {/* 空状态或表格 */}
        {requirements.length === 0 ? (
          <div className="flex-1 flex items-start justify-start">
            <EmptyRequirementState onAddClick={onAddClick} className="items-start pl-6 pt-8" />
          </div>
        ) : (
          <>
            {/* 表格 - 可滚动区域 */}
            <div className="flex-1 overflow-auto">
              <table className="w-full">
                <thead className="sticky top-0 z-10">
                  <tr style={{ backgroundColor: '#1A1D2E', height: '48px' }}>
                    <th className="py-3 px-2 w-9 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === requirements.length && requirements.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            onSelectionChange?.(requirements.map(r => r.id));
                          } else {
                            onSelectionChange?.([]);
                          }
                        }}
                        className="w-4 h-4 rounded border-slate-400 text-indigo-600 focus:ring-indigo-500"
                      />
                    </th>
                    <th className="py-3 px-2 text-left text-xs font-medium" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                      需求名称
                    </th>
                    <th className="py-3 px-2 text-left text-xs font-medium w-[100px]" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                      工作项 ID
                    </th>
                    <th className="py-3 px-2 text-left text-xs font-medium w-[90px]" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                      状态
                    </th>
                    <th className="py-3 px-2 text-left text-xs font-medium w-[100px]" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                      负责人
                    </th>
                    <th className="py-3 px-2 text-left text-xs font-medium w-[80px]" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                      优先级
                    </th>
                    <th className="py-3 px-2 text-left text-xs font-medium w-[100px]" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                      截止时间
                    </th>
                    <th className="py-3 px-2 text-left text-xs font-medium w-[70px]" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                      积分
                    </th>
                    <th className="py-3 px-2 text-center text-xs font-medium w-[60px]" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody>
                {treeData.map((requirement) => (
                  <TableRow
                    key={requirement.id}
                    requirement={requirement}
                    level={0}
                    isExpanded={expandedIds.has(requirement.id)}
                    onToggle={() => toggleExpand(requirement.id)}
                    onNameClick={() => onRequirementClick(requirement)}
                    isSelected={selectedIds.includes(requirement.id)}
                    onSelect={(checked) => handleSelect(requirement.id, checked)}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                    showToast={showToast}
                    onRequirementClick={onRequirementClick}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* 分页 */}
          <div 
            className="flex items-center justify-between px-6 py-3 flex-shrink-0"
            style={{ borderTop: '1px solid rgba(26, 29, 46, 0.06)' }}
          >
            <span className="text-xs" style={{ color: 'rgba(26, 29, 46, 0.5)' }}>
              共 {requirements.length} 条需求
            </span>
            <div className="flex items-center gap-2">
              <button 
                className="px-3 py-1.5 rounded-lg text-xs transition-colors"
                style={{ 
                  color: 'rgba(26, 29, 46, 0.4)',
                  backgroundColor: 'rgba(26, 29, 46, 0.04)',
                }}
                disabled
              >
                上一页
              </button>
              <button 
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                style={{ 
                  color: 'white',
                  backgroundColor: '#E8944A',
                }}
              >
                1
              </button>
              <button 
                className="px-3 py-1.5 rounded-lg text-xs transition-colors hover:bg-gray-100"
                style={{ color: 'rgba(26, 29, 46, 0.6)' }}
              >
                2
              </button>
              <button 
                className="px-3 py-1.5 rounded-lg text-xs transition-colors hover:bg-gray-100"
                style={{ color: 'rgba(26, 29, 46, 0.6)' }}
              >
                3
              </button>
              <button 
                className="px-3 py-1.5 rounded-lg text-xs transition-colors"
                style={{ 
                  color: 'rgba(26, 29, 46, 0.6)',
                  backgroundColor: 'rgba(26, 29, 46, 0.04)',
                }}
              >
                下一页
              </button>
            </div>
          </div>
          </>
        )}
    </>
  );
}

// 导出测试数据生成函数
export function generateMockRequirements(count: number = 30): Requirement[] {
  const statuses: RequirementStatus[] = ['todo', 'in_progress', 'done', 'cancelled', 'accepted'];
  const priorities: RequirementPriority[] = ['p0', 'p1', 'p2', 'p3', 'p4'];
  const names = [
    '用户登录功能开发',
    '注册页面设计',
    '密码重置流程',
    '第三方OAuth集成',
    '用户资料管理',
    '头像上传功能',
    '消息通知系统',
    '邮件服务配置',
    '短信验证码',
    '权限管理系统',
    '角色分配功能',
    '数据导出功能',
    '报表生成模块',
    '搜索功能优化',
    '缓存策略实现',
    '数据库迁移脚本',
    'API接口文档',
    '单元测试覆盖',
    '性能优化方案',
    '安全审计日志',
    '支付网关集成',
    '订单管理系统',
    '库存同步功能',
    '物流跟踪模块',
    '评价系统开发',
    '推荐算法实现',
    '数据分析看板',
    '多语言支持',
    '移动端适配',
    '暗黑模式支持',
  ];

  // 生成与真实数据库格式一致的 ID: REQ-${timestamp}-${random}
  const generateId = (index: number) => {
    const timestamp = String(Date.now() + index).slice(-8);
    const random = Math.random().toString(36).slice(2, 6);
    return `REQ-${timestamp}-${random}`;
  };

  const requirements = Array.from({ length: count }, (_, i) => {
    const id = generateId(i);
    return {
      id,
      workItemId: `REQ${String(i + 1).padStart(3, '0')}`,
      name: names[i % names.length] + (i >= names.length ? ` ${Math.floor(i / names.length) + 1}` : ''),
      status: statuses[i % statuses.length],
      priority: priorities[i % priorities.length],
      assignee: {
        nickname: ['张三', '李四', '王五', '赵六', '钱七'][i % 5],
      },
      deadline: new Date(Date.now() + (i * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      points: [100, 200, 300, 500, 800][i % 5],
      parentId: null as string | null,
      description: `这是需求 ${i + 1} 的描述`,
    };
  });

  // 为部分需求设置父子关系（使用真实的ID引用）
  for (let i = 5; i < count; i += 5) {
    if (requirements[i - 5]) {
      requirements[i].parentId = requirements[i - 5].id;
    }
  }

  return requirements;
}
