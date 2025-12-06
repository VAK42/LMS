import { Head } from '@inertiajs/react';
import { Trophy, Award, Flame } from 'lucide-react';
import Layout from '../components/Layout';
interface LeaderboardProps {
  leaderboard: Array<{
    userId: number;
    user: {
      userName: string;
    };
    totalPoints: number;
    level: number;
    currentStreak: number;
  }>;
  userRank: number;
  user: any;
  userStats: {
    totalPoints: number;
    level: number;
    currentStreak: number;
  };
}
export default function Leaderboard({ leaderboard, userRank, user, userStats }: LeaderboardProps) {
  const getRankBadge = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };
  return (
    <Layout user={user}>
      <Head title="Leaderboard" />
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
          Leaderboard
        </h1>
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 mb-1">Your Rank</p>
              <p className="text-4xl font-bold">#{userRank}</p>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <Trophy className="w-8 h-8 mx-auto mb-2" />
                <p className="text-2xl font-bold">{userStats.totalPoints}</p>
                <p className="text-sm text-blue-100">Points</p>
              </div>
              <div className="text-center">
                <Award className="w-8 h-8 mx-auto mb-2" />
                <p className="text-2xl font-bold">Level {userStats.level}</p>
                <p className="text-sm text-blue-100">Level</p>
              </div>
              <div className="text-center">
                <Flame className="w-8 h-8 mx-auto mb-2" />
                <p className="text-2xl font-bold">{userStats.currentStreak}</p>
                <p className="text-sm text-blue-100">Day Streak</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Rank
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                  User
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Level
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Points
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Streak
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, idx) => (
                <tr
                  key={entry.userId}
                  className={`border-t border-slate-200 dark:border-slate-700 ${entry.userId === user.userId ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                >
                  <td className="px-6 py-4">
                    <span className="text-2xl">{getRankBadge(idx + 1)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {entry.user.userName}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold">Level {entry.level}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-600" />
                      <span className="font-bold text-lg">{entry.totalPoints}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Flame className="w-5 h-5 text-orange-600" />
                      <span>{entry.currentStreak} Days</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}