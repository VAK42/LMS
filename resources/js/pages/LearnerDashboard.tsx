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
          <h1 className="text-4xl font-serif font-bold text-black dark:text-white mb-2">
            Welcome Back, {user.userName}!
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Continue Your Learning Journey
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-600 dark:text-zinc-400 mb-1">Enrolled Courses</p>
                <p className="text-3xl font-serif font-bold text-black dark:text-white">{totalEnrollments}</p>
              </div>
              <BookOpen className="w-12 h-12 text-zinc-400 dark:text-zinc-600" />
            </div>
          </div>
          <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-600 dark:text-zinc-400 mb-1">Completed</p>
                <p className="text-3xl font-serif font-bold text-black dark:text-white">
                  {enrolledCourses.filter(c => c.progressPercent === 100).length}
                </p>
              </div>
              <Award className="w-12 h-12 text-zinc-400 dark:text-zinc-600" />
            </div>
          </div>
          <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-600 dark:text-zinc-400 mb-1">In Progress</p>
                <p className="text-3xl font-serif font-bold text-black dark:text-white">
                  {enrolledCourses.filter(c => c.progressPercent > 0 && c.progressPercent < 100).length}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-zinc-400 dark:text-zinc-600" />
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-serif font-bold text-black dark:text-white mb-6">
            My Courses
          </h2>
          {enrolledCourses.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <BookOpen className="w-16 h-16 text-zinc-400 mx-auto mb-4" />
              <h3 className="text-xl font-serif font-bold text-black dark:text-white mb-2">
                No Courses Yet
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                Start Learning By Enrolling In A Course
              </p>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrolledCourses.map((item) => (
                <div
                  key={item.course.courseId}
                  className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:border-black dark:hover:border-white transition-colors"
                >
                  <div className="aspect-video bg-zinc-100 dark:bg-zinc-800 relative">
                    {item.course.courseImage ? (
                      <img src={item.course.courseImage} alt={item.course.courseTitle} className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-black dark:text-white text-6xl font-serif font-bold opacity-20">
                        {item.course.courseTitle[0]}
                      </div>
                    )}
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-serif font-bold text-black dark:text-white mb-2 line-clamp-2">
                        {item.course.courseTitle}
                      </h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        By {item.course.instructor.userName}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-600 dark:text-zinc-400">Progress</span>
                        <span className="font-bold text-black dark:text-white">
                          {item.progressPercent.toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-zinc-200 dark:border-zinc-700 overflow-hidden">
                        <div
                          className="h-full bg-black dark:bg-white transition-all"
                          style={{ width: `${item.progressPercent}%` }}
                        />
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {item.completedLessons} Of {item.totalLessons} Lessons Completed
                      </p>
                    </div>
                    <Link
                      href={`/courses/${item.course.courseId}/learn`}
                      className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white font-medium hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
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