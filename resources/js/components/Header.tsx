import { Link, router } from '@inertiajs/react';
import { BookOpen, User, LogOut, Menu, X, Search, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
interface HeaderProps {
  user?: {
    userId: number;
    userName: string;
    userEmail: string;
    role: string;
  } | null;
}
export default function Header({ user }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, toggleTheme } = useTheme();
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.get('/courses', { search: searchQuery });
    }
  };
  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-black dark:text-white">
              <BookOpen className="w-8 h-8" />
              <span className="font-serif">LMS</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/courses" className="text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors">
                Courses
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Courses..."
                className="w-full pl-10 pr-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              />
            </form>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            {user ? (
              <>
                <Link
                  href={user.role === 'admin' ? '/admin/dashboard' : user.role === 'instructor' ? '/instructor/dashboard' : '/dashboard'}
                  className="flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
                >
                  <User className="w-4 h-4" />
                  {user.userName}
                </Link>
                <Link
                  href="/logout"
                  method="post"
                  as="button"
                  className="flex items-center gap-2 px-4 py-2 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-700 dark:text-zinc-300"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="px-4 py-4 space-y-2">
            <form onSubmit={handleSearch} className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Courses..."
                className="w-full pl-10 pr-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              />
            </form>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 w-full px-4 py-2 text-zinc-700 dark:text-zinc-300 cursor-pointer"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>
            <Link href="/" className="block px-4 py-2 text-zinc-700 dark:text-zinc-300">
              Home
            </Link>
            <Link href="/courses" className="block px-4 py-2 text-zinc-700 dark:text-zinc-300">
              Courses
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className="block px-4 py-2 text-zinc-700 dark:text-zinc-300">
                  Dashboard
                </Link>
                <Link href="/logout" method="post" as="button" className="block w-full text-left px-4 py-2 text-zinc-700 dark:text-zinc-300">
                  Logout
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-4 py-2 text-zinc-700 dark:text-zinc-300">
                  Login
                </Link>
                <Link href="/register" className="block px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-center">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}