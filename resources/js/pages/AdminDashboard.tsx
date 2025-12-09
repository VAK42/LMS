import { Head } from '@inertiajs/react';
import { Users, BookOpen, Award, TrendingUp } from 'lucide-react';
import Layout from '../components/Layout';
interface AdminDashboardProps {
  metrics: {
    totalUsers: number;
    totalCourses: number;
    totalEnrollments: number;
    averageCompletion: number;
    recentUsers: Array<{
      userId: number;
      userName: string;
      userEmail: string;
      role: string;
      createdAt: string;
    }>;
  };
  user: any;
}
export default function AdminDashboard({ metrics, user }: AdminDashboardProps) {
  return (
    <Layout user={user}>
      <Head title="Admin Dashboard" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
          Admin Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 mb-1">Total Users</p>
                <p className="text-3xl font-bold">{metrics.totalUsers}</p>
              </div>
              <Users className="w-12 h-12 opacity-80" />
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 mb-1">Total Courses</p>
                <p className="text-3xl font-bold">{metrics.totalCourses}</p>
              </div>
              <BookOpen className="w-12 h-12 opacity-80" />
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 mb-1">Enrollments</p>
                <p className="text-3xl font-bold">{metrics.totalEnrollments}</p>
              </div>
              <Award className="w-12 h-12 opacity-80" />
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 mb-1">Avg Completion</p>
                <p className="text-3xl font-bold">{metrics.averageCompletion.toFixed(1)}%</p>
              </div>
              <TrendingUp className="w-12 h-12 opacity-80" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Recent Users
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Role
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody>
                {metrics.recentUsers.map((user) => (
                  <tr key={user.userId} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700">
                    <td className="py-3 px-4 text-slate-900 dark:text-white">
                      {user.userName}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {user.userEmail}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        user.role === 'instructor' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                          'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}