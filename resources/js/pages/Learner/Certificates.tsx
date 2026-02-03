import { Award, Download, Calendar } from 'lucide-react';
import { Head, Link } from '@inertiajs/react';
import Layout from '../../components/Layout';
import useTranslation from '../../hooks/useTranslation';
interface Certificate {
  certificateId: number;
  uniqueCode: string;
  pdfPath: string;
  createdAt: string;
  course: {
    courseId: number;
    courseTitle: string;
    instructor: { userName: string };
  };
}
interface CertificatesProps {
  certificates: Certificate[];
  user: any;
}
export default function Certificates({ certificates, user }: CertificatesProps) {
  const { t } = useTranslation();
  return (
    <Layout user={user}>
      <Head title={t('myCertificates')} />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Award className="w-12 h-12 text-green-950 dark:text-white mx-auto mb-4" />
          <h1 className="text-3xl font-serif text-green-950 dark:text-white mb-2">{t('myCertificates')}</h1>
          <p className="text-zinc-600 dark:text-zinc-400">{t('celebrateAchievements')}</p>
        </div>
        {certificates.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-green-950 dark:border-white rounded">
            <Award className="w-16 h-16 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl text-green-950 dark:text-white mb-2">{t('noCertificatesYet')}</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">{t('completeCourseToEarn')}</p>
            <Link href="/courses" className="px-6 py-3 bg-green-950 dark:bg-white text-white dark:text-green-950 hover:bg-white hover:text-green-950 hover:border-green-950 dark:hover:bg-green-950 dark:hover:text-white dark:hover:border-green-950 border border-transparent transition-colors inline-block rounded">
              {t('browseCourses')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <div key={cert.certificateId} className="bg-white dark:bg-zinc-900 border border-green-950 dark:border-white overflow-hidden rounded group hover:border-green-800 dark:hover:border-zinc-200 transition-colors">
                <div className="bg-green-950 dark:bg-white p-6 text-center">
                  <Award className="w-12 h-12 text-white dark:text-green-950 mx-auto mb-2" />
                  <h3 className="text-white dark:text-green-950">{t('certificateOfCompletion')}</h3>
                </div>
                <div className="p-6">
                  <h4 className="text-lg text-green-950 dark:text-white mb-2 line-clamp-2">{cert.course.courseTitle}</h4>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">{t('instructor')}: {cert.course.instructor?.userName || t('unknown')}</p>
                  <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                    <Calendar className="w-4 h-4" />
                    {t('issued', { date: new Date(cert.createdAt).toLocaleDateString() })}
                  </div>
                  <div className="bg-zinc-100 dark:bg-zinc-800 p-3 mb-4 rounded border border-zinc-200 dark:border-zinc-700">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{t('certificateId')}</p>
                    <p className="font-mono text-sm text-green-950 dark:text-white">{cert.uniqueCode}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/certificates/${cert.certificateId}`} className="flex-1 px-4 py-2 bg-green-950 dark:bg-white text-white dark:text-green-950 text-center hover:bg-white hover:text-green-950 hover:border-green-950 dark:hover:bg-green-950 dark:hover:text-white dark:hover:border-green-950 border border-transparent transition-colors flex items-center justify-center gap-2 rounded">
                      <Award className="w-4 h-4" />
                      {t('view')}
                    </Link>
                    <a href={cert.pdfPath} download className="px-4 py-2 border border-green-950 dark:border-white text-green-950 dark:text-white hover:bg-green-950 hover:text-white dark:hover:bg-white dark:hover:text-green-950 transition-colors flex items-center gap-2 rounded">
                      <Download className="w-4 h-4" />
                    </a>
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