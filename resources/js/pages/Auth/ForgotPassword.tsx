import { Mail, ArrowLeft, KeyRound } from 'lucide-react';
import { Head, useForm, Link } from '@inertiajs/react';
import { useToast } from '../../contexts/ToastContext';
import Layout from '../../components/Layout';
import useTranslation from '../../hooks/useTranslation';
export default function ForgotPassword({ status }: { status?: string }) {
  const { showToast } = useToast();
  const { t } = useTranslation();
  const { data, setData, post, processing, errors } = useForm({
    email: '',
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/forgotPassword', {
      onSuccess: () => {
        showToast(t('resetCodeSent'), 'success');
      },
      onError: (errors) => {
        if (errors.email) {
          showToast(errors.email, 'error');
        }
      }
    });
  };
  return (
    <Layout>
      <Head title={t('forgotPassword')} />
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-zinc-50 dark:bg-black">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-950 text-white rounded mb-4">
              <KeyRound className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-serif text-green-950 dark:text-white mb-2">
              {t('resetPassword')}
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              {t('forgotPasswordSubtitle')}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-lg">
            {status && (
              <div className="p-4 bg-green-50 dark:bg-zinc-800 text-green-950 dark:text-green-400 rounded border border-green-200 dark:border-green-900">
                {status}
              </div>
            )}
            <div>
              <label className="block text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                {t('emailAddress')}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className="w-full pl-12 pr-4 py-3 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-green-950 dark:focus:border-white transition-colors rounded" placeholder={t('emailPlaceholder')} required />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{errors.email}</p>
              )}
            </div>
            <button type="submit" disabled={processing} className="w-full py-3 px-4 bg-green-950 text-white border border-green-950 hover:bg-white hover:text-green-950 dark:bg-white dark:text-green-950 dark:border-white dark:hover:bg-green-950 dark:hover:text-white dark:hover:border-green-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded uppercase tracking-wide">
              {processing ? t('sending') : t('sendResetCode')}
            </button>
            <div className="text-center">
              <Link href="/login" className="inline-flex items-center text-sm text-zinc-600 dark:text-zinc-400 hover:text-green-950 dark:hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('backToLogin')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}