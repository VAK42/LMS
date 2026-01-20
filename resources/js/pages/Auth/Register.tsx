import { UserPlus, Mail, Lock, User, ChevronDown } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { useState, useRef, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import Layout from '../../components/Layout';
import useTranslation from '../../hooks/useTranslation';
export default function Register() {
  const { showToast } = useToast();
  const { t } = useTranslation();
  const { data, setData, post, processing, errors } = useForm({
    userName: '',
    userEmail: '',
    password: '',
    passwordConfirmation: '',
    role: 'learner',
  });
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const roleDropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/register', {
      onError: (errors) => {
        if (errors.userEmail) showToast(errors.userEmail, 'error');
        if (errors.password) showToast(errors.password, 'error');
      },
      onSuccess: (response) => {
        if (response.component === 'Register') {
          showToast(t('registrationFailed'), 'error');
        }
      }
    });
  };
  const handleRoleSelect = (role: string) => {
    setData('role', role as 'learner' | 'instructor');
    setRoleDropdownOpen(false);
  };
  return (
    <Layout>
      <Head title={t('registerTitle')} />
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-zinc-50 dark:bg-black">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-950 text-white rounded mb-4">
              <UserPlus className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-serif text-green-950 dark:text-white mb-2">
              {t('createAccount')}
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              {t('registerSubtitle')}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-lg shadow-sm">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                {t('fullName')}
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input type="text" value={data.userName} onChange={(e) => setData('userName', e.target.value)} className="w-full pl-12 pr-4 py-3 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-green-950 dark:focus:border-white transition-colors rounded" placeholder={t('namePlaceholder')} required />
              </div>
              {errors.userName && (
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{errors.userName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                {t('emailAddress')}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input type="email" value={data.userEmail} onChange={(e) => setData('userEmail', e.target.value)} className="w-full pl-12 pr-4 py-3 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-green-950 dark:focus:border-white transition-colors rounded" placeholder={t('emailPlaceholder')} required />
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
                <input type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} className="w-full pl-12 pr-4 py-3 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-green-950 dark:focus:border-white transition-colors rounded" placeholder={t('passwordPlaceholder')} required />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{errors.password}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                {t('confirmPassword')}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input type="password" value={data.passwordConfirmation} onChange={(e) => setData('passwordConfirmation', e.target.value)} className="w-full pl-12 pr-4 py-3 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-green-950 dark:focus:border-white transition-colors rounded" placeholder={t('passwordPlaceholder')} required />
              </div>
              {errors.passwordConfirmation && (
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{errors.passwordConfirmation}</p>
              )}
            </div>
            <div className="relative" ref={roleDropdownRef}>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                {t('iWantTo')}
              </label>
              <button
                type="button"
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-left focus:outline-none focus:border-green-950 dark:focus:border-white transition-colors rounded flex items-center justify-between cursor-pointer"
              >
                <span>{data.role === 'learner' ? t('learnerOption') : t('instructorOption')}</span>
                <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${roleDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {roleDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-900 border border-green-950 dark:border-white rounded shadow-lg overflow-hidden">
                  <div
                    onClick={() => handleRoleSelect('learner')}
                    className="px-4 py-3 text-zinc-900 dark:text-zinc-100 hover:bg-green-950 hover:text-white dark:hover:bg-green-950 dark:hover:text-white cursor-pointer transition-colors"
                  >
                    {t('learnerOption')}
                  </div>
                  <div
                    onClick={() => handleRoleSelect('instructor')}
                    className="px-4 py-3 text-zinc-900 dark:text-zinc-100 hover:bg-green-950 hover:text-white dark:hover:bg-green-950 dark:hover:text-white cursor-pointer transition-colors"
                  >
                    {t('instructorOption')}
                  </div>
                </div>
              )}
            </div>
            <button type="submit" disabled={processing} className="w-full py-3 px-4 bg-green-950 text-white border border-green-950 font-medium hover:bg-white hover:text-green-950 dark:bg-white dark:text-green-950 dark:border-white dark:hover:bg-green-950 dark:hover:text-white dark:hover:border-green-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded uppercase tracking-wide">
              {processing ? t('creatingAccount') : t('createAccount')}
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
              <a href="/oauth/google" className="flex items-center justify-center px-4 py-2.5 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors cursor-pointer rounded">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                </svg>
                {t('google')}
              </a>
              <a href="/oauth/github" className="flex items-center justify-center px-4 py-2.5 border border-zinc-300 dark:border-zinc-700 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors cursor-pointer rounded">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                {t('github')}
              </a>
            </div>
            <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
              {t('alreadyHaveAccount')}{' '}
              <a href="/login" className="text-green-950 dark:text-white font-medium hover:underline">
                {t('signIn')}
              </a>
            </p>
          </form>
        </div>
      </div>
    </Layout>
  )
}