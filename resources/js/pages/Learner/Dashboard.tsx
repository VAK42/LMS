import { BookOpen, Award, TrendingUp, PlayCircle } from 'lucide-react';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import Layout from '../../components/Layout';
import useTranslation from '../../hooks/useTranslation';
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
  user: any;
}
export default function LearnerDashboard({ enrolledCourses, user }: DashboardProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'recent' | 'inProgress' | 'completed'>('recent');
  const recentCourses = enrolledCourses;
  const inProgressCourses = enrolledCourses.filter(c => c.progressPercent > 0 && c.progressPercent < 100);
  const completedCourses = enrolledCourses.filter(c => c.progressPercent === 100);
  const displayedCourses = activeTab === 'recent' ? recentCourses : activeTab === 'inProgress' ? inProgressCourses : completedCourses;
  return (
    <Layout user={user}>
      <Head title={t('myDashboard')} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-serif text-green-950 dark:text-white mb-2">
              {t('welcomeBackLearner', { name: user.userName })}
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              {t('continueLearning')}
            </p>
          </div>
          <Link href="/certificates" className="inline-flex items-center gap-2 px-6 py-3 bg-green-950 dark:bg-white text-white dark:text-green-950 font-medium hover:bg-white hover:text-green-950 hover:border-green-950 dark:hover:bg-green-950 dark:hover:text-white dark:hover:border-green-950 border border-transparent transition-colors rounded">
            <Award className="w-5 h-5" />
            {t('myCertificates')}
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-white dark:bg-zinc-900 border border-green-950 dark:border-white rounded">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-600 dark:text-zinc-400 mb-1">{t('enrolledCourses')}</p>
                <p className="text-3xl font-serif text-green-950 dark:text-white">{enrolledCourses.length}</p>
              </div>
              <BookOpen className="w-12 h-12 text-zinc-400 dark:text-zinc-600" />
            </div>
          </div>
          <div className="p-6 bg-white dark:bg-zinc-900 border border-green-950 dark:border-white rounded">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-600 dark:text-zinc-400 mb-1">{t('completed')}</p>
                <p className="text-3xl font-serif text-green-950 dark:text-white">
                  {completedCourses.length}
                </p>
              </div>
              <Award className="w-12 h-12 text-zinc-400 dark:text-zinc-600" />
            </div>
          </div>
          <div className="p-6 bg-white dark:bg-zinc-900 border border-green-950 dark:border-white rounded">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-600 dark:text-zinc-400 mb-1">{t('inProgress')}</p>
                <p className="text-3xl font-serif text-green-950 dark:text-white">
                  {inProgressCourses.length}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-zinc-400 dark:text-zinc-600" />
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-4 mb-6 border-b border-green-950 dark:border-white">
            <button onClick={() => setActiveTab('recent')} className={`pb-3 px-1 font-medium transition-colors cursor-pointer ${activeTab === 'recent' ? 'text-green-950 dark:text-white border-b-2 border-green-950 dark:border-white' : 'text-zinc-500 hover:text-green-950 dark:hover:text-white'}`}>
              {t('recentCourses')}
            </button>
            <button onClick={() => setActiveTab('inProgress')} className={`pb-3 px-1 font-medium transition-colors cursor-pointer ${activeTab === 'inProgress' ? 'text-green-950 dark:text-white border-b-2 border-green-950 dark:border-white' : 'text-zinc-500 hover:text-green-950 dark:hover:text-white'}`}>
              {t('inProgressCount', { count: inProgressCourses.length })}
            </button>
            <button onClick={() => setActiveTab('completed')} className={`pb-3 px-1 font-medium transition-colors cursor-pointer ${activeTab === 'completed' ? 'text-green-950 dark:text-white border-b-2 border-green-950 dark:border-white' : 'text-zinc-500 hover:text-green-950 dark:hover:text-white'}`}>
              {t('completedCount', { count: completedCourses.length })}
            </button>
          </div>
          {displayedCourses.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-green-950 dark:border-white rounded">
              <BookOpen className="w-16 h-16 text-zinc-400 mx-auto mb-4" />
              <h3 className="text-xl font-serif text-green-950 dark:text-white mb-2">
                {activeTab === 'recent' ? t('noCoursesYet') : activeTab === 'inProgress' ? t('noCoursesInProgress') : t('noCompletedCourses')}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                {activeTab === 'recent' ? t('startLearning') : activeTab === 'inProgress' ? t('startCourseToSee') : t('completeCourseToSee')}
              </p>
              <Link href="/courses" className="inline-flex items-center gap-2 px-6 py-3 bg-green-950 dark:bg-white text-white dark:text-green-950 font-medium hover:bg-white hover:text-green-950 hover:border-green-950 dark:hover:bg-green-950 dark:hover:text-white dark:hover:border-green-950 border border-transparent transition-colors rounded">
                {t('browseCourses')}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {displayedCourses.map((item) => (
                <div key={item.course.courseId} className="group bg-white dark:bg-zinc-900 border border-green-950 dark:border-white overflow-hidden hover:border-green-950 dark:hover:border-white transition-colors rounded flex flex-col h-full">
                  <div className="aspect-video bg-zinc-100 dark:bg-zinc-800 relative border-b border-green-950 dark:border-white">
                    {item.course.courseImage ? (
                      <img src={`/storage/${item.course.courseImage}`} alt={item.course.courseTitle} className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-zinc-300 dark:text-zinc-600" />
                      </div>
                    )}
                  </div>
                  <div className="p-5 space-y-3 flex flex-col flex-1">
                    <div className="flex-1">
                      <h3 className="text-lg font-serif text-green-950 dark:text-white mb-1 line-clamp-2">
                        {item.course.courseTitle}
                      </h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {t('by')} {item.course.instructor.userName}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-600 dark:text-zinc-400">{t('progress')}</span>
                        <span className="text-green-950 dark:text-white">
                          {(item.progressPercent ?? 0).toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 overflow-hidden rounded-full">
                        <div className="h-full bg-green-950 dark:bg-white transition-all" style={{ width: `${item.progressPercent ?? 0}%` }} />
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {t('lessonsOf', { completed: item.completedLessons, total: item.totalLessons })}
                      </p>
                    </div>
                    <Link href={`/courses/${item.course.courseId}/learn`} className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-zinc-100 dark:bg-zinc-800 text-green-950 dark:text-white font-medium hover:bg-green-950 hover:text-white dark:hover:bg-white dark:hover:text-green-950 transition-colors rounded">
                      <PlayCircle className="w-4 h-4" />
                      {item.progressPercent === 0 ? t('start') : item.progressPercent === 100 ? t('review') : t('continue')}
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