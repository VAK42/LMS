import { Head } from '@inertiajs/react';
import { Users, BookOpen, DollarSign, Award, TrendingUp, Star, Activity, ShoppingCart } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Layout from '../../components/Layout';
import AdminSidebar from '../../components/Admin/Sidebar';
interface DashboardProps {
  metrics: {
    totalUsers: number;
    userGrowth: number;
    totalCourses: number;
    courseGrowth: number;
    totalRevenue: number;
    revenueGrowth: number;
    totalEnrollments: number;
    averageCompletion: number;
    averageRating: number;
  };
  charts: {
    userRegistrations: Array<{ date: string; users: number }>;
    topCourses: Array<{ name: string; enrollments: number }>;
    roleDistribution: Array<{ name: string; value: number }>;
    monthlyRevenue: Array<{ month: string; revenue: number }>;
  };
  recentActivities: Array<{
    type: string;
    user: string;
    course: string;
    rating?: number;
    timestamp: string;
  }>;
  recentUsers: Array<{
    userId: number;
    userName: string;
    userEmail: string;
    role: string;
    createdAt: string;
  }>;
  user: any;
}
const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];
export default function Dashboard({ metrics, charts, recentActivities, recentUsers, user }: DashboardProps) {
  return (
    <Layout user={user}>
      <Head title="Admin Dashboard" />
      <div className="flex bg-zinc-50 dark:bg-black min-h-screen">
        <AdminSidebar currentPath="/admin/dashboard" />
        <div className="flex-1">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-black dark:text-white mb-2">Admin Dashboard</h1>
              <p className="text-zinc-600 dark:text-zinc-400">Comprehensive Overview Of Platform Analytics</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">Total Users</p>
                    <p className="text-3xl font-bold text-black dark:text-white">{metrics.totalUsers.toLocaleString()}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className={`w-4 h-4 mr-1 ${metrics.userGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                      <span className={`text-sm font-medium ${metrics.userGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {metrics.userGrowth >= 0 ? '+' : ''}{metrics.userGrowth}%
                      </span>
                      <span className="text-sm text-zinc-500 dark:text-zinc-500 ml-1">VS Last Month</span>
                    </div>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">Total Courses</p>
                    <p className="text-3xl font-bold text-black dark:text-white">{metrics.totalCourses.toLocaleString()}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className={`w-4 h-4 mr-1 ${metrics.courseGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                      <span className={`text-sm font-medium ${metrics.courseGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {metrics.courseGrowth >= 0 ? '+' : ''}{metrics.courseGrowth}%
                      </span>
                      <span className="text-sm text-zinc-500 dark:text-zinc-500 ml-1">VS Last Month</span>
                    </div>
                  </div>
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                    <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">Total Revenue</p>
                    <p className="text-3xl font-bold text-black dark:text-white">${metrics.totalRevenue.toLocaleString()}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className={`w-4 h-4 mr-1 ${metrics.revenueGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                      <span className={`text-sm font-medium ${metrics.revenueGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {metrics.revenueGrowth >= 0 ? '+' : ''}{metrics.revenueGrowth}%
                      </span>
                      <span className="text-sm text-zinc-500 dark:text-zinc-500 ml-1">VS Last Month</span>
                    </div>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">Active Enrollments</p>
                    <p className="text-3xl font-bold text-black dark:text-white">{metrics.totalEnrollments.toLocaleString()}</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-2">Paid Enrollments</p>
                  </div>
                  <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-lg">
                    <ShoppingCart className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">Completion Rate</p>
                    <p className="text-3xl font-bold text-black dark:text-white">{metrics.averageCompletion}%</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-2">Avg Course Progress</p>
                  </div>
                  <div className="bg-cyan-100 dark:bg-cyan-900/30 p-3 rounded-lg">
                    <Award className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">Average Rating</p>
                    <p className="text-3xl font-bold text-black dark:text-white">{metrics.averageRating.toFixed(2)}</p>
                    <div className="flex items-center mt-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                      <span className="text-sm text-zinc-500 dark:text-zinc-500">Out Of 5.0</span>
                    </div>
                  </div>
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg">
                    <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6">
                <h3 className="text-lg font-bold text-black dark:text-white mb-4">User Registrations</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={charts.userRegistrations}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', color: 'white' }} />
                    <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6">
                <h3 className="text-lg font-bold text-black dark:text-white mb-4">Monthly Revenue</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={charts.monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', color: 'white' }} />
                    <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6">
                <h3 className="text-lg font-bold text-black dark:text-white mb-4">Top Courses By Enrollment</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={charts.topCourses}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" angle={-45} textAnchor="end" height={100} />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', color: 'white' }} />
                    <Bar dataKey="enrollments" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6">
                <h3 className="text-lg font-bold text-black dark:text-white mb-4">User Distribution By Role</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={charts.roleDistribution} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value">
                      {charts.roleDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', color: 'white' }} labelStyle={{ color: 'white' }} itemStyle={{ color: 'white' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6">
                <h3 className="text-lg font-bold text-black dark:text-white mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start pb-3 border-b border-zinc-200 dark:border-zinc-800 last:border-0">
                      <div className={`p-2 rounded-lg mr-3 ${activity.type === 'enrollment' ? 'bg-blue-100 dark:bg-blue-900/30' : activity.type === 'completion' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'}`}>
                        {activity.type === 'enrollment' ? <ShoppingCart className="w-4 h-4 text-blue-600 dark:text-blue-400" /> : activity.type === 'completion' ? <Award className="w-4 h-4 text-green-600 dark:text-green-400" /> : <Star className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-black dark:text-white font-medium truncate">
                          {activity.user} {activity.type === 'enrollment' ? 'Enrolled In' : activity.type === 'completion' ? 'Completed' : 'Reviewed'}
                        </p>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">{activity.course}</p>
                        {activity.rating && (
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < activity.rating! ? 'text-yellow-500 fill-yellow-500' : 'text-zinc-300 dark:text-zinc-700'}`} />
                            ))}
                          </div>
                        )}
                        <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6">
                <h3 className="text-lg font-bold text-black dark:text-white mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Recent Users
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-zinc-200 dark:border-zinc-800">
                        <th className="text-left py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">Name</th>
                        <th className="text-left py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">Role</th>
                        <th className="text-left py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map((user) => (
                        <tr key={user.userId} className="border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                          <td className="py-3 text-sm">
                            <p className="text-black dark:text-white font-medium">{user.userName}</p>
                            <p className="text-zinc-600 dark:text-zinc-400 text-xs">{user.userEmail}</p>
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${user.role === 'admin' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : user.role === 'instructor' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 text-sm text-zinc-600 dark:text-zinc-400">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}