import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Layout from '../../components/Layout';
import AdminSidebar from '../../components/Admin/Sidebar';
import DataTable from '../../components/Admin/DataTable';
import ModalForm from '../../components/Admin/ModalForm';
interface Enrollment {
  enrollmentId: number;
  user: { userId: number; userName: string };
  course: { courseId: number; courseTitle: string };
  enrollmentStatus: string;
  progressPercentage: number;
  enrolledAt: string;
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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');
  const handleSearch = () => {
    router.get('/admin/enrollments', { search: searchTerm, status: statusFilter }, { preserveState: true });
  };
  const handleCreate = (data: Record<string, any>) => {
    router.post('/admin/enrollments', data, {
      onSuccess: () => setIsCreateModalOpen(false)
    });
  };
  const handleEdit = (data: Record<string, any>) => {
    if (!selectedEnrollment) return;
    router.put(`/admin/enrollments/${selectedEnrollment.enrollmentId}`, data, {
      onSuccess: () => {
        setIsEditModalOpen(false);
        setSelectedEnrollment(null);
      }
    });
  };
  const handleDelete = (enrollmentId: number) => {
    if (confirm('Are You Sure You Want To Delete This Enrollment?')) {
      router.delete(`/admin/enrollments/${enrollmentId}`);
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
      key: 'enrollmentStatus',
      label: 'Status',
      sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(value)}`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
    {
      key: 'progressPercentage',
      label: 'Progress',
      sortable: true,
      render: (value: number) => (
        <div className="w-full">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{value}%</span>
          </div>
          <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${value}%` }}></div>
          </div>
        </div>
      )
    },
    {
      key: 'enrolledAt',
      label: 'Enrolled',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: Enrollment) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEditModal(row)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(row.enrollmentId)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-red-600">
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
                <button onClick={handleSearch} className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200">
                  Search
                </button>
              </div>
            </div>
            <DataTable columns={columns} data={enrollments.data} searchable={false} exportable={true} />
            <ModalForm isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreate} title="Create Manual Enrollment" fields={createFormFields} submitLabel="Create Enrollment" />
            <ModalForm isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedEnrollment(null); }} onSubmit={handleEdit} title="Edit Enrollment" fields={editFormFields} initialData={selectedEnrollment ? { enrollmentStatus: selectedEnrollment.enrollmentStatus, progressPercentage: selectedEnrollment.progressPercentage } : {}} submitLabel="Update Enrollment" />
          </div>
        </div>
      </div>
    </Layout>
  )
}