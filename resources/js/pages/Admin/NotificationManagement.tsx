import { Plus, Trash2, User, AlertCircle, CheckCircle, Info, AlertTriangle, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Filter, Edit } from 'lucide-react';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import AdminSidebar from '../../components/Admin/Sidebar';
import DataTable from '../../components/Admin/DataTable';
import ModalForm from '../../components/Admin/ModalForm';
import Layout from '../../components/Layout';
import useTranslation from '../../hooks/useTranslation';
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
  const { t } = useTranslation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
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
      onSuccess: (page) => {
        const successMsg = (page.props as any).success || t('notificationSentSuccess');
        setIsCreateModalOpen(false);
        showToast(successMsg, 'success');
      },
      onError: (errors) => {
        const errorMsg = Object.values(errors)[0] as string || t('notificationSendFailed');
        showToast(errorMsg, 'error');
      }
    });
  };
  const openEditModal = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsEditModalOpen(true);
  };
  const handleEdit = (data: Record<string, any>) => {
    if (!selectedNotification) return;
    router.post(`/admin/notifications/${selectedNotification.notificationId}`, { ...data, _method: 'PUT' }, {
      onSuccess: (page) => {
        const successMsg = (page.props as any).success || t('notificationUpdatedSuccess');
        setIsEditModalOpen(false);
        setSelectedNotification(null);
        showToast(successMsg, 'success');
      },
      onError: (errors) => {
        const errorMsg = Object.values(errors)[0] as string || t('notificationUpdateFailed');
        showToast(errorMsg, 'error');
      }
    });
  };
  const handleDelete = (notificationId: number) => {
    if (confirm(t('deleteNotificationConfirm'))) {
      router.post(`/admin/notifications/${notificationId}`, {
        _method: 'DELETE'
      }, {
        onSuccess: (page) => {
          const successMsg = (page.props as any).success || t('notificationDeletedSuccess');
          showToast(successMsg, 'success');
        },
        onError: (errors) => {
          const errorMsg = Object.values(errors)[0] as string || t('notificationDeleteFailed');
          showToast(errorMsg, 'error');
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
  const handleExportAllNotifications = async () => {
    try {
      const response = await fetch('/admin/notifications/export', { credentials: 'same-origin', headers: { 'Accept': 'application/json' } });
      if (response.status === 419) { window.location.reload(); return; }
      if (!response.ok) throw new Error(t('exportFailed'));
      const allNotifications = await response.json();
      const exportColumns = columns.filter(col => col.key !== 'actions');
      const headers = exportColumns.map(col => col.label).join(',');
      const rows = allNotifications.map((notif: Notification) => exportColumns.map(col => {
        let value = notif[col.key as keyof Notification];
        if (col.key === 'createdAt' && value) value = new Date(value as string).toLocaleDateString();
        return typeof value === 'string' && value.includes(',') ? `\"${value}\"` : (value ?? '');
      }).join(',')).join('\n');
      const csv = `${headers}\n${rows}`;
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${t('notificationsExportFilename')}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      showToast(t('notificationsExportedSuccess'), 'success');
    } catch (error) {
      showToast(t('exportNotificationsFailed'), 'error');
    }
  };
  const columns = [
    {
      key: 'user',
      label: t('recipient'),
      render: (_: any, row: Notification) => row.user.userName
    },
    {
      key: 'notificationTitle',
      label: t('notification'),
      render: (_: any, row: Notification) => (
        <div>
          <p className="font-medium text-black dark:text-white">{row.notificationTitle}</p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 truncate max-w-xs">{row.notificationMessage}</p>
        </div>
      )
    },
    {
      key: 'notificationType',
      label: t('type'),
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-2">
          {getTypeIcon(value)}
          <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(value)}`}>
            {t(value.toLowerCase()) || value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        </div>
      )
    },
    {
      key: 'isRead',
      label: t('status'),
      render: (value: boolean) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${value ? 'bg-zinc-100 text-zinc-700 dark:bg-zinc-900/30 dark:text-zinc-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
          {value ? t('read') : t('unread')}
        </span>
      )
    },
    {
      key: 'createdAt',
      label: t('sent'),
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'actions',
      label: t('actions'),
      render: (_: any, row: Notification) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEditModal(row)} title={t('editUser')} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(row.notificationId)} title={t('delete')} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-red-600 cursor-pointer">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];
  const formFields = [
    {
      name: 'notificationTitle',
      label: t('title'),
      type: 'text' as const,
      required: true
    },
    {
      name: 'notificationMessage',
      label: t('message'),
      type: 'textarea' as const,
      required: true
    },
    {
      name: 'notificationType',
      label: t('type'),
      type: 'select' as const,
      required: true,
      options: [
        { value: 'info', label: t('info') },
        { value: 'success', label: t('success') },
        { value: 'warning', label: t('warning') },
        { value: 'error', label: t('error') }
      ]
    },
    {
      name: 'recipientType',
      label: t('sendTo'),
      type: 'select' as const,
      required: true,
      options: [
        { value: 'all', label: t('allUsers') },
        { value: 'role', label: t('specificRole') },
        { value: 'specific', label: t('specificUsers') }
      ]
    },
    {
      name: 'recipientRole',
      label: t('roleOptional'),
      type: 'select' as const,
      required: false,
      options: [
        { value: 'admin', label: t('admins') },
        { value: 'instructor', label: t('instructors') },
        { value: 'learner', label: t('learners') }
      ]
    }
  ];
  const editFormFields = [
    {
      name: 'notificationTitle',
      label: t('title'),
      type: 'text' as const,
      required: true
    },
    {
      name: 'notificationMessage',
      label: t('message'),
      type: 'textarea' as const,
      required: true
    },
    {
      name: 'notificationType',
      label: t('type'),
      type: 'select' as const,
      required: true,
      options: [
        { value: 'info', label: t('info') },
        { value: 'success', label: t('success') },
        { value: 'warning', label: t('warning') },
        { value: 'error', label: t('error') }
      ]
    },
    {
      name: 'isRead',
      label: t('markAsRead'),
      type: 'checkbox' as const,
      required: false
    }
  ];
  return (
    <Layout user={user}>
      <Head title={t('notificationManagement')} />
      <div className="flex bg-zinc-50 dark:bg-black min-h-screen">
        <AdminSidebar currentPath="/admin/notifications" />
        <div className="flex-1">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl text-black dark:text-white mb-2">{t('notificationManagement')}</h1>
                <p className="text-zinc-600 dark:text-zinc-400">{t('sendBulkNotificationsSubtitle')}</p>
              </div>
              <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 cursor-pointer">
                <Plus className="w-5 h-5" />
                {t('sendNotification')}
              </button>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} placeholder={t('searchNotifications')} className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white" />
                </div>
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white cursor-pointer">
                  <option value="">{t('allTypes')}</option>
                  <option value="info">{t('info')}</option>
                  <option value="success">{t('success')}</option>
                  <option value="warning">{t('warning')}</option>
                  <option value="error">{t('error')}</option>
                </select>
                <button onClick={handleSearch} className="flex items-center gap-2 px-6 py-2 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 cursor-pointer">
                  <Filter className="w-4 h-4" />
                  {t('filter')}
                </button>
              </div>
            </div>
            <DataTable columns={columns} data={notifications.data} exportable={true} keyField="notificationId" onExport={handleExportAllNotifications} />
            {notifications.last_page > 1 && (
              <div className="mt-6 flex justify-center items-center gap-2">
                <button onClick={() => router.get('/admin/notifications', buildPaginationParams(1), { preserveState: true, only: ['notifications'] })} disabled={notifications.current_page === 1} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label={t('firstPage')}>
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button onClick={() => router.get('/admin/notifications', buildPaginationParams(notifications.current_page - 1), { preserveState: true, only: ['notifications'] })} disabled={notifications.current_page === 1} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label={t('previousPage')}>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {notifications.current_page > 2 && (
                  <span className="px-2 text-zinc-500 dark:text-zinc-400">...</span>
                )}
                {notifications.current_page > 1 && (
                  <button onClick={() => router.get('/admin/notifications', buildPaginationParams(notifications.current_page - 1), { preserveState: true, only: ['notifications'] })} className="px-4 py-2 font-medium transition-colors border bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white cursor-pointer">
                    {notifications.current_page - 1}
                  </button>
                )}
                <button className="px-4 py-2 font-medium transition-colors border bg-black dark:bg-white text-white dark:text-black border-black dark:border-white">
                  {notifications.current_page}
                </button>
                {notifications.current_page < notifications.last_page && (
                  <button onClick={() => router.get('/admin/notifications', buildPaginationParams(notifications.current_page + 1), { preserveState: true, only: ['notifications'] })} className="px-4 py-2 font-medium transition-colors border bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white cursor-pointer">
                    {notifications.current_page + 1}
                  </button>
                )}
                {notifications.current_page < notifications.last_page - 1 && (
                  <span className="px-2 text-zinc-500 dark:text-zinc-400">...</span>
                )}
                <button onClick={() => router.get('/admin/notifications', buildPaginationParams(notifications.current_page + 1), { preserveState: true, only: ['notifications'] })} disabled={notifications.current_page === notifications.last_page} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label={t('nextPage')}>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button onClick={() => router.get('/admin/notifications', buildPaginationParams(notifications.last_page), { preserveState: true, only: ['notifications'] })} disabled={notifications.current_page === notifications.last_page} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label={t('lastPage')}>
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            )}
            <ModalForm isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreate} title={t('sendNotification')} fields={formFields} submitLabel={t('send')} />
            <ModalForm isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedNotification(null); }} onSubmit={handleEdit} title={t('editNotificationId', { id: selectedNotification?.notificationId?.toString() || '' })} fields={editFormFields} initialData={selectedNotification ? { notificationTitle: selectedNotification.notificationTitle, notificationMessage: selectedNotification.notificationMessage, notificationType: selectedNotification.notificationType, isRead: selectedNotification.isRead } : {}} submitLabel={t('updateNotification')} />
          </div>
        </div>
      </div>
    </Layout>
  )
}