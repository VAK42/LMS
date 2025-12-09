import { Head, useForm } from '@inertiajs/react';
import { Camera, Save } from 'lucide-react';
import { useState } from 'react';
import Layout from '../components/Layout';
interface ProfileProps {
  user: {
    userId: number;
    userName: string;
    userEmail: string;
    role: string;
    avatarPath: string | null;
    createdAt: string;
  };
  stats: {
    enrolledCourses: number;
    completedCourses: number;
    certificatesEarned: number;
    totalLearningTime: number;
  };
}
export default function Profile({ user: currentUser, stats }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { data, setData, put, processing, errors } = useForm({
    userName: currentUser.userName,
    userEmail: currentUser.userEmail,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/api/profile`, {
      onSuccess: () => setIsEditing(false),
    });
  };
  return (
    <Layout user={currentUser}>
      <Head title="My Profile" />
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
          My Profile
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 text-center">
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                  {currentUser.userName.charAt(0).toUpperCase()}
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors">
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {currentUser.userName}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
              </p>
              <div className="text-sm text-slate-500">
                Member Since {new Date(currentUser.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div className="mt-6 bg-white dark:bg-slate-800 rounded-2xl p-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Statistics</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Enrolled Courses</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.enrolledCourses}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completedCourses}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Certificates</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.certificatesEarned}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Learning Time</p>
                  <p className="text-2xl font-bold text-blue-600">{Math.round(stats.totalLearningTime / 60)}h</p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Account Information
                </h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={data.userName}
                    onChange={(e) => setData('userName', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 disabled:opacity-60"
                  />
                  {errors.userName && <p className="mt-1 text-sm text-red-600">{errors.userName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={data.userEmail}
                    onChange={(e) => setData('userEmail', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 disabled:opacity-60"
                  />
                  {errors.userEmail && <p className="mt-1 text-sm text-red-600">{errors.userEmail}</p>}
                </div>
                {isEditing && (
                  <>
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                      <h4 className="font-bold text-slate-900 dark:text-white mb-4">Change Password</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            value={data.currentPassword}
                            onChange={(e) => setData('currentPassword', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            value={data.newPassword}
                            onChange={(e) => setData('newPassword', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Confirm Password
                          </label>
                          <input
                            type="password"
                            value={data.confirmPassword}
                            onChange={(e) => setData('confirmPassword', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={processing}
                      className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      Save Changes
                    </button>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}