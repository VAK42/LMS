import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, Eye, EyeOff, BookOpen } from 'lucide-react';
import Layout from '../components/Layout';
interface Course {
  courseId: number;
  courseTitle: string;
  courseDescription: string;
  simulatedPrice: number;
  isPublished: boolean;
  totalEnrollments: number;
  category: {
    categoryName: string;
  };
  modules: Array<{ moduleId: number }>;
}
interface InstructorDashboardProps {
  courses: {
    data: Course[];
  };
  user: any;
}
export default function InstructorDashboard({ courses, user }: InstructorDashboardProps) {
  const handleDelete = (courseId: number) => {
    if (confirm('Are You Sure You Want To Delete This Course?')) {
      router.delete(`/api/instructor/courses/${courseId}`);
    }
  };
  const handlePublish = (courseId: number) => {
    router.post(`/api/instructor/courses/${courseId}/publish`);
  };
  return (
    <Layout user={user}>
      <Head title="Instructor Dashboard" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              My Courses
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Manage Your Course Content And Students
            </p>
          </div>
          <Link
            href="/instructor/courses/create"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-lg hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5" />
            New Course
          </Link>
        </div>
        {courses.data.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              No Courses Yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Create Your First Course And Start Teaching
            </p>
            <Link
              href="/instructor/courses/create"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:shadow-lg hover:scale-105 transition-all"
            >
              <Plus className="w-5 h-5" />
              Create Course
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {courses.data.map((course) => (
              <div
                key={course.courseId}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {course.courseTitle}
                      </h3>
                      {course.isPublished ? (
                        <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          Published
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-sm font-medium flex items-center gap-1">
                          <EyeOff className="w-4 h-4" />
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 line-clamp-2">
                      {course.courseDescription}
                    </p>
                    <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                      <span>{course.category.categoryName}</span>
                      <span>•</span>
                      <span>{course.modules.length} Modules</span>
                      <span>•</span>
                      <span>{course.totalEnrollments} Students</span>
                      <span>•</span>
                      <span>${course.simulatedPrice}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/instructor/courses/${course.courseId}/edit`}
                      className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    {!course.isPublished && (
                      <button
                        onClick={() => handlePublish(course.courseId)}
                        className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(course.courseId)}
                      className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}