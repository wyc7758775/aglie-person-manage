'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { RequirementComment, Attachment } from '@/app/lib/definitions';
import MarkdownEditorField from './markdown-editor-field';

interface CommentSectionProps {
  requirementId: string;
  onCountChange?: (count: number) => void;
}

// 格式化时间 - 增强错误处理
function formatTime(dateString: string | undefined | null): string {
  if (!dateString) {
    return '刚刚';
  }
  
  try {
    const date = new Date(dateString);
    // 检查是否是有效的日期
    if (isNaN(date.getTime())) {
      return '刚刚';
    }
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // 小于1分钟
    if (diff < 60000) {
      return '刚刚';
    }
    // 小于1小时
    if (diff < 3600000) {
      return `${Math.floor(diff / 60000)}分钟前`;
    }
    // 小于24小时
    if (diff < 86400000) {
      return `${Math.floor(diff / 3600000)}小时前`;
    }
    // 小于7天
    if (diff < 604800000) {
      return `${Math.floor(diff / 86400000)}天前`;
    }
    
    return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  } catch (error) {
    console.error('日期格式化错误:', error);
    return '刚刚';
  }
}

// 获取头像首字母 - 增强空值处理
function getAvatarLetter(nickname: string | undefined | null): string {
  if (!nickname || typeof nickname !== 'string') {
    return '?';
  }
  return nickname.charAt(0).toUpperCase();
}

