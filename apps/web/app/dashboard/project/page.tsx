'use client';

import { useRouter } from 'next/navigation';
import { EllipsisVerticalIcon, CalendarIcon } from '@/app/ui/icons';
import SectionContainer from '@/app/ui/dashboard/section-container';
import { useState, useEffect } from 'react';
import { Project, ProjectStatus, ProjectPriority } from '@/app/lib/definitions';
import { useLanguage } from '@/app/lib/i18n';
import ProjectDrawer from './components/ProjectDrawer';
import { ProjectListSkeleton } from './components/ProjectCardSkeleton';

/** 即将截止阈值（天数） */
const DEADLINE_SOON_DAYS = 7;

export type DeadlineStatus = 'expired' | 'soon' | 'normal';

/**
 * 根据 endDate 与当前日期计算截止时间状态。
 * endDate 支持 YYYY-MM-DD 或 ISO 字符串，取日期部分按本地日期比较。
 */
function getDeadlineStatus(endDate: string | null, today: Date = new Date()): DeadlineStatus {
  if (!endDate || !endDate.trim()) return 'normal';
  const dateStr = endDate.includes('T') ? endDate.slice(0, 10) : endDate;
  const end = new Date(dateStr + 'T00:00:00');
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (end < todayStart) return 'expired';
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysLeft = Math.ceil((end.getTime() - todayStart.getTime()) / msPerDay);
  if (daysLeft <= DEADLINE_SOON_DAYS) return 'soon';
  return 'normal';
}

/**
 * 剩余天数（仅当未过期时有效），用于颜色深浅。
 */
function getDaysLeft(endDate: string | null, today: Date = new Date()): number | null {
  if (!endDate || !endDate.trim()) return null;
  const dateStr = endDate.includes('T') ? endDate.slice(0, 10) : endDate;
  const end = new Date(dateStr + 'T00:00:00');
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (end < todayStart) return null;
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.ceil((end.getTime() - todayStart.getTime()) / msPerDay);
}

