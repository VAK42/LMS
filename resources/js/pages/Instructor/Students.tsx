import { ChevronLeft, Users, BookOpen, Calendar, Mail } from 'lucide-react';
import { Head, Link } from '@inertiajs/react';
import Layout from '../../components/Layout';
import useTranslation from '../../hooks/useTranslation';
interface Enrollment {
  enrollmentId: number;
  enrollmentDate: string;
  completionPercent: number;
  isPaid: boolean;
  user: {
    userId: number;
    userName: string;
    userEmail: string;
  };
  course: {
    courseId: number;
    courseTitle: string;
  };
}
interface Props {
  enrollments: {
    data: Enrollment[];
    current_page: number;
    last_page: number;
  };
  user: any;
}
export default function Students({ enrollments, user }: Props) {
  const { t } = useTranslation();
  const groupedByCourse = enrollments.data.reduce((acc: { [key: number]: { course: any; students: Enrollment[] } }, enrollment) => {
    const courseId = enrollment.course.courseId;
    if (!acc[courseId]) {
      acc[courseId] = { course: enrollment.course, students: [] };
    }
    acc[courseId].students.push(enrollment);
    return acc;
  }, {});
  return (
    <Layout user={user}>
      <Head title={t('myStudents')} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/instructor/dashboard" className="p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <ChevronLeft className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-serif text-green-950 dark:text-white">{t('myStudents')}</h1>
            <p className="text-zinc-600 dark:text-zinc-400">{enrollments.data.length} {t('totalEnrollmentsText')}</p>
          </div>
        </div>
        {enrollments.data.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded border border-green-950 dark:border-white p-12 text-center">
            <Users className="w-16 h-16 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl text-green-950 dark:text-white mb-2">{t('noStudentsYet')}</h3>
            <p className="text-zinc-600 dark:text-zinc-400">{t('studentsWillAppear')}</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.values(groupedByCourse).map(({ course, students }) => (
              <div key={course.courseId} className="bg-white dark:bg-zinc-900 rounded border border-green-950 dark:border-white overflow-hidden">
                <div className="p-4 bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-green-950 dark:text-white" />
                    <h2 className="text-green-950 dark:text-white text-lg">{course.courseTitle}</h2>
                  </div>
                  <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{students.length} {t('students')}</span>
                </div>
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {students.map((enrollment) => (
                    <div key={enrollment.enrollmentId} className="p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <div>
                        <p className="text-green-950 dark:text-white">{enrollment.user.userName}</p>
                        <p className="text-sm text-zinc-500 flex items-center gap-1 font-medium">
                          <Mail className="w-3 h-3" />
                          {enrollment.user.userEmail}
                        </p>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right min-w-[120px]">
                          <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">{t('progress')}</p>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                              <div className="h-full bg-green-950 dark:bg-white rounded-full" style={{ width: `${enrollment.completionPercent}%` }} />
                            </div>
                            <span className="text-sm text-green-950 dark:text-white">{enrollment.completionPercent}%</span>
                          </div>
                        </div>
                        <div className="text-right min-w-[100px]">
                          <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">{t('enrolledDate')}</p>
                          <p className="text-sm font-medium text-black dark:text-white flex items-center justify-end gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs border ${enrollment.isPaid ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800'}`}>
                          {enrollment.isPaid ? t('paid') : t('freeStatus')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}