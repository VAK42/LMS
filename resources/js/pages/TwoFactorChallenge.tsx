import { Head, useForm } from '@inertiajs/react';
import { Shield } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import Layout from '../components/Layout';
export default function TwoFactorChallenge() {
  const { showToast } = useToast();
  const [useRecoveryCode, setUseRecoveryCode] = useState(false);
  const { data, setData, post, processing, errors } = useForm({ code: '' });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/twoFactorChallenge', {
      onError: (errors) => {
        if (errors.code) {
          showToast(errors.code, 'error');
        } else if (Object.keys(errors).length > 0) {
          showToast('Verification Failed!', 'error');
        }
      },
      onSuccess: (response) => {
        if (response.component === 'TwoFactorChallenge') {
          showToast('Invalid Code!', 'error');
        }
      }
    });
  };
  return (
    <Layout>
      <Head title="Two-Factor Challenge" />
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-zinc-50 dark:bg-black">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-black dark:bg-white mb-4">
              <Shield className="w-8 h-8 text-white dark:text-black" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-black dark:text-white mb-2">
              Two-Factor Authentication
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              {useRecoveryCode ? 'Enter One Of Your Recovery Codes' : 'Enter The 6-Digit Code From Your Authenticator App'}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                {useRecoveryCode ? 'Recovery Code' : 'Authentication Code'}
              </label>
              <input
                type="text"
                value={data.code}
                onChange={(e) => setData('code', useRecoveryCode ? e.target.value : e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-center text-2xl tracking-widest font-mono focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                placeholder={useRecoveryCode ? 'xxxxxxxxxx' : '000000'}
                maxLength={useRecoveryCode ? 10 : 6}
                required
              />
              {errors.code && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.code}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={processing || (!useRecoveryCode && data.code.length !== 6) || (useRecoveryCode && data.code.length !== 10)}
              className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Verifying...' : 'Verify Code'}
            </button>
            <div className="text-center text-sm">
              <button
                type="button"
                onClick={() => {
                  setUseRecoveryCode(!useRecoveryCode);
                  setData('code', '');
                }}
                className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white underline cursor-pointer"
              >
                {useRecoveryCode ? 'Use Authenticator Code Instead' : 'Use A Recovery Code Instead'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}