import { FileText, CheckCircle, ChevronDown, ChevronRight, Clock, PlayCircle, FileEdit, Video, BookOpen, Download } from 'lucide-react';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import Layout from '../../components/Layout';
import useTranslation from '../../hooks/useTranslation';
interface Lesson {
  lessonId: number;
  lessonTitle: string;
  contentType: string;
  durationMinutes: number;
  isCompleted: boolean;
}
interface Module {
  moduleId: number;
  moduleTitle: string;
  orderIndex: number;
  lessons: Lesson[];
}
interface LessonViewerProps {
  lesson: {
    lessonId: number;
    lessonTitle: string;
    contentType: string;
    contentData: any;
    durationMinutes: number;
  };
  course: {
    courseId: number;
    courseTitle: string;
  };
  modules: Module[];
  quiz: { quizId: number; quizTitle: string } | null;
  assessment: { assessmentId: number; assessmentTitle: string } | null;
  progress: { isCompleted: boolean; timeSpent: number } | null;
  user: any;
}
export default function LessonViewer({ lesson, course, modules = [], quiz, assessment, progress, user }: LessonViewerProps) {
  const { t } = useTranslation();
  const [expandedModules, setExpandedModules] = useState<number[]>(
    (modules || []).map(m => m.moduleId)
  );
  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };
  const handleMarkComplete = async () => {
    try {
      const response = await fetch(`/api/lessons/${lesson.lessonId}/complete`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        }
      });
      if (response.status === 419) { window.location.reload(); return; }
      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed To Mark Complete:', error);
    }
  };
  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'pdf': return <FileText className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };
  const renderContent = () => {
    const data = lesson.contentData || {};
    switch (lesson.contentType) {
      case 'video':
        const videoUrl = data.path ? `/storage/${data.path}` : (data.videoUrl || data.url || '');
        return (
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            {videoUrl ? (
              <video src={videoUrl} controls className="w-full h-full" controlsList="nodownload">
                {t('yourBrowserDoesNotSupportVideo')}
              </video>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-400">
                <p>{t('noVideoAvailable')}</p>
              </div>
            )}
          </div>
        );
      case 'text':
        const htmlContent = data.content || data.html || data.text || '';
        return (
          <div className="prose prose-lg dark:prose-invert max-w-none text-black dark:text-white">
            {htmlContent ? (
              <div className="text-black dark:text-white" dangerouslySetInnerHTML={{ __html: htmlContent }} />
            ) : (
              <p className="text-zinc-500">{t('noContentAvailable')}</p>
            )}
          </div>
        );
      case 'pdf':
        const pdfUrl = data.path ? `/storage/${data.path}` : (data.pdfUrl || data.url || '');
        return (
          <div className="text-center py-12">
            <FileText className="w-20 h-20 text-zinc-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-zinc-700 dark:text-zinc-300 mb-6">{t('pdfDocument')}</p>
            {pdfUrl ? (
              <div className="flex items-center justify-center gap-4">
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium hover:opacity-80 transition-opacity"
                >
                  <FileText className="w-5 h-5" />
                  {t('viewPdf')}
                </a>
                <a
                  href={pdfUrl}
                  download
                  className="inline-flex items-center gap-2 px-6 py-3 border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  {t('download')}
                </a>
              </div>
            ) : (
              <p className="text-zinc-500">{t('noPdfAvailable')}</p>
            )}
          </div>
        );
      default:
        return <p className="text-zinc-500">{t('unknownContentType', { type: lesson.contentType })}</p>;
    }
  };
  return (
    <Layout user={user}>
      <Head title={lesson.lessonTitle} />
      <div className="flex h-[calc(100vh-64px)]">
        <aside className="w-80 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 overflow-y-auto flex-shrink-0">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
            <Link href={`/courses/${course.courseId}`} className="text-sm text-zinc-500 hover:text-black dark:hover:text-white">
              {t('backToCourse')}
            </Link>
            <h2 className="font-bold text-black dark:text-white mt-2 line-clamp-2">{course.courseTitle}</h2>
          </div>
          <div className="p-2">
            {modules.map((module) => (
              <div key={module.moduleId} className="mb-2">
                <button
                  onClick={() => toggleModule(module.moduleId)}
                  className="w-full flex items-center justify-between p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
                >
                  <span className="font-medium text-sm text-black dark:text-white">{module.moduleTitle}</span>
                  {expandedModules.includes(module.moduleId) ? (
                    <ChevronDown className="w-4 h-4 text-zinc-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-zinc-500" />
                  )}
                </button>
                {expandedModules.includes(module.moduleId) && (
                  <div className="ml-2 space-y-1">
                    {module.lessons.map((l) => (
                      <Link
                        key={l.lessonId}
                        href={`/lessons/${l.lessonId}`}
                        className={`flex items-center gap-3 p-2 rounded-lg text-sm ${l.lessonId === lesson.lessonId
                          ? 'bg-black dark:bg-white text-white dark:text-black'
                          : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                          }`}
                      >
                        {l.isCompleted ? (
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        ) : (
                          getContentIcon(l.contentType)
                        )}
                        <span className="line-clamp-1 flex-1">{l.lessonTitle}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {(quiz || assessment) && (
              <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
                {quiz && (
                  <Link
                    href={`/quiz/${quiz.quizId}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                  >
                    <PlayCircle className="w-5 h-5 text-blue-500" />
                    <span className="font-medium">{quiz.quizTitle}</span>
                  </Link>
                )}
                {assessment && (
                  <Link
                    href={`/assessment/${assessment.assessmentId}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                  >
                    <FileEdit className="w-5 h-5 text-purple-500" />
                    <span className="font-medium">{assessment.assessmentTitle}</span>
                  </Link>
                )}
              </div>
            )}
          </div>
        </aside>
        <main className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-950">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold text-black dark:text-white">{lesson.lessonTitle}</h1>
              </div>
              <div className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {lesson.durationMinutes || 0} {t('minutes')}
                </span>
                {progress?.isCompleted && (
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    {t('completed')}
                  </span>
                )}
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 mb-6 border border-zinc-200 dark:border-zinc-800">
              {renderContent()}
            </div>
            <div className="flex items-center justify-center">
              <button
                onClick={handleMarkComplete}
                disabled={progress?.isCompleted}
                className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-medium hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                {progress?.isCompleted ? t('completed') : t('markAsComplete')}
              </button>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  )
}