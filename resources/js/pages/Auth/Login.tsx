import { Head, useForm } from '@inertiajs/react';
import { LogIn, Mail, Lock } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import Layout from '../../components/Layout';
import useTranslation from '../../hooks/useTranslation';
export default function Login() {
  const { showToast } = useToast();
  const { t } = useTranslation();
  const { data, setData, post, processing, errors } = useForm({
    userEmail: '',
    password: '',
    remember: false,
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/login', {
      onError: (errors) => {
        if (errors.userEmail) {
          showToast(errors.userEmail, 'error');
        } else if (Object.keys(errors).length > 0) {
          showToast(t('loginFailed'), 'error');
        }
      },
      onSuccess: (response) => {
        if (response.component === 'Login') {
          showToast(t('invalidCredentials'), 'error');
        }
      }
    });
  };
  return (
    <Layout>
      <Head title={t('login')} />
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-zinc-50 dark:bg-black">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-black dark:bg-white mb-4">
              <LogIn className="w-8 h-8 text-white dark:text-black" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-black dark:text-white mb-2">
              {t('welcomeBack')}
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              {t('loginSubtitle')}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                {t('emailAddress')}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input
                  type="email"
                  value={data.userEmail}
                  onChange={(e) => setData('userEmail', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  placeholder={t('emailPlaceholder')}
                  required
                />
              </div>
              {errors.userEmail && (
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{errors.userEmail}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                {t('password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input
                  type="password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  placeholder={t('passwordPlaceholder')}
                  required
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{errors.password}</p>
              )}
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={data.remember}
                onChange={(e) => setData('remember', e.target.checked)}
                className="w-4 h-4 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black focus:ring-black dark:focus:ring-white cursor-pointer"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer">
                {t('rememberMe')}
              </label>
            </div>
            <div className="flex items-center justify-end">
              <a href="/forgotPassword" className="text-sm text-black dark:text-white hover:underline">
                {t('forgotPassword')}
              </a>
            </div>
            <button
              type="submit"
              disabled={processing}
              className="w-full py-3 px-4 bg-black dark:bg-white text-white dark:text-black font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {processing ? t('loggingIn') : t('login')}
            </button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-300 dark:border-zinc-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-zinc-900 text-zinc-500">{t('or')}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <a
                href="/oauth/google"
                className="flex items-center justify-center px-4 py-2.5 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors cursor-pointer">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                </svg>
                {t('google')}
              </a>
              <a
                href="/oauth/github"
                className="flex items-center justify-center px-4 py-2.5 border border-zinc-300 dark:border-zinc-700 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors cursor-pointer">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                {t('github')}
              </a>
            </div>
            <div className="text-center text-sm text-zinc-600 dark:text-zinc-400">
              {t('noAccount')}{' '}
              <a href="/register" className="text-black dark:text-white hover:underline font-medium">
                {t('signUp')}
              </a>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}