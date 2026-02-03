import { Bell, CheckCheck, Trash2, BookOpen, PartyPopper, FileText, Award, Megaphone } from 'lucide-react';
import { Head, router } from '@inertiajs/react';
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
    const iconClass = "w-6 h-6 text-green-950 dark:text-white";
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
          <h1 className="text-3xl font-serif text-green-950 dark:text-white">{t('notifications')}</h1>
          <button onClick={handleMarkAllAsRead} className="flex items-center gap-2 px-4 py-2 border border-green-950 dark:border-white text-green-950 dark:text-white hover:bg-green-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer rounded">
            <CheckCheck className="w-5 h-5" />
            {t('markAllRead')}
          </button>
        </div>
        <div className="space-y-3">
          {notifications.data.map((notification) => (
            <div key={notification.notificationId} className={`p-4 border transition-all rounded ${notification.isRead ? 'bg-white dark:bg-zinc-900 border-green-950 dark:border-white' : 'bg-green-50 dark:bg-zinc-800 border-green-950 dark:border-white'}`}>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white dark:bg-zinc-900 border border-green-950 dark:border-white rounded">{getNotificationIcon(notification.notificationType)}</div>
                <div className="flex-1">
                  <p className="text-green-950 dark:text-white mb-1">{notification.notificationTitle}</p>
                  <p className="text-zinc-700 dark:text-zinc-300 text-sm mb-1">{notification.notificationContent}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{new Date(notification.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  {!notification.isRead && (
                    <button onClick={() => handleMarkAsRead(notification.notificationId)} className="p-2 hover:bg-green-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer rounded" title={t('markAsRead')}>
                      <CheckCheck className="w-5 h-5 text-green-700 dark:text-green-400" />
                    </button>
                  )}
                  <button onClick={() => handleDelete(notification.notificationId)} className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors cursor-pointer rounded" title={t('delete')}>
                    <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {notifications.data.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-green-950 dark:border-white rounded">
              <Bell className="w-16 h-16 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
              <h3 className="text-xl text-green-950 dark:text-white mb-2">{t('noNotifications')}</h3>
              <p className="text-zinc-600 dark:text-zinc-400">{t('caughtUp')}</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}