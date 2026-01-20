import { Send, CheckCircle, MessageSquare } from 'lucide-react'
import { useToast } from '../../contexts/ToastContext'
import { Head, router } from '@inertiajs/react'
import { useState } from 'react'
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
      if (!response.ok) throw new Error(t('failed'));
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
        <div className="bg-white dark:bg-zinc-900 rounded border border-green-950 dark:border-white overflow-hidden">
          <div className="p-6 bg-green-950 dark:bg-white border-b border-green-950 dark:border-white">
            <h1 className="text-2xl font-serif text-white dark:text-green-950">{assessment.assessmentTitle}</h1>
            <p className="text-green-200 dark:text-green-800">{assessment.lesson.module.course.courseTitle}</p>
          </div>
          {submitted ? (
            <div className="p-8">
              <div className="text-center mb-8">
                <CheckCircle className="w-16 h-16 text-green-950 dark:text-white mx-auto mb-4" />
                <h2 className="text-2xl font-serif text-green-950 dark:text-white mb-2">
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
                  <div className="bg-green-50 dark:bg-zinc-800 border border-green-950 dark:border-white rounded p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-green-950 dark:text-white">{t('scoreLabel')}</span>
                      <span className="text-2xl text-green-950 dark:text-white">{Math.round(submission.score || 0)}</span>
                      <span className="text-zinc-600 dark:text-zinc-400">/ {Math.round(assessment.questionData.reduce((sum, q) => sum + q.maxScore, 0))}</span>
                    </div>
                    {submission.score !== null && submission.score >= assessment.passingScore && (
                      <p className="text-green-700 dark:text-green-400 text-sm">{t('passedLabel')}</p>
                    )}
                    {submission.score !== null && submission.score < assessment.passingScore && (
                      <p className="text-red-600 dark:text-red-400 text-sm">{t('belowPassingScore', { score: assessment.passingScore })}</p>
                    )}
                  </div>
                  {submission.feedback && (
                    <div className="bg-blue-50 dark:bg-zinc-800 border border-blue-200 dark:border-blue-900 rounded p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-5 h-5 text-blue-800 dark:text-blue-400" />
                        <span className="text-blue-800 dark:text-blue-400">{t('instructorFeedback')}</span>
                      </div>
                      <p className="text-blue-900 dark:text-blue-300 whitespace-pre-wrap">{submission.feedback}</p>
                    </div>
                  )}
                  <div className="space-y-4">
                    <h3 className="text-green-950 dark:text-white">{t('yourAnswers')}</h3>
                    {assessment.questionData.map((question, idx) => (
                      <div key={idx} className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700">
                        <p className="font-medium text-green-950 dark:text-white mb-2">{idx + 1}. {question.questionText}</p>
                        <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">{submission.answers[idx] || t('noAnswer')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-8 text-center">
                <button onClick={() => router.visit(`/courses/${assessment.lesson.module.course.courseId}`)} className="px-6 py-3 border border-green-950 dark:border-white text-green-950 dark:text-white rounded hover:bg-green-950 hover:text-white dark:hover:bg-white dark:hover:text-green-950 transition-colors cursor-pointer">
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
                      <p className="font-medium text-green-950 dark:text-white">{idx + 1}. {question.questionText}</p>
                      <span className="text-sm text-zinc-500 whitespace-nowrap ml-4">{question.maxScore} {t('points')}</span>
                    </div>
                    <textarea
                      value={answers[idx] || ''}
                      onChange={e => setAnswers({ ...answers, [idx]: e.target.value })}
                      className="w-full px-4 py-3 rounded border border-green-950 dark:border-white bg-white dark:bg-zinc-800 text-green-950 dark:text-white min-h-[150px] focus:ring-1 focus:ring-green-950 dark:focus:ring-white focus:outline-none"
                      placeholder={t('writeYourAnswerHere')}
                    />
                  </div>
                ))}
              </div>
              <div className="p-6 border-t border-green-950 dark:border-white flex justify-end">
                <button onClick={handleSubmit} disabled={submitting} className="flex items-center gap-2 px-6 py-3 bg-green-950 dark:bg-white text-white dark:text-green-950 rounded hover:bg-white hover:text-green-950 hover:border-green-950 dark:hover:bg-green-950 dark:hover:text-white dark:hover:border-green-950 border border-transparent transition-colors disabled:opacity-50 cursor-pointer">
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