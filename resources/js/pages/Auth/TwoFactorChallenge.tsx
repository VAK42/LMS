import { Shield, Smartphone, Key } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { useState, useRef, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import Layout from '../../components/Layout';
import useTranslation from '../../hooks/useTranslation';
export default function TwoFactorChallenge() {
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [recovery, setRecovery] = useState(false);
  const { data, setData, post, processing, errors } = useForm({
    code: '',
  });
  const codeInput = useRef<HTMLInputElement>(null);
  const recoveryCodeInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (recovery) {
      recoveryCodeInput.current?.focus();
    } else {
      codeInput.current?.focus();
    }
  }, [recovery]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/twoFactorChallenge', {
      onError: () => {
        showToast(t('invalidCode'), 'error');
      }
    });
  };
  const toggleRecovery = () => {
    setRecovery(!recovery);
    setData({ code: '' });
  };
  return (
    <Layout>
      <Head title={t('twoFactorAuth')} />
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-zinc-50 dark:bg-black">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-950 text-white rounded mb-4">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-serif text-green-950 dark:text-white mb-2">
              {t('twoFactorAuth')}
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              {recovery ? t('enterRecoveryCode') : t('enterAuthenticatorCode')}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-lg">
            <div className="space-y-4">
              {recovery ? (
                <div>
                  <label className="block text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                    {t('recoveryCodeLabel')}
                  </label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    <input ref={recoveryCodeInput} type="text" value={data.code} onChange={(e) => setData('code', e.target.value)} className="w-full pl-12 pr-4 py-3 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-green-950 dark:focus:border-white transition-colors rounded" placeholder="XXXXXXXX-XXXXXXXX" />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                    {t('authCodeLabel')}
                  </label>
                  <div className="relative">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    <input ref={codeInput} type="text" inputMode="numeric" pattern="[0-9]*" value={data.code} onChange={(e) => setData('code', e.target.value)} className="w-full pl-12 pr-4 py-3 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-green-950 dark:focus:border-white transition-colors rounded text-center tracking-widest text-lg font-mono" placeholder="000 000" maxLength={6} />
                  </div>
                </div>
              )}
            </div>
            {Object.keys(errors).length > 0 && (
              <p className="text-sm text-red-600 dark:text-red-400 text-center">{t('invalidCodeDetails')}</p>
            )}
            <button type="submit" disabled={processing} className="w-full py-3 px-4 bg-green-950 text-white border border-green-950 hover:bg-white hover:text-green-950 dark:bg-white dark:text-green-950 dark:border-white dark:hover:bg-green-950 dark:hover:text-white dark:hover:border-green-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded uppercase tracking-wide">
              {processing ? t('verifying') : t('login')}
            </button>
            <div className="text-center">
              <button type="button" onClick={toggleRecovery} className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-green-950 dark:hover:text-white transition-colors cursor-pointer underline">
                {recovery ? t('useAuthCode') : t('useRecoveryCode')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}