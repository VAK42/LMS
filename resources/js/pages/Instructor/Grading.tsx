import { Head, Link } from '@inertiajs/react';
import { CheckCircle, Clock, FileText, ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import Layout from '../components/Layout';
interface Submission {
  id: number;
  studentName: string;
  submittedAt: string;
  fileUrl: string;
  status: 'pending' | 'graded';
  grade?: number;
  feedback?: string;
}
interface GradingInterfaceProps {
  submissions: Submission[];
  assignment: {
    assignmentId: number;
    assignmentTitle: string;
  };
  user: any;
}
export default function GradingInterface({ submissions, assignment, user }: GradingInterfaceProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  return (
    <Layout user={user}>
      <Head title="Grading Interface" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/instructor/dashboard"
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Assignment Grading
          </h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Submissions
              </h2>
            </div>
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {submissions.map((submission) => (
                <button
                  key={submission.id}
                  onClick={() => setSelectedSubmission(submission)}
                  className={`w-full p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${selectedSubmission?.id === submission.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {submission.studentName}
                    </span>
                    {submission.status === 'graded' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Clock className="w-5 h-5 text-yellow-500" />
                    )}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Submitted: {submission.submittedAt}
                  </p>
                </button>
              ))}
              {submissions.length === 0 && (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                  No Submissions Found
                </div>
              )}
            </div>
          </div>
          <div className="lg:col-span-2 space-y-6">
            {selectedSubmission ? (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                      Grading: {selectedSubmission.studentName}
                    </h2>
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                      <FileText className="w-4 h-4" />
                      <a href={selectedSubmission.fileUrl} className="hover:underline">
                        Download Submission
                      </a>
                    </div>
                  </div>
                  <div className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-700 text-sm font-semibold">
                    Status: {selectedSubmission.status === 'graded' ? 'Graded' : 'Pending'}
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Grade (0-100)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="block w-full rounded-xl border-slate-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                      defaultValue={selectedSubmission.grade}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Feedback
                    </label>
                    <textarea
                      rows={6}
                      className="block w-full rounded-xl border-slate-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                      defaultValue={selectedSubmission.feedback}
                      placeholder="Enter Detailed Feedback For The Student..."
                    />
                  </div>
                  <div className="flex justify-end gap-4">
                    <button className="px-6 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                      Cancel
                    </button>
                    <button className="px-6 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
                      Save Grade
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center">
                <FileText className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Select A Submission
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Choose A Student Submission From The List To Start Grading.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}