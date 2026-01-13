'use client';

import SectionContainer from '@/app/ui/dashboard/section-container';
import { UserIcon } from '@/app/ui/icons';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import { useLanguage } from '@/app/lib/i18n';

type DefectStatus = 'open' | 'in_progress' | 'resolved' | 'closed' | 'reopened';

type DefectSeverity = 'low' | 'medium' | 'high' | 'critical';

type DefectType = 'bug' | 'performance' | 'ui' | 'security' | 'compatibility';

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

function generateSampleDefects(): Defect[] {
  return [
    {
      id: 'DEF-001',
      title: 'Login page submission issue',
      description: 'Page unresponsive after clicking login button, network error in console',
      status: 'open',
      severity: 'high',
      type: 'bug',
      assignee: 'Zhang San',
      reporter: 'Li Si',
      createdDate: '2024-01-10',
      dueDate: '2024-01-15',
      environment: 'Production',
      steps: ['Open login page', 'Enter username and password', 'Click login button', 'Observe response']
    },
    {
      id: 'DEF-002',
      title: 'Slow page loading',
      description: 'Homepage takes more than 5 seconds to load',
      status: 'in_progress',
      severity: 'medium',
      type: 'performance',
      assignee: 'Wang Wu',
      reporter: 'Zhao Liu',
      createdDate: '2024-01-08',
      dueDate: '2024-01-20',
      environment: 'Testing',
      steps: ['Visit homepage', 'Record load time', 'Analyze bottlenecks']
    },
    {
      id: 'DEF-003',
      title: 'Mobile layout issue',
      description: 'Navigation menu displays incorrectly on small screens',
      status: 'resolved',
      severity: 'medium',
      type: 'ui',
      assignee: 'Qian Qi',
      reporter: 'Sun Ba',
      createdDate: '2024-01-05',
      dueDate: '2024-01-12',
      environment: 'Mobile',
      steps: ['Use phone to visit', 'Check navigation', 'Test responsive layout']
    },
    {
      id: 'DEF-004',
      title: 'Data leakage risk',
      description: 'API interfaces lack proper authentication',
      status: 'open',
      severity: 'critical',
      type: 'security',
      assignee: 'Zhou Jiu',
      reporter: 'Wu Shi',
      createdDate: '2024-01-12',
      dueDate: '2024-01-14',
      environment: 'Production',
      steps: ['Test API', 'Check authentication', 'Assess risk']
    },
    {
      id: 'DEF-005',
      title: 'IE browser compatibility',
      description: 'Some features not working in IE11',
      status: 'closed',
      severity: 'low',
      type: 'compatibility',
      assignee: 'Zheng Shi Yi',
      reporter: 'Wang Shi Er',
      createdDate: '2024-01-01',
      dueDate: '2024-01-10',
      environment: 'IE11',
      steps: ['Open in IE11', 'Test features', 'Record issues']
    }
  ];
}

function DefectCard({ defect }: { defect: Defect }) {
  const { t } = useLanguage();
  
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
              {t(`defect.type.${defect.type}`)}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{defect.title}</h3>
        </div>
        <div className="flex gap-2">
          <span className={clsx(
            'px-2 py-1 rounded-full text-xs font-medium',
            severityColors[defect.severity]
          )}>
            {t(`defect.severity.${defect.severity}`)}
          </span>
          <span className={clsx(
            'px-2 py-1 rounded-full text-xs font-medium',
            statusColors[defect.status]
          )}>
            {t(`defect.filters.${defect.status}`)}
          </span>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4">{defect.description}</p>
      
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <UserIcon className="w-4 h-4" />
          <span>{t('defect.assignee')}: {defect.assignee}</span>
        </div>
        <div className="flex items-center gap-1">
          <UserIcon className="w-4 h-4" />
          <span>{t('defect.reporter')}: {defect.reporter}</span>
        </div>
        <div className="flex items-center gap-1">
          <CalendarIcon className="w-4 h-4" />
          <span>{t('defect.created')}: {defect.createdDate}</span>
        </div>
        <div className="flex items-center gap-1">
          <ClockIcon className="w-4 h-4" />
          <span>{t('defect.due')}: {defect.dueDate}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-2">
          <span className="font-medium">{t('defect.environment')}:</span> {defect.environment}
        </div>
        <div className="text-sm text-gray-600">
          <span className="font-medium">{t('defect.steps')}:</span>
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

export default function DefectPage() {
  const { t } = useLanguage();
  const defects = generateSampleDefects();
  
  const filters = [
    t('defect.filters.all'),
    t('defect.filters.open'),
    t('defect.filters.inProgress'),
    t('defect.filters.resolved'),
    t('defect.filters.closed')
  ];

  return (
    <div className="space-y-6">
      <SectionContainer
        title={t('defect.title')}
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
