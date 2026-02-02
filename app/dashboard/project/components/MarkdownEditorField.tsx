'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

function textToHtml(text: string | null): string {
  if (!text || text.trim() === '') return '<p></p>';
  if (text.includes('<') && text.includes('>')) return text;
  return `<p>${text.replace(/\n/g, '</p><p>')}</p>`;
}

interface MarkdownEditorFieldProps {
  value: string | null;
  fieldName: string;
  label: string;
  placeholder?: string;
  onSave: (fieldName: string, value: string | null) => Promise<void>;
  disabled?: boolean;
  className?: string;
}

export default function MarkdownEditorField({
  value,
  fieldName,
  label,
  placeholder = '',
  onSave,
  disabled = false,
  className = '',
}: MarkdownEditorFieldProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const lastSavedRef = useRef<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: placeholder || '支持 Markdown 格式' }),
    ],
    content: textToHtml(value),
    editable: !disabled,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[80px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
      },
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

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <EditorContent editor={editor} />
        {isSaving && (
          <span className="absolute right-2 top-2 text-xs text-gray-400">保存中...</span>
        )}
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
      `}</style>
    </div>
  );
}
