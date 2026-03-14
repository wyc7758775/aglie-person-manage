---
name: tiptap-editor
description: TipTap 富文本编辑器专家，专注于 TipTap 扩展配置、自定义节点、表格处理、代码高亮等。用于实现富文本编辑功能、自定义编辑器扩展、解决编辑器问题。
voice:
  - 富文本编辑器
  - TipTap
  - 编辑器扩展
  - Markdown 编辑
  - RTE
license: MIT
compatibility: opencode
metadata:
  author: user
  version: "1.0.0"
---

# TipTap Editor

你是 TipTap 富文本编辑器专家，帮助开发者配置和扩展 TipTap 编辑器。

## 何时使用

在以下情况下使用此 skill：
- 配置 TipTap 编辑器
- 添加自定义扩展
- 处理表格功能
- 实现代码高亮
- 自定义节点和标记
- 解决编辑器问题

## 项目 TipTap 配置

### 已安装的扩展

```json
{
  "@tiptap/react": "^2.10.2",
  "@tiptap/pm": "^2.10.2",
  "@tiptap/starter-kit": "^2.10.2",
  "@tiptap/extension-color": "^2.27.2",
  "@tiptap/extension-code-block-lowlight": "^2.27.2",
  "@tiptap/extension-placeholder": "^2.10.2",
  "@tiptap/extension-table": "^2.27.2",
  "@tiptap/extension-table-cell": "^2.27.2",
  "@tiptap/extension-table-header": "^2.27.2",
  "@tiptap/extension-table-row": "^2.27.2",
  "@tiptap/extension-task-item": "^2.27.2",
  "@tiptap/extension-task-list": "^2.27.2",
  "@tiptap/extension-text-style": "^2.27.2",
  "lowlight": "^3.3.0"
}
```

### 扩展功能说明

| 扩展 | 功能 |
|------|------|
| starter-kit | 基础功能（段落、标题、粗体、斜体等） |
| color | 文字颜色 |
| code-block-lowlight | 代码块 + 语法高亮 |
| placeholder | 占位符提示 |
| table 系列 | 表格支持 |
| task-list/item | 任务列表 |
| text-style | 文字样式基础 |

## 基础配置

### 创建编辑器实例

```tsx
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';

const lowlight = createLowlight(common);

export function RichTextEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // 禁用默认 codeBlock，使用 lowlight 版本
      }),
      Placeholder.configure({
        placeholder: '开始输入内容...',
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return <EditorContent editor={editor} className="prose max-w-none" />;
}
```

## 常用工具栏按钮

```tsx
function Toolbar({ editor }) {
  if (!editor) return null;

  return (
    <div className="flex gap-2 p-2 border-b">
      {/* 文本格式 */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'bg-gray-200' : ''}
      >
        <BoldIcon />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'bg-gray-200' : ''}
      >
        <ItalicIcon />
      </button>

      {/* 标题 */}
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}
      >
        H2
      </button>

      {/* 列表 */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}
      >
        <BulletListIcon />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        className={editor.isActive('taskList') ? 'bg-gray-200' : ''}
      >
        <CheckListIcon />
      </button>

      {/* 表格 */}
      <button
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
      >
        <TableIcon />
      </button>

      {/* 代码块 */}
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive('codeBlock') ? 'bg-gray-200' : ''}
      >
        <CodeIcon />
      </button>
    </div>
  );
}
```

## 表格操作

```tsx
// 插入表格
editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();

// 添加列
editor.chain().focus().addColumnAfter().run();

// 添加行
editor.chain().focus().addRowAfter().run();

// 删除列
editor.chain().focus().deleteColumn().run();

// 删除行
editor.chain().focus().deleteRow().run();

// 合并单元格
editor.chain().focus().mergeCells().run();

// 拆分单元格
editor.chain().focus().splitCell().run();
```

## 代码块配置

```tsx
// 支持的语言
import { common, createLowlight } from 'lowlight';

const lowlight = createLowlight(common);

// 支持的语言包括：
// JavaScript, TypeScript, Python, Java, C++, CSS, HTML, JSON, Markdown, SQL, 等

// 使用
<CodeBlockLowlight configure={{
  lowlight,
  defaultLanguage: 'plaintext',
}} />

// 设置语言
editor.chain().focus().toggleCodeBlock({ language: 'typescript' }).run();
```

## 自定义节点示例

```tsx
// 自定义高亮块节点
import { Node, mergeAttributes } from '@tiptap/core';

export const CalloutNode = Node.create({
  name: 'callout',

  group: 'block',

  content: 'block+',

  attributes: {
    type: {
      default: 'info',
    },
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="callout"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'callout',
        class: `callout callout-${HTMLAttributes.type}`,
      }),
      0,
    ];
  },
});
```

## 样式配置

```css
/* ProseMirror 样式（TipTap 基于 ProseMirror） */
.ProseMirror {
  outline: none;
}

.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}

/* 表格样式 */
.ProseMirror table {
  border-collapse: collapse;
  width: 100%;
}

.ProseMirror td,
.ProseMirror th {
  border: 1px solid #e2e8f0;
  padding: 8px;
}

.ProseMirror th {
  background-color: #f8fafc;
}

/* 代码块样式 */
.ProseMirror pre {
  background-color: #1e293b;
  color: #e2e8f0;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
}

.ProseMirror code {
  font-family: 'JetBrains Mono', monospace;
}
```

## 常见问题

### 1. 内容不更新
```tsx
// 使用 onUpdate 而非 onChange
const editor = useEditor({
  content,
  onUpdate: ({ editor }) => {
    onChange(editor.getHTML());
  },
});
```

### 2. 样式不生效
```tsx
// 确保添加 ProseMirror 类名
<EditorContent editor={editor} className="prose max-w-none" />
```

### 3. 表格无法调整大小
```tsx
// 确保配置 resizable
Table.configure({
  resizable: true,
}),
```

## 最佳实践

1. **按需加载扩展** - 只引入需要的扩展
2. **统一工具栏** - 复用工具栏组件
3. **受控 vs 非受控** - 根据场景选择
4. **性能优化** - 大文档时考虑虚拟化
5. **移动端适配** - 注意触摸事件处理
