import { Plus, Edit, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Filter } from 'lucide-react';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import AdminSidebar from '../../components/Admin/Sidebar';
import DataTable from '../../components/Admin/DataTable';
import ModalForm from '../../components/Admin/ModalForm';
import Layout from '../../components/Layout';
import useTranslation from '../../hooks/useTranslation';
interface Enrollment {
  userId: number;
  courseId: number;
  user: { userId: number; userName: string };
  course: { courseId: number; courseTitle: string };
  completionPercent: number;
  enrollmentDate: string;
  isPaid: boolean;
}
interface User {
  userId: number;
  userName: string;
}
interface Course {
  courseId: number;
  courseTitle: string;
  completedAt: string | null;
  isPaid: boolean;
}
interface Filters {
  search?: string;
  payment?: string;
}
interface Props {
  enrollments: {
    data: Enrollment[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  users: User[];
  courses: Course[];
  filters: Filters;
  user: any;
}
export default function EnrollmentManagement({ enrollments, users, courses, filters, user }: Props) {
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [paymentFilter, setPaymentFilter] = useState(filters.payment || '');
  const handleSearch = () => {
    const params: { search?: string; payment?: string } = {};
    if (searchTerm && searchTerm.trim()) {
      params.search = searchTerm;
    }
    if (paymentFilter && paymentFilter.trim()) {
      params.payment = paymentFilter;
    }
    router.get('/admin/enrollments', params, { preserveState: true });
  };
  const buildPaginationParams = (page: number) => {
    const params: { page: number; search?: string; payment?: string } = { page };
    if (searchTerm && searchTerm.trim()) params.search = searchTerm;
    if (paymentFilter && paymentFilter.trim()) params.payment = paymentFilter;
    return params;
  };
  const handleCreate = (data: Record<string, any>) => {
    const payload = {
      ...data,
      isPaid: data.isPaid === '1' || data.isPaid === 'true' || data.isPaid === true,
      completionPercent: parseFloat(data.completionPercent) || 0
    };
    router.post('/admin/enrollments', payload, {
      preserveState: true,
      onSuccess: (page: any) => {
        setIsCreateModalOpen(false);
        showToast(page.props.success || t('enrollmentCreatedSuccess'), 'success');
      },
      onError: (errors) => {
        const errorMsg = Object.values(errors)[0] as string || t('enrollmentCreateFailed');
        showToast(errorMsg, 'error');
      }
    });
  };
  const handleEdit = (data: Record<string, any>) => {
    if (!selectedEnrollment) return;
    const payload = {
      isPaid: data.isPaid === '1' || data.isPaid === 'true' || data.isPaid === true,
      completionPercent: parseFloat(data.completionPercent) || 0,
      _method: 'PUT'
    };
    router.post(`/admin/enrollments/${selectedEnrollment.userId}/${selectedEnrollment.courseId}`, payload, {
      onSuccess: (page) => {
        const successMsg = (page.props as any).success || t('enrollmentUpdatedSuccess');
        setIsEditModalOpen(false);
        setSelectedEnrollment(null);
        showToast(successMsg, 'success');
      },
      onError: (errors) => {
        const errorMsg = Object.values(errors)[0] as string || t('enrollmentUpdateFailed');
        showToast(errorMsg, 'error');
      }
    });
  };
  const handleDelete = (userId: number, courseId: number) => {
    if (confirm(t('deleteEnrollmentConfirm'))) {
      router.post(`/admin/enrollments/${userId}/${courseId}`, {
        _method: 'DELETE'
      }, {
        onSuccess: (page) => {
          const successMsg = (page.props as any).success || t('enrollmentDeletedSuccess');
          showToast(successMsg, 'success');
        },
        onError: (errors) => {
          const errorMsg = Object.values(errors)[0] as string || t('enrollmentDeleteFailed');
          showToast(errorMsg, 'error');
        }
      });
    }
  };
  const openEditModal = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setIsEditModalOpen(true);
  };
  const handleExportAllEnrollments = async () => {
    try {
      const response = await fetch('/admin/enrollments/export', { credentials: 'same-origin', headers: { 'Accept': 'application/json' } });
      if (response.status === 419) { window.location.reload(); return; }
      if (!response.ok) throw new Error(t('exportFailed'));
      const allEnrollments = await response.json();
      const exportColumns = columns.filter(col => col.key !== 'actions');
      const headers = exportColumns.map(col => col.label).join(',');
      const rows = allEnrollments.map((enrollment: Enrollment) => exportColumns.map(col => {
        let value: any;
        if (col.key === 'user') value = enrollment.user.userName;
        else if (col.key === 'course') value = enrollment.course.courseTitle;
        else if (col.key === 'enrollmentDate') value = new Date(enrollment.enrollmentDate).toLocaleDateString();
        else if (col.key === 'completionPercent') value = `${enrollment.completionPercent}%`;
        else if (col.key === 'isPaid') value = enrollment.isPaid ? t('paid') : t('unpaid');
        else value = enrollment[col.key as keyof Enrollment];
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : (value ?? '');
      }).join(',')).join('\n');
      const csv = `${headers}\n${rows}`;
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${t('enrollmentsExportFilename')}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      showToast(t('enrollmentsExportedSuccess'), 'success');
    } catch (error) {
      showToast(t('exportEnrollmentsFailed'), 'error');
    }
  };
  const columns = [
    {
      key: 'user',
      label: t('student'),
      render: (_: any, row: Enrollment) => row.user.userName
    },
    {
      key: 'course',
      label: t('course'),
      render: (_: any, row: Enrollment) => (
        <p className="font-medium text-black dark:text-white">{row.course.courseTitle}</p>
      )
    },
    {
      key: 'isPaid',
      label: t('status'),
      sortable: true,
      render: (value: boolean) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${value ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
          {value ? t('paid') : t('unpaid')}
        </span>
      )
    },
    {
      key: 'completionPercent',
      label: t('progress'),
      sortable: true,
      render: (value: number) => (
        <div className="w-full">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{value || 0}%</span>
          </div>
          <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${value || 0}%` }}></div>
          </div>
        </div>
      )
    },
    {
      key: 'enrollmentDate',
      label: t('enrolled'),
      sortable: true,
      render: (value: string) => value ? new Date(value).toLocaleDateString() : t('notAvailable')
    },
    {
      key: 'actions',
      label: t('actions'),
      render: (_: any, row: Enrollment) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEditModal(row)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(row.userId, row.courseId)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-red-600 cursor-pointer">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];
  const createFormFields = [
    {
      name: 'userId',
      label: t('student'),
      type: 'select' as const,
      required: true,
      options: users.map(u => ({ value: u.userId, label: u.userName }))
    },
    {
      name: 'courseId',
      label: t('course'),
      type: 'select' as const,
      required: true,
      options: courses.map(c => ({ value: c.courseId, label: c.courseTitle }))
    },
    {
      name: 'isPaid',
      label: t('paymentStatus'),
      type: 'select' as const,
      required: true,
      options: [
        { value: '1', label: t('paid') },
        { value: '0', label: t('unpaid') }
      ]
    },
    {
      name: 'completionPercent',
      label: t('completionPercent'),
      type: 'number' as const,
      required: true,
      min: 0,
      max: 100
    }
  ];
  const editFormFields = [
    {
      name: 'student',
      label: t('student'),
      type: 'text' as const,
      required: false,
      disabled: true
    },
    {
      name: 'course',
      label: t('course'),
      type: 'text' as const,
      required: false,
      disabled: true
    },
    {
      name: 'isPaid',
      label: t('paymentStatus'),
      type: 'select' as const,
      required: true,
      options: [
        { value: '1', label: t('paid') },
        { value: '0', label: t('unpaid') }
      ]
    },
    {
      name: 'completionPercent',
      label: t('completionPercent'),
      type: 'number' as const,
      required: true,
      min: 0,
      max: 100
    }
  ];
  return (
    <Layout user={user}>
      <Head title={t('enrollmentManagement')} />
      <div className="flex bg-zinc-50 dark:bg-black min-h-screen">
        <AdminSidebar currentPath="/admin/enrollments" />
        <div className="flex-1">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl text-black dark:text-white mb-2">{t('enrollmentManagement')}</h1>
                <p className="text-zinc-600 dark:text-zinc-400">{t('manageEnrollmentsSubtitle')}</p>
              </div>
              <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 cursor-pointer">
                <Plus className="w-5 h-5" />
                {t('addEnrollment')}
              </button>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} placeholder={t('searchEnrollments')} className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white" />
                </div>
                <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white cursor-pointer">
                  <option value="">{t('allPaymentStatus')}</option>
                  <option value="paid">{t('paid')}</option>
                  <option value="unpaid">{t('unpaid')}</option>
                </select>
                <button onClick={handleSearch} className="flex items-center gap-2 px-6 py-2 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 cursor-pointer">
                  <Filter className="w-4 h-4" />
                  {t('filter')}
                </button>
              </div>
            </div>
            <DataTable columns={columns} data={enrollments.data.map((e, idx) => ({ ...e, _key: `${e.userId}-${e.courseId}` }))} exportable={true} keyField="_key" onExport={handleExportAllEnrollments} />
            {enrollments.last_page > 1 && (
              <div className="mt-6 flex justify-center items-center gap-2">
                <button onClick={() => router.get('/admin/enrollments', buildPaginationParams(1), { preserveState: true, only: ['enrollments'] })} disabled={enrollments.current_page === 1} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label={t('firstPage')}>
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button onClick={() => router.get('/admin/enrollments', buildPaginationParams(enrollments.current_page - 1), { preserveState: true, only: ['enrollments'] })} disabled={enrollments.current_page === 1} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label={t('previousPage')}>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {enrollments.current_page > 2 && (
                  <span className="px-2 text-zinc-500 dark:text-zinc-400">...</span>
                )}
                {enrollments.current_page > 1 && (
                  <button onClick={() => router.get('/admin/enrollments', buildPaginationParams(enrollments.current_page - 1), { preserveState: true, only: ['enrollments'] })} className="px-4 py-2 font-medium transition-colors border bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white cursor-pointer">
                    {enrollments.current_page - 1}
                  </button>
                )}
                <button className="px-4 py-2 font-medium transition-colors border bg-black dark:bg-white text-white dark:text-black border-black dark:border-white">
                  {enrollments.current_page}
                </button>
                {enrollments.current_page < enrollments.last_page && (
                  <button onClick={() => router.get('/admin/enrollments', buildPaginationParams(enrollments.current_page + 1), { preserveState: true, only: ['enrollments'] })} className="px-4 py-2 font-medium transition-colors border bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white cursor-pointer">
                    {enrollments.current_page + 1}
                  </button>
                )}
                {enrollments.current_page < enrollments.last_page - 1 && (
                  <span className="px-2 text-zinc-500 dark:text-zinc-400">...</span>
                )}
                <button onClick={() => router.get('/admin/enrollments', buildPaginationParams(enrollments.current_page + 1), { preserveState: true, only: ['enrollments'] })} disabled={enrollments.current_page === enrollments.last_page} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label={t('nextPage')}>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button onClick={() => router.get('/admin/enrollments', buildPaginationParams(enrollments.last_page), { preserveState: true, only: ['enrollments'] })} disabled={enrollments.current_page === enrollments.last_page} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label={t('lastPage')}>
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            )}
            <ModalForm isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreate} title={t('createNewEnrollment')} fields={createFormFields} submitLabel={t('createEnrollment')} />
            <ModalForm isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedEnrollment(null); }} onSubmit={handleEdit} title={t('editEnrollment')} fields={editFormFields} initialData={selectedEnrollment ? { student: selectedEnrollment.user.userName, course: selectedEnrollment.course.courseTitle, isPaid: selectedEnrollment.isPaid ? '1' : '0', completionPercent: selectedEnrollment.completionPercent } : {}} submitLabel={t('updateEnrollment')} />
          </div>
        </div>
      </div>
    </Layout>
  )
}