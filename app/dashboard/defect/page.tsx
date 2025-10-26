'use client';

import SectionContainer from '@/app/ui/dashboard/section-container';
import { DefectIcon, UserIcon } from '@/app/ui/icons';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

// 缺陷状态类型
type DefectStatus = 'open' | 'in_progress' | 'resolved' | 'closed' | 'reopened';

// 缺陷严重程度类型
type DefectSeverity = 'low' | 'medium' | 'high' | 'critical';

// 缺陷类型
type DefectType = 'bug' | 'performance' | 'ui' | 'security' | 'compatibility';

// 缺陷接口
interface Defect {
  id: string;
  title: string;
  description: string;
  status: DefectStatus;
  severity: DefectSeverity;
  type: DefectType;
  assignee: string;
  reporter: string;
  createdDate: string;
  dueDate: string;
  environment: string;
  steps: string[];
}

// 生成示例缺陷数据
function generateSampleDefects(): Defect[] {
  return [
    {
      id: 'DEF-001',
      title: '登录页面无法正常提交',
      description: '用户点击登录按钮后，页面无响应，控制台显示网络错误',
      status: 'open',
      severity: 'high',
      type: 'bug',
      assignee: '张三',
      reporter: '李四',
      createdDate: '2024-01-10',
      dueDate: '2024-01-15',
      environment: '生产环境',
      steps: ['打开登录页面', '输入用户名和密码', '点击登录按钮', '观察页面响应']
    },
    {
      id: 'DEF-002',
      title: '页面加载速度过慢',
      description: '首页加载时间超过5秒，影响用户体验',
      status: 'in_progress',
      severity: 'medium',
      type: 'performance',
      assignee: '王五',
      reporter: '赵六',
      createdDate: '2024-01-08',
      dueDate: '2024-01-20',
      environment: '测试环境',
      steps: ['访问首页', '记录加载时间', '分析性能瓶颈']
    },
    {
      id: 'DEF-003',
      title: '移动端布局错乱',
      description: '在小屏幕设备上，导航菜单显示异常',
      status: 'resolved',
      severity: 'medium',
      type: 'ui',
      assignee: '钱七',
      reporter: '孙八',
      createdDate: '2024-01-05',
      dueDate: '2024-01-12',
      environment: '移动端',
      steps: ['使用手机访问网站', '查看导航菜单', '测试响应式布局']
    },
    {
      id: 'DEF-004',
      title: '数据泄露风险',
      description: 'API接口未进行适当的权限验证',
      status: 'open',
      severity: 'critical',
      type: 'security',
      assignee: '周九',
      reporter: '吴十',
      createdDate: '2024-01-12',
      dueDate: '2024-01-14',
      environment: '生产环境',
      steps: ['测试API接口', '检查权限验证', '评估安全风险']
    },
    {
      id: 'DEF-005',
      title: 'IE浏览器兼容性问题',
      description: '在IE11中，部分功能无法正常使用',
      status: 'closed',
      severity: 'low',
      type: 'compatibility',
      assignee: '郑十一',
      reporter: '王十二',
      createdDate: '2024-01-01',
      dueDate: '2024-01-10',
      environment: 'IE11',
      steps: ['使用IE11打开网站', '测试各项功能', '记录兼容性问题']
    }
  ];
}

// 缺陷卡片组件
function DefectCard({ defect }: { defect: Defect }) {
  const statusColors = {
    open: 'bg-red-100 text-red-800',
    in_progress: 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800',
    reopened: 'bg-yellow-100 text-yellow-800'
  };

  const severityColors = {
    low: 'bg-gray-100 text-gray-600',
    medium: 'bg-yellow-100 text-yellow-600',
    high: 'bg-orange-100 text-orange-600',
    critical: 'bg-red-100 text-red-600'
  };

  const typeColors = {
    bug: 'bg-red-50 text-red-700',
    performance: 'bg-blue-50 text-blue-700',
    ui: 'bg-purple-50 text-purple-700',
    security: 'bg-orange-50 text-orange-700',
    compatibility: 'bg-green-50 text-green-700'
  };

  const statusLabels = {
    open: '待处理',
    in_progress: '处理中',
    resolved: '已解决',
    closed: '已关闭',
    reopened: '重新打开'
  };

  const severityLabels = {
    low: '低',
    medium: '中',
    high: '高',
    critical: '严重'
  };

  const typeLabels = {
    bug: '功能缺陷',
    performance: '性能问题',
    ui: '界面问题',
    security: '安全问题',
    compatibility: '兼容性'
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-mono text-gray-500">{defect.id}</span>
            <span className={clsx(
              'px-2 py-1 rounded-full text-xs font-medium',
              typeColors[defect.type]
            )}>
              {typeLabels[defect.type]}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{defect.title}</h3>
        </div>
        <div className="flex gap-2">
          <span className={clsx(
            'px-2 py-1 rounded-full text-xs font-medium',
            severityColors[defect.severity]
          )}>
            {severityLabels[defect.severity]}
          </span>
          <span className={clsx(
            'px-2 py-1 rounded-full text-xs font-medium',
            statusColors[defect.status]
          )}>
            {statusLabels[defect.status]}
          </span>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4">{defect.description}</p>
      
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <UserIcon className="w-4 h-4" />
          <span>负责人: {defect.assignee}</span>
        </div>
        <div className="flex items-center gap-1">
          <UserIcon className="w-4 h-4" />
          <span>报告人: {defect.reporter}</span>
        </div>
        <div className="flex items-center gap-1">
          <CalendarIcon className="w-4 h-4" />
          <span>创建: {defect.createdDate}</span>
        </div>
        <div className="flex items-center gap-1">
          <ClockIcon className="w-4 h-4" />
          <span>截止: {defect.dueDate}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-2">
          <span className="font-medium">环境:</span> {defect.environment}
        </div>
        <div className="text-sm text-gray-600">
          <span className="font-medium">复现步骤:</span>
          <ol className="list-decimal list-inside mt-1 space-y-1">
            {defect.steps.map((step, index) => (
              <li key={index} className="text-xs text-gray-500">{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

// 主页面组件
export default function DefectPage() {
  const defects = generateSampleDefects();
  
  const filters = ['全部', '待处理', '处理中', '已解决', '已关闭'];

  return (
    <div className="space-y-6">
      <SectionContainer
        title="缺陷管理"
        badge={defects.length}
        filters={filters}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {defects.map((defect) => (
            <DefectCard key={defect.id} defect={defect} />
          ))}
        </div>
      </SectionContainer>
    </div>
  );
}
