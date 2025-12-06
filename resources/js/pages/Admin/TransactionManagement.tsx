import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { CheckCircle, XCircle, RefreshCw, Filter } from 'lucide-react';
import Layout from '../../components/Layout';
interface Transaction {
  transactionId: number;
  user: { userName: string; userEmail: string };
  course: { courseTitle: string };
  amount: number;
  transactionStatus: string;
  createdAt: string;
  isRefunded: boolean;
}
interface Props {
  transactions: { data: Transaction[] };
  filters: any;
  user: any;
}
export default function TransactionManagement({ transactions, filters, user }: Props) {
  const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<number | null>(null);
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    refunded: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200',
  };
  const handleApprove = (transactionId: number) => {
    fetch(`/api/admin/transactions/${transactionId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }).then(() => window.location.reload());
  };
  const handleReject = (transactionId: number) => {
    fetch(`/api/admin/transactions/${transactionId}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }).then(() => window.location.reload());
  };
  return (
    <Layout>
      <Head title="Transaction Management" />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Transaction Management</h1>
            <p className="text-slate-600 dark:text-slate-400">Approve, reject, and refund payment transactions</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-slate-600" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                <option value="all">All Transactions</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-900">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">User</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Course</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {transactions.data.map((transaction) => (
                    <tr key={transaction.transactionId} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium">#{transaction.transactionId}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium">{transaction.user?.userName}</div>
                        <div className="text-xs text-slate-500">{transaction.user?.userEmail}</div>
                      </td>
                      <td className="px-6 py-4 text-sm">{transaction.course?.courseTitle}</td>
                      <td className="px-6 py-4 text-sm font-semibold">${transaction.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[transaction.transactionStatus as keyof typeof statusColors]}`}>
                          {transaction.transactionStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">{new Date(transaction.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {transaction.transactionStatus === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(transaction.transactionId)}
                                className="p-2 bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 rounded-lg transition-colors"
                                title="Approve"
                              >
                                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                              </button>
                              <button
                                onClick={() => handleReject(transaction.transactionId)}
                                className="p-2 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 rounded-lg transition-colors"
                                title="Reject"
                              >
                                <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                              </button>
                            </>
                          )}
                          {transaction.transactionStatus === 'completed' && !transaction.isRefunded && (
                            <button
                              onClick={() => {
                                setSelectedTransaction(transaction.transactionId);
                                setShowRefundModal(true);
                              }}
                              className="p-2 bg-orange-100 hover:bg-orange-200 dark:bg-orange-900 dark:hover:bg-orange-800 rounded-lg transition-colors"
                              title="Refund"
                            >
                              <RefreshCw className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}