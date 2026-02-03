import { Wallet, DollarSign, Clock, CheckCircle, XCircle, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Filter, QrCode, Send } from 'lucide-react';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { useToast } from '../../contexts/ToastContext';
import AdminSidebar from '../../components/Admin/Sidebar';
import DataTable from '../../components/Admin/DataTable';
import Layout from '../../components/Layout';
import useTranslation from '../../hooks/useTranslation';
interface Payout {
  payoutId: number;
  instructor: { userId: number; userName: string; userEmail: string };
  amount: number;
  status: string;
  paymentMethod: string;
  bankInfo: { bankName?: string; bankAccountNumber?: string; bankAccountName?: string; bankQrPath?: string };
  adminNotes: string | null;
  processedAt: string | null;
  createdAt: string;
}
interface InstructorBalance {
  userId: number;
  userName: string;
  userEmail: string;
  balance: number;
  totalEarnings: number;
  bankQrPath: string | null;
  bankName: string | null;
  bankAccountNumber: string | null;
  bankAccountName: string | null;
}
interface Props {
  payouts: {
    data: Payout[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  filters: {
    search?: string;
    status?: string;
  };
  stats: {
    pendingPayouts: number;
    completedPayouts: number;
    totalPayouts: number;
  };
  user: any;
}
export default function PayoutManagement({ payouts, filters, stats, user }: Props) {
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');
  const [instructorBalances, setInstructorBalances] = useState<InstructorBalance[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<InstructorBalance | null>(null);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);
  const [selectedQr, setSelectedQr] = useState<string | null>(null);
  const [processingPayout, setProcessingPayout] = useState<Payout | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  useEffect(() => {
    fetchInstructorBalances();
  }, []);
  const fetchInstructorBalances = async () => {
    const response = await fetch('/admin/payouts/instructorBalances', { credentials: 'same-origin', headers: { 'Accept': 'application/json' } });
    if (response.status === 419) { window.location.reload(); return; }
    const data = await response.json();
    setInstructorBalances(data);
  };
  const handleSearch = () => {
    const params: { search?: string; status?: string } = {};
    if (searchTerm && searchTerm.trim()) params.search = searchTerm;
    if (statusFilter && statusFilter.trim()) params.status = statusFilter;
    router.get('/admin/payouts', params, { preserveState: true });
  };
  const buildPaginationParams = (page: number) => {
    const params: any = { page };
    if (searchTerm && searchTerm.trim()) params.search = searchTerm;
    if (statusFilter && statusFilter.trim()) params.status = statusFilter;
    return params;
  };
  const handleCreatePayout = async () => {
    if (!selectedInstructor || !payoutAmount) return;
    try {
      const response = await fetch('/admin/payouts', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        },
        body: JSON.stringify({ instructorId: selectedInstructor.userId, amount: parseFloat(payoutAmount) }),
      });
      if (response.status === 419) { window.location.reload(); return; }
      if (!response.ok) throw new Error(t('failedToCreatePayout'));
      showToast(t('payoutCreatedSuccess'), 'success');
      setShowCreateModal(false);
      setSelectedInstructor(null);
      setPayoutAmount('');
      router.reload();
    } catch (error) {
      showToast(t('payoutCreateFailed'), 'error');
    }
  };
  const handleProcessPayout = async () => {
    if (!processingPayout) return;
    try {
      const response = await fetch(`/admin/payouts/${processingPayout.payoutId}/process`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        },
        body: JSON.stringify({ adminNotes }),
      });
      if (response.status === 419) { window.location.reload(); return; }
      if (!response.ok) throw new Error(t('failedToProcessPayout'));
      showToast(t('payoutProcessedSuccess'), 'success');
      setProcessingPayout(null);
      setAdminNotes('');
      router.reload();
    } catch (error) {
      showToast(t('payoutProcessFailed'), 'error');
    }
  };
  const handleCancelPayout = async (payoutId: number) => {
    if (!confirm(t('cancelPayoutConfirm'))) return;
    try {
      const response = await fetch(`/admin/payouts/${payoutId}/cancel`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        },
      });
      if (response.status === 419) { window.location.reload(); return; }
      if (!response.ok) throw new Error(t('failedToCancelPayout'));
      showToast(t('payoutCancelled'), 'success');
      router.reload();
    } catch (error) {
      showToast(t('payoutCancelFailed'), 'error');
    }
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'processing': return <Send className="w-4 h-4 text-blue-600" />;
      default: return <DollarSign className="w-4 h-4 text-zinc-600" />;
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'failed': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'processing': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-900/30 dark:text-zinc-400';
    }
  };
  const columns = [
    { key: 'payoutId', label: t('payoutId'), render: (value: number) => <span className="font-mono">#{value}</span> },
    {
      key: 'instructor', label: t('instructor'), render: (_: any, row: Payout) => (
        <div>
          <p className="font-medium text-black dark:text-white">{row.instructor.userName}</p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">{row.instructor.userEmail}</p>
        </div>
      )
    },
    { key: 'amount', label: t('amount'), render: (value: number) => <span className="font-semibold text-black dark:text-white">{t('currencySymbol')}{Number(value).toFixed(2)}</span> },
    {
      key: 'status', label: t('status'), render: (value: string) => (
        <div className="flex items-center gap-2">
          {getStatusIcon(value)}
          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(value)}`}>{t(value) || value.charAt(0).toUpperCase() + value.slice(1)}</span>
        </div>
      )
    },
    {
      key: 'bankInfo', label: t('bankQr'), render: (_: any, row: Payout) => row.bankInfo?.bankQrPath ? (
        <button onClick={() => { setSelectedQr(`/storage/${row.bankInfo.bankQrPath}`); setShowQrModal(true); }} className="p-2 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 cursor-pointer">
          <QrCode className="w-4 h-4" />
        </button>
      ) : <span className="text-zinc-400">{t('noQr')}</span>
    },
    { key: 'createdAt', label: t('created'), render: (value: string) => new Date(value).toLocaleDateString() },
    {
      key: 'actions', label: t('actions'), render: (_: any, row: Payout) => row.status === 'pending' ? (
        <div className="flex gap-2">
          <button onClick={() => { setProcessingPayout(row); setSelectedQr(row.bankInfo?.bankQrPath ? `/storage/${row.bankInfo.bankQrPath}` : null); }} className="px-3 py-1 text-green-600 border-green-600 rounded text-sm hover:bg-green-700 hover:text-white cursor-pointer">{t('process')}</button>
          <button onClick={() => handleCancelPayout(row.payoutId)} className="px-3 py-1 text-red-600 border-red-600 rounded text-sm hover:bg-red-700 hover:text-white cursor-pointer">{t('cancel')}</button>
        </div>
      ) : row.processedAt ? <span className="text-xs text-zinc-500">{new Date(row.processedAt).toLocaleDateString()}</span> : null
    },
  ];
  return (
    <Layout user={user}>
      <Head title={t('payoutManagement')} />
      <div className="flex bg-zinc-50 dark:bg-black min-h-screen">
        <AdminSidebar currentPath="/admin/payouts" />
        <div className="flex-1">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl text-black dark:text-white mb-2">{t('payoutManagement')}</h1>
                <p className="text-zinc-600 dark:text-zinc-400">{t('managePayoutsSubtitle')}</p>
              </div>
              <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 cursor-pointer">
                <Wallet className="w-5 h-5" />
                {t('createPayout')}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{t('pendingPayouts')}</p>
                    <p className="text-3xl text-black dark:text-white mt-2">{t('currencySymbol')}{Number(stats.pendingPayouts || 0).toFixed(2)}</p>
                  </div>
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"><Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" /></div>
                </div>
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{t('completedPayouts')}</p>
                    <p className="text-3xl text-black dark:text-white mt-2">{t('currencySymbol')}{Number(stats.completedPayouts || 0).toFixed(2)}</p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"><CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" /></div>
                </div>
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{t('totalPayouts')}</p>
                    <p className="text-3xl text-black dark:text-white mt-2">{stats.totalPayouts}</p>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"><Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" /></div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} placeholder={t('searchInstructors')} className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white" />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white cursor-pointer">
                  <option value="">{t('allStatus')}</option>
                  <option value="pending">{t('pending')}</option>
                  <option value="processing">{t('processing')}</option>
                  <option value="completed">{t('completed')}</option>
                  <option value="failed">{t('failed')}</option>
                </select>
                <button onClick={handleSearch} className="flex items-center gap-2 px-6 py-2 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 cursor-pointer">
                  <Filter className="w-4 h-4" />
                  {t('filter')}
                </button>
              </div>
            </div>
            <DataTable columns={columns} data={payouts.data} keyField="payoutId" />
            {payouts.last_page > 1 && (
              <div className="mt-6 flex justify-center items-center gap-2">
                <button onClick={() => router.get('/admin/payouts', buildPaginationParams(1), { preserveState: true })} disabled={payouts.current_page === 1} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 disabled:opacity-50 cursor-pointer"><ChevronsLeft className="w-4 h-4" /></button>
                <button onClick={() => router.get('/admin/payouts', buildPaginationParams(payouts.current_page - 1), { preserveState: true })} disabled={payouts.current_page === 1} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 disabled:opacity-50 cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
                <span className="px-4 py-2 font-medium">{payouts.current_page} / {payouts.last_page}</span>
                <button onClick={() => router.get('/admin/payouts', buildPaginationParams(payouts.current_page + 1), { preserveState: true })} disabled={payouts.current_page === payouts.last_page} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 disabled:opacity-50 cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
                <button onClick={() => router.get('/admin/payouts', buildPaginationParams(payouts.last_page), { preserveState: true })} disabled={payouts.current_page === payouts.last_page} className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 disabled:opacity-50 cursor-pointer"><ChevronsRight className="w-4 h-4" /></button>
              </div>
            )}
          </div>
        </div>
      </div>
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-lg max-w-lg w-full mx-4">
            <h2 className="text-2xl text-black dark:text-white mb-6">{t('createPayout')}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">{t('selectInstructor')}</label>
                <select value={selectedInstructor?.userId || ''} onChange={(e) => { const inst = instructorBalances.find(i => i.userId === parseInt(e.target.value)) || null; setSelectedInstructor(inst); if (inst) setPayoutAmount(inst.balance.toString()); }} className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 cursor-pointer">
                  <option value="">{t('selectInstructorPlaceholder')}</option>
                  {instructorBalances.map(instructor => (
                    <option key={instructor.userId} value={instructor.userId}>{instructor.userName} - {t('balanceLabel')} {t('currencySymbol')}{instructor.balance.toFixed(2)}</option>
                  ))}
                </select>
              </div>
              {selectedInstructor && (
                <div className="border border-green-200 dark:border-green-800 p-4 rounded">
                  <p className="text-sm text-green-700 dark:text-green-300">{t('payoutAmount')}</p>
                  <p className="text-3xl text-green-600">{t('currencySymbol')}{selectedInstructor.balance.toFixed(2)}</p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">{t('fullBalancePaidOut')}</p>
                </div>
              )}
            </div>
            <div className="flex gap-4 mt-6">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer">{t('cancel')}</button>
              <button onClick={handleCreatePayout} disabled={!selectedInstructor} className="flex-1 px-4 py-2 bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 cursor-pointer">{t('payoutAll')}</button>
            </div>
          </div>
        </div>
      )}
      {showQrModal && selectedQr && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowQrModal(false)}>
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-lg max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl text-black dark:text-white mb-4">{t('bankQrCode')}</h2>
            <img src={selectedQr} alt={t('bankQr')} className="w-full max-h-96 object-contain rounded" />
            <button onClick={() => setShowQrModal(false)} className="w-full mt-4 px-4 py-2 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 cursor-pointer">{t('close')}</button>
          </div>
        </div>
      )}
      {processingPayout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-lg max-w-2xl w-full mx-4">
            <h2 className="text-2xl text-black dark:text-white mb-6">{t('processPayout')}</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded mb-4">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{t('instructor')}</p>
                  <p className="text-lg text-black dark:text-white">{processingPayout.instructor.userName}</p>
                </div>
                <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded mb-4">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{t('amountToTransfer')}</p>
                  <p className="text-3xl text-green-600">{t('currencySymbol')}{Number(processingPayout.amount).toFixed(2)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">{t('adminNotesOptional')}</label>
                  <textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100" rows={3} placeholder={t('transactionReferencePlaceholder')} />
                </div>
              </div>
              <div>
                {selectedQr ? (
                  <div>
                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">{t('scanToTransfer')}</p>
                    <img src={selectedQr} alt={t('bankQr')} className="w-full max-h-64 object-contain rounded border border-zinc-200 dark:border-zinc-700" />
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded">
                    <p className="text-zinc-500">{t('noQrCodeAvailable')}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button onClick={() => { setProcessingPayout(null); setAdminNotes(''); }} className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer">{t('cancel')}</button>
              <button onClick={handleProcessPayout} className="flex-1 px-4 py-2 text-green-600 border border-green-200 dark:border-green-800 hover:bg-green-900 hover:text-white cursor-pointer">
                <CheckCircle className="w-4 h-4 inline mr-2" />
                {t('markAsPaid')}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}