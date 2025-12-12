import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Edit, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Filter } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import Layout from '../../components/Layout';
import AdminSidebar from '../../components/Admin/Sidebar';
import DataTable from '../../components/Admin/DataTable';
import ModalForm from '../../components/Admin/ModalForm';
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
  filters: {
    search?: string;
    status?: string;
  };
  user: any;
}
export default function EnrollmentManagement({ enrollments, users, courses, filters, user }: Props) {
  const { showToast } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');
  const handleSearch = () => {
    const params: { search?: string; status?: string } = {};
    if (searchTerm && searchTerm.trim()) {
      params.search = searchTerm;
    }
    if (statusFilter && statusFilter.trim()) {
      params.status = statusFilter;
    }
    router.get('/admin/enrollments', params, { preserveState: true });
  };
  const buildPaginationParams = (page: number) => {
    const params: any = { page };
    if (searchTerm && searchTerm.trim()) params.search = searchTerm;
    if (statusFilter && statusFilter.trim()) params.status = statusFilter;
    return params;
  };
  const handleCreate = (data: Record<string, any>) => {
    router.post('/admin/enrollments', data, {
      onSuccess: () => {
        setIsCreateModalOpen(false);
        showToast('Enrollment Created Successfully!', 'success');
      },
      onError: () => {
        showToast('Failed To Create Enrollment! Please Try Again!', 'error');
      }
    });
  };
  const handleEdit = (data: Record<string, any>) => {
    if (!selectedEnrollment) return;
    router.post(`/admin/enrollments/${selectedEnrollment.userId}/${selectedEnrollment.courseId}`, {
      ...data,
      _method: 'PUT'
    }, {
      onSuccess: () => {
        setIsEditModalOpen(false);
        setSelectedEnrollment(null);
        showToast('Enrollment Updated Successfully!', 'success');
      },
      onError: () => {
        showToast('Failed To Update Enrollment! Please Try Again!', 'error');
      }
    });
  };
  const handleDelete = (userId: number, courseId: number) => {
    if (confirm('Are You Sure You Want To Delete This Enrollment?')) {
      router.post(`/admin/enrollments/${userId}/${courseId}`, {
        _method: 'DELETE'
      }, {
        onSuccess: () => {
          showToast('Enrollment Deleted Successfully!', 'success');
        },
        onError: () => {
          showToast('Failed To Delete Enrollment! Please Try Again!', 'error');
        }
      });
    }
  };
  const openEditModal = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setIsEditModalOpen(true);
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'active': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'dropped': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-900/30 dark:text-zinc-400';
    }
  };
  const columns = [
    {
      key: 'user',
      label: 'Student',
      render: (_: any, row: Enrollment) => row.user.userName
    },
    {
      key: 'course',
      label: 'Course',
      render: (_: any, row: Enrollment) => (
        <p className="font-medium text-black dark:text-white">{row.course.courseTitle}</p>
      )
    },
    {
      key: 'isPaid',
      label: 'Status',
      sortable: true,
      render: (value: boolean) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${value ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
          {value ? 'Paid' : 'Unpaid'}
        </span>
      )
    },
    {
      key: 'completionPercent',
      label: 'Progress',
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
      label: 'Enrolled',
      sortable: true,
      render: (value: string) => value ? new Date(value).toLocaleDateString() : 'N/A'
    },
    {
      key: 'actions',
      label: 'Actions',
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
      label: 'Student',
      type: 'select' as const,
      required: true,
      options: users.map(u => ({ value: u.userId, label: u.userName }))
    },
    {
      name: 'courseId',
      label: 'Course',
      type: 'select' as const,
      required: true,
      options: courses.map(c => ({ value: c.courseId, label: c.courseTitle }))
    }
  ];
  const editFormFields = [
    {
      name: 'enrollmentStatus',
      label: 'Status',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'active', label: 'Active' },
        { value: 'completed', label: 'Completed' },
        { value: 'dropped', label: 'Dropped' }
      ]
    },
    {
      name: 'progressPercentage',
      label: 'Progress (%)',
      type: 'number' as const,
      required: true
    }
  ];
  return (
    <Layout user={user}>
      <Head title="Enrollment Management" />
      <div className="flex bg-zinc-50 dark:bg-black min-h-screen">
        <AdminSidebar currentPath="/admin/enrollments" />
        <div className="flex-1">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-black dark:text-white mb-2">Enrollment Management</h1>
                <p className="text-zinc-600 dark:text-zinc-400">Manage Student Enrollments & Progress</p>
              </div>
              <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200">
                <Plus className="w-5 h-5" />
                Manual Enrollment
              </button>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} placeholder="Search By Student Or Course..." className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white" />
                </div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white">
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="dropped">Dropped</option>
                </select>
                <button onClick={handleSearch} className="flex items-center gap-2 px-6 py-2 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 cursor-pointer">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>
            </div>
            <DataTable columns={columns} data={enrollments.data} exportable={true} />
            {enrollments.last_page > 1 && (
              <div className="mt-6 flex justify-center items-center gap-2">
                <button onClick={() => router.get('/admin/enrollments', buildPaginationParams(1), { preserveState: true, only: ['enrollments'] })} disabled={enrollments.current_page === 1} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label="First Page">
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button onClick={() => router.get('/admin/enrollments', buildPaginationParams(enrollments.current_page - 1), { preserveState: true, only: ['enrollments'] })} disabled={enrollments.current_page === 1} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label="Previous">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="px-4 py-2 font-medium border bg-black dark:bg-white text-white dark:text-black">{enrollments.current_page}</button>
                <button onClick={() => router.get('/admin/enrollments', buildPaginationParams(enrollments.current_page + 1), { preserveState: true, only: ['enrollments'] })} disabled={enrollments.current_page === enrollments.last_page} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label="Next">
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button onClick={() => router.get('/admin/enrollments', buildPaginationParams(enrollments.last_page), { preserveState: true, only: ['enrollments'] })} disabled={enrollments.current_page === enrollments.last_page} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label="Last">
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            )}
            <ModalForm isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreate} title="Create Manual Enrollment" fields={createFormFields} submitLabel="Create Enrollment" />
            <ModalForm isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedEnrollment(null); }} onSubmit={handleEdit} title="Edit Enrollment" fields={editFormFields} initialData={selectedEnrollment ? { completionPercent: selectedEnrollment.completionPercent } : {}} submitLabel="Update Enrollment" />
          </div>
        </div>
      </div>
    </Layout>
  )
}