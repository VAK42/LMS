import { Wallet, DollarSign, TrendingUp, Clock, Upload, Edit2, Check, X } from 'lucide-react';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import Layout from '../../components/Layout';
import useTranslation from '../../hooks/useTranslation';
interface LedgerEntry {
  ledgerId: number;
  type: string;
  amount: number;
  balanceAfter: number;
  description: string;
  createdAt: string;
  transaction?: { course?: { courseTitle: string } };
  payout?: { payoutId: number; status: string };
}
interface Props {
  wallet: {
    balance: number;
    pendingBalance: number;
    totalEarnings: number;
  };
  recentTransactions: LedgerEntry[];
  payoutStats: {
    pending: number;
    completed: number;
  };
  bankInfo: {
    bankQrPath: string | null;
    bankName: string | null;
    bankAccountNumber: string | null;
    bankAccountName: string | null;
  };
  user: any;
}
export default function InstructorEarnings({ wallet, recentTransactions, payoutStats, bankInfo, user }: Props) {
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [bankName, setBankName] = useState(bankInfo.bankName || '');
  const [bankAccountNumber, setBankAccountNumber] = useState(bankInfo.bankAccountNumber || '');
  const [bankAccountName, setBankAccountName] = useState(bankInfo.bankAccountName || '');
  const [displayedBankInfo, setDisplayedBankInfo] = useState(bankInfo);
  const [uploading, setUploading] = useState(false);
  const handleSaveBankInfo = async () => {
    try {
      const response = await fetch('/api/instructor/bankInfo', {
        method: 'PUT',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        },
        body: JSON.stringify({ bankName, bankAccountNumber, bankAccountName }),
      });
      if (response.status === 419) { window.location.reload(); return; }
      if (!response.ok) throw new Error(t('failedToUpdate'));
      setDisplayedBankInfo({ ...displayedBankInfo, bankName, bankAccountNumber, bankAccountName });
      showToast(t('bankInfoUpdated'), 'success');
      setIsEditingBank(false);
    } catch (error) {
      showToast(t('failedToUpdateBankInfo'), 'error');
    }
  };
  const handleUploadQr = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('bankQr', file);
      const response = await fetch('/api/instructor/bankQr', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        },
        body: formData,
      });
      if (response.status === 419) { window.location.reload(); return; }
      if (!response.ok) throw new Error(t('failedToUpload'));
      const data = await response.json();
      setDisplayedBankInfo({ ...displayedBankInfo, bankQrPath: data.path });
      showToast(t('bankQrUploaded'), 'success');
    } catch (error) {
      showToast(t('failedToUploadQr'), 'error');
    } finally {
      setUploading(false);
    }
  };
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'credit': return 'text-green-600 dark:text-green-400';
      case 'payout': return 'text-red-600 dark:text-red-400';
      default: return 'text-zinc-600 dark:text-zinc-400';
    }
  };
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'credit': return '+';
      case 'payout': return '-';
      default: return '';
    }
  };
  return (
    <Layout user={user}>
      <Head title={t('myEarnings')} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-serif text-green-950 dark:text-white mb-2">{t('myEarnings')}</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">{t('earningsSubtitle')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-zinc-900 border border-green-950 dark:border-white p-6 rounded">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{t('availableBalance')}</p>
                <p className="text-3xl text-green-950 dark:text-white mt-2">{t('currencySymbol')}{wallet.balance.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-zinc-800 border border-green-950 dark:border-white rounded"><Wallet className="w-6 h-6 text-green-950 dark:text-white" /></div>
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-green-950 dark:border-white p-6 rounded">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{t('totalEarnings')}</p>
                <p className="text-3xl text-green-950 dark:text-white mt-2">{t('currencySymbol')}{wallet.totalEarnings.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-zinc-800 border border-green-950 dark:border-white rounded"><TrendingUp className="w-6 h-6 text-green-950 dark:text-white" /></div>
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-green-950 dark:border-white p-6 rounded">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{t('pendingPayouts')}</p>
                <p className="text-3xl text-green-950 dark:text-white mt-2">{t('currencySymbol')}{payoutStats.pending.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-zinc-800 border border-green-950 dark:border-white rounded"><Clock className="w-6 h-6 text-green-950 dark:text-white" /></div>
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-green-950 dark:border-white p-6 rounded">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{t('totalPaidOut')}</p>
                <p className="text-3xl text-green-950 dark:text-white mt-2">{t('currencySymbol')}{payoutStats.completed.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-zinc-800 border border-green-950 dark:border-white rounded"><DollarSign className="w-6 h-6 text-green-950 dark:text-white" /></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-zinc-900 border border-green-950 dark:border-white rounded p-6">
              <h2 className="text-xl text-green-950 dark:text-white mb-6">{t('recentTransactions')}</h2>
              {recentTransactions.length === 0 ? (
                <p className="text-zinc-500 text-center py-8">{t('noTransactionsYet')}</p>
              ) : (
                <div className="space-y-4">
                  {recentTransactions.map((entry) => (
                    <div key={entry.ledgerId} className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors px-2 rounded">
                      <div>
                        <p className="text-green-950 dark:text-white">{entry.description}</p>
                        <p className="text-sm text-zinc-500 font-medium">{new Date(entry.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className={`${getTypeColor(entry.type)}`}>{getTypeIcon(entry.type)}{t('currencySymbol')}{Number(entry.amount).toFixed(2)}</p>
                        <p className="text-xs text-zinc-500 font-medium">{t('balanceLabel')} {t('currencySymbol')}{Number(entry.balanceAfter).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div>
            <div className="bg-white dark:bg-zinc-900 border border-green-950 dark:border-white rounded p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl text-green-950 dark:text-white">{t('bankInfo')}</h2>
                {!isEditingBank && (
                  <button onClick={() => setIsEditingBank(true)} className="p-2 text-zinc-600 hover:text-green-950 dark:text-zinc-400 dark:hover:text-white cursor-pointer"><Edit2 className="w-4 h-4" /></button>
                )}
              </div>
              <div className="mb-6">
                <p className="text-sm text-green-950 dark:text-white mb-2">{t('bankQrCode')}</p>
                {displayedBankInfo.bankQrPath ? (
                  <img src={`/storage/${displayedBankInfo.bankQrPath}`} alt={t('bankQr')} className="w-full max-h-48 object-contain rounded border border-zinc-200 dark:border-zinc-700" />
                ) : (
                  <div className="w-full h-48 bg-zinc-100 dark:bg-zinc-800 rounded flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
                    <p className="text-zinc-500 font-medium">{t('noQrUploaded')}</p>
                  </div>
                )}
                <label className="mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-green-950 dark:text-white rounded cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-transparent font-medium transition-colors">
                  <Upload className="w-4 h-4" />
                  {uploading ? t('uploading') : t('uploadQr')}
                  <input type="file" accept="image/*" onChange={handleUploadQr} className="hidden" disabled={uploading} />
                </label>
              </div>
              {isEditingBank ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-green-950 dark:text-white mb-1">{t('bankName')}</label>
                    <input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} className="w-full px-3 py-2 border border-green-950 dark:border-white bg-white dark:bg-zinc-900 text-green-950 dark:text-white rounded focus:outline-none focus:ring-1 focus:ring-green-950 dark:focus:ring-white" placeholder={t('bankNamePlaceholder')} />
                  </div>
                  <div>
                    <label className="block text-sm text-green-950 dark:text-white mb-1">{t('accountNumber')}</label>
                    <input type="text" value={bankAccountNumber} onChange={(e) => setBankAccountNumber(e.target.value)} className="w-full px-3 py-2 border border-green-950 dark:border-white bg-white dark:bg-zinc-900 text-green-950 dark:text-white rounded focus:outline-none focus:ring-1 focus:ring-green-950 dark:focus:ring-white" placeholder={t('accountNumberPlaceholder')} />
                  </div>
                  <div>
                    <label className="block text-sm text-green-950 dark:text-white mb-1">{t('accountName')}</label>
                    <input type="text" value={bankAccountName} onChange={(e) => setBankAccountName(e.target.value)} className="w-full px-3 py-2 border border-green-950 dark:border-white bg-white dark:bg-zinc-900 text-green-950 dark:text-white rounded focus:outline-none focus:ring-1 focus:ring-green-950 dark:focus:ring-white" placeholder={t('accountNamePlaceholder')} />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setIsEditingBank(false)} className="flex-1 px-4 py-2 border border-green-950 dark:border-white text-green-950 dark:text-white rounded hover:bg-green-50 dark:hover:bg-zinc-800 cursor-pointer font-medium">{t('cancel')}</button>
                    <button onClick={handleSaveBankInfo} className="flex-1 px-4 py-2 bg-green-950 dark:bg-white text-white dark:text-green-950 rounded hover:bg-white hover:text-green-950 hover:border-green-950 dark:hover:bg-green-950 dark:hover:text-white dark:hover:border-green-950 border border-transparent cursor-pointer transition-colors">{t('save')}</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700">
                    <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-1">{t('bankName')}</p>
                    <p className="text-green-950 dark:text-white text-lg">{displayedBankInfo.bankName || t('notSet')}</p>
                  </div>
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700">
                    <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-1">{t('accountNumber')}</p>
                    <p className="text-green-950 dark:text-white text-lg font-mono">{displayedBankInfo.bankAccountNumber || t('notSet')}</p>
                  </div>
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700">
                    <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-1">{t('accountName')}</p>
                    <p className="text-green-950 dark:text-white text-lg">{displayedBankInfo.bankAccountName || t('notSet')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}