import { Head, router } from '@inertiajs/react';
import { Shield, Key, Download } from 'lucide-react';
import Layout from '../components/Layout';
import { useState } from 'react';
import { useToast } from '../contexts/ToastContext';
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
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setQrCode(data.qrCode);
        setSecret(data.secret);
        setRecoveryCodes(data.recoveryCodes);
        showToast('2FA Setup Started! Scan The QR Code', 'success');
      } else {
        showToast(data.error || 'Failed To Enable 2FA', 'error');
      }
    } catch (error) {
      showToast('An Error Occurred', 'error');
    }
  };
  const handleConfirm2FA = async () => {
    try {
      const response = await fetch('/user/confirmedTwoFactorAuthentication', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({ code: confirmCode }),
      });
      const data = await response.json();
      if (response.ok) {
        showToast('2FA Enabled Successfully!', 'success');
        setTimeout(() => router.reload(), 1500);
      } else {
        showToast(data.error || 'Invalid Code', 'error');
      }
    } catch (error) {
      showToast('An Error Occurred', 'error');
    }
  };
  const handleDisable2FA = async () => {
    try {
      const response = await fetch('/user/twoFactorAuthentication', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({ password: disablePassword }),
      });
      const data = await response.json();
      if (response.ok) {
        showToast('2FA Disabled Successfully!', 'success');
        setTimeout(() => router.reload(), 1500);
      } else {
        showToast(data.error || 'Failed To Disable 2FA', 'error');
      }
    } catch (error) {
      showToast('An Error Occurred', 'error');
    }
  };
  return (
    <Layout user={user}>
      <Head title="Settings" />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-serif font-bold text-black dark:text-white mb-8">
          Account Settings
        </h1>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8">
          <div className="flex items-start gap-4 mb-6">
            <Shield className="w-8 h-8 text-black dark:text-white flex-shrink-0" />
            <div className="flex-1">
              <h2 className="text-xl font-serif font-bold text-black dark:text-white mb-2">
                Two-Factor Authentication
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Add An Extra Layer Of Security To Your Account
              </p>
              <div className={`inline-flex items-center gap-2 px-3 py-1 border mb-4 ${hasTwoFactor ? 'border-green-500 text-green-600 dark:text-green-400' : 'border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'}`}>
                <div className={`w-2 h-2 ${hasTwoFactor ? 'bg-green-500' : 'bg-zinc-400'}`}></div>
                {hasTwoFactor ? 'Enabled' : 'Disabled'}
              </div>
              {!hasTwoFactor && !qrCode && (
                <button
                  onClick={handleEnable2FA}
                  className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
                >
                  Enable Two-Factor Authentication
                </button>
              )}
              {qrCode && (
                <div className="mt-6 space-y-6">
                  <div>
                    <h3 className="font-bold text-black dark:text-white mb-2">
                      Step 1: Scan QR Code
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                      Scan This QR Code With Your Authenticator App (Google Authenticator, Authy, Etc.)
                    </p>
                    <div className="bg-white p-4 inline-block border border-zinc-200">
                      <img src={`data:image/svg+xml;base64,${qrCode}`} alt="QR Code" className="w-48 h-48" />
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                      Secret Key: <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1">{secret}</code>
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-black dark:text-white mb-2">
                      Step 2: Enter Verification Code
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
                        Confirm
                      </button>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-black dark:text-white mb-2 flex items-center gap-2">
                      <Key className="w-5 h-5" />
                      Recovery Codes
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                      Save These Recovery Codes In A Safe Place. Each Can Be Used Once If You Lose Access To Your Device.
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
                        showToast('Recovery Codes Downloaded!', 'success');
                      }}
                      className="mt-4 flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-black dark:hover:border-white transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download Recovery Codes
                    </button>
                  </div>
                </div>
              )}
              {hasTwoFactor && (
                <div className="mt-6 space-y-4">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Your Account Is Protected With Two-Factor Authentication.
                  </p>
                  <div>
                    <h3 className="font-bold text-black dark:text-white mb-2">
                      Disable 2FA
                    </h3>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={disablePassword}
                        onChange={(e) => setDisablePassword(e.target.value)}
                        className="flex-1 max-w-xs px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white"
                        placeholder="Enter Your Password"
                      />
                      <button
                        onClick={handleDisable2FA}
                        disabled={!disablePassword}
                        className="px-6 py-2 bg-zinc-800 dark:bg-zinc-700 text-white font-bold hover:bg-zinc-900 dark:hover:bg-zinc-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Disable 2FA
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