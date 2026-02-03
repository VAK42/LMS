import { Clock, CheckCircle, XCircle, ArrowLeft, ArrowRight, Send } from 'lucide-react'
import { useToast } from '../../contexts/ToastContext'
import { Head, router } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import useTranslation from '../../hooks/useTranslation'
interface Question {
  questionId: number
  questionText: string
  options: string[]
}
interface Quiz {
  quizId: number
  quizTitle: string
  passingScore: number
  timeLimitMinutes: number | null
  questions: Question[]
  course: { courseId: number; courseTitle: string }
}
interface Attempt {
  score: number
  completedAt: string
}
interface Props {
  quiz: Quiz
  lastAttempt: Attempt | null
  user: any
}
export default function Quiz({ quiz, lastAttempt, user }: Props) {
  const { showToast } = useToast()
  const { t } = useTranslation()
  const [started, setStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: number }>({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ score: number; passed: boolean; correctCount: number; totalQuestions: number } | null>(null)
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimitMinutes ? quiz.timeLimitMinutes * 60 : null)
  useEffect(() => {
    if (!started || !timeLeft) return
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev && prev <= 1) {
          clearInterval(timer)
          handleSubmit()
          return 0
        }
        return prev ? prev - 1 : null
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [started])
  const handleAnswer = (questionId: number, answerIndex: number) => {
    setAnswers({ ...answers, [questionId]: answerIndex })
  }
  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const response = await fetch(`/api/quiz/${quiz.quizId}/submit`, {
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
      if (!response.ok) throw new Error(t('failed'))
      const data = await response.json()
      setResult(data)
      showToast(data.passed ? t('congratulationsPassed') : t('tryAgain'), data.passed ? 'success' : 'error')
    } catch (error) {
      showToast(t('failedToSubmit'), 'error')
    } finally {
      setSubmitting(false)
    }
  }
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }
  const question = quiz.questions[currentQuestion]
  const answeredCount = Object.keys(answers).length
  return (
    <Layout user={user}>
      <Head title={quiz.quizTitle} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!started && !result ? (
          <div className="bg-white dark:bg-zinc-900 rounded border border-green-950 dark:border-white p-8 text-center">
            <h1 className="text-3xl font-serif text-green-950 dark:text-white mb-4">{quiz.quizTitle}</h1>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">{quiz.course.courseTitle}</p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded border border-green-950 dark:border-white">
                <p className="text-2xl text-green-950 dark:text-white">{quiz.questions.length}</p>
                <p className="text-sm text-zinc-500">{t('questions')}</p>
              </div>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded border border-green-950 dark:border-white">
                <p className="text-2xl text-green-950 dark:text-white">{quiz.passingScore}%</p>
                <p className="text-sm text-zinc-500">{t('toPass')}</p>
              </div>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded border border-green-950 dark:border-white">
                <p className="text-2xl text-green-950 dark:text-white">{quiz.timeLimitMinutes || '∞'}</p>
                <p className="text-sm text-zinc-500">{t('minutes')}</p>
              </div>
            </div>
            {lastAttempt && (
              <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-700">
                <p className="text-yellow-700 dark:text-yellow-400">{t('lastAttempt', { score: lastAttempt.score, date: new Date(lastAttempt.completedAt).toLocaleDateString() })}</p>
              </div>
            )}
            <button onClick={() => setStarted(true)} className="px-8 py-3 bg-green-950 dark:bg-white text-white dark:text-green-950 rounded hover:bg-white hover:text-green-950 hover:border-green-950 dark:hover:bg-green-950 dark:hover:text-white dark:hover:border-green-950 border border-transparent transition-colors cursor-pointer text-lg">
              {t('startQuiz')}
            </button>
          </div>
        ) : result ? (
          <div className="bg-white dark:bg-zinc-900 rounded border border-green-950 dark:border-white p-8 text-center">
            {result.passed ? (
              <CheckCircle className="w-20 h-20 text-green-600 dark:text-green-500 mx-auto mb-4" />
            ) : (
              <XCircle className="w-20 h-20 text-red-600 dark:text-red-500 mx-auto mb-4" />
            )}
            <h1 className="text-3xl font-serif text-green-950 dark:text-white mb-2">
              {result.passed ? t('congratulationsPassed') : t('notQuite')}
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              {t('youScored', { score: result.score, correct: result.correctCount, total: result.totalQuestions })}
            </p>
            <p className={`text-lg mb-8 ${result.passed ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
              {result.passed ? t('youPassed') : t('youNeedToPass', { score: quiz.passingScore })}
            </p>
            <div className="flex gap-4 justify-center">
              <button onClick={() => router.visit(`/courses/${quiz.course.courseId}`)} className="px-6 py-3 border border-green-950 dark:border-white text-green-950 dark:text-white rounded hover:bg-green-950 hover:text-white dark:hover:bg-white dark:hover:text-green-950 transition-colors cursor-pointer">
                {t('backToCourseSimple')}
              </button>
              {!result.passed && (
                <button onClick={() => { setResult(null); setStarted(false); setAnswers({}); setCurrentQuestion(0); setTimeLeft(quiz.timeLimitMinutes ? quiz.timeLimitMinutes * 60 : null) }} className="px-6 py-3 bg-green-950 dark:bg-white text-white dark:text-green-950 rounded hover:bg-white hover:text-green-950 hover:border-green-950 dark:hover:bg-green-950 dark:hover:text-white dark:hover:border-green-950 border border-transparent transition-colors cursor-pointer">
                  {t('tryAgain')}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 rounded border border-green-950 dark:border-white overflow-hidden">
            <div className="p-4 bg-zinc-50 dark:bg-zinc-800 border-b border-green-950 dark:border-white flex items-center justify-between">
              <div>
                <h2 className="text-green-950 dark:text-white">{quiz.quizTitle}</h2>
                <p className="text-sm text-zinc-500">{t('questionOf', { current: currentQuestion + 1, total: quiz.questions.length })}</p>
              </div>
              {timeLeft !== null && (
                <div className={`flex items-center gap-2 px-4 py-2 rounded border ${timeLeft < 60 ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-900/30 dark:border-red-800' : 'bg-green-50 border-green-200 text-green-950 dark:bg-zinc-800 dark:border-green-950 dark:text-white'}`}>
                  <Clock className="w-4 h-4" />
                  <span className="font-mono">{formatTime(timeLeft)}</span>
                </div>
              )}
            </div>
            <div className="p-8">
              <p className="text-xl font-medium text-green-950 dark:text-white mb-6">{question.questionText}</p>
              <div className="space-y-3">
                {question.options.map((option, idx) => (
                  <button key={idx} onClick={() => handleAnswer(question.questionId, idx)} className={`w-full text-left p-4 rounded border-2 transition-all cursor-pointer ${answers[question.questionId] === idx ? 'border-green-950 bg-green-50 dark:bg-green-900/20 dark:border-white' : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'}`}>
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full mr-3 text-sm ${answers[question.questionId] === idx ? 'bg-green-950 text-white dark:bg-white dark:text-green-950' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300'}`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-zinc-700 dark:text-zinc-300 font-medium">{option}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 bg-zinc-50 dark:bg-zinc-800 border-t border-green-950 dark:border-white flex items-center justify-between">
              <button onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))} disabled={currentQuestion === 0} className="flex items-center gap-2 px-4 py-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded disabled:opacity-30 cursor-pointer font-medium">
                <ArrowLeft className="w-4 h-4" />
                {t('previous')}
              </button>
              <div className="flex gap-1">
                {quiz.questions.map((_, idx) => (
                  <button key={idx} onClick={() => setCurrentQuestion(idx)} className={`w-8 h-8 rounded text-sm cursor-pointer ${idx === currentQuestion ? 'bg-green-950 text-white dark:bg-white dark:text-green-950' : answers[quiz.questions[idx].questionId] !== undefined ? 'bg-green-600 text-white' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300'}`}>
                    {idx + 1}
                  </button>
                ))}
              </div>
              {currentQuestion === quiz.questions.length - 1 ? (
                <button onClick={handleSubmit} disabled={submitting || answeredCount < quiz.questions.length} className="flex items-center gap-2 px-6 py-2 bg-green-950 dark:bg-white text-white dark:text-green-950 rounded hover:bg-white hover:text-green-950 hover:border-green-950 dark:hover:bg-green-950 dark:hover:text-white dark:hover:border-green-950 border border-transparent transition-colors disabled:opacity-50 cursor-pointer">
                  <Send className="w-4 h-4" />
                  {submitting ? t('submitting') : t('submit')}
                </button>
              ) : (
                <button onClick={() => setCurrentQuestion(Math.min(quiz.questions.length - 1, currentQuestion + 1))} className="flex items-center gap-2 px-4 py-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded cursor-pointer font-medium">
                  {t('next')}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}