import { Head, useForm } from '@inertiajs/react';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import Layout from '../components/Layout';
export default function Register() {
  const { data, setData, post, processing, errors, transform } = useForm({
    userName: '',
    userEmail: '',
    password: '',
    passwordConfirmation: '',
    role: 'learner',
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/api/register');
  };
  return (
    <Layout>
      <Head title="Register" />
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Create Account
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Start Your Learning Journey Today
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={data.userName}
                  onChange={(e) => setData('userName', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                  required
                />
              </div>
              {errors.userName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.userName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={data.userEmail}
                  onChange={(e) => setData('userEmail', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="you@example.com"
                  required
                />
              </div>
              {errors.userEmail && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.userEmail}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={data.passwordConfirmation}
                  onChange={(e) => setData('passwordConfirmation', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>
              {errors.passwordConfirmation && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.passwordConfirmation}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                I Want To
              </label>
              <select
                value={data.role}
                onChange={(e) => setData('role', e.target.value as 'learner' | 'instructor')}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="learner">Learn New Skills (Learner)</option>
                <option value="instructor">Teach Others (Instructor)</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={processing}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Creating Account...' : 'Create Account'}
            </button>
            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
              Already Have An Account?{' '}
              <a href="/login" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                Sign In
              </a>
            </p>
          </form>
        </div>
      </div>
    </Layout>
  )
}