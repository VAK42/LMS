import { Head } from '@inertiajs/react';
import { TrendingUp, Users, BookOpen, Award } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Layout from '../components/Layout';
interface AnalyticsProps {
  overview: {
    totalRevenue: number;
    activeStudents: number;
    courseCompletions: number;
    averageRating: number;
  };
  enrollmentTrends: Array<{
    date: string;
    enrollments: number;
  }>;
  topCourses: Array<{
    courseTitle: string;
    enrollments: number;
    revenue: number;
  }>;
  user: any;
}
export default function Analytics({ overview, enrollmentTrends, topCourses, user }: AnalyticsProps) {
  return (
    <Layout user={user}>
      <Head title="Analytics Dashboard" />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
          Analytics Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8" />
              <span className="text-2xl font-bold">${overview.totalRevenue}</span>
            </div>
            <p className="text-green-100">Total Revenue</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8" />
              <span className="text-2xl font-bold">{overview.activeStudents}</span>
            </div>
            <p className="text-blue-100">Active Students</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <Award className="w-8 h-8" />
              <span className="text-2xl font-bold">{overview.courseCompletions}</span>
            </div>
            <p className="text-purple-100">Completions</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <BookOpen className="w-8 h-8" />
              <span className="text-2xl font-bold">{overview.averageRating.toFixed(1)}</span>
            </div>
            <p className="text-orange-100">Avg Rating</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              Enrollment Trends
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={enrollmentTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="enrollments" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              Top Courses
            </h2>
            <div className="space-y-4">
              {topCourses.map((course, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{course.courseTitle}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {course.enrollments} Students
                    </p>
                  </div>
                  <span className="text-lg font-bold text-green-600">
                    ${course.revenue}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}