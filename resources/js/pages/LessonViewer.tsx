import { Head, router } from '@inertiajs/react';
import { FileText, CheckCircle, ChevronRight, Bookmark, Clock } from 'lucide-react';
import { useState } from 'react';
import Layout from '../components/Layout';
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
  module: {
    moduleTitle: string;
  };
  progress: {
    isCompleted: boolean;
    timeSpent: number;
  } | null;
  nextLesson: { lessonId: number; lessonTitle: string } | null;
  user: any;
}
export default function LessonViewer({ lesson, course, module, progress, nextLesson, user }: LessonViewerProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const handleMarkComplete = () => {
    router.post(`/api/lessons/${lesson.lessonId}/complete`);
  };
  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };
  const renderContent = () => {
    switch (lesson.contentType) {
      case 'video':
        return (
          <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden">
            <video
              src={lesson.contentData.videoUrl}
              controls
              className="w-full h-full"
            >
              Your Browser Does Not Support Video Playback!
            </video>
          </div>
        );
      case 'text':
        return (
          <div
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: lesson.contentData.content }}
          />
        );
      case 'pdf':
        return (
          <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-8">
            <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-center text-slate-600 dark:text-slate-400 mb-4">
              PDF Document
            </p>
            <a
              href={lesson.contentData.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Open PDF
            </a>
          </div>
        );
      default:
        return <p>Unknown Content Type</p>;
    }
  };
  return (
    <Layout user={user}>
      <Head title={lesson.lessonTitle} />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
            {course.courseTitle} / {module.moduleTitle}
          </p>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              {lesson.lessonTitle}
            </h1>
            <button
              onClick={handleBookmark}
              className={`p-3 rounded-lg transition-colors ${bookmarked
                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
            >
              <Bookmark className={`w-6 h-6 ${bookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
          <div className="flex items-center gap-4 mt-3 text-sm text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {lesson.durationMinutes} Min
            </span>
            {progress?.isCompleted && (
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-4 h-4" />
                Completed
              </span>
            )}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 mb-6">
          {renderContent()}
        </div>
        <div className="flex items-center justify-between">
          <button
            onClick={handleMarkComplete}
            disabled={progress?.isCompleted}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            {progress?.isCompleted ? 'Completed' : 'Mark As Complete'}
          </button>
          {nextLesson && (
            <a
              href={`/lessons/${nextLesson.lessonId}`}
              className="px-6 py-3 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors flex items-center gap-2"
            >
              Next Lesson
              <ChevronRight className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>
    </Layout>
  )
}