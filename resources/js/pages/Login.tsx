import { Head, useForm } from '@inertiajs/react';
import { LogIn, Mail, Lock } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import Layout from '../components/Layout';
export default function Login() {
  const { showToast } = useToast();
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
          showToast('Login Failed! Check Your Credentials!', 'error');
        }
      },
      onSuccess: (response) => {
        if (response.component === 'Login') {
          showToast('Invalid Credentials!', 'error');
        }
      }
    });
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
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={data.remember}
                onChange={(e) => setData('remember', e.target.checked)}
                className="w-4 h-4 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black focus:ring-black dark:focus:ring-white cursor-pointer"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer">
                Remember Me
              </label>
            </div>
            <div className="flex items-center justify-end">
              <a href="/forgotPassword" className="text-sm text-black dark:text-white hover:underline">
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
            <div className="text-center text-sm text-zinc-600 dark:text-zinc-400">
              Don't Have An Account?{' '}
              <a href="/register" className="text-black dark:text-white hover:underline font-medium">
                Sign Up
              </a>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}