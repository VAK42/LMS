import { Edit, Trash2, AlertCircle, Clock, CheckCircle, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Filter, MessageCircle } from 'lucide-react';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import AdminSidebar from '../../components/Admin/Sidebar';
import DataTable from '../../components/Admin/DataTable';
import ModalForm from '../../components/Admin/ModalForm';
import Layout from '../../components/Layout';
import useTranslation from '../../hooks/useTranslation';
interface Ticket {
  ticketId: number;
  user: { userId: number; userName: string; userEmail: string };
  subject: string;
  message: string;
  status: string;
  priority: string;
  adminResponse: string | null;
  createdAt: string;
  resolvedAt: string | null;
}
interface Props {
  tickets: {
    data: Ticket[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  users: Array<{ userId: number; userName: string; userEmail: string }>;
  filters: {
    search?: string;
    status?: string;
    priority?: string;
  };
  user: any;
}
export default function SupportTicketManagement({ tickets, users, filters, user }: Props) {
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');
  const [priorityFilter, setPriorityFilter] = useState(filters.priority || '');
  const handleSearch = () => {
    const params: { search?: string; status?: string; priority?: string } = {};
    if (searchTerm && searchTerm.trim()) params.search = searchTerm;
    if (statusFilter && statusFilter.trim()) params.status = statusFilter;
    if (priorityFilter && priorityFilter.trim()) params.priority = priorityFilter;
    router.get('/admin/support', params, { preserveState: true });
  };
  const buildPaginationParams = (page: number) => {
    const params: any = { page };
    if (searchTerm && searchTerm.trim()) params.search = searchTerm;
    if (statusFilter && statusFilter.trim()) params.status = statusFilter;
    if (priorityFilter && priorityFilter.trim()) params.priority = priorityFilter;
    return params;
  };
  const handleCreate = (data: Record<string, any>) => {
    router.post('/admin/support', data, {
      onSuccess: (page) => {
        const successMsg = (page.props as any).success || t('supportTicketCreatedSuccess');
        setIsCreateModalOpen(false);
        showToast(successMsg, 'success');
      },
      onError: (errors) => {
        const errorMsg = Object.values(errors)[0] as string || t('ticketCreateFailed');
        showToast(errorMsg, 'error');
      }
    });
  };
  const handleEdit = (data: Record<string, any>) => {
    if (!selectedTicket) return;
    router.post(`/admin/support/${selectedTicket.ticketId}`, { ...data, _method: 'PUT' }, {
      onSuccess: (page) => {
        const successMsg = (page.props as any).success || t('ticketUpdatedSuccess');
        setIsEditModalOpen(false);
        setSelectedTicket(null);
        showToast(successMsg, 'success');
      },
      onError: (errors) => {
        const errorMsg = Object.values(errors)[0] as string || t('ticketUpdateFailed');
        showToast(errorMsg, 'error');
      }
    });
  };
  const handleDelete = (ticketId: number) => {
    if (confirm(t('deleteTicketConfirm'))) {
      router.post(`/admin/support/${ticketId}`, { _method: 'DELETE' }, {
        onSuccess: (page) => {
          const successMsg = (page.props as any).success || t('ticketDeletedSuccess');
          showToast(successMsg, 'success');
        },
        onError: (errors) => {
          const errorMsg = Object.values(errors)[0] as string || t('ticketDeleteFailed');
          showToast(errorMsg, 'error');
        }
      });
    }
  };
  const openEditModal = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsEditModalOpen(true);
  };
  const openReplyModal = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsReplyModalOpen(true);
  };
  const handleReply = (data: Record<string, any>) => {
    if (!selectedTicket) return;
    router.post(`/admin/support/${selectedTicket.ticketId}`, {
      ...data,
      _method: 'PUT',
      priority: selectedTicket.priority
    }, {
      onSuccess: (page) => {
        const successMsg = (page.props as any).success || t('replySentSuccess');
        setIsReplyModalOpen(false);
        setSelectedTicket(null);
        showToast(successMsg, 'success');
      },
      onError: (errors) => {
        const errorMsg = Object.values(errors)[0] as string || t('replySendFailed');
        showToast(errorMsg, 'error');
      }
    });
  };
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'high': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'closed': return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-900/30 dark:text-zinc-400';
      case 'inProgress': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
  };
  const handleExportAllTickets = async () => {
    try {
      const response = await fetch('/admin/support/export', { credentials: 'same-origin', headers: { 'Accept': 'application/json' } });
      if (response.status === 419) { window.location.reload(); return; }
      if (!response.ok) throw new Error(t('exportFailed'));
      const allTickets = await response.json();
      const exportColumns = columns.filter(col => col.key !== 'actions');
      const headers = exportColumns.map(col => col.label).join(',');
      const rows = allTickets.map((ticket: Ticket) => exportColumns.map(col => {
        let value = ticket[col.key as keyof Ticket];
        if (col.key === 'createdAt' && value) value = new Date(value as string).toLocaleDateString();
        return typeof value === 'string' && value.includes(',') ? `\"${value}\"` : (value ?? '');
      }).join(',')).join('\n');
      const csv = `${headers}\n${rows}`;
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${t('ticketsExportFilename')}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      showToast(t('supportTicketsExportedSuccess'), 'success');
    } catch (error) {
      showToast(t('exportSupportTicketsFailed'), 'error');
    }
  };
  const columns = [
    {
      key: 'ticketId',
      label: t('ticketId'),
      render: (value: number) => `#${value}`
    },
    {
      key: 'user',
      label: t('user'),
      render: (_: any, row: Ticket) => (
        <div>
          <p className="font-medium text-black dark:text-white">{row.user.userName}</p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">{row.user.userEmail}</p>
        </div>
      )
    },
    {
      key: 'subject',
      label: t('subject'),
      sortable: true,
      render: (value: string, row: Ticket) => (
        <div>
          <p className="font-medium text-black dark:text-white">{value}</p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 truncate max-w-xs">{row.message}</p>
        </div>
      )
    },
    {
      key: 'priority',
      label: t('priority'),
      sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(value)}`}>
          {t(value)}
        </span>
      )
    },
    {
      key: 'status',
      label: t('status'),
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-2">
          {value === 'resolved' ? <CheckCircle className="w-4 h-4 text-green-600" /> : value === 'inProgress' ? <Clock className="w-4 h-4 text-blue-600" /> : <AlertCircle className="w-4 h-4 text-yellow-600" />}
          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(value)}`}>
            {t(value)}
          </span>
        </div>
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
      render: (_: any, row: Ticket) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openReplyModal(row)} title={t('reply')} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-blue-600 cursor-pointer">
            <MessageCircle className="w-4 h-4" />
          </button>
          <button onClick={() => openEditModal(row)} title={t('editLink')} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(row.ticketId)} title={t('delete')} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-red-600 cursor-pointer">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];
  const formFields = [
    {
      name: 'userId',
      label: t('user'),
      type: 'select' as const,
      required: true,
      options: users.map(u => ({ value: u.userId.toString(), label: `${u.userName} (${u.userEmail})` }))
    },
    { name: 'subject', label: t('subject'), type: 'text' as const, required: true },
    { name: 'message', label: t('message'), type: 'textarea' as const, required: true },
    {
      name: 'status',
      label: t('status'),
      type: 'select' as const,
      required: true,
      options: [
        { value: 'open', label: t('open') },
        { value: 'inProgress', label: t('inProgress') },
        { value: 'resolved', label: t('resolved') },
        { value: 'closed', label: t('closed') }
      ]
    },
    {
      name: 'priority',
      label: t('priority'),
      type: 'select' as const,
      required: true,
      options: [
        { value: 'low', label: t('low') },
        { value: 'medium', label: t('medium') },
        { value: 'high', label: t('high') },
        { value: 'urgent', label: t('urgent') }
      ]
    }
  ];
  const editFormFields = [
    {
      name: 'user',
      label: t('user'),
      type: 'text' as const,
      required: false,
      disabled: true
    },
    { name: 'subject', label: t('subject'), type: 'text' as const, required: true },
    { name: 'message', label: t('message'), type: 'textarea' as const, required: true },
    {
      name: 'status',
      label: t('status'),
      type: 'select' as const,
      required: true,
      options: [
        { value: 'open', label: t('open') },
        { value: 'inProgress', label: t('inProgress') },
        { value: 'resolved', label: t('resolved') },
        { value: 'closed', label: t('closed') }
      ]
    },
    {
      name: 'priority',
      label: t('priority'),
      type: 'select' as const,
      required: true,
      options: [
        { value: 'low', label: t('low') },
        { value: 'medium', label: t('medium') },
        { value: 'high', label: t('high') },
        { value: 'urgent', label: t('urgent') }
      ]
    }
  ];
  const replyFormFields = [
    {
      name: 'user',
      label: t('user'),
      type: 'text' as const,
      required: false,
      disabled: true
    },
    {
      name: 'subject',
      label: t('subject'),
      type: 'text' as const,
      required: false,
      disabled: true
    },
    {
      name: 'message',
      label: t('originalMessage'),
      type: 'textarea' as const,
      required: false,
      disabled: true
    },
    {
      name: 'adminResponse',
      label: t('replyMessage'),
      type: 'textarea' as const,
      required: true,
      placeholder: t('enterResponsePlaceholder')
    },
    {
      name: 'status',
      label: t('updateStatus'),
      type: 'select' as const,
      required: true,
      options: [
        { value: 'open', label: t('open') },
        { value: 'inProgress', label: t('inProgress') },
        { value: 'resolved', label: t('resolved') },
        { value: 'closed', label: t('closed') }
      ]
    },
    {
      name: 'priority',
      label: t('updatePriority'),
      type: 'select' as const,
      required: true,
      options: [
        { value: 'low', label: t('low') },
        { value: 'medium', label: t('medium') },
        { value: 'high', label: t('high') },
        { value: 'urgent', label: t('urgent') }
      ]
    }
  ];
  return (
    <Layout user={user}>
      <Head title={t('supportTickets')} />
      <div className="flex bg-zinc-50 dark:bg-black min-h-screen">
        <AdminSidebar currentPath="/admin/support" />
        <div className="flex-1">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl text-black dark:text-white mb-2">{t('supportTickets')}</h1>
                <p className="text-zinc-600 dark:text-zinc-400">{t('manageSupportSubtitle')}</p>
              </div>
              <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 cursor-pointer">
                <span className="text-xl">+</span>
                {t('createTicket')}
              </button>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} placeholder={t('searchBySubjectOrUser')} className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white" />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white cursor-pointer">
                  <option value="">{t('allStatus')}</option>
                  <option value="open">{t('open')}</option>
                  <option value="inProgress">{t('inProgress')}</option>
                  <option value="resolved">{t('resolved')}</option>
                  <option value="closed">{t('closed')}</option>
                </select>
                <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white cursor-pointer">
                  <option value="">{t('allPriorities')}</option>
                  <option value="low">{t('low')}</option>
                  <option value="medium">{t('medium')}</option>
                  <option value="high">{t('high')}</option>
                  <option value="urgent">{t('urgent')}</option>
                </select>
                <button onClick={handleSearch} className="flex items-center gap-2 px-6 py-2 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 cursor-pointer">
                  <Filter className="w-4 h-4" />
                  {t('filter')}
                </button>
              </div>
            </div>
            <DataTable columns={columns} data={tickets.data} exportable={true} keyField="ticketId" onExport={handleExportAllTickets} />
            {tickets.last_page > 1 && (
              <div className="mt-6 flex justify-center items-center gap-2">
                <button onClick={() => router.get('/admin/support', buildPaginationParams(1), { preserveState: true, only: ['tickets'] })} disabled={tickets.current_page === 1} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label={t('firstPage')}>
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button onClick={() => router.get('/admin/support', buildPaginationParams(tickets.current_page - 1), { preserveState: true, only: ['tickets'] })} disabled={tickets.current_page === 1} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label={t('previousPage')}>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {tickets.current_page > 2 && (
                  <span className="px-2 text-zinc-500 dark:text-zinc-400">...</span>
                )}
                {tickets.current_page > 1 && (
                  <button onClick={() => router.get('/admin/support', buildPaginationParams(tickets.current_page - 1), { preserveState: true, only: ['tickets'] })} className="px-4 py-2 font-medium transition-colors border bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white cursor-pointer">
                    {tickets.current_page - 1}
                  </button>
                )}
                <button className="px-4 py-2 font-medium transition-colors border bg-black dark:bg-white text-white dark:text-black border-black dark:border-white">
                  {tickets.current_page}
                </button>
                {tickets.current_page < tickets.last_page && (
                  <button onClick={() => router.get('/admin/support', buildPaginationParams(tickets.current_page + 1), { preserveState: true, only: ['tickets'] })} className="px-4 py-2 font-medium transition-colors border bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white cursor-pointer">
                    {tickets.current_page + 1}
                  </button>
                )}
                {tickets.current_page < tickets.last_page - 1 && (
                  <span className="px-2 text-zinc-500 dark:text-zinc-400">...</span>
                )}
                <button onClick={() => router.get('/admin/support', buildPaginationParams(tickets.current_page + 1), { preserveState: true, only: ['tickets'] })} disabled={tickets.current_page === tickets.last_page} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label={t('nextPage')}>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button onClick={() => router.get('/admin/support', buildPaginationParams(tickets.last_page), { preserveState: true, only: ['tickets'] })} disabled={tickets.current_page === tickets.last_page} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label={t('lastPage')}>
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            )}
            <ModalForm isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreate} title={t('createSupportTicket')} fields={formFields} submitLabel={t('createTicket')} />
            <ModalForm isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedTicket(null); }} onSubmit={handleEdit} title={t('editTicketWithId', { id: selectedTicket?.ticketId || '' })} fields={editFormFields} initialData={selectedTicket ? { user: `${selectedTicket.user.userName} (${selectedTicket.user.userEmail})`, subject: selectedTicket.subject, message: selectedTicket.message, status: selectedTicket.status, priority: selectedTicket.priority } : {}} submitLabel={t('updateTicket')} />
            <ModalForm isOpen={isReplyModalOpen} onClose={() => { setIsReplyModalOpen(false); setSelectedTicket(null); }} onSubmit={handleReply} title={t('replyToTicketWithId', { id: selectedTicket?.ticketId || '' })} fields={replyFormFields} initialData={selectedTicket ? { user: `${selectedTicket.user.userName} (${selectedTicket.user.userEmail})`, subject: selectedTicket.subject, message: selectedTicket.message, status: selectedTicket.status, priority: selectedTicket.priority, adminResponse: '' } : {}} submitLabel={t('sendReply')} />
          </div>
        </div>
      </div>
    </Layout>
  )
}