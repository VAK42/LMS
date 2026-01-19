import { Plus, Search, Edit, Trash2, Eye, FileText, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useToast } from '../../contexts/ToastContext';
import { useState } from 'react';
import Layout from '../../components/Layout';
import useTranslation from '../../hooks/useTranslation';
interface Blog {
  blogId: number;
  title: string;
  slug: string;
  isPublished: boolean;
  viewCount: number;
  createdAt: string;
}
interface Props {
  blogs: {
    data: Blog[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: any[];
  };
  filters: {
    search?: string;
  };
}
export default function BlogIndex({ blogs, filters }: Props) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { auth } = usePage().props as any;
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const handleSearch = () => {
    const params: { search?: string } = {};
    if (searchTerm && searchTerm.trim()) {
      params.search = searchTerm;
    }
    router.get('/instructor/blogs', params, { preserveState: true });
  };
  const buildPaginationParams = (page: number) => {
    const params: { page: number; search?: string } = { page };
    if (searchTerm && searchTerm.trim()) {
      params.search = searchTerm;
    }
    return params;
  };
  const handleDelete = (id: number) => {
    if (confirm(t('confirmDeleteBlog'))) {
      router.delete(`/instructor/blogs/${id}`, {
        onSuccess: () => showToast(t('blogDeleted'), 'success'),
      });
    }
  };
  return (
    <Layout user={auth.user}>
      <Head title={t('myBlogs')} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-black dark:text-white">{t('myBlogs')}</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('manageYourBlogPosts')}</p>
          </div>
          <Link
            href="/instructor/blogs/create"
            className="flex items-center px-4 py-2 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors rounded"
          >
            <Plus className="w-5 h-5 mr-2" />
            {t('newBlog')}
          </Link>
        </div>
        <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={t('searchBlogs')}
                className="w-full pl-10 pr-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white rounded"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 cursor-pointer font-medium transition-colors rounded"
            >
              {t('searchButton')}
            </button>
          </div>
        </div>
        <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
              <thead className="bg-zinc-50 dark:bg-zinc-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{t('title')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{t('status')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{t('views')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{t('date')}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-black divide-y divide-zinc-200 dark:divide-zinc-800">
                {blogs.data.length > 0 ? (
                  blogs.data.map((blog) => (
                    <tr key={blog.blogId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                            <FileText className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-black dark:text-white">{blog.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs leading-5 font-semibold ${blog.isPublished ? 'bg-zinc-900 text-white dark:bg-white dark:text-black' : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200'} rounded`}>
                          {blog.isPublished ? t('published') : t('draft')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-400">
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {blog.viewCount}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-400">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/instructor/blogs/${blog.blogId}/edit`} className="text-black dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300">
                            <Edit className="w-5 h-5" />
                          </Link>
                          <button onClick={() => handleDelete(blog.blogId)} className="text-zinc-900 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300 cursor-pointer">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-zinc-500 dark:text-zinc-400">
                      {t('noBlogsFound')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {blogs.last_page > 1 && (
          <div className="mt-6 flex justify-center items-center gap-2">
            <button
              onClick={() => router.get('/instructor/blogs', buildPaginationParams(1), { preserveState: true })}
              disabled={blogs.current_page === 1}
              className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => router.get('/instructor/blogs', buildPaginationParams(blogs.current_page - 1), { preserveState: true })}
              disabled={blogs.current_page === 1}
              className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="px-4 py-2 font-medium transition-colors border bg-black dark:bg-white text-white dark:text-black border-black dark:border-white rounded">
              {blogs.current_page}
            </button>
            <button
              onClick={() => router.get('/instructor/blogs', buildPaginationParams(blogs.current_page + 1), { preserveState: true })}
              disabled={blogs.current_page === blogs.last_page}
              className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => router.get('/instructor/blogs', buildPaginationParams(blogs.last_page), { preserveState: true })}
              disabled={blogs.current_page === blogs.last_page}
              className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </Layout>
  )
}