import StarterKit from '@tiptap/starter-kit';
import { useEditor, EditorContent } from '@tiptap/react';
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Quote, Undo, Redo } from 'lucide-react';
import useTranslation from '../../hooks/useTranslation';
interface Props {
  content: string;
  onChange: (html: string) => void;
}
export default function TiptapEditor({ content, onChange }: Props) {
  const { t } = useTranslation();
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });
  if (!editor) return null;
  return (
    <div className="border border-zinc-300 dark:border-zinc-700 rounded-lg overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-300 dark:border-zinc-700">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer ${editor.isActive('bold') ? 'bg-zinc-300 dark:bg-zinc-600' : ''}`} title={t('bold')}>
          <Bold className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer ${editor.isActive('italic') ? 'bg-zinc-300 dark:bg-zinc-600' : ''}`} title={t('italic')}>
          <Italic className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer ${editor.isActive('heading', { level: 1 }) ? 'bg-zinc-300 dark:bg-zinc-600' : ''}`} title={t('heading1')}>
          <Heading1 className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer ${editor.isActive('heading', { level: 2 }) ? 'bg-zinc-300 dark:bg-zinc-600' : ''}`} title={t('heading2')}>
          <Heading2 className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer ${editor.isActive('bulletList') ? 'bg-zinc-300 dark:bg-zinc-600' : ''}`} title={t('bulletList')}>
          <List className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer ${editor.isActive('orderedList') ? 'bg-zinc-300 dark:bg-zinc-600' : ''}`} title={t('numberedList')}>
          <ListOrdered className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer ${editor.isActive('blockquote') ? 'bg-zinc-300 dark:bg-zinc-600' : ''}`} title={t('quote')}>
          <Quote className="w-4 h-4" />
        </button>
        <div className="w-px bg-zinc-300 dark:bg-zinc-600 mx-1" />
        <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className="p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer disabled:opacity-50" title={t('undo')}>
          <Undo className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className="p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer disabled:opacity-50" title={t('redo')}>
          <Redo className="w-4 h-4" />
        </button>
      </div>
      <EditorContent editor={editor} className="prose dark:prose-invert max-w-none p-4 min-h-[300px] bg-white dark:bg-zinc-900 text-black dark:text-white focus:outline-none [&_.ProseMirror]:min-h-[250px] [&_.ProseMirror]:outline-none [&_.ProseMirror]:text-black [&_.ProseMirror]:dark:text-white" />
    </div>
  )
}