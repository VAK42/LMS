import { BookOpen, User, LogOut, Menu, X, Search, Sun, Moon, ChevronDown, Bell, Settings, LayoutDashboard, Heart, LifeBuoy } from 'lucide-react';
import { Link, router, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
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
  const { url } = usePage();
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
  const isActive = (path: string) => url === path || (path !== '/' && url.startsWith(path));
  const getNavLinkClass = (path: string) => `px-4 py-2 rounded border text-sm uppercase tracking-wide transition-all cursor-pointer ${isActive(path) ? 'bg-green-950 text-white border-green-950 dark:bg-white dark:text-green-950 dark:border-white font-medium' : 'border-transparent text-zinc-600 dark:text-zinc-300 hover:border-green-950 hover:text-green-950 dark:hover:border-white dark:hover:text-white'}`;
  const getDashboardPath = () => {
    if (!user) return '/dashboard';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'instructor') return '/instructor/dashboard';
    return '/dashboard';
  };
  const userMenuItems = user?.role === 'admin' ? [] : [
    { href: getDashboardPath(), icon: LayoutDashboard, label: t('dashboard') },
    ...(user?.role === 'learner' ? [{ href: '/wishlist', icon: Heart, label: t('myWishlist') }] : []),
    { href: '/supportTickets', icon: LifeBuoy, label: t('supportTickets') },
    { href: '/notifications', icon: Bell, label: t('notifications') },
    { href: '/settings', icon: Settings, label: t('settings') },
  ];
  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-black border-b border-green-950 dark:border-white shadow-sm">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-4 lg:gap-8">
            <Link href="/" className="flex items-center gap-2 group cursor-pointer">
              <div className="p-2 bg-green-950 text-white rounded transition-transform group-hover:scale-105">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="text-2xl font-serif text-green-950 dark:text-white">{t('lms')}</span>
            </Link>
            <div className="hidden md:flex items-center gap-2">
              <Link href="/" className={getNavLinkClass('/')}>{t('home')}</Link>
              <Link href="/courses" className={getNavLinkClass('/courses')}>{t('courses')}</Link>
              <Link href="/blogs" className={getNavLinkClass('/blogs')}>{t('blog')}</Link>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 flex-1 mx-4">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-950 dark:text-zinc-50" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t('searchCourses')} className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-black border bg-transparent rounded text-sm focus:outline-none focus:border-green-950 dark:focus:border-white transition-all text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400" />
            </form>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            <button onClick={toggleTheme} className="p-2 text-zinc-500 hover:text-green-950 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer rounded border border-transparent hover:border-green-950 dark:hover:border-white">
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 px-3 py-1.5 border border-green-950 dark:border-white rounded hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all group cursor-pointer">
                  <div className="w-8 h-8 rounded bg-green-950 text-white flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200 group-hover:text-green-950 dark:group-hover:text-white">{user.userName}</span>
                  <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-black rounded shadow-xl border border-black dark:border-white overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-5 py-3 border-b border-green-950 dark:border-white mb-2">
                      <p className="text-green-950 dark:text-white">{user.userName}</p>
                      <p className="text-xs text-zinc-500 truncate">{user.userEmail}</p>
                    </div>
                    {userMenuItems.map((item) => (
                      <Link key={item.href} href={item.href} className="flex items-center gap-3 px-5 py-2.5 text-sm text-black dark:text-white hover:bg-green-950 dark:hover:bg-white hover:text-white dark:hover:text-green-950 transition-colors cursor-pointer" onClick={() => setUserMenuOpen(false)}>
                        <item.icon className="w-4 h-4" />
                        {item.label}
                      </Link>
                    ))}
                    <div className={userMenuItems.length > 0 ? "border-t border-green-950 dark:border-white mt-2 pt-2" : "mt-2"}>
                      <Link href="/logout" method="post" as="button" className="flex items-center gap-3 w-full px-5 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors cursor-pointer" onClick={() => setUserMenuOpen(false)}>
                        <LogOut className="w-4 h-4" />
                        {t('logout')}
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="px-6 py-2.5 rounded border border-transparent text-sm uppercase tracking-wide text-zinc-600 dark:text-zinc-300 hover:text-green-950 dark:hover:text-white hover:border-green-950 dark:hover:border-white transition-all cursor-pointer">{t('login')}</Link>
                <Link href="/register" className="px-6 py-2.5 bg-green-950 text-white border border-green-950 dark:bg-white dark:text-green-950 dark:border-white text-sm uppercase tracking-wide hover:bg-white hover:text-green-950 dark:hover:bg-green-950 dark:hover:text-white dark:hover:border-green-950 transition-colors rounded cursor-pointer">{t('register')}</Link>
              </div>
            )}
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-zinc-700 dark:text-zinc-300 cursor-pointer">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-green-950 dark:border-white bg-white dark:bg-black shadow-lg">
          <div className="px-4 py-6 space-y-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-950 dark:text-zinc-50" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t('searchCourses')} className="w-full pl-11 pr-4 py-3 bg-white dark:bg-black border border-green-950 dark:border-white rounded focus:outline-none focus:border-green-950 dark:focus:border-white text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400" />
              </div>
            </form>
            <div className="space-y-1">
              <Link href="/" className={`block px-4 py-3 font-medium rounded cursor-pointer transition-colors border ${isActive('/') ? 'bg-green-950 text-white border-green-950 dark:bg-white dark:text-green-950 dark:border-white' : 'border-transparent text-black dark:text-white hover:bg-white dark:hover:bg-black hover:text-green-950 dark:hover:text-white hover:border-green-950 dark:hover:border-white'}`}>{t('home')}</Link>
              <Link href="/courses" className={`block px-4 py-3 font-medium rounded cursor-pointer transition-colors border ${isActive('/courses') ? 'bg-green-950 text-white border-green-950 dark:bg-white dark:text-green-950 dark:border-white' : 'border-transparent text-black dark:text-white hover:bg-white dark:hover:bg-black hover:text-green-950 dark:hover:text-white hover:border-green-950 dark:hover:border-white'}`}>{t('courses')}</Link>
              <Link href="/blogs" className={`block px-4 py-3 font-medium rounded cursor-pointer transition-colors border ${isActive('/blogs') ? 'bg-green-950 text-white border-green-950 dark:bg-white dark:text-green-950 dark:border-white' : 'border-transparent text-black dark:text-white hover:bg-white dark:hover:bg-black hover:text-green-950 dark:hover:text-white hover:border-green-950 dark:hover:border-white'}`}>{t('blog')}</Link>
            </div>
            {user ? (
              <div className="pt-4 border-t border-green-950 dark:border-white">
                <div className="px-4 mb-4">
                  <p className="text-green-950 dark:text-white">{user.userName}</p>
                  <p className="text-xs text-zinc-500">{user.userEmail}</p>
                </div>
                {userMenuItems.map((item) => (
                  <Link key={item.href} href={item.href} className="flex items-center gap-3 px-4 py-3 text-black dark:text-white hover:bg-green-950 dark:hover:bg-white hover:text-white dark:hover:text-green-950 rounded cursor-pointer">
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                ))}
                <div className={userMenuItems.length > 0 ? "pt-4 border-t border-green-950 dark:border-white" : ""}>
                  <Link href="/logout" method="post" as="button" className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg text-left cursor-pointer">
                    <LogOut className="w-4 h-4" />
                    {t('logout')}
                  </Link>
                </div>
              </div>
            ) : (
              <div className="pt-4 border-t border-green-950 dark:border-white space-y-3">
                <Link href="/login" className="block w-full text-center py-3 text-zinc-600 dark:text-zinc-300 uppercase tracking-wide border border-transparent hover:border-green-950 dark:hover:border-white hover:text-green-950 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded cursor-pointer">{t('login')}</Link>
                <Link href="/register" className="block w-full text-center py-3 bg-green-950 text-white border border-green-950 dark:bg-white dark:text-green-950 dark:border-white uppercase tracking-wide hover:bg-white hover:text-green-950 dark:hover:bg-green-950 dark:hover:text-white dark:hover:border-green-950 transition-colors rounded cursor-pointer">{t('register')}</Link>
              </div>
            )}
            <div className="flex items-center justify-between pt-4 border-t border-green-950 dark:border-white">
              <button onClick={toggleTheme} className="flex items-center gap-2 px-4 py-2 text-zinc-600 dark:text-zinc-300 cursor-pointer hover:text-green-950 dark:hover:text-white">
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                <span className="text-sm font-medium">{theme === 'light' ? t('darkMode') : t('lightMode')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}