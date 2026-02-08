'use client';

import { useState } from 'react';
import { Project, ProjectCreateRequest } from '@/app/lib/definitions';
import ProjectForm from './ProjectForm';
import { useLanguage } from '@/app/lib/i18n';

interface ProjectDialogProps {
  open: boolean;
  onClose: () => void;
  project?: Project;
  onSuccess: () => void;
}

export default function ProjectDialog({ open, onClose, project, onSuccess }: ProjectDialogProps) {
  const { t } = useLanguage();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: ProjectCreateRequest) => {
    setSubmitting(true);
    try {
      const url = project ? `/api/projects/${project.id}` : '/api/projects';
      const method = project ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        onSuccess();
        onClose();
      } else {
        alert(result.message || '操作失败');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('操作失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">
            {project ? t('project.edit') : t('project.add')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="p-4">
          <ProjectForm
            project={project}
            onSubmit={handleSubmit}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}
