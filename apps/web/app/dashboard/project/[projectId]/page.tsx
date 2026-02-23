'use client';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { Project, Requirement as BaseRequirement, Task, Defect } from '@/app/lib/definitions';
import { useLanguage } from '@/app/lib/i18n';
import RequirementTable from '@/app/ui/dashboard/requirement-table';
import { convertToExtendedRequirement } from '@/app/lib/requirement-utils';
import RequirementSlidePanel from '@/app/ui/dashboard/requirement-slide-panel';
import ProjectHeader from './components/ProjectHeader';
import LoadingState from './components/LoadingState';
import TaskTabContent from './components/TaskTabContent';
import DefectTabContent from './components/DefectTabContent';

type TabType = 'requirement' | 'task' | 'defect';

function useProjectData(projectId: string) {
  const router = useRouter();
  const { t } = useLanguage();
  const [project, setProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [requirements, setRequirements] = useState<BaseRequirement[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [defects, setDefects] = useState<Defect[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/projects/${projectId}`)
      .then(res => {
        if (res.status === 401) {
          router.push(`/?next=${encodeURIComponent(`/dashboard/project/${projectId}`)}`);
          throw new Error('Unauthorized');
        }
        return res.json();
      })
      .then(data => {
        if (data.success && data.project) {
          setProject(data.project);
        } else {
          router.replace('/dashboard/project');
        }
      })
      .catch(() => router.replace('/dashboard/project'));
  }, [projectId, router]);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.status === 401 ? null : res.json())
      .then(data => data?.success && setProjects(data.projects))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!project) return;
    setLoading(true);
    
    Promise.all([
      fetch(`/api/requirements?projectId=${projectId}`),
      fetch(`/api/tasks?projectId=${projectId}`),
      fetch(`/api/defects?projectId=${projectId}`),
    ])
      .then(([reqRes, taskRes, defectRes]) => Promise.all([reqRes.json(), taskRes.json(), defectRes.json()]))
      .then(([reqData, taskData, defectData]) => {
        if (reqData.success) {
          const mappedRequirements = (reqData.requirements || []).map((req: BaseRequirement) => convertToExtendedRequirement(req));
          setRequirements(mappedRequirements);
        }
        if (taskData.success) setTasks(taskData.tasks || []);
        if (defectData.success) setDefects(defectData.defects || []);
      })
      .catch(() => setError(t('projectDetail.loadFailed')))
      .finally(() => setLoading(false));
  }, [project, projectId, t]);

  const refresh = useCallback(() => {
    if (!project) return;
    
    // 刷新需求列表
    fetch(`/api/requirements?projectId=${projectId}`)
      .then(res => res.json())
      .then((reqData) => {
        if (reqData.success) {
          const mappedRequirements = (reqData.requirements || []).map((req: BaseRequirement) => convertToExtendedRequirement(req));
          setRequirements(mappedRequirements);
        }
      })
      .catch((err) => console.error('刷新需求列表失败:', err));
    
    // 刷新任务列表
    fetch(`/api/tasks?projectId=${projectId}`)
      .then(res => res.json())
      .then((taskData) => {
        if (taskData.success) {
          setTasks(taskData.tasks || []);
        }
      })
      .catch((err) => console.error('刷新任务列表失败:', err));
  }, [project, projectId]);

  return { project, projects, requirements, setRequirements, tasks, defects, loading, error, refresh };
}

export default function ProjectDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const { t } = useLanguage();
  const projectId = params.projectId as string;

  const { project, projects, requirements, setRequirements, tasks, defects, loading, error, refresh } = useProjectData(projectId);
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState<BaseRequirement | undefined>(undefined);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const tab = (searchParams.get('tab') as TabType) || 'requirement';
  const setTab = (newTab: TabType) => {
    const url = new URL(window.location.href);
    url.searchParams.set('tab', newTab);
    router.replace(url.pathname + url.search);
  };

  const handleRequirementClick = (req: BaseRequirement) => {
    setSelectedRequirement(req);
    setPanelOpen(true);
  };

  const handleAddRequirement = () => {
    setSelectedRequirement(undefined);
    setPanelOpen(true);
  };

  const handleDeleteRequirement = (id: string) => {
    setRequirements(prev => prev.filter(r => r.id !== id));
  };

  const handleUpdateRequirement = (id: string, data: Partial<BaseRequirement>) => {
    setRequirements(prev => prev.map(r => 
      r.id === id ? { ...r, ...data } : r
    ));
  };

  const handleSaveRequirement = async (req: BaseRequirement) => {
    try {
      const apiData = {
        projectId,
        title: req.name,
        description: req.description || '',
        type: 'feature' as const,
        status: req.status === 'todo' ? 'draft' : 
                req.status === 'in_progress' ? 'development' :
                req.status === 'done' ? 'completed' :
                req.status === 'cancelled' ? 'rejected' :
                req.status === 'accepted' ? 'completed' : 'draft',
        priority: req.priority === 'p0' ? 'critical' :
                  req.priority === 'p1' ? 'high' :
                  req.priority === 'p2' ? 'medium' : 'low',
        assignee: req.assignee?.nickname || '',
        reporter: '',
        createdDate: new Date().toISOString().split('T')[0],
        dueDate: req.deadline || '',
        storyPoints: 0,
        points: req.points,
        tags: [],
      };

      const isUpdate = !!req.id && requirements.some(r => r.id === req.id);
      
      if (isUpdate) {
        setRequirements(prev => prev.map(r => 
          r.id === req.id ? { ...r, ...req } : r
        ));
        setSelectedRequirement(req);
      } else {
        const newReq = { ...req, id: `req-${Date.now()}`, workItemId: `REQ${String(requirements.length + 1).padStart(3, '0')}` };
        setRequirements(prev => [...prev, newReq]);
        setPanelOpen(false);
        setSelectedRequirement(undefined);
      }
    } catch (error) {
      console.error('保存需求失败:', error);
      alert('保存需求失败，请稍后重试');
    }
  };

  if (!project) {
    return (
      <div 
        className="rounded-2xl overflow-hidden flex flex-col h-full"
        style={{ 
          backgroundColor: 'white',
          boxShadow: '0 4px 20px rgba(26, 29, 46, 0.08)'
        }}
      >
        <ProjectHeader
          currentProject={null}
          projects={projects}
          activeTab={tab}
          onTabChange={setTab}
          showDefectTab={false}
        />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">{t('project.loading')}</p>
        </div>
      </div>
    );
  }

  const showDefectTab = project.type === 'sprint-project';

  return (
    <div 
      className="rounded-2xl overflow-hidden flex flex-col h-full"
      style={{ 
        backgroundColor: 'white',
        boxShadow: '0 4px 20px rgba(26, 29, 46, 0.08)'
      }}
    >
      {/* 顶部导航栏 - 独立于加载状态 */}
      <ProjectHeader
        currentProject={project}
        projects={projects}
        activeTab={tab}
        onTabChange={setTab}
        showDefectTab={showDefectTab}
      />

      {/* 内容区域 */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* 错误提示 */}
        {error && (
          <div className="flex-1 flex items-center justify-center py-8 text-red-500">
            {error}
          </div>
        )}
        
        {/* 加载状态 */}
        {!error && loading && <LoadingState />}

        {/* 需求 Tab */}
        {!error && !loading && tab === 'requirement' && (
          <RequirementTable
            requirements={requirements}
            onRequirementClick={handleRequirementClick}
            onAddClick={handleAddRequirement}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            onDelete={handleDeleteRequirement}
            onUpdate={handleUpdateRequirement}
          />
        )}

        {/* 任务 Tab */}
        {!error && !loading && tab === 'task' && (
          <TaskTabContent
            tasks={tasks}
            projectId={projectId}
            onTaskCreated={refresh}
          />
        )}

        {/* 缺陷 Tab */}
        {!error && !loading && tab === 'defect' && showDefectTab && (
          <DefectTabContent defects={defects} />
        )}
      </div>

      {/* 需求滑出面板 */}
      <RequirementSlidePanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        requirement={selectedRequirement}
        onSave={handleSaveRequirement}
        projectId={projectId}
        onRequirementCreated={refresh}
      />
    </div>
  );
}
