'use client';

import { useState } from 'react';
import { Project } from '@/app/lib/definitions';
import { useLanguage } from '@/app/lib/i18n';
import { CalendarIcon, ChartBarIcon } from '@/app/ui/icons';

interface ProjectDetailDialogProps {
  open: boolean;
  onClose: () => void;
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export default function ProjectDetailDialog({ open, onClose, project, onEdit, onDelete }: ProjectDetailDialogProps) {
  const { t } = useLanguage();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(t('project.deleteConfirm'))) {
      return;
    }

    setDeleting(true);
    try {
      onDelete(project.id);
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = () => {
    onEdit(project);
    onClose();
  };

  const getTypeIcon = (type: string) => {
    return type === 'code' ? '💻' : '🏠';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-100 text-green-800';
      case 'at_risk': return 'bg-yellow-100 text-yellow-800';
      case 'out_of_control': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getTypeIcon(project.type)}</span>
            <h2 className="text-xl font-semibold">{project.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <p className="text-gray-600">{project.description?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() || ''}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
              {t(`project.status.${project.status}`)}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(project.priority)}`}>
              {t(`project.priority.${project.priority}`)}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {t(`project.type.${project.type}`)}
            </span>
          </div>

          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{t('project.progress')}</span>
              <span>{project.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-xs text-gray-500">{t('project.startTime')}</div>
                <div className="text-sm font-medium">{project.startDate}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-xs text-gray-500">{t('project.deadline')}</div>
                <div className="text-sm font-medium">{project.endDate || '-'}</div>
              </div>
            </div>
          </div>

          {project.goals.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2">{t('project.goals')}</h3>
              <ul className="list-disc list-inside space-y-1">
                {project.goals.map((goal, index) => (
                  <li key={index} className="text-sm text-gray-700">{goal}</li>
                ))}
              </ul>
            </div>
          )}

          {project.tags.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2">{t('project.tags')}</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-xs text-gray-500">
              {new Date(project.createdAt).toLocaleString()} - {new Date(project.updatedAt).toLocaleString()}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
              >
                {t('project.edit')}
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium disabled:opacity-50"
              >
                {deleting ? '...' : t('project.delete')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
