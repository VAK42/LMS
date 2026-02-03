import { Calendar, User, Eye, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, FileText } from 'lucide-react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
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
  const { auth } = usePage().props as any;
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const handleSearch = () => {
    const params: { search?: string } = {};
    if (searchTerm && searchTerm.trim()) {
      params.search = searchTerm;
    }
    router.get('/blogs', params, { preserveState: true });
  };
  const buildPaginationParams = (page: number) => {
    const params: { page: number; search?: string } = { page };
    if (searchTerm && searchTerm.trim()) {
      params.search = searchTerm;
    }
    return params;
  };
  return (
    <Layout user={auth?.user}>
      <Head title={t('blog')} />
      <div className="bg-white dark:bg-black min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif text-green-950 dark:text-white sm:text-5xl">{t('latestArticles')}</h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-zinc-500 dark:text-zinc-400">{t('blogSubtitle')}</p>
          </div>
          <div className="max-w-2xl mx-auto mb-16">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} placeholder={t('searchBlogs')} className="w-full pl-10 pr-4 py-3 rounded border border-green-950 dark:border-white bg-white dark:bg-zinc-900 text-green-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-950 dark:focus:ring-white transition-shadow" />
              </div>
              <button onClick={handleSearch} className="px-8 py-3 rounded bg-green-950 dark:bg-white text-white dark:text-green-950 font-medium hover:bg-white hover:text-green-950 hover:border-green-950 dark:hover:bg-green-950 dark:hover:text-white border border-transparent transition-colors cursor-pointer">
                {t('searchButton')}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {blogs.data.map((blog) => (
              <div key={blog.blogId} className="flex flex-col bg-white dark:bg-zinc-900 border border-green-950 dark:border-white hover:border-green-800 dark:hover:border-zinc-200 transition-colors duration-300 overflow-hidden group rounded">
                <div className="flex-shrink-0 relative h-48 w-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border-b border-green-950 dark:border-white">
                  {blog.thumbnail ? (
                    <img className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" src={`/storage/${blog.thumbnail}`} alt={blog.title} />
                  ) : (
                    <div className="bg-white dark:bg-zinc-900 w-full h-full flex items-center justify-center grayscale">
                      <FileText className="w-16 h-16 text-zinc-300 dark:text-zinc-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-400 mb-3 space-x-4">
                      <div className="flex items-center">
                        <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4" />
                        <p>{new Date(blog.publishedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center">
                        <Eye className="flex-shrink-0 mr-1.5 h-4 w-4" />
                        <p>{blog.viewCount}</p>
                      </div>
                    </div>
                    <Link href={`/blogs/${blog.slug}`} className="block mt-2">
                      <h3 className="text-xl font-serif text-green-950 dark:text-white hover:underline transition-all line-clamp-2">{blog.title}</h3>
                      <div className="mt-3 text-base text-zinc-500 dark:text-zinc-400 line-clamp-3" dangerouslySetInnerHTML={{ __html: blog.content.replace(/<[^>]+>/g, '') }} />
                    </Link>
                  </div>
                  <div className="mt-6 flex items-center">
                    <div className="flex-shrink-0">
                      <span className="sr-only">{blog.instructor.userName}</span>
                      <div className="h-10 w-10 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-green-950 dark:border-white rounded-full">
                        <User className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-950 dark:text-white">{blog.instructor.userName}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {blogs.last_page > 1 && (
            <div className="flex justify-center items-center gap-2">
              <button onClick={() => router.get('/blogs', buildPaginationParams(1), { preserveState: true })} disabled={blogs.current_page === 1} className="px-3 py-2 border border-green-950 dark:border-white text-green-950 dark:text-white hover:bg-green-950 hover:text-white dark:hover:bg-white dark:hover:text-green-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded">
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button onClick={() => router.get('/blogs', buildPaginationParams(blogs.current_page - 1), { preserveState: true })} disabled={blogs.current_page === 1} className="px-3 py-2 border border-green-950 dark:border-white text-green-950 dark:text-white hover:bg-green-950 hover:text-white dark:hover:bg-white dark:hover:text-green-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="px-4 py-2 font-medium transition-colors border bg-green-950 dark:bg-white text-white dark:text-green-950 border-green-950 dark:border-white rounded cursor-pointer">
                {blogs.current_page}
              </button>
              <button onClick={() => router.get('/blogs', buildPaginationParams(blogs.current_page + 1), { preserveState: true })} disabled={blogs.current_page === blogs.last_page} className="px-3 py-2 border border-green-950 dark:border-white text-green-950 dark:text-white hover:bg-green-950 hover:text-white dark:hover:bg-white dark:hover:text-green-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded">
                <ChevronRight className="w-4 h-4" />
              </button>
              <button onClick={() => router.get('/blogs', buildPaginationParams(blogs.last_page), { preserveState: true })} disabled={blogs.current_page === blogs.last_page} className="px-3 py-2 border border-green-950 dark:border-white text-green-950 dark:text-white hover:bg-green-950 hover:text-white dark:hover:bg-white dark:hover:text-green-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded">
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          )}
          {blogs.data.length === 0 && (
            <div className="text-center py-20">
              <FileText className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-green-950 dark:text-white mb-2">{t('noBlogsFound')}</h3>
              <p className="text-zinc-500 dark:text-zinc-400">{t('tryDifferentSearch')}</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}