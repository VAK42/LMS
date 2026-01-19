import { Plus, Edit, Trash2, Eye, EyeOff, BookOpen, Wallet, Users, GraduationCap, DollarSign, FileText } from 'lucide-react';
import { Head, Link, router } from '@inertiajs/react';
import { useToast } from '../../contexts/ToastContext';
import Layout from '../../components/Layout';
import useTranslation from '../../hooks/useTranslation';
interface Course {
  courseId: number;
  courseTitle: string;
  courseDescription: string;
  simulatedPrice: number;
  isPublished: boolean;
  totalEnrollments: number;
  averageRating: number;
  category: {
    categoryName: string;
  };
  modules: Array<{ moduleId: number }>;
}
interface Props {
  courses: {
    data: Course[];
  };
  stats: {
    totalStudents: number;
    totalEarnings: number;
    totalCourses: number;
    publishedCourses: number;
  };
  user: any;
}
export default function InstructorDashboard({ courses, stats, user }: Props) {
  const { showToast } = useToast();
  const { t } = useTranslation();
  const handleDelete = (courseId: number) => {
    if (confirm(t('deleteCourseConfirm'))) {
      router.delete(`/api/instructor/courses/${courseId}`);
    }
  };
  const handlePublish = (courseId: number) => {
    router.post(`/api/instructor/courses/${courseId}/publish`);
  };
  const statsData = stats || { totalStudents: 0, totalEarnings: 0, totalCourses: courses.data.length, publishedCourses: courses.data.filter(c => c.isPublished).length };
  return (
    <Layout user={user}>
      <Head title={t('instructorDashboard')} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white mb-1">{t('instructorDashboard')}</h1>
            <p className="text-zinc-600 dark:text-zinc-400">{t('manageCoursesSubtitle')}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/instructor/earnings" className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-green-600 border-green-600 border font-medium hover:bg-green-900 hover:text-white transition-colors">
              <Wallet className="w-4 h-4" />
              {t('earnings')}
            </Link>
            <Link href="/instructor/students" className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors">
              <Users className="w-4 h-4" />
              {t('students')}
            </Link>
            <Link href="/instructor/grading" className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors">
              <GraduationCap className="w-4 h-4" />
              {t('grading')}
            </Link>
            <Link href="/instructor/blogs" className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors">
              <FileText className="w-4 h-4" />
              {t('myBlogs')}
            </Link>
            <Link href="/instructor/courses/create" className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-green-600 border-green-600 border font-medium hover:bg-green-900 hover:text-white transition-colors">
              <Plus className="w-4 h-4" />
              {t('newCourse')}
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">{t('totalCourses')}</p>
                <p className="text-2xl font-bold text-black dark:text-white">{statsData.totalCourses}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg"><BookOpen className="w-5 h-5 text-blue-600" /></div>
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">{t('published')}</p>
                <p className="text-2xl font-bold text-black dark:text-white">{statsData.publishedCourses}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg"><Eye className="w-5 h-5 text-green-600" /></div>
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">{t('totalStudents')}</p>
                <p className="text-2xl font-bold text-black dark:text-white">{statsData.totalStudents}</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg"><Users className="w-5 h-5 text-purple-600" /></div>
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">{t('totalEarnings')}</p>
                <p className="text-2xl font-bold text-green-600">${statsData.totalEarnings.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg"><DollarSign className="w-5 h-5 text-green-600" /></div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-black dark:text-white">{t('myCourses')}</h2>
        </div>
        {courses.data.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <BookOpen className="w-16 h-16 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-black dark:text-white mb-2">{t('noCoursesYet')}</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">{t('createFirstCourse')}</p>
            <Link href="/instructor/courses/create" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
              <Plus className="w-5 h-5" />
              {t('createCourse')}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.data.map((course) => (
              <div key={course.courseId} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-black dark:text-white truncate">{course.courseTitle}</h3>
                      {course.isPublished ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium flex items-center gap-1 shrink-0">
                          <Eye className="w-3 h-3" />
                          {t('published')}
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-medium flex items-center gap-1 shrink-0">
                          <EyeOff className="w-3 h-3" />
                          {t('draft')}
                        </span>
                      )}
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm line-clamp-1 mb-3">{course.courseDescription}</p>
                    <div className="flex items-center gap-4 text-sm text-zinc-500">
                      <span>{course.category?.categoryName || t('uncategorized')}</span>
                      <span>•</span>
                      <span>{course.modules?.length || 0} {t('modules')}</span>
                      <span>•</span>
                      <span>{course.totalEnrollments || 0} {t('students')}</span>
                      <span>•</span>
                      <span className="font-medium text-green-600">{course.simulatedPrice > 0 ? `$${course.simulatedPrice}` : t('free')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link href={`/instructor/courses/${course.courseId}/edit`} className="p-2.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                      <Edit className="w-4 h-4" />
                    </Link>
                    {!course.isPublished && (
                      <button onClick={() => handlePublish(course.courseId)} className="p-2.5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors cursor-pointer">
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    {course.isPublished && (
                      <button onClick={() => handlePublish(course.courseId)} className="p-2.5 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors cursor-pointer">
                        <EyeOff className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => handleDelete(course.courseId)} className="p-2.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors cursor-pointer">
                      <Trash2 className="w-4 h-4" />
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