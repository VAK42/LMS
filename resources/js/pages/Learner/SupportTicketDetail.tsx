import { ArrowLeft, Clock, Send, User } from 'lucide-react';
import { Head, useForm, Link } from '@inertiajs/react';
import Layout from '../../components/Layout';
import useTranslation from '../../hooks/useTranslation';
interface Reply {
  replyId: number;
  message: string;
  isStaffReply: boolean;
  createdAt: string;
  user: {
    name: string;
  };
}
interface Ticket {
  ticketId: number;
  subject: string;
  message: string;
  status: string;
  priority: string;
  createdAt: string;
  replies: Reply[];
}
interface Props {
  ticket: Ticket;
  user: any;
}
export default function SupportTicketDetail({ ticket, user }: Props) {
  const { t } = useTranslation();
  const { data, setData, post, processing, reset } = useForm({
    message: '',
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(`/api/supportTickets/${ticket.ticketId}/reply`, {
      onSuccess: () => reset(),
    });
  };
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'open': return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300';
      case 'inProgress': return 'bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200';
      case 'resolved': return 'bg-black dark:bg-white text-white dark:text-black';
      case 'closed': return 'bg-zinc-300 dark:bg-zinc-600 text-zinc-600 dark:text-zinc-300';
      default: return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400';
    }
  };
  return (
    <Layout user={user}>
      <Head title={ticket.subject} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/supportTickets"
          className="inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('backToTickets')}
        </Link>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-serif font-bold text-black dark:text-white mb-2">{ticket.subject}</h1>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                  <Clock className="w-4 h-4" />
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </span>
                <span className={`px-3 py-1 text-xs font-medium ${getStatusStyle(ticket.status)}`}>
                  {t(ticket.status)}
                </span>
              </div>
            </div>
          </div>
          <div className="border-t border-zinc-200 dark:border-zinc-700 pt-6">
            <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">{ticket.message}</p>
          </div>
        </div>
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-serif font-bold text-black dark:text-white">{t('repliesHeader', { count: ticket.replies?.length || 0 })}</h2>
          {ticket.replies && ticket.replies.length > 0 ? (
            ticket.replies.map((reply) => (
              <div
                key={reply.replyId}
                className={`p-6 border ${reply.isStaffReply ? 'bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-zinc-500" />
                  <span className="font-medium text-black dark:text-white">
                    {reply.isStaffReply ? t('supportStaff') : reply.user?.name || t('you')}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {new Date(reply.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">{reply.message}</p>
              </div>
            ))
          ) : (
            <p className="text-zinc-500 dark:text-zinc-400">{t('noRepliesYet')}</p>
          )}
        </div>
        {ticket.status !== 'closed' && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6">
            <h3 className="text-lg font-serif font-bold text-black dark:text-white mb-4">{t('addReply')}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                value={data.message}
                onChange={(e) => setData('message', e.target.value)}
                rows={4}
                placeholder={t('typeYourMessage')}
                className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white resize-none"
                required
              />
              <button
                type="submit"
                disabled={processing}
                className="flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {t('sendReply')}
              </button>
            </form>
          </div>
        )}
      </div>
    </Layout>
  )
}