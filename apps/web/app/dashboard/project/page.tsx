'use client';

import { useRouter } from 'next/navigation';
import SectionContainer from '@/app/ui/dashboard/section-container';
import { useState, useEffect } from 'react';
import { Project } from '@/app/lib/definitions';
import { useLanguage } from '@/app/lib/i18n';
import ProjectDrawer from './components/ProjectDrawer';
import ProjectCard from './components/ProjectCard';
import { ProjectListSkeleton } from './components/ProjectCardSkeleton';

export default function ProjectPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeTypeFilter, setActiveTypeFilter] = useState('all');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>(undefined);

  const statusFilterOptions = [
    { key: 'all', label: t('project.filters.all') },
    { key: 'normal', label: t('project.filters.normal') },
    { key: 'at_risk', label: t('project.filters.at_risk') },
    { key: 'out_of_control', label: t('project.filters.out_of_control') },
  ];
  const statusFilters = statusFilterOptions.map(f => f.label);

  const typeFilterOptions = [
    { key: 'all', label: t('project.filters.all') },
    { key: 'sprint-project', label: t('project.type.sprint') },
    { key: 'slow-burn', label: t('project.type.slowBurn') },
  ];
  const typeFilters = typeFilterOptions.map(f => f.label);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (activeFilter !== 'all') {
        params.append('status', activeFilter);
      }
      if (activeTypeFilter !== 'all') {
        params.append('type', activeTypeFilter);
      }
      const queryParams = params.toString() ? `?${params.toString()}` : '';
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
  }, [activeFilter, activeTypeFilter]);

  return (
    <div className="w-full h-full">
      <SectionContainer
        className="h-full flex flex-col min-h-0"
        title={t('project.title')}
        badge={projects.length}
        filterGroups={[
          {
            label: t('project.statusLabel') || '状态',
            filters: statusFilters,
            activeFilter: statusFilterOptions.find(f => f.key === activeFilter)?.label ?? statusFilters[0],
            onFilterChange: (label) => {
              const opt = statusFilterOptions.find(f => f.label === label);
              setActiveFilter(opt?.key ?? 'all');
            },
          },
          {
            label: t('project.typeLabel') || '类型',
            filters: typeFilters,
            activeFilter: typeFilterOptions.find(f => f.key === activeTypeFilter)?.label ?? typeFilters[0],
            onFilterChange: (label) => {
              const opt = typeFilterOptions.find(f => f.label === label);
              setActiveTypeFilter(opt?.key ?? 'all');
            },
          },
        ]}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 p-2">
              {projects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project}
                  onEdit={handleOpenDrawer}
                  onDelete={handleDelete}
                />
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
