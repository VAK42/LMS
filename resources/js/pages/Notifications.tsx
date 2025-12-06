import { Head, router } from '@inertiajs/react';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import Layout from '../components/Layout';
interface Notification {
  notificationId: number;
  notificationType: string;
  message: string;
  data: any;
  isRead: boolean;
  createdAt: string;
}
interface NotificationsProps {
  notifications: {
    data: Notification[];
  };
  user: any;
}
export default function Notifications({ notifications, user }: NotificationsProps) {
  const handleMarkAsRead = (id: number) => {
    router.post(`/api/notifications/${id}/read`);
  };
  const handleMarkAllAsRead = () => {
    router.post('/api/notifications/read-all');
  };
  const handleDelete = (id: number) => {
    router.delete(`/api/notifications/${id}`);
  };
  const getNotificationIcon = (type: string) => {
    const icons: Record<string, string> = {
      enrollment: '📚',
      completion: '🎉',
      grade: '📝',
      discussion: '💬',
      certificate: '🏆',
    };
    return icons[type] || '📢';
  };
  return (
    <Layout user={user}>
      <Head title="Notifications" />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            Notifications
          </h1>
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            <CheckCheck className="w-5 h-5" />
            Mark All Read
          </button>
        </div>
        <div className="space-y-3">
          {notifications.data.map((notification) => (
            <div
              key={notification.notificationId}
              className={`p-4 rounded-xl border transition-all ${notification.isRead
                ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                }`}
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{getNotificationIcon(notification.notificationType)}</span>
                <div className="flex-1">
                  <p className="text-slate-900 dark:text-white font-medium mb-1">
                    {notification.message}
                  </p>
                  <p className="text-sm text-slate-500">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!notification.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notification.notificationId)}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      title="Mark As Read"
                    >
                      <CheckCheck className="w-5 h-5 text-blue-600" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notification.notificationId)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {notifications.data.length === 0 && (
            <div className="text-center py-16">
              <Bell className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                No Notifications
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                You're All Caught Up!
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}