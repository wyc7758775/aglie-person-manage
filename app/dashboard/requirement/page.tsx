'use client';

import { useState, useEffect } from 'react';
import { Requirement } from '@/app/lib/definitions';
import SectionContainer from '@/app/ui/dashboard/section-container';
import ViewSwitcher, { ViewType, KanbanGroupBy } from '@/app/ui/dashboard/view-switcher';
import RequirementCard from '@/app/ui/dashboard/requirement-card';
import RequirementKanban from '@/app/ui/dashboard/requirement-kanban';
import RequirementForm from '@/app/ui/dashboard/requirement-form';
import { XMarkIcon } from '@/app/ui/icons';

export default function RequirementPage() {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [viewType, setViewType] = useState<ViewType>('list');
  const [kanbanGroupBy, setKanbanGroupBy] = useState<KanbanGroupBy>('status');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState<Requirement | undefined>(undefined);

  const filters = ['All', 'Draft', 'Review', 'Approved', 'Development', 'Testing', 'Completed'];

  // 获取需求列表
  const fetchRequirements = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/requirements');
      const result = await response.json();
      if (result.success) {
        setRequirements(result.requirements);
      } else {
        setError(result.message || '获取需求列表失败');
      }
    } catch (err) {
      console.error('Fetch requirements error:', err);
      setError('获取需求列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, []);

  // 筛选需求
  const filteredRequirements = requirements.filter(requirement => {
    if (activeFilter === 'All') return true;
    return requirement.status === activeFilter.toLowerCase();
  });

  // 处理创建/编辑需求
  const handleFormSubmit = async (data: any) => {
    try {
      const url = selectedRequirement ? `/api/requirements/${selectedRequirement.id}` : '/api/requirements';
      const method = selectedRequirement ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        await fetchRequirements();
        setFormOpen(false);
        setSelectedRequirement(undefined);
      } else {
        alert(result.message || '操作失败');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('操作失败，请稍后重试');
    }
  };

  // 处理删除需求
  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个需求吗？')) {
      return;
    }

    try {
      const response = await fetch(`/api/requirements/${id}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        await fetchRequirements();
      } else {
        alert(result.message || '删除失败');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('删除失败，请稍后重试');
    }
  };

  // 打开创建表单
  const handleOpenCreateForm = () => {
    setSelectedRequirement(undefined);
    setFormOpen(true);
  };

  // 打开编辑表单
  const handleOpenEditForm = (requirement: Requirement) => {
    setSelectedRequirement(requirement);
    setFormOpen(true);
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">需求管理</h1>
          <p className="mt-2 text-gray-600">
            管理产品需求，跟踪开发进度，确保项目按计划进行
          </p>
        </div>
        {/* 视图切换控件 */}
        <ViewSwitcher
          currentView={viewType}
          onViewChange={setViewType}
          kanbanGroupBy={kanbanGroupBy}
          onKanbanGroupChange={setKanbanGroupBy}
          showKanbanGroupToggle={true}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <SectionContainer
          title="需求列表"
          badge={requirements.length}
          filters={filters}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          onAddClick={handleOpenCreateForm}
          addButtonText="添加需求"
        >
          {loading ? (
            <div className="text-center py-8 text-gray-500">加载中...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : filteredRequirements.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">没有找到符合条件的需求</p>
            </div>
          ) : viewType === 'list' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRequirements.map((requirement) => (
                <RequirementCard
                  key={requirement.id}
                  requirement={requirement}
                  onClick={() => handleOpenEditForm(requirement)}
                />
              ))}
            </div>
          ) : (
            <RequirementKanban
              requirements={filteredRequirements}
              groupBy={kanbanGroupBy}
              onRequirementClick={handleOpenEditForm}
            />
          )}
        </SectionContainer>
      </div>

      {/* 需求表单对话框 */}
      {formOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">
                {selectedRequirement ? '编辑需求' : '创建需求'}
              </h2>
              <button
                onClick={() => {
                  setFormOpen(false);
                  setSelectedRequirement(undefined);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4">
              <RequirementForm
                requirement={selectedRequirement}
                onSubmit={handleFormSubmit}
                onCancel={() => {
                  setFormOpen(false);
                  setSelectedRequirement(undefined);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
