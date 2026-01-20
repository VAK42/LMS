import { Plus, Edit, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Filter } from 'lucide-react';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import AdminSidebar from '../../components/Admin/Sidebar';
import DataTable from '../../components/Admin/DataTable';
import ModalForm from '../../components/Admin/ModalForm';
import Layout from '../../components/Layout';
import useTranslation from '../../hooks/useTranslation';
interface Category {
  categoryId: number;
  categoryName: string;
  categoryDescription: string | null;
  coursesCount: number;
}
interface Props {
  categories: {
    data: Category[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  filters: {
    search?: string;
  };
  user: any;
}
export default function CategoryManagement({ categories, filters, user }: Props) {
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const handleSearch = () => {
    const params: { search?: string } = {};
    if (searchTerm && searchTerm.trim()) params.search = searchTerm;
    router.get('/admin/categories', params, { preserveState: true });
  };
  const buildPaginationParams = (page: number) => {
    const params: any = { page };
    if (searchTerm && searchTerm.trim()) params.search = searchTerm;
    return params;
  };
  const handleCreate = (data: Record<string, any>) => {
    router.post('/admin/categories', data, {
      onSuccess: (page) => {
        const successMsg = (page.props as any).success || t('categoryCreatedSuccess');
        setIsCreateModalOpen(false);
        showToast(successMsg, 'success');
      },
      onError: (errors) => {
        const errorMsg = Object.values(errors)[0] as string || t('categoryCreateFailed');
        showToast(errorMsg, 'error');
      }
    });
  };
  const handleEdit = (data: Record<string, any>) => {
    if (!selectedCategory) return;
    router.post(`/admin/categories/${selectedCategory.categoryId}`, { ...data, _method: 'PUT' }, {
      onSuccess: (page) => {
        const successMsg = (page.props as any).success || t('categoryUpdatedSuccess');
        setIsEditModalOpen(false);
        setSelectedCategory(null);
        showToast(successMsg, 'success');
      },
      onError: (errors) => {
        const errorMsg = Object.values(errors)[0] as string || t('categoryUpdateFailed');
        showToast(errorMsg, 'error');
      }
    });
  };
  const handleDelete = (category: Category) => {
    if (category.coursesCount > 0) {
      showToast(category.coursesCount === 1 ? t('cannotDeleteCategoryOne') : t('cannotDeleteCategoryWithCourses', { count: category.coursesCount.toString() }), 'error');
      return;
    }
    if (confirm(t('deleteCategoryConfirm'))) {
      router.post(`/admin/categories/${category.categoryId}`, { _method: 'DELETE' }, {
        onSuccess: (page) => {
          const successMsg = (page.props as any).success || t('categoryDeletedSuccess');
          showToast(successMsg, 'success');
        },
        onError: (errors) => {
          const errorMsg = Object.values(errors)[0] as string || t('categoryDeleteFailed');
          showToast(errorMsg, 'error');
        }
      });
    }
  };
  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };
  const columns = [
    { key: 'categoryName', label: t('categoryNameLabel'), sortable: true },
    {
      key: 'categoryDescription',
      label: t('descriptionLabel'),
      render: (value: string | null) => value || t('noDescription')
    },
    {
      key: 'coursesCount',
      label: t('courses'),
      sortable: true,
      render: (value: number) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded text-sm font-medium">
          {value} {value !== 1 ? t('courses') : t('course')}
        </span>
      )
    },
    {
      key: 'actions',
      label: t('actions'),
      render: (_: any, row: Category) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEditModal(row)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(row)} disabled={row.coursesCount > 0} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-red-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];
  const handleExportAllCategories = async () => {
    try {
      const response = await fetch('/admin/categories/export', { credentials: 'same-origin', headers: { 'Accept': 'application/json' } });
      if (response.status === 419) { window.location.reload(); return; }
      if (!response.ok) throw new Error(t('exportFailed'));
      const allCategories = await response.json();
      const exportColumns = columns.filter(col => col.key !== 'actions');
      const headers = exportColumns.map(col => col.label).join(',');
      const rows = allCategories.map((category: any) => exportColumns.map(col => {
        let value = category[col.key];
        if (col.key === 'categoryDescription') {
          value = value || t('noDescription');
        } else if (col.key === 'coursesCount') {
          value = `${value} ${value !== 1 ? t('courses') : t('course')}`;
        }
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : (value ?? '');
      }).join(',')).join('\n');
      const csv = `${headers}\n${rows}`;
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${t('categoriesExportFilename')}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      showToast(t('categoriesExportedSuccess'), 'success');
    } catch (error) {
      showToast(t('exportCategoriesFailed'), 'error');
    }
  };
  const formFields = [
    { name: 'categoryName', label: t('categoryNameLabel'), type: 'text' as const, required: true },
    { name: 'categoryDescription', label: t('descriptionLabel'), type: 'textarea' as const, required: false }
  ];
  return (
    <Layout user={user}>
      <Head title={t('categoryManagement')} />
      <div className="flex bg-zinc-50 dark:bg-black min-h-screen">
        <AdminSidebar currentPath="/admin/categories" />
        <div className="flex-1">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl text-black dark:text-white mb-2">{t('categoryManagement')}</h1>
                <p className="text-zinc-600 dark:text-zinc-400">{t('manageCategoriesSubtitle')}</p>
              </div>
              <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 cursor-pointer">
                <Plus className="w-5 h-5" />
                {t('addCategory')}
              </button>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} placeholder={t('searchCategories')} className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white" />
                </div>
                <button onClick={handleSearch} className="flex items-center gap-2 px-6 py-2 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 cursor-pointer">
                  <Filter className="w-4 h-4" />
                  {t('filter')}
                </button>
              </div>
            </div>
            <DataTable columns={columns} data={categories.data} exportable={true} keyField="categoryId" onExport={handleExportAllCategories} />
            {categories.last_page > 1 && (
              <div className="mt-6 flex justify-center items-center gap-2">
                <button onClick={() => router.get('/admin/categories', buildPaginationParams(1), { preserveState: true, only: ['categories'] })} disabled={categories.current_page === 1} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label={t('firstPage')}>
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button onClick={() => router.get('/admin/categories', buildPaginationParams(categories.current_page - 1), { preserveState: true, only: ['categories'] })} disabled={categories.current_page === 1} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label={t('previousPage')}>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {categories.current_page > 2 && (
                  <span className="px-2 text-zinc-500 dark:text-zinc-400">...</span>
                )}
                {categories.current_page > 1 && (
                  <button onClick={() => router.get('/admin/categories', buildPaginationParams(categories.current_page - 1), { preserveState: true, only: ['categories'] })} className="px-4 py-2 font-medium transition-colors border bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white cursor-pointer">
                    {categories.current_page - 1}
                  </button>
                )}
                <button className="px-4 py-2 font-medium transition-colors border bg-black dark:bg-white text-white dark:text-black border-black dark:border-white">
                  {categories.current_page}
                </button>
                {categories.current_page < categories.last_page && (
                  <button onClick={() => router.get('/admin/categories', buildPaginationParams(categories.current_page + 1), { preserveState: true, only: ['categories'] })} className="px-4 py-2 font-medium transition-colors border bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white cursor-pointer">
                    {categories.current_page + 1}
                  </button>
                )}
                {categories.current_page < categories.last_page - 1 && (
                  <span className="px-2 text-zinc-500 dark:text-zinc-400">...</span>
                )}
                <button onClick={() => router.get('/admin/categories', buildPaginationParams(categories.current_page + 1), { preserveState: true, only: ['categories'] })} disabled={categories.current_page === categories.last_page} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label={t('nextPage')}>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button onClick={() => router.get('/admin/categories', buildPaginationParams(categories.last_page), { preserveState: true, only: ['categories'] })} disabled={categories.current_page === categories.last_page} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label={t('lastPage')}>
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            )}
            <ModalForm isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreate} title={t('createNewCategory')} fields={formFields} submitLabel={t('createCategory')} />
            <ModalForm isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedCategory(null); }} onSubmit={handleEdit} title={t('editCategory')} fields={formFields} initialData={selectedCategory ? { categoryName: selectedCategory.categoryName, categoryDescription: selectedCategory.categoryDescription || '' } : {}} submitLabel={t('updateCategory')} />
          </div>
        </div>
      </div>
    </Layout>
  )
}