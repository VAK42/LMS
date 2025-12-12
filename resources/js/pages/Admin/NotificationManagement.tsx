import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Trash2, User, AlertCircle, CheckCircle, Info, AlertTriangle, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Filter } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import Layout from '../../components/Layout';
import AdminSidebar from '../../components/Admin/Sidebar';
import DataTable from '../../components/Admin/DataTable';
import ModalForm from '../../components/Admin/ModalForm';
interface Notification {
  notificationId: number;
  user: { userId: number; userName: string };
  notificationTitle: string;
  notificationMessage: string;
  notificationType: string;
  isRead: boolean;
  createdAt: string;
}
interface User {
  userId: number;
  userName: string;
  userEmail: string;
}
interface Props {
  notifications: {
    data: Notification[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  users: User[];
  filters: {
    search?: string;
    type?: string;
  };
  user: any;
}
export default function NotificationManagement({ notifications, filters, user }: Props) {
  const { showToast } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [typeFilter, setTypeFilter] = useState(filters.type || '');
  const handleSearch = () => {
    const params: { search?: string; type?: string } = {};
    if (searchTerm && searchTerm.trim()) {
      params.search = searchTerm;
    }
    if (typeFilter && typeFilter.trim()) {
      params.type = typeFilter;
    }
    router.get('/admin/notifications', params, { preserveState: true });
  };
  const buildPaginationParams = (page: number) => {
    const params: any = { page };
    if (searchTerm && searchTerm.trim()) params.search = searchTerm;
    if (typeFilter && typeFilter.trim()) params.type = typeFilter;
    return params;
  };
  const handleCreate = (data: Record<string, any>) => {
    router.post('/admin/notifications', data, {
      onSuccess: () => {
        setIsCreateModalOpen(false);
        showToast('Notification Sent Successfully!', 'success');
      },
      onError: () => {
        showToast('Failed To Send Notification! Please Try Again!', 'error');
      }
    });
  };
  const handleDelete = (notificationId: number) => {
    if (confirm('Are You Sure You Want To Delete This Notification?')) {
      router.post(`/admin/notifications/${notificationId}`, {
        _method: 'DELETE'
      }, {
        onSuccess: () => {
          showToast('Notification Deleted Successfully!', 'success');
        },
        onError: () => {
          showToast('Failed To Delete Notification! Please Try Again!', 'error');
        }
      });
    }
  };
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default: return <Info className="w-4 h-4 text-blue-600" />;
    }
  };
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'error': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'warning': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };
  const columns = [
    {
      key: 'user',
      label: 'Recipient',
      render: (_: any, row: Notification) => row.user.userName
    },
    {
      key: 'notificationTitle',
      label: 'Notification',
      render: (_: any, row: Notification) => (
        <div>
          <p className="font-medium text-black dark:text-white">{row.notificationTitle}</p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 truncate max-w-xs">{row.notificationMessage}</p>
        </div>
      )
    },
    {
      key: 'notificationType',
      label: 'Type',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-2">
          {getTypeIcon(value)}
          <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(value)}`}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        </div>
      )
    },
    {
      key: 'isRead',
      label: 'Status',
      render: (value: boolean) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${value ? 'bg-zinc-100 text-zinc-700 dark:bg-zinc-900/30 dark:text-zinc-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
          {value ? 'Read' : 'Unread'}
        </span>
      )
    },
    {
      key: 'createdAt',
      label: 'Sent',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: Notification) => (
        <button onClick={() => handleDelete(row.notificationId)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-red-600 cursor-pointer">
          <Trash2 className="w-4 h-4" />
        </button>
      )
    }
  ];
  const formFields = [
    {
      name: 'notificationTitle',
      label: 'Title',
      type: 'text' as const,
      required: true,
      placeholder: 'e.g., New Course Available'
    },
    {
      name: 'notificationMessage',
      label: 'Message',
      type: 'textarea' as const,
      required: true,
      placeholder: 'Enter Notification Message...'
    },
    {
      name: 'notificationType',
      label: 'Type',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'info', label: 'Info' },
        { value: 'success', label: 'Success' },
        { value: 'warning', label: 'Warning' },
        { value: 'error', label: 'Error' }
      ]
    },
    {
      name: 'recipientType',
      label: 'Send To',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'all', label: 'All Users' },
        { value: 'role', label: 'Specific Role' },
        { value: 'specific', label: 'Specific Users' }
      ]
    },
    {
      name: 'recipientRole',
      label: 'Role (If Applicable)',
      type: 'select' as const,
      required: false,
      options: [
        { value: 'admin', label: 'Admins' },
        { value: 'instructor', label: 'Instructors' },
        { value: 'learner', label: 'Learners' }
      ]
    }
  ];
  return (
    <Layout user={user}>
      <Head title="Notification Management" />
      <div className="flex bg-zinc-50 dark:bg-black min-h-screen">
        <AdminSidebar currentPath="/admin/notifications" />
        <div className="flex-1">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-black dark:text-white mb-2">Notification Management</h1>
                <p className="text-zinc-600 dark:text-zinc-400">Send Bulk Notifications To Users</p>
              </div>
              <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200">
                <Plus className="w-5 h-5" />
                Send Notification
              </button>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} placeholder="Search By Title Or Recipient..." className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white" />
                </div>
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white">
                  <option value="">All Types</option>
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>
                <button onClick={handleSearch} className="flex items-center gap-2 px-6 py-2 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 cursor-pointer">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>
            </div>
            <DataTable columns={columns} data={notifications.data} exportable={true} keyField="notificationId" />
            {notifications.last_page > 1 && (
              <div className="mt-6 flex justify-center items-center gap-2">
                <button onClick={() => router.get('/admin/notifications', buildPaginationParams(1), { preserveState: true, only: ['notifications'] })} disabled={notifications.current_page === 1} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label="First Page">
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button onClick={() => router.get('/admin/notifications', buildPaginationParams(notifications.current_page - 1), { preserveState: true, only: ['notifications'] })} disabled={notifications.current_page === 1} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label="Previous">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="px-4 py-2 font-medium border bg-black dark:bg-white text-white dark:text-black">{notifications.current_page}</button>
                <button onClick={() => router.get('/admin/notifications', buildPaginationParams(notifications.current_page + 1), { preserveState: true, only: ['notifications'] })} disabled={notifications.current_page === notifications.last_page} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label="Next">
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button onClick={() => router.get('/admin/notifications', buildPaginationParams(notifications.last_page), { preserveState: true, only: ['notifications'] })} disabled={notifications.current_page === notifications.last_page} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label="Last">
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            )}
            <ModalForm isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreate} title="Send Notification" fields={formFields} submitLabel="Send" />
          </div>
        </div>
      </div>
    </Layout>
  )
}