import { Head, router } from '@inertiajs/react';
import { Bell, CheckCheck, Trash2, BookOpen, PartyPopper, FileText, Award, Megaphone } from 'lucide-react';
import Layout from '../../components/Layout';
import useTranslation from '../../hooks/useTranslation';
interface Notification {
  notificationId: number;
  notificationType: string;
  notificationTitle: string;
  notificationContent: string;
  isRead: boolean;
  createdAt: string;
}
interface NotificationsProps {
  notifications: { data: Notification[] };
  user: any;
}
export default function Notifications({ notifications, user }: NotificationsProps) {
  const { t } = useTranslation();
  const handleMarkAsRead = (id: number) => {
    router.post(`/api/notifications/${id}/read`);
  };
  const handleMarkAllAsRead = () => {
    router.post('/api/notifications/readAll');
  };
  const handleDelete = (id: number) => {
    router.delete(`/api/notifications/${id}`);
  };
  const getNotificationIcon = (type: string) => {
    const iconClass = "w-6 h-6 text-zinc-600 dark:text-zinc-400";
    switch (type) {
      case 'enrollment': return <BookOpen className={iconClass} />;
      case 'completion': return <PartyPopper className={iconClass} />;
      case 'grade': return <FileText className={iconClass} />;
      case 'certificate': return <Award className={iconClass} />;
      default: return <Megaphone className={iconClass} />;
    }
  };
  return (
    <Layout user={user}>
      <Head title={t('notifications')} />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-serif font-bold text-black dark:text-white">{t('notifications')}</h1>
          <button onClick={handleMarkAllAsRead} className="flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
            <CheckCheck className="w-5 h-5" />
            {t('markAllRead')}
          </button>
        </div>
        <div className="space-y-3">
          {notifications.data.map((notification) => (
            <div key={notification.notificationId} className={`p-4 border transition-all ${notification.isRead ? 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800' : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700'}`}>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-zinc-100 dark:bg-zinc-800">{getNotificationIcon(notification.notificationType)}</div>
                <div className="flex-1">
                  <p className="text-black dark:text-white font-bold mb-1">{notification.notificationTitle}</p>
                  <p className="text-zinc-700 dark:text-zinc-300 text-sm mb-1">{notification.notificationContent}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{new Date(notification.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  {!notification.isRead && (
                    <button onClick={() => handleMarkAsRead(notification.notificationId)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer" title={t('markAsRead')}>
                      <CheckCheck className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                    </button>
                  )}
                  <button onClick={() => handleDelete(notification.notificationId)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer" title={t('delete')}>
                    <Trash2 className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {notifications.data.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <Bell className="w-16 h-16 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-black dark:text-white mb-2">{t('noNotifications')}</h3>
              <p className="text-zinc-600 dark:text-zinc-400">{t('caughtUp')}</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}