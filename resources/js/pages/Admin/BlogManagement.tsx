import { Trash2, ToggleLeft, ToggleRight, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Filter, BookOpen, Eye, Edit } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminSidebar from '../../components/Admin/Sidebar';
import DataTable from '../../components/Admin/DataTable';
import ModalForm from '../../components/Admin/ModalForm';
import Layout from '../../components/Layout';
import useTranslation from '../../hooks/useTranslation';
interface Blog {
  blogId: number;
  title: string;
  instructor: { userId: number; userName: string };
  content?: string;
  thumbnail: string | null;
  isPublished: boolean;
  viewCount: number;
  createdAt: string;
}
interface Instructor {
  userId: number;
  userName: string;
}
interface Props {
  blogs: {
    data: Blog[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  instructors: Instructor[];
  filters: {
    search?: string;
    status?: string;
  };
  user: any;
}
export default function BlogManagement({ blogs, instructors, filters, user }: Props) {
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const handleSearch = () => {
    const params: { search?: string; status?: string } = {};
    if (searchTerm && searchTerm.trim()) {
      params.search = searchTerm;
    }
    if (statusFilter && statusFilter.trim()) {
      params.status = statusFilter;
    }
    router.get('/admin/blogs', params, { preserveState: true });
  };
  const buildPaginationParams = (page: number) => {
    const params: any = { page };
    if (searchTerm && searchTerm.trim()) params.search = searchTerm;
    if (statusFilter && statusFilter.trim()) params.status = statusFilter;
    return params;
  };
  const handleDelete = (blogId: number) => {
    if (confirm(t('deleteBlogConfirm'))) {
      router.post(`/admin/blogs/${blogId}`, {
        _method: 'DELETE'
      }, {
        onSuccess: (page) => {
          const successMsg = (page.props as any).success || t('blogDeletedSuccess');
          showToast(successMsg, 'success');
        },
        onError: (errors) => {
          const errorMsg = Object.values(errors)[0] as string || t('blogDeleteFailed');
          showToast(errorMsg, 'error');
        }
      });
    }
  };
  const handleCreate = (data: any) => {
    router.post('/admin/blogs', data, {
      onSuccess: (page) => {
        setIsCreateModalOpen(false);
        const successMsg = (page.props as any).success || t('blogCreatedSuccess');
        showToast(successMsg, 'success');
      },
      onError: (errors) => {
        const errorMsg = Object.values(errors)[0] as string || t('blogCreateFailed');
        showToast(errorMsg, 'error');
      }
    });
  };
  const handleEdit = (data: any) => {
    if (!selectedBlog) return;
    router.post(`/admin/blogs/${selectedBlog.blogId}`, {
      ...data,
      _method: 'PUT'
    }, {
      onSuccess: (page) => {
        setIsEditModalOpen(false);
        setSelectedBlog(null);
        const successMsg = (page.props as any).success || t('blogUpdatedSuccess');
        showToast(successMsg, 'success');
      },
      onError: (errors) => {
        const errorMsg = Object.values(errors)[0] as string || t('blogUpdateFailed');
        showToast(errorMsg, 'error');
      }
    });
  };
  const openEditModal = (blog: Blog) => {
    setSelectedBlog(blog);
    setIsEditModalOpen(true);
  };
  const handleExportAll = async () => {
    try {
      const response = await fetch('/admin/blogs/export', { credentials: 'same-origin', headers: { 'Accept': 'application/json' } });
      if (response.status === 419) { window.location.reload(); return; }
      if (!response.ok) throw new Error(t('exportFailed'));
      const allBlogs = await response.json();
      const exportColumns = columns.filter(col => col.key !== 'actions' && col.key !== 'thumbnail');
      const headers = exportColumns.map(col => col.label).join(',');
      const rows = allBlogs.map((blog: any) => exportColumns.map(col => {
        let value = blog[col.key];
        if (col.key === 'createdAt' && value) {
          value = new Date(value).toLocaleDateString();
        } else if (col.key === 'isPublished') {
          value = value ? t('published') : t('draft');
        } else if (col.key === 'instructor') {
          value = blog.instructor?.userName || '';
        }
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : (value ?? '');
      }).join(',')).join('\n');
      const csv = `${headers}\n${rows}`;
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${t('blogsExportFilename')}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      showToast(t('blogsExportedSuccess'), 'success');
    } catch (error) {
      showToast(t('exportBlogsFailed'), 'error');
    }
  };
  const columns = [
    {
      key: 'thumbnail',
      label: t('thumbnail'),
      render: (value: string | null) => (
        <div className="w-16 h-10 rounded overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          {value ? (
            <img src={`/storage/${value}`} alt={t('thumbnail')} className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-zinc-300 dark:text-zinc-600">
              <BookOpen className="w-4 h-4" />
            </div>
          )}
        </div>
      )
    },
    { key: 'title', label: t('title'), sortable: true },
    {
      key: 'instructor',
      label: t('author'),
      render: (_: any, row: Blog) => row.instructor.userName
    },
    {
      key: 'viewCount',
      label: t('views'),
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center gap-1 text-zinc-500">
          <Eye className="w-4 h-4" /> {value}
        </div>
      )
    },
    {
      key: 'isPublished',
      label: t('status'),
      sortable: true,
      render: (value: boolean) => (
        <span className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-medium ${value ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-900/30 dark:text-zinc-400'}`}>
          {value ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
          {value ? t('published') : t('draft')}
        </span>
      )
    },
    {
      key: 'createdAt',
      label: t('created'),
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'actions',
      label: t('actions'),
      render: (_: any, row: Blog) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEditModal(row)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(row.blogId)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-red-600 cursor-pointer">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];
  const formFields = [
    { name: 'title', label: t('title'), type: 'text' as const, required: true },
    { name: 'content', label: t('content'), type: 'editor' as const, required: true },
    {
      name: 'instructorId',
      label: t('instructor'),
      type: 'select' as const,
      required: true,
      options: instructors.map(inst => ({ value: inst.userId, label: inst.userName }))
    },
    {
      name: 'isPublished',
      label: t('status'),
      type: 'select' as const,
      required: true,
      options: [
        { value: '1', label: t('published') },
        { value: '0', label: t('draft') }
      ]
    },
    { name: 'thumbnail', label: t('thumbnail'), type: 'image' as const, required: false }
  ];
  return (
    <Layout user={user}>
      <Head title={t('blogManagement')} />
      <div className="flex bg-zinc-50 dark:bg-black min-h-screen">
        <AdminSidebar currentPath="/admin/blogs" />
        <div className="flex-1">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl text-black dark:text-white mb-2">{t('blogManagement')}</h1>
                <p className="text-zinc-600 dark:text-zinc-400">{t('manageBlogsSubtitle')}</p>
              </div>
              <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 cursor-pointer">
                <span className="text-xl">+</span>
                {t('addBlog')}
              </button>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} placeholder={t('searchBlogs')} className="col-span-1 md:col-span-2 px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white" />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white cursor-pointer">
                  <option value="">{t('allStatus')}</option>
                  <option value="published">{t('published')}</option>
                  <option value="draft">{t('draft')}</option>
                </select>
                <button onClick={handleSearch} className="flex items-center gap-2 px-6 py-2 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 cursor-pointer">
                  <Filter className="w-4 h-4" />
                  {t('filter')}
                </button>
              </div>
            </div>
            <DataTable columns={columns} data={blogs.data} exportable={true} keyField="blogId" onExport={handleExportAll} />
            {blogs.last_page > 1 && (
              <div className="mt-6 flex justify-center items-center gap-2">
                <button onClick={() => router.get('/admin/blogs', buildPaginationParams(1), { preserveState: true, only: ['blogs'] })} disabled={blogs.current_page === 1} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label={t('firstPage')}>
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button onClick={() => router.get('/admin/blogs', buildPaginationParams(blogs.current_page - 1), { preserveState: true, only: ['blogs'] })} disabled={blogs.current_page === 1} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label={t('previousPage')}>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {blogs.current_page > 2 && (
                  <span className="px-2 text-zinc-500 dark:text-zinc-400">...</span>
                )}
                {blogs.current_page > 1 && (
                  <button onClick={() => router.get('/admin/blogs', buildPaginationParams(blogs.current_page - 1), { preserveState: true, only: ['blogs'] })} className="px-4 py-2 font-medium transition-colors border bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white cursor-pointer">
                    {blogs.current_page - 1}
                  </button>
                )}
                <button className="px-4 py-2 font-medium transition-colors border bg-black dark:bg-white text-white dark:text-black border-black dark:border-white">
                  {blogs.current_page}
                </button>
                {blogs.current_page < blogs.last_page && (
                  <button onClick={() => router.get('/admin/blogs', buildPaginationParams(blogs.current_page + 1), { preserveState: true, only: ['blogs'] })} className="px-4 py-2 font-medium transition-colors border bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white cursor-pointer">
                    {blogs.current_page + 1}
                  </button>
                )}
                {blogs.current_page < blogs.last_page - 1 && (
                  <span className="px-2 text-zinc-500 dark:text-zinc-400">...</span>
                )}
                <button onClick={() => router.get('/admin/blogs', buildPaginationParams(blogs.current_page + 1), { preserveState: true, only: ['blogs'] })} disabled={blogs.current_page === blogs.last_page} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label={t('nextPage')}>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button onClick={() => router.get('/admin/blogs', buildPaginationParams(blogs.last_page), { preserveState: true, only: ['blogs'] })} disabled={blogs.current_page === blogs.last_page} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label={t('lastPage')}>
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            )}
            <ModalForm isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreate} title={t('addBlog')} fields={formFields} submitLabel={t('createBlog')} />
            <ModalForm isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedBlog(null); }} onSubmit={handleEdit} title={t('editBlog')} fields={formFields} initialData={selectedBlog ? { title: selectedBlog.title, content: selectedBlog.content, instructorId: selectedBlog.instructor.userId, isPublished: selectedBlog.isPublished ? '1' : '0', thumbnail: selectedBlog.thumbnail } : {}} submitLabel={t('updateBlog')} />
          </div>
        </div>
      </div>
    </Layout>
  )
}