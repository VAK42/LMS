import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Edit, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Filter } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import Layout from '../../components/Layout';
import AdminSidebar from '../../components/Admin/Sidebar';
import DataTable from '../../components/Admin/DataTable';
import ModalForm from '../../components/Admin/ModalForm';
interface Category {
  categoryId: number;
  categoryName: string;
  categoryDescription: string | null;
  courses_count: number;
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
      onSuccess: () => {
        setIsCreateModalOpen(false);
        showToast('Category Created Successfully!', 'success');
      },
      onError: () => showToast('Failed To Create Category! Please Try Again!', 'error')
    });
  };
  const handleEdit = (data: Record<string, any>) => {
    if (!selectedCategory) return;
    router.post(`/admin/categories/${selectedCategory.categoryId}`, { ...data, _method: 'PUT' }, {
      onSuccess: () => {
        setIsEditModalOpen(false);
        setSelectedCategory(null);
        showToast('Category Updated Successfully!', 'success');
      },
      onError: () => showToast('Failed To Update Category! Please Try Again!', 'error')
    });
  };
  const handleDelete = (category: Category) => {
    if (category.courses_count > 0) {
      showToast(`Cannot Delete Category With ${category.courses_count} Courses!`, 'error');
      return;
    }
    if (confirm('Are You Sure You Want To Delete This Category?')) {
      router.post(`/admin/categories/${category.categoryId}`, { _method: 'DELETE' }, {
        onSuccess: () => showToast('Category Deleted Successfully!', 'success'),
        onError: () => showToast('Failed To Delete Category! Please Try Again!', 'error')
      });
    }
  };
  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };
  const columns = [
    { key: 'categoryName', label: 'Category Name', sortable: true },
    {
      key: 'categoryDescription',
      label: 'Description',
      render: (value: string | null) => value || 'No Description'
    },
    {
      key: 'courses_count',
      label: 'Courses',
      sortable: true,
      render: (value: number) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded text-sm font-medium">
          {value} Course{value !== 1 ? 's' : ''}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: Category) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEditModal(row)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(row)} disabled={row.courses_count > 0} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-red-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];
  const formFields = [
    { name: 'categoryName', label: 'Category Name', type: 'text' as const, required: true },
    { name: 'categoryDescription', label: 'Description', type: 'textarea' as const, required: false }
  ];
  return (
    <Layout user={user}>
      <Head title="Category Management" />
      <div className="flex bg-zinc-50 dark:bg-black min-h-screen">
        <AdminSidebar currentPath="/admin/categories" />
        <div className="flex-1">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-black dark:text-white mb-2">Category Management</h1>
                <p className="text-zinc-600 dark:text-zinc-400">Manage Course Categories</p>
              </div>
              <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200">
                <Plus className="w-5 h-5" />
                Add Category
              </button>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} placeholder="Search Categories..." className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white" />
                </div>
                <button onClick={handleSearch} className="flex items-center gap-2 px-6 py-2 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 cursor-pointer">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>
            </div>
            <DataTable columns={columns} data={categories.data} exportable={true} keyField="categoryId" />
            {categories.last_page > 1 && (
              <div className="mt-6 flex justify-center items-center gap-2">
                <button onClick={() => router.get('/admin/categories', buildPaginationParams(1), { preserveState: true, only: ['categories'] })} disabled={categories.current_page === 1} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label="First Page">
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button onClick={() => router.get('/admin/categories', buildPaginationParams(categories.current_page - 1), { preserveState: true, only: ['categories'] })} disabled={categories.current_page === 1} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label="Previous">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="px-4 py-2 font-medium border bg-black dark:bg-white text-white dark:text-black">{categories.current_page}</button>
                <button onClick={() => router.get('/admin/categories', buildPaginationParams(categories.current_page + 1), { preserveState: true, only: ['categories'] })} disabled={categories.current_page === categories.last_page} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label="Next">
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button onClick={() => router.get('/admin/categories', buildPaginationParams(categories.last_page), { preserveState: true, only: ['categories'] })} disabled={categories.current_page === categories.last_page} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label="Last">
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            )}
            <ModalForm isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreate} title="Create New Category" fields={formFields} submitLabel="Create Category" />
            <ModalForm isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedCategory(null); }} onSubmit={handleEdit} title="Edit Category" fields={formFields} initialData={selectedCategory ? { categoryName: selectedCategory.categoryName, categoryDescription: selectedCategory.categoryDescription } : {}} submitLabel="Update Category" />
          </div>
        </div>
      </div>
    </Layout>
  )
}