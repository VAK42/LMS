import { Link } from '@inertiajs/react';
import { LayoutDashboard, Users, BookOpen, FolderTree, Star, GraduationCap, Ticket, Award, Bell, CreditCard, LifeBuoy } from 'lucide-react';
interface Props {
  currentPath: string;
}
export default function AdminSidebar({ currentPath }: Props) {
  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/users', icon: Users, label: 'User Management' },
    { path: '/admin/courses', icon: BookOpen, label: 'Course Management' },
    { path: '/admin/categories', icon: FolderTree, label: 'Category Management' },
    { path: '/admin/reviews', icon: Star, label: 'Review Management' },
    { path: '/admin/enrollments', icon: GraduationCap, label: 'Enrollment Management' },
    { path: '/admin/coupons', icon: Ticket, label: 'Coupon Management' },
    { path: '/admin/support', icon: LifeBuoy, label: 'Support Tickets' },
    { path: '/admin/certificates', icon: Award, label: 'Certificate Management' },
    { path: '/admin/notifications', icon: Bell, label: 'Notification Management' },
    { path: '/admin/transactions', icon: CreditCard, label: 'Transaction Management' },
  ];
  return (
    <div className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 min-h-screen p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-black dark:text-white">Admin Panel</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Learning Management System</p>
      </div>
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-black dark:bg-white text-white dark:text-black' : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  )
}