export default function ProjectPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>(undefined);

  const filterOptions = [
    { key: 'all', label: t('project.filters.all') },
    { key: 'normal', label: t('project.filters.normal') },
    { key: 'at_risk', label: t('project.filters.at_risk') },
    { key: 'out_of_control', label: t('project.filters.out_of_control') },
  ];
  const filters = filterOptions.map(f => f.label);

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case 'normal':
        return 'bg-green-100 text-green-800';
      case 'at_risk':
        return 'bg-yellow-100 text-yellow-800';
      case 'out_of_control':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const stripHtml = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  };

  const getPriorityColor = (priority: ProjectPriority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'sprint-project' ? '⚡' : '🌱';
  };

  const getTypeBgColor = (type: string) => {
    return type === 'sprint-project' ? 'bg-orange-100' : 'bg-green-100';
  };

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const statusParam = activeFilter === 'all' ? '' : activeFilter;
      const queryParams = statusParam ? `?status=${statusParam}` : '';
      const response = await fetch(`/api/projects${queryParams}`);
      const data = await response.json();
      if (response.status === 401) {
        router.push('/?next=/dashboard/project');
        return;
      }
      if (data.success && Array.isArray(data.projects)) {
        setProjects(data.projects);
      } else {
        setError(data.message || t('project.loadFailed'));
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(t('common.errors.networkError'));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDrawer = (project?: Project) => {
    setSelectedProject(project);
    setDrawerOpen(true);
  };

  const handleDelete = async (id: string) => {
    setSelectedProject(undefined);
    try {
      const response = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (response.status === 401) {
        router.push('/?next=/dashboard/project');
        return;
      }
      if (data.success) {
        fetchProjects();
      } else {
        alert(data.message || t('project.deleteFailed'));
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert(t('project.deleteFailedRetry'));
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [activeFilter]);

  function ProjectCard({ project }: { project: Project }) {
    const [showMenu, setShowMenu] = useState(false);
    const hasCover = !!project.coverImageUrl;
    const bgClass = hasCover ? '' : getTypeBgColor(project.type);

    // 格式化日期为 YYYY-MM-DD
    const formatDate = (dateStr: string | null): string => {
      if (!dateStr) return '-';
      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      } catch {
        return dateStr;
      }
    };

    return (
        <div
          className={`project-card group rounded-lg border border-gray-200 p-3 relative cursor-pointer hover:shadow-md transition-shadow overflow-hidden ${bgClass}`}
          onClick={() => router.push(`/dashboard/project/${project.id}`)}
        >
        {hasCover && (
          <>
            {/* 背景模糊层 */}
            <div 
              className="absolute inset-0 z-0 bg-cover bg-center blur-lg scale-110 opacity-50"
              style={{ backgroundImage: `url(${project.coverImageUrl})` }}
              aria-hidden
            />
            {/* 主图容器 */}
            <div 
              className="absolute inset-0 z-[1] bg-contain bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${project.coverImageUrl})` }}
              aria-hidden
            />
            {/* 遮罩层 */}
            <div className="absolute inset-0 bg-black/30 z-[2]" aria-hidden />
          </>
        )}
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <EllipsisVerticalIcon className="w-4 h-4" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-32">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenDrawer(project);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
              >
                {t('project.edit')}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(project.id);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-red-600"
              >
                {t('project.delete')}
              </button>
            </div>
          )}
        </div>

        <div className="mb-2 pr-8 relative z-[1] min-w-0 text-left">
          <div className="text-2xl mb-1">{project.avatar || getTypeIcon(project.type)}</div>
          <div className="min-w-0">
            <h3 className={`text-base font-semibold mb-1 text-left ${hasCover ? 'text-white drop-shadow' : 'text-gray-900'}`}>{project.name}</h3>
            <p className={`text-sm mb-2 line-clamp-2 break-words min-h-[2.5rem] ${hasCover ? 'text-white/90 drop-shadow' : 'text-gray-600'}`}>{stripHtml(project.description)}</p>
            <div className="flex items-center gap-1.5 mb-2 flex-wrap">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                {t(`project.status.${project.status}`)}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                {t(`project.priority.${project.priority}`)}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${hasCover ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'}`}>
                {project.points || 0} 积分
              </span>
            </div>
          </div>

          <div className="mb-2 text-left">
            <div className={`flex justify-between text-sm mb-1 ${hasCover ? 'text-white/90' : 'text-gray-600'}`}>
              <span>{t('project.progress')}</span>
              <span>{project.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>

          {(() => {
            const deadlineStatus = getDeadlineStatus(project.endDate);
            const daysLeft = getDaysLeft(project.endDate);
            const isUrgentSoon = deadlineStatus === 'soon' && daysLeft !== null && daysLeft <= 2 && project.progress < 50;
            let deadlineLabel = formatDate(project.endDate);
            let deadlineClass = hasCover ? 'text-white/90' : 'text-gray-600';
            let emoji = '';
            if (deadlineStatus === 'expired') {
              deadlineClass = 'text-red-600';
              if (hasCover) deadlineClass = 'text-red-400';
              emoji = '⏰ ';
            } else if (deadlineStatus === 'soon') {
              deadlineClass = isUrgentSoon ? 'text-amber-700' : 'text-amber-600';
              if (hasCover) deadlineClass = isUrgentSoon ? 'text-amber-300' : 'text-amber-400';
            }
            return (
              <div className={`flex items-center gap-4 text-sm ${deadlineClass}`}>
                <div className="flex items-center gap-1">
                  <CalendarIcon className="w-4 h-4 flex-shrink-0" />
                  <span>{emoji}{deadlineLabel}</span>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <SectionContainer
        className="h-full flex flex-col min-h-0"
        title={t('project.title')}
        badge={projects.length}
        filters={filters}
        activeFilter={filterOptions.find(f => f.key === activeFilter)?.label ?? filters[0]}
        onFilterChange={(label) => {
          const opt = filterOptions.find(f => f.label === label);
          setActiveFilter(opt?.key ?? 'all');
        }}
        onAddClick={() => handleOpenDrawer()}
        addButtonText={t('project.add')}
      >
        <div className="flex-1 min-h-0 overflow-y-auto">
          {loading ? (
            <ProjectListSkeleton />
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : projects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">{t('project.empty')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </SectionContainer>

      <ProjectDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        project={selectedProject}
        onSave={fetchProjects}
        onDelete={handleDelete}
      />
    </div>
  );
}
