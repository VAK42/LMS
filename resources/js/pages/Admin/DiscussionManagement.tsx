import { Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminSidebar from '../../components/Admin/Sidebar';
import DataTable from '../../components/Admin/DataTable';
import Layout from '../../components/Layout';
import useTranslation from '../../hooks/useTranslation';
interface Discussion {
  discussionId: number;
  title: string;
  content: string;
  courseTitle: string;
  userName: string;
  createdAt: string;
  repliesCount: number;
}
interface Props {
  discussions: {
    data: Discussion[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  filters: {
    search?: string;
  };
  admin: any;
}
export default function DiscussionManagement({ discussions, filters, admin }: Props) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const handleSearch = () => {
    const params: { search?: string } = {};
    if (searchTerm && searchTerm.trim()) {
      params.search = searchTerm;
    }
    router.get('/admin/discussions', params, { preserveState: true });
  };
  const handleDelete = (discussionId: number) => {
    if (confirm(t('confirmDeleteDiscussion'))) {
      router.delete(`/admin/discussions/${discussionId}`, {
        onSuccess: () => showToast(t('discussionDeleted'), 'success'),
        onError: () => showToast(t('errorDeletingDiscussion'), 'error'),
      });
    }
  };
  const buildPaginationParams = (page: number) => {
    const params: { page: number; search?: string } = { page };
    if (searchTerm && searchTerm.trim()) {
      params.search = searchTerm;
    }
    return params;
  };
  const columns = [
    {
      key: 'title',
      label: t('topic'),
      render: (value: string, row: Discussion) => (
        <div>
          <div className="font-medium text-black dark:text-white">{value}</div>
          <div className="text-sm text-zinc-500 truncate max-w-xs">{row.content}</div>
        </div>
      )
    },
    { key: 'courseTitle', label: t('course') },
    { key: 'userName', label: t('author') },
    {
      key: 'repliesCount',
      label: t('replies'),
      render: (value: number) => (
        <span className="px-2 py-1 rounded text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
          {value}
        </span>
      )
    },
    {
      key: 'createdAt',
      label: t('date'),
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'actions',
      label: t('actions'),
      render: (_: any, row: Discussion) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDelete(row.discussionId)}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-red-600 cursor-pointer rounded-lg transition-colors"
            title={t('delete')}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];
  return (
    <Layout user={admin}>
      <Head title={t('manageDiscussions')} />
      <div className="flex bg-zinc-50 dark:bg-black min-h-screen">
        <AdminSidebar currentPath="/admin/discussions" />
        <div className="flex-1">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl text-black dark:text-white mb-2">{t('manageDiscussions')}</h1>
                <p className="text-zinc-600 dark:text-zinc-400">{t('manageDiscussions')}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder={t('searchDiscussionsPlaceholder')}
                    className="w-full pl-10 pr-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 cursor-pointer font-medium transition-colors"
                >
                  {t('searchButton')}
                </button>
              </div>
            </div>
            <DataTable columns={columns} data={discussions.data} keyField="discussionId" />
            {discussions.last_page > 1 && (
              <div className="mt-6 flex justify-center items-center gap-2">
                <button
                  onClick={() => router.get('/admin/discussions', buildPaginationParams(1), { preserveState: true, only: ['discussions'] })}
                  disabled={discussions.current_page === 1}
                  className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  aria-label={t('firstPage')}
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => router.get('/admin/discussions', buildPaginationParams(discussions.current_page - 1), { preserveState: true, only: ['discussions'] })}
                  disabled={discussions.current_page === 1}
                  className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  aria-label={t('previousPage')}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {discussions.current_page > 2 && (
                  <span className="px-2 text-zinc-500 dark:text-zinc-400">...</span>
                )}
                {discussions.current_page > 1 && (
                  <button
                    onClick={() => router.get('/admin/discussions', buildPaginationParams(discussions.current_page - 1), { preserveState: true, only: ['discussions'] })}
                    className="px-4 py-2 font-medium transition-colors border bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white cursor-pointer"
                  >
                    {discussions.current_page - 1}
                  </button>
                )}
                <button className="px-4 py-2 font-medium transition-colors border bg-black dark:bg-white text-white dark:text-black border-black dark:border-white">
                  {discussions.current_page}
                </button>
                {discussions.current_page < discussions.last_page && (
                  <button
                    onClick={() => router.get('/admin/discussions', buildPaginationParams(discussions.current_page + 1), { preserveState: true, only: ['discussions'] })}
                    className="px-4 py-2 font-medium transition-colors border bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white cursor-pointer"
                  >
                    {discussions.current_page + 1}
                  </button>
                )}
                {discussions.current_page < discussions.last_page - 1 && (
                  <span className="px-2 text-zinc-500 dark:text-zinc-400">...</span>
                )}
                <button
                  onClick={() => router.get('/admin/discussions', buildPaginationParams(discussions.current_page + 1), { preserveState: true, only: ['discussions'] })}
                  disabled={discussions.current_page === discussions.last_page}
                  className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  aria-label={t('nextPage')}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => router.get('/admin/discussions', buildPaginationParams(discussions.last_page), { preserveState: true, only: ['discussions'] })}
                  disabled={discussions.current_page === discussions.last_page}
                  className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  aria-label={t('lastPage')}
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}