import { Head, Link } from '@inertiajs/react';
import { BookOpen, Award, TrendingUp, PlayCircle } from 'lucide-react';
import Layout from '../components/Layout';
interface EnrolledCourse {
  enrollment: any;
  course: {
    courseId: number;
    courseTitle: string;
    courseImage: string | null;
    instructor: {
      userName: string;
    };
  };
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
}
interface DashboardProps {
  enrolledCourses: EnrolledCourse[];
  totalEnrollments: number;
  user: any;
}
export default function LearnerDashboard({ enrolledCourses, totalEnrollments, user }: DashboardProps) {
  return (
    <Layout user={user}>
      <Head title="Learner Dashboard" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Welcome Back, {user.userName}!
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Continue Your Learning Journey
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 mb-1">Enrolled Courses</p>
                <p className="text-3xl font-bold">{totalEnrollments}</p>
              </div>
              <BookOpen className="w-12 h-12 opacity-80" />
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 mb-1">Completed</p>
                <p className="text-3xl font-bold">
                  {enrolledCourses.filter(c => c.progressPercent === 100).length}
                </p>
              </div>
              <Award className="w-12 h-12 opacity-80" />
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 mb-1">In Progress</p>
                <p className="text-3xl font-bold">
                  {enrolledCourses.filter(c => c.progressPercent > 0 && c.progressPercent < 100).length}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 opacity-80" />
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            My Courses
          </h2>
          {enrolledCourses.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                No Courses Yet
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Start Learning By Enrolling In A Course
              </p>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:shadow-lg hover:scale-105 transition-all"
              >
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrolledCourses.map((item) => (
                <div
                  key={item.course.courseId}
                  className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all"
                >
                  <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-500 relative">
                    {item.course.courseImage ? (
                      <img src={item.course.courseImage} alt={item.course.courseTitle} className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-white text-6xl font-bold opacity-20">
                        {item.course.courseTitle[0]}
                      </div>
                    )}
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
                        {item.course.courseTitle}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        By {item.course.instructor.userName}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Progress</span>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          {item.progressPercent.toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all"
                          style={{ width: `${item.progressPercent}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {item.completedLessons} Of {item.totalLessons} Lessons Completed
                      </p>
                    </div>
                    <Link
                      href={`/courses/${item.course.courseId}/learn`}
                      className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white font-medium hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all group-hover:scale-105"
                    >
                      <PlayCircle className="w-5 h-5" />
                      {item.progressPercent === 0 ? 'Start Learning' : 'Continue Learning'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}