import { Head, useForm } from '@inertiajs/react';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import Layout from '../components/Layout';
export default function Register() {
  const { showToast } = useToast();
  const { data, setData, post, processing, errors } = useForm({
    userName: '',
    userEmail: '',
    password: '',
    passwordConfirmation: '',
    role: 'learner',
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/register', {
      onError: (errors) => {
        if (errors.userEmail) showToast(errors.userEmail, 'error');
        if (errors.password) showToast(errors.password, 'error');
      },
      onSuccess: (response) => {
        if (response.component === 'Register') {
          showToast('Registration Failed!', 'error');
        }
      }
    });
  };
  return (
    <Layout>
      <Head title="Register" />
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-zinc-50 dark:bg-black">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-black dark:bg-white mb-4">
              <UserPlus className="w-8 h-8 text-white dark:text-black" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-black dark:text-white mb-2">
              Create Account
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Start Your Learning Journey Today
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input
                  type="text"
                  value={data.userName}
                  onChange={(e) => setData('userName', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  placeholder="John Doe"
                  required
                />
              </div>
              {errors.userName && (
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{errors.userName}</p>
              )}
            </div>
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
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{errors.userEmail}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input
                  type="password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{errors.password}</p>
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
                  placeholder="••••••••"
                  required
                />
              </div>
              {errors.passwordConfirmation && (
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{errors.passwordConfirmation}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                I Want To
              </label>
              <select
                value={data.role}
                onChange={(e) => setData('role', e.target.value as 'learner' | 'instructor')}
                className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              >
                <option value="learner">Learn New Skills (Learner)</option>
                <option value="instructor">Teach Others (Instructor)</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={processing}
              className="w-full py-3 px-4 bg-black dark:bg-white text-white dark:text-black font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Creating Account...' : 'Create Account'}
            </button>
            <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
              Already Have An Account?{' '}
              <a href="/login" className="text-black dark:text-white font-medium hover:underline">
                Sign In
              </a>
            </p>
          </form>
        </div>
      </div>
    </Layout>
  )
}