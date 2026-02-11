'use client';

import { useState } from 'react';
import { Project, ProjectCreateRequest } from '@/app/lib/definitions';
import ProjectForm from './ProjectForm';
import { useLanguage } from '@/app/lib/i18n';
import Modal from '@/app/components/ui/modal';
import ConfirmDialog from '@/app/components/ui/confirm-dialog';

interface ProjectDialogProps {
  open: boolean;
  onClose: () => void;
  project?: Project;
  onSuccess: () => void;
}

export default function ProjectDialog({ open, onClose, project, onSuccess }: ProjectDialogProps) {
  const { t } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleSubmit = async (data: ProjectCreateRequest) => {
    setSubmitting(true);
    try {
      const url = project ? `/api/projects/${project.id}` : '/api/projects';
      const method = project ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
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

  const handleClose = () => {
    if (isDirty) {
      setShowConfirmDialog(true);
    } else {
      onClose();
    }
  };

  const handleConfirmClose = () => {
    setShowConfirmDialog(false);
    onClose();
  };

  const handleCancelClose = () => {
    setShowConfirmDialog(false);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        title={project ? t('modal.project.editTitle') : t('modal.project.createTitle')}
        maxWidth="max-w-2xl"
        closeOnEsc={!isDirty}
      >
        <ProjectForm
          project={project}
          onSubmit={handleSubmit}
          onCancel={handleClose}
          onDirtyChange={setIsDirty}
        />
      </Modal>

      <ConfirmDialog
        open={showConfirmDialog}
        onClose={handleCancelClose}
        onConfirm={handleConfirmClose}
        title={t('confirm.unsavedChanges.title')}
        message={t('confirm.unsavedChanges.message')}
        confirmText={t('confirm.unsavedChanges.confirm')}
        cancelText={t('confirm.unsavedChanges.cancel')}
        type="warning"
      />
    </>
  );
}
