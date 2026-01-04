import { Send, CheckCircle, MessageSquare } from 'lucide-react'
import { Head, router } from '@inertiajs/react'
import { useState } from 'react'
import { useToast } from '../../contexts/ToastContext'
import Layout from '../../components/Layout'
import useTranslation from '../../hooks/useTranslation'
interface Question {
  questionText: string
  maxScore: number
}
interface Assessment {
  assessmentId: number
  assessmentTitle: string
  passingScore: number
  questionData: Question[]
  lesson: { lessonTitle: string; module: { moduleTitle: string; course: { courseId: number; courseTitle: string } } }
}
interface Submission {
  submissionId: number
  answers: { [key: number]: string }
  score: number | null
  feedback: string | null
  submittedAt: string
  isGraded: boolean
}
interface Props {
  assessment: Assessment
  submission: Submission | null
  user: any
}
export default function Essay({ assessment, submission, user }: Props) {
  const { showToast } = useToast()
  const { t } = useTranslation()
  const [answers, setAnswers] = useState<{ [key: number]: string }>(submission?.answers || {})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(!!submission)
  const handleSubmit = async () => {
    const allAnswered = assessment.questionData.every((_, idx) => answers[idx]?.trim())
    if (!allAnswered) {
      showToast(t('pleaseAnswerAllQuestions'), 'error')
      return
    }
    setSubmitting(true)
    try {
      const response = await fetch(`/api/assessment/${assessment.assessmentId}/submit`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        },
        body: JSON.stringify({ answers })
      })
      if (response.status === 419) { window.location.reload(); return }
      if (!response.ok) throw new Error('Failed!')
      setSubmitted(true)
      showToast(t('essaySubmitted'), 'success')
    } catch (error) {
      showToast(t('failedToSubmit'), 'error')
    } finally {
      setSubmitting(false)
    }
  }
  return (
    <Layout user={user}>
      <Head title={assessment.assessmentTitle} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="p-6 bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
            <h1 className="text-2xl font-bold text-black dark:text-white">{assessment.assessmentTitle}</h1>
            <p className="text-zinc-600 dark:text-zinc-400">{assessment.lesson.module.course.courseTitle}</p>
          </div>
          {submitted ? (
            <div className="p-8">
              <div className="text-center mb-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-black dark:text-white mb-2">
                  {submission?.isGraded ? t('graded') : t('submittedSuccessfully')}
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {submission?.isGraded
                    ? t('youScoredPoints', { score: Math.round(submission.score || 0) })
                    : t('essaySubmittedWait')
                  }
                </p>
              </div>
              {submission?.isGraded && (
                <div className="space-y-6">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-green-700 dark:text-green-400 font-bold">{t('scoreLabel')}</span>
                      <span className="text-2xl font-bold text-green-700 dark:text-green-400">{Math.round(submission.score || 0)}</span>
                      <span className="text-green-600 dark:text-green-500">/ {Math.round(assessment.questionData.reduce((sum, q) => sum + q.maxScore, 0))}</span>
                    </div>
                    {submission.score !== null && submission.score >= assessment.passingScore && (
                      <p className="text-green-600 dark:text-green-400 text-sm">{t('passedLabel')}</p>
                    )}
                    {submission.score !== null && submission.score < assessment.passingScore && (
                      <p className="text-red-600 dark:text-red-400 text-sm">{t('belowPassingScore', { score: assessment.passingScore })}</p>
                    )}
                  </div>
                  {submission.feedback && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span className="font-bold text-blue-700 dark:text-blue-400">{t('instructorFeedback')}</span>
                      </div>
                      <p className="text-blue-800 dark:text-blue-300 whitespace-pre-wrap">{submission.feedback}</p>
                    </div>
                  )}
                  <div className="space-y-4">
                    <h3 className="font-bold text-black dark:text-white">{t('yourAnswers')}</h3>
                    {assessment.questionData.map((question, idx) => (
                      <div key={idx} className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                        <p className="font-medium text-black dark:text-white mb-2">{idx + 1}. {question.questionText}</p>
                        <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">{submission.answers[idx] || t('noAnswer')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-8 text-center">
                <button onClick={() => router.visit(`/courses/${assessment.lesson.module.course.courseId}`)} className="px-6 py-3 border border-green-600 text-green-600 dark:border-green-500 dark:text-green-500 rounded hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer">
                  {t('backToCourseSimple')}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="p-6 space-y-8">
                {assessment.questionData.map((question, idx) => (
                  <div key={idx} className="space-y-3">
                    <div className="flex items-start justify-between">
                      <p className="font-medium text-black dark:text-white">{idx + 1}. {question.questionText}</p>
                      <span className="text-sm text-zinc-500 whitespace-nowrap ml-4">{question.maxScore} {t('points')}</span>
                    </div>
                    <textarea
                      value={answers[idx] || ''}
                      onChange={e => setAnswers({ ...answers, [idx]: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 dark:text-white min-h-[150px]"
                      placeholder={t('writeYourAnswerHere')}
                    />
                  </div>
                ))}
              </div>
              <div className="p-6 border-t border-zinc-200 dark:border-zinc-700 flex justify-end">
                <button onClick={handleSubmit} disabled={submitting} className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 cursor-pointer">
                  <Send className="w-4 h-4" />
                  {submitting ? t('submitting') : t('submitEssay')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}