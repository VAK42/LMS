import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { DollarSign, CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react';
import Layout from '../../components/Layout';
import AdminSidebar from '../../components/Admin/Sidebar';
import DataTable from '../../components/Admin/DataTable';
import FilterPanel from '../../components/Admin/FilterPanel';
interface Transaction {
  transactionId: number;
  user: { userId: number; userName: string; userEmail: string };
  course: { courseId: number; courseTitle: string };
  amount: number;
  transactionStatus: string;
  paymentMethod: string;
  createdAt: string;
}
interface Props {
  transactions: {
    data: Transaction[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  filters: {
    search?: string;
    status?: string;
  };
  user: any;
}
export default function TransactionManagement({ transactions, filters, user }: Props) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');
  const handleSearch = () => {
    router.get('/admin/transactions', { search: searchTerm, status: statusFilter }, { preserveState: true });
  };
  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    router.get('/admin/transactions', {}, { preserveState: true });
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      default: return <DollarSign className="w-4 h-4 text-zinc-600" />;
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'failed': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-900/30 dark:text-zinc-400';
    }
  };
  const columns = [
    {
      key: 'transactionId',
      label: 'Transaction ID',
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
          <span className="font-mono">#{value}</span>
        </div>
      )
    },
    {
      key: 'user',
      label: 'User',
      render: (_: any, row: Transaction) => (
        <div>
          <p className="font-medium text-black dark:text-white">{row.user.userName}</p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">{row.user.userEmail}</p>
        </div>
      )
    },
    {
      key: 'course',
      label: 'Course',
      render: (_: any, row: Transaction) => (
        <p className="font-medium text-black dark:text-white">{row.course.courseTitle}</p>
      )
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (value: number) => (
        <span className="font-semibold text-black dark:text-white">${value.toFixed(2)}</span>
      )
    },
    {
      key: 'paymentMethod',
      label: 'Payment Method',
      render: (value: string) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded text-xs font-medium">
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
    {
      key: 'transactionStatus',
      label: 'Status',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-2">
          {getStatusIcon(value)}
          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(value)}`}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        </div>
      )
    },
    {
      key: 'createdAt',
      label: 'Date',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    }
  ];
  const totalRevenue = transactions.data
    .filter(t => t.transactionStatus === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  return (
    <Layout user={user}>
      <Head title="Transaction Management" />
      <div className="flex bg-zinc-50 dark:bg-black min-h-screen">
        <AdminSidebar currentPath="/admin/transactions" />
        <div className="flex-1">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-black dark:text-white mb-2">Transaction Management</h1>
              <p className="text-zinc-600 dark:text-zinc-400">View All Payment Transactions & Revenue</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Total Revenue</p>
                    <p className="text-3xl font-bold text-black dark:text-white mt-2">${totalRevenue.toFixed(2)}</p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Total Transactions</p>
                    <p className="text-3xl font-bold text-black dark:text-white mt-2">{transactions.data.length}</p>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Completed</p>
                    <p className="text-3xl font-bold text-black dark:text-white mt-2">
                      {transactions.data.filter(t => t.transactionStatus === 'completed').length}
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>
            </div>
            <FilterPanel onClear={handleClearFilters}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex-1">
                  <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} placeholder="Search By User Or Course..." className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white" />
                </div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white">
                  <option value="">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
                <button onClick={handleSearch} className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200">
                  Apply Filters
                </button>
              </div>
            </FilterPanel>
            <DataTable columns={columns} data={transactions.data} searchable={false} exportable={true} />
          </div>
        </div>
      </div>
    </Layout>
  )
}