'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import { common, createLowlight } from 'lowlight';

const lowlight = createLowlight(common);

function textToHtml(text: string | null): string {
  if (!text || text.trim() === '') return '<p></p>';
  if (text.includes('<') && text.includes('>')) return text;
  return `<p>${text.replace(/\n/g, '</p><p>')}</p>`;
}

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  title: string;
  children: React.ReactNode;
}

function ToolbarButton({ onClick, isActive, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1 rounded hover:bg-gray-200 transition-colors ${
        isActive ? 'bg-gray-200 text-orange-600' : 'text-gray-600'
      }`}
    >
      {children}
    </button>
  );
}

interface MarkdownEditorFieldProps {
  value: string | null;
  fieldName: string;
  label: string;
  placeholder?: string;
  onSave: (fieldName: string, value: string | null) => Promise<void>;
  disabled?: boolean;
  className?: string;
  minRows?: number;
  maxRows?: number;
  showToolbar?: boolean;
}

export default function MarkdownEditorField({
  value,
  fieldName,
  label,
  placeholder = '',
  onSave,
  disabled = false,
  className = '',
  minRows = 4,
  maxRows = 10,
  showToolbar = true,
}: MarkdownEditorFieldProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const lastSavedRef = useRef<string | null>(null);
  const [wordCount, setWordCount] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Placeholder.configure({ 
        placeholder: placeholder || '支持 Markdown 格式：粗体 **text**、斜体 *text*、代码 `code`' 
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      TextStyle,
      Color,
    ],
    content: textToHtml(value),
    editable: !disabled,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none px-3 py-2 focus:outline-none`,
      },
    },
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      setWordCount(text.length);
    },
  });

  useEffect(() => {
    if (editor && value !== null) {
      const html = textToHtml(value);
      lastSavedRef.current = html;
      const currentHtml = editor.getHTML();
      if (html !== currentHtml) {
        editor.commands.setContent(html, false);
      }
    }
  }, [value, editor]);

  const performSave = useCallback(async () => {
    if (!editor) return;
    const html = editor.getHTML();
    const toSave = html === '<p></p>' || html.trim() === '' ? null : html;

    if (lastSavedRef.current === html) return;
    lastSavedRef.current = html;

    setIsSaving(true);
    setSaveError(null);
    try {
      await onSave(fieldName, toSave);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : '保存失败');
      lastSavedRef.current = null;
    } finally {
      setIsSaving(false);
    }
  }, [editor, fieldName, onSave]);

  useEffect(() => {
    if (!editor) return;
    const handleBlur = () => {
      performSave();
    };
    editor.on('blur', handleBlur);
    return () => {
      editor.off('blur', handleBlur);
    };
  }, [editor, performSave]);

  const minHeight = minRows * 30;
  const maxHeight = maxRows * 30;

  if (!editor) {
    return null;
  }

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      
      <div className="border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-500">
        {/* 工具栏 */}
        {showToolbar && (
          <div className="flex items-center gap-1 px-2 py-1 border-b border-gray-200 bg-gray-50 flex-wrap">
            {/* 文本样式 */}
            <div className="flex items-center gap-0.5">
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
                title="粗体 (Ctrl+B)"
              >
                <strong className="text-sm">B</strong>
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
                title="斜体 (Ctrl+I)"
              >
                <em className="text-sm">I</em>
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                isActive={editor.isActive('strike')}
                title="删除线"
              >
                <span className="line-through text-sm">S</span>
              </ToolbarButton>
            </div>
            
            <div className="w-px h-5 bg-gray-300 mx-1" />
            
            {/* 标题 */}
            <div className="flex items-center gap-0.5">
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                isActive={editor.isActive('heading', { level: 1 })}
                title="标题 1"
              >
                <span className="text-sm font-bold">H1</span>
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editor.isActive('heading', { level: 2 })}
                title="标题 2"
              >
                <span className="text-sm font-bold">H2</span>
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                isActive={editor.isActive('heading', { level: 3 })}
                title="标题 3"
              >
                <span className="text-sm font-bold">H3</span>
              </ToolbarButton>
            </div>
            
            <div className="w-px h-5 bg-gray-300 mx-1" />
            
            {/* 列表 */}
            <div className="flex items-center gap-0.5">
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
                title="无序列表"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive('orderedList')}
                title="有序列表"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h12M7 12h12M7 17h12M3 7h.01M3 12h.01M3 17h.01" />
                </svg>
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleTaskList().run()}
                isActive={editor.isActive('taskList')}
                title="任务列表"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </ToolbarButton>
            </div>
            
            <div className="w-px h-5 bg-gray-300 mx-1" />
            
            {/* 代码和引用 */}
            <div className="flex items-center gap-0.5">
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                isActive={editor.isActive('codeBlock')}
                title="代码块"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={editor.isActive('blockquote')}
                title="引用"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 15H5a2 2 0 01-2-2V9a2 2 0 012-2h4m6 0v10m0-10h4a2 2 0 012 2v4a2 2 0 01-2 2h-4" />
                </svg>
              </ToolbarButton>
            </div>
            
            <div className="w-px h-5 bg-gray-300 mx-1" />
            
            {/* 表格 */}
            <div className="flex items-center gap-0.5">
              <ToolbarButton
                onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                title="插入表格"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18v18H3V3zm0 6h18M9 3v18" />
                </svg>
              </ToolbarButton>
            </div>
            
            <div className="w-px h-5 bg-gray-300 mx-1" />
            
            {/* 撤销/重做 */}
            <div className="flex items-center gap-0.5">
              <ToolbarButton
                onClick={() => editor.chain().focus().undo().run()}
                title="撤销 (Ctrl+Z)"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().redo().run()}
                title="重做 (Ctrl+Y)"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                </svg>
              </ToolbarButton>
            </div>
          </div>
        )}
        
        {/* 编辑器内容 */}
        <div 
          className="relative"
          style={{ 
            minHeight: `${minHeight}px`,
            maxHeight: `${maxHeight}px`,
            overflowY: 'auto'
          }}
        >
          <EditorContent editor={editor} />
          {isSaving && (
            <span className="absolute right-2 top-2 text-xs text-gray-400">保存中...</span>
          )}
        </div>
        
        {/* 底部信息栏 */}
        <div className="flex items-center justify-between px-2 py-1 border-t border-gray-200 bg-gray-50 text-xs text-gray-500">
          <span>支持 Markdown 语法</span>
          <span>字数: {wordCount}</span>
        </div>
      </div>
      
      {saveError && (
        <p className="mt-1 text-sm text-red-600">{saveError}</p>
      )}
      
      <style jsx global>{`
        .tiptap p.is-editor-empty:first-child::before {
          color: #9ca3af;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        
        .tiptap:focus {
          outline: none;
        }
        
        .tiptap ul[data-type="taskList"] {
          list-style: none;
          padding: 0;
        }
        
        .tiptap ul[data-type="taskList"] li {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }
        
        .tiptap ul[data-type="taskList"] li > label {
          flex-shrink: 0;
        }
        
        .tiptap ul[data-type="taskList"] li > div {
          flex: 1;
        }
        
        .tiptap table {
          border-collapse: collapse;
          width: 100%;
          margin: 1rem 0;
        }
        
        .tiptap table th,
        .tiptap table td {
          border: 1px solid #d1d5db;
          padding: 0.5rem;
          text-align: left;
        }
        
        .tiptap table th {
          background-color: #f3f4f6;
          font-weight: 600;
        }
        
        .tiptap pre {
          background-color: #1f2937;
          color: #f3f4f6;
          padding: 1rem;
          border-radius: 0.375rem;
          overflow-x: auto;
          margin: 0.5rem 0;
        }
        
        .tiptap pre code {
          background: none;
          color: inherit;
          padding: 0;
          font-family: monospace;
        }
        
        .tiptap code {
          background-color: #f3f4f6;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-family: monospace;
          font-size: 0.875em;
        }
        
        .tiptap blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          margin: 0.5rem 0;
          color: #6b7280;
        }
        
        /* 无序列表样式 */
        .tiptap ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        
        .tiptap ul li {
          margin: 0.25rem 0;
        }
        
        /* 有序列表样式 */
        .tiptap ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        
        .tiptap ol li {
          margin: 0.25rem 0;
        }
      `}</style>
    </div>
  );
}
