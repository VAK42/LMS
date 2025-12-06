import { Head, Link } from '@inertiajs/react';
import { Award, Download, Share2, Calendar } from 'lucide-react';
import Layout from '../components/Layout';
interface Certificate {
  certificateId: number;
  uniqueCode: string;
  pdfPath: string;
  issuedAt: string;
  course: {
    courseId: number;
    courseTitle: string;
    instructor: {
      userName: string;
    };
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
      <section className="py-16 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex p-4 bg-yellow-100 dark:bg-yellow-900 rounded-2xl mb-4">
              <Award className="w-12 h-12 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              My Certificates
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Celebrate Your Learning Achievements
            </p>
          </div>
          {certificates.length === 0 ? (
            <div className="text-center py-20">
              <Award className="w-20 h-20 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-xl text-slate-500 dark:text-slate-400">No Certificates Yet</p>
              <p className="text-slate-400 dark:text-slate-500 mb-6">Complete A Course To Earn Your First Certificate</p>
              <Link href="/courses" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors inline-block">
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {certificates.map((cert) => (
                <div key={cert.certificateId} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border-2 border-yellow-200 dark:border-yellow-800">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-center">
                    <Award className="w-16 h-16 text-white mx-auto mb-3" />
                    <h3 className="text-white font-bold text-lg">Certificate Of Completion</h3>
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      {cert.course.courseTitle}
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      Instructor: {cert.course.instructor.userName}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
                      <Calendar className="w-4 h-4" />
                      Issued: {new Date(cert.issuedAt).toLocaleDateString()}
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3 mb-4">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Certificate ID</p>
                      <p className="font-mono text-sm text-slate-700 dark:text-slate-300">{cert.uniqueCode}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/certificates/${cert.certificateId}`}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Award className="w-4 h-4" />
                        View
                      </Link>
                      <a
                        href={cert.pdfPath}
                        download
                        className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                      <button className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors flex items-center gap-2">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
}