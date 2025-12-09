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
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-zinc-50 dark:bg-black">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-black dark:bg-white mb-4">
              <LogIn className="w-8 h-8 text-white dark:text-black" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-black dark:text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Login To Continue Your Learning Journey
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
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={data.remember}
                  onChange={(e) => setData('remember', e.target.checked)}
                  className="w-4 h-4 border-zinc-300 dark:border-zinc-600 text-black focus:ring-black dark:focus:ring-white"
                />
                <span className="text-sm text-zinc-700 dark:text-zinc-300">
                  Remember Me
                </span>
              </label>
              <a href="#" className="text-sm text-black dark:text-white hover:underline">
                Forgot Password?
              </a>
            </div>
            <button
              type="submit"
              disabled={processing}
              className="w-full py-3 px-4 bg-black dark:bg-white text-white dark:text-black font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Logging In...' : 'Login'}
            </button>
            <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
              Don't Have An Account?{' '}
              <a href="/register" className="text-black dark:text-white font-medium hover:underline">
                Sign Up
              </a>
            </p>
          </form>
        </div>
      </div>
    </Layout>
  )
}