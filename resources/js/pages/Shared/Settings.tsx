import { Shield, Key, Download } from 'lucide-react';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import Layout from '../../components/Layout';
import useTranslation from '../../hooks/useTranslation';
interface SettingsProps {
  user: {
    userId: number;
    userName: string;
    userEmail: string;
    role: string;
    twoFactorSecret: string | null;
    twoFactorConfirmedAt: string | null;
  };
}
export default function Settings({ user }: SettingsProps) {
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [confirmCode, setConfirmCode] = useState('');
  const [disablePassword, setDisablePassword] = useState('');
  const hasTwoFactor = user.twoFactorSecret && user.twoFactorConfirmedAt;
  const handleEnable2FA = async () => {
    try {
      const response = await fetch('/user/twoFactorAuthentication', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });
      if (response.status === 419) { window.location.reload(); return; }
      const data = await response.json();
      if (response.ok) {
        setQrCode(data.qrCode);
        setSecret(data.secret);
        setRecoveryCodes(data.recoveryCodes);
        showToast(t('2faSetupStarted'), 'success');
      } else {
        showToast(data.error || t('enable2faFailed'), 'error');
      }
    } catch (error) {
      showToast(t('errorOccurred'), 'error');
    }
  };
  const handleConfirm2FA = async () => {
    try {
      const response = await fetch('/user/confirmedTwoFactorAuthentication', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({ code: confirmCode }),
      });
      if (response.status === 419) { window.location.reload(); return; }
      const data = await response.json();
      if (response.ok) {
        showToast(t('2faEnabledSuccess'), 'success');
        setTimeout(() => router.reload(), 1500);
      } else {
        showToast(data.error || t('invalidCode'), 'error');
      }
    } catch (error) {
      showToast(t('errorOccurred'), 'error');
    }
  };
  const handleDisable2FA = async () => {
    try {
      const response = await fetch('/user/twoFactorAuthentication', {
        method: 'DELETE',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({ password: disablePassword }),
      });
      if (response.status === 419) { window.location.reload(); return; }
      const data = await response.json();
      if (response.ok) {
        showToast(t('2faDisabledSuccess'), 'success');
        setTimeout(() => router.reload(), 1500);
      } else {
        showToast(data.error || t('disable2faFailed'), 'error');
      }
    } catch (error) {
      showToast(t('errorOccurred'), 'error');
    }
  };
  return (
    <Layout user={user}>
      <Head title={t('settings')} />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-serif font-bold text-black dark:text-white mb-8">
          {t('accountSettings')}
        </h1>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8">
          <div className="flex items-start gap-4 mb-6">
            <Shield className="w-8 h-8 text-black dark:text-white flex-shrink-0" />
            <div className="flex-1">
              <h2 className="text-xl font-serif font-bold text-black dark:text-white mb-2">
                {t('twoFactorAuth')}
              </h2>
              <div className="text-zinc-600 dark:text-zinc-400 mb-4">
                {t('twoFactorDesc')}
                {hasTwoFactor ? (
                  <div className="text-green-500">
                    {t('enabled')}
                  </div>
                ) : (
                  <div className="text-red-500">
                    {t('disabled')}
                  </div>
                )}
              </div>
              {!hasTwoFactor && !qrCode && (
                <button
                  onClick={handleEnable2FA}
                  className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
                >
                  {t('enable2FA')}
                </button>
              )}
              {qrCode && (
                <div className="mt-6 space-y-6">
                  <div>
                    <h3 className="font-bold text-black dark:text-white mb-2">
                      {t('step1ScanQr')}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                      {t('scanQrDesc')}
                    </p>
                    <div className="bg-white p-4 inline-block border border-zinc-200">
                      <img src={`data:image/svg+xml;base64,${qrCode}`} alt={t('qrCode')} className="w-48 h-48" />
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                      {t('secretKey')} <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1">{secret}</code>
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-black dark:text-white mb-2">
                      {t('step2Verify')}
                    </h3>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={confirmCode}
                        onChange={(e) => setConfirmCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="w-32 px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-center font-mono focus:outline-none focus:border-black dark:focus:border-white"
                        placeholder="000000"
                        maxLength={6}
                      />
                      <button
                        onClick={handleConfirm2FA}
                        disabled={confirmCode.length !== 6}
                        className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {t('confirm')}
                      </button>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-black dark:text-white mb-2 flex items-center gap-2">
                      <Key className="w-5 h-5" />
                      {t('recoveryCodes')}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                      {t('recoveryCodesDesc')}
                    </p>
                    <div className="bg-zinc-50 dark:bg-zinc-800 p-4 border border-zinc-200 dark:border-zinc-700 grid grid-cols-2 gap-2 font-mono text-sm">
                      {recoveryCodes.map((code, i) => (
                        <div key={i} className="text-zinc-900 dark:text-zinc-100">
                          {code}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        const text = recoveryCodes.join('\n');
                        const blob = new Blob([text], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = '2FARecoveryCodes.txt';
                        a.click();
                        showToast(t('recoveryCodesDownloaded'), 'success');
                      }}
                      className="mt-4 flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      {t('downloadRecoveryCodes')}
                    </button>
                  </div>
                </div>
              )}
              {hasTwoFactor && (
                <div className="mt-6 space-y-4">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {t('accountProtected')}
                  </p>
                  <div>
                    <h3 className="font-bold text-black dark:text-white mb-2">
                      {t('disable2FA')}
                    </h3>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={disablePassword}
                        onChange={(e) => setDisablePassword(e.target.value)}
                        className="flex-1 max-w-xs px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white"
                        placeholder={t('enterPasswordPlaceholder')}
                      />
                      <button
                        onClick={handleDisable2FA}
                        disabled={!disablePassword}
                        className="px-6 py-2 bg-zinc-800 dark:bg-zinc-700 text-white font-bold hover:bg-zinc-900 dark:hover:bg-zinc-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {t('disable2FA')}
                      </button>
                    </div>
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