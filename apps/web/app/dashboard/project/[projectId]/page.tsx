'use client';

import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Project, Requirement, Task, Defect } from '@/app/lib/definitions';
import { useLanguage } from '@/app/lib/i18n';
import RequirementKanban from '@/app/ui/dashboard/requirement-kanban';
import BreadcrumbNav from '@/app/ui/dashboard/breadcrumb-nav';
import ProjectTabMenu from '@/app/ui/dashboard/project-tab-menu';

type TabType = 'requirement' | 'task' | 'defect';

export default function ProjectDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const { t } = useLanguage();
  const projectId = params.projectId as string;

  const [project, setProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [defects, setDefects] = useState<Defect[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tab = (searchParams.get('tab') as TabType) || 'requirement';
  const validTabs: TabType[] = ['requirement', 'task', 'defect'];

  const setTab = (newTab: TabType) => {
    const url = new URL(window.location.href);
    url.searchParams.set('tab', newTab);
    router.replace(url.pathname + url.search);
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        const data = await res.json();
        if (res.status === 401) {
          router.push(`/?next=${encodeURIComponent(`/dashboard/project/${projectId}`)}`);
          return;
        }
        if (data.success && data.project) {
          setProject(data.project);
        } else {
          router.replace('/dashboard/project');
          return;
        }
      } catch {
        router.replace('/dashboard/project');
        return;
      }
    };
    fetchProject();
  }, [projectId, router]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        if (res.status === 401) {
          router.push(`/?next=${encodeURIComponent(`/dashboard/project/${projectId}`)}`);
          return;
        }
        if (data.success && Array.isArray(data.projects)) {
          setProjects(data.projects);
        }
      } catch {
        // ignore
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (!project) return;
    setLoading(true);
    setError(null);
    const fetchData = async () => {
      try {
        const [reqRes, taskRes, defectRes] = await Promise.all([
          fetch(`/api/requirements?projectId=${projectId}`),
          fetch(`/api/tasks?projectId=${projectId}`),
          fetch(`/api/defects?projectId=${projectId}`),
        ]);
        const [reqData, taskData, defectData] = await Promise.all([
          reqRes.json(),
          taskRes.json(),
          defectRes.json(),
        ]);
        if (reqData.success) setRequirements(reqData.requirements || []);
        if (taskData.success) setTasks(taskData.tasks || []);
        if (defectData.success) setDefects(defectData.defects || []);
      } catch (err) {
        setError(t('projectDetail.loadFailed'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [project, projectId, t]);

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-gray-500">{t('project.loading')}</p>
      </div>
    );
  }

  const showDefectTab = project.type === 'sprint-project';

  return (
    <div className="w-full">
      {/* 顶部栏 - 新设计 */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        {/* 面包屑导航 */}
        <BreadcrumbNav
          currentProject={project}
          projects={projects}
          currentTab={tab}
        />

        {/* Tab 菜单 */}
        <ProjectTabMenu
          activeTab={tab}
          onTabChange={setTab}
          showDefectTab={showDefectTab}
        />
      </div>

      {/* Tab 内容 */}
      {error && (
        <div className="text-center py-8 text-red-500">{error}</div>
      )}
      {!error && loading && (
        <div className="text-center py-8 text-gray-500">{t('project.loading')}</div>
      )}
      {!error && !loading && (
        <>
          {tab === 'requirement' && (
            <div className="space-y-4">
              {requirements.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  {t('projectDetail.emptyRequirement')}
                </div>
              ) : (
                <RequirementKanban
                  requirements={requirements}
                  groupBy="status"
                  onRequirementClick={() => {}}
                />
              )}
            </div>
          )}
          {tab === 'task' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500">
                  {t('projectDetail.emptyTask')}
                </div>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">{task.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                    <div className="flex gap-2 text-xs">
                      <span className="px-2 py-1 rounded bg-gray-100">
                        {t(`task.filters.${task.status}`)}
                      </span>
                      <span className="px-2 py-1 rounded bg-gray-100">
                        {t(`task.priority.${task.priority}`)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          {tab === 'defect' && showDefectTab && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {defects.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500">
                  {t('projectDetail.emptyDefect')}
                </div>
              ) : (
                defects.map((defect) => (
                  <div
                    key={defect.id}
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-mono text-gray-500">{defect.id}</span>
                      <span className="px-2 py-1 rounded text-xs bg-gray-100">
                        {t(`defect.type.${defect.type}`)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{defect.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{defect.description}</p>
                    <div className="flex gap-2 text-xs">
                      <span className="px-2 py-1 rounded bg-gray-100">
                        {t(`defect.filters.${defect.status}`)}
                      </span>
                      <span className="px-2 py-1 rounded bg-gray-100">
                        {t(`defect.severity.${defect.severity}`)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
