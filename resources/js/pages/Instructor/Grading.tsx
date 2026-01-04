import { CheckCircle, Clock, FileText, ChevronLeft } from 'lucide-react';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import Layout from '../../components/Layout';
import useTranslation from '../../hooks/useTranslation';
interface Submission {
  submissionId: number;
  score: number | null;
  feedback: string | null;
  submittedAt: string;
  answers: any;
  user: {
    userId: number;
    userName: string;
    userEmail: string;
  };
  assessment: {
    assessmentId: number;
    assessmentTitle: string;
    passingScore: number;
    lesson: {
      lessonTitle: string;
      module: {
        moduleTitle: string;
        course: {
          courseTitle: string;
        };
      };
    };
  };
}
interface Props {
  submissions: {
    data: Submission[];
    current_page: number;
    last_page: number;
  };
  user: any;
}
export default function Grading({ submissions, user }: Props) {
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [grade, setGrade] = useState<number>(0);
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const handleSelectSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
    setGrade(submission.score || 0);
    setFeedback(submission.feedback || '');
  };
  const handleSaveGrade = async () => {
    if (!selectedSubmission) return;
    setSaving(true);
    try {
      const response = await fetch(`/api/instructor/submissions/${selectedSubmission.submissionId}/grade`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({ score: grade, feedback }),
      });
      if (response.status === 419) { window.location.reload(); return; }
      if (!response.ok) throw new Error('Failed To Save');
      showToast(t('gradeSavedSuccess'), 'success');
      setSelectedSubmission({ ...selectedSubmission, score: grade, feedback });
      router.reload();
    } catch (error) {
      showToast(t('gradeSaveFailed'), 'error');
    } finally {
      setSaving(false);
    }
  };
  const filteredSubmissions = submissions.data.filter(s => {
    if (filterStatus === 'graded') return s.score !== null;
    if (filterStatus === 'pending') return s.score === null;
    return true;
  });
  const pendingCount = submissions.data.filter(s => s.score === null).length;
  const gradedCount = submissions.data.filter(s => s.score !== null).length;
  return (
    <Layout user={user}>
      <Head title={t('grading')} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/instructor/dashboard" className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <ChevronLeft className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-black dark:text-white">{t('grading')}</h1>
              <p className="text-zinc-600 dark:text-zinc-400">{pendingCount} {t('pending')} • {gradedCount} {t('gradedFilter')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 cursor-pointer">
              <option value="all">{t('allSubmissions')}</option>
              <option value="pending">{t('pending')}</option>
              <option value="graded">{t('gradedFilter')}</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-700">
              <h2 className="font-bold text-black dark:text-white">{t('submissionsList')}</h2>
            </div>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800 max-h-[600px] overflow-y-auto">
              {filteredSubmissions.length === 0 ? (
                <div className="p-8 text-center text-zinc-500">{t('noSubmissionsFound')}</div>
              ) : (
                filteredSubmissions.map((submission) => (
                  <button key={submission.submissionId} onClick={() => handleSelectSubmission(submission)} className={`w-full p-4 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer ${selectedSubmission?.submissionId === submission.submissionId ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-black dark:text-white">{submission.user.userName}</span>
                      {submission.score !== null ? (
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">{submission.score}%</span>
                        </span>
                      ) : (
                        <Clock className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-sm text-zinc-500 truncate">{submission.assessment.assessmentTitle}</p>
                    <p className="text-xs text-zinc-400 mt-1">{new Date(submission.submittedAt).toLocaleDateString()}</p>
                  </button>
                ))
              )}
            </div>
          </div>
          <div className="lg:col-span-2">
            {selectedSubmission ? (
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
                <div className="mb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-black dark:text-white mb-1">{selectedSubmission.user.userName}</h2>
                      <p className="text-zinc-500">{selectedSubmission.user.userEmail}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${selectedSubmission.score !== null ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                      {selectedSubmission.score !== null ? t('gradedFilter') : t('pending')}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                  <div>
                    <p className="text-sm text-zinc-500">{t('assessment')}</p>
                    <p className="font-medium text-black dark:text-white">{selectedSubmission.assessment.assessmentTitle}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">{t('course')}</p>
                    <p className="font-medium text-black dark:text-white">{selectedSubmission.assessment.lesson?.module?.course?.courseTitle}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">{t('submittedAt')}</p>
                    <p className="font-medium text-black dark:text-white">{new Date(selectedSubmission.submittedAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">{t('passingScore')}</p>
                    <p className="font-medium text-black dark:text-white">{Math.round(selectedSubmission.assessment.passingScore)}%</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">{t('scoreLabel0to100')}</label>
                    <input type="number" min="0" max="100" value={grade} onChange={e => setGrade(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))} className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">{t('feedbackLabel')}</label>
                    <textarea value={feedback} onChange={e => setFeedback(e.target.value)} rows={4} className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={t('feedbackPlaceholder')} />
                  </div>
                  <div className="flex justify-end gap-4">
                    <button onClick={() => setSelectedSubmission(null)} className="px-6 py-2 rounded-lg text-zinc-600 dark:text-zinc-300 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">{t('cancel')}</button>
                    <button onClick={handleSaveGrade} disabled={saving} className="px-6 py-2 rounded-lg text-green-600 border-green-600 border font-medium hover:bg-green-900 hover:text-white disabled:opacity-50 cursor-pointer">{saving ? t('saving') : t('saveGrade')}</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-12 text-center">
                <FileText className="w-16 h-16 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-black dark:text-white mb-2">{t('selectSubmission')}</h3>
                <p className="text-zinc-600 dark:text-zinc-400">{t('selectSubmissionSubtitle')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}