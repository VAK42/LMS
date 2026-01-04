import { Award, Download, Share2, Calendar, User as UserIcon, Star, CheckCircle } from 'lucide-react';
import { Head } from '@inertiajs/react';
import { useToast } from '../../contexts/ToastContext';
import Layout from '../../components/Layout';
import useTranslation from '../../hooks/useTranslation';
interface CertificateProps {
  certificate: {
    certificateId: number;
    uniqueCode: string;
    pdfPath: string;
    createdAt: string;
    course: {
      courseTitle: string;
      instructor: {
        userName: string;
      };
    };
    user: {
      userName: string;
    };
  };
  user: any;
}
export default function CertificateView({ certificate, user }: CertificateProps) {
  const course = certificate.course;
  const { showToast } = useToast();
  const { t } = useTranslation();
  const shareUrl = `${window.location.origin}/certificates/verify/${certificate.uniqueCode}`;
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `Certificate - ${course.courseTitle}`,
        text: `I Completed ${course.courseTitle}!`,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      showToast(t('linkCopied'), 'success');
    }
  };
  return (
    <Layout user={user}>
      <Head title={`Certificate - ${course.courseTitle}`} />
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900 dark:to-black py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-black dark:bg-white rounded-full mb-4">
              <Award className="w-10 h-10 text-white dark:text-black" />
            </div>
            <h1 className="text-4xl font-serif font-bold text-black dark:text-white mb-2">{t('congratulations')}</h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">{t('successfullyCompleted')}</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 border-8 border-black dark:border-white relative overflow-hidden mb-8">
            <div className="absolute top-4 left-4">
              <Star className="w-6 h-6 text-black dark:text-white" fill="currentColor" />
            </div>
            <div className="absolute top-4 right-4">
              <Star className="w-6 h-6 text-black dark:text-white" fill="currentColor" />
            </div>
            <div className="absolute bottom-4 left-4">
              <Star className="w-6 h-6 text-black dark:text-white" fill="currentColor" />
            </div>
            <div className="absolute bottom-4 right-4">
              <Star className="w-6 h-6 text-black dark:text-white" fill="currentColor" />
            </div>
            <div className="border-4 border-zinc-300 dark:border-zinc-700 m-6 p-12">
              <div className="text-center mb-8 pb-8 border-b-2 border-zinc-200 dark:border-zinc-800">
                <div className="inline-flex items-center justify-center w-16 h-16 border-4 border-black dark:border-white rounded-full mb-4">
                  <CheckCircle className="w-8 h-8 text-black dark:text-white" />
                </div>
                <h2 className="text-5xl font-serif font-bold text-black dark:text-white mb-2">{t('certificate')}</h2>
                <p className="text-2xl font-serif text-zinc-600 dark:text-zinc-400">{t('ofCompletion')}</p>
              </div>
              <div className="text-center space-y-6 mb-8">
                <p className="text-lg italic text-zinc-600 dark:text-zinc-400">{t('thisIsToCertify')}</p>
                <h3 className="text-4xl font-serif font-bold text-black dark:text-white border-b-2 border-black dark:border-white inline-block pb-2 px-8">
                  {certificate.user.userName}
                </h3>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                  {t('hasSuccessfullyCompleted')}
                </p>
                <h4 className="text-3xl font-serif font-bold text-black dark:text-white px-8">
                  {course.courseTitle}
                </h4>
                <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                  {t('demonstratedUnderstanding')}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-12 pt-8 border-t-2 border-zinc-200 dark:border-zinc-800">
                <div className="text-center">
                  <div className="border-t-2 border-black dark:border-white w-48 mx-auto mb-3"></div>
                  <div className="flex items-center justify-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 mb-1">
                    <Calendar className="w-4 h-4" />
                    {t('date')}
                  </div>
                  <p className="font-bold text-black dark:text-white">{new Date(certificate.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="text-center">
                  <div className="border-t-2 border-black dark:border-white w-48 mx-auto mb-3"></div>
                  <div className="flex items-center justify-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 mb-1">
                    <UserIcon className="w-4 h-4" />
                    {t('instructor')}
                  </div>
                  <p className="font-bold text-black dark:text-white">{course.instructor?.userName || t('unknown')}</p>
                </div>
              </div>
              <div className="text-center mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-2">{t('certificateId')}</p>
                <p className="font-mono text-sm font-bold text-black dark:text-white tracking-wider">{certificate.uniqueCode}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4">
            <a
              href={certificate.pdfPath}
              download={`${certificate.uniqueCode}.pdf`}
              className="flex items-center gap-2 px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              <Download className="w-5 h-5" />
              {t('downloadPdf')}
            </a>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-8 py-4 border-2 border-black dark:border-white text-black dark:text-white font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-pointer"
            >
              <Share2 className="w-5 h-5" />
              {t('shareCertificate')}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}