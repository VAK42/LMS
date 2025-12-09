import { Head } from '@inertiajs/react';
import { Award, Download, Share2, CheckCircle } from 'lucide-react';
import Layout from '../components/Layout';
interface CertificateProps {
  certificate: {
    certificateId: number;
    uniqueCode: string;
    pdfPath: string;
    issuedAt: string;
  };
  course: {
    courseTitle: string;
    courseDescription: string;
  };
  user: any;
}
export default function CertificateView({ certificate, course, user }: CertificateProps) {
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
      alert('Link Copied To Clipboard!');
    }
  };
  return (
    <Layout user={user}>
      <Head title={`Certificate - ${course.courseTitle}`} />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            <Award className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Congratulations!
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            You Have Completed <span className="font-semibold text-slate-900 dark:text-white">{course.courseTitle}</span>
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border-4 border-gradient shadow-2xl mb-8">
          <div className="text-center mb-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Certificate Of Completion
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Issued On {new Date(certificate.issuedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Recipient</p>
                <p className="font-semibold text-slate-900 dark:text-white">{user.userName}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Verification Code</p>
                <p className="font-mono text-sm text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded">
                  {certificate.uniqueCode}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4">
          <a
            href={`/storage/${certificate.pdfPath}`}
            download
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-lg hover:scale-105 transition-all"
          >
            <Download className="w-5 h-5" />
            Download PDF
          </a>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
          >
            <Share2 className="w-5 h-5" />
            Share
          </button>
        </div>
      </div>
    </Layout>
  )
}