// 生成头像背景色
function getAvatarColor(nickname: string | undefined | null): string {
  const colors = [
    'from-blue-400 to-blue-600',
    'from-green-400 to-green-600',
    'from-purple-400 to-purple-600',
    'from-pink-400 to-pink-600',
    'from-yellow-400 to-yellow-600',
    'from-indigo-400 to-indigo-600',
    'from-red-400 to-red-600',
    'from-teal-400 to-teal-600',
  ];
  
  if (!nickname || typeof nickname !== 'string') {
    return colors[0];
  }
  
  let hash = 0;
  for (let i = 0; i < nickname.length; i++) {
    hash = nickname.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

// 获取文件图标
function getFileIcon(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase();
  const iconMap: Record<string, string> = {
    'pdf': '📄',
    'doc': '📝',
    'docx': '📝',
    'xls': '📊',
    'xlsx': '📊',
    'md': '📑',
    'txt': '📃',
    'jpg': '🖼️',
    'jpeg': '🖼️',
    'png': '🖼️',
    'gif': '🖼️',
    'webp': '🖼️',
  };
  return iconMap[ext || ''] || '📎';
}

// 渲染 Markdown 内容
function renderMarkdownContent(content: string | undefined | null): string {
  if (!content) return '';
  
  // 如果内容已经是 HTML，直接返回
  if (content.includes('<') && content.includes('>')) {
    return content;
  }
  
  // 简单的 Markdown 转换
  let html = content
    // 转义 HTML 特殊字符
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // 粗体
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    // 斜体
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    // 行内代码
    .replace(/`(.+?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
    // 链接
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">$1</a>')
    // 换行
    .replace(/\n/g, '<br />');
  
  return html;
}

export default function CommentSection({ requirementId, onCountChange }: CommentSectionProps) {
  const [comments, setComments] = useState<RequirementComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [commentContent, setCommentContent] = useState('');
  const [editorKey, setEditorKey] = useState(0);
  const [currentUser, setCurrentUser] = useState<{ nickname: string } | null>(null);

  // 检测是否为本地/Mock 数据模式
  const isLocalMode = requirementId.startsWith('req-') || requirementId.startsWith('mock-');

  // 获取当前用户
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setCurrentUser(data.user);
          }
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
      }
    };
    fetchUser();
  }, []);

  const loadComments = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    // Mock/本地模式：从 localStorage 加载
    if (isLocalMode) {
      try {
        const storageKey = `comments_${requirementId}`;
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          setComments(parsed);
          onCountChange?.(parsed.length);
        } else {
          setComments([]);
          onCountChange?.(0);
        }
      } catch (err) {
        setComments([]);
        onCountChange?.(0);
      }
      setLoading(false);
      return;
    }
    
    // 正常 API 模式
    try {
      const response = await fetch(`/api/requirements/${requirementId}/comments`);
      const data = await response.json();
      if (data.success) {
        // 确保评论数据有正确的字段
        const processedComments = (data.comments || []).map((comment: any) => ({
          ...comment,
          userNickname: comment.userNickname || comment.user_nickname || '匿名用户',
          createdAt: comment.createdAt || comment.created_at || new Date().toISOString(),
        }));
        setComments(processedComments);
        onCountChange?.(processedComments.length);
      } else {
        setError(data.message || '加载评论失败');
        onCountChange?.(0);
      }
    } catch (err) {
      setError('加载评论失败');
      onCountChange?.(0);
    } finally {
      setLoading(false);
    }
  }, [requirementId, isLocalMode, onCountChange]);

  useEffect(() => {
    if (requirementId) {
      loadComments();
    }
  }, [requirementId, loadComments]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (attachments.length + files.length > 5) {
      alert('每条评论最多上传5个附件');
      return;
    }

    setUploading(true);
    
    const newAttachments: Attachment[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Mock/本地模式：创建本地对象 URL
      if (isLocalMode) {
        const objectUrl = URL.createObjectURL(file);
        newAttachments.push({
          id: `local-file-${Date.now()}-${i}`,
          entityType: 'requirement_comment',
          entityId: requirementId,
          fileName: file.name,
          fileUrl: objectUrl,
          fileSize: file.size,
          uploadedBy: '',
          createdAt: new Date().toISOString(),
        });
        continue;
      }
      
      // 正常 API 模式：上传到服务器
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('entityType', 'requirement_comment');
        formData.append('entityId', requirementId);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (data.success) {
          newAttachments.push({
            id: `temp-${Date.now()}-${i}`,
            entityType: 'requirement_comment',
            entityId: requirementId,
            fileName: data.file.fileName,
            fileUrl: data.file.fileUrl,
            fileSize: data.file.fileSize,
            uploadedBy: '',
            createdAt: new Date().toISOString(),
          });
        } else {
          alert(`上传 ${file.name} 失败: ${data.message}`);
        }
      } catch (err) {
        alert(`上传 ${file.name} 失败`);
      }
    }

    setAttachments(prev => [...prev, ...newAttachments]);
    setUploading(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!commentContent.trim() && attachments.length === 0) return;

    setSubmitting(true);
    
    // Mock/本地模式：保存到 localStorage
    if (isLocalMode) {
      const newComment: RequirementComment = {
        id: `local-${Date.now()}`,
        requirementId,
        userId: currentUser?.nickname || '当前用户',
        userNickname: currentUser?.nickname || '当前用户',
        content: commentContent.trim(),
        attachments: attachments,
        createdAt: new Date().toISOString(),
      };
      
      const updatedComments = [...comments, newComment];
      setComments(updatedComments);
      
      // 保存到 localStorage
      try {
        const storageKey = `comments_${requirementId}`;
        localStorage.setItem(storageKey, JSON.stringify(updatedComments));
      } catch (e) {
        console.error('保存到 localStorage 失败:', e);
      }
      
      setCommentContent('');
      setEditorKey(prev => prev + 1);
      setAttachments([]);
      setSubmitting(false);
      return;
    }
    
    // 正常 API 模式
    try {
      const response = await fetch(`/api/requirements/${requirementId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: commentContent.trim(),
          attachments: attachments.map(att => ({
            fileName: att.fileName,
            fileUrl: att.fileUrl,
            fileSize: att.fileSize,
          })),
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCommentContent('');
        setEditorKey(prev => prev + 1);
        setAttachments([]);
        loadComments();
      } else {
        alert(data.message || '发表评论失败');
      }
    } catch (err) {
      alert('发表评论失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('确定要删除这条评论吗？')) return;

    // Mock/本地模式：从 localStorage 删除
    if (isLocalMode) {
      const updatedComments = comments.filter(c => c.id !== commentId);
      setComments(updatedComments);
      
      try {
        const storageKey = `comments_${requirementId}`;
        localStorage.setItem(storageKey, JSON.stringify(updatedComments));
      } catch (e) {
        console.error('从 localStorage 删除失败:', e);
      }
      return;
    }

    // 正常 API 模式
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        loadComments();
      } else {
        alert(data.message || '删除评论失败');
      }
    } catch (err) {
      alert('删除评论失败');
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* 评论列表 */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {loading ? (
          <div className="text-center py-4 text-sm" style={{ color: 'rgba(26, 29, 46, 0.4)' }}>加载中...</div>
        ) : error ? (
          <div className="text-center py-4 text-sm text-red-500">{error}</div>
        ) : comments.length === 0 ? (
          <div 
            className="text-center py-8 rounded-xl"
            style={{ backgroundColor: '#F5F0F0' }}
          >
            <svg className="w-12 h-12 mx-auto mb-3" style={{ color: 'rgba(26, 29, 46, 0.2)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm" style={{ color: 'rgba(26, 29, 46, 0.4)' }}>暂无评论，发表第一条评论吧</p>
          </div>
        ) : (
          comments.map((comment, index) => (
            <div key={comment.id}>
              <div className="flex gap-3">
                {/* 头像 */}
                <div 
                  className={`w-9 h-9 rounded-full bg-gradient-to-br ${getAvatarColor(comment.userNickname)} flex items-center justify-center text-white text-sm font-medium flex-shrink-0`}
                >
                  {getAvatarLetter(comment.userNickname)}
                </div>

                {/* 内容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium" style={{ color: '#1A1D2E' }}>
                      {comment.userNickname || '匿名用户'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs" style={{ color: 'rgba(26, 29, 46, 0.4)' }}>
                        {formatTime(comment.createdAt)}
                      </span>
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="p-1 rounded transition-colors hover:bg-red-50"
                        style={{ color: 'rgba(26, 29, 46, 0.3)' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(26, 29, 46, 0.3)')}
                        title="删除"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* 评论内容 - 支持 Markdown */}
                  <div 
                    className="text-sm leading-relaxed prose prose-sm max-w-none"
                    style={{ color: '#1A1D2E' }}
                    dangerouslySetInnerHTML={{ __html: renderMarkdownContent(comment.content) }}
                  />

                  {/* 附件列表 */}
                  {comment.attachments && comment.attachments.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {comment.attachments.map((attachment) => (
                        <a
                          key={attachment.id}
                          href={attachment.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs transition-colors hover:border-orange-300"
                          style={{ 
                            backgroundColor: 'white',
                            borderColor: 'rgba(26, 29, 46, 0.08)',
                            color: 'rgba(26, 29, 46, 0.7)'
                          }}
                        >
                          <span>{getFileIcon(attachment.fileName)}</span>
                          <span className="max-w-[100px] truncate">{attachment.fileName}</span>
                          <span style={{ color: 'rgba(26, 29, 46, 0.4)' }}>({(attachment.fileSize / 1024).toFixed(1)} KB)</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* 评论间分隔线 */}
              {index < comments.length - 1 && (
                <div className="mt-4 h-px" style={{ backgroundColor: 'rgba(26, 29, 46, 0.06)' }} />
              )}
            </div>
          ))
        )}
      </div>

      {/* 评论输入 - 固定在底部 */}
      <div 
        className="mt-4 pt-4 flex-shrink-0"
        style={{ borderTop: '1px solid rgba(26, 29, 46, 0.06)' }}
      >
        <div 
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: '#F5F0F0' }}
        >
          {/* 编辑器 */}
          <div className="p-3">
            <MarkdownEditorField
              key={editorKey}
              value={commentContent}
              fieldName="comment"
              label=""
              placeholder="写下你的评论..."
              onChange={(field, value) => {
                setCommentContent(value || '');
              }}
              onSave={async () => Promise.resolve()}
              minRows={2}
              maxRows={4}
              showToolbar={false}
            />
          </div>
          
          {/* 附件 */}
          {attachments.length > 0 && (
            <div className="px-3 pb-2 flex flex-wrap gap-2">
              {attachments.map((att, index) => (
                <div 
                  key={att.id} 
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded border text-xs"
                  style={{ 
                    backgroundColor: 'white',
                    borderColor: 'rgba(26, 29, 46, 0.08)'
                  }}
                >
                  <span>{getFileIcon(att.fileName)}</span>
                  <span className="max-w-[80px] truncate" style={{ color: 'rgba(26, 29, 46, 0.7)' }}>{att.fileName}</span>
                  <button
                    onClick={() => handleRemoveAttachment(index)}
                    className="ml-1 p-0.5 rounded transition-colors hover:bg-red-50"
                    style={{ color: 'rgba(26, 29, 46, 0.3)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(26, 29, 46, 0.3)')}
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* 工具栏 */}
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.xls,.xlsx,.md,.txt"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || attachments.length >= 5}
                className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs transition-colors disabled:opacity-50"
                style={{ color: 'rgba(26, 29, 46, 0.5)' }}
                onMouseEnter={(e) => !uploading && (e.currentTarget.style.backgroundColor = 'rgba(26, 29, 46, 0.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                {uploading ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>上传中</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <span>附件{attachments.length > 0 && ` (${attachments.length}/5)`}</span>
                  </>
                )}
              </button>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={submitting || (!commentContent.trim() && attachments.length === 0)}
              className="px-4 py-1.5 text-sm text-white rounded-lg transition-colors disabled:opacity-50"
              style={{ backgroundColor: '#E8944A' }}
              onMouseEnter={(e) => !submitting && (e.currentTarget.style.backgroundColor = '#D4843A')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#E8944A')}
            >
              {submitting ? '发送中...' : '发送'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
