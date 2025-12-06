import { Head, useForm } from '@inertiajs/react';
import { LogIn, Mail, Lock } from 'lucide-react';
import Layout from '../components/Layout';
export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    userEmail: '',
    password: '',
    remember: false,
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/api/login');
  };
  return (
    <Layout>
      <Head title="Login" />
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Login To Continue Your Learning Journey
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
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
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={data.remember}
                  onChange={(e) => setData('remember', e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Remember Me
                </span>
              </label>
              <a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                Forgot Password?
              </a>
            </div>
            <button
              type="submit"
              disabled={processing}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Logging In...' : 'Login'}
            </button>
            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
              Don't Have An Account?{' '}
              <a href="/register" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                Sign Up
              </a>
            </p>
          </form>
        </div>
      </div>
    </Layout>
  )
}