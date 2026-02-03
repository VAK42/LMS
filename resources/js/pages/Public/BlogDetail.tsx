import { Calendar, User, Eye, ArrowLeft, Copy, FileText } from 'lucide-react';
import { Head, Link, usePage } from '@inertiajs/react';
import { useToast } from '../../contexts/ToastContext';
import Layout from '../../components/Layout';
import useTranslation from '../../hooks/useTranslation';
interface Blog {
  blogId: number;
  title: string;
  slug: string;
  thumbnail: string | null;
  content: string;
  viewCount: number;
  publishedAt: string;
  instructor: {
    userName: string;
  };
}
interface Props {
  blog: Blog;
  relatedBlogs: Blog[];
}
export default function BlogDetail({ blog, relatedBlogs }: Props) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { auth } = usePage().props as any;
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast(t('linkCopied'), 'success');
  };
  return (
    <Layout user={auth?.user}>
      <Head title={blog.title} />
      <div className="bg-white dark:bg-black min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blogs" className="inline-flex items-center text-sm text-zinc-500 dark:text-zinc-400 hover:text-green-950 dark:hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('backToBlogs')}
          </Link>
          <article>
            <header className="mb-8">
              <h1 className="text-4xl font-serif text-green-950 dark:text-white sm:text-5xl mb-6 leading-tight">{blog.title}</h1>
              <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-500 dark:text-zinc-400 border-b border-green-950 dark:border-white pb-8">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mr-3 border border-green-950 dark:border-white rounded-full">
                    <User className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
                  </div>
                  <span className="font-medium text-green-950 dark:text-white">{blog.instructor.userName}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  {new Date(blog.publishedAt).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  {blog.viewCount} {t('views')}
                </div>
              </div>
            </header>
            {blog.thumbnail && (
              <div className="relative aspect-video w-full mb-10 overflow-hidden border border-green-950 dark:border-white rounded">
                <img src={`/storage/${blog.thumbnail}`} alt={blog.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="prose prose-lg dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300">
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            </div>
          </article>
          <div className="mt-12 pt-8 border-t border-green-950 dark:border-white">
            <h3 className="text-lg font-serif text-green-950 dark:text-white mb-4">{t('shareThisArticle')}</h3>
            <div className="flex gap-4">
              <button onClick={copyLink} className="p-2 border border-green-950 dark:border-white bg-white dark:bg-black hover:bg-green-50 dark:hover:bg-zinc-900 transition-colors text-green-950 dark:text-white cursor-pointer rounded">
                <Copy className="w-5 h-5" />
              </button>
            </div>
          </div>
          {relatedBlogs.length > 0 && (
            <div className="mt-16 pt-12 border-t border-green-950 dark:border-white">
              <h2 className="text-3xl font-serif text-green-950 dark:text-white mb-8">{t('relatedArticles')}</h2>
              <div className="grid gap-8 md:grid-cols-2">
                {relatedBlogs.map((related) => (
                  <Link key={related.blogId} href={`/blogs/${related.slug}`} className="group block">
                    <div className="bg-white dark:bg-zinc-900 border border-green-950 dark:border-white hover:border-green-800 dark:hover:border-zinc-200 transition-colors duration-300 overflow-hidden rounded">
                      <div className="aspect-video w-full relative overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border-b border-green-950 dark:border-white">
                        {related.thumbnail ? (
                          <img src={`/storage/${related.thumbnail}`} alt={related.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="bg-white dark:bg-zinc-900 w-full h-full flex items-center justify-center grayscale">
                            <FileText className="w-12 h-12 text-zinc-300 dark:text-zinc-600" />
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h4 className="text-xl font-serif text-green-950 dark:text-white group-hover:underline transition-all line-clamp-2">{related.title}</h4>
                        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{new Date(related.publishedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}