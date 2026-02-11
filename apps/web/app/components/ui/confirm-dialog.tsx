'use client';

import React from 'react';
import Modal from './modal';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'danger';
}

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '确定',
  cancelText = '取消',
  type = 'warning',
}: ConfirmDialogProps) {
  const confirmButtonStyles = {
    info: 'bg-blue-600 hover:bg-blue-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    danger: 'bg-red-600 hover:bg-red-700',
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const footer = (
    <div className="flex justify-end gap-3">
      <button
        onClick={onClose}
        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
      >
        {cancelText}
      </button>
      <button
        onClick={handleConfirm}
        className={`px-4 py-2 text-white rounded-md ${confirmButtonStyles[type]}`}
      >
        {confirmText}
      </button>
    </div>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={footer}
      maxWidth="max-w-md"
      closeOnEsc={false}
      closeOnOverlayClick={false}
    >
      <p className="text-gray-700">{message}</p>
    </Modal>
  );
}
