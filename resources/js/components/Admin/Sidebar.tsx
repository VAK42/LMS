import { Link } from '@inertiajs/react';
import { LayoutDashboard, Users, BookOpen, FolderTree, Star, GraduationCap, Award, Bell, CreditCard, LifeBuoy, Wallet, MessageSquare } from 'lucide-react';
import useTranslation from '../../hooks/useTranslation';
interface Props {
  currentPath: string;
}
export default function AdminSidebar({ currentPath }: Props) {
  const { t } = useTranslation();
  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: t('adminDashboard') },
    { path: '/admin/users', icon: Users, label: t('userManagement') },
    { path: '/admin/courses', icon: BookOpen, label: t('courseManagement') },
    { path: '/admin/categories', icon: FolderTree, label: t('categoryManagement') },
    { path: '/admin/reviews', icon: Star, label: t('reviewManagement') },
    { path: '/admin/enrollments', icon: GraduationCap, label: t('enrollmentManagement') },
    { path: '/admin/support', icon: LifeBuoy, label: t('supportTicketManagement') },
    { path: '/admin/discussions', icon: MessageSquare, label: t('discussionManagement') },
    { path: '/admin/certificates', icon: Award, label: t('certificateManagement') },
    { path: '/admin/notifications', icon: Bell, label: t('notificationManagement') },
    { path: '/admin/transactions', icon: CreditCard, label: t('transactionManagement') },
    { path: '/admin/payouts', icon: Wallet, label: t('payoutManagement') },
  ];
  return (
    <div className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 min-h-screen p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-black dark:text-white">{t('adminPanel')}</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{t('lmsFullName')}</p>
      </div>
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              title={item.label}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-black dark:bg-white text-white dark:text-black' : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium truncate">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}