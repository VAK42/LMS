import { Award, Download, Calendar } from 'lucide-react';
import { Head, Link } from '@inertiajs/react';
import Layout from '../../components/Layout';
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
  return (
    <Layout user={user}>
      <Head title="My Certificates" />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Award className="w-12 h-12 text-black dark:text-white mx-auto mb-4" />
          <h1 className="text-3xl font-serif font-bold text-black dark:text-white mb-2">My Certificates</h1>
          <p className="text-zinc-600 dark:text-zinc-400">Celebrate Your Learning Achievements!</p>
        </div>
        {certificates.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <Award className="w-16 h-16 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-black dark:text-white mb-2">No Certificates Yet!</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">Complete A Course To Earn Your First Certificate!</p>
            <Link href="/courses" className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors inline-block">
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <div key={cert.certificateId} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <div className="bg-black dark:bg-white p-6 text-center">
                  <Award className="w-12 h-12 text-white dark:text-black mx-auto mb-2" />
                  <h3 className="text-white dark:text-black font-bold">Certificate Of Completion</h3>
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-bold text-black dark:text-white mb-2">{cert.course.courseTitle}</h4>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">Instructor: {cert.course.instructor?.userName || 'Unknown'}</p>
                  <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                    <Calendar className="w-4 h-4" />
                    Issued: {new Date(cert.createdAt).toLocaleDateString()}
                  </div>
                  <div className="bg-zinc-100 dark:bg-zinc-800 p-3 mb-4">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Certificate ID</p>
                    <p className="font-mono text-sm text-black dark:text-white">{cert.uniqueCode}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/certificates/${cert.certificateId}`} className="flex-1 px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-bold text-center hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2">
                      <Award className="w-4 h-4" />
                      View
                    </Link>
                    <a href={cert.pdfPath} download className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2">
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