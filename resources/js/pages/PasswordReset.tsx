import { Head, useForm } from '@inertiajs/react';
import { Key } from 'lucide-react';
interface Props {
  token: string;
}
export default function PasswordReset({ token }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    token: token,
    userEmail: '',
    password: '',
    passwordConfirmation: '',
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/password/reset');
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4">
      <Head title="Reset Password" />
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-6">
            <Key className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-center mb-2 text-slate-900 dark:text-white">Reset Password</h1>
          <p className="text-center text-slate-600 dark:text-slate-400 mb-8">Enter your new password below</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
              <input
                type="email"
                value={data.userEmail}
                onChange={(e) => setData('userEmail', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="you@example.com"
                required
              />
              {errors.userEmail && <p className="mt-1 text-sm text-red-600">{errors.userEmail}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">New Password</label>
              <input
                type="password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="••••••••"
                required
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Confirm Password</label>
              <input
                type="password"
                value={data.passwordConfirmation}
                onChange={(e) => setData('passwordConfirmation', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="••••••••"
                required
              />
              {errors.passwordConfirmation && <p className="mt-1 text-sm text-red-600">{errors.passwordConfirmation}</p>}
            </div>
            <button
              type="submit"
              disabled={processing}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}