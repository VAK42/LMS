import { Head, useForm, router } from '@inertiajs/react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { useState } from 'react';
import Layout from '../components/Layout';
interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}
interface Assessment {
  assessmentId: number;
  assessmentTitle: string;
  assessmentType: string;
  questionData: Question[];
  passingScore: number;
  timeLimit: number | null;
  maxAttempts: number;
}
interface AssessmentProps {
  assessment: Assessment;
  attempts: number;
  user: any;
}
export default function AssessmentTaking({ assessment, attempts, user }: AssessmentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(assessment.timeLimit ? assessment.timeLimit * 60 : null);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { data, setData, post, processing } = useForm({
    answerData: {} as Record<number, number>,
  });
  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setData('answerData', {
      ...data.answerData,
      [questionIndex]: answerIndex,
    });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(`/api/assessments/${assessment.assessmentId}/submit`, {
      onSuccess: (response: any) => {
        setResults(response.props);
        setShowResults(true);
      },
    });
  };
  const progress = ((currentQuestion + 1) / assessment.questionData.length) * 100;
  if (showResults && results) {
    return (
      <Layout user={user}>
        <Head title={`Results - ${assessment.assessmentTitle}`} />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center">
            {results.isPassed ? (
              <>
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-green-600 mb-2">Congratulations!</h2>
              </>
            ) : (
              <>
                <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-red-600 mb-2">Not Passed</h2>
              </>
            )}
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-6">
              Your Score: {results.score.toFixed(1)}% (Passing: {assessment.passingScore}%)
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-xl">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {Math.round(results.score)}%
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Score</div>
              </div>
              <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-xl">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {attempts + 1}/{assessment.maxAttempts}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Attempts</div>
              </div>
            </div>
            {!results.isPassed && attempts + 1 < assessment.maxAttempts && (
              <button
                onClick={() => router.reload()}
                className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </Layout>
    )
  }
  return (
    <Layout user={user}>
      <Head title={assessment.assessmentTitle} />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {assessment.assessmentTitle}
            </h1>
            {timeRemaining && (
              <div className="flex items-center gap-2 text-orange-600">
                <Clock className="w-5 h-5" />
                <span className="font-mono text-lg">
                  {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
                </span>
              </div>
            )}
          </div>
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Question {currentQuestion + 1} Of {assessment.questionData.length}
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 mb-6">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
              {assessment.questionData[currentQuestion].question}
            </h3>
            <div className="space-y-3">
              {assessment.questionData[currentQuestion].options.map((option, idx) => (
                <label
                  key={idx}
                  className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${data.answerData[currentQuestion] === idx
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'
                    }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    checked={data.answerData[currentQuestion] === idx}
                    onChange={() => handleAnswerSelect(currentQuestion, idx)}
                    className="sr-only"
                  />
                  <span className="text-slate-900 dark:text-white">{option}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="px-6 py-3 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-50"
            >
              Previous
            </button>
            {currentQuestion < assessment.questionData.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={processing || Object.keys(data.answerData).length < assessment.questionData.length}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg disabled:opacity-50"
              >
                Submit Quiz
              </button>
            )}
          </div>
        </form>
      </div>
    </Layout>
  )
}