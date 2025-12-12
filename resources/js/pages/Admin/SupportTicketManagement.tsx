import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Edit, Trash2, AlertCircle, Clock, CheckCircle, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Filter } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import Layout from '../../components/Layout';
import AdminSidebar from '../../components/Admin/Sidebar';
import DataTable from '../../components/Admin/DataTable';
import ModalForm from '../../components/Admin/ModalForm';
interface Ticket {
  ticketId: number;
  user: { userId: number; userName: string; userEmail: string };
  subject: string;
  ticketMessage: string;
  ticketStatus: string;
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
  filters: {
    search?: string;
    status?: string;
    priority?: string;
  };
  user: any;
}
export default function SupportTicketManagement({ tickets, filters, user }: Props) {
  const { showToast } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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
      onSuccess: () => {
        setIsCreateModalOpen(false);
        showToast('Support Ticket Created Successfully!', 'success');
      },
      onError: () => {
        showToast('Failed To Create Ticket! Please Try Again!', 'error');
      }
    });
  };
  const handleEdit = (data: Record<string, any>) => {
    if (!selectedTicket) return;
    router.post(`/admin/support/${selectedTicket.ticketId}`, { ...data, _method: 'PUT' }, {
      onSuccess: () => {
        setIsEditModalOpen(false);
        setSelectedTicket(null);
        showToast('Ticket Updated Successfully!', 'success');
      },
      onError: () => showToast('Failed To Update Ticket! Please Try Again!', 'error')
    });
  };
  const handleDelete = (ticketId: number) => {
    if (confirm('Are You Sure You Want To Delete This Support Ticket?')) {
      router.post(`/admin/support/${ticketId}`, { _method: 'DELETE' }, {
        onSuccess: () => showToast('Ticket Deleted Successfully!', 'success'),
        onError: () => showToast('Failed To Delete Ticket! Please Try Again!', 'error')
      });
    }
  };
  const openEditModal = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsEditModalOpen(true);
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
      case 'in_progress': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
  };
  const columns = [
    {
      key: 'ticketId',
      label: 'ID',
      render: (value: number) => `#${value}`
    },
    {
      key: 'user',
      label: 'User',
      render: (_: any, row: Ticket) => (
        <div>
          <p className="font-medium text-black dark:text-white">{row.user.userName}</p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">{row.user.userEmail}</p>
        </div>
      )
    },
    {
      key: 'subject',
      label: 'Subject',
      sortable: true,
      render: (value: string, row: Ticket) => (
        <div>
          <p className="font-medium text-black dark:text-white">{value}</p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 truncate max-w-xs">{row.ticketMessage}</p>
        </div>
      )
    },
    {
      key: 'priority',
      label: 'Priority',
      sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(value)}`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
    {
      key: 'ticketStatus',
      label: 'Status',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-2">
          {value === 'resolved' ? <CheckCircle className="w-4 h-4 text-green-600" /> : value === 'in_progress' ? <Clock className="w-4 h-4 text-blue-600" /> : <AlertCircle className="w-4 h-4 text-yellow-600" />}
          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(value)}`}>
            {value ? value.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'N/A'}
          </span>
        </div>
      )
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: Ticket) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEditModal(row)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(row.ticketId)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-red-600 cursor-pointer">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];
  const formFields = [
    {
      name: 'ticketStatus',
      label: 'Status',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'open', label: 'Open' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'resolved', label: 'Resolved' },
        { value: 'closed', label: 'Closed' }
      ]
    },
    {
      name: 'priority',
      label: 'Priority',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'urgent', label: 'Urgent' }
      ]
    },
    {
      name: 'adminResponse',
      label: 'Admin Response',
      type: 'textarea' as const,
      required: false,
      placeholder: 'Enter Your Response To The User...'
    }
  ];
  return (
    <Layout user={user}>
      <Head title="Support Tickets" />
      <div className="flex bg-zinc-50 dark:bg-black min-h-screen">
        <AdminSidebar currentPath="/admin/support" />
        <div className="flex-1">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-black dark:text-white mb-2">Support Tickets</h1>
                <p className="text-zinc-600 dark:text-zinc-400">Manage User Support Requests & Inquiries</p>
              </div>
              <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 cursor-pointer">
                <span className="text-xl">+</span>
                Create Ticket
              </button>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} placeholder="Search By Subject Or User..." className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white" />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white">
                  <option value="">All Status</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
                <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white">
                  <option value="">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
                <button onClick={handleSearch} className="flex items-center gap-2 px-6 py-2 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 cursor-pointer">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>
            </div>
            <DataTable columns={columns} data={tickets.data} exportable={true} keyField="ticketId" />
            {tickets.last_page > 1 && (
              <div className="mt-6 flex justify-center items-center gap-2">
                <button onClick={() => router.get('/admin/support', buildPaginationParams(1), { preserveState: true, only: ['tickets'] })} disabled={tickets.current_page === 1} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label="First Page">
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button onClick={() => router.get('/admin/support', buildPaginationParams(tickets.current_page - 1), { preserveState: true, only: ['tickets'] })} disabled={tickets.current_page === 1} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label="Previous">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="px-4 py-2 font-medium border bg-black dark:bg-white text-white dark:text-black">{tickets.current_page}</button>
                <button onClick={() => router.get('/admin/support', buildPaginationParams(tickets.current_page + 1), { preserveState: true, only: ['tickets'] })} disabled={tickets.current_page === tickets.last_page} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label="Next">
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button onClick={() => router.get('/admin/support', buildPaginationParams(tickets.last_page), { preserveState: true, only: ['tickets'] })} disabled={tickets.current_page === tickets.last_page} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" aria-label="Last">
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            )}
            <ModalForm isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreate} title="Create Support Ticket" fields={formFields.filter(f => f.name !== 'ticketStatus' && f.name !== 'adminResponse')} submitLabel="Create Ticket" />
            <ModalForm isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedTicket(null); }} onSubmit={handleEdit} title={`Ticket #${selectedTicket?.ticketId || ''} - ${selectedTicket?.subject || ''}`} fields={formFields} initialData={selectedTicket ? { ticketStatus: selectedTicket.ticketStatus, priority: selectedTicket.priority, adminResponse: selectedTicket.adminResponse || '' } : {}} submitLabel="Update Ticket" />
          </div>
        </div>
      </div>
    </Layout>
  )
}