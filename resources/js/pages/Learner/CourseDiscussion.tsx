import { MessageSquare, Send, ChevronLeft, User } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import useTranslation from '../../hooks/useTranslation';
interface Discussion {
  discussionId: number;
  userId: number;
  user: {
    userId: number;
    userName: string;
  };
  title?: string;
  content: string;
  createdAt: string;
  isInstructorReply: boolean;
  replies?: Discussion[];
}
interface CourseDiscussionProps {
  courseId: number;
  courseTitle: string;
  user: any;
}
export default function CourseDiscussion({ courseId, courseTitle, user }: CourseDiscussionProps) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [expandedDiscussions, setExpandedDiscussions] = useState<{ [key: number]: boolean }>({});
  useEffect(() => {
    fetchDiscussions();
  }, [courseId]);
  const fetchDiscussions = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}/discussions`);
      const data = await response.json();
      setDiscussions(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const toggleReplies = (discussionId: number) => {
    setExpandedDiscussions(prev => ({
      ...prev,
      [discussionId]: !prev[discussionId]
    }));
  };
  const handlePostDiscussion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/courses/${courseId}/discussions`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({ title: newTitle, content: newContent })
      });
      if (response.ok) {
        const newDiscussion = await response.json();
        setDiscussions([newDiscussion, ...discussions]);
        setNewTitle('');
        setNewContent('');
        showToast(t('discussionPosted'), 'success');
      }
    } catch (error) {
      showToast(t('errorPostingDiscussion'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleReply = async (parentId: number) => {
    if (!replyContent.trim()) return;
    setReplySubmitting(true);
    try {
      const response = await fetch(`/api/discussions/${parentId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        },
        body: JSON.stringify({ content: replyContent })
      });
      if (response.ok) {
        await fetchDiscussions();
        showToast(t('replyPosted'), 'success');
        setReplyContent('');
        setReplyingTo(null);
        if (!expandedDiscussions[parentId]) {
          toggleReplies(parentId);
        }
      }
    } catch (error) {
      showToast(t('errorPostingReply'), 'error');
    } finally {
      setReplySubmitting(false);
    }
  };
  return (
    <Layout user={user}>
      <Head title={`${t('courseDiscussions')} - ${courseTitle}`} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-4 mb-8">
          <Link href={`/courses/${courseId}`} className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-zinc-800 transition-colors text-green-950 dark:text-white">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-serif text-green-950 dark:text-white">{t('courseDiscussions')}</h1>
            <p className="text-zinc-600 dark:text-zinc-400">{courseTitle}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-zinc-900 rounded p-8 border border-green-950 dark:border-white">
              <form onSubmit={handlePostDiscussion} className="mb-10 bg-zinc-50 dark:bg-black p-6 rounded border border-zinc-200 dark:border-zinc-800">
                <h3 className="text-lg text-green-950 dark:text-white mb-4">{t('askAQuestion')}</h3>
                <div className="space-y-4">
                  <div>
                    <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder={t('discussionTitlePlaceholder')} className="w-full px-4 py-3 rounded border border-green-950 dark:border-white bg-white dark:bg-zinc-900 text-green-950 dark:text-white focus:ring-1 focus:ring-green-950 dark:focus:ring-white focus:outline-none text-sm font-medium" />
                  </div>
                  <div>
                    <textarea value={newContent} onChange={(e) => setNewContent(e.target.value)} placeholder={t('discussionContentPlaceholder')} className="w-full px-4 py-3 rounded border border-green-950 dark:border-white bg-white dark:bg-zinc-900 text-green-950 dark:text-white focus:ring-1 focus:ring-green-950 dark:focus:ring-white focus:outline-none resize-none h-32 text-sm" />
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" disabled={isSubmitting || !newTitle.trim() || !newContent.trim()} className="px-6 py-2.5 bg-green-950 dark:bg-white text-white dark:text-green-950 rounded hover:bg-white hover:text-green-950 hover:border-green-950 dark:hover:bg-green-950 dark:hover:text-white dark:hover:border-green-950 border border-transparent transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer">
                      <Send className="w-4 h-4" />
                      {isSubmitting ? t('posting') : t('postDiscussion')}
                    </button>
                  </div>
                </div>
              </form>
              <div className="space-y-8">
                {loading ? (
                  <div className="text-center py-8 text-zinc-500">{t('loading')}</div>
                ) : discussions.length === 0 ? (
                  <div className="text-center py-8 text-zinc-500">{t('noDiscussionsYet')}</div>
                ) : (
                  discussions.map(discussion => (
                    <div key={discussion.discussionId} className="border-b border-zinc-100 dark:border-zinc-800 pb-8 last:border-0 last:pb-0">
                      <div className="bg-zinc-50 dark:bg-zinc-900 rounded p-4 border border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${discussion.isInstructorReply ? 'bg-green-950 text-white' : 'bg-zinc-200 text-zinc-500'}`}>
                            <User className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-green-950 dark:text-white truncate">
                                {discussion.user.userName}
                              </span>
                              {discussion.isInstructorReply && (
                                <span className="px-2 py-0.5 bg-green-950 text-white text-xs rounded-full font-medium">
                                  {t('instructor')}
                                </span>
                              )}
                              <span className="text-xs text-zinc-500">
                                {new Date(discussion.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <h3 className="text-lg text-green-950 dark:text-white mb-2">{discussion.title}</h3>
                            <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap text-sm">
                              {discussion.content}
                            </p>
                            <div className="mt-3 flex items-center gap-4">
                              <button onClick={() => {
                                setReplyingTo(replyingTo === discussion.discussionId ? null : discussion.discussionId);
                                setReplyContent('');
                              }} className="flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-green-950 dark:hover:text-white transition-colors cursor-pointer">
                                <MessageSquare className="w-4 h-4" />
                                {t('reply')}
                              </button>
                              {discussion.replies && discussion.replies.length > 0 && (
                                <button onClick={() => toggleReplies(discussion.discussionId)} className="text-sm font-medium text-zinc-500 hover:text-green-950 dark:hover:text-white transition-colors cursor-pointer">
                                  {expandedDiscussions[discussion.discussionId] ? t('hideReplies') : `${t('viewReplies')} (${discussion.replies.length})`}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                        {replyingTo === discussion.discussionId && (
                          <div className="mt-4 pl-11">
                            <div className="space-y-3">
                              <textarea value={replyContent} onChange={(e) => setReplyContent(e.target.value)} placeholder={t('writeReply')} className="w-full px-4 py-3 rounded border border-green-950 dark:border-white bg-white dark:bg-zinc-900 text-green-950 dark:text-white focus:ring-1 focus:ring-green-950 dark:focus:ring-white focus:outline-none resize-none h-24 text-sm" />
                              <div className="flex justify-end gap-2">
                                <button onClick={() => setReplyingTo(null)} className="px-3 py-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer">
                                  {t('cancel')}
                                </button>
                                <button onClick={() => handleReply(discussion.discussionId)} disabled={replySubmitting || !replyContent.trim()} className="px-3 py-1.5 text-sm font-medium bg-green-950 dark:bg-white text-white dark:text-green-950 rounded hover:bg-white hover:text-green-950 hover:border-green-950 dark:hover:bg-green-950 dark:hover:text-white dark:hover:border-green-950 border border-transparent transition-colors disabled:opacity-50 cursor-pointer">
                                  {replySubmitting ? t('sending') : t('postReply')}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      {discussion.replies && discussion.replies.length > 0 && expandedDiscussions[discussion.discussionId] && (
                        <div className="space-y-4 mt-4 ml-4 md:ml-8 border-l-2 border-zinc-100 dark:border-zinc-800 pl-4">
                          {discussion.replies.map(reply => (
                            <div key={reply.discussionId} className="bg-zinc-50 dark:bg-zinc-900 rounded p-4 border border-zinc-200 dark:border-zinc-800">
                              <div className="flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${reply.isInstructorReply ? 'bg-green-950 text-white' : 'bg-zinc-200 text-zinc-500'}`}>
                                  <User className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-green-950 dark:text-white truncate">
                                      {reply.user.userName}
                                    </span>
                                    {reply.isInstructorReply && (
                                      <span className="px-2 py-0.5 bg-green-950 text-white text-xs rounded-full font-medium">
                                        {t('instructor')}
                                      </span>
                                    )}
                                    <span className="text-xs text-zinc-500">
                                      {new Date(reply.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap text-sm">
                                    {reply.content}
                                  </p>
                                  <div className="mt-3 flex items-center gap-4">
                                    <button onClick={() => {
                                      setReplyingTo(replyingTo === reply.discussionId ? null : reply.discussionId);
                                      setReplyContent('');
                                    }} className="flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-green-950 dark:hover:text-white transition-colors cursor-pointer">
                                      <MessageSquare className="w-4 h-4" />
                                      {t('reply')}
                                    </button>
                                  </div>
                                  {replyingTo === reply.discussionId && (
                                    <div className="mt-4">
                                      <div className="space-y-3">
                                        <textarea value={replyContent} onChange={(e) => setReplyContent(e.target.value)} placeholder={t('writeReply')} className="w-full px-4 py-3 rounded border border-green-950 dark:border-white bg-white dark:bg-zinc-900 text-green-950 dark:text-white focus:ring-1 focus:ring-green-950 dark:focus:ring-white focus:outline-none resize-none h-24 text-sm" />
                                        <div className="flex justify-end gap-2">
                                          <button onClick={() => setReplyingTo(null)} className="px-3 py-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer">
                                            {t('cancel')}
                                          </button>
                                          <button onClick={() => handleReply(discussion.discussionId)} disabled={replySubmitting || !replyContent.trim()} className="px-3 py-1.5 text-sm font-medium bg-green-950 dark:bg-white text-white dark:text-green-950 rounded hover:bg-white hover:text-green-950 hover:border-green-950 dark:hover:bg-green-950 dark:hover:text-white dark:hover:border-green-950 border border-transparent transition-colors disabled:opacity-50 cursor-pointer">
                                            {replySubmitting ? t('sending') : t('postReply')}
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-zinc-50 dark:bg-zinc-900 rounded p-6 border border-green-950 dark:border-white">
              <h3 className="text-green-950 dark:text-white mb-2">{t('communityGuidelines')}</h3>
              <ul className="text-sm text-zinc-700 dark:text-zinc-300 space-y-2 list-disc list-inside">
                <li>{t('beRespectful')}</li>
                <li>{t('stayOnTopic')}</li>
                <li>{t('noSpam')}</li>
                <li>{t('helpOthers')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}