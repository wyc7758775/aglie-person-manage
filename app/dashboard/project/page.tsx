'use client';

import { EllipsisVerticalIcon, CalendarIcon } from '@/app/ui/icons';
import SectionContainer from '@/app/ui/dashboard/section-container';
import { useState, useEffect } from 'react';
import { Project, ProjectStatus, ProjectPriority } from '@/app/lib/definitions';
import { useLanguage } from '@/app/lib/i18n';
import ProjectDrawer from './components/ProjectDrawer';
import { ProjectListSkeleton } from './components/ProjectCardSkeleton';

export default function ProjectPage() {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>(undefined);

  const filters = ['All', 'Active', 'Completed', 'Paused', 'Planning'];

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'planning':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
    return type === 'code' ? '💻' : '🏠';
  };

  const getTypeBgColor = (type: string) => {
    return type === 'code' ? 'bg-blue-100' : 'bg-green-100';
  };

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = activeFilter !== 'All' ? `?status=${activeFilter.toLowerCase()}` : '';
      const response = await fetch(`/api/projects${queryParams}`);
      const data = await response.json();

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
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();

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

    return (
        <div
          className={`project-card group ${getTypeBgColor(project.type)} rounded-lg border border-gray-200 p-4 relative cursor-pointer hover:shadow-md transition-shadow`}
          onClick={() => handleOpenDrawer(project)}
        >
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <EllipsisVerticalIcon className="w-5 h-5" />
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

        <div className="mb-4 pr-10">
          <div className="text-3xl mb-2">{project.avatar || getTypeIcon(project.type)}</div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">{project.name}</h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                {t(`project.status.${project.status}`)}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                {t(`project.priority.${project.priority}`)}
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                {project.points || 0} 积分
              </span>
            </div>
          </div>

          <div className="mb-3">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>{t('project.progress')}</span>
              <span>{project.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <CalendarIcon className="w-4 h-4" />
              <span>{project.endDate || '-'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('project.title')}</h1>
        <p className="mt-2 text-gray-600">
          {t('project.subtitle')}
        </p>
      </div>

      <SectionContainer
        title={t('project.title')}
        badge={projects.length}
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onAddClick={() => handleOpenDrawer()}
        addButtonText={t('project.add')}
      >
        {loading ? (
          <ProjectListSkeleton />
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">{t('project.empty')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
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
