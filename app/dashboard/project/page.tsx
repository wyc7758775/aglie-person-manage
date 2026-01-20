'use client';

import {
  PlusIcon,
  EllipsisVerticalIcon,
  CalendarIcon,
  UserGroupIcon,
  ChartBarIcon
} from '@/app/ui/icons';
import SectionContainer from '@/app/ui/dashboard/section-container';
import { useState, useEffect } from 'react';
import { Project, ProjectStatus, ProjectPriority } from '@/app/lib/definitions';
import { useLanguage } from '@/app/lib/i18n';
import ProjectDialog from './components/ProjectDialog';
import ProjectDetailDialog from './components/ProjectDetailDialog';

export default function ProjectPage() {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);
  const [viewingProject, setViewingProject] = useState<Project | undefined>(undefined);

  const filters = ['All', 'Active', 'Completed', 'Paused', 'Planning'];

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = activeFilter !== 'All' ? `?status=${activeFilter.toLowerCase()}` : '';
      const response = await fetch(`/api/projects${queryParams}`);
      const data = await response.json();

      if (data.success) {
        setProjects(data.projects);
      } else {
        setError(data.message || '加载失败');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [activeFilter]);

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

  const handleAddProject = () => {
    setEditingProject(undefined);
    setDialogOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setDialogOpen(true);
  };

  const handleViewProject = (project: Project) => {
    setViewingProject(project);
    setDetailDialogOpen(true);
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();

      if (data.success) {
        fetchProjects();
      } else {
        alert(data.message || '删除失败');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('删除失败，请稍后重试');
    }
  };

  function ProjectCard({ project }: { project: Project }) {
    const [showMenu, setShowMenu] = useState(false);

    return (
      <div
        className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow relative cursor-pointer"
        onClick={() => handleViewProject(project)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{getTypeIcon(project.type)}</span>
              <h3 className="font-semibold text-gray-900">{project.name}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{project.description}</p>
            <div className="flex items-center space-x-2 mb-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                {t(`project.status.${project.status}`)}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                {t(`project.priority.${project.priority}`)}
              </span>
            </div>
          </div>
          <div className="relative">
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
                    handleViewProject(project);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                >
                  查看详情
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditProject(project);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                >
                  {t('project.edit')}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProject(project.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-red-600"
                >
                  {t('project.delete')}
                </button>
              </div>
            )}
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

      <div className="grid grid-cols-1 gap-6">
        <SectionContainer
          title={t('project.title')}
          badge={projects.length}
          filters={filters}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          onAddClick={handleAddProject}
          addButtonText={t('project.add')}
        >
          {loading ? (
            <div className="text-center py-8 text-gray-500">加载中...</div>
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
      </div>

      <ProjectDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        project={editingProject}
        onSuccess={fetchProjects}
      />

      <ProjectDetailDialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        project={viewingProject!}
        onEdit={handleEditProject}
        onDelete={handleDeleteProject}
      />
    </div>
  );
}
