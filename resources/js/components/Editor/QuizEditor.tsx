import { useState, useEffect } from 'react'
import { X, Plus, Trash2, Save } from 'lucide-react'
import { useToast } from '../../contexts/ToastContext'
import useTranslation from '../../hooks/useTranslation'
interface Question {
  questionId?: number
  questionText: string
  options: string[]
  correctAnswer: number
}
interface Quiz {
  quizId?: number
  quizTitle: string
  passingScore: number
  timeLimitMinutes: number | null
  questions: Question[]
}
interface Props {
  isOpen: boolean
  onClose: () => void
  courseId: number
}
export default function QuizEditor({ isOpen, onClose, courseId }: Props) {
  const { showToast } = useToast()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [quiz, setQuiz] = useState<Quiz>({
    quizTitle: t('defaultQuizTitle'),
    passingScore: 70,
    timeLimitMinutes: null,
    questions: []
  })
  const [newQuestion, setNewQuestion] = useState<Question>({
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  })
  useEffect(() => {
    if (isOpen) {
      setQuiz({ quizTitle: t('defaultQuizTitle'), passingScore: 70, timeLimitMinutes: null, questions: [] })
      fetchQuiz()
    }
  }, [isOpen, courseId])
  const fetchQuiz = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/instructor/courses/${courseId}/quiz`, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        }
      })
      if (response.status === 419) { window.location.reload(); return }
      if (response.ok) {
        const data = await response.json()
        if (data && data.quizId) {
          setQuiz({
            quizId: data.quizId,
            quizTitle: data.quizTitle,
            passingScore: data.passingScore ?? 70,
            timeLimitMinutes: data.timeLimitMinutes,
            questions: data.questions || []
          })
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  const handleSaveQuiz = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/instructor/courses/${courseId}/quiz`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        },
        body: JSON.stringify({
          quizTitle: quiz.quizTitle,
          passingScore: quiz.passingScore,
          timeLimitMinutes: quiz.timeLimitMinutes,
          questions: quiz.questions.map(q => ({
            questionText: q.questionText,
            options: q.options,
            correctAnswer: q.correctAnswer
          }))
        })
      })
      if (response.status === 419) { window.location.reload(); return }
      const data = await response.json()
      if (!response.ok) {
        showToast(data.error || t('quizSaveFailed'), 'error')
        return
      }
      setQuiz(prev => ({ ...prev, quizId: data.quizId, questions: data.questions || prev.questions }))
      showToast(t('quizSavedSuccess'), 'success')
    } catch (error) {
      showToast(t('quizSaveFailed'), 'error')
    } finally {
      setSaving(false)
    }
  }
  const handleAddQuestion = () => {
    if (!newQuestion.questionText.trim() || newQuestion.options.some(o => !o.trim())) {
      showToast(t('fillAllFields'), 'error')
      return
    }
    setQuiz(prev => ({
      ...prev,
      questions: [...prev.questions, { ...newQuestion, questionId: Date.now() }]
    }))
    setNewQuestion({ questionText: '', options: ['', '', '', ''], correctAnswer: 0 })
  }
  const handleDeleteQuestion = (questionId: number) => {
    setQuiz(prev => ({ ...prev, questions: prev.questions.filter(q => q.questionId !== questionId) }))
  }
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-zinc-900 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-bold text-black dark:text-white">{t('quizEditor')}</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full cursor-pointer">
            <X className="w-5 h-5 text-zinc-500" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="text-center py-8 text-zinc-500">{t('loading')}</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">{t('quizTitle')}</label>
                  <input type="text" value={quiz.quizTitle} onChange={e => setQuiz({ ...quiz, quizTitle: e.target.value })} className="w-full px-3 py-2 rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">{t('passingScorePercent')}</label>
                  <input type="number" min="0" max="100" value={quiz.passingScore} onChange={e => setQuiz({ ...quiz, passingScore: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">{t('timeLimit')}</label>
                  <input type="number" min="1" value={quiz.timeLimitMinutes || ''} onChange={e => setQuiz({ ...quiz, timeLimitMinutes: e.target.value ? parseInt(e.target.value) : null })} placeholder={t('noLimit')} className="w-full px-3 py-2 rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 dark:text-white" />
                </div>
              </div>
              <button onClick={handleSaveQuiz} disabled={saving} className="flex items-center gap-2 px-4 py-2 text-green-600 border border-green-600 rounded hover:bg-green-900 hover:text-white disabled:opacity-50 cursor-pointer">
                <Save className="w-4 h-4" />
                {saving ? t('saving') : t('saveQuizSettings')}
              </button>
              <hr className="border-zinc-200 dark:border-zinc-700" />
              <div>
                <h3 className="text-lg font-bold text-black dark:text-white mb-4">{t('questions')} ({quiz.questions.length})</h3>
                <div className="space-y-4">
                  {quiz.questions.map((q, idx) => (
                    <div key={q.questionId} className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-medium text-black dark:text-white mb-2">{idx + 1}. {q.questionText}</p>
                          <div className="grid grid-cols-2 gap-2">
                            {q.options.map((opt, i) => (
                              <div key={i} className={`px-3 py-2 rounded text-sm ${i === q.correctAnswer ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-white dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'}`}>
                                {String.fromCharCode(65 + i)}. {opt}
                              </div>
                            ))}
                          </div>
                        </div>
                        <button onClick={() => handleDeleteQuestion(q.questionId!)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <hr className="border-zinc-200 dark:border-zinc-700" />
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-black dark:text-white mb-4">{t('addNewQuestion')}</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">{t('question')}</label>
                    <textarea value={newQuestion.questionText} onChange={e => setNewQuestion({ ...newQuestion, questionText: e.target.value })} className="w-full px-3 py-2 rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 dark:text-white" rows={2} placeholder={t('enterQuestionPlaceholder')} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {newQuestion.options.map((opt, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <button onClick={() => setNewQuestion({ ...newQuestion, correctAnswer: i })} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium cursor-pointer ${i === newQuestion.correctAnswer ? 'bg-green-500 text-white' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300'}`}>
                          {String.fromCharCode(65 + i)}
                        </button>
                        <input type="text" value={opt} onChange={e => { const opts = [...newQuestion.options]; opts[i] = e.target.value; setNewQuestion({ ...newQuestion, options: opts }) }} className="flex-1 px-3 py-2 rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 dark:text-white text-sm" placeholder={`${t('optionPlaceholder')} ${String.fromCharCode(65 + i)}`} />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-zinc-500">{t('clickToMarkCorrect')}</p>
                  <button onClick={handleAddQuestion} className="flex items-center gap-2 px-4 py-2 border border-green-600 text-green-600 rounded hover:bg-green-900 hover:text-white cursor-pointer">
                    <Plus className="w-4 h-4" />
                    {t('addQuestion')}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}