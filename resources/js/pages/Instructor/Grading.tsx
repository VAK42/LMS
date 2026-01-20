import { CheckCircle, Clock, FileText, ChevronLeft } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
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
      if (!response.ok) throw new Error(t('failedToSave'));
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
              <h1 className="text-2xl font-serif text-green-950 dark:text-white">{t('grading')}</h1>
              <p className="text-zinc-600 dark:text-zinc-400">{pendingCount} {t('pending')} • {gradedCount} {t('gradedFilter')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-4 py-2 rounded border border-green-950 dark:border-white bg-white dark:bg-zinc-900 text-green-950 dark:text-white cursor-pointer focus:outline-none font-medium">
              <option value="all">{t('allSubmissions')}</option>
              <option value="pending">{t('pending')}</option>
              <option value="graded">{t('gradedFilter')}</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-zinc-900 rounded border border-green-950 dark:border-white overflow-hidden">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
              <h2 className="text-green-950 dark:text-white">{t('submissionsList')}</h2>
            </div>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800 max-h-[600px] overflow-y-auto">
              {filteredSubmissions.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 font-medium">{t('noSubmissionsFound')}</div>
              ) : (
                filteredSubmissions.map((submission) => (
                  <button key={submission.submissionId} onClick={() => handleSelectSubmission(submission)} className={`w-full p-4 text-left hover:bg-green-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer ${selectedSubmission?.submissionId === submission.submissionId ? 'bg-green-100 dark:bg-green-900/30 border-l-4 border-green-950' : 'border-l-4 border-transparent'}`}>
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-green-950 dark:text-white">{submission.user.userName}</span>
                      {submission.score !== null ? (
                        <span className="flex items-center gap-1 text-green-600 font-medium">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">{submission.score}%</span>
                        </span>
                      ) : (
                        <Clock className="w-4 h-4 text-yellow-600" />
                      )}
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">{submission.assessment.assessmentTitle}</p>
                    <p className="text-xs text-zinc-500 mt-1">{new Date(submission.submittedAt).toLocaleDateString()}</p>
                  </button>
                ))
              )}
            </div>
          </div>
          <div className="lg:col-span-2">
            {selectedSubmission ? (
              <div className="bg-white dark:bg-zinc-900 rounded border border-green-950 dark:border-white p-6">
                <div className="mb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl text-green-950 dark:text-white mb-1">{selectedSubmission.user.userName}</h2>
                      <p className="text-zinc-500">{selectedSubmission.user.userEmail}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm border ${selectedSubmission.score !== null ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800'}`}>
                      {selectedSubmission.score !== null ? t('gradedFilter') : t('pending')}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-zinc-50 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700">
                  <div>
                    <p className="text-sm text-zinc-500 font-medium">{t('assessment')}</p>
                    <p className="text-green-950 dark:text-white">{selectedSubmission.assessment.assessmentTitle}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500 font-medium">{t('course')}</p>
                    <p className="text-green-950 dark:text-white">{selectedSubmission.assessment.lesson?.module?.course?.courseTitle}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500 font-medium">{t('submittedAt')}</p>
                    <p className="text-green-950 dark:text-white">{new Date(selectedSubmission.submittedAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500 font-medium">{t('passingScore')}</p>
                    <p className="text-green-950 dark:text-white">{Math.round(selectedSubmission.assessment.passingScore)}%</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm text-green-950 dark:text-white mb-2">{t('scoreLabel0to100')}</label>
                    <input type="number" min="0" max="100" value={grade} onChange={e => setGrade(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))} className="w-full px-4 py-3 rounded border border-green-950 dark:border-white bg-white dark:bg-zinc-900 text-green-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-950 dark:focus:ring-white text-lg" />
                  </div>
                  <div>
                    <label className="block text-sm text-green-950 dark:text-white mb-2">{t('feedbackLabel')}</label>
                    <textarea value={feedback} onChange={e => setFeedback(e.target.value)} rows={4} className="w-full px-4 py-3 rounded border border-green-950 dark:border-white bg-white dark:bg-zinc-900 text-green-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-950 dark:focus:ring-white" placeholder={t('feedbackPlaceholder')} />
                  </div>
                  <div className="flex justify-end gap-4">
                    <button onClick={() => setSelectedSubmission(null)} className="px-6 py-2 rounded border border-green-950 dark:border-white text-green-950 dark:text-white font-medium hover:bg-green-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer">{t('cancel')}</button>
                    <button onClick={handleSaveGrade} disabled={saving} className="px-6 py-2 rounded bg-green-950 dark:bg-white text-white dark:text-green-950 hover:bg-white hover:text-green-950 hover:border-green-950 dark:hover:bg-green-950 dark:hover:text-white dark:hover:border-green-950 border border-transparent transition-colors disabled:opacity-50 cursor-pointer">{saving ? t('saving') : t('saveGrade')}</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-zinc-900 rounded border border-green-950 dark:border-white p-12 text-center h-full flex flex-col items-center justify-center">
                <FileText className="w-16 h-16 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
                <h3 className="text-xl text-green-950 dark:text-white mb-2">{t('selectSubmission')}</h3>
                <p className="text-zinc-600 dark:text-zinc-400">{t('selectSubmissionSubtitle')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}