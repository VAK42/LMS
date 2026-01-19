import { Shield, Key, Download, User, Mail, Lock, Save, Pencil, X } from 'lucide-react';
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
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [userName, setUserName] = useState(user.userName);
  const [userEmail, setUserEmail] = useState(user.userEmail);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const hasTwoFactor = user.twoFactorSecret && user.twoFactorConfirmedAt;
  const handleCancelProfileEdit = () => {
    setUserName(user.userName);
    setUserEmail(user.userEmail);
    setEditingProfile(false);
  };
  const handleCancelPasswordEdit = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setEditingPassword(false);
  };
  const handleUpdateProfile = async () => {
    if (!userName.trim() || !userEmail.trim()) {
      showToast(t('fillAllFields'), 'error');
      return;
    }
    setSavingProfile(true);
    try {
      const response = await fetch('/api/settings/profile', {
        method: 'PUT',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({ userName, userEmail }),
      });
      if (response.status === 419) { window.location.reload(); return; }
      const data = await response.json();
      if (response.ok) {
        showToast(t('profileUpdatedSuccess'), 'success');
        setEditingProfile(false);
        setTimeout(() => router.reload(), 1500);
      } else {
        showToast(data.error || t('profileUpdateFailed'), 'error');
      }
    } catch (error) {
      showToast(t('errorOccurred'), 'error');
    } finally {
      setSavingProfile(false);
    }
  };
  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword) {
      showToast(t('fillAllFields'), 'error');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      showToast(t('passwordsDoNotMatch'), 'error');
      return;
    }
    if (newPassword.length < 8) {
      showToast(t('passwordMinLength'), 'error');
      return;
    }
    setSavingPassword(true);
    try {
      const response = await fetch('/api/settings/password', {
        method: 'PUT',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (response.status === 419) { window.location.reload(); return; }
      const data = await response.json();
      if (response.ok) {
        showToast(t('passwordUpdatedSuccess'), 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setEditingPassword(false);
      } else {
        showToast(data.error || t('passwordUpdateFailed'), 'error');
      }
    } catch (error) {
      showToast(t('errorOccurred'), 'error');
    } finally {
      setSavingPassword(false);
    }
  };
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
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8">
            <div className="flex items-start gap-4">
              <User className="w-8 h-8 text-black dark:text-white flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-serif font-bold text-black dark:text-white">
                    {t('profileInformation')}
                  </h2>
                  {!editingProfile && (
                    <button
                      onClick={() => setEditingProfile(true)}
                      className="cursor-pointer flex items-center gap-2 px-4 py-2 text-sm border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                      {t('edit')}
                    </button>
                  )}
                </div>
                {!editingProfile ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-zinc-400" />
                      <div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{t('fullName')}</p>
                        <p className="text-zinc-900 dark:text-zinc-100 font-medium">{user.userName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-zinc-400" />
                      <div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{t('emailAddress')}</p>
                        <p className="text-zinc-900 dark:text-zinc-100 font-medium">{user.userEmail}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        {t('fullName')}
                      </label>
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-zinc-400" />
                        <input
                          type="text"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white"
                          placeholder={t('namePlaceholder')}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        {t('emailAddress')}
                      </label>
                      <div className="flex items-center gap-2">
                        <Mail className="w-5 h-5 text-zinc-400" />
                        <input
                          type="email"
                          value={userEmail}
                          onChange={(e) => setUserEmail(e.target.value)}
                          className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white"
                          placeholder={t('emailPlaceholder')}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdateProfile}
                        disabled={savingProfile}
                        className="cursor-pointer flex items-center gap-2 px-6 py-2 bg-black dark:bg-white text-white dark:text-black font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save className="w-4 h-4" />
                        {savingProfile ? t('saving') : t('save')}
                      </button>
                      <button
                        onClick={handleCancelProfileEdit}
                        className="cursor-pointer flex items-center gap-2 px-6 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                        {t('cancel')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8">
            <div className="flex items-start gap-4">
              <Lock className="w-8 h-8 text-black dark:text-white flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-serif font-bold text-black dark:text-white">
                    {t('changePassword')}
                  </h2>
                  {!editingPassword && (
                    <button
                      onClick={() => setEditingPassword(true)}
                      className="cursor-pointer flex items-center gap-2 px-4 py-2 text-sm border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                      {t('edit')}
                    </button>
                  )}
                </div>
                {!editingPassword ? (
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-zinc-400" />
                    <div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">{t('password')}</p>
                      <p className="text-zinc-900 dark:text-zinc-100 font-medium">••••••••</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        {t('currentPassword')}
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full max-w-md px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white"
                        placeholder={t('passwordPlaceholder')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        {t('newPassword')}
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full max-w-md px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white"
                        placeholder={t('passwordPlaceholder')}
                      />
                      <p className="text-xs text-zinc-500 mt-1">{t('passwordMinLength')}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        {t('confirmPassword')}
                      </label>
                      <input
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="w-full max-w-md px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white"
                        placeholder={t('passwordPlaceholder')}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdatePassword}
                        disabled={savingPassword}
                        className="cursor-pointer flex items-center gap-2 px-6 py-2 bg-black dark:bg-white text-white dark:text-black font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Lock className="w-4 h-4" />
                        {savingPassword ? t('saving') : t('updatePassword')}
                      </button>
                      <button
                        onClick={handleCancelPasswordEdit}
                        className="cursor-pointer flex items-center gap-2 px-6 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                        {t('cancel')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8">
            <div className="flex items-start gap-4">
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
                    className="cursor-pointer px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
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
                          placeholder={t('verificationCodePlaceholder')}
                          maxLength={6}
                        />
                        <button
                          onClick={handleConfirm2FA}
                          disabled={confirmCode.length !== 6}
                          className="cursor-pointer px-6 py-2 bg-black dark:bg-white text-white dark:text-black font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                          a.download = `${t('recoveryCodesFilename')}.txt`;
                          a.click();
                          showToast(t('recoveryCodesDownloaded'), 'success');
                        }}
                        className="cursor-pointer mt-4 flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors"
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
                          className="cursor-pointer px-6 py-2 bg-zinc-800 dark:bg-zinc-700 text-white font-bold hover:bg-zinc-900 dark:hover:bg-zinc-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
      </div>
    </Layout>
  )
}