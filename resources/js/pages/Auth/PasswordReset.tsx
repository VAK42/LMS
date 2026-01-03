import { Head, useForm } from '@inertiajs/react';
import { Lock, Key, Mail } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import Layout from '../components/Layout';
export default function PasswordReset() {
  const { showToast } = useToast();
  const { data, setData, post, processing, errors } = useForm({
    userEmail: '',
    code: '',
    password: '',
    passwordConfirmation: '',
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/passwordReset', {
      onError: (errors) => {
        if (errors.code) showToast(errors.code, 'error');
        if (errors.userEmail) showToast(errors.userEmail, 'error');
        if (errors.password) showToast(errors.password, 'error');
      },
      onSuccess: () => {
        showToast('Password Reset Successfully!', 'success');
      }
    });
  };
  return (
    <Layout>
      <Head title="Reset Password" />
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-zinc-50 dark:bg-black">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-black dark:bg-white mb-4">
              <Key className="w-8 h-8 text-white dark:text-black" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-black dark:text-white mb-2">
              Reset Your Password
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Enter The 6-Digit Code Sent To Your Email
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input
                  type="email"
                  value={data.userEmail}
                  onChange={(e) => setData('userEmail', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  placeholder="you@example.com"
                  required
                />
              </div>
              {errors.userEmail && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.userEmail}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Reset Code
              </label>
              <input
                type="text"
                value={data.code}
                onChange={(e) => setData('code', e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-center text-2xl tracking-widest font-mono focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                placeholder="000000"
                maxLength={6}
                required
              />
              {errors.code && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.code}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input
                  type="password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  placeholder="Minimum 8 Characters"
                  required
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input
                  type="password"
                  value={data.passwordConfirmation}
                  onChange={(e) => setData('passwordConfirmation', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  placeholder="Retype Password"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={processing || data.code.length !== 6}
              className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  )
}