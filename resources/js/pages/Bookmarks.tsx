import { Head } from '@inertiajs/react';
import { Bookmark as BookmarkIcon, StickyNote } from 'lucide-react';
import Layout from '../components/Layout';
import EmptyState from '../components/EmptyState';
interface BookmarksProps {
  bookmarks: Array<{
    bookmarkId: number;
    note: string | null;
    lesson: {
      lessonId: number;
      lessonTitle: string;
      module: {
        moduleTitle: string;
        course: {
          courseTitle: string;
        };
      };
    };
    createdAt: string;
  }>;
  user: any;
}
export default function Bookmarks({ bookmarks, user }: BookmarksProps) {
  return (
    <Layout user={user}>
      <Head title="My Bookmarks" />
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
          My Bookmarks
        </h1>
        {bookmarks.length === 0 ? (
          <EmptyState
            icon={<BookmarkIcon className="w-10 h-10 text-slate-400" />}
            title="No Bookmarks Yet"
            description="Bookmark Lessons To Save Them For Later Review"
          />
        ) : (
          <div className="space-y-4">
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark.bookmarkId}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4">
                  <BookmarkIcon className="w-6 h-6 text-yellow-600 fill-yellow-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                      {bookmark.lesson.lessonTitle}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                      {bookmark.lesson.module.course.courseTitle} / {bookmark.lesson.module.moduleTitle}
                    </p>
                    {bookmark.note && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
                        <div className="flex items-center gap-2 mb-2">
                          <StickyNote className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm font-medium text-yellow-900 dark:text-yellow-400">
                            Note
                          </span>
                        </div>
                        <p className="text-sm text-yellow-800 dark:text-yellow-300">
                          {bookmark.note}
                        </p>
                      </div>
                    )}
                    <div className="flex items-center gap-4 mt-4">
                      <a
                        href={`/lessons/${bookmark.lesson.lessonId}`}
                        className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                      >
                        View Lesson
                      </a>
                      <span className="text-sm text-slate-500">
                        Saved {new Date(bookmark.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}