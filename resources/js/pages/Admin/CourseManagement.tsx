import { Edit, Trash2, ToggleLeft, ToggleRight, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Filter } from 'lucide-react';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import AdminSidebar from '../../components/Admin/Sidebar';
import DataTable from '../../components/Admin/DataTable';
import ModalForm from '../../components/Admin/ModalForm';
import Layout from '../../components/Layout';
import useTranslation from '../../hooks/useTranslation';
interface Course {
  courseId: number;
  courseTitle: string;
  courseDescription: string;
  instructor: { userId: number; userName: string };
  category: { categoryId: number; categoryName: string };
  simulatedPrice: number;
  isPublished: boolean;
  createdAt: string;
}
interface Category {
  categoryId: number;
  categoryName: string;
}
interface Instructor {
  userId: number;
  userName: string;
}
interface Props {
  courses: {
    data: Course[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  categories: Category[];
  instructors: Instructor[];
  filters: {
    search?: string;
    category?: string;
    status?: string;
  };
  user: any;
}
export default function CourseManagement({ courses, categories, instructors, filters, user }: Props) {
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [categoryFilter, setCategoryFilter] = useState(filters.category || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');
  const handleSearch = () => {
    const params: { search?: string; category?: string; status?: string } = {};
    if (searchTerm && searchTerm.trim()) {
      params.search = searchTerm;
    }
    if (categoryFilter && categoryFilter.trim()) {
      params.category = categoryFilter;
    }
    if (statusFilter && statusFilter.trim()) {
      params.status = statusFilter;
    }
    router.get('/admin/courses', params, { preserveState: true });
  };
  const buildPaginationParams = (page: number) => {
    const params: any = { page };
    if (searchTerm && searchTerm.trim()) params.search = searchTerm;
    if (categoryFilter && categoryFilter.trim()) params.category = categoryFilter;
    if (statusFilter && statusFilter.trim()) params.status = statusFilter;
    return params;
  };
  const handleCreate = (data: Record<string, any>) => {
    router.post('/admin/courses', data, {
      preserveScroll: true,
      onSuccess: (page) => {
        const successMsg = (page.props as any).success || t('courseCreatedSuccess');
        setIsCreateModalOpen(false);
        showToast(successMsg, 'success');
      },
      onError: (errors) => {
        const errorMsg = Object.values(errors)[0] as string || t('courseCreateFailed');
        showToast(errorMsg, 'error');
      }
    });
  };
  const handleEdit = (data: Record<string, any>) => {
    if (!selectedCourse) return;
    router.post(`/admin/courses/${selectedCourse.courseId}`, {
      ...data,
      _method: 'PUT'
    }, {
      preserveScroll: true,
      onSuccess: (page) => {
        const successMsg = (page.props as any).success || t('courseUpdatedSuccess');
        setIsEditModalOpen(false);
        setSelectedCourse(null);
        showToast(successMsg, 'success');
      },
      onError: (errors) => {
        const errorMsg = Object.values(errors)[0] as string || t('courseUpdateFailed');
        showToast(errorMsg, 'error');
      }
    });
  };
  const handleDelete = (courseId: number) => {
    if (confirm(t('deleteCourseConfirm'))) {
      router.post(`/admin/courses/${courseId}`, {
        _method: 'DELETE'
      }, {
        onSuccess: (page) => {
          const successMsg = (page.props as any).success || t('courseDeletedSuccess');
          showToast(successMsg, 'success');
        },
        onError: (errors) => {
          const errorMsg = Object.values(errors)[0] as string || t('courseDeleteFailed');
          showToast(errorMsg, 'error');
        }
      });
    }
  };
  const handleTogglePublish = (course: Course) => {
    router.post(`/admin/courses/${course.courseId}`, {
      ...course,
      isPublished: !course.isPublished,
      categoryId: course.category.categoryId,
      instructorId: course.instructor.userId,
      _method: 'PUT'
    }, {
      onSuccess: (page) => {
        const successMsg = (page.props as any).success || (!course.isPublished ? t('coursePublishedSuccess') : t('courseUnpublishedSuccess'));
        showToast(successMsg, 'success');
      },
      onError: (errors) => {
        const errorMsg = Object.values(errors)[0] as string || t('courseStatusUpdateFailed');
        showToast(errorMsg, 'error');
      }
    });
  };
  const openEditModal = (course: Course) => {
    setSelectedCourse(course);
    setIsEditModalOpen(true);
  };
  const columns = [
    { key: 'courseTitle', label: t('courseTitleLabel'), sortable: true },
    {
      key: 'instructor',
      label: t('instructor'),
      render: (_: any, row: Course) => row.instructor.userName
    },
    {
      key: 'category',
      label: t('categoryLabel'),
      render: (_: any, row: Course) => row.category.categoryName
    },
    {
      key: 'simulatedPrice',
      label: t('simulatedPrice'),
      sortable: true,
      render: (value: number | string) => Number(value) === 0 ? t('free') : (value != null ? `$${Number(value).toFixed(2)}` : '$0.00')
    },
    {
      key: 'isPublished',
      label: t('status'),
      sortable: true,
      render: (value: boolean, row: Course) => (
        <button onClick={() => handleTogglePublish(row)} className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-medium ${value ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-900/30 dark:text-zinc-400'}`}>
          {value ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
          {value ? t('published') : t('draft')}
        </button>
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
      render: (_: any, row: Course) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEditModal(row)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(row.courseId)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-red-600 cursor-pointer">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];
  const handleExportAllCourses = async () => {
    try {
      const response = await fetch('/admin/courses/export', { credentials: 'same-origin', headers: { 'Accept': 'application/json' } });
      if (response.status === 419) { window.location.reload(); return; }
      if (!response.ok) throw new Error('Export Failed');
      const allCourses = await response.json();
      const exportColumns = columns.filter(col => col.key !== 'actions');
      const headers = exportColumns.map(col => col.label).join(',');
      const rows = allCourses.map((course: any) => exportColumns.map(col => {
        let value = course[col.key];
        if (col.key === 'createdAt' && value) {
          value = new Date(value).toLocaleDateString();
        } else if (col.key === 'simulatedPrice') {
          value = Number(course.simulatedPrice) === 0 ? t('free') : `$${Number(course.simulatedPrice).toFixed(2)}`;
        } else if (col.key === 'isPublished') {
          value = value ? t('published') : t('draft');
        } else if (col.key === 'instructor') {
          value = course.instructor?.userName || '';
        } else if (col.key === 'category') {
          value = course.category?.categoryName || '';
        }
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : (value ?? '');
      }).join(',')).join('\n');
      const csv = `${headers}\n${rows}`;
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Courses.csv';
      link.click();
      URL.revokeObjectURL(url);
      showToast(t('coursesExportedSuccess'), 'success');
    } catch (error) {
      showToast(t('exportCoursesFailed'), 'error');
    }
  };
  const formFields = [
    { name: 'courseTitle', label: t('courseTitleLabel'), type: 'text' as const, required: true },
    { name: 'courseDescription', label: t('descriptionLabel'), type: 'textarea' as const, required: true },
    {
      name: 'categoryId',
      label: t('categoryLabel'),
      type: 'select' as const,
      required: true,
      options: categories.map(cat => ({ value: cat.categoryId, label: cat.categoryName }))
    },
    {
      name: 'instructorId',
      label: t('instructor'),
      type: 'select' as const,
      required: true,
      options: instructors.map(inst => ({ value: inst.userId, label: inst.userName }))
    },
    { name: 'simulatedPrice', label: t('simulatedPrice'), type: 'number' as const, required: true, min: 0 },
    {
      name: 'isPublished',
      label: t('published'),
      type: 'select' as const,
      required: true,
      options: [
        { value: '1', label: t('published') },
        { value: '0', label: t('draft') }
      ]
    }
  ];
  return (
    <Layout user={user}>
      <Head title={t('courseManagement')} />
      <div className="flex bg-zinc-50 dark:bg-black min-h-screen">
        <AdminSidebar currentPath="/admin/courses" />
        <div className="flex-1">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-black dark:text-white mb-2">{t('courseManagement')}</h1>
                <p className="text-zinc-600 dark:text-zinc-400">{t('manageCoursesStatusSubtitle')}</p>
              </div>
              <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 cursor-pointer">
                <span className="text-xl">+</span>
                {t('addCourse')}
              </button>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} placeholder={t('searchCourses')} className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white" />
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white cursor-pointer">
                  <option value="">{t('allCategories')}</option>
                  {categories.map(cat => (
                    <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
                  ))}
                </select>
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
            <DataTable columns={columns} data={courses.data} exportable={true} keyField="courseId" onExport={handleExportAllCourses} />
            {courses.last_page > 1 && (
              <div className="mt-6 flex justify-center items-center gap-2">
                <button onClick={() => router.get('/admin/courses', buildPaginationParams(1), { preserveState: true, only: ['courses'] })} disabled={courses.current_page === 1} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label={t('firstPage')}>
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button onClick={() => router.get('/admin/courses', buildPaginationParams(courses.current_page - 1), { preserveState: true, only: ['courses'] })} disabled={courses.current_page === 1} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label={t('previousPage')}>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {courses.current_page > 2 && (
                  <span className="px-2 text-zinc-500 dark:text-zinc-400">...</span>
                )}
                {courses.current_page > 1 && (
                  <button onClick={() => router.get('/admin/courses', buildPaginationParams(courses.current_page - 1), { preserveState: true, only: ['courses'] })} className="px-4 py-2 font-medium transition-colors border bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white cursor-pointer">
                    {courses.current_page - 1}
                  </button>
                )}
                <button className="px-4 py-2 font-medium transition-colors border bg-black dark:bg-white text-white dark:text-black border-black dark:border-white">
                  {courses.current_page}
                </button>
                {courses.current_page < courses.last_page && (
                  <button onClick={() => router.get('/admin/courses', buildPaginationParams(courses.current_page + 1), { preserveState: true, only: ['courses'] })} className="px-4 py-2 font-medium transition-colors border bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white cursor-pointer">
                    {courses.current_page + 1}
                  </button>
                )}
                {courses.current_page < courses.last_page - 1 && (
                  <span className="px-2 text-zinc-500 dark:text-zinc-400">...</span>
                )}
                <button onClick={() => router.get('/admin/courses', buildPaginationParams(courses.current_page + 1), { preserveState: true, only: ['courses'] })} disabled={courses.current_page === courses.last_page} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label={t('nextPage')}>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button onClick={() => router.get('/admin/courses', buildPaginationParams(courses.last_page), { preserveState: true, only: ['courses'] })} disabled={courses.current_page === courses.last_page} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label={t('lastPage')}>
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            )}
            <ModalForm isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreate} title={t('createNewCourse')} fields={formFields} submitLabel={t('createCourse')} />
            <ModalForm isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedCourse(null); }} onSubmit={handleEdit} title={t('editCourse')} fields={formFields} initialData={selectedCourse ? { courseTitle: selectedCourse.courseTitle, courseDescription: selectedCourse.courseDescription, categoryId: selectedCourse.category.categoryId, instructorId: selectedCourse.instructor.userId, simulatedPrice: selectedCourse.simulatedPrice, isPublished: selectedCourse.isPublished } : {}} submitLabel={t('updateCourse')} />
          </div>
        </div>
      </div>
    </Layout>
  )
}