import { Link } from '@inertiajs/react';
import { BookOpen, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
interface LayoutProps {
  children: React.ReactNode;
  user?: {
    userId: number;
    userName: string;
    userEmail: string;
    role: string;
  } | null;
}
export default function Layout({ children, user }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                <BookOpen className="w-8 h-8 text-blue-600" />
                <span>LMS</span>
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link href="/" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Home
                </Link>
                <Link href="/courses" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Courses
                </Link>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  <Link
                    href={user.role === 'admin' ? '/admin/dashboard' : user.role === 'instructor' ? '/instructor/dashboard' : '/dashboard'}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                  >
                    <User className="w-4 h-4" />
                    {user.userName}
                  </Link>
                  <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 transition-colors">
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:shadow-lg hover:scale-105 transition-all"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            <div className="px-4 py-4 space-y-2">
              <Link href="/" className="block px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                Home
              </Link>
              <Link href="/courses" className="block px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                Courses
              </Link>
              {user ? (
                <>
                  <Link href="/dashboard" className="block px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                    Dashboard
                  </Link>
                  <Link href="/logout" method="post" as="button" className="block w-full text-left px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                    Logout
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" className="block px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                    Login
                  </Link>
                  <Link href="/register" className="block px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
      <main>{children}</main>
      <footer className="mt-20 bg-slate-900 text-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 text-xl font-bold text-white mb-4">
                <BookOpen className="w-6 h-6 text-blue-500" />
                LMS
              </div>
              <p className="text-sm text-slate-400">
                Your Journey To Knowledge Starts Here!
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}