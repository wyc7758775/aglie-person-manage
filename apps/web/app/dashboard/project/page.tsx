'use client';

import { useRouter } from 'next/navigation';
import SectionContainer from '@/app/ui/dashboard/section-container';
import { useState, useCallback } from 'react';
import { Project, ProjectStatus, ProjectType } from '@/app/lib/definitions';
import { useLanguage } from '@/app/lib/i18n';
import { useProjects } from '@/app/lib/hooks/useProjects';
import ProjectDrawer from './components/ProjectDrawer';
import ProjectCard from './components/ProjectCard';
import { ProjectListSkeleton } from '@/app/ui/skeletons/project-card-skeleton';
import EmptyProjectState from '@/app/ui/dashboard/empty-project-state';

export default function ProjectPage() {
  const router = useRouter();
  const { t } = useLanguage();
  
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [activeTypeFilter, setActiveTypeFilter] = useState<string>('all');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>(undefined);

  // 构建筛选参数
  const filters = {
    status: activeFilter !== 'all' ? (activeFilter as ProjectStatus) : undefined,
    type: activeTypeFilter !== 'all' ? (activeTypeFilter as ProjectType) : undefined,
  };

  // 使用 SWR 获取项目列表
  const {
    projects,
    isLoading,
    isValidating,
    error,
    updateProject,
    addProject,
    removeProject,
    refresh,
  } = useProjects(filters);

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

  // 处理 401 错误
  const handleAuthError = useCallback(() => {
    router.push('/?next=/dashboard/project');
  }, [router]);

  const handleOpenDrawer = (project?: Project) => {
    setSelectedProject(project);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedProject(undefined);
  };

  // 局部更新：编辑项目后更新对应卡片
  const handleSaveProject = useCallback((savedProject: Project) => {
    if (selectedProject) {
      // 编辑模式：更新现有项目
      updateProject(savedProject);
    } else {
      // 创建模式：添加新项目
      addProject(savedProject);
    }
    handleCloseDrawer();
  }, [selectedProject, updateProject, addProject]);

  // 局部删除：删除项目后移除对应卡片
  const handleDelete = useCallback(async (id: string) => {
    setSelectedProject(undefined);
    try {
      const response = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (response.status === 401) {
        handleAuthError();
        return;
      }
      if (data.success) {
        // 乐观更新：立即从列表中移除
        removeProject(id);
      } else {
        alert(data.message || t('project.deleteFailed'));
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert(t('project.deleteFailedRetry'));
    }
  }, [removeProject, handleAuthError, t]);

  // 显示错误信息
  const errorMessage = error 
    ? t('common.errors.networkError') 
    : null;

  return (
    <div className="w-full h-full">
      <SectionContainer
        className="h-full flex flex-col min-h-0"
        title={t('project.title')}
        badge={projects.length}
        data-testid="project-list"
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
          {isLoading && !isValidating ? (
            // 首次加载显示骨架屏
            <ProjectListSkeleton />
          ) : errorMessage ? (
            <div className="text-center py-8 text-red-500">{errorMessage}</div>
          ) : projects.length === 0 ? (
            <EmptyProjectState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2">
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
        onClose={handleCloseDrawer}
        project={selectedProject}
        onSave={handleSaveProject}
        onDelete={handleDelete}
      />
    </div>
  );
}
