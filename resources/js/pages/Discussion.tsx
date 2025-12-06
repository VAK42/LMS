import { Head, Link, useForm } from '@inertiajs/react';
import { MessageSquare, Pin, Lock } from 'lucide-react';
import { useState } from 'react';
import Layout from '../components/Layout';
interface Thread {
  threadId: number;
  threadTitle: string;
  threadContent: string;
  isPinned: boolean;
  isClosed: boolean;
  replyCount: number;
  user: {
    userName: string;
  };
  createdAt: string;
}
interface DiscussionProps {
  threads: Thread[];
  courseId: number;
  user: any;
}
export default function Discussion({ threads, courseId, user }: DiscussionProps) {
  const [showNewThread, setShowNewThread] = useState(false);
  const { data, setData, post, processing, reset } = useForm({
    threadTitle: '',
    threadContent: '',
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(`/api/courses/${courseId}/discussions`, {
      onSuccess: () => {
        reset();
        setShowNewThread(false);
      },
    });
  };
  return (
    <Layout user={user}>
      <Head title="Discussion Forum" />
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Course Discussion
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Ask Questions And Discuss With Fellow Learners
            </p>
          </div>
          <button
            onClick={() => setShowNewThread(!showNewThread)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-lg transition-all"
          >
            + New Thread
          </button>
        </div>
        {showNewThread && (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-6 border border-slate-200 dark:border-slate-700">
            <input
              type="text"
              value={data.threadTitle}
              onChange={(e) => setData('threadTitle', e.target.value)}
              placeholder="Thread Title"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 mb-4"
              required
            />
            <textarea
              value={data.threadContent}
              onChange={(e) => setData('threadContent', e.target.value)}
              placeholder="What's Your Question Or Topic?"
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 mb-4"
              required
            />
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={processing}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Post Thread
              </button>
              <button
                type="button"
                onClick={() => setShowNewThread(false)}
                className="px-6 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        <div className="space-y-4">
          {threads.map((thread) => (
            <Link
              key={thread.threadId}
              href={`/courses/${courseId}/discussions/${thread.threadId}`}
              className="block bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                  {thread.user.userName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {thread.threadTitle}
                    </h3>
                    {thread.isPinned && (
                      <Pin className="w-5 h-5 text-yellow-600 fill-yellow-600" />
                    )}
                    {thread.isClosed && (
                      <Lock className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                    {thread.threadContent}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <span>By {thread.user.userName}</span>
                    <span>•</span>
                    <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      {thread.replyCount} Replies
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {threads.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <MessageSquare className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                No Discussions Yet
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Be The First To Start A Discussion!
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}