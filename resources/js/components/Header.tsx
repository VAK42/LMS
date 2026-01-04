import { BookOpen, User, LogOut, Menu, X, Search, Sun, Moon, ChevronDown, Bell, Settings, LayoutDashboard } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import { useTheme } from '../contexts/ThemeContext';
import LanguageSwitcher from './Shared/LanguageSwitcher';
import useTranslation from '../hooks/useTranslation';
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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.get('/courses', { search: searchQuery });
    }
  };
  const getDashboardPath = () => {
    if (!user) return '/dashboard';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'instructor') return '/instructor/dashboard';
    return '/dashboard';
  };
  const isAdmin = user?.role === 'admin';
  const userMenuItems = isAdmin ? [] : [
    { href: getDashboardPath(), icon: LayoutDashboard, label: t('dashboard') },
    { href: '/notifications', icon: Bell, label: t('notifications') },
    { href: '/settings', icon: Settings, label: t('settings') },
  ];
  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-black dark:text-white">
              <BookOpen className="w-8 h-8" />
              <span className="font-serif">{t('lms')}</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors">
                {t('home')}
              </Link>
              <Link href="/courses" className="text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors">
                {t('courses')}
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
                placeholder={t('searchCourses')}
                className="w-full pl-10 pr-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              />
            </form>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            <button
              onClick={toggleTheme}
              className="p-2 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              aria-label={t('toggleTheme')}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  {user.userName}
                  <ChevronDown className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg z-50">
                    <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
                      <p className="text-sm font-medium text-black dark:text-white">{user.userName}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">{user.userEmail}</p>
                    </div>
                    {userMenuItems.length > 0 && (
                      <div className="py-1">
                        {userMenuItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                    <div className={userMenuItems.length > 0 ? "border-t border-zinc-200 dark:border-zinc-800 py-1" : "py-1"}>
                      <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="flex items-center gap-3 w-full px-4 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <LogOut className="w-4 h-4" />
                        {t('logout')}
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer">
                  {t('login')}
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all cursor-pointer"
                >
                  {t('register')}
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
                placeholder={t('searchCourses')}
                className="w-full pl-10 pr-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              />
            </form>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 w-full px-4 py-2 text-zinc-700 dark:text-zinc-300 cursor-pointer"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              {theme === 'light' ? t('darkMode') : t('lightMode')}
            </button>
            <Link href="/" className="block px-4 py-2 text-zinc-700 dark:text-zinc-300">
              {t('home')}
            </Link>
            <Link href="/courses" className="block px-4 py-2 text-zinc-700 dark:text-zinc-300">
              {t('courses')}
            </Link>
            {user ? (
              <>
                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-2 mt-2">
                  <p className="px-4 py-2 text-sm font-medium text-black dark:text-white">{user.userName}</p>
                </div>
                {userMenuItems.map((item) => (
                  <Link key={item.href} href={item.href} className="flex items-center gap-3 px-4 py-2 text-zinc-700 dark:text-zinc-300">
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                ))}
                <Link href="/logout" method="post" as="button" className="flex items-center gap-3 w-full text-left px-4 py-2 text-zinc-700 dark:text-zinc-300 cursor-pointer">
                  <LogOut className="w-4 h-4" />
                  {t('logout')}
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-4 py-2 text-zinc-700 dark:text-zinc-300 cursor-pointer">
                  {t('login')}
                </Link>
                <Link href="/register" className="block px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-center cursor-pointer">
                  {t('register')}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}