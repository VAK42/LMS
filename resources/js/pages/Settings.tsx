import { Head, useForm } from '@inertiajs/react';
import { User, Bell } from 'lucide-react';
import Layout from '../components/Layout';
interface Props {
  user: any;
}
export default function Settings({ user }: Props) {
  const { data: profileData, setData: setProfileData, put: updateProfile } = useForm({
    bio: user.bio || '',
    website: user.website || '',
    twitter: user.twitter || '',
    linkedin: user.linkedin || '',
    github: user.github || '',
  });
  const { data: prefsData, setData: setPrefsData, put: updatePrefs } = useForm({
    showProfile: user.showProfile ?? true,
    showProgress: user.showProgress ?? true,
    emailNotifications: true,
    pushNotifications: false,
  });
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile('/api/profile/settings');
  };
  const handlePrefsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const preferencesPayload = {
      notificationPreferences: {
        email: prefsData.emailNotifications,
        push: prefsData.pushNotifications,
      },
      privacySettings: {},
      showProfile: prefsData.showProfile,
      showProgress: prefsData.showProgress,
    };
    fetch('/api/profile/preferences', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preferencesPayload),
    }).then(() => window.location.reload());
  };
  return (
    <Layout>
      <Head title="Settings" />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Settings</h1>
            <p className="text-slate-600 dark:text-slate-400">Manage your account preferences</p>
          </div>
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold">Profile Information</h2>
              </div>
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData('bio', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    placeholder="Tell us about yourself..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Website</label>
                    <input
                      type="url"
                      value={profileData.website}
                      onChange={(e) => setProfileData('website', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Twitter</label>
                    <input
                      type="text"
                      value={profileData.twitter}
                      onChange={(e) => setProfileData('twitter', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                      placeholder="@username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">LinkedIn</label>
                    <input
                      type="text"
                      value={profileData.linkedin}
                      onChange={(e) => setProfileData('linkedin', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                      placeholder="username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">GitHub</label>
                    <input
                      type="text"
                      value={profileData.github}
                      onChange={(e) => setProfileData('github', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                      placeholder="username"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  Save Profile
                </button>
              </form>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold">Notifications & Privacy</h2>
              </div>
              <form onSubmit={handlePrefsSubmit} className="space-y-6">
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <span className="font-medium">Email Notifications</span>
                    <input
                      type="checkbox"
                      checked={prefsData.emailNotifications}
                      onChange={(e) => setPrefsData('emailNotifications', e.target.checked)}
                      className="w-5 h-5 rounded"
                    />
                  </label>
                  <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <span className="font-medium">Show Public Profile</span>
                    <input
                      type="checkbox"
                      checked={prefsData.showProfile}
                      onChange={(e) => setPrefsData('showProfile', e.target.checked)}
                      className="w-5 h-5 rounded"
                    />
                  </label>
                  <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <span className="font-medium">Show Progress</span>
                    <input
                      type="checkbox"
                      checked={prefsData.showProgress}
                      onChange={(e) => setPrefsData('showProgress', e.target.checked)}
                      className="w-5 h-5 rounded"
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  Save Preferences
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}