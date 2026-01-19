import { Save, ArrowLeft, Image as ImageIcon, Bold, Italic, Heading } from 'lucide-react';
import { Head, useForm, Link, router, usePage } from '@inertiajs/react';
import { useEditor, EditorContent } from '@tiptap/react';
import { useToast } from '../../contexts/ToastContext';
import { useState } from 'react';
import StarterKit from '@tiptap/starter-kit';
import Layout from '../../components/Layout';
import Image from '@tiptap/extension-image';
import useTranslation from '../../hooks/useTranslation';
interface Props {
  blog?: {
    blogId: number;
    title: string;
    content: string;
    thumbnail: string | null;
    isPublished: boolean;
  };
}
export default function BlogEditor({ blog }: Props) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { auth } = usePage().props as any;
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    blog?.thumbnail ? `/storage/${blog.thumbnail}` : null
  );
  const { data, setData, processing, errors } = useForm({
    title: blog?.title || '',
    content: blog?.content || '',
    thumbnail: null as File | null,
    isPublished: blog?.isPublished || false,
  });
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[60vh] text-black dark:text-white',
      },
    },
    content: blog?.content || '',
    onUpdate: ({ editor }) => {
      setData('content', editor.getHTML());
    },
  });
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setData('thumbnail', file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const addImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const formData = new FormData();
        formData.append('image', file);
        try {
          const response = await fetch('/instructor/blogs/uploadImage', {
            method: 'POST',
            body: formData,
            headers: {
              'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
            },
          });
          const data = await response.json();
          if (data.url && editor) {
            editor.chain().focus().setImage({ src: data.url }).run();
          }
        } catch (error) {
          showToast(t('errorUploadingImage'), 'error');
        }
      }
    };
    input.click();
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (blog) {
      router.post(`/instructor/blogs/${blog.blogId}`, {
        _method: 'put',
        ...data,
      }, {
        onSuccess: () => showToast(t('blogUpdated'), 'success'),
        onError: () => showToast(t('pleaseFixErrors'), 'error'),
      });
    } else {
      router.post('/instructor/blogs', data, {
        onSuccess: () => showToast(t('blogCreated'), 'success'),
        onError: () => showToast(t('pleaseFixErrors'), 'error'),
      });
    }
  };
  return (
    <Layout user={auth.user}>
      <Head title={blog ? t('editBlog') : t('newBlog')} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between">
            <Link
              href="/instructor/blogs"
              className="flex items-center text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              {t('backToBlogs')}
            </Link>
            <div className="flex items-center gap-4">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={data.isPublished}
                  onChange={(e) => setData('isPublished', e.target.checked)}
                  className="w-5 h-5 text-black bg-transparent border-2 border-zinc-300 rounded focus:ring-0 focus:ring-offset-0 transition-colors cursor-pointer accent-black dark:accent-white"
                />
                <span className="ml-2 text-zinc-700 dark:text-zinc-300 group-hover:text-black dark:group-hover:text-white transition-colors select-none">{t('publishImmediately')}</span>
              </label>
              <button
                type="submit"
                disabled={processing}
                className="flex items-center px-6 py-2 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 cursor-pointer rounded"
              >
                <Save className="w-5 h-5 mr-2" />
                {processing ? t('saving') : t('save')}
              </button>
            </div>
          </div>
          <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">{t('title')}</label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => setData('title', e.target.value)}
                className="w-full px-0 py-2 border-0 border-b border-zinc-200 dark:border-zinc-800 focus:ring-0 focus:outline-none bg-transparent text-3xl placeholder-zinc-300 dark:placeholder-zinc-700 text-black dark:text-white"
                placeholder={t('blogTitlePlaceholder')}
              />
              {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">{t('thumbnail')}</label>
              <div className="flex items-center gap-4">
                {thumbnailPreview && (
                  <img src={thumbnailPreview} alt={t('preview')} className="h-32 w-32 object-cover border border-zinc-200 dark:border-zinc-700 rounded" />
                )}
                <label className="cursor-pointer flex items-center px-4 py-2 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors rounded">
                  <ImageIcon className="w-5 h-5 mr-2 text-zinc-500" />
                  <span className="text-zinc-700 dark:text-zinc-300">{t('uploadThumbnail')}</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleThumbnailChange} />
                </label>
              </div>
              {errors.thumbnail && <div className="text-red-500 text-sm mt-1">{errors.thumbnail}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">{t('content')}</label>
              <div className="overflow-hidden">
                <div className="bg-zinc-50 dark:bg-zinc-800 p-2 border-b border-zinc-200 dark:border-zinc-800 flex gap-2">
                  <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()} className={`p-2 hover:bg-zinc-200 dark:hover:bg-zinc-600 cursor-pointer rounded ${editor?.isActive('bold') ? 'bg-zinc-200 dark:bg-zinc-600' : ''}`}><Bold className="w-4 h-4" /></button>
                  <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()} className={`p-2 hover:bg-zinc-200 dark:hover:bg-zinc-600 cursor-pointer rounded ${editor?.isActive('italic') ? 'bg-zinc-200 dark:bg-zinc-600' : ''}`}><Italic className="w-4 h-4" /></button>
                  <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-2 hover:bg-zinc-200 dark:hover:bg-zinc-600 cursor-pointer rounded ${editor?.isActive('heading', { level: 2 }) ? 'bg-zinc-200 dark:bg-zinc-600' : ''}`}><Heading className="w-4 h-4" /></button>
                  <button type="button" onClick={addImage} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-600 cursor-pointer rounded"><ImageIcon className="w-4 h-4" /></button>
                </div>
                <div className="min-h-[60vh] cursor-text" onClick={() => editor?.commands.focus()}>
                  <EditorContent editor={editor} className="h-full focus:outline-none" />
                </div>
              </div>
              {errors.content && <div className="text-red-500 text-sm mt-1">{errors.content}</div>}
            </div>
          </div>
        </form>
      </div>
    </Layout>
  )
}