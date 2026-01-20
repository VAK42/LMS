import { Plus, Edit, Trash2, Eye, EyeOff, BookOpen, Wallet, Users, GraduationCap, DollarSign, FileText } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { Head, Link, router } from '@inertiajs/react';
import Layout from '../../components/Layout';
import useTranslation from '../../hooks/useTranslation';
interface Course {
  courseId: number;
  courseTitle: string;
  courseDescription: string;
  courseImage: string | null;
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
            <h1 className="text-3xl font-serif text-green-950 dark:text-white mb-1">{t('instructorDashboard')}</h1>
            <p className="text-zinc-600 dark:text-zinc-400">{t('manageCoursesSubtitle')}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/instructor/earnings" className="flex items-center gap-2 px-5 py-2.5 rounded bg-white dark:bg-zinc-800 text-green-950 dark:text-white border border-green-950 dark:border-white font-medium hover:bg-green-950 hover:text-white dark:hover:bg-white dark:hover:text-green-950 transition-colors">
              <Wallet className="w-4 h-4" />
              {t('earnings')}
            </Link>
            <Link href="/instructor/students" className="flex items-center gap-2 px-5 py-2.5 rounded bg-white dark:bg-zinc-800 text-green-950 dark:text-white border border-green-950 dark:border-white font-medium hover:bg-green-950 hover:text-white dark:hover:bg-white dark:hover:text-green-950 transition-colors">
              <Users className="w-4 h-4" />
              {t('students')}
            </Link>
            <Link href="/instructor/grading" className="flex items-center gap-2 px-5 py-2.5 rounded bg-white dark:bg-zinc-800 text-green-950 dark:text-white border border-green-950 dark:border-white font-medium hover:bg-green-950 hover:text-white dark:hover:bg-white dark:hover:text-green-950 transition-colors">
              <GraduationCap className="w-4 h-4" />
              {t('grading')}
            </Link>
            <Link href="/instructor/blogs" className="flex items-center gap-2 px-5 py-2.5 rounded bg-white dark:bg-zinc-800 text-green-950 dark:text-white border border-green-950 dark:border-white font-medium hover:bg-green-950 hover:text-white dark:hover:bg-white dark:hover:text-green-950 transition-colors">
              <FileText className="w-4 h-4" />
              {t('myBlogs')}
            </Link>
            <Link href="/instructor/courses/create" className="flex items-center gap-2 px-5 py-2.5 rounded bg-green-950 dark:bg-white text-white dark:text-green-950 border border-green-950 dark:border-white font-medium hover:bg-white hover:text-green-950 dark:hover:bg-green-950 dark:hover:text-white dark:hover:border-green-950 transition-colors">
              <Plus className="w-4 h-4" />
              {t('newCourse')}
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-zinc-900 rounded border border-green-950 dark:border-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">{t('totalCourses')}</p>
                <p className="text-2xl text-green-950 dark:text-white">{statsData.totalCourses}</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-zinc-800 rounded border border-green-950 dark:border-white"><BookOpen className="w-5 h-5 text-green-950 dark:text-white" /></div>
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded border border-green-950 dark:border-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">{t('published')}</p>
                <p className="text-2xl text-green-950 dark:text-white">{statsData.publishedCourses}</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-zinc-800 rounded border border-green-950 dark:border-white"><Eye className="w-5 h-5 text-green-950 dark:text-white" /></div>
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded border border-green-950 dark:border-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">{t('totalStudents')}</p>
                <p className="text-2xl text-green-950 dark:text-white">{statsData.totalStudents}</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-zinc-800 rounded border border-green-950 dark:border-white"><Users className="w-5 h-5 text-green-950 dark:text-white" /></div>
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded border border-green-950 dark:border-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">{t('totalEarnings')}</p>
                <p className="text-2xl text-green-950 dark:text-white">{t('currencySymbol')}{statsData.totalEarnings.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-zinc-800 rounded border border-green-950 dark:border-white"><DollarSign className="w-5 h-5 text-green-950 dark:text-white" /></div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-serif text-green-950 dark:text-white">{t('myCourses')}</h2>
        </div>
        {courses.data.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded border border-green-950 dark:border-white">
            <BookOpen className="w-16 h-16 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-serif font-semibold text-green-950 dark:text-white mb-2">{t('noCoursesYet')}</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">{t('createFirstCourse')}</p>
            <Link href="/instructor/courses/create" className="inline-flex items-center gap-2 px-6 py-3 rounded bg-green-950 dark:bg-white text-white dark:text-green-950 font-medium hover:bg-white hover:text-green-950 hover:border-green-950 dark:hover:bg-green-950 dark:hover:text-white dark:hover:border-green-950 border border-transparent transition-colors">
              <Plus className="w-5 h-5" />
              {t('createCourse')}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.data.map((course) => (
              <div key={course.courseId} className="bg-white dark:bg-zinc-900 rounded border border-green-950 dark:border-white p-5 hover:border-green-800 dark:hover:border-zinc-200 transition-colors">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-32 h-20 rounded overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-green-950 dark:border-white">
                    {course.courseImage ? (
                      <img src={`/storage/${course.courseImage}`} alt={course.courseTitle} className="w-full h-full object-cover" />
                    ) : (
                      <BookOpen className="w-8 h-8 text-zinc-400 dark:text-zinc-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-serif text-green-950 dark:text-white truncate">{course.courseTitle}</h3>
                      {course.isPublished ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs flex items-center gap-1 shrink-0 border border-green-200 dark:border-green-800">
                          <Eye className="w-3 h-3" />
                          {t('published')}
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs flex items-center gap-1 shrink-0 border border-yellow-200 dark:border-yellow-800">
                          <EyeOff className="w-3 h-3" />
                          {t('draft')}
                        </span>
                      )}
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm line-clamp-1 mb-3">{course.courseDescription}</p>
                    <div className="flex items-center gap-4 text-sm text-zinc-500 font-medium">
                      <span>{course.category?.categoryName || t('uncategorized')}</span>
                      <span>•</span>
                      <span>{course.modules?.length || 0} {t('modules')}</span>
                      <span>•</span>
                      <span>{course.totalEnrollments || 0} {t('students')}</span>
                      <span>•</span>
                      <span className="text-green-950 dark:text-white">{course.simulatedPrice > 0 ? `${t('currencySymbol')}${course.simulatedPrice}` : t('free')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link href={`/instructor/courses/${course.courseId}/edit`} className="p-2.5 rounded bg-white dark:bg-zinc-800 text-green-950 dark:text-white border border-green-950 dark:border-white hover:bg-green-950 hover:text-white dark:hover:bg-white dark:hover:text-green-950 transition-colors">
                      <Edit className="w-4 h-4" />
                    </Link>
                    {!course.isPublished && (
                      <button onClick={() => handlePublish(course.courseId)} className="p-2.5 rounded bg-white dark:bg-zinc-800 text-green-950 dark:text-white border border-green-950 dark:border-white hover:bg-green-950 hover:text-white dark:hover:bg-white dark:hover:text-green-950 transition-colors cursor-pointer">
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    {course.isPublished && (
                      <button onClick={() => handlePublish(course.courseId)} className="p-2.5 rounded bg-white dark:bg-zinc-800 text-green-950 dark:text-white border border-green-950 dark:border-white hover:bg-green-950 hover:text-white dark:hover:bg-white dark:hover:text-green-950 transition-colors cursor-pointer">
                        <EyeOff className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => handleDelete(course.courseId)} className="p-2.5 rounded bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors cursor-pointer">
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