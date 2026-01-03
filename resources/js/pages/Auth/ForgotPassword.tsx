import { Head, Link, useForm, router } from '@inertiajs/react';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { FormEventHandler } from 'react';
import { useToast } from '../../contexts/ToastContext';
import Layout from '../../components/Layout';
export default function ForgotPassword({ status }: { status?: string }) {
  const { showToast } = useToast();
  const { data, setData, post, processing, errors } = useForm({
    userEmail: '',
  });
  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post('/forgotPassword', {
      onSuccess: () => {
        showToast('Reset Code Sent To Your Email!', 'success');
        setTimeout(() => router.visit('/passwordReset'), 2000);
      },
    });
  };
  return (
    <Layout>
      <Head title="Forgot Password" />
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-zinc-50 dark:bg-black">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-black dark:bg-white mb-4">
              <Mail className="w-8 h-8 text-white dark:text-black" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-black dark:text-white mb-2">
              Forgot Your Password?
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Enter Your Email To Receive A 6-Digit Reset Code
            </p>
          </div>
          {status && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm font-medium text-center">
              {status}
            </div>
          )}
          <form onSubmit={submit} className="space-y-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={data.userEmail}
                  className="w-full pl-12 pr-4 py-3 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  autoFocus
                  onChange={(e) => setData('userEmail', e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              {errors.userEmail && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {errors.userEmail}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={processing}
              className="w-full flex items-center justify-center py-3 px-4 text-sm font-bold text-white dark:text-black bg-black dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-100 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Sending Code...' : 'Send Reset Code'}
              {!processing && <Send className="ml-2 w-4 h-4" />}
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back To Login
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}