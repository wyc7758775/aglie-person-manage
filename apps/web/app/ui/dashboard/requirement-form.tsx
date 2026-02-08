'use client';

import { useState, useEffect } from 'react';
import { Requirement, RequirementCreateRequest, RequirementStatus, RequirementPriority, RequirementType } from '@/app/lib/definitions';

interface RequirementFormProps {
  requirement?: Requirement;
  projectId?: string;
  onSubmit: (data: RequirementCreateRequest) => Promise<void>;
  onCancel: () => void;
}

export default function RequirementForm({ requirement, projectId = '', onSubmit, onCancel }: RequirementFormProps) {
  const [formData, setFormData] = useState<RequirementCreateRequest>({
    projectId: projectId || requirement?.projectId || '',
    title: requirement?.title || '',
    description: requirement?.description || '',
    type: requirement?.type || 'feature',
    status: requirement?.status || 'draft',
    priority: requirement?.priority || 'medium',
    assignee: requirement?.assignee || '',
    reporter: requirement?.reporter || '',
    createdDate: requirement?.createdDate || new Date().toISOString().split('T')[0],
    dueDate: requirement?.dueDate || '',
    storyPoints: requirement?.storyPoints || 0,
    points: requirement?.points || 0,
    tags: requirement?.tags || []
  });

  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [autoCalculatePoints, setAutoCalculatePoints] = useState(false);

  useEffect(() => {
    if (requirement || projectId) {
      setFormData(prev => ({
        ...prev,
        projectId: projectId || requirement?.projectId || prev.projectId,
        ...(requirement ? {
          title: requirement.title,
          description: requirement.description,
          type: requirement.type,
          status: requirement.status,
          priority: requirement.priority,
          assignee: requirement.assignee,
          reporter: requirement.reporter,
          createdDate: requirement.createdDate,
          dueDate: requirement.dueDate,
          storyPoints: requirement.storyPoints,
          points: requirement.points || 0,
          tags: requirement.tags
        } : {})
      }));
    }
  }, [requirement, projectId]);

  // 自动计算积分
  useEffect(() => {
    if (autoCalculatePoints && formData.priority) {
      const pointsMap: Record<RequirementPriority, number> = {
        critical: 15,
        high: 10,
        medium: 5,
        low: 2
      };
      setFormData(prev => ({ ...prev, points: pointsMap[formData.priority] }));
    }
  }, [autoCalculatePoints, formData.priority]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title || formData.title.trim().length === 0) {
      newErrors.title = '需求标题不能为空';
    } else if (formData.title.length > 200) {
      newErrors.title = '需求标题不能超过200个字符';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);
    try {
      const submitData = {
        ...formData,
        autoCalculatePoints: autoCalculatePoints
      };
      await onSubmit(submitData as any);
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 标题 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          标题 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={`w-full px-3 py-2 border rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="输入需求标题"
          required
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
      </div>

      {/* 描述 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          rows={3}
          placeholder="输入需求描述"
        />
      </div>

      {/* 类型和状态 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">类型</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as RequirementType })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="feature">功能</option>
            <option value="enhancement">增强</option>
            <option value="bugfix">修复</option>
            <option value="research">研究</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as RequirementStatus })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="draft">草稿</option>
            <option value="review">评审中</option>
            <option value="approved">已批准</option>
            <option value="development">开发中</option>
            <option value="testing">测试中</option>
            <option value="completed">已完成</option>
            <option value="rejected">已拒绝</option>
          </select>
        </div>
      </div>

      {/* 优先级和故事点数 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">优先级</label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as RequirementPriority })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="critical">紧急</option>
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">故事点数</label>
          <input
            type="number"
            value={formData.storyPoints}
            onChange={(e) => setFormData({ ...formData, storyPoints: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            min="0"
          />
        </div>
      </div>

      {/* 积分 */}
      <div>
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            id="autoCalculatePoints"
            checked={autoCalculatePoints}
            onChange={(e) => setAutoCalculatePoints(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="autoCalculatePoints" className="text-sm font-medium text-gray-700">
            根据优先级自动计算积分
          </label>
        </div>
        <label className="block text-sm font-medium text-gray-700 mb-1">积分</label>
        <input
          type="number"
          value={formData.points}
          onChange={(e) => {
            const value = parseInt(e.target.value) || 0;
            if (value >= 0) {
              setFormData({ ...formData, points: value });
            }
          }}
          className={`w-full px-3 py-2 border rounded-md ${errors.points ? 'border-red-500' : 'border-gray-300'} ${autoCalculatePoints ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          min="0"
          disabled={autoCalculatePoints}
          placeholder="输入积分值"
        />
        {errors.points && <p className="text-red-500 text-xs mt-1">{errors.points}</p>}
        {autoCalculatePoints && (
          <p className="text-xs text-gray-500 mt-1">
            当前优先级 {formData.priority === 'critical' ? '紧急' : formData.priority === 'high' ? '高' : formData.priority === 'medium' ? '中' : '低'} 对应积分: {formData.points}
          </p>
        )}
      </div>

      {/* 分配人和报告人 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">分配给</label>
          <input
            type="text"
            value={formData.assignee}
            onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="输入分配人"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">报告人</label>
          <input
            type="text"
            value={formData.reporter}
            onChange={(e) => setFormData({ ...formData, reporter: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="输入报告人"
          />
        </div>
      </div>

      {/* 日期 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">创建日期</label>
          <input
            type="date"
            value={formData.createdDate}
            onChange={(e) => setFormData({ ...formData, createdDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">截止日期</label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      {/* 标签 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">标签</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
            placeholder="输入标签后按回车"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            添加
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="ml-1 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* 按钮 */}
      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50"
        >
          {submitting ? '保存中...' : '保存'}
        </button>
      </div>
    </form>
  );
}
