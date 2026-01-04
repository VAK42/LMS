import { useState, useEffect } from 'react'
import { X, Plus, Trash2, Save } from 'lucide-react'
import { useToast } from '../../contexts/ToastContext'
import useTranslation from '../../hooks/useTranslation'
interface Question {
  questionId?: number
  questionText: string
  maxScore: number
}
interface Assessment {
  assessmentId?: number
  assessmentTitle: string
  passingScore: number
  questions: Question[]
}
interface Props {
  isOpen: boolean
  onClose: () => void
  courseId: number
}
export default function AssessmentEditor({ isOpen, onClose, courseId }: Props) {
  const { showToast } = useToast()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [assessment, setAssessment] = useState<Assessment>({
    assessmentTitle: 'Essay Assignment',
    passingScore: 70,
    questions: []
  })
  const [newQuestion, setNewQuestion] = useState({ questionText: '', maxScore: 10 })
  useEffect(() => {
    if (isOpen) {
      setAssessment({ assessmentTitle: 'Essay Assignment', passingScore: 70, questions: [] })
      fetchAssessment()
    }
  }, [isOpen, courseId])
  const fetchAssessment = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/instructor/courses/${courseId}/assessment`, {
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
        if (data && data.assessmentId) {
          setAssessment({
            assessmentId: data.assessmentId,
            assessmentTitle: data.assessmentTitle,
            passingScore: data.passingScore ?? 70,
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
  const handleSaveAssessment = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/instructor/courses/${courseId}/assessment`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        },
        body: JSON.stringify({
          assessmentTitle: assessment.assessmentTitle,
          passingScore: Math.floor(assessment.passingScore),
          questions: assessment.questions.map(q => ({ questionText: q.questionText, maxScore: q.maxScore }))
        })
      })
      if (response.status === 419) { window.location.reload(); return }
      const data = await response.json()
      if (!response.ok) {
        showToast(data.error || t('assessmentSaveFailed'), 'error')
        return
      }
      setAssessment(prev => ({ ...prev, assessmentId: data.assessmentId }))
      showToast(t('assessmentSavedSuccess'), 'success')
    } catch (error) {
      showToast(t('assessmentSaveFailed'), 'error')
    } finally {
      setSaving(false)
    }
  }
  const handleAddQuestion = () => {
    if (!newQuestion.questionText.trim()) {
      showToast(t('enterQuestionText'), 'error')
      return
    }
    setAssessment(prev => ({
      ...prev,
      questions: [...prev.questions, { questionText: newQuestion.questionText, maxScore: 10, questionId: Date.now() }]
    }))
    setNewQuestion({ questionText: '', maxScore: 10 })
  }
  const handleDeleteQuestion = (idx: number) => {
    setAssessment(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== idx)
    }))
  }
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-zinc-900 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-bold text-black dark:text-white">{t('essayAssessmentEditor')}</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full cursor-pointer">
            <X className="w-5 h-5 text-zinc-500" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="text-center py-8 text-zinc-500">{t('loading')}</div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">{t('assessmentTitle')}</label>
                  <input type="text" value={assessment.assessmentTitle} onChange={e => setAssessment({ ...assessment, assessmentTitle: e.target.value })} className="w-full px-3 py-2 rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">{t('passingScorePercent')}</label>
                  <input type="number" min="0" max="100" value={assessment.passingScore} onChange={e => setAssessment({ ...assessment, passingScore: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 dark:text-white" />
                </div>
              </div>
              <hr className="border-zinc-200 dark:border-zinc-700" />
              <div>
                <h3 className="text-lg font-bold text-black dark:text-white mb-4">{t('essayQuestions')} ({assessment.questions.length})</h3>
                <div className="space-y-3">
                  {assessment.questions.map((q, idx) => (
                    <div key={q.questionId || idx} className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-medium text-black dark:text-white">{idx + 1}. {q.questionText}</p>
                      </div>
                      <button onClick={() => handleDeleteQuestion(idx)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg space-y-4">
                <h4 className="font-medium text-black dark:text-white">{t('addNewEssayQuestion')}</h4>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">{t('question')}</label>
                  <textarea value={newQuestion.questionText} onChange={e => setNewQuestion({ ...newQuestion, questionText: e.target.value })} className="w-full px-3 py-2 rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 dark:text-white" rows={3} placeholder={t('enterEssayQuestionPlaceholder')} />
                </div>
                <button onClick={handleAddQuestion} className="flex items-center gap-2 px-4 py-2 border border-green-600 text-green-600 rounded hover:bg-green-900 hover:text-white cursor-pointer">
                  <Plus className="w-4 h-4" />
                  {t('addQuestion')}
                </button>
              </div>
            </>
          )}
        </div>
        <div className="p-6 border-t border-zinc-200 dark:border-zinc-800">
          <button onClick={handleSaveAssessment} disabled={saving} className="flex items-center gap-2 px-6 py-3 text-green-600 border border-green-600 rounded hover:bg-green-900 hover:text-white disabled:opacity-50 cursor-pointer">
            <Save className="w-4 h-4" />
            {saving ? t('saving') : t('saveAssessment')}
          </button>
        </div>
      </div>
    </div>
  )